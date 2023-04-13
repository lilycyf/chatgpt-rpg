import { setIsWaitingForResponse, getIsWaitingForResponse, adjustTextareaHeight, addMessage, openaiapi, buttonPagePairs, handleHistoryButtonClick, messageHistorySet, addHistorybyId, generateUniqueId, newPageHistory, handleChatbotButtonClick, handleChatbotInputKeyDown } from "./script.js";


document.querySelectorAll('.chatbot-input textarea').forEach((chatbotInput) => {
    chatbotInput.addEventListener('keydown', handleChatbotInputKeyDown)
    chatbotInput.addEventListener('input', () => { adjustTextareaHeight(chatbotInput, chatbotInput); });
})


document.querySelectorAll('.chatbot-input button').forEach((chatbotButton) => {
    chatbotButton.addEventListener('click', handleChatbotButtonClick);
})

function updateHistoryTextOrder(pageId, message) {
    console.log(`.chat-history#${pageId} p4`)
    const history = document.querySelector(`.chat-history#${pageId}`)
    // update order
    const historiesContainer = history.parentNode
    historiesContainer.removeChild(history);
    historiesContainer.firstElementChild.insertAdjacentElement("afterend", history)

    const historyTextBox = history.querySelector('p4')
    historyTextBox.textContent = message
}

function sendMessage(chatbotInput, pageId) {
    const message = chatbotInput.value;
    const page = chatbotInput.parentNode.parentNode
    const pageType = page.classList[0]
    console.log(pageType)
    const chatbotButton = page.querySelector(".chatbot-input button");
    const messages = page.firstElementChild
    addMessage(message, true, messages);
    updateHistoryTextOrder(pageId, message);
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
            "messages": messageHistorySet[pageId]
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
                updateHistoryTextOrder(pageId, response);
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
        fetch(`/${pageType}bot/?messageHistory=` + encodeURIComponent(JSON.stringify(messageHistorySet[pageId])))
            .then(response => response.json())
            .then(data => {
                const response = data.response;
                addMessage(response, false, messages);
                updateHistoryTextOrder(pageId, response);
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