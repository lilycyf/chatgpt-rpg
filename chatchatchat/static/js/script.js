const chatbotMessages = document.querySelector('.chatbot-messages');
const chatbotInput = document.querySelector('.chatbot-input textarea');
const chatbotButton = document.querySelector('.chatbot-input button');
const input = document.querySelector('.chatbot-input textarea');
const input_padding = parseInt(window.getComputedStyle(input).paddingTop) + parseInt(window.getComputedStyle(input).paddingBottom)

let isWaitingForResponse = false;
let messageHistory = [];

function addMessage(message, isUser) {
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
    const lastChild = chatbotMessages.lastElementChild
    chatbotMessages.insertBefore(messageContainer, lastChild)
	chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
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
    addMessage(message, true);
    chatbotInput.value = '';
    chatbotButton.disabled = true;
    isWaitingForResponse = true;
    // Add user message to message history
    messageHistory.push({"role": "user", "content": message});

    // Send the message to the server and get a response
    fetch('/chatbot/?messageHistory=' + encodeURIComponent(JSON.stringify(messageHistory)))
        .then(response => response.json())
        .then(data => {
            const response = data.response;
            addMessage(response, false);
            // Add assistant message to message history
            messageHistory.push({"role": "assistant", "content": response});

            chatbotButton.disabled = false;
            isWaitingForResponse = false;
        })
        .catch(error => {
            console.error('Error:', error);
            chatbotButton.disabled = false;
            isWaitingForResponse = false;
        });
}


function adjustTextareaHeight() {
  input.style.height = 'auto';
  input.style.height = input.scrollHeight - input_padding + 'px';
}

chatbotButton.addEventListener('click', () => {
    if (!isWaitingForResponse && chatbotInput.value !== ''){
        sendMessage();
        adjustTextareaHeight();
    }
});

chatbotInput.addEventListener('keydown', function(event) {
	if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        if (!isWaitingForResponse && chatbotInput.value !== ''){
            sendMessage();
            adjustTextareaHeight();
            event.preventDefault();
        }
	}
});

input.addEventListener('input', () => {
    adjustTextareaHeight();
});
