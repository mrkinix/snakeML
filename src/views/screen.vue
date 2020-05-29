<template>
<div>
    <div class="screen"> 
        <div v-for="x in n" :key="x">
            <div v-if="position.includes(x)" class="test"></div>
            <div v-else-if="x == apple" class="apple"></div>
            <div v-else class="test1"></div>
        </div>
    </div>
    <div class="game_over" v-if="gameover">Game Over! <br/> your score is {{score}}</div>
    <div class="play_again" @click="reset" v-if="gameover">play again</div>
    <div class="score">Score: {{score}} -- High score: {{high_score}}</div>
</div>    
</template>

<script>
import {move} from "./learning"
import Api from "@/server/service"
export default {
    data(){
        return{
            n: 400,
            position: [70, 71, 72, 73, 93],
            move: 1,
            apple: 76,
            score: 0,
            gameover: false,
            high_score: 0,
            weight: [],
            domain: []
        }
    },
    methods: {
        hasDuplicates: function (array) {
            return (new Set(array)).size !== array.length;
        },
        gen_domain: function () {
            var list = [[],[],[],[]];
            for (var i = 1; i <= 20; i++) { 
                list[0].push(i);
            }
            for (var i = 1; i <= 20; i++) {
                list[1].push(20 + 20 * (i - 1));
            }
            for (var i = 1; i <= 20; i++) {
                list[2].push(1 + 20 * (i - 1));
            }
            for (var i = 1; i <= 20; i++) {
                list[3].push(380 + i);
            }
            this.domain =  list
        },
        generate_weights: function() {
            for (let i=0; i<8; i++) {
                this.weight.push(2 * Math.random() - 1)
            }
        },
        AI: function() {
            const head_pos = this.position[this.position.length - 1]
            var dist_h_w = 0
            var dist_h_a = Math.abs(head_pos - this.apple)
            var dist_h_b = 0
            var dist_h_l = 0
            var dist_h_r = 0
            const dir = [-20, 1, -1, 20]
            const domain = this.domain[dir.indexOf(this.move)]
            var forbidden = domain
            var temp_head = head_pos
            var temp_left = head_pos
            var temp_right = head_pos
            var temp_dir = dir
            var check = true
            for (let i=0; i < this.position; i++) {
                if (this.position[i] != this.position[this.position.length - 1]) { 
                    forbidden.push(this.position[i])
                }
            }
            for( let i = 0; i < temp_dir.length; i++){ 
                if ( temp_dir[i] == move || temp_dir[i] == -move) {
                   arr.splice(i, 1); 
                }
            }           
            for (let i =0; i<20; i++) {
                temp_head += i * this.move
                temp_left += i * temp_dir[0]
                temp_right -= i * temp_dir[0]
                if (domain.includes(temp_head)) {
                    dist_h_w = Math.abs(head_pos - temp_head)
                }
                if (check && this.position.slice(0,-1).includes(temp_head)) {
                    dist_h_b = temp_head
                    check = false
                }
                else if (i == 19) {
                    dist_h_b =  Math.abs(head_pos - this.position[Math.round(this.position.length / 2)])
                }
                if (forbidden.includes(temp_left)) {
                    dist_h_l = Math.abs(head_pos - temp_left)
                }
                if (forbidden.includes(temp_right)) {
                    dist_h_r = Math.abs(head_pos - temp_right)
                }
            }
            var input = [dist_h_w/100, dist_h_a/100, dist_h_b/100, dist_h_l/100, dist_h_r/100, this.position[this.position.length - 1]/100, this.apple/100, this.position.slice(0, -1), this.move/100]
            var input2 = [dist_h_w/10000, dist_h_a/10000, dist_h_b/10000, dist_h_l/10000, dist_h_r/10000, this.position[this.position.length - 1]/10000, this.apple/10000, this.move/10000]
            console.log(input)
            const AI_output = move(this.weight, input2, input, this.domain)
            this.move = AI_output[0]
            this.weight = AI_output[1]
        },
        reset: function() {
            this.n = 400
            this.position = [70, 71, 72, 73, 93]
            this.move = 1
            this.apple = 76
            this.score = 0
            this.gameover = false
        },
        async getmove() {
            const responce = await Api.test()
            return responce
        }
    },
    beforeMount() {
        this.generate_weights()
    },
    mounted() {
        setInterval(() => {
            if (this.gameover == false) {
                this.gen_domain()
                this.getmove().then((x) =>{
                    console.log(x.data)
                    this.move = x.data
                })
                // this.AI()
                let domain = this.domain
                let moves = [-20, 1, -1, 20]
                for(let i=0; i<4; i++) {
                    if(domain[i].includes(this.position[this.position.length - 1]) && moves[i] == this.move) {
                        this.gameover = true
                        this.high_score = Math.max(this.high_score, this.score)
                    }
                } 
                for (let i= 0; i < this.position.length; i++) {
                    if (i != this.position.length - 1) {
                        this.position[i] = this.position[i + 1]
                    }
                    else if (i == this.position.length - 1) {
                        this.position[i] += this.move
                    }
                }
                if(this.hasDuplicates(this.position)){
                    this.gameover = true
                    this.high_score = Math.max(this.high_score, this.score)
                }
                if (this.position.includes(this.apple)){
                    this.apple = Math.floor((Math.random() * 400) + 1);
                    this.score += 1
                    this.position.unshift(2 * this.position[0] - this.position[0])
                }
                this.$forceUpdate(); 
            }
            else {
                this.reset()
            }
        },30);
    window.addEventListener('keyup', (ev) => {
        switch(ev.code) {
            case 'ArrowRight':
                if(this.position[this.position.length - 1] + 1 != this.position[this.position.length - 2]){
                    this.move = 1
                }
                break
            case 'ArrowLeft':
                if(this.position[this.position.length - 1] - 1 != this.position[this.position.length - 2]){
                    this.move = -1
                }
                break
            case 'ArrowDown':
                if(this.position[this.position.length - 1] + 20 != this.position[this.position.length - 2]){
                    this.move = 20
                }
                break
            case 'ArrowUp':
                if(this.position[this.position.length - 1] - 20 != this.position[this.position.length - 2]){
                    this.move = -20
                }
                break
        }
    });
    }
}
</script>

