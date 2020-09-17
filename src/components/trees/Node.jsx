import React from "react";

const Node = props => {
    const {
        value,
        x,
        y,
        left,
        right
    } = props.node;

    return (
        <div className="node" style={{left: x, top: y}}>
           {value}
            {left && <div className="pointer left"></div>}
           {right && <div className="pointer right"></div>}
        </div>
    )
}

export default Node;