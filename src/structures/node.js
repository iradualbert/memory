function Node(value) {
    this.value = value;
    this.visited = false;
    this.left = null;
    this.right = null;
    this.x = null;
    this.y = null;
}

Node.prototype.addNode = function (newNode) {
    if (newNode.value > this.value) {
        if (this.right === null) {
            this.right = newNode;
            newNode.x = this.x + 100;
            newNode.y = this.y + 30;

        } else {
            this.right.addNode(newNode)
        }

    }
    else if (newNode.value < this.value) {
        if (this.left === null) {
            this.left = newNode
            newNode.x = this.x - 100
            newNode.y = this.y + 30
        } else {
            this.left.addNode(newNode)
        }
    }
};

Node.prototype.visit = function () {
    if (this.left !== null) {
        this.left.visit()
    }
    console.log(this.value)
    if (this.right !== null) {
        this.right.visit()
    }

};
Node.prototype.search = function (value) {
    if (this.value === value) {
        return this
    }
    else if (value < this.value && this.left !== null) {
        return this.left.search(value)
    }
    else if (value > this.value && this.right !== null) {
        return this.right.search(value)
    }
    return null
};

export default Node;
