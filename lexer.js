const OPCODE = {
    ADD: 1,
    SUB: 2,
    RSH: 3,
    LSH: 4,
    INC: 5,
    DEC: 6,
    NEG: 7,
    ABS: 8,
    IMM: 9,
    LOD: 10,
    STR: 11,
    MOV: 12,
    PSH: 13,
    POP: 14,
    OR: 15,
    NOR: 16,
    NOT: 17,
    XOR: 18,
    XNOR: 19,
    AND: 20,
    NAND: 21,
    BRL: 22,
    BGE: 23,
    BLE: 24,
    BRG: 25,
    BRE: 26,
    BNE: 27,
    BRZ: 28,
    BNZ: 29,
    BRN: 30,
    BRP: 31,
    BOD: 32,
    BEV: 33,
    BRC: 34,
    BNC: 35,
    CAL: 36,
    JMP: 37,
    CPY: 38,
    RET: 39,
    HLT: 40,
    NOP: 0,
    IN: 41,
    OUT: 42,
}
const STRINGTYPE = {
    INSTRUCTION: 1,
    LABEL: 2,
    DW: 3
}
const TYPE = {
    IMM: 0,
    REG: 1,
    LABEL: 2,
    RAMADDRESS: 3,
    RELADDRESS: 4,
    CONST: 6,
    PORT: 7,
}
const PORT = {
    CPUBUS: 1,
    TEXT: 2,
    NUMB: 3,
    SUPPORTED: 4,
    SPECIAL: 5,
    PROFILE: 6,
    X: 7,
    Y: 8,
    COLOR: 9,
    BUFFER: 10,
    G_SPECIAL: 11,
    ASCII: 12,
    CHAR5: 13,
    CHAR6: 14,
    ASCII7: 15,
    UTF8: 16,
    UTF16: 17,
    UTF32: 18,
    T_SPECIAL: 19,
    INT: 20,
    UINT: 21,
    BIN: 22,
    HEX: 23,
    FLOAT: 24,
    FIXED: 25,
    N_SPECIAL: 26,
    ADDR: 27,
    BUS: 28,
    PAGE: 29,
    S_SPECIAL: 30,
    RNG: 31,
    NOTE: 32,
    INSTR: 33,
    NLEG: 34,
    WAIT: 35,
    NADDR: 36,
    DATA: 37,
    M_SPECIAL: 38,
    UD1: 39,
    UD2: 40,
    UD3: 41,
    UD4: 42,
    UD5: 43,
    UD6: 44,
    UD7: 45,
    UD8: 46,
    UD9: 47,
    UD10: 48,
    UD11: 49,
    UD12: 50,
    UD13: 51,
    UD14: 52,
    UD15: 53,
    UD16: 54,
    GAMEPAD: 55,
    AXIS: 56,
    GAMEPAD_INFO: 57,
    KEY: 58,
    MOUSE_X: 59,
    MOUSE_Y: 60,
    MOUSE_DX: 61,
    MOUSE_DY: 62,
    MOUSE_DWHEEL: 63,
    MOUSE_BUTTONS: 64,
    FILE: 65,
    DBG_INT: 66,
    BENCHMARK: 67,
}


consts = {}
vars = {}
points = {}
pointers = {}
addresses = [0]

bits = 8

function parse(raw){
    let code = []
    for(let i of raw.split(/\r?\n\r?/)){
        let str = i.trim()
        let r = ""
        let line = []
        for(let c = 0; c <= str.length; c++){
            if(c >= str.length | ((str[c] == "/" & c+1 < str.length) & str[c+1] == "/")){
                if(r.length > 0){
                    line.push(r)
                    r = ""
                }
                if((line.length > 0) & (line[0] != "//")){
                    code.push(line.slice())
                    line = []
                    break
                }
            }
            if(str[c] == " "){
                if(r.length > 0){
                    line.push(r)
                    r = ""
                }
            }else if(str[c] == "'"){
                c++
                let s = ""
                let start = c
                while(c < str.length){
                    if(str[c] == "'"){
                        s = str.slice(start, c)
                        r = `'${s}'`
                        break
                    }
                    c++
                }
            }else{
                r += str[c]
            }
        }

    }
    return code
}

function parseArgument(raw){
    if(/^-?[0-9]+$/i.test(raw)){
        return [TYPE.CONST, Number(raw)]
    }
    if(/^(0x)[0-9a-f]+$/i.test(raw)){
        return [TYPE.CONST, Number(raw)]
    }
    if(/^(0b)[01]+$/i.test(raw)){
        return [TYPE.CONST, Number(raw)]
    }
    if(/^(r|\$)[0-9]+$/i.test(raw)){
        return [TYPE.REG, Number(raw.slice(1)) + 2]
    }
    if(/^(m|\#)[0-9]+$/i.test(raw)){
        return [TYPE.RAMADDRESS, Number(raw.slice(1))]
    }
    if(raw[0] == "%"){
        if(!Object.keys(PORT).includes(raw.slice(1).toUpperCase())) return [TYPE.PORT, PORT.UD1]
        return [TYPE.PORT, PORT[raw.slice(1).toUpperCase()]]
    }
    if(Object.keys(consts).includes(raw.toUpperCase())) return [TYPE.CONST, consts[raw.toUpperCase()]]
    if(Object.keys(vars).includes(raw.toUpperCase())) return [TYPE.REG, vars[raw.toUpperCase()]]
    if(Object.keys(points).includes(raw.toUpperCase())){
        if(!Number(document.getElementById("useflen").checked)) return [TYPE.LABEL, points[raw.toUpperCase()]]

        return [TYPE.LABEL, addresses[points[raw.toUpperCase()]]]
    }
    if(Object.keys(pointers).includes(raw.toUpperCase())) return [TYPE.RAMADDRESS, pointers[raw.toUpperCase()]]
    if((raw[0] == "'"&raw[raw.length-1] == "'")|(raw[0] == '"'&raw[raw.length-1] == '"')){
        return [TYPE.CONST, textToBin(raw.slice(1, -1).replace(/\\[nbvfrt'"\\]/gi, m => {return {
            "\\n": "\n",
            "\\b": "\b",
            "\\v": "\v",
            "\\f": "\f",
            "\\r": "\r",
            "\\t": "\t",
            "\\'": "\'",
            "\\\"": "\"",
            "\\\\": "\\",
        }[m]}), false)]
    }
    return [TYPE.REG, 2]
}

