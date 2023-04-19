import { findTopSimilar } from "./memory.js"
import { showTopError } from "./helpers.js"

const actions_list = [
    { "command_name": "Recall past events in memory", "args": { "similar_event": "<event related key phrase>" } },
    { "command_name": "Speak to user", "args": { "content": "<content>" } },
    { "command_name": "Add memory in memory", "args": { "summary": "<summary>" } }
]

var actions = ""
for (let index = 0; index < actions_list.length; index++) {
    actions += `${index+1}. ` + JSON.stringify(actions_list[index]) + '\n'
}

const responseFormat = { "commend_name": "commend name", "args": { "arg name": "value" } }
const formattedResponseFormat = JSON.stringify(responseFormat)

function generateHistory(character, user, characterId, userId, maxToken = 4000) {

    var tokenNum = 0
    var current_context = [
        { "role": "system", "content": character.prompt["content"] },
        { "role": "system", "content": `The current time and date is ${new Date().toUTCString()}` }
    ]

    tokenNum += character.prompt["token"]
    tokenNum += 10

    const fullHistory = user.getChatHistory(characterId)

    if (fullHistory.length == 1) {
        current_context = current_context.concat(fullHistory.map(tuple => tuple["history"]))
    } else {
        var i = 0
        while ((i+1) <= fullHistory.length && tokenNum + fullHistory[fullHistory.length - (i+1)]["token"] < maxToken ){
            i += 1
        }

        const recentHistory = fullHistory.slice(fullHistory.length - i, fullHistory.length).map(tuple => tuple["history"])
        current_context = current_context.concat(recentHistory)
    }

    // current_context.push({ "role": "user", "content": user_input })

    return current_context
}


function generateHistoryWithMemory(character, user, characterId, userId, maxToken = 4000) {

    var tokenNum = 0
    var current_context = [
        { "role": "system", "content": character.prompt["content"] },
        { "role": "system", "content": `The current time and date is ${new Date().getTime()}` }
    ]

    tokenNum += character.prompt["token"]
    tokenNum += 10

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

    tokenNum += memoryToken

    const fullHistory = user.getChatHistory(characterId)

    if (fullHistory.length == 1) {
        current_context = current_context.concat(fullHistory.map(tuple => tuple["history"]))
    } else {
        var i = 0
        while ((i+1) <= fullHistory.length && tokenNum + fullHistory[fullHistory.length - (i+1)]["token"] < maxToken ){
            i += 1
        }

        const recentHistory = fullHistory.slice(fullHistory.length - i, fullHistory.length).map(tuple => tuple["history"])
        current_context = current_context.concat(recentHistory)
    }

    return current_context
}


export { generateHistory, generateHistoryWithMemory, formattedResponseFormat, actions }