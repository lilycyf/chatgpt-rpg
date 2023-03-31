let isWaitingForResponse = false;

function setIsWaitingForResponse(value) {
    isWaitingForResponse = value;
}

function getIsWaitingForResponse() {
    return isWaitingForResponse;
}

const homePage = 'chat';

const buttonPagePairs = {};
const sections = document.querySelectorAll('.container');

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
    pair.page.style.display = 'block';
    pair.history.style.display = 'block';
}

// Define function to set button and page as inactive
function setInactive(pair) {
    pair.button.classList.remove('active');
    pair.page.style.display = 'none';
    pair.history.style.display = 'none';
}

// Define function to update the page based on URL
function updatePageFromUrl(url) {
    const pageName = url.split('/').filter(Boolean).pop(); // get the last path of the URL

    // Set all pairs inactive
    Object.values(buttonPagePairs).forEach(pair => setInactive(pair));

    // Set active pair based on the page name from URL
    const activePair = buttonPagePairs[pageName] || buttonPagePairs[homePage];
    setActive(activePair);
}

// Update page on initial load from URL
updatePageFromUrl(url);

// Add event listeners for the guide bar buttons
Object.values(buttonPagePairs).forEach(pair => {
    pair.button.addEventListener('click', function () {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                const pageName = pair.button.dataset.page;
                // Update the URL and add it to the browser history
                // window.history.pushState({ page: pageName }, null, `/${pageName}/`);

                // Set all pairs inactive
                Object.values(buttonPagePairs).forEach(pair => setInactive(pair));

                // Set active pair based on the page name from URL
                const activePair = buttonPagePairs[pageName];
                setActive(activePair);
            }
        };

        const pageName = pair.button.dataset.page
        xhr.open('GET', `/${pageName}/`);
        xhr.send();
    });
});


function adjustTextareaHeight(element, reference) {
    element.style.height = 'auto';
    let reference_padding = parseInt(window.getComputedStyle(reference).paddingTop) + parseInt(window.getComputedStyle(reference).paddingBottom)
    element.style.height = reference.scrollHeight - reference_padding + 'px';
}

function addMessage(message, isUser, page) {
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
    const lastChild = page.lastElementChild
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
const passwordInput = document.getElementById("password");

toggleButton.addEventListener("click", function () {
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        toggleButton.innerHTML = "visibility"
    } else {
        passwordInput.type = "password";
        toggleButton.innerHTML = "visibility_off"
    }
});

submitButton.addEventListener("click", function () {
    var passwordValue = passwordInput.value;
    console.log("Password value: " + passwordValue);
});

function adjustLayout() {
    if (window.innerWidth < 768) {
        // Code to adjust layout for small screens
    } else {
        // Code
    }
}

export { setIsWaitingForResponse, getIsWaitingForResponse, adjustTextareaHeight, addMessage };