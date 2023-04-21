import { Character, CustomCharacter } from "./character.js"
import { showTopError } from "./helpers.js"
import { generateHistory, generateHistoryWithMemory, formattedResponseFormat } from './messageHistory.js'

const sidebarToggleButton = document.querySelector("#sidebarToggle");
const guideBarContent = document.querySelector(".guide-bar-content")
const freezeBack = document.querySelector(".freeze-background")
const sidebarEle = document.querySelector(".guide-bar")
const restPage = document.querySelector(".container-container")

const sections = document.querySelectorAll('.container');

let autoReply = false;
let user = new CustomCharacter();
let characterSet = {}

characterSet[user.id] = user

let currentUserId = user.id

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

let _isExpanded = true;

if (window.matchMedia("(max-width: 767px)").matches) {
    sidebarToggleButton.textContent = "Menu"
    // sidebarEle.classList.add('sidebar--collapsed');
    // guideBarContent.style.display = "none";
    _isExpanded = false;
} else {
    sidebarEle.classList.remove('sidebar--collapsed');
    guideBarContent.style.display = "block";
}


const handleToggle = () => {
    if (_isExpanded) {
        _isExpanded = !_isExpanded;
        sidebarEle.classList.remove('slide-in');
        sidebarEle.classList.add('slide-out');
        guideBarContent.style.display = "none";
        if (window.matchMedia("(max-width: 767px)").matches) {
            freezeBack.style.display = "none";
            restPage.classList.toggle('frozen');
        }
    } else {
        _isExpanded = !_isExpanded;
        sidebarEle.classList.remove('slide-out');
        sidebarEle.classList.remove('sidebar--collapsed');
        sidebarEle.classList.add('slide-in');

        guideBarContent.style.display = "block";
        if (window.matchMedia("(max-width: 767px)").matches) {
            sidebarToggleButton.textContent = "Close"
            freezeBack.style.display = "block";
            restPage.classList.toggle('frozen');
        } else {
            sidebarToggleButton.textContent = "chevron_left"
        }
    }
};

sidebarToggleButton.addEventListener('click', () => {
    handleToggle();
});

sidebarEle.addEventListener('animationend', (e) => {
    if (e.target === sidebarEle) {
        sidebarEle.classList.remove('slide-in');
        sidebarEle.classList.remove('slide-out');
        console.log(_isExpanded)
        if (!_isExpanded) {
            sidebarEle.classList.add('sidebar--collapsed');
            sidebarToggleButton.textContent = "Menu"
        }
    }
});

let isWaitingForResponse = false;

function setIsWaitingForResponse(value) {
    isWaitingForResponse = value;
}

function getIsWaitingForResponse() {
    return isWaitingForResponse;
}

const homePage = 'roleplay';

var buttonPagePairs = {};

for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    console.log(section)
    buttonPagePairs[section.id] = {
        page: section,
        button: document.querySelector(`.${section.id}-button`),
        history: document.querySelector(`.${section.id}-histories`)
    };
}

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
function setguideBarContentActive(pair) {
    pair.button.classList.add('active');
    pair.history.style.display = '';
}

// Define function to set guide bar buttons as inactive
function setguideBarContentInactive(pair) {
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

    // set all pages none display
    document.querySelectorAll('.page').forEach((item) => {
        item.style.display = 'none'
    })

    // Set active pair based on the page name from URL
    const activePair = buttonPagePairs[pageName] || buttonPagePairs[homePage];
    setActive(activePair);

    // set first history button active
    var history = activePair.history.children[0]
    history.classList.add('active')

    // find the matching history page and make it active
    console.log(history)
    if (history.id.length !== 0) {
        document.querySelector(`.page#${history.id}`).style.display = ''
    }
}


// Add event listeners for the guide bar buttons
Object.values(buttonPagePairs).forEach(pair => {
    pair.button.addEventListener('click', function () {
        // Set all this history page active, rest inactive
        const pageName = pair.button.dataset.page;
        Object.values(buttonPagePairs).forEach(pair => setguideBarContentInactive(pair));
        const activePair = buttonPagePairs[pageName]
        setguideBarContentActive(activePair);
    });
});

function handleHistoryButtonClick(event) {
    var historyObj = this
    const parentElement = historyObj.parentNode;
    const firstClassName = parentElement.classList.item(0);
    const pageName = firstClassName.split("-").shift();

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
    console.log(page)
    var page = buttonPagePairs[pageName].page.children;

    for (var i = 0; i < page.length; i++) {
        var childElement = page[i];
        console.log(childElement.id)
        console.log(this.id)
        if (childElement.id !== `${this.id}`) {
            childElement.style.display = 'none';
        } else {
            childElement.style.display = '';
        }
    }
    if (window.matchMedia("(max-width: 767px)").matches) {
        sidebarEle.classList.remove('slide-in');
        sidebarEle.classList.add('slide-out');
        freezeBack.style.display = "none";
        sidebarToggleButton.textContent = "Menu"
        // sidebarEle.classList.add('sidebar--collapsed');
        restPage.classList.remove('frozen');
        guideBarContent.style.display = "none";
        _isExpanded = false;
    }

}


Object.values(buttonPagePairs).forEach(pair => {
    var historiesContainer = pair.history;
    var histories = historiesContainer.querySelectorAll('.chat-history');

    histories.forEach(function (history) {
        history.addEventListener('click', handleHistoryButtonClick);
    });

});


function adjustTextareaHeight(element, reference) {
    element.style.height = 'auto';
    let reference_padding = parseInt(window.getComputedStyle(reference).paddingTop) + parseInt(window.getComputedStyle(reference).paddingBottom)
    element.style.height = reference.scrollHeight - reference_padding + 'px';
}

function addMessage(message, isUser, messages, pageId) {
    const lastChild = messages.lastElementChild
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
    const messageContainerContainer = document.createElement('div');
    const messageContainer = document.createElement('div');
    const messageHeadshot = document.createElement('div');
    messageHeadshot.classList.add("message-headshot")
    if (isUser) {
        messageHeadshot.innerHTML = `<img src="${characterSet[currentUserId].headShot}" alt="default-head">`
        messageContainerContainer.appendChild(messageHeadshot)
        messageContainerContainer.classList.add('user-message-container')
        messageContainer.classList.add('user-message');
        const messageContent = document.createElement('p');
        messageContent.style.whiteSpace = 'pre-wrap';
        messageContent.textContent = message;
        messageContainer.appendChild(messageContent);
    } else {
        messageHeadshot.innerHTML = `<img src="${characterSet[pageId].headShot}" alt="default-head">`
        messageContainerContainer.appendChild(messageHeadshot)
        messageContainerContainer.classList.add('chatbot-message-container')
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
    messageContainerContainer.appendChild(messageContainer)
    messages.insertBefore(messageContainerContainer, lastChild)
    messages.scrollTop = messages.scrollHeight;
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
        toggleButton.textContent = "visibility"
    } else {
        openaiapiInputField.type = "password";
        toggleButton.textContent = "visibility_off"
    }
});

submitButton.addEventListener('click', function () {
    var inputValue = openaiapiInputField.value;
    openaiapi = inputValue;
    // if (window.matchMedia("(max-width: 767px)").matches) {
    //     guideBarContent.style.display = "none";
    //     sidebarToggleButton.style.display = "none";
    //     freezeBack.style.display = "none";
    // }
    if (window.matchMedia("(max-width: 767px)").matches) {
        freezeBack.style.display = "none";
        restPage.classList.remove('frozen');
        sidebarToggleButton.textContent = "Menu"
        sidebarEle.classList.add('sidebar--collapsed');
        guideBarContent.style.display = "none";
        _isExpanded = false;
    }
})

function adjustLayout() {
    if (window.innerWidth < 768) {
        // Code to adjust layout for small screens
    } else {
        // Code
    }
}


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
      <div class="chat-messages">
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
    history.classList.add(`chat-history`);
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


function handleChatbotButtonClick(event) {
    const currentPage = this.parentNode.parentNode
    const chatbotInput = currentPage.querySelector("textarea");
    createNewPageIfNecessary(currentPage)
    const updatedPageId = currentPage.getAttribute("id");


    if (!getIsWaitingForResponse() && chatbotInput.value !== '') {
        sendMessage(chatbotInput.value, updatedPageId, true);
        chatbotInput.value = '';
        adjustTextareaHeight(chatbotInput, chatbotInput);
    }
}

function handleChatbotInputKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        let chatbotInput = this
        const currentPage = this.parentNode.parentNode
        createNewPageIfNecessary(currentPage)
        const updatedPageId = currentPage.getAttribute("id");


        if (!getIsWaitingForResponse() && chatbotInput.value !== '') {
            sendMessage(chatbotInput.value, updatedPageId, true);
            chatbotInput.value = '';
            adjustTextareaHeight(chatbotInput, chatbotInput);
            event.preventDefault();
        }
    }
}

function createNewPageIfNecessary(currentPage) {
    const currentPageId = currentPage.getAttribute("id");
    if (currentPage.classList.contains('startnew')) {
        currentPage.classList.remove('startnew');
        const newCharacter = new Character()
        characterSet[newCharacter.id] = newCharacter
        const id = newCharacter.id;
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

async function sendMessage(message, pageId, isUser) {
    var sendId = ""
    var receiveId = ""
    if (isUser) {
        sendId = currentUserId;
        receiveId = pageId;
    } else {
        sendId = pageId;
        receiveId = currentUserId;
    }
    const page = document.querySelector(`.page#${pageId}`)
    const pageType = page.classList[0]
    console.log(pageType)
    const chatbotButton = page.querySelector(".chatbot-input button");
    const messages = page.firstElementChild
    addMessage(message, isUser, messages, pageId);
    updateHistoryTextOrder(pageId, message);
    chatbotButton.disabled = true;
    setIsWaitingForResponse(true);
    // Add user message to message history
    await characterSet[receiveId].updateChatHistory(sendId, { "role": "assistant", "content": message })
    await characterSet[sendId].updateChatHistory(receiveId, { "role": "user", "content": message })

    var sendmessages = ""
    if (pageType == "roleplay") {
        sendmessages = generateHistory(characterSet[receiveId], characterSet[sendId], receiveId, sendId)
    } else if (pageType == "chat") {
        sendmessages = characterSet[sendId].getChatHistory(receiveId).map(item => item["history"])
    }
    console.log(sendmessages)

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
            "messages": sendmessages
        };
        const requestOptions = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
        };

        fetch(endpoint, requestOptions)
            .then(response => response.json())
            .then(data => {
                try {
                    const content = data.choices[0].message.content;
                    const finish_reason = data.choices[0].finish_reason;
                    const usage = data.usage;
                    const prompt_tokens = usage.prompt_tokens;
                    const completion_tokens = usage.completion_tokens;

                    addMessage(content, !isUser, messages, pageId);
                    updateHistoryTextOrder(pageId, content);
                    // Add assistant message to message history
                    characterSet[receiveId].updateChatHistory(sendId, { "role": "user", "content": content }, completion_tokens)
                    characterSet[sendId].updateChatHistory(receiveId, { "role": "assistant", "content": content }, completion_tokens)
                    chatbotButton.disabled = false;
                    setIsWaitingForResponse(false);
                } catch (error) {
                    showTopError(`${data.error.code}: ${data.error.message}`);
                    chatbotButton.disabled = false;
                    setIsWaitingForResponse(false);
                }
            })
            .catch(error => {
                // console.error('Error:', error);
                showTopError(error.message);
                chatbotButton.disabled = false;
                setIsWaitingForResponse(false);
            });

    } else {
        // Send the message to the server and get a response
        fetch(`/${pageType}bot/?messageHistory=` + encodeURIComponent(JSON.stringify(sendmessages)))
            .then(response => response.json())
            .then(data => {
                try {
                    const content = data.choices[0].message.content;
                    const finish_reason = data.choices[0].finish_reason;
                    const usage = data.usage;
                    const prompt_tokens = usage.prompt_tokens;
                    console.log(prompt_tokens)
                    const completion_tokens = usage.completion_tokens;

                    if (autoReply) {
                        sendMessage(content, pageId, !isUser)
                    } else {
                        addMessage(content, !isUser, messages, pageId);
                        updateHistoryTextOrder(pageId, content);
                        // Add assistant message to message history
                        characterSet[receiveId].updateChatHistory(sendId, { "role": "user", "content": content }, completion_tokens)
                        characterSet[sendId].updateChatHistory(receiveId, { "role": "assistant", "content": content }, completion_tokens)
                        handleResponse(content, completion_tokens, receiveId, sendId, page)
                    }
                    chatbotButton.disabled = false;
                    setIsWaitingForResponse(false);
                } catch (error) {
                    showTopError(`${data.error.code}: ${data.error.message}`);
                    chatbotButton.disabled = false;
                    setIsWaitingForResponse(false);
                }
            })
            .catch(error => {
                // console.error('Error:', error);
                showTopError(error.message);
                chatbotButton.disabled = false;
                setIsWaitingForResponse(false);
            });
    }
}

async function handleResponse(content, token, pageId, userId, page) {
    try {
        const contentJson = JSON.parse(content)
        const command_name = contentJson["command"]["command_name"]
        const args = contentJson["command"]["args"]
        var sysResponse = ''
        if (command_name == "Check past events in memory") {
            const relatedMemories = await characterSet[pageId].recallMemory(args["similar_event"])
            sysResponse = `System Message: This reminds you of these events from your past: \n${relatedMemories}`
        } else if (command_name == "Speak to") {
            sysResponse = `${args["target"]}: `
        } else if (command_name == "Add memory in memory") {
            await characterSet[pageId].addMemory(args["summary"])
            sysResponse = "System Message: Memory added successfully"
        } else if (command_name == "Go to") {
            sysResponse = `System Message: You arrived at ${args["location"]}`
        } else if (command_name == "Look around") {
            sysResponse = "System Message: You see"
        } else if (command_name == "Take a closer look at") {
            sysResponse = `${args["target"]}: `
        }
    } catch {
        sysResponse = "System Error: Wrong response format, please resend response"
    }
    page.querySelector(".chatbot-input textarea").value = sysResponse
}

export { user, setIsWaitingForResponse, getIsWaitingForResponse, adjustTextareaHeight, addMessage, openaiapi, buttonPagePairs, handleHistoryButtonClick, messageHistorySet, addHistorybyId, generateUniqueId, newPageHistory, handleChatbotButtonClick, handleChatbotInputKeyDown, characterSet, updatePageFromUrl, currentUserId };