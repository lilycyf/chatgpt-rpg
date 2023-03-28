const chatbotMessages = document.querySelector('.chatbot-messages');
const chatbotInput = document.querySelector('.chatbot-input textarea');
const chatbotButton = document.querySelector('.chatbot-input button');
const input = document.querySelector('.chatbot-input textarea');
const input_padding = parseInt(window.getComputedStyle(input).paddingTop) + parseInt(window.getComputedStyle(input).paddingBottom)


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
	// Send the message to the server and get a response
	// Replace this with your own code to interact with the ChatGPT API
	const response = 'Hello! Hello!';
	addMessage(response, false);
}


function adjustTextareaHeight() {
  input.style.height = 'auto';
  input.style.height = input.scrollHeight - input_padding + 'px';
}

chatbotButton.addEventListener('click', () => {
    if (chatbotInput.value !== ''){
        sendMessage();
        adjustTextareaHeight();
    }
});

chatbotInput.addEventListener('keydown', function(event) {
	if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        if (chatbotInput.value !== ''){
            sendMessage();
            adjustTextareaHeight();
            event.preventDefault();
        }
	}
});

input.addEventListener('input', () => {
    adjustTextareaHeight();
});