<style scoped>

.screen{
    display: flex;
    flex-wrap: wrap;
    position: fixed;
    height: 500px;
    width: 500px;
    top: calc(50% - 250px);
    left: calc(50% - 250px);
    background: black;
    outline: solid 1px white;
}
.test{
    height: 25px;
    width: 25px;
    background: linear-gradient(to bottom, rgb(42, 71, 82), rgb(56, 230, 120));
    border-radius: 7px;
}
.test1{
    height: 25px;
    width: 25px;
    background: black;
}
.apple{
    height: 25px;
    width: 25px;
    background: linear-gradient(to top, red, rgb(126, 0, 0));
    border-radius: 50%;
}
.score{
    position: fixed;
    height: 30px;
    line-height: 30px;
    color: white;
    width: 502px;
    top: calc(50% + 250px);
    left: calc(50% - 251px);
    background: grey;
}
.game_over{
    position: fixed;
    height: 100px;
    line-height: 50px;
    width: 300px;
    z-index: 999999999;
    font-size: 32px;
    color: white;
    top: calc(50% - 50px);
    left: calc(50% - 150px);
}
.play_again{
    position: fixed;
    top: calc(50% + 60px);
    left: calc(50% - 40px);
    width: 80px;
    height: 38px;
    z-index: 999999999;
    background: grey;
    color: black;
    line-height: 38px;
    border-radius: 6px;
    cursor: pointer;
}
.play_again:hover{
    background: rgb(179, 179, 179);
}
</style>