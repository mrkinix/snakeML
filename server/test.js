function selectionSort(array) {
    // change code below this line
    var min = 0
    var index = 0
    for (let j=0; j<array.length; j++) { 
      min = array[j]
      index = j
      for (let i=j; i<array.length;i++) {
        if (array[i] < min) {
            min = array[i]
            index = i
        }
      }
      var x = array.indexOf(min)
      array.splice(index, 1)
      array.splice(j, 0, min)
    }
    return array;
    // change code above this line
}
  
  
selectionSort([1, 4, 2, 8, 345, 123, 43, 32, 5643, 63, 123, 43, 2, 55, 1, 234, 92]);
  