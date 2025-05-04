'use strict';
const G_START_POSITION_X = 35
const G_START_POSITION_Y = 30
var gElCanvas
var gCtx
var gPos = {}

window.onerror = (msg, src, line, col, err) => {
    console.error('💥 Global error:', { msg, src, line, col, err });
};

//  Lists 
function onIniMemeEdit() {
    gElCanvas = document.querySelector('.meme-canvas');
    gCtx = gElCanvas.getContext('2d')
}

function renderGMeme() {
    const curMeme = getGMeme();
    const curMemeGImg = getImgById(curMeme.selectedImgId);
    reSizeCanvas() // Resize first; this clears canvas internally
    clearCanvas()
    renderImgOnCanvas(curMemeGImg.img)
    renderLine()
    renderLineColorInputValue()
    renderFontFamilySelectionValue()
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
    const selectedLineIdx = getGMeme().selectedLineIdx;
    getGMeme().lines.forEach((line, idx) => {
        drawText(line.txt, line.size, line.color, line.textPositionX, line.textPositionY, line.textAlign, line.fontFamily)
        RenderUnderLine(line)
        if (idx === selectedLineIdx) renderBorderLine(line)
    })
}

function renderBorderLine(line) {
    if (!getGMeme().isActive) return
    const newLine = getAccurateBorderLinePosition(line)
    drawRoundRect(newLine.linePositionX, newLine.linePositionY, newLine.lineWidth, newLine.lineHeight)
}

function RenderUnderLine(line) {
    if (!line.underLine) return;
    const pos = getAccurateUnderLinePosition(line);
    drawUnderline(pos.strokeStartPointX, pos.strokeStartPointY, pos.strokeEndPointX);
}

function renderFontFamilySelectionValue() {
    let FontFamily = getGMeme().lines[gMeme.selectedLineIdx].fontFamily
    return FontFamily = document.querySelector('.font-family').value;
}

function renderLineColorInputValue() {
    const gMemeLines = getGMeme().lines
    if (!gMemeLines.length) return
    document.querySelector('.text-color').value = gMemeLines[gMeme.selectedLineIdx].color
}

function onClickLineInCanvas(ev) {
    var lineIdx = getLineIdxByPosition(ev)
    // gMemeEditModeActive()
    if (lineIdx === null) return
    setGMemeSelectedLineIdxTo(lineIdx)
    renderGMeme()
    // Make sure Once lying Check user goes to text input. Didn't find a way to do it
    //  not with requestAnimationFrame or set timeout
    requestAnimationFrame(() => moveToTextInput())
}

// Create

function onSaveMeme() {
    if (!confirm('Are you sure you want to save the picture?')) return
    gMemeEditModeNotActive()
    const gMeme = getGMeme()
    const CurImgUrl = gElCanvas.toDataURL();
    const RandomId = getRandomId()
    let curGImg = getImgById(gMeme.selectedImgId)

    gMeme.imgUrl = CurImgUrl
    gMeme.id = RandomId

    saveImgToLocalStorage(curGImg)
    saveMemeToLocalStorage(gMeme)
    showContainer('saved-meme-gallery')
}

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
    gCtx.lineWidth = 1;
    gCtx.moveTo(strokeStartPointX, strokeStartPointY);
    gCtx.lineTo(strokeStartPointX + strokeEndPointX, strokeStartPointY);
    gCtx.stroke();

}

// Read
function moveToTextInput() {
    console.log("🚀 ~ moveToTextInput ~ getGMemeLinesNum():", getGMemeLinesNum())
    if (!getGMemeLinesNum()) return
    gMemeEditModeActive()
    const lineIdx = getSelectedLineIdx()
    const textInput = document.querySelector('.line-text.meme')
    textInput.value = getGMeme().lines[lineIdx].txt
    textInput.focus()
}

function getCanvasContainerWidth() {
    const gMeme = getGMeme()
    return document.querySelector('.canvas-container').offsetWidth - (35 * 2)
}

function getUpdatedTextPositionX(value) {
    if (value === 'left') return G_START_POSITION_X
    else if (value === 'right') return gElCanvas.width - G_START_POSITION_X
    else return gElCanvas.width / 2
}


// Update
function onSetUnderline() {
    moveToTextInput()
    setGMemeUnderline()
    renderGMeme()
}

function onSetLinePosition(el) {
    let change = -5
    if (el.classList.contains('down')) change = 5
    setLinePosition(change)
    moveToTextInput()
    renderGMeme()
}


function onSetTextAlignment(el) {
    SetTextAlignment(el)
    moveToTextInput()
    renderGMeme()
}

function onSetTextWidth() {
    const line = getGMeme().lines[gMeme.selectedLineIdx]
    gCtx.font = `${line.size}px Arial`;
    const textWidth = gCtx.measureText(line.txt).width
    setTextWidth(textWidth)
    if (textWidth > getMaxLineWidth())    onAddLine()
}

function onSetSelectedLine(el, lineIdx) {
    if (getGMeme().lines.length <= 1) return
    setGMemeSelectedLine(el, lineIdx)
    moveToTextInput()
    renderGMeme()
}

function onSetFontFamily(el) {
    setFontFamily(el.value)
    moveToTextInput()
    renderGMeme()
}

function onsetFontSize(el) {
    setFontSize(IncreaseOrDecreaseByFactor(1, el))
    onSetTextWidth()
    renderGMeme()
}

function onsetTextColor(el) {
    saveTextColor(el.value)
    moveToTextInput()
    renderGMeme()
}

// Delete
function clearCanvas() {
    gCtx.fillStyle = "white"
    gCtx.fillRect(0, 0, gElCanvas.width, gElCanvas.height)
}

function onDeleteLine() {
    if (!getGMemeLinesNum()) return
    DeleteLineFromGMeme()
    moveToTextInput()
    renderGMeme()
}

// Helpers

function gMemeEditModeActive(){
    console.log('gMemeEditModeActive');
    
    if (!getGMeme()) return
    const gMeme = getGMeme()
    gMeme.isActive =  true 
    renderBorderLine()
}

function gMemeEditModeNotActive(){
    console.log('gMemeEditModeNotActive');

    if (!getGMeme()) return
    const gMeme = getGMeme()
    gMeme.isActive = false 
    renderGMeme()

}
