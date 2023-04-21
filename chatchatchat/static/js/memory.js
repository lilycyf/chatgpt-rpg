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

class MinHeap {
    constructor(maxSize) {
        this.heap = [];
        this.maxSize = maxSize;
    }

    size() {
        return this.heap.length;
    }

    insert(item) {
        if (this.size() < this.maxSize) {
            this.heap.push(item);
            this._bubbleUp(this.size() - 1);
        } else if (this.size() === this.maxSize && item[0] > this.peek()[0]) {
            this.extractMin();
            this.insert(item);
        }
    }

    extractMin() {
        const min = this.heap[0];
        const end = this.heap.pop();
        if (this.size() > 0) {
            this.heap[0] = end;
            this._sinkDown(0);
        }
        return min;
    }

    extractAllMin() {
        const minHeap = [];
        while (this.size() > 0) {
            minHeap.push(this.extractMin());
        }
        return minHeap;
    }

    peek() {
        return this.heap[0];
    }

    _bubbleUp(index) {
        const item = this.heap[index];
        while (index > 0) {
            const parentIndex = Math.floor((index - 1) / 2);
            const parent = this.heap[parentIndex];
            if (item[0] < parent[0]) {
                this.heap[index] = parent;
                index = parentIndex;
            } else {
                break;
            }
        }
        this.heap[index] = item;
    }

    _sinkDown(index) {
        const item = this.heap[index];
        while (true) {
            const leftChildIndex = 2 * index + 1;
            const rightChildIndex = 2 * index + 2;
            let leftChild, rightChild;
            let swap = null;

            if (leftChildIndex < this.size()) {
                leftChild = this.heap[leftChildIndex];
                if (leftChild[0] < item[0]) {
                    swap = leftChildIndex;
                }
            }

            if (rightChildIndex < this.size()) {
                rightChild = this.heap[rightChildIndex];
                if ((swap === null && rightChild[0] < item[0]) ||
                    (swap !== null && rightChild[0] < leftChild[0])) {
                    swap = rightChildIndex;
                }
            }

            if (swap === null) {
                break;
            }

            this.heap[index] = this.heap[swap];
            index = swap;
        }
        this.heap[index] = item;
    }
}


function findTopSimilar(memories, newVector, n = 10, maxToken = 2500) {
    // Create a min-heap of size n to store the top n items.
    const heap = new MinHeap(n);

    // Iterate through the list of items and add each item to the heap.
    for (let i = 0; i < memories.length; i++) {
        const vector = memories[i].vector;
        const dotP = dotProduct(newVector, vector);
        const magnitude1 = magnitude(newVector);
        const magnitude2 = magnitude(vector);
        const score = dotP / (magnitude1 * magnitude2);
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