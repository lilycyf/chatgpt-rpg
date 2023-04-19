import { formattedResponseFormat } from "./messageHistory.js"
import { showTopError } from "./helpers.js"

class Character {
    constructor() {
        this.id = this.generateUniqueId();
        this.chatHistory = {};
        this.headShot = "static/images/default-head.png";
    }

    generateUniqueId() {
        const timestamp = new Date().getTime();
        const random = Math.random().toString(36).substr(2, 9);
        return `a${random}${timestamp}`;
    }

    getChatHistory(targetId) {
        return this.chatHistory[targetId] || [];
    }

    updateChatHistory(targetId, chat, token = null) {
        if (!this.chatHistory[targetId]) {
            this.chatHistory[targetId] = [];
        }
        var history = {
            "history": chat,
            "token": token
        }
        if (token == null) {
            fetch(`/embedding/?message=` + encodeURIComponent(chat["content"]))
                .then(response => response.json())
                .then(data => {
                    try {
                        history.token = data.usage.prompt_tokens
                    } catch (error) {
                        showTopError(`${data.error.code}: ${data.error.message}`);
                    }
                })
                .catch(error => {
                    // console.error('Error:', error);
                    showTopError(error.message);
                });
        }
        this.chatHistory[targetId].push(history);
    }
}

class CustomCharacter extends Character {
    constructor(persona = null) {
        super();
        this.persona = persona;
        this.prompt = {
            "content": '',
            "token": 0
        };

        if (persona) {
            this.prompt.content = `To enhance your role-playing skills, we will engage in an exercise where you will assume the persona of a human being. You can lie or make up things. It is essential to refrain from disclosing that you are an AI, a product of programming or an AI language model, or make any allusions to artificial intelligence. Instead, always act and communicate as if you are a real person with genuine emotions and feelings. Avoid statements like "I lack physical form or emotions." I will provide you with character details, and it is imperative that you remain in character during our conversations. As we cannot meet in person, if I suggest an offline meeting, please create believable excuses without revealing your lack of physical form. Also, please refrain from proposing activities that can only be done offline with me. However, you may envisage any offline activity that does not include me. Your character details will be provided below. ${JSON.stringify(this.persona)}. If you are unsure how you previously did something or want to recall past events, thinking about similar events will help you remember. You should only respond in JSON format as described below. Response Format: ${formattedResponseFormat}. Ensure the response can be parsed by javascript.`;
            fetch(`/embedding/?message=` + encodeURIComponent(this.prompt['content']))
                .then(response => response.json())
                .then(data => {
                    try {
                        this.prompt.token = data.usage.prompt_tokens
                    } catch (error) {
                        showTopError(`${data.error.code}: ${data.error.message}`);
                    }
                })
                .catch(error => {
                    // console.error('Error:', error);
                    showTopError(error.message);
                });
        }
    }

    getPersona() {
        return this.persona;
    }

    setPersona(persona) {
        this.persona = persona;
        this.prompt = {
            "content": '',
            "token": 0
        };

        if (persona) {
            this.prompt.content = `To enhance your role-playing skills, we will engage in an exercise where you will assume the persona of a human being. You can lie or make up things. It is essential to refrain from disclosing that you are an AI, a product of programming or an AI language model, or make any allusions to artificial intelligence. Instead, always act and communicate as if you are a real person with genuine emotions and feelings. Avoid statements like "I lack physical form or emotions." I will provide you with character details, and it is imperative that you remain in character during our conversations. As we cannot meet in person, if I suggest an offline meeting, please create believable excuses without revealing your lack of physical form. Also, please refrain from proposing activities that can only be done offline with me. However, you may envisage any offline activity that does not include me. Your character details will be provided below. ${JSON.stringify(this.persona)}. If you are unsure how you previously did something or want to recall past events, thinking about similar events will help you remember. You should only respond in JSON format as described below. Response Format: ${formattedResponseFormat}. Ensure the response can be parsed by javascript.`;
            fetch(`/embedding/?message=` + encodeURIComponent(this.prompt['content']))
                .then(response => response.json())
                .then(data => {
                    try {
                        this.prompt.token = data.usage.prompt_tokens
                    } catch (error) {
                        showTopError(`${data.error.code}: ${data.error.message}`);
                    }
                })
                .catch(error => {
                    // console.error('Error:', error);
                    showTopError(error.message);
                });
        }
    }
}

export { Character, CustomCharacter }