const canvas = {
    ctx: null,
    canvas: null,
    lines: [
        [],
        [],
        [],
        []
    ],
    bytesize: 8,
    modules: 0,
    types: ["#ffffff", "#ff8888", "#ff2222", "#22ff22", "#2222ff", "#aa8888", "#88aa88", "#8888aa"],
    selected: 0,
    setUp(){
        let c = document.querySelector("canvas")
        this.ctx = c.getContext("2d")
        c.style.width = "0em"
        c.style.height = "5em"
        c.width = 0
        c.height = 100
        this.canvas = c
    },
    drawGrid(){
        let ctx = this.ctx
        ctx.fillStyle = "#000000ff"
        let w = this.canvas.width
        let h = this.canvas.height
        for(let i = 0; i < w; i+=20){
            ctx.fillStyle = i/20 % this.bytesize == 0 ? "#000000ff" : "#aaaaaaff"
            ctx.fillRect(i, 0, 1 + (i/20 % this.bytesize == 0), 100)
        }
        for(let i = 0; i < h; i+=20){
            ctx.fillStyle = h - i < 21 ? "#000000ff" : "#aaaaaaff"
            ctx.fillRect(0, i, w, 1 + (h - i < 21))
        }
    },
    addModule(){
        for(let i of this.lines){i.push(...Array(this.bytesize).fill(0))}
        this.canvas.width += this.bytesize * 20
        this.canvas.style.width = `${this.canvas.width / 20}em`
        this.drawGrid()
        this.draw()
        this.modules++
    },
    removeModule(force=false){
        if(this.modules < (force ? 1 : 2)) return
        for(let i of this.lines){i.length = i.length - this.bytesize}
        this.canvas.width -= this.bytesize * 20
        this.canvas.style.width = `${this.canvas.width / 20}em`
        this.drawGrid()
        this.draw()
        this.modules--
    },
    changeByteSize(newsize){
        let modules = Math.ceil(this.lines[0].length / newsize)
        let lines = [Array(modules*newsize).fill(0),Array(modules*newsize).fill(0),
            Array(modules*newsize).fill(0),Array(modules*newsize).fill(0)]
        let l = Math.min(lines[0].length, this.lines[0].length)
        for(let i = 0; i < l; i++){
            lines[0][i] = this.lines[0][i]
            lines[1][i] = this.lines[1][i]
            lines[2][i] = this.lines[2][i]
            lines[3][i] = this.lines[3][i]
        }
        this.modules = 0
        this.canvas.width = 0
        this.canvas.style.width = "0"
        this.bytesize = newsize
        for(let i = 0; i < modules; i++){
            this.addModule()
        }
        this.lines = lines
        this.draw()
    },
    paint(type, x, y){
        if(y > 3 | x > this.lines[0].length) return
        this.lines[y][x] = type
        this.ctx.fillStyle = this.types[type]
        this.ctx.fillRect(x*20+1, y*20+1, 19, 19)
        this.drawBottom(x)
    },
    draw(){
        for(let i = 0; i < this.lines[0].length; i++){
            this.paint(this.lines[0][i], i, 0)
            this.paint(this.lines[1][i], i, 1)
            this.paint(this.lines[2][i], i, 2)
            this.paint(this.lines[3][i], i, 3)
            this.drawBottom(i)
        }
    },
    drawBottom(x){
        let drawn = []
        for(let i = 0; i < 4; i ++){
            let v = this.lines[i][x]
            if(v != 0) drawn.push(v)
        }
        if(drawn.length == 0){
            this.ctx.fillStyle = this.types[0]
            this.ctx.fillRect(x*20+1, 81, 19, 19)
        }
        if(drawn.length == 1){
            this.ctx.fillStyle = this.types[drawn[0]]
            this.ctx.fillRect(x*20+1, 81, 19, 19)
        }
        if(drawn.length == 2){
            this.ctx.fillStyle = `${this.types[drawn[0]]}7f`
            this.ctx.fillRect(x*20+1, 81, 19, 19)
            this.ctx.fillStyle = `${this.types[drawn[1]]}7f`
            this.ctx.fillRect(x*20+1, 81, 19, 19)
        }
        if(drawn.length == 3){
            this.ctx.fillStyle = `${this.types[drawn[0]]}55`
            this.ctx.fillRect(x*20+1, 81, 19, 19)
            this.ctx.fillStyle = `${this.types[drawn[1]]}55`
            this.ctx.fillRect(x*20+1, 81, 19, 19)
            this.ctx.fillStyle = `${this.types[drawn[1]]}55`
            this.ctx.fillRect(x*20+1, 81, 19, 19)
        }
    },
    select(type){
        this.selected = type
        document.getElementById('sample').style.backgroundColor = canvas.types[type]
    },
    coundInLinesFor(n){
        let r = 0
        for(let i = 0; i < this.lines[0].length; i++){
            if((this.lines[0][i] == n)|(this.lines[1][i] == n)|(this.lines[2][i] == n)|(this.lines[3][i] == n)){
                r ++
            }
        }
        return r
    },
    findFirstInLines(n){
        for(let i = 0; i < this.lines[0].length; i++){
            if((this.lines[0][i] == n)|(this.lines[1][i] == n)|(this.lines[2][i] == n)|(this.lines[3][i] == n)){
                return i
            }
        }
        return -1
    },
    findLastInLines(n){
        for(let i = this.lines[0].length; i > 0; i--){
            if((this.lines[0][i] == n)|(this.lines[1][i] == n)|(this.lines[2][i] == n)|(this.lines[3][i] == n)){
                return i
            }
        }
        return -1
    },
    checkForAt(n, i){
        return (this.lines[0][i] == n)|(this.lines[1][i] == n)|(this.lines[2][i] == n)|(this.lines[3][i] == n)
    }
}

document.querySelector('canvas').onclick = function(e) {

    var rect = e.target.getBoundingClientRect();

    var x = Math.floor((e.clientX - rect.left) / 16); //x position within the element.
    var y = Math.floor((e.clientY - rect.top) / 16);  //y position within the element.

    canvas.paint(canvas.selected, x, y)
}




const file = {
    save(){
        let data = {
            types: {},
            opcodes: {},
            preferences: {},
            bitmask: [...canvas.lines]
        }
        let opcodenodes = document.getElementsByClassName("opcode")
        for(let i of opcodenodes){
            data.opcodes[i.id] = i.value
        }
        let typenodes = document.getElementsByClassName("type")
        for(let i of typenodes){
            data.types[i.id] = i.value
        }
        data.preferences = {
            bitalign_OPCODE: document.getElementById("bitalign_OPCODE").value,
            bitalign_TYPE: document.getElementById("bitalign_OPCODE").value,
            bitalign_OPERAND: document.getElementById("bitalign_OPCODE").value,
            
            useflen: document.getElementById("useflen").value,
            flen: document.getElementById("flen").value,
            bytesize: document.getElementById("bytesize").value,
            typediscard: document.getElementById("typediscard").value,
        }
        saveTxtToFile('urclcompilingsettings.json', JSON.stringify(data));
    },
    load(){

        var input = document.createElement('input')
        input.type = 'file'
        input.accept = 'json'

        input.onchange = e => { 

            var file = e.target.files[0]

            var reader = new FileReader()
            reader.readAsText(file,'UTF-8')
        
            reader.onload = readerEvent => {
                var content = JSON.parse(readerEvent.target.result)
                loadSettings(content)
            }

        }
        input.click();
    },
    compile(){
        let data = compileCode(lex(parse(editor.getValue())))
        saveBinToFile('compiledCode.bin', data)
    }
}


function saveTxtToFile(fileName, textData) {
    const blobData = new Blob([textData], { type: 'text/plain' });
    const urlToBlob = window.URL.createObjectURL(blobData);

    const a = document.createElement('a');
    a.style.setProperty('display', 'none');
    document.body.appendChild(a);
    a.href = urlToBlob;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(urlToBlob);
    a.remove();
}
function saveBinToFile(fileName, binData) {
    const blobData = new Blob([binData], { type: 'application/octet-stream' });
    const urlToBlob = window.URL.createObjectURL(blobData);

    const a = document.createElement('a');
    a.style.setProperty('display', 'none');
    document.body.appendChild(a);
    a.href = urlToBlob;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(urlToBlob);
    a.remove();
}

function loadSettings(content){
    for(let i of Object.keys(content["types"])){
        document.getElementById(i).value = content.types[i]
    }
    for(let i of Object.keys(content["opcodes"])){
        document.getElementById(i).value = content.opcodes[i]
    }
    for(let i of Object.keys(content["preferences"])){
        document.getElementById(i).value = content.preferences[i]
    }
    canvas.setUp()
    canvas.lines = content.bitmask
    canvas.bytesize = Number(content.preferences.bytesize)
    canvas.modules = Math.ceil(canvas.lines[0].length / canvas.bytesize)
    canvas.canvas.width = canvas.modules * canvas.bytesize * 20
    canvas.canvas.style.width = `${canvas.modules * canvas.bytesize}em`
    canvas.drawGrid()
    canvas.draw()
}