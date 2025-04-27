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
    renderColorInputValue()
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
// I need to make your smarter calculation so it will increase.taking in consideration the growingof the pixel
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

function renderColorInputValue() {
    const textColorInput = document.querySelector('.text-color')
    const gMemeLines = getGMeme().lines
    if (!gMemeLines.length) return
    textColorInput.value = gMemeLines[gMeme.selectedLineIdx].color
}

// Create

function onTextInput(el) {
    getTextWidth()
    setLineTxt(el.value)
    renderMeme()
}

function onAddLine() {
    createNewLine()
    moveFocusToTextInput()
    renderMeme()
}

function drawText(str, textSize = 25, color = '#000000', textPositionX, textPositionY, fontFamily = 'Arial') {
    gCtx.font = `${textSize}px ${fontFamily}`
    gCtx.fillStyle = color
    gCtx.textBaseline = 'top'
    gCtx.fillText(str, textPositionX, textPositionY)
}

function drawRoundRect(startPointX, startPointY, lineHeight, textWidth, color = '#000000') {
    const lineWidth = textWidth + 32.5 || document.querySelector('.canvas-container').offsetWidth - (startPointX * 2);
    gCtx.beginPath()
    gCtx.roundRect(startPointX, startPointY, lineWidth, lineHeight, lineHeight / 2)
    gCtx.strokeStyle = color
    gCtx.stroke()
}

// Read


function getCanvasContainer() {
    const gMeme = getGMeme()
    return document.querySelector('.canvas-container').offsetWidth - (35 * 2)
}

function getTextWidth() {
    const textMetrics = gCtx.measureText(gMeme.lines[gMeme.selectedLineIdx].txt)
    const textWidth = textMetrics.width
    return setTextWidth(textWidth)
}

// Update


function onClickOnLineInCanvas(ev) {
    var lineIdx = getLineIdxByPosition(ev)
    if (lineIdx === null) return
    setGMemeSelectedLineIdxTo(lineIdx)
    renderMeme()
    // Make sure Once lying Check user goes to text input
    requestAnimationFrame(() => {
        moveFocusToTextInput()
    })
}

function moveFocusToTextInput() {
    const lineIdx = getSelectedLineIdx()
    const txtInput = document.querySelector('.line-text')
    txtInput.value = getGMeme().lines[lineIdx].txt
    txtInput.focus()
    // if (elInput) txtInput.focus()
}


// I need to deal with the border. It shouldn't show if the user presses line down or up. 
// if there waere no earleyer lines insert

function onSwitchGMemeSelectedLine(el, lineIdx) {
    setGMemeSelectedLine(el, lineIdx)
    renderMeme()
    renderBorderLine()
}

function onsetFontSize(el) {
    setFontSize(IncreaseOrDecreaseByFactor(2, el))
    setLineHeight(IncreaseOrDecreaseByFactor(4, el))
    renderMeme()
}

function onChangeTextColor(el) {
    saveTextColor(el.value)
    renderMeme()
}

// Delete

function onDeleteLine(){
    DeleteLineFromGMeme()
    renderMeme()
}

// Helpers


