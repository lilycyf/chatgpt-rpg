const menuButton = document.querySelector("#menu");
const barInButton = document.querySelector("#barIn");
const barOutButton = document.querySelector("#barOut");
const guideBar = document.querySelector(".guide-bar")
const freezeBack = document.querySelector(".freeze-background")

const sections = document.querySelectorAll('.container');

menuButton.addEventListener('click', function () {
    guideBar.style.display = "flex";
    barInButton.style.display = "flex";
    freezeBack.style.display = "block";
});


barInButton.addEventListener('click', function () {
    guideBar.style.display = "none";
    barInButton.style.display = "none";
    freezeBack.style.display = "none";
    if (window.matchMedia("(min-width: 768px)").matches) {
        barOutButton.style.display = "flex";
        console.log("here")
        for (let i = 0; i < sections.length; i++) {
            const section = sections[i];
            section.style.setProperty('--my-margin-left', '0px');
        };
    }
});


barOutButton.addEventListener('click', function () {
    guideBar.style.display = "flex";
    barInButton.style.display = "flex";
    if (window.matchMedia("(max-width: 767px)").matches) {
        freezeBack.style.display = "block";
    }
    barOutButton.style.display = "none";
    if (window.matchMedia("(min-width: 768px)").matches) {
        for (let i = 0; i < sections.length; i++) {
            const section = sections[i];
            section.style.setProperty('--my-margin-left', '200px');
        };
    }
});

let isWaitingForResponse = false;

function setIsWaitingForResponse(value) {
    isWaitingForResponse = value;
}

function getIsWaitingForResponse() {
    return isWaitingForResponse;
}

const homePage = 'chat';

const buttonPagePairs = {};

for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    console.log(section)
    buttonPagePairs[section.id] = {
        page: section,
        button: document.querySelector(`.${section.id}-button`),
        history: document.querySelector(`.${section.id}-histories`)
    };
}

// Get the current URL
const url = window.location.href;

// Define function to set button and page as active
function setActive(pair) {
    pair.button.classList.add('active');
    pair.page.style.display = '';
    pair.history.style.display = '';
}

// Define function to set button and page as inactive
function setInactive(pair) {
    pair.button.classList.remove('active');
    pair.page.style.display = 'none';
    pair.history.style.display = 'none';
}


// Define function to set guide bar buttons as active
function setGuideBarActive(pair) {
    pair.button.classList.add('active');
    pair.history.style.display = '';
}

// Define function to set guide bar buttons as inactive
function setGuideBarInactive(pair) {
    pair.button.classList.remove('active');
    pair.history.style.display = 'none';
}

// Define function to update the page based on URL
function updatePageFromUrl(url) {
    const pageName = url.split('/').filter(Boolean).pop(); // get the last path of the URL

    // Set all pairs inactive
    Object.values(buttonPagePairs).forEach(pair => setInactive(pair));

    // set all history button inactive
    document.querySelectorAll('.chat-history').forEach((item) => {
        item.classList.remove('active')
    })

    // Set active pair based on the page name from URL
    const activePair = buttonPagePairs[pageName] || buttonPagePairs[homePage];
    setGuideBarActive(activePair);

    // set first history button active
    var history = activePair.history.children[0]
    history.classList.add('active')

    // find the matching history page and make it active
    if (history.id.length !== 0) {
        document.querySelector(`.page#${history.id}`).classList.add('active')
    }
}

// Update page on initial load from URL
updatePageFromUrl(url);

// Add event listeners for the guide bar buttons
Object.values(buttonPagePairs).forEach(pair => {
    pair.button.addEventListener('click', function () {
        // Set all this history page active, rest inactive
        const pageName = pair.button.dataset.page;
        Object.values(buttonPagePairs).forEach(pair => setGuideBarInactive(pair));
        const activePair = buttonPagePairs[pageName]
        setGuideBarActive(activePair);
    });
});

Object.values(buttonPagePairs).forEach(pair => {
    var historiesContainer = pair.history;
    var histories = historiesContainer.querySelectorAll('.chat-history');
    var page = pair.page.children;

    histories.forEach(function (history) {
        history.addEventListener('click', function () {
            var historyObj = this
            const pageName = pair.button.dataset.page;

            // Set active page based on the page name, rest in active
            Object.values(buttonPagePairs).forEach(pair => pair.page.style.display = 'none');
            const activePair = buttonPagePairs[pageName];
            activePair.page.style.display = '';

            // set this history button active, rest inactive
            document.querySelectorAll('.chat-history').forEach((item) => {
                item.classList.remove('active')
            })
            historyObj.classList.add('active')

            // const xhr = new XMLHttpRequest();
            // xhr.onreadystatechange = function () {
            //     if (xhr.readyState === 4 && xhr.status === 200) {
            //         const pageName = pair.button.dataset.page;
            //         // Update the URL
            //         window.history.replaceState({ page: pageName }, null, `/${pageName}/`);

            //         // Set active page based on the page name, rest in active
            //         Object.values(buttonPagePairs).forEach(pair => pair.page.style.display = 'none');
            //         const activePair = buttonPagePairs[pageName];
            //         activePair.page.style.display = '';

            //         // set this history button active, rest inactive
            //         document.querySelectorAll('.chat-history').forEach((item) => {
            //             item.classList.remove('active')
            //         })
            //         historyObj.classList.add('active')
            //     }
            // };

            // const pageName = pair.button.dataset.page
            // xhr.open('GET', `/${pageName}/`);
            // xhr.send();

            // // update order
            // this.parentNode.removeChild(this);
            // historiesContainer.insertBefore(this, historiesContainer.firstChild);

            for (var i = 0; i < page.length; i++) {
                var childElement = page[i];
                if (childElement.id !== `${this.id}`) {
                    childElement.style.display = 'none';
                } else {
                    childElement.style.display = '';
                }
            }
            if (window.matchMedia("(max-width: 767px)").matches) {
                guideBar.style.display = "none";
                freezeBack.style.display = "none";
                barInButton.style.display = "none";
            }
        });
    });
});


