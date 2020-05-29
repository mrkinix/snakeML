const math = require('mathjs')

// learning samples
const possible_moves = (domain, head, body) => {
    // Check what moves are possible
    const moves = [1, -1, 20, -20]
    var forbidden = []
    var possibleMoves = []
    for (let i of body) {
        forbidden.push(parseInt(i))
    }
    for (let i of domain) {
        for (let j of i) {
            forbidden.push(parseInt(j))
        }
    }
    for (let i of moves) {
        if (!forbidden.includes(head*100 + i)) {
            possibleMoves.push(i)
        }
    }
    return possibleMoves
}

const best_move = (env, pos, apple, dom) => {
    // best move of possible ones that make me closer to apple
    const possible_move = possible_moves(dom, env[5], env[7])
    var dest = []
    for (let i of possible_move) {
        if (i in [1, -1]) {
            dest.push
        }
        else {
            dest.push(Math.abs(apple*100 - (pos*100 + i)))
        }
    }
    console.log(dest,dest.indexOf(Math.min(...dest)), possible_move, possible_move[dest.indexOf(Math.min(...dest))])
    return possible_move[dest.indexOf(Math.min(...dest))]
}

/*******env**********\
0.  dist head-wall   
1.  dist head-apple  
2.  dist head-body   
3.  dist head-left   
4.  dist head-righ   
5.  pos head         
6.  pos apple        
7.  pos body \{head} 
8.  direction        
\********************/

/***********
1   : (0.25)
-1  : (0.50)
20  : (0.75)
-20 : (1.00)
***********/
const sigmoid = (p) => {
    return (1 / (1 + Math.exp(-p)))
} 

const derivative = (output, error, t_Input) => {
    var list = 0
    for (let i=0; i<t_Input.length; i++) {
        list += t_Input[i] * (output -error)*error*(1-error)
    }
    return list
}

// machine learning
const learn = (input, env, dom, weights, output) => {
    // machine learning stuff here
    // dot
    const training_input = input
    const training_output = best_move(env, env[5], env[6], dom)
    var synaptic_weights = weights
    for (let i=0; i<100; i++) {
        output = 1 / sigmoid(dot_product(training_input, synaptic_weights))
        for (let j=0; j<synaptic_weights.length; j++) {
            synaptic_weights[j] += derivative(training_output, output, training_input)
        }
    }
    // console.log(derivative(training_output, output, training_input))
    // console.log('asbb', synaptic_weights)
    return synaptic_weights
}

const dot_product = (a, b) => {
    var temp = 0
    for (let i=0; i<a.length; i++) {
        temp += a[i] * b [i]
    }
    return temp
}

const move = (weights, input, data, dom) => {
    // calculate ml output and generate move
    const moves = [1, -1, -20, 20]
    const ML_moves = [0.25, 0.5, 0.75, 1]
    var diff = []
    const move = sigmoid(Math.abs(dot_product(weights, input)))
    for (let i=0; i < ML_moves.length; i++) {
        diff.push(Math.abs(ML_moves[i] - move))
    }
    const learning_weight = learn(input, data, dom, weights, move)
    return [moves[diff.indexOf(Math.min(...diff))], learning_weight]
}

export {move}

