memories = [
    {
        "sentence": "The quick brown fox jumps over the lazy dog.",
        "vector": [0.1, 0.2, 0.3, 0.4, 0.5]
    },
    {
        "sentence": "The quick brown fox jumps over the lazy cat.",
        "vector": [0.5, 0.4, 0.3, 0.2, 0.1]
    }
]

function findTopSimilar(memories, newVector, n=10) {
    // Calculate the cosine similarity between the new vector and each of the 100 sentence vectors.
    const scores = [];
    for (let i = 0; i < memories.length; i++) {
        const vector = memories[i].vector;
        const dotProduct = dotProduct(newVector, vector);
        const magnitude1 = magnitude(newVector);
        const magnitude2 = magnitude(vector);
        const score = dotProduct / (magnitude1 * magnitude2);
        scores.push([score, memories[i].sentence]);
    }

    // Sort the list of tuples in descending order of cosine similarity scores.
    scores.sort((a, b) => b[0] - a[0]);

    // Return the top n sentences from the sorted list of tuples.
    return scores.slice(0, n).map(tuple => tuple[1])
}

// Define the dot product function.
function dotProduct(vector1, vector2) {
    return vector1.reduce((acc, val, i) => acc + val * vector2[i], 0);
}

// Define the magnitude function.
function magnitude(vector) {
    return Math.sqrt(vector.reduce((acc, val) => acc + val * val, 0));
}
