import { setIsWaitingForResponse, getIsWaitingForResponse, adjustTextareaHeight, addMessage, openaiapi } from "./script.js";

let messageHistorySet = {}

// Define a function to add items to the object
function addHistorybyId(key, item) {
    // If the key already exists in the object, add the item to the existing array
    if (messageHistorySet.hasOwnProperty(key)) {
        messageHistorySet[key].push(item);
    }
    // If the key does not exist in the object, initialize it to a new array containing the item
    else {
        messageHistorySet[key] = [item];
    }
}

document.querySelectorAll('.chatbot-input textarea').forEach((chatbotInput) => {
    chatbotInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            const pageId = chatbotInput.parentNode.parentNode.getAttribute("id");
            if (!getIsWaitingForResponse() && chatbotInput.value !== '') {
                sendMessage(chatbotInput, pageId);
                adjustTextareaHeight(chatbotInput, chatbotInput);
                event.preventDefault();
            }
        }
    });

    chatbotInput.addEventListener('input', () => {
        adjustTextareaHeight(chatbotInput, chatbotInput);
    });
})

document.querySelectorAll('.chatbot-input button').forEach((chatbotButton) => {
    chatbotButton.addEventListener('click', () => {
        const parent = chatbotButton.parentNode;
        const chatbotInput = parent.parentNode.querySelector("textarea");
        if (!getIsWaitingForResponse() && chatbotInput.value !== '') {
            const pageId = parent.parentNode.getAttribute("id");
            sendMessage(chatbotInput, pageId);
            adjustTextareaHeight(chatbotInput, chatbotInput);
        }
    });
})


function sendMessage(chatbotInput, pageId) {
    const message = chatbotInput.value;
    const page = chatbotInput.parentNode.parentNode
    const chatbotButton = page.querySelector(".chatbot-input button");
    const messages = page.firstElementChild
    addMessage(message, true, messages);
    chatbotInput.value = '';
    chatbotButton.disabled = true;
    setIsWaitingForResponse(true);
    // Add user message to message history
    addHistorybyId(pageId, { "role": "user", "content": message });

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
            "messages": messageHistorySet[pageid]
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
                addMessage(response, false, messages);
                // Add assistant message to message history
                addHistorybyId(pageId, { "role": "assistant", "content": response });
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
        fetch('/chatbot/?messageHistory=' + encodeURIComponent(JSON.stringify(messageHistorySet[pageId])))
            .then(response => response.json())
            .then(data => {
                const response = data.response;
                addMessage(response, false, messages);
                // Add assistant message to message history
                addHistorybyId(pageId, { "role": "assistant", "content": response });

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