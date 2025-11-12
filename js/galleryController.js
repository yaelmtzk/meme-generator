'use strict'

// var gImgsNum = getImgs().length
var gImgsNum = 2

const elGallery = document.querySelector('.gallery')

renderGalery()

function renderGalery() {
    var strHtml = ''
    

    for (let i = 0; i < gImgsNum; i++) {
        strHtml += `<img id="${i+1}" src="img/${i+1}.jpg" alt="${i+1}.jpg" onclick="onImgSelect(${i+1})">`
    }
    
    elGallery.innerHTML = strHtml
}

function onImgSelect(nameId) {
    setImg(nameId)

    elGallery.classList.add('hide')

    document.querySelector('.editor').classList.remove('hide')
}