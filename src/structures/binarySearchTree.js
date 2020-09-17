import Node from "./node";
function Tree() {
    this.root = null;
    this.nodes = []
}

Tree.prototype.addValue = function (value) {
    const newNode = new Node(value);
    this.nodes.push(newNode)
    if (this.root === null) {
        newNode.x = 50;
        newNode.y = 50;
        this.root = newNode
    } else {
        this.root.addNode(newNode)
    }

};
Tree.prototype.traverse = function () {
    if (this.root !== null) {
        this.root.visit()
    }

};

Tree.prototype.search = function (value) {
    return this.root.search(value)
}

Tree.prototype.deleteValue = function (value) {
    let found = this.search(value)
    if (found !== null) {

    }
};

export default Tree;