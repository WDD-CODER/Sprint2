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
    renderLine()
    renderLineColorInputValue()
    renderFontFamilySelectionValue()
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


function renderLine() {
    getGMeme().lines.forEach(line => {
        drawText(line.txt, line.size, line.color, line.textPositionX, line.textPositionY, line.textAlign, line.fontFamily)
        RenderUnderLine(line)
        if (!line.txt) renderBorderLine(line)
    })
}

function onSetUnderline() {
    setGMemeUnderline()
    renderGMeme()
}

function RenderUnderLine(line) {
    if (!line.underLine) return;
    const pos = getAccurateUnderLinePosition(line); // Pass line if needed
    drawUnderline(pos.strokeStartPointX, pos.strokeStartPointY, pos.strokeEndPointX);

}

function renderBorderLine(line) {
    const newLine = getAccurateBorderLinePosition(line)
    drawRoundRect(newLine.linePositionX, newLine.linePositionY, newLine.lineWidth, newLine.lineHeight)
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

function renderFontFamilySelectionValue() {
    let FontFamily = getGMeme().lines[gMeme.selectedLineIdx].fontFamily
    return FontFamily = document.querySelector('.font-family').value;
}


// Create

function onTextInput(el) {
    setLineTxt(el.value)
    onSetTextWidth()
    renderGMeme()
}

function onAddLine(ev) {
    if (ev) ev.preventDefault()
    createNewLine()
    moveToTextInput()
    renderGMeme()
}
function drawText(str, textSize, color, textPositionX, textPositionY, textAlign, fontFamily) {
    fontFamily = fontFamily || 'Arial'
    gCtx.textAlign = textAlign || 'start';
    gCtx.textBaseline = 'top'
    gCtx.font = `${textSize}px ${fontFamily}`
    gCtx.fillStyle = color || '#000000'
    gCtx.fillText(str, textPositionX, textPositionY)
}

function drawRoundRect(startPointX, startPointY, lineWidth, lineHeight, color = '#000000') {
    gCtx.beginPath()
    gCtx.roundRect(startPointX, startPointY, lineWidth, lineHeight, lineHeight / 2)
    gCtx.strokeStyle = color
    gCtx.stroke()
}

function drawUnderline(strokeStartPointX, strokeStartPointY, strokeEndPointX, color, size = 30) {
    gCtx.beginPath();
    gCtx.strokeStyle = color || 'black';
    gCtx.lineWidth = 2;
    gCtx.moveTo(strokeStartPointX, strokeStartPointY);
    gCtx.lineTo(strokeStartPointX + strokeEndPointX, strokeStartPointY);
    gCtx.stroke();

}

// Read

function getCanvasContainerWidth() {
    const gMeme = getGMeme()
    return document.querySelector('.canvas-container').offsetWidth - (35 * 2)
}


// Update

function onMoveLinePosition(el) {
    let change = -5
    if (el.classList.contains('down')) change = 5
    getGMeme().lines[gMeme.selectedLineIdx].textPositionY += change
    renderGMeme()
}


function onSetFontFamily(el) {
    setFontFamily(el.value)
    renderGMeme()
}

function onSetTextAlignment(el) {
    SetTextAlignment(el)
    renderGMeme()
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
    gCtx.textAlign = 'center'; // center the text horizontally
    renderGMeme()
}

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
    if (value === 'left') return G_START_POSITION_X
    else if (value === 'right') return gElCanvas.width - G_START_POSITION_X
    else return gElCanvas.width / 2
}

