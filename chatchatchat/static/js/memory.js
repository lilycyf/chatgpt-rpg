// memories = [
//     {
//         "sentence": "The quick brown fox jumps over the lazy dog.",
//         "vector": [0.1, 0.2, 0.3, 0.4, 0.5],
//         "token": 10
//     },
//     {
//         "sentence": "The quick brown fox jumps over the lazy cat.",
//         "vector": [0.5, 0.4, 0.3, 0.2, 0.1],
//         "token": 9
//     }
// ]

function findTopSimilar(memories, newVector, n = 10, maxToken = 2500) {
    // Create a min-heap of size n to store the top n items.
    const heap = new MinHeap(n);

    // Iterate through the list of items and add each item to the heap.
    for (let i = 0; i < memories.length; i++) {
        const vector = memories[i].vector;
        const dotProduct = dotProduct(newVector, vector);
        const magnitude1 = magnitude(newVector);
        const magnitude2 = magnitude(vector);
        const score = dotProduct / (magnitude1 * magnitude2);
        const item = [score, memories[i]];

        // If the heap is not yet full, add the item.
        // If the heap is full and the current item has a higher score than the smallest item in the heap, replace the smallest item with the current item.
        if (heap.size() < 10) {
            heap.insert(item);
        } else if (score > heap.peek()[0]) {
            heap.extractMin();
            heap.insert(item);
        }
    }

    // Extract the top 10 items from the heap.
    const topMemories = heap.extractAllMin();
    topMemories.sort((a, b) => b[0] - a[0]);
    const sortedTop = topMemories.map(item => item[1])

    for (let i = 0; i < 10; i++) {
        const topn = sortedTop.slice(0, n - i)

        const totalToken = topn.map(tuple => tuple["token"]).reduce((accumulator, currentValue) => {
            return accumulator + currentValue;
        });

        if (maxToken > totalToken) {
            // Return the top n sentences from the sorted list of tuples.
            return [topn.map(tuple => tuple["sentence"]), totalToken]
        }
    }
    return [[], 0];
}

// Define the dot product function.
function dotProduct(vector1, vector2) {
    return vector1.reduce((acc, val, i) => acc + val * vector2[i], 0);
}

// Define the magnitude function.
function magnitude(vector) {
    return Math.sqrt(vector.reduce((acc, val) => acc + val * val, 0));
}

export { findTopSimilar }