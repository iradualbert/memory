const randomNumber = range => {
    return Math.floor(Math.random() * range + 1)
}
    

const generateRandomArray = (size, range) => {
    if(range===undefined){
        range = size
    }
    const arr = []
    for (let i =0; i < size; i++){
        let n = randomNumber(range)
        arr.push(n)
    }
    return arr
}
const toBinary = value => value.toString(2);
const toHex = value => "0x" + value.toString(16).toUpperCase();
const cloneArray = arr => [...arr]
const cloneObject = obj => JSON.parse(JSON.stringify(obj))
export {
    generateRandomArray,
    cloneArray,
    cloneObject,
    toBinary,
    toHex,
}