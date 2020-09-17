import React, { useState } from "react";
import { toBinary, toHex } from "../../helpers/utils";

const Box = props => {
    const {
        byte
    } = props;
    const [showHex, setShowHex] = useState(true);
    return (
        <div className={byte.free ? "box" : "box occupied"} id={byte.address}>
            <p className="address">{showHex ? toHex(byte.address) : toBinary(byte.address)}</p>
        </div>
    )
}

export default Box;