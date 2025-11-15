'use strict'

var gImgsNum = getImgs().length

const elGallery = document.querySelector('.gallery')
const elPictures = document.querySelector('.pictures')

function onInit(){
    renderGallery()
}

function renderGallery() {

    var strHtml = ''
    
    for (let i = 0; i < gImgsNum; i++) {
        strHtml += `<img id="${i+1}" src="img/${i+1}.jpg" alt="${i+1}.jpg" onclick="onImgSelect(${i+1})">`
    }
    
    elPictures.innerHTML = strHtml
}

function onImgSelect(nameId) {
    setImg(nameId)

    renderMeme()

    showEditor()
}

function showGallery() {
    elGallery.classList.remove('hide')

    document.querySelector('.editor').classList.add('hide')

    document.querySelector('.saved-memes').classList.add('hide')

    document.querySelector('.about').classList.add('hide')

    toggleMenu()
}

function toggleMenu() {
    document.body.classList.toggle('menu-open')
}

