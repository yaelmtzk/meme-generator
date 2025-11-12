'use strict'

const gImgs = [
  { id: 1, url: 'img/1.jpg', keywords: ['politic', 'victory', 'funny', 'men'] },
  { id: 2, url: 'img/2.jpg', keywords: ['cute', 'dog', 'love', 'animal'] },
  { id: 3, url: 'img/3.jpg', keywords: ['cute', 'dog', 'baby', 'sleep', 'animal'] },
  { id: 4, url: 'img/4.jpg', keywords: ['cat', 'sleep', 'work', 'animal'] },
  { id: 5, url: 'img/5.jpg', keywords: ['baby', 'winner', 'funny'] },
  { id: 6, url: 'img/6.jpg', keywords: ['funny', 'explain', 'men'] },
  { id: 7, url: 'img/7.jpg', keywords: ['funny', 'baby', 'surprise'] },
  { id: 8, url: 'img/8.jpg', keywords: ['funny', 'movie', 'men'] },
  { id: 9, url: 'img/9.jpg', keywords: ['funny', 'baby'] },
  { id: 10, url: 'img/10.jpg', keywords: ['politic', 'funny', 'men'] },
  { id: 11, url: 'img/11.jpg', keywords: ['funny', 'explain', 'men'] },
  { id: 12, url: 'img/12.jpg', keywords: ['movie', 'victory', 'men'] },
  { id: 13, url: 'img/13.jpg', keywords: ['movie', 'men'] },
  { id: 14, url: 'img/14.jpg', keywords: ['movie', 'explain','men'] },
  { id: 15, url: 'img/15.jpg', keywords: ['funny', 'movie', 'men'] },
  { id: 16, url: 'img/16.jpg', keywords: ['politic', 'men'] },
  { id: 17, url: 'img/17.jpg', keywords: ['movie', 'explain'] }
]


var gMeme = { 
    selectedImgId: 2, 
    selectedLineIdx: 0, 
    lines: [
        { 
            txt: 'Why though?', 
            size: 30, 
            color: 'white' 
        }] 
    } 

var gKeywordSearchCountMap = {} //{'funny': 12,'cat': 16, 'baby': 2} 

function getMeme(){
    return gMeme
}

function getImgs(){
    return gImgs
}

function setLineText(lineText, lineIdx) {
    gMeme.lines[lineIdx].txt = lineText
}

function setTextColor(txtColor) {
    gMeme.lines[gMeme.selectedLineIdx].color = txtColor
}


function setImg(imgNameId) {

    const imgs = getImgs()

    const currImg = imgs.find(img => img.id === imgNameId)

    gMeme = { 
        selectedImgId: currImg.id, 
        selectedLineIdx: 0, 
        lines: [
            { 
                txt: 'Why though?', 
                size: 30, 
                color: 'white' 
            }] 
        }

    renderMeme()
}