import React, { Component } from 'react';
import './BST.css';
import BST from "../../structures/binarySearchTree";
import Node from "./Node";
import { generateRandomArray } from "../../helpers/utils";



class BinarySearchTree extends Component {
    state = {
       tree: null,
       nodes : []
    }
    componentDidMount(){
       this.generateRandomTree()
    
    }

    generateRandomTree = async () => {
        const tree = new BST();
        const arr = generateRandomArray(10)
        arr.forEach(value => tree.addValue(value))
        await this.setState({tree: tree, nodes: tree.nodes})
    }

    drawBST = () => {
    
    }

    render() {
        const {
            nodes
        } = this.state
        return (
            <div className="bst"> 
                <button onClick={this.generateRandomTree}> Generate Random Tree</button>
                {nodes.map((node, index) => <Node key={index} node={node} />)}
            </div>
        )
    }
}



export default BinarySearchTree;