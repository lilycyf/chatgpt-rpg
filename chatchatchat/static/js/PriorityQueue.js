class PriorityQueue {
    constructor() {
      this.items = [];
    }
    
    enqueue(item, priority) {
      this.items.push({ item, priority });
      this.bubbleUp(this.items.length - 1);
    }
    
    dequeue() {
      const minItem = this.items[0];
      const endItem = this.items.pop();
      if (this.items.length > 0) {
        this.items[0] = endItem;
        this.bubbleDown(0);
      }
      return minItem.item;
    }
    
    updatePriority(item, priority) {
      const index = this.items.findIndex(elem => elem.item === item);
      if (index !== -1) {
        this.items[index].priority = priority;
        this.bubbleUp(index);
      }
    }
    
    isEmpty() {
      return this.items.length === 0;
    }
    
    bubbleUp(index) {
      const item = this.items[index];
      while (index > 0) {
        const parentIndex = Math.floor((index - 1) / 2);
        const parent = this.items[parentIndex];
        if (item.priority >= parent.priority) {
          break;
        }
        this.items[parentIndex] = item;
        this.items[index] = parent;
        index = parentIndex;
      }
    }
    
    bubbleDown(index) {
      const item = this.items[index];
      while (true) {
        const leftChildIndex = 2 * index + 1;
        const rightChildIndex = 2 * index + 2;
        let leftChild, rightChild;
        let swapIndex = null;
        
        if (leftChildIndex < this.items.length) {
          leftChild = this.items[leftChildIndex];
          if (leftChild.priority < item.priority) {
            swapIndex = leftChildIndex;
          }
        }
        
        if (rightChildIndex < this.items.length) {
          rightChild = this.items[rightChildIndex];
          if ((swapIndex === null && rightChild.priority < item.priority) ||
              (swapIndex !== null && rightChild.priority < leftChild.priority)) {
            swapIndex = rightChildIndex;
          }
        }
        
        if (swapIndex === null) {
          break;
        }
        
        this.items[index] = this.items[swapIndex];
        this.items[swapIndex] = item;
        index = swapIndex;
      }
    }
  }
  