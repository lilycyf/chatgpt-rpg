const chatbotMessages = document.querySelector('.chatbot-messages');
const chatbotInput = document.querySelector('.chatbot-input textarea');
const chatbotButton = document.querySelector('.chatbot-input button');

const editbotMessages = document.querySelector('.edit-messages');
const editbotInputInput = document.querySelector('.edit-input .input');
const editbotInputInstruction = document.querySelector('.edit-input .instruction');
const editbotButton = document.querySelector('.edit-input button');

let isWaitingForResponse = false;
let messageHistory = [];

// Get the guide bar buttons
const chatButton = document.querySelector('.chat-button');
const editButton = document.querySelector('.edit-button');

// Get the pages
const chatPage = document.querySelector('#chat');
const editPage = document.querySelector('#edit');

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
    chatButton.classList.add('active');
    editButton.classList.remove('active');
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
    editPage.style.display = 'block';
    chatButton.classList.remove('active');
    editButton.classList.add('active');
});


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

function sendMessage() {
    const message = chatbotInput.value;
    addMessage(message, true, chatbotMessages);
    chatbotInput.value = '';
    chatbotButton.disabled = true;
    isWaitingForResponse = true;
    // Add user message to message history
    messageHistory.push({ "role": "user", "content": message });

    // Send the message to the server and get a response
    fetch('/chatbot/?messageHistory=' + encodeURIComponent(JSON.stringify(messageHistory)))
        .then(response => response.json())
        .then(data => {
            const response = data.response;
            addMessage(response, false, chatbotMessages);
            // Add assistant message to message history
            messageHistory.push({ "role": "assistant", "content": response });

            chatbotButton.disabled = false;
            isWaitingForResponse = false;
        })
        .catch(error => {
            console.error('Error:', error);
            chatbotButton.disabled = false;
            isWaitingForResponse = false;
        });
}


function adjustTextareaHeight(element, reference) {
    element.style.height = 'auto';
    reference_padding = parseInt(window.getComputedStyle(reference).paddingTop) + parseInt(window.getComputedStyle(reference).paddingBottom)
    element.style.height = reference.scrollHeight - reference_padding + 'px';
}

chatbotButton.addEventListener('click', () => {
    if (!isWaitingForResponse && chatbotInput.value !== '') {
        sendMessage();
        adjustTextareaHeight(chatbotInput, chatbotInput);
    }
});

chatbotInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        if (!isWaitingForResponse && chatbotInput.value !== '') {
            sendMessage();
            adjustTextareaHeight(chatbotInput, chatbotInput);
            event.preventDefault();
        }
    }
});

chatbotInput.addEventListener('input', () => {
    adjustTextareaHeight(chatbotInput, chatbotInput);
});


editbotInputInput.addEventListener('input', () => {
    adjustTextareaHeight(editbotInputInput, editbotInputInput);
    editbotInputInstruction.style.height = 'auto';
    if (editbotInputInstruction.scrollHeight > editbotInputInput.scrollHeight) {
        adjustTextareaHeight(editbotInputInstruction, editbotInputInstruction);
        editbotInputInput.style.height = 'auto';
    }
    
});

editbotInputInstruction.addEventListener('input', () => {
    adjustTextareaHeight(editbotInputInstruction, editbotInputInstruction);
    editbotInputInput.style.height = 'auto';
    if (editbotInputInstruction.scrollHeight < editbotInputInput.scrollHeight) {
        adjustTextareaHeight(editbotInputInput, editbotInputInput);
        editbotInputInstruction.style.height = 'auto';
    }
});


editbotButton.addEventListener('click', () => {
    if (!isWaitingForResponse && editbotInputInput.value !== '' && editbotInputInstruction.value !== '') {
        sendEditInstruction();
        adjustTextareaHeight(editbotInputInstruction, editbotInputInstruction);
        editbotInputInput.style.height = 'auto';
        adjustTextareaHeight(editbotInputInput, editbotInputInput);
        editbotInputInstruction.style.height = 'auto';
    }
});


function sendEditInstruction() {
    const input = editbotInputInput.value;
    const instruction = editbotInputInstruction.value;
    const message = 'Input: ' + '\n' + input + '\n' + '\n' + 'Instruction: ' + '\n' + instruction;
    addMessage(message, true, editbotMessages);
    editbotInputInput.value = ''
    editbotInputInstruction.value = ''
    editbotButton.disabled = true;
    isWaitingForResponse = true;

    // Send the message to the server and get a response
    fetch('/editbot/?input=' + encodeURIComponent(input) + '&instruction=' + encodeURIComponent(instruction))
        .then(response => response.json())
        .then(data => {
            const response = data.response;
            addMessage(response, false, editbotMessages);
            editbotButton.disabled = false;
            isWaitingForResponse = false;
        })
        .catch(error => {
            console.error('Error:', error);
            editbotButton.disabled = false;
            isWaitingForResponse = false;
        });
}