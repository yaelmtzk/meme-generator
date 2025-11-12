'use strict'

var gElCanvas
var gCtx 

function onInit(){
    gElCanvas = document.querySelector('canvas')
    gCtx = gElCanvas.getContext('2d')

    renderMeme()
}

function renderMeme() {

    // Adds Img
    const img = new Image()
    img.src = 'img/2.jpg'

    img.onload = function (){
        gElCanvas.height = (img.naturalHeight / img.naturalWidth) * gElCanvas.width
        gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)

        // Adds text
        const text = 'Why though?'
        const x = gElCanvas.width / 2
        const y = gElCanvas.height *0.10
        gCtx.lineWidth = 2
        gCtx.strokeStyle = 'black'
        gCtx.fillStyle = 'white'
        gCtx.font = 'bold 30px Arial'
        gCtx.textAlign = 'center'
        gCtx.textBaseline = 'middle'

        gCtx.fillText(text, x, y)
        gCtx.strokeText(text, x, y)
    }
}