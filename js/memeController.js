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

        if(currMeme.sticker){
            const stc = new Image()
            stc.src = `img/sticker${currMeme.sticker}.png`   

            stc.onload = function (){
                gCtx.drawImage(stc, 0, 0, 100, 100)

                renderTxt(currMeme)
            }
        }

        else renderTxt(currMeme)

    }

    const stickers = document.querySelector('.stickers')
    let strHtml = `<button class="arrow hide"><i class="fa-solid fa-angle-left"></i></button>`

    for (let i = 0; i < 5; i++) {

        strHtml += `<img class="sticker" onclick="onDrawSticker(${i+1})" src="img/sticker${i+1}.png" alt="sticker">`
    }

    strHtml += `<button class="arrow hide"><i class="fa-solid fa-angle-right"></i></button>`
    stickers.innerHTML = strHtml

}

function onDownloadMeme(elLink){
    const memeContent = gElCanvas.toDataURL('image/jpeg', 1.0)
    elLink.href = memeContent
    elLink.download = 'my-meme.jpg'    
}

function onDrawSticker(name) {
    setSticker(name)
    renderMeme()

}

function onChangeTxtSize(change){
    setTextSize(change)
    renderMeme()
}

function onChangeTextColor(color){
    setTextColor(color)
    renderMeme()
}

function onChangeStrokeColor(color){    
    setStrokeColor(color)
    renderMeme()
}

function onChangeTxt(text) {
    const currMeme = getMeme()
    const lineIdx = currMeme.selectedLineIdx
    setLineText(text, lineIdx)

    renderMeme()
}

function onChangeFontFamily(font) {
    setFontFamily(font)
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

function onDeleteLine() {  
    deleteLine()
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

function onAlign(alignPos) {   
    setAlignment(alignPos)
    renderMeme()
}

function renderTxt(memeObj) {

    const lines = memeObj.lines

    let x = gElCanvas.width / 2
    let y = gElCanvas.height * 0.1
    let acc = 2
    
    lines.forEach(line => {
        const text = line.txt

        if (lines.indexOf(line) === 1) y = gElCanvas.height * 0.9

        if (lines.indexOf(line) > 1) {
            y = gElCanvas.height * (0.1 * acc)
            acc++
        }

        // use logical AND (not single &)
        if (line.coord.x === 0 && line.coord.y === 0){
            line.coord.x = x
            line.coord.y = y                
        }
   
        x = line.coord.x
        y = line.coord.y

        gCtx.lineWidth = 1.5
        gCtx.strokeStyle = line.strColor
        gCtx.fillStyle = line.color
        gCtx.font = `bold ${line.size}px ${line.fontFam}`
        gCtx.textBaseline = 'middle'

        // measure before deciding drawX
        const metrics = gCtx.measureText(text)
        const textWidth = metrics.width

        // compute drawX so that line.coord.x is always the *center*
        let drawX = x
        if (line.align === 'left') {
            // If we want the visual appearance to align left from center anchor,
            // the canvas left anchor must be center - half width
            drawX = x - textWidth / 2
            gCtx.textAlign = 'left'
        } else if (line.align === 'right') {
            // canvas right anchor must be center + half width
            drawX = x + textWidth / 2
            gCtx.textAlign = 'right'
        } else {
            drawX = x
            gCtx.textAlign = 'center'
        }

        // draw text using computed drawX
        gCtx.fillText(text, drawX, y)
        gCtx.strokeText(text, drawX, y)

        if (lines.indexOf(line) === memeObj.selectedLineIdx){
            renderTxtBox(text, line.align, x, y) // pass center coords for measure
        }
    })
}

function renderTxtBox(txt, align, xValue, yValue) {
    const measures = measureTxT(txt, align, xValue, yValue)

    gCtx.strokeStyle = "black"
    gCtx.lineWidth = 1
    gCtx.strokeRect(measures.rectX, measures.rectY, 
        measures.rectWidth, measures.rectHeight)      
}

function measureTxT(lineTxt, align, xCoor, yCoor) {
    // ensure font is set before measuring (important)
    // we assume caller has already set gCtx.font to the right value.
    const metrics = gCtx.measureText(lineTxt)
    const textWidth = metrics.width
    const textHeight = metrics.actualBoundingBoxAscent 
        + metrics.actualBoundingBoxDescent
    const padding = 10

    // xCoor / yCoor are the canonical CENTER coordinates

    if (align === 'left') {
        // left-aligned visually means text's left edge is at (center - width/2)
        const leftEdge = xCoor - textWidth / 2
        return {
            rectX: leftEdge - padding,
            rectY: yCoor - textHeight / 2 - padding,
            rectWidth: textWidth + padding * 2,
            rectHeight: textHeight + padding * 2
        }
    }

    if (align === 'right') {
        // right-aligned visually means text's right edge is at (center + width/2)
        const leftEdge = xCoor + textWidth / 2 - textWidth // = xCoor - textWidth/2
        // same leftEdge as center - width/2 actually — keep symmetry
        return {
            rectX: leftEdge - padding,
            rectY: yCoor - textHeight / 2 - padding,
            rectWidth: textWidth + padding * 2,
            rectHeight: textHeight + padding * 2
        }
    }

    // center
    return {
        rectX: xCoor - padding - textWidth / 2,
        rectY: yCoor - padding - textHeight / 2,
        rectWidth: textWidth + padding * 2,
        rectHeight: textHeight + padding * 2   
    }
}

function onClick(ev) {

    const meme  = getMeme()
    const lines = meme.lines
    
    const { offsetX, offsetY } = ev

    var clickedLine = lines.find(line => {
        const { x, y } = line.coord
        // use correct font property
        gCtx.font = `bold ${line.size}px ${line.fontFam}`

        // pass align and center coords (measureTxT expects center)
        const txtMeasure = measureTxT(line.txt, line.align, x, y)  
        return (
            offsetX >= txtMeasure.rectX && 
            offsetX <= txtMeasure.rectX + txtMeasure.rectWidth &&
            offsetY >= txtMeasure.rectY &&
            offsetY <= txtMeasure.rectY + txtMeasure.rectHeight
        )
    })

    if (clickedLine) {
        meme.selectedLineIdx = lines.indexOf(clickedLine)
        renderMeme()
        document.querySelector('.text-input').value = meme.lines[meme.selectedLineIdx].txt
        
    } else {
        if (meme.selectedLineIdx !== -1) {
            meme.selectedLineIdx = -1
            renderMeme()
            document.querySelector('.text-input').value = ''
        }
    }
    
}

// function onAlign(alignPos) {   
//     setAlignment(alignPos)
//     renderMeme()
// }

// function renderTxt(memeObj) {

//     const lines = memeObj.lines

//     let x = gElCanvas.width/2
//     let y = gElCanvas.height *0.1
//     let acc = 2
    
//     lines.forEach(line => {
//         const text = line.txt

//         if (lines.indexOf(line)===1) y = gElCanvas.height *0.9

//         if (lines.indexOf(line)>1) {
//             y = gElCanvas.height * (0.1 * acc)
//             acc++
//         }

//         if (line.coord.x === 0 & line.coord.y === 0){
//             line.coord.x = x
//             line.coord.y = y                
//         }
   
//         x = line.coord.x
//         y = line.coord.y

//         gCtx.lineWidth = 1.5
//         gCtx.strokeStyle = line.strColor
//         gCtx.fillStyle = line.color
//         gCtx.font = `bold ${line.size}px ${line.fontFam}`
//         gCtx.textBaseline = 'middle'

//         if (line.align === 'left') gCtx.textAlign = 'left'
//         else if (line.align === 'right') gCtx.textAlign = 'right'
//         else gCtx.textAlign = 'center'


//         gCtx.fillText(text, x, y)
//         gCtx.strokeText(text, x, y)

//         if (lines.indexOf(line) === memeObj.selectedLineIdx){
//             renderTxtBox (text, line.align, x, y)
//         }
//     })
// }

// function renderTxtBox(txt, align, xValue, yValue) {
//     const measures = measureTxT(txt,align, xValue, yValue)

//     gCtx.strokeStyle = "black"
//     gCtx.lineWidth = 1
//     gCtx.strokeRect(measures.rectX, measures.rectY, 
//         measures.rectWidth, measures.rectHeight)      
// }

// function measureTxT(lineTxt, align, xCoor, yCoor) {
//     const metrics = gCtx.measureText(lineTxt)
//     const textWidth = metrics.width
//     const textHeight = metrics.actualBoundingBoxAscent 
//     + metrics.actualBoundingBoxDescent
//     const padding = 10


//     if (align === 'left') {
//         return {
//             rectX: xCoor - padding,
//             rectY: yCoor - textHeight/2 - padding,
//             rectWidth: textWidth + padding*2,
//             rectHeight: textHeight + padding*2
//         }
//     }

//     if (align === 'right') {
//         return {
//             rectX: xCoor - textWidth - padding,
//             rectY: yCoor - textHeight/2 - padding,
//             rectWidth: textWidth + padding*2,
//             rectHeight: textHeight + padding*2
//         }
//     }

//     return {
//         rectX: xCoor - padding - textWidth/ 2,
//         rectY: yCoor - padding - textHeight/2,
//         rectWidth: textWidth + padding*2,
//         rectHeight: textHeight + padding*2   
//     }
// }

// function onClick(ev) {

//     const meme  = getMeme()
//     const lines = meme.lines
    
//     const { offsetX, offsetY } = ev

//     var clickedLine = lines.find(line => {
//         const { x, y } = line.coord
//         gCtx.font = `bold ${line.size}px ${line.font}`

//         const txtMeasure = measureTxT(line.txt, line.align, x, y)  
//         return (
//             offsetX >= txtMeasure.rectX && 
//             offsetX <= txtMeasure.rectX + txtMeasure.rectWidth
//             && offsetY >= txtMeasure.rectY 
//             && offsetY <= txtMeasure.rectY + txtMeasure.rectHeight)
//     })

//     if (clickedLine) {
//         meme.selectedLineIdx = lines.indexOf(clickedLine)
//         renderMeme()
//         document.querySelector('.text-input').value = meme.lines[meme.selectedLineIdx].txt
        
//     } else {
//         if(meme.selectedLineIdx !== -1){
//             meme.selectedLineIdx = -1
//             renderMeme()
//             document.querySelector('.text-input').value = ''
//         }
//     }
    
// }

function showEditor() {
    document.querySelector('.editor').classList.remove('hide')
    document.querySelector('.gallery').classList.add('hide')
    document.querySelector('.saved-memes').classList.add('hide')
    document.querySelector('.about').classList.add('hide')
}