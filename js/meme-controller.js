'use strict';

var gElCanvas
var gCtx
var gPos = {}


//  Lists 

function renderMeme() {
    const curMeme = getGMeme()
    const curMemeGImg = getImgById(curMeme.selectedImgId)
    reSizeCanvas() // Resize first; this clears canvas internally
    clearCanvas()
    renderImgOnCanvas(curMemeGImg.img)
    renderText()

}

function clearCanvas() {
    gCtx.fillStyle = "white"
    gCtx.fillRect(0, 0, gElCanvas.width, gElCanvas.height)
}

function reSizeCanvasContainer(width, height) {
    const elContainer = document.querySelector('.canvas-container');
    elContainer.style.width = width + "px";
    elContainer.style.height = height + "px";
}

function reSizeCanvas() {
    const elContainer = document.querySelector('.canvas-container');
    gElCanvas.width = elContainer.offsetWidth;
    gElCanvas.height = elContainer.offsetHeight;
}


function renderImgOnCanvas(img) {
    gElCanvas.height = (img.naturalHeight / img.naturalWidth) * gElCanvas.width
    gCtx.drawImage(img, 0, 0, gElCanvas.width - 2, gElCanvas.height - 2)
    //Does another double check and optimize the canvas container after putting the picture
    reSizeCanvasContainer(gElCanvas.width, gElCanvas.height)
}

function renderBorderLine() {
    const gMeme = getGMeme()
    const line = gMeme.lines[gMeme.selectedLineIdx]
    drawRoundRect(line.textPositionX - 10, line.textPositionY - 5, line.lineHeight, line.textWidth)
}

function renderText() {
    getGMeme().lines.forEach(line => {
        drawText(line.txt, line.size, line.color, line.textPositionX, line.textPositionY)
        renderBorderLine()
    })
}


// Create

function onTextInput(el) {
    getTextWidth()
    setLineTxt(el.value)
    renderMeme()
}

function onAddLine() {
    clearTextInput()
    createNewLine()
    renderMeme()
    // renderBorderLine()
}

function drawText(str, textSize = 25, color = '#000000', textPositionX, textPositionY, fontFamily = 'Arial') {
    gCtx.font = `${textSize}px ${fontFamily}`
    gCtx.fillStyle = color
    gCtx.textBaseline = 'top'
    gCtx.fillText(str, textPositionX, textPositionY)
}

function drawRoundRect(startPointX, startPointY,lineHeight,  textWidth ,  color = '#000000') {
    const lineWidth = textWidth + 32.5 || document.querySelector('.canvas-container').offsetWidth - (startPointX * 2);
    gCtx.beginPath()
    gCtx.roundRect(startPointX, startPointY, lineWidth, lineHeight, lineHeight / 2)
    gCtx.strokeStyle = color
    gCtx.stroke()
}

// Read



// Update

function onSetGMemeSelectedLine(el) {
    setGMemeSelectedLine(el)
    renderMeme()
    renderBorderLine()
}

function onsetFontSize(el) {
    setFontSize(changeByELClassListContainsDecreaseOrIncrease(2, el))
    setLineHeight(changeByELClassListContainsDecreaseOrIncrease(2, el))
    renderMeme()
}

function onChangeTextColor(el) {
    saveTextColor(el.value)
    renderMeme()
}

// Delete

function clearTextInput() {
    document.querySelector('.line-text').value = '';
}

// Helpers

function getTextWidth() {
    const textMetrics = gCtx.measureText(gMeme.lines[gMeme.selectedLineIdx].txt)
    const textWidth = textMetrics.width
    return  setTextWidth(textWidth)
}
