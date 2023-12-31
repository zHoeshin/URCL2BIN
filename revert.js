function deAbstractCode(abstraction){
    let result = ""
    for(let i of abstraction){
        if(!Object.keys(OPCODE).find(key => OPCODE[key] === i[0])) continue
        
        result += Object.keys(OPCODE).find(key => OPCODE[key] === i[0])
        result += " "
        for(let a of i[1]){
            result += deAbstractArgument(a)
            result += " "
        }
        result += "\n"
    }
    return result
}

function deAbstractArgument(abstractArgument){
    switch(abstractArgument[0]){
        case TYPE.CONST: return String(abstractArgument[1])
        case TYPE.REG:
            if(abstractArgument[1] == 0) return "PC"
            if(abstractArgument[1] == 1) return "SP"
            return "r" + String(abstractArgument[1] - 2)
        case TYPE.RAMADDRESS: return "m" + String(abstractArgument[1])
        case TYPE.PORT: return "%" + Object.keys(PORT).find(key => PORT[key] === abstractArgument[1])
    }
}