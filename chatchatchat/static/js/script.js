let isWaitingForResponse = false;

function setIsWaitingForResponse(value) {
    isWaitingForResponse = value;
}

function getIsWaitingForResponse() {
    return isWaitingForResponse;
}

// Get the guide bar buttons
const chatButton = document.querySelector('.chat-button');
const editButton = document.querySelector('.edit-button');
const roleplayButton = document.querySelector('.roleplay-button');

// Get the pages
const chatPage = document.querySelector('#chat');
const editPage = document.querySelector('#edit');
const roleplayPage = document.querySelector('#roleplay');

// Add event listeners for the guide bar buttons
chatButton.addEventListener('click', function () {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            // Update the page content
            // const chatbotContainer = document.querySelector('.chatbot-container');
            // chatbotContainer.innerHTML = xhr.responseText;

            // Update the URL
            window.history.pushState({ page: 'chat' }, null, '/chat/');
        }
    };
    xhr.open('GET', '/chat/');
    xhr.send();
    chatPage.style.display = 'block';
    editPage.style.display = 'none';
    roleplayPage.style.display = 'none';
    chatButton.classList.add('active');
    editButton.classList.remove('active');
    roleplayButton.classList.remove('active');
});

editButton.addEventListener('click', function () {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            // Update the page content
            // const chatbotContainer = document.querySelector('.chatbot-container');
            // chatbotContainer.innerHTML = xhr.responseText;

            // Update the URL
            window.history.pushState({ page: 'edit' }, null, '/edit/');
        }
    };

    xhr.open('GET', '/edit/');
    xhr.send();
    chatPage.style.display = 'none';
    roleplayPage.style.display = 'none';
    editPage.style.display = 'block';
    chatButton.classList.remove('active');
    roleplayButton.classList.remove('active');
    editButton.classList.add('active');
});

roleplayButton.addEventListener('click', function () {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            // Update the page content
            // const chatbotContainer = document.querySelector('.chatbot-container');
            // chatbotContainer.innerHTML = xhr.responseText;

            // Update the URL
            window.history.pushState({ page: 'roleplay' }, null, '/roleplay/');
        }
    };

    xhr.open('GET', '/roleplay/');
    xhr.send();
    roleplayPage.style.display = 'block';
    chatPage.style.display = 'none';
    editPage.style.display = 'none';
    roleplayButton.classList.add('active');
    chatButton.classList.remove('active');
    editButton.classList.remove('active');
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

export { setIsWaitingForResponse, getIsWaitingForResponse, adjustTextareaHeight, addMessage };