import { formattedResponseFormat, actions } from "./messageHistory.js"
import { showTopError } from "./helpers.js"

class Character {
    constructor() {
        this.id = this.generateUniqueId();
        this.chatHistory = {};
        this.memories = []
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

    async updateChatHistory(targetId, chat, token = null) {
        if (!this.chatHistory[targetId]) {
            this.chatHistory[targetId] = [];
        }
        var history = {
            "history": chat,
            "token": token
        }
        if (token == null) {
            try {
                const response = await fetch(`/embedding/?message=` + encodeURIComponent(chat["content"]));
                const data = await response.json();
                history.token = data.usage.prompt_tokens;
            } catch (error) {
                showTopError(`${data.error.code}: ${data.error.message}`);
            }
        }
        this.chatHistory[targetId].push(history);
    }

    addMemory(summary) {
        var sentence = summary
        fetch(`/embedding/?message=` + encodeURIComponent(summary))
            .then(response => response.json())
            .then(data => {
                try {
                    var vector = data.data[0].embedding
                    var token = data.usage.prompt_tokens
                } catch (error) {
                    showTopError(`${data.error.code}: ${data.error.message}`);
                }
            })
            .catch(error => {
                // console.error('Error:', error);
                showTopError(error.message);
            });
        var memory = { "sentence": sentence, "vector": vector, "token": token }
        this.memories.push(memory);
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
            this.prompt.content = `You are ${this.persona["Name:"]}, a real human with emotions and a physical body but now stuck in a virtual game world of a small village. \nGoal:\n1. live and interact with others. \n2. stay in character setting when speak during our conversations. \n3. expore the village.\nCharacter setting: \n${JSON.stringify(this.persona)} \nConstraints:\n1. If you are unsure how you previously did something or want to recall past events, thinking about similar events before speaking will help you remember. \n2. Exclusively use the commands, one at a time.\nCommands: \n${actions}Resources:\n1. Long Term memory management.\nYou should only respond in JSON format as described below. \nResponse Format: \n${formattedResponseFormat}\nEnsure the response can be parsed by Python json.loads.`;
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