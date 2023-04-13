import { setIsWaitingForResponse, getIsWaitingForResponse, adjustTextareaHeight, addMessage, openaiapi, buttonPagePairs, handleHistoryButtonClick, messageHistorySet, addHistorybyId } from "./script.js";

function handleChatbotInputKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        let chatbotInput = this
        const currentPage = this.parentNode.parentNode
        createNewPageIfNecessary(currentPage)
        const updatedPageId = currentPage.getAttribute("id");


        if (!getIsWaitingForResponse() && chatbotInput.value !== '') {
            sendMessage(chatbotInput, updatedPageId);
            adjustTextareaHeight(chatbotInput, chatbotInput);
            event.preventDefault();
        }
    }
}

function handleChatbotButtonClick(event) {
    const currentPage = this.parentNode.parentNode
    const chatbotInput = currentPage.querySelector("textarea");
    createNewPageIfNecessary(currentPage)
    const updatedPageId = currentPage.getAttribute("id");


    if (!getIsWaitingForResponse() && chatbotInput.value !== '') {
        sendMessage(chatbotInput, updatedPageId);
        adjustTextareaHeight(chatbotInput, chatbotInput);
    }
}

function createNewPageIfNecessary(currentPage) {
    const currentPageId = currentPage.getAttribute("id");
    if (currentPage.classList.contains('startnew')) {
        currentPage.classList.remove('startnew');
        const id = generateUniqueId();
        currentPage.setAttribute('id', id);
        const container = currentPage.parentNode;
        const container_name = container.getAttribute("id");
        const [newHomePage, newHistory] = newPageHistory(container_name, id, currentPageId);
        container.appendChild(newHomePage);
        const histories = buttonPagePairs[container_name].history;
        const first_history = histories.children[0];
        first_history.insertAdjacentElement('afterend', newHistory);
        first_history.classList.remove('active')
        newHistory.classList.add('active')
    }
}


document.querySelectorAll('.chatbot-input textarea').forEach((chatbotInput) => {
    chatbotInput.addEventListener('keydown', handleChatbotInputKeyDown)
    chatbotInput.addEventListener('input', () => { adjustTextareaHeight(chatbotInput, chatbotInput); });
})

function generateUniqueId() {
    const timestamp = new Date().getTime();
    const random = Math.random().toString(36).substr(2, 9);
    return `a${random}${timestamp}`;
}

function newPageHistory(name, id, homePageId) {

    // Generate the first element
    const page = document.createElement('div');
    page.classList.add(`${name}`, 'page');
    page.classList.add("startnew")
    page.style.display = 'none';
    page.id = homePageId;
    page.innerHTML = `
      <div class="${name}-messages">
        <div class="${name}-header">
            <h1>NewChat</h1>
            <p>Your friendly AI chatbot</p>
        </div>
        <div class="chatbot-message-container">
            <div class="message-headshot">
                <img src="static/images/default-head.png" alt="default-head">
            </div>
            <div class="chatbot-message">
                <div class="audio-message">
                    <audio controls>
                        <source src="static/media/start-speech.mp3" type="audio/mpeg">
                        Hello! How can I assist you today?
                    </audio>
                </div>
                <div class="audio-text">
                    <p>Hello! How can I assist you today?</p>
                </div>
            </div>
        </div>
        <div class="end-message"></div>
    </div>
    <div class="chatbot-input">
        <textarea rows="1" placeholder="Type your message..."></textarea>
        <button>Send</button>
    </div>
    `;

    const chatbotInput = page.querySelector('.chatbot-input textarea');
    chatbotInput.addEventListener('keydown', handleChatbotInputKeyDown);
    chatbotInput.addEventListener('input', () => {
        adjustTextareaHeight(chatbotInput, chatbotInput);
    });

    page.querySelector('.chatbot-input button').addEventListener('click', handleChatbotButtonClick);


    // Generate the second element
    const history = document.createElement('div');
    history.classList.add(`${name}-history`);
    history.id = id;
    history.innerHTML = `
      <div class="chat-history-headshot">
        <img src="static/images/default-head.png" alt="default-head">
      </div>
      <div class="chat-history-name">
        <h4>NewChat</h4>
        <p4>Hello! How can I assist you today?</p4>
      </div>
    `;

    history.addEventListener('click', handleHistoryButtonClick);
    // Return both elements
    return [page, history];
}



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