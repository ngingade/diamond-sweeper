(function () {
    var numberCells = 64;
    var numberOfCellsLeft = numberCells;
    var box = document.querySelector('.box');
    var randomNumbers = [];
    var scoreDiv = document.querySelector('.score-value');
    scoreDiv.innerHTML = numberOfCellsLeft;
    generateRandomNumbers();
    randomNumbers = randomNumbers.sort(function (a, b) { return a - b });
    console.log(randomNumbers);
    createCells();
    var undoButton = document.getElementById('undoChanges');
    undoButton.addEventListener('click', _revertChanges)
    var prevSelected = [];
    var hintEle = document.getElementById('getHint');
    hintEle.addEventListener('click', _getNearestDiamondHint);
    var allDiamondElets = document.querySelectorAll('.diamond-image');
    allDiamondElets = Array.prototype.slice.call(allDiamondElets);
    var allDiamondEletsTemp = allDiamondElets;
    var foundDiamond = [];
    var arrowClassAdded;
    var numberOfDimondsFound = 0;
    var diamondScoreEle = document.querySelector('#diamondScore');
    diamondScoreEle.innerHTML = numberOfDimondsFound;


    function generateRandomNumbers() {
        for (var i = 0; i < 8; i++) {
            var val = Math.floor((Math.random() * numberCells) + 1)
            if (randomNumbers.indexOf(val) === -1) {
                randomNumbers[i] = val;
            }
            else {
                i = --i;
            }
        }
    }

    function createCells() {
        for (var i = 1; i <= numberCells; i++) {
            var cell = document.createElement('div');
            cell.classList.add('cell');
            cell.classList.add('question-image');
            cell.addEventListener('click', _checkDiamond);
            box.appendChild(cell);
            for (var j = 0; j < 8; j++) {
                if (i === randomNumbers[j]) {
                    cell.classList.add('diamond-image');
                }
            }
        }
    }

    function _checkDiamond(e) {
        if (numberOfDimondsFound === 8) {
            alert('Found all Diamonds your score is: ' + numberOfCellsLeft);
        }
        else {
            if (arrowClassAdded) {
                prevSelected[prevSelected.length - 1].target.classList.remove(arrowClassAdded);
                arrowClassAdded = '';
            }
            if (e.currentTarget.classList.contains('question-image')) {
                if (!e.currentTarget.classList.contains('diamond-image')) {
                    numberOfCellsLeft = numberOfCellsLeft - 1;
                    scoreDiv.innerHTML = numberOfCellsLeft;
                }
                else {
                    for (var i = 0; i < allDiamondElets.length; i++) {
                        if (allDiamondElets[i] === e.currentTarget && !allDiamondElets[i].isFound) {
                            allDiamondElets[i].isFound = true;
                            foundDiamond[foundDiamond.length] = allDiamondElets[i];
                            numberOfDimondsFound = numberOfDimondsFound + 1;
                            diamondScoreEle.innerHTML = numberOfDimondsFound;
                        }
                    }
                }
                for (var i = 0; i < allDiamondElets.length; i++) {
                    if (allDiamondElets[i].isFound) {
                        allDiamondEletsTemp.splice(i, 1);
                    }
                }
                prevSelected.push(e);
                e.currentTarget.classList.remove('question-image');

                console.log('numberOfCellsLeft ' + numberOfCellsLeft);
                console.log(e.currentTarget.getBoundingClientRect());
            }
        }
    }

    function _revertChanges() {
        if (prevSelected.length > 0) {
            if (arrowClassAdded) {
                prevSelected[prevSelected.length - 1].target.classList.remove(arrowClassAdded);
                arrowClassAdded = '';
            }
            var undoDiv = prevSelected[prevSelected.length - 1];
            undoDiv.target.classList.add("question-image");
            if (!undoDiv.target.classList.contains('diamond-image')) {
                numberOfCellsLeft = numberOfCellsLeft + 1;
                scoreDiv.innerHTML = numberOfCellsLeft;
            }
            if (foundDiamond.length > 0 && undoDiv.target.isFound) {
                foundDiamond[foundDiamond.length - 1].isFound = false;
                allDiamondEletsTemp[allDiamondEletsTemp.length] = foundDiamond[foundDiamond.length - 1];
                foundDiamond.pop(foundDiamond.length);
                numberOfDimondsFound = numberOfDimondsFound - 1;
                diamondScoreEle.innerHTML = numberOfDimondsFound;
            }

            prevSelected.pop(prevSelected.length);
        }
    }

    function _getNearestDiamondHint(e) {
        if (prevSelected.length > 0) {
            var allDiamondEletsPos = [];
            for (var i = 0; i < allDiamondEletsTemp.length; i++) {
                allDiamondEletsPos[i] = allDiamondEletsTemp[i].getBoundingClientRect();
            }
            var nearestEleList = [];
            var ele = prevSelected[prevSelected.length - 1].target.getBoundingClientRect();
            for (var i = 0; i < allDiamondEletsTemp.length; i++) {
                var distance = Math.hypot(allDiamondEletsPos[i].x - parseInt(ele.x), allDiamondEletsPos[i].y - parseInt(ele.y));
                nearestEleList[i] = { 'distance': distance, 'ele': allDiamondEletsTemp[i] }
            }
            var nearestVal = Math.min.apply(Math, nearestEleList.map(function (o) { return o.distance }));
            var nearestEleIndex = nearestEleList.findIndex(function (o) { return o.distance === nearestVal });
            var nearestEle = nearestEleList[nearestEleIndex];
            console.log(nearestEle);

            showArrowDirection(nearestEle);
        }
    }

    function showArrowDirection(cell) {
        if (cell) {
            var position = cell.ele.getBoundingClientRect();
            var prevSelectedEle = prevSelected[prevSelected.length - 1];
            var selectedX = prevSelected[prevSelected.length - 1].target.getBoundingClientRect().x;
            var selectedY = prevSelected[prevSelected.length - 1].target.getBoundingClientRect().y;
            var arrowX = position.x - selectedX;
            var arrowY = position.y - selectedY;
            console.log('Position x' + arrowX);
            console.log('Position y' + arrowY);
            if (arrowY === 0 && arrowX > 0) {
                prevSelectedEle.target.classList.add('arrow-right');
                arrowClassAdded = 'arrow-right';
                console.log('arrow-right');
            }
            else if (arrowX === 0 && arrowY > 0) {
                prevSelectedEle.target.classList.add('arrow-bottom');
                arrowClassAdded = 'arrow-bottom';
                console.log('arrow-bottom');
            }
            else if (arrowX > 0 && arrowY > 0) {
                prevSelectedEle.target.classList.add('arrow-bottom-right');
                arrowClassAdded = 'arrow-bottom-right';
                console.log('arrow-bottom-right');
            }
            else if (arrowX < 0 && arrowY > 0) {
                prevSelectedEle.target.classList.add('arrow-bottom-left');
                arrowClassAdded = 'arrow-bottom-left';
                console.log('arrow-bottom-left');
            }
            else if (arrowX === 0 && arrowY < 0) {
                prevSelectedEle.target.classList.add('arrow-top');
                arrowClassAdded = 'arrow-top';
                console.log('arrow-top');
            }
            else if (arrowX > 0 && arrowY < 0) {
                prevSelectedEle.target.classList.add('arrow-top-right');
                arrowClassAdded = 'arrow-top-right';
                console.log('arrow-top-right');
            }
            else if (arrowX < 0 && arrowY < 0) {
                prevSelectedEle.target.classList.add('arrow-top-left');
                arrowClassAdded = 'arrow-top-left';
                console.log('arrow-top-left');
            }
            else if (arrowX < 0 && arrowY === 0) {
                prevSelectedEle.target.classList.add('arrow-left');
                arrowClassAdded = 'arrow-left';
                console.log('arrow-left');
            }
        }
        else {
            alert('Found all Diamonds your score is: ' + numberOfCellsLeft);
        }
    }
})()