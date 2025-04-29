'use strict';

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
//still new line appear in wrong place

// needs to fix line showing-up after out of focus 

// I need to deal with the border. It shouldn't show if the user presses line down or up. 
// if there were no earlier lines insert

function renderLineText() {
    getGMeme().lines.forEach(line => {
        drawText(line.txt, line.size, line.color, line.textPositionX, line.textPositionY)
        renderBorderLine()
    })
}

function renderBorderLine() {
    const gMeme = getGMeme()
    const line = gMeme.lines[gMeme.selectedLineIdx]
    const fallback = document.querySelector('.canvas-container.meme').offsetWidth - line.textPositionX * 2;
    const curWidth = line.textWidth || fallback;
    drawRoundRect(line.textPositionX - 5, line.textPositionY - 2.5, curWidth + 15, line.size + 3,)
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
    gCtx.font = `${textSize}px ${fontFamily}`
    gCtx.fillStyle = color
    gCtx.textBaseline = 'top'
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


function onSetTextWidth() {
    const line = getGMeme().lines[gMeme.selectedLineIdx]
    gCtx.font = `${line.size}px Arial`;
    const textWidth = gCtx.measureText(line.txt).width
    return setTextWidth(textWidth)
}

function onSetSelectedLine(el, lineIdx) {
    if (getGMeme().lines.length >= 1) return
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
    const txtInput = document.querySelector('.line-text.meme')
    txtInput.value = getGMeme().lines[lineIdx].txt
    txtInput.focus()
}

