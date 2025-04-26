'use strict';

var gElCanvas
var gCtx
var gPos = {}


//  Lists 


function renderMeme() {
    // if (!getGMeme()) return
    const curMeme = getGMeme()
    const curMemeGImg = getImgById(curMeme.selectedImgId)
    reSizeCanvas() // Resize first; this clears canvas internally
    clearCanvas()
    renderImgOnCanvas(curMemeGImg.img)
    renderBorderLine()
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
    getGMeme().lines.forEach(line => {
        drawRoundRect(line.textPositionX - 10, line.textPositionY - 5, line.lineHeight)
        // drawRoundRect(line.lineStartPointX, line.lineStartPointy, line.lineHeight)
    })
}

function renderText() {
    getGMeme().lines.forEach(line => {
        drawText(line.txt, line.size, line.color, line.textPositionX, line.textPositionY)
    })
}


// Create

function onTextInput(el) {
    setLineTxt(el.value)
    renderMeme()
}

function onAddLine() {
    clearTextInput()
    createNewLine()
    renderBorderLine()
}

function drawText(str, textSize = 25, color = '#000000', textPositionX, textPositionY, fontFamily = 'Arial') {
    gCtx.font = `${textSize}px ${fontFamily}`
    gCtx.fillStyle = color
    gCtx.textBaseline = 'top'
    gCtx.fillText(str, textPositionX, textPositionY)
}

function drawRoundRect(startPointX, startPointY, lineHeight, color = '#000000') {

    const width = document.querySelector('.canvas-container').offsetWidth - (startPointX * 2);
    gCtx.beginPath()
    gCtx.roundRect(startPointX, startPointY, width, lineHeight, lineHeight / 2)
    gCtx.strokeStyle = color
    gCtx.stroke()
}

// Read

function measureTextWidthBypX(str) {
    const textWidth = gCtx.measureText(str).width
    return textWidth
}


// Update
function onsetFontSize(el) {
    var changeToFontSize = 2
    if (el.classList.contains('decrease')) changeToFontSize = -2
    setFontSize(changeToFontSize)
    setLineHeight(changeToFontSize)
    renderMeme()
}

function onChangeTextColor(el) {
    saveTextColor(el.value)
    renderMeme()
}

function saveTextTOLine() {

}
// Delete

function clearTextInput(){
    document.querySelector('.line-text').value = '';
}