function lex(raw){

    consts = {}
    vars = {}
    points = {}
    pointers = {}
    addresses = [0]

    bits = 8

    step = -1
    definedram = 0

    code = []

    for(let i = 0; i < raw.length; i++){
        if(raw[i][0][0] == "."){
            if((raw[i + 1][0].toUpperCase() == "DW") & (i + 1 < raw.length)){
                pointers[raw[i][0].toUpperCase()] = definedram
            }else{
                points[raw[i][0].toUpperCase()] = step + 1
            }
            continue
        }else if(Object.keys(OPCODE).includes(raw[i][0].toUpperCase())){
            addresses.push(addresses[addresses.length - 1] + INPUTS[OPCODE[raw[i][0].toUpperCase()]].filter(m => m.length > 0).length + 1)
            step++
        }else if(raw[i][0].toUpperCase() == "@DEFINE"){
            if(raw[i].length < 3) continue
            let a = parseArgument(raw[i][2])
            if(a[0] == TYPE.REG){
                vars[raw[i][1].toUpperCase()] = a[1]
            }
            else if(a[0] == TYPE.CONST){
                consts[raw[i][1].toUpperCase()] = a[1]
            }
        }else if(raw[i][0].toUpperCase() == "DW"){
            if(raw[i].length < 2) continue
            if(raw[i][1][0] == "["){
                let a = raw[i].slice(1).join(" ")
                definedram += parseArray(a).length
            }else{
                definedram += 1
            }
            continue
        }else if(raw[i][0].toUpperCase() == "BITS"){
            if(raw[i].length < 3) continue
            bits = Number(raw[i][2])
        }
    }

    for(let i = 0; i < raw.length; i++){
        if(Object.keys(OPCODE).includes(raw[i][0].toUpperCase())){
            let newcommand = [OPCODE[raw[i][0].toUpperCase()], []]
            for(let a = 1; a < raw[i].length; a++){
                newcommand[1].push(parseArgument(raw[i][a]))
            }
            code.push(newcommand)
        }
    }
    return code
}

function parseArray(text, convertText = false, open="[", close="]", separator=" "){
    var result = []
    for(let i of text.slice(1, -1).split(separator)){
        i = i.trim()
        if(/^\s?-?[0-9]+$/i.test(i)){
            result.push( Number(i) )
        }
        else if(/^\s?-?\b(h|0x)[0-9a-f]+$/i.test(i)){
            result.push( Number(i.toLowerCase()) )
        }
        else if(/^\s?-?\b(b|0b)[01]+$/i.test(i)){
            result.push( Number(i.toLowerCase()) )
        }
        else if((i[0] == '"' && i[i.length - 1] == '"')|(i[0] == "'" && i[i.length - 1] == "'")){
            if(convertText){
                for(let c of i.slice(1, -1)){
                    result.push(c.charCodeAt(0))
                }
            }else{
                result.push(i.slice(1, -1))
            }
        }else if(/^.*$/i.test(i)){
            result.push(i)
        }
    }

    return result
}

function textToBin(text, isArray=false){
    const result = [];
    for (let i = 0; i < text.length; i += 1) {
        const hi = text.charCodeAt(i);
        if (hi < 0x0080) {
            result.push(hi);
            continue;
        }
        if (hi < 0x0800) {
            result.push(0xC0 | hi >> 6,
                        0x80 | hi       & 0x3F);
            continue;
        }
        if (hi < 0xD800 || hi >= 0xE000 ) {
            result.push(0xE0 | hi >> 12,
                        0x80 | hi >>  6 & 0x3F,
                        0x80 | hi       & 0x3F);
            continue;
        }
        i += 1;
        if (i < text.length) {
            const lo = text.charCodeAt(i);
            const code = 0x00010000 + (hi & 0x03FF) << 10 | lo & 0x03FF;
            result.push(0xF0 | code >> 18,
                        0x80 | code >> 12 & 0x3F,
                        0x80 | code >>  6 & 0x3F,
                        0x80 | code       & 0x3F);
        } else {
            break;
        }
    }
    if(isArray){
        return result;
    }else{
        let r = 0
        for(let i of result){
            r <<= 8
            r |= (i>>>0)
        }
        return r
    }
};