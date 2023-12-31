const INPUTS = {
    1: [[TYPE.REG], [TYPE.REG, TYPE.CONST, TYPE.LABEL], [TYPE.REG, TYPE.CONST, TYPE.LABEL]],
    2: [[TYPE.REG], [TYPE.REG, TYPE.CONST, TYPE.LABEL], [TYPE.REG, TYPE.CONST, TYPE.LABEL]],
    3: [[TYPE.REG], [TYPE.REG, TYPE.CONST, TYPE.LABEL], []],
    4: [[TYPE.REG], [TYPE.REG, TYPE.CONST, TYPE.LABEL], []],
    5: [[TYPE.REG], [TYPE.REG, TYPE.CONST, TYPE.LABEL], []],
    6: [[TYPE.REG], [TYPE.REG, TYPE.CONST, TYPE.LABEL], []],
    7: [[TYPE.REG], [TYPE.REG, TYPE.CONST, TYPE.LABEL], []],
    8: [[TYPE.REG], [TYPE.REG, TYPE.CONST, TYPE.LABEL], []],
    9: [[TYPE.REG], [TYPE.CONST, TYPE.LABEL], []],
    10: [[TYPE.REG, TYPE.RAMADDRESS], [TYPE.REG], []],
    11: [[TYPE.REG], [TYPE.REG, TYPE.RAMADDRESS]],
    12: [[TYPE.REG], [TYPE.REG, TYPE.CONST, TYPE.LABEL], []],
    13: [[TYPE.REG], [], []],
    14: [[TYPE.REG], [], []],
    15: [[TYPE.REG], [TYPE.REG, TYPE.CONST, TYPE.LABEL], [TYPE.REG, TYPE.CONST, TYPE.LABEL]],
    16: [[TYPE.REG], [TYPE.REG, TYPE.CONST, TYPE.LABEL], [TYPE.REG, TYPE.CONST, TYPE.LABEL]],
    17: [[TYPE.REG], [TYPE.REG, TYPE.CONST, TYPE.LABEL], []],
    18: [[TYPE.REG], [TYPE.REG, TYPE.CONST, TYPE.LABEL], [TYPE.REG, TYPE.CONST, TYPE.LABEL]],
    19: [[TYPE.REG], [TYPE.REG, TYPE.CONST, TYPE.LABEL], [TYPE.REG, TYPE.CONST, TYPE.LABEL]],
    20: [[TYPE.REG], [TYPE.REG, TYPE.CONST, TYPE.LABEL], [TYPE.REG, TYPE.CONST, TYPE.LABEL]],
    21: [[TYPE.REG], [TYPE.REG, TYPE.CONST, TYPE.LABEL], [TYPE.REG, TYPE.CONST, TYPE.LABEL]],
    22: [[TYPE.LABEL, TYPE.CONST, TYPE.RELADDRESS], [TYPE.REG, TYPE.CONST, TYPE.LABEL], [TYPE.REG, TYPE.CONST, TYPE.LABEL]],
    23: [[TYPE.LABEL, TYPE.CONST, TYPE.RELADDRESS], [TYPE.REG, TYPE.CONST, TYPE.LABEL], [TYPE.REG, TYPE.CONST, TYPE.LABEL]],
    24: [[TYPE.LABEL, TYPE.CONST, TYPE.RELADDRESS], [TYPE.REG, TYPE.CONST, TYPE.LABEL], [TYPE.REG, TYPE.CONST, TYPE.LABEL]],
    25: [[TYPE.LABEL, TYPE.CONST, TYPE.RELADDRESS], [TYPE.REG, TYPE.CONST, TYPE.LABEL], [TYPE.REG, TYPE.CONST, TYPE.LABEL]],
    26: [[TYPE.LABEL, TYPE.CONST, TYPE.RELADDRESS], [TYPE.REG, TYPE.CONST, TYPE.LABEL], [TYPE.REG, TYPE.CONST, TYPE.LABEL]],
    27: [[TYPE.LABEL, TYPE.CONST, TYPE.RELADDRESS], [TYPE.REG, TYPE.CONST, TYPE.LABEL], [TYPE.REG, TYPE.CONST, TYPE.LABEL]],
    28: [[TYPE.LABEL, TYPE.CONST, TYPE.RELADDRESS], [TYPE.REG, TYPE.CONST, TYPE.LABEL], [TYPE.REG, TYPE.CONST, TYPE.LABEL]],
    29: [[TYPE.LABEL, TYPE.CONST, TYPE.RELADDRESS], [TYPE.REG, TYPE.CONST, TYPE.LABEL], [TYPE.REG, TYPE.CONST, TYPE.LABEL]],
    30: [[TYPE.LABEL, TYPE.CONST, TYPE.RELADDRESS], [TYPE.REG, TYPE.CONST, TYPE.LABEL], [TYPE.REG, TYPE.CONST, TYPE.LABEL]],
    31: [[TYPE.LABEL, TYPE.CONST, TYPE.RELADDRESS], [TYPE.REG, TYPE.CONST, TYPE.LABEL], [TYPE.REG, TYPE.CONST, TYPE.LABEL]],
    32: [[TYPE.LABEL, TYPE.CONST, TYPE.RELADDRESS], [TYPE.REG], []],
    33: [[TYPE.LABEL, TYPE.CONST, TYPE.RELADDRESS], [TYPE.REG], []],
    34: [[TYPE.LABEL, TYPE.CONST, TYPE.RELADDRESS], [TYPE.REG], []],
    35: [[TYPE.LABEL, TYPE.CONST, TYPE.RELADDRESS], [TYPE.REG], []],
    36: [[TYPE.LABEL, TYPE.CONST, TYPE.RELADDRESS], [], []],
    37: [[TYPE.LABEL, TYPE.REG, TYPE.RELADDRESS], [TYPE.REG], []],
    38: [[TYPE.LABEL, TYPE.REG, TYPE.RAMADDRESS], [TYPE.LABEL, TYPE.REG, TYPE.RAMADDRESS]],
    39: [[], [], []],
    40: [[], [], []],
    0: [[], [], []],
    41: [[TYPE.REG], [TYPE.PORT]],
    42: [[TYPE.REG], [TYPE.PORT]],
}



function compileInstruction(abstractInstruction, reducingLevel){
    let id = Object.keys(OPCODE).find(key => OPCODE[key] === abstractInstruction[0])
    let opcode = document.getElementById(`opcode_${id}`).value
    let types = []
    let operands = []
    for(let i of abstractInstruction[1]){
        console.log(`type_${
            Object.keys(TYPE).find(key => TYPE[key] === i[0])}`)
        types.push(document.getElementById(`type_${
            Object.keys(TYPE).find(key => TYPE[key] === i[0])}`).value)
        operands.push(i[1])
    }

    let result = []
    let bytesize = canvas.bytesize

    let opcodebigalign = Number(document.getElementById("bitalign_OPCODE").value)
    let operandbitalign = Number(document.getElementById("bitalign_OPERAND").value)
    let operandtypebitalign = Number(document.getElementById("bitalign_TYPE").value)
    let discardtypes = Number(document.getElementById("typediscard").checked)

    result.push(compileBits(opcode, 1, opcodebigalign))
    for(let i = 0; i < types.length; i++){
        result.push(compileBits((operands[i] >>> 0).toString(2), 2+i, operandbitalign))
        if(discardtypes){
            if(INPUTS[abstractInstruction[0]][i].length > 2){
                result.push(compileBits((types[i] >>> 0).toString(2), 5+i, operandtypebitalign))
            }
            continue
        }
        result.push(compileBits((types[i] >>> 0).toString(2), 5+i, operandtypebitalign))
    }

    let r = ""
    for(let i = 0; i < result[0].length; i++){
        toCheck = false
        for(let j = 0; j < result.length; j++){
            if(result[j][i] != "-"){
                toCheck = true
                break
            }
        }
        if(!toCheck){
            r += "-"
            continue
        }
        pre = 0
        for(let j = 0; j < result.length; j++){
            pre |= result[j][i]
        }
        r += pre ? "1" : "0"
    }
    if(reducingLevel == 0){
        return r.replace(/-/g, "0")
    }
    for(let i = r.length - 1; i >= 0; i--){
        if(r[i] != "-"){
            let l = Math.ceil((i + 1)/bytesize)
            if(reducingLevel == 1){
                return r.slice(0, l * bytesize).replace(/-/g, "0")
            }if(reducingLevel == 2){
                return r.slice(0, i + 1).replace(/-/g, "0")
            }
        }
    }
    return r.replace(/-/g, "0")
}

function compileBits(bytecode, type, bitalign){
    let l = canvas.bytesize*canvas.modules
    let result = Array(l).fill("-")

    bytecode = "0".repeat(bits - bytecode.length) + bytecode
    if((bitalign == 1) | (bitalign == 2)){
        bytecode = bytecode.split("").reverse().join("")
    }
    c = 0
    if(bitalign % 2 == 0){
        for(let i = 0; i < result.length; i++){
            if(canvas.checkForAt(type, i)){
                result[i] |= Number(bytecode[c])
                c ++
            }
            if(c >= bytecode.length){
                break
            }
        }
    }else{
        for(let i = result.length - 1; i >= 0; i--){
            if(canvas.checkForAt(type, i)){
                result[i] |= Number(bytecode[c])
                c ++
            }
            if(c >= bytecode.length){
                break
            }
        }
    }
    return result
}

function compileCode(abstraction){
    let result = ""
    let useflen = Number(document.getElementById("useflen").checked)
    let flen = Number(document.getElementById("flen").value)
    for(let i of abstraction){
        let pre = compileInstruction(i, Number(!useflen))
        if(useflen){
            let l = flen * canvas.bytesize
            pre = pre.slice(0, l)
            pre += "0".repeat(l - pre.length)
        }
        result += pre
    }
    resultArray = new Uint8Array(Math.ceil(result.length / 8))
    for(let i = 0; i < result.length; i+=8){
        if(i + 8 > result.length){
            resultArray[i/8] = Number("0b" + result.slice(i, i + 8) + "0".repeat(result.length % 8))
            break
        }
        resultArray[i/8] = Number("0b" + result.slice(i, i + 8))
    }

    return resultArray
}