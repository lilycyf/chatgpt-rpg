import { findTopSimilar } from "./memory.js"
import { showTopError } from "./helpers.js"

const actions = [
    { "action_name": "Recall past events", "args": { "content": "<content>" } },
    { "action_name": "Speak", "args": { "content": "<content>" } }
]

const responseFormat = { "action": { "name": "action name", "args": { "arg name": "value" } } }
const formattedResponseFormat = JSON.stringify(responseFormat)

function generateHistory(character, userId, action, user_input, maxToken = 4000) {

    var tokenNum = 0
    var current_context = [
        { "role": "system", "content": character.prompt["content"] },
        { "role": "system", "content": `The current time and date is ${new Date().getTime()}` }
    ]

    tokenNum += character.prompt["token"]
    tokenNum += timeToken

    if (action["action_name"] == "Recall past events") {
        const allMemory = character.getMemory()
        const content = actions["args"]["content"]
        var contentVector = []
        fetch(`/embedding/?message=` + encodeURIComponent(content))
                .then(response => response.json())
                .then(data => {
                    try {
                        contentVector = data.data[0].embedding
                    } catch (error) {
                        showTopError(`${data.error.code}: ${data.error.message}`);
                    }
                })
                .catch(error => {
                    // console.error('Error:', error);
                    showTopError(error.message);
                });
        var [relevantMemories, memoryToken] = findTopSimilar(allMemory, contentVector, n = 10)
        current_context.push({ "role": "system", "content": `This reminds you of these events from your past:${relevantMemories.join("\n")}` })
    }

    tokenNum += memoryToken

    const fullHistory = character.getChatHistory(userId)

    var i = 0
    while (tokenNum + fullHistory[i - 1]["token"] < maxToken) {
        i -= 1
    }

    const recentHistory = fullHistory.slice(i).map(tuple => tuple["history"])
    current_context = current_context.concat(recentHistory)

    if (action["action_name"] == "Speak") {
        current_context.push({ "role": "user", "content": user_input })
    }


    return current_context
}


export { generateHistory, formattedResponseFormat }