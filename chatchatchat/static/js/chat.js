import { setIsWaitingForResponse, getIsWaitingForResponse, adjustTextareaHeight, addMessage, openaiapi } from "./script.js";

const chatbotMessages = document.querySelector('.chatbot-messages');
const chatbotInput = document.querySelector('.chatbot-input textarea');
const chatbotButton = document.querySelector('.chatbot-input button');

let messageHistory = [];

chatbotInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        if (!getIsWaitingForResponse() && chatbotInput.value !== '') {
            sendMessage();
            adjustTextareaHeight(chatbotInput, chatbotInput);
            event.preventDefault();
        }
    }
});

chatbotInput.addEventListener('input', () => {
    adjustTextareaHeight(chatbotInput, chatbotInput);
});

chatbotButton.addEventListener('click', () => {
    if (!getIsWaitingForResponse() && chatbotInput.value !== '') {
        sendMessage();
        adjustTextareaHeight(chatbotInput, chatbotInput);
    }
});

function sendMessage() {
    const message = chatbotInput.value;
    addMessage(message, true, chatbotMessages);
    chatbotInput.value = '';
    chatbotButton.disabled = true;
    setIsWaitingForResponse(true);
    // Add user message to message history
    messageHistory.push({ "role": "user", "content": message });

    // get api from frontend if exist
    if (openaiapi !== '') {

        const api_key = openaiapi;

        const endpoint = 'https://api.openai.com/v1/chat/completions';
        const headers = {
            'Authorization': `Bearer ${api_key}`,
            'Content-Type': 'application/json'
        };
        const data = {
            "model": "gpt-3.5-turbo",
            "messages": messageHistory
        };
        const requestOptions = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
        };

        fetch(endpoint, requestOptions)
            .then(response => response.json())
            .then(data => {
                const response = data.choices[0].message.content;
                console.log(response);
                addMessage(response, false, chatbotMessages);
                // Add assistant message to message history
                messageHistory.push({ "role": "assistant", "content": response });
                chatbotButton.disabled = false;
                setIsWaitingForResponse(false);
            })
            .catch(error => {
                console.error('Error:', error);
                chatbotButton.disabled = false;
                setIsWaitingForResponse(false);
            });

    } else {
        // Send the message to the server and get a response
        fetch('/chatbot/?messageHistory=' + encodeURIComponent(JSON.stringify(messageHistory)))
            .then(response => response.json())
            .then(data => {
                const response = data.response;
                addMessage(response, false, chatbotMessages);
                // Add assistant message to message history
                messageHistory.push({ "role": "assistant", "content": response });

                chatbotButton.disabled = false;
                setIsWaitingForResponse(false);
            })
            .catch(error => {
                console.error('Error:', error);
                chatbotButton.disabled = false;
                setIsWaitingForResponse(false);
            });

    }






}