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

    updateChatHistory(targetId, chat) {
        if (!this.chatHistory[targetId]) {
            this.chatHistory[targetId] = [];
        }
        this.chatHistory[targetId].push(chat);
    }
}

class CustomCharacter extends Character {
    constructor(persona) {
        super();
        this.persona = persona;
    }

    getPersona() {
        return this.persona;
    }
}

export { Character, CustomCharacter }