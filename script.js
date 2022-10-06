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
        element.animate([{borderColor: '#f00', easing: 'ease-out', transform: 'rotate(0deg)'},
                         {transform: 'rotate(3deg) scale(1.05)'},
                         {transform: 'rotate(-3deg)'}, 
                         {transform: 'rotate(3deg)'},
                         {transform: 'rotate(-3deg)'}, 
                         {transform: 'rotate(3deg)'},
                         {transform: 'rotate(-3deg)'}, 
                         {transform: 'rotate(3deg)'},
                         {transform: 'rotate(-3deg)'}, 
                         {transform: 'rotate(3deg)'},
                         {transform: 'rotate(-3deg)'}, 
                         {borderColor: '#d3d3d3', transform: 'rotate(0deg)'}],
                         2000);
    }
}

function checkLetter(letterElement, index){
    answer.then((resp) => {
        if (resp.word.at(index) === letterElement.textContent) {
            letterElement.classList.add('correct');
        }
        else if (resp.word.includes(letterElement.textContent)){
            letterElement.classList.add('misplaced');
        }
    });
}

function styleUsedRow(startNumber){
    for (let i = 0; i < 5; i++){
        const element = document.querySelector(`#letter-${parseInt(startNumber)+i}`);
        

        const animation = element.animate([{transform: 'rotateY(0deg)'},
                         {transform: 'rotateY(90deg)'}],
                         1000);

        animation.onfinish = function() {
            element.classList.add('used');
            checkLetter(element, i);
            element.animate([{transform: 'rotateY(90deg)'}, {transform: 'rotateY(0deg)'}], 1000);
        }
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
        const element = document.querySelector(`#letter-${parseInt(currentNumber)}`);

        element.animate([{transform: 'scale(1.1)'}, {transform: 'scale(1)'}], 100);
        element.textContent = event.key;
        
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
            }
        })
            
        styleUsedRow(currentNumber-4);
        currentNumber++;
        
        if (currentNumber >= 29) {
            active = false;
            answer.then((resp) => {
                alert(`Wrong, it was ${resp.word}`);
            })
        }
    }
});