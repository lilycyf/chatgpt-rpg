prompt = ""

relevant_memory = ""

current_context = [
    { "role": "system", "content": prompt},
    { "role": "system", "content": `The current time and date is ${new Date().getTime()}`},
    { "role": "system", "content": `This reminds you of these events from your past:${relevant_memory}`}
]