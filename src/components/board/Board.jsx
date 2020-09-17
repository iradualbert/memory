import React from "react";
import Box from "./Box";
import "./Board.css";
import {
    cloneArray
} from "../../helpers/utils";

function Byte (address, value){
    this.value = value;
    this.address = address;
    this.free = true
}

class Board extends React.Component {
    state = {
        memory: []
    }
    componentDidMount(){
        this.createMemory()
        setTimeout(() => {
            console.log(this.getFreeSpots(1))
            console.log(this.getFreeSpots(5))
            console.log(this.getFreeSpots(6))
            console.log(this.getFreeSpots(7))
            console.log(this.getFreeSpots(10))
            console.log(this.getFreeSpots(13))
        }, 1000);
        
        
    }
    createMemory(){
        const memory = [];
        for(let i=0; i <200; i++){
            const free = Math.floor(Math.random() * 10) === 5 ? false : true
            const newByte = new Byte(i)
            newByte.free = free;
            memory.push(newByte)
        }
        this.setState({memory: memory})
    };

    getFreeSpots = (value) => {
        const memory = cloneArray(this.state.memory);
        let freeSpots = 0;
        for(let i=0; i < memory.length; i++){
            if(memory[i].free){
                freeSpots ++;
                if(freeSpots === value){
                    return memory[i + 1 - value].address
                }
            } else {
                freeSpots = 0;
            }
        }
        return -1

    };

    calculateSize = object => {

        
    };
    render(){
        const { memory } = this.state
        return (
            <div className="board">
            {memory.map((byte, index) => {
                   return (
                       <Box
                           key={index}
                           byte={byte}
                       />
                   )
               })}
            </div>
        )
    }
}

export default Board;