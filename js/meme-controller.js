'use strict';
const G_START_POSITION_X = 35
const G_START_POSITION_Y = 30
var gElCanvas
var gCtx
var gPos = {}


//  Lists 

function onIniMemeEdit() {
    gElCanvas = document.querySelector('.meme-canvas');
    gCtx = gElCanvas.getContext('2d')
}

function renderGMeme() {
    const curMeme = getGMeme()
    const curMemeGImg = getImgById(curMeme.selectedImgId)
    reSizeCanvas() // Resize first; this clears canvas internally
    clearCanvas()
    renderImgOnCanvas(curMemeGImg.img)
    renderLineText()
    renderLineColorInputValue()
    moveToTextInput()
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
    gCtx.drawImage(img, 0, 0, gElCanvas.width - 1, gElCanvas.height - 1)
    // optimize the canvas container after putting the picture
    reSizeCanvasContainer(gElCanvas.width, gElCanvas.height)
}

function renderLineText() {
    getGMeme().lines.forEach(line => {
        drawText(line.txt, line.size, line.color, line.textPositionX, line.textPositionY)
        renderBorderLine()
    })
}

function renderBorderLine() {
    const line = getAccurateBorderLinePosition()
    console.log("🚀 ~ renderBorderLine ~ line:", line)
    drawRoundRect(line.linePositionX, line.linePositionY, line.lineWidth, line.lineHeight)
}

function renderLineColorInputValue() {
    const textColorInput = document.querySelector('.text-color')
    const gMemeLines = getGMeme().lines
    if (!gMemeLines.length) return
    textColorInput.value = gMemeLines[gMeme.selectedLineIdx].color
}

function onClickLineInCanvas(ev) {
    var lineIdx = getLineIdxByPosition(ev)
    if (lineIdx === null) return
    setGMemeSelectedLineIdxTo(lineIdx)
    renderGMeme()
    // Make sure Once lying Check user goes to text input. Didn't find a way to do it
    //  not with requestAnimationFrame or set timeout
    requestAnimationFrame(() => {
        moveToTextInput()
    })
}


// Create

function onTextInput(el) {
    setLineTxt(el.value)
    onSetTextWidth()
    renderGMeme()
}

function onAddLine(ev) {
    ev.preventDefault()
    createNewLine()
    moveToTextInput()
    renderBorderLine()
    renderGMeme()
}

function drawText(str, textSize = 25, color = '#000000', textPositionX, textPositionY, fontFamily = 'Arial') {
    const TextAlignment = getTextAlignment()
    gCtx.font = `${textSize}px ${fontFamily}`
    gCtx.textAlign = TextAlignment.textAlign || 'start';
    gCtx.fillStyle = color
    gCtx.textBaseline = 'top'
    textPositionY = TextAlignment.newPositionY || textPositionY
    gCtx.fillText(str, textPositionX, textPositionY)
}

function drawRoundRect(startPointX, startPointY, lineWidth, lineHeight, color = '#000000') {
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


// Update

function onSetTextAlignment(el) {
    SetTextAlignment(el)
}


function onSetTextWidth() {
    const line = getGMeme().lines[gMeme.selectedLineIdx]
    gCtx.font = `${line.size}px Arial`;
    const textWidth = gCtx.measureText(line.txt).width
    return setTextWidth(textWidth)
}

function onSetSelectedLine(el, lineIdx) {
    if (getGMeme().lines.length <= 1) return
    setGMemeSelectedLine(el, lineIdx)
    renderGMeme()
    renderBorderLine()
}

function onsetFontSize(el) {
    setFontSize(IncreaseOrDecreaseByFactor(1, el))
    onSetTextWidth()
    renderGMeme()
}

function onsetTextColor(el) {
    saveTextColor(el.value)
    renderGMeme()
}

function onsetTextDirection() {
    setTextDirection()
    renderGMeme()
}


function setTextDirection() {
    gCtx.textAlign = 'center'; // center the text horizontally
}

// Delete

function clearCanvas() {
    gCtx.fillStyle = "white"
    gCtx.fillRect(0, 0, gElCanvas.width, gElCanvas.height)
}

function onDeleteLine() {
    if (!CheckGMemeLinesNumb()) return
    DeleteLineFromGMeme()
    renderGMeme()
}

// Helpers

function moveToTextInput() {
    if (!CheckGMemeLinesNumb()) return
    const lineIdx = getSelectedLineIdx()
    const textInput = document.querySelector('.line-text.meme')
    textInput.value = getGMeme().lines[lineIdx].txt
    textInput.focus()
}

function getUpdatedTextPositionX(value) {
    console.log("🚀 ~ getUpdatedTextPositionX ~ value:", value)
    if (value === 'left') return  G_START_POSITION_X
    else if (value === 'right') return gElCanvas.width - G_START_POSITION_X
    else return gElCanvas.width / 2 
}

