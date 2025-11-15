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

var gMeme = {} 

var gKeywordSearchCountMap = {} //{'funny': 12,'cat': 16, 'baby': 2} 

var gSelectOperator = 'plus'

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

function setTxtHeight(dir) {
    
    if(dir==='up') gMeme.lines[gMeme.selectedLineIdx].coord.y--
    else gMeme.lines[gMeme.selectedLineIdx].coord.y++
}

function setFontFamily(font){
    gMeme.lines.forEach(line => {
        line.fontFam = font
    })
}

function setImg(imgNameId) {

    const imgs = getImgs()

    const currImg = imgs.find(img => img.id === imgNameId)

    gMeme = { 
        selectedImgId: currImg.id, 
        selectedLineIdx: -1, 
        lines: [_addLine()]
    }
}

function setTextSize(choice) {
    var currSize = gMeme.lines[gMeme.selectedLineIdx].size

    if (choice === 'increase'){
        gMeme.lines[gMeme.selectedLineIdx].size++
        
    }
    else{
        if(currSize>20){
            gMeme.lines[gMeme.selectedLineIdx].size--
        }
    }
}

function _addLine(text) {
    const newline = { 
            txt: text || 'Write your text here',
            size: 25, 
            color: 'white',
            coord: {x: 0, y: 0},
            fontFam: 'Arial'
        }
    return newline
}

function addNewLine() {
    gMeme.lines.push(_addLine())
}

function changeSelectedLine() {
    const { lines } = gMeme
    
    if (gMeme.selectedLineIdx === -1) {
        gMeme.selectedLineIdx = 0
        return
    }

    let idx = gMeme.selectedLineIdx

    if (gSelectOperator === 'plus') {
        idx++
        if (idx === lines.length) {
            gSelectOperator = 'minus'
            idx = lines.length - 2
        }
    } else {
        idx--
        if (idx === -1) {
            gSelectOperator = 'plus'
            idx = 1
        }
    }
    gMeme.selectedLineIdx = idx
}