var active = true;
var currentNumber = 0;

const answer = fetch('https://words.dev-apis.com/word-of-the-day').then((resp) => (resp.json()));

function getWord(startNumber){
    var word = "";
    for (let i = 0; i < 5; i++){
        word += document.querySelector(`#letter-${parseInt(startNumber)+i}`).textContent;
    }

    return word;
}

function incorrectGuessAnimation(startNumber){
    for (let i = 0; i < 5; i++){
        const element = document.querySelector(`#letter-${parseInt(startNumber)+i}`);
        element.animate([{borderColor: '#f00', easing: 'ease-out'}, {borderColor: '#d3d3d3'}],
                         2000);
    }
}

function isLetter(letter) {
    return /^[a-zA-Z]$/.test(letter);
}

window.addEventListener('keydown', async (event) => {
    if (!active){
        return;
    }
    if (active && isLetter(event.key)){
        document.querySelector(`#letter-${parseInt(currentNumber)}`).textContent = event.key;
        
        (currentNumber + 1) % 5 === 0 ? currentNumber : currentNumber++;

    }
    else if (event.key === 'Backspace' && currentNumber % 5 !== 0){ 
        if (document.querySelector(`#letter-${parseInt(currentNumber)}`).textContent === ''){
            currentNumber--;
        }
            document.querySelector(`#letter-${parseInt(currentNumber)}`).textContent = '';

    } else if (event.key === 'Enter' && (currentNumber+1) % 5 === 0 && document.querySelector(`#letter-${parseInt(currentNumber)}`).textContent !== ''){

        const wordCheckPromise = await fetch('https://words.dev-apis.com/validate-word', {method: 'POST', body: JSON.stringify({"word": getWord(currentNumber-4)})});
        const wordCheckObject = await wordCheckPromise.json();
        
        if (!wordCheckObject.validWord){
            incorrectGuessAnimation(currentNumber-4);
            return;
        }

        answer.then((resp) => {
            if (getWord(currentNumber-5) === resp.word){
                active = false;
                alert('congrats you win');
            }
        })
            
        currentNumber++;
        
        if (currentNumber >= 29) {
            active = false;
            answer.then((resp) => {
                alert(`Wrong, it was ${resp.word}`);
            })
        }
    }
});