'use strict'

var gElCanvas
var gCtx 

function onInit(){
    gElCanvas = document.querySelector('canvas')
    gCtx = gElCanvas.getContext('2d')

    renderMeme()
}

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

        // Adds text
        const text = currMeme.lines[currMeme.selectedLineIdx].txt
        const x = gElCanvas.width / 2
        const y = gElCanvas.height *0.10
        gCtx.lineWidth = 2
        gCtx.strokeStyle = 'black'
        gCtx.fillStyle = currMeme.lines[currMeme.selectedLineIdx].color
        gCtx.font = `bold ${currMeme.lines[currMeme.selectedLineIdx].size}px Arial`
        gCtx.textAlign = 'center'
        gCtx.textBaseline = 'middle'

        gCtx.fillText(text, x, y)
        gCtx.strokeText(text, x, y)
    }
}