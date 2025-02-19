const subtitle = document.getElementsByClassName("subtitle")[0];

const createWord  = (text, index) => {
    const word = document.createElement("span");

    word.innerHTML = `${text} `;
    word.style.transitionDelay = `${index*40}ms`;
    word.classList.add('card-subtitle-word');
    return word;
}

const addWord = (text, index) => subtitle.appendChild(createWord(text, index))

const createSubtitle  =  text => text.split(" ").map(addWord);

createSubtitle("But in much real sense, i have no idea what I am doing")