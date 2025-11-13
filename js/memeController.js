'use strict'

var gElCanvas
var gCtx


    gElCanvas = document.querySelector('canvas')
    gCtx = gElCanvas.getContext('2d')

// function onInit(){
//     gElCanvas = document.querySelector('canvas')
//     gCtx = gElCanvas.getContext('2d')

//     renderMeme()
// }

function renderMeme() {

    const images = getImgs()
    const currMeme = getMeme()
    const memeUrl = images.find(img => img.id === currMeme.selectedImgId).url
    
    // Adds Img
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

function onSwitchLine() {
    changeSelectedLine()
    renderMeme()

    const meme = getMeme()
    document.querySelector('.text-input').value = meme.lines[meme.selectedLineIdx].txt
}

function onChangeTxt(text) {
    const currMeme = getMeme()
    const lineIdx = currMeme.selectedLineIdx
    setLineText(text, lineIdx)

    renderMeme()
}

function renderTxt(memeObj) {

    const lines = memeObj.lines

    lines.forEach(line => {
        const text = line.txt
        var x = gElCanvas.width /2
        var y = gElCanvas.height *0.1

        if (lines.indexOf(line)===1) y = gElCanvas.height *0.9

        gCtx.lineWidth = 1.5
        gCtx.strokeStyle = 'black'
        gCtx.fillStyle = line.color
        gCtx.font = `bold ${line.size}px Arial`
        gCtx.textAlign = 'center'
        gCtx.textBaseline = 'middle'
        gCtx.fillText(text, x, y)
        gCtx.strokeText(text, x, y)

        //Adds box around selected line
        if (lines.indexOf(line) === memeObj.selectedLineIdx){
            renderTxtBox (text, x, y)
        }
    })
}

function renderTxtBox(lineTxt,xCoor, yCoor) {
    const metrics = gCtx.measureText(lineTxt)
    const textWidth = metrics.width
    const textHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent
    const padding = 10
    const rectX = xCoor - padding - (textWidth/ 2)
    const rectY = yCoor - padding - (textHeight / 2)
    const rectWidth = textWidth + (2 * padding)
    const rectHeight = textHeight + (2 * padding)
    gCtx.strokeStyle = "black"
    gCtx.lineWidth = 1
    gCtx.strokeRect(rectX, rectY, rectWidth, rectHeight)        
}