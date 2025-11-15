'use strict'

var gElCanvas
var gCtx

gElCanvas = document.querySelector('canvas')
gCtx = gElCanvas.getContext('2d')

function renderMeme() {

    const images = getImgs()
    const currMeme = getMeme()
    const memeUrl = images.find(img => img.id === currMeme.selectedImgId).url
    
    const img = new Image()
    img.src = memeUrl   

    img.onload = function (){
        gElCanvas.height = (img.naturalHeight / img.naturalWidth) * gElCanvas.width
        gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)

        renderTxt(currMeme)           
    }        

}

function onDownloadMeme(elLink){
    const memeContent = gElCanvas.toDataURL('image/jpeg', 1.0)
    elLink.href = memeContent
    elLink.download = 'my-meme.jpg'    
}

function onChangeTextColor(color){
    setTextColor(color)
    renderMeme()
}

function onChangeTxtSize(change){
    setTextSize(change)
    renderMeme()
}

function onAddLine() {
    addNewLine()
    renderMeme()
}

function onChangeTxt(text) {
    const currMeme = getMeme()
    const lineIdx = currMeme.selectedLineIdx
    setLineText(text, lineIdx)

    renderMeme()
}

function renderTxt(memeObj) {

    const lines = memeObj.lines

    let x = gElCanvas.width /2
    let y = gElCanvas.height *0.1
    let acc = 2
    
    lines.forEach(line => {
        const text = line.txt

        if (lines.indexOf(line)===1) y = gElCanvas.height *0.9

        if (lines.indexOf(line)>1) {
            y = gElCanvas.height * (0.1 * acc)
            acc++
        }

        if (line.coord.x === 0 & line.coord.y === 0){
        line.coord.x = x
        line.coord.y = y       
        }
   
        x = line.coord.x
        y = line.coord.y

        gCtx.lineWidth = 1.5
        gCtx.strokeStyle = 'black'
        gCtx.fillStyle = line.color
        gCtx.font = `bold ${line.size}px ${line.fontFam}`
        gCtx.textAlign = 'center'
        gCtx.textBaseline = 'middle'
        gCtx.fillText(text, x, y)
        gCtx.strokeText(text, x, y)

        if (lines.indexOf(line) === memeObj.selectedLineIdx){
            renderTxtBox (text, x, y)
        }
    })
}

function renderTxtBox(txt,xValue, yValue) {
    const measures = measureTxT(txt,xValue, yValue)

    gCtx.strokeStyle = "black"
    gCtx.lineWidth = 1
    gCtx.strokeRect(measures.rectX, measures.rectY, 
        measures.rectWidth, measures.rectHeight)      
}

function measureTxT(lineTxt, xCoor, yCoor) {
    const metrics = gCtx.measureText(lineTxt)
    const textWidth = metrics.width
    const textHeight = metrics.actualBoundingBoxAscent 
    + metrics.actualBoundingBoxDescent
    const padding = 10

    return {
        rectX: xCoor - padding - (textWidth/ 2),
        rectY: yCoor - padding - (textHeight / 2),
        rectWidth: textWidth + (2 * padding),
        rectHeight: textHeight + (2 * padding)            
    }
}

function onClick(ev) {

    const meme  = getMeme()
    const lines = meme.lines
    
    const { offsetX, offsetY } = ev

    var clickedLine = lines.find(line => {
        const { x, y } = line.coord
        gCtx.font = `bold ${line.size}px Arial`

        const txtMeasure = measureTxT(line.txt, x, y)  
        return (
            offsetX >= txtMeasure.rectX && 
            offsetX <= txtMeasure.rectX + txtMeasure.rectWidth
            && offsetY >= txtMeasure.rectY 
            && offsetY <= txtMeasure.rectY + txtMeasure.rectHeight)
    })

    if (clickedLine) {
        meme.selectedLineIdx = lines.indexOf(clickedLine)
        renderMeme()
        document.querySelector('.text-input').value = meme.lines[meme.selectedLineIdx].txt
        
    } else {
        if(meme.selectedLineIdx !== -1){
            meme.selectedLineIdx = -1
            renderMeme()
            document.querySelector('.text-input').value = ''
        }
    }
    
}

function onSwitchLine() {
    changeSelectedLine()
    renderMeme()

    const meme = getMeme()
    document.querySelector('.text-input').value = meme.lines[meme.selectedLineIdx].txt
}

function onChangeFontFamily(font) {
    setFontFamily(font)
    renderMeme()
}

function onMoveUp() {
    setTxtHeight('up')
    renderMeme()
}

function onMoveDown() {
    setTxtHeight('down')
    renderMeme()
}

function onDeleteLine() {  
    deleteLine()
    renderMeme()
}

function showEditor() {
    document.querySelector('.editor').classList.remove('hide')
    document.querySelector('.gallery').classList.add('hide')
    document.querySelector('.saved-memes').classList.add('hide')
    document.querySelector('.about').classList.add('hide')
}

function onChangeFontFamily(font) {
    setFontFamily(font)
    renderMeme()
}