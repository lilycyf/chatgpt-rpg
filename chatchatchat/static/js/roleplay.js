import { setIsWaitingForResponse, getIsWaitingForResponse, adjustTextareaHeight, addMessage } from "./script.js";

const roleplayPersonalityButton = document.querySelector('.roleplaybot-personality button');
const roleplayPersonalitySurvey = document.querySelector('.roleplaybot-personality-survey');

const serveySubmitBtn = document.querySelector('#survey-submit-btn');

const warningModal = document.querySelector('#warning-modal');
const warningSubmitBtn = document.querySelector('#warning-submit-btn');
const warningCancelBtn = document.querySelector('#warning-cancel-btn');
const warningCloseBtn = document.querySelector('#warning-close-btn');

const form = document.querySelector('#survey-form');

let isSurveyOpen = false;
let roleplayHistory = [];
let surveyResults = [];

roleplayPersonalityButton.addEventListener('click', () => {
    if (isSurveyOpen) {
        roleplayPersonalitySurvey.style.display = 'none';
        roleplayPersonalityButton.style.height = '40px';
        roleplayPersonalityButton.style.width = '40px';
        isSurveyOpen = false;
    } else {
        roleplayPersonalitySurvey.style.display = 'block';
        roleplayPersonalityButton.style.height = '20px';
        roleplayPersonalityButton.style.width = '20px';
        isSurveyOpen = true;

    }
});

// show warning modal when submit button is clicked
serveySubmitBtn.addEventListener('click', (event) => {
    event.preventDefault(); // prevent form submission

    const labels = form.querySelectorAll('label.question');
    const divs = form.querySelectorAll('div.choices');

    for (let i = 0; i < labels.length; i++) {

        const label = labels[i];
        const div = divs[i];

        let question = label.textContent;
        const checkedRadio = div.querySelector('input[type="radio"]:checked');

        let answer;

        if (checkedRadio && checkedRadio.value === 'Other') {
            const otherTextInput = div.querySelector('textarea');
            answer = otherTextInput.value;
        } else if (checkedRadio) {
            answer = checkedRadio.value;
        }
        surveyResults.push({ "question": question, "answer": answer });
    }

    // log the survey results to the console
    console.log(surveyResults);
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
    roleplayPersonalitySurvey.style.display = 'none';
    roleplayPersonalityButton.style.height = '40px';
    roleplayPersonalityButton.style.width = '40px';
    isSurveyOpen = false;
    // freeze form
    const inputs = form.querySelectorAll('input, select, textarea, button');
    inputs.forEach((input) => {
        input.disabled = true;
        input.style.cursor = 'not-allowed';
    });
    console.log('submitted');
    //   form.submit();
});

document.addEventListener('click', function (event) {
    // check if the clicked element is outside the roleplayPersonalitySurvey element
    if (!roleplayPersonalitySurvey.contains(event.target) && !roleplayPersonalityButton.contains(event.target)) {
        if (isSurveyOpen) {
            roleplayPersonalitySurvey.style.display = 'none';
            roleplayPersonalityButton.style.height = '40px';
            roleplayPersonalityButton.style.width = '40px';
            isSurveyOpen = false;
        }
    }
});