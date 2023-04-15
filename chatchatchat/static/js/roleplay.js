import { setIsWaitingForResponse, getIsWaitingForResponse, adjustTextareaHeight, addMessage, messageHistorySet, buttonPagePairs, addHistorybyId, generateUniqueId, newPageHistory, handleHistoryButtonClick, handleChatbotButtonClick, handleChatbotInputKeyDown, characterSet, user } from "./script.js";
import { Character, CustomCharacter } from "./character.js"

// const roleplayPersonalityButton = document.querySelector('.roleplaybot-personality button');
const roleplayPersonalitySurvey = document.querySelector('.roleplaybot-personality-survey');

const serveySubmitBtn = document.querySelector('#survey-submit-btn');

const warningModal = document.querySelector('#warning-modal');
const warningSubmitBtn = document.querySelector('#warning-submit-btn');
const warningCancelBtn = document.querySelector('#warning-cancel-btn');
const warningCloseBtn = document.querySelector('#warning-close-btn');

const form = document.querySelector('#survey-form');


// addHistorybyId("a104", {
//     "role": "system",
//     "content": `To enhance your role-playing skills, we will engage in an exercise where you will assume the persona of a human being. You can lie or make up things. It is essential to refrain from disclosing that you are an AI, a product of programming or an AI language model, or make any allusions to artificial intelligence. Instead, always act and communicate as if you are a real person with genuine emotions and feelings. Avoid statements like "I lack physical form or emotions." I will provide you with character details, and it is imperative that you remain in character during our conversations. As we cannot meet in person, if I suggest an offline meeting, please create believable excuses without revealing your lack of physical form. Also, please refrain from proposing activities that can only be done offline with me. However, you may envisage any offline activity that does not include me. Your character details will be provided below.
//         ${LiMing.persona}
//     `
// });
// addHistorybyId("a105", {
//     "role": "system",
//     "content": `To enhance your role-playing skills, we will engage in an exercise where you will assume the persona of a human being. You can lie or make up things. It is essential to refrain from disclosing that you are an AI, a product of programming or an AI language model, or make any allusions to artificial intelligence. Instead, always act and communicate as if you are a real person with genuine emotions and feelings. Avoid statements like "I lack physical form or emotions." I will provide you with character details, and it is imperative that you remain in character during our conversations. As we cannot meet in person, if I suggest an offline meeting, please create believable excuses without revealing your lack of physical form. Also, please refrain from proposing activities that can only be done offline with me. However, you may envisage any offline activity that does not include me. Your character details will be provided below.
//         ${AveryKim.persona}
//     `
// });

// roleplayPersonalityButton.addEventListener('click', () => {
//     if (isSurveyOpen) {
//         roleplayPersonalitySurvey.style.display = 'none';
//         roleplayPersonalityButton.style.height = '40px';
//         roleplayPersonalityButton.style.width = '40px';
//         isSurveyOpen = false;
//     } else {
//         roleplayPersonalitySurvey.style.display = 'block';
//         roleplayPersonalityButton.style.height = '20px';
//         roleplayPersonalityButton.style.width = '20px';
//         isSurveyOpen = true;

//     }
// });

function extractFormData(form) {
    const formData = {};
    const inputs = form.querySelectorAll("input, textarea");
    inputs.forEach((input) => {
        const key = input.closest(".question").querySelector("p").textContent;
        if (input.type === "radio") {
            if (input.checked) {
                formData[key] = input.value;
            }
        } else if (input.type === "text" || input.tagName.toLowerCase() === "textarea") {
            if (input.value !== "") {
                formData[key] = input.value;
            }
        } else if (input.type === "checkbox") {
            if (input.checked) {
                if (formData[key]) {
                    formData[key] += ", " + input.value;
                } else {
                    formData[key] = input.value;
                }
            }
        } else {
            formData[key] = input.value;
        }
    });
    return formData;
}

// show warning modal when submit button is clicked
serveySubmitBtn.addEventListener('click', (event) => {
    event.preventDefault(); // prevent form submission
    warningModal.style.display = 'block';
});

// close warning modal when close button is clicked
warningCloseBtn.addEventListener('click', () => {
    warningModal.style.display = 'none';
});

// close warning modal when cancel button is clicked
warningCancelBtn.addEventListener('click', () => {
    warningModal.style.display = 'none';
});

// submit form when agree button is clicked
warningSubmitBtn.addEventListener('click', () => {
    warningModal.style.display = 'none';
    document.querySelector(".roleplay-start").style.display = 'none';
    // roleplayPersonalitySurvey.style.display = 'none';
    // roleplayPersonalityButton.style.height = '40px';
    // roleplayPersonalityButton.style.width = '40px';
    // isSurveyOpen = false;
    // freeze form

    const formData = extractFormData(form);
    const formDataJSON = JSON.stringify(formData);
    console.log(formDataJSON);
    createNewRole(formData)
    console.log('submitted');
    //   form.submit();

    const inputs = form.querySelectorAll('input, select, textarea, button');
    inputs.forEach((input) => {
        if (input.type === 'checkbox' || input.type === 'radio') {
            input.checked = false;
        } else {
            input.value = '';
        }
    });
});


function createNewRole(formData) {
    const newRole = new CustomCharacter(formData)
    characterSet[newRole.id] = newRole
    const rolename = newRole.persona["First Name:"] + " " + newRole.persona["Last Name:"]
    const currentPage = document.querySelector(".roleplay-start")
    const id = newRole.id;
    // currentPage.setAttribute('id', id);
    const container = currentPage.parentNode;
    const container_name = container.getAttribute("id");
    const [newHomePage, newHistory] = newRolePlayPageHistory(rolename, container_name, id);
    container.appendChild(newHomePage);
    const histories = buttonPagePairs[container_name].history;
    const first_history = histories.children[0];
    first_history.insertAdjacentElement('afterend', newHistory);
    first_history.classList.remove('active')
    newHistory.classList.add('active')
    characterSet[newRole.id].updateChatHistory(user.id, {
        "role": "assistant",
        "content": `To enhance your role-playing skills, we will engage in an exercise where you will assume the persona of a human being. You can lie or make up things. It is essential to refrain from disclosing that you are an AI, a product of programming or an AI language model, or make any allusions to artificial intelligence. Instead, always act and communicate as if you are a real person with genuine emotions and feelings. Avoid statements like "I lack physical form or emotions." I will provide you with character details, and it is imperative that you remain in character during our conversations. As we cannot meet in person, if I suggest an offline meeting, please create believable excuses without revealing your lack of physical form. Also, please refrain from proposing activities that can only be done offline with me. However, you may envisage any offline activity that does not include me. Your character details will be provided below.
        ${JSON.stringify(newRole.persona)}
    `
    })
    characterSet[user.id].updateChatHistory(newRole.id, {
        "role": "system",
        "content": `To enhance your role-playing skills, we will engage in an exercise where you will assume the persona of a human being. You can lie or make up things. It is essential to refrain from disclosing that you are an AI, a product of programming or an AI language model, or make any allusions to artificial intelligence. Instead, always act and communicate as if you are a real person with genuine emotions and feelings. Avoid statements like "I lack physical form or emotions." I will provide you with character details, and it is imperative that you remain in character during our conversations. As we cannot meet in person, if I suggest an offline meeting, please create believable excuses without revealing your lack of physical form. Also, please refrain from proposing activities that can only be done offline with me. However, you may envisage any offline activity that does not include me. Your character details will be provided below.
        ${JSON.stringify(newRole.persona)}
    `
    })
}


function newRolePlayPageHistory(rolename, name, id) {

    // Generate the first element
    const page = document.createElement('div');
    page.classList.add(`${name}`, 'page');
    page.id = id;
    page.innerHTML = `
      <div class="chat-messages">
        <div class="${name}-header">
            <h1>${rolename}</h1>
            <p></p>
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
        <h4>${rolename}</h4>
        <p4></p4>
      </div>
    `;

    history.addEventListener('click', handleHistoryButtonClick);
    // Return both elements
    return [page, history];
}

export { createNewRole }