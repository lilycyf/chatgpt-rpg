import { setIsWaitingForResponse, getIsWaitingForResponse, adjustTextareaHeight, addMessage } from "./script.js";

const editbotMessages = document.querySelector('.edit-messages');
const editbotInputInput = document.querySelector('.edit-input .input');
const editbotInputInstruction = document.querySelector('.edit-input .instruction');
const editbotButton = document.querySelector('.edit-input button');

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
    if (!getIsWaitingForResponse() && editbotInputInput.value !== '' && editbotInputInstruction.value !== '') {
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
    setIsWaitingForResponse(true);

    // Send the message to the server and get a response
    fetch('/editbot/?input=' + encodeURIComponent(input) + '&instruction=' + encodeURIComponent(instruction))
        .then(response => response.json())
        .then(data => {
            const response = data.response;
            addMessage(response, false, editbotMessages);
            editbotButton.disabled = false;
            setIsWaitingForResponse(false);
        })
        .catch(error => {
            console.error('Error:', error);
            editbotButton.disabled = false;
            setIsWaitingForResponse(false);
        });
}