const chatbotMessages = document.querySelector('.chatbot-messages');
const chatbotInput = document.querySelector('.chatbot-input textarea');
const chatbotButton = document.querySelector('.chatbot-input button');
const input = document.querySelector('.chatbot-input textarea');
const input_padding = parseInt(window.getComputedStyle(input).paddingTop) + parseInt(window.getComputedStyle(input).paddingBottom)

let isWaitingForResponse = false;

function addMessage(message, isUser) {
	const messageContainer = document.createElement('div');
	messageContainer.classList.add('chatbot-message');
	if (isUser) {
        const messageContent = document.createElement('p');
		messageContent.style.whiteSpace = 'pre-wrap';
		messageContent.textContent = message;
		messageContainer.appendChild(messageContent);
	} else {
		messageContainer.innerHTML = '<p>' + message + '</p>';
	}
	chatbotMessages.appendChild(messageContainer);
	chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

function sendMessage() {
    const message = chatbotInput.value;
    addMessage(message, true);
    chatbotInput.value = '';
    chatbotButton.disabled = true;
    isWaitingForResponse = true;
    // Send the message to the server and get a response
    fetch('/chatbot/?message=' + encodeURIComponent(message))
        .then(response => response.json())
        .then(data => {
            const response = data.response;
            addMessage(response, false);
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
