(function() {
    var numberCells = 64;
    var box = document.querySelector('.box');
    var randomNumbers = [];
    for(var i=0; i<8; i++) {
        var val = Math.floor((Math.random() * numberCells) + 1)
        if(randomNumbers.indexOf(val) === -1){
            randomNumbers[i] = val;
        }
        else {
            i = --i;
        }
    }
    randomNumbers = randomNumbers.sort(function(a,b) {return a-b});
    console.log(randomNumbers);

    for(var i=1; i<=numberCells; i++) {
        var cell = document.createElement('div');
        cell.classList.add('cell');
        cell.classList.add('question-image');
        cell.addEventListener('click', _checkDiamond);
        box.appendChild(cell);
        for(var j=0; j<8; j++) {
            if(i===randomNumbers[j]) {
                cell.classList.add('diamond-image');
            }
        }
    }
    function _checkDiamond(e) {
        console.log(e);
    }
})()