function adjustTextareaHeight(element, reference) {
    element.style.height = 'auto';
    let reference_padding = parseInt(window.getComputedStyle(reference).paddingTop) + parseInt(window.getComputedStyle(reference).paddingBottom)
    element.style.height = reference.scrollHeight - reference_padding + 'px';
}

function addMessage(message, isUser, page) {
    const lastChild = page.lastElementChild
    // // TODO: add time
    // const now = new Date();
    // const year = now.getFullYear();
    // const month = now.getMonth() + 1; // Month starts at 0, so add 1
    // const day = now.getDate();
    // const hours = now.getHours();
    // const minutes = now.getMinutes();
    // const formattedTime = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    // console.log(formattedTime);
    // const timeContent = document.createElement('p');
    // timeContent.classList.add('time');
    // timeContent.textContent = formattedTime
    // page.insertBefore(timeContent, lastChild)

    // add message
    const messageContainer = document.createElement('div');
    if (isUser) {
        messageContainer.classList.add('user-message');
        const messageContent = document.createElement('p');
        messageContent.style.whiteSpace = 'pre-wrap';
        messageContent.textContent = message;
        messageContainer.appendChild(messageContent);
    } else {
        messageContainer.classList.add('chatbot-message');
        let parts = message.split('```');
        for (let i = 0; i < parts.length; i++) {
            if (i % 2 == 0) { // Normal text
                const messageContent = document.createElement('p');
                messageContent.style.whiteSpace = 'pre-wrap';
                messageContent.textContent = parts[i];
                messageContainer.appendChild(messageContent);
            } else { // Code text
                const codeElement = document.createElement('code');
                const preElement = document.createElement('pre');
                codeElement.textContent = parts[i];
                preElement.appendChild(codeElement);

                // TODO: Get the language of the code block
                let lang = '';
                let firstLine = parts[i].trim().split('\n')[0].trim();
                lang = 'python'
                codeElement.classList.add(`language-${lang}`);
                messageContainer.appendChild(preElement);
            }
        }
    }
    page.insertBefore(messageContainer, lastChild)
    page.scrollTop = page.scrollHeight;
}

// TODO: Get the language of the code block
function getLanguage(firstLine) {
    let lang = '';
    if (firstLine.startsWith('#!')) {
        lang = firstLine.slice(2).trim();
    } else if (firstLine.startsWith('// ')) {
        lang = 'javascript';
    } else if (firstLine.startsWith('/*')) {
        lang = 'css';
    } else if (firstLine.startsWith('<?php')) {
        lang = 'php';
    } else if (firstLine.startsWith('<%')) {
        lang = 'ruby';
    } else if (firstLine.startsWith('<!doctype html>')) {
        lang = 'html';
    } else if (firstLine.startsWith('#')) {
        lang = 'bash';
    } else if (firstLine.startsWith('rem ')) {
        lang = 'batch';
    } else if (firstLine.startsWith('-- ')) {
        lang = 'sql';
    } else if (firstLine.startsWith('/*')) {
        lang = 'java';
    }
    return lang;
}

const toggleButton = document.getElementById("open-ai-api-toggle-btn");
const submitButton = document.getElementById("open-ai-api-submit-btn");
const openaiapiInputField = document.getElementById('openaiapi-input');

let openaiapi = ""

toggleButton.addEventListener("click", function () {
    if (openaiapiInputField.type === "password") {
        openaiapiInputField.type = "text";
        toggleButton.innerHTML = "visibility"
    } else {
        openaiapiInputField.type = "password";
        toggleButton.innerHTML = "visibility_off"
    }
});

submitButton.addEventListener('click', function(){
    var inputValue = openaiapiInputField.value;
    openaiapi = inputValue;
    if (window.matchMedia("(max-width: 767px)").matches) {
        guideBar.style.display = "none";
        barInButton.style.display = "none";
        freezeBack.style.display = "none";
    }
})

function adjustLayout() {
    if (window.innerWidth < 768) {
        // Code to adjust layout for small screens
    } else {
        // Code
    }
}

export { setIsWaitingForResponse, getIsWaitingForResponse, adjustTextareaHeight, addMessage, openaiapi  };