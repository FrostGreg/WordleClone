var active = true;
var currentNumber = 0;

function getWord(startNumber){
    var word = "";
    for (let i = 0; i < 5; i++){
        word += document.querySelector(`#letter-${parseInt(startNumber)+i}`).textContent;
    }

    return word;
}

function isLetter(letter) {
    return /^[a-zA-Z]$/.test(letter);
}

window.addEventListener('keydown', (event) => {
    if (active && isLetter(event.key)){
        document.querySelector(`#letter-${parseInt(currentNumber)}`).textContent = event.key;
        
        (currentNumber + 1) % 5 === 0 ? currentNumber : currentNumber++;

    }
    else if (event.key === 'Backspace' && currentNumber % 5 !== 0){ 
        if (document.querySelector(`#letter-${parseInt(currentNumber)}`).textContent === ''){
            currentNumber--;
        }
            document.querySelector(`#letter-${parseInt(currentNumber)}`).textContent = '';

    } else if (event.key === 'Enter' && (currentNumber+1) % 5 === 0){
        currentNumber >= 29 ? currentNumber : currentNumber++;
    }
    console.log(currentNumber);

});