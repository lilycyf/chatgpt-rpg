import { setIsWaitingForResponse, getIsWaitingForResponse, adjustTextareaHeight, addMessage, openaiapi, buttonPagePairs, handleHistoryButtonClick, messageHistorySet, addHistorybyId, generateUniqueId, newPageHistory, handleChatbotButtonClick, handleChatbotInputKeyDown } from "./script.js";

document.querySelectorAll('.chatbot-input textarea').forEach((chatbotInput) => {
    chatbotInput.addEventListener('keydown', handleChatbotInputKeyDown)
    chatbotInput.addEventListener('input', () => { adjustTextareaHeight(chatbotInput, chatbotInput); });
})


document.querySelectorAll('.chatbot-input button').forEach((chatbotButton) => {
    chatbotButton.addEventListener('click', handleChatbotButtonClick);
})
