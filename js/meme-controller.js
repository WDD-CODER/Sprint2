'use strict';
var gElCanvas
var gCtx
var gPos = {}

//  Lists 

function onInitMemeEditor() {
    gElCanvas = document.querySelector('.meme-canvas')
    gCtx = gElCanvas.getContext('2d')
    renderEmojis()
}

function renderGMeme() {
    const curMeme = getGMeme()
    const curImg = getImgById(curMeme.selectedImgId)
    resizeCanvas()
    clearCanvas()
    renderImgOnCanvas(curImg.img)
    renderLine()
    renderColorInput()
    renderFontInput()
    renderEmojis()
    drawEmoji()
}

function renderImgOnCanvas(img) {
    const maxWidth = 350 // or container max width
    gElCanvas.width = Math.min(maxWidth, img.naturalWidth);
    gElCanvas.height = (img.naturalHeight / img.naturalWidth) * gElCanvas.width
    gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
    // optimize the canvas container after putting the picture
    resizeCanvasContainer(gElCanvas.width, gElCanvas.height)
}

function renderLine() {
    const selectedLineIdx = getGMeme().selectedLineIdx;
    getGMeme().lines.forEach((line, idx) => {
        // לעשות דיסטרקצר פה!!!
        drawText(line.text, line.size, line.color, line.positionX, line.positionY, line.textAlign, line.fontFamily)
        renderUnderline(line)
        if (idx === selectedLineIdx) renderBorderLine(line)
    })
}

function renderBorderLine(line) {
    const meme = getGMeme()
    if (!meme.isActive || !meme.lines.length) return
    const newLine = getBorderLinePosition(line)
    drawRoundRect(newLine.positionX, newLine.positionY, newLine.lineWidth, newLine.lineHeight, newLine.textColor)
}

function renderUnderline(line) {
    if (!line.underline) return;
    const pos = getUnderlinePosition(line);
    drawUnderline(pos.strokeStartPointX, pos.strokeStartPointY, pos.strokeEndPointX);
}

function renderEmojis() {
    const emojis = getGEmojis()
    document.querySelector('.emojis-scrollbar').innerHTML = ''
    emojis.forEach(emoji => {
        document.querySelector('.emojis-scrollbar').innerHTML += `
                         <img class="emoji-img" onclick="onClickEmoji(this)" id="${emoji.id}" src="${emoji.url}" alt="emoji">`
    })

}

function renderFontInput() {
    if (!getGMeme().lines.length) return
    let FontFamily = getGMeme().lines[gMeme.selectedLineIdx].fontFamily
    document.querySelector('.font-family').value = FontFamily || 'Arial'
    return FontFamily
}

function renderColorInput() {
    const memeLines = getGMeme().lines
    if (!memeLines.length) return
    document.querySelector('.text-color').value = memeLines[gMeme.selectedLineIdx].color
}

function onClickCanvas(ev) {
    if (getGEmoji() !== undefined) createMemeEmoji(ev)
    else onClickObjectInCanvas(ev)
}

function onClickObjectInCanvas(ev) {
    var curObject = getClickedOnItem(ev)
    if (curObject === null) return
    setSelectedObject(curObject)
    renderGMeme()
    requestAnimationFrame(() => moveToTextInput())
}

// Create

function onClickEmoji(el) {
    return setCurGEmoji(el)
}

function onSaveMeme(ev) {
    if (!confirm('Are you sure you want to save the picture?')) return
    editMemeNotActive()
    const meme = getGMeme()
    const CurImgUrl = gElCanvas.toDataURL();
    const RandomId = getRandomId()
    let curGImg = getImgById(meme.selectedImgId)

    meme.imgUrl = CurImgUrl
    meme.id = RandomId

    saveImgToLocalStorage(curGImg)
    saveMemeToLocalStorage(meme)
    showContainer('saved-meme-gallery')
}

function onTextInput(el) {
    editMemeActive()
    setLineText(el.value)
    onSetTextWidth()
    renderGMeme()
}

function onAddLine(ev) {
    if (ev) ev.preventDefault()
    createLine()
    moveToTextInput()
    renderGMeme()
}

function drawText(str, textSize, color, positionX, positionY, textAlign, fontFamily) {
    fontFamily = fontFamily || 'Arial'
    gCtx.textAlign = textAlign || 'start';
    gCtx.textBaseline = 'top'
    gCtx.font = `${textSize}px ${fontFamily}`
    gCtx.fillStyle = color || '#000000'
    gCtx.fillText(str, positionX, positionY)
}

function drawRoundRect(startPointX, startPointY, lineWidth, lineHeight, color = '#000000') {
    gCtx.beginPath()
    gCtx.roundRect(startPointX, startPointY, lineWidth, lineHeight, lineHeight / 2)
    gCtx.strokeStyle = color
    gCtx.stroke()
}

function drawUnderline(strokeStartPointX, strokeStartPointY, strokeEndPointX, color) {
    gCtx.beginPath();
    gCtx.strokeStyle = color || 'black';
    gCtx.lineWidth = 1;
    gCtx.moveTo(strokeStartPointX, strokeStartPointY);
    gCtx.lineTo(strokeStartPointX + strokeEndPointX, strokeStartPointY);
    gCtx.stroke();

}

function drawEmoji() {
    if (!getGMeme().emojis) return
    const memeEmojis = getGMeme().emojis
    memeEmojis.forEach(emoji => {
        const img = emoji.img
        const width = img.naturalWidth / 15
        const height = img.naturalHeight / 15
        gCtx.drawImage(img, emoji.positionX - width / 2, emoji.positionY - height / 2, width, height)
    })
    setCurGEmoji(null)
}


// Read
function moveToTextInput() {
    if (!getGMemeLinesNum()) return
    editMemeActive()
    getTextInputValue()
    document.querySelector('.line-text.meme').focus()
}

function getCanvasContainerWidth() {
    return document.querySelector('.canvas-container').offsetWidth - (35 * 2)
}

function getCurTextPosition(value) {
    if (value === 'left') return getGTextPosition().x
    else if (value === 'right') return gElCanvas.width - getGTextPosition().y
    else return gElCanvas.width / 2
}


// Update
function resizeCanvasContainer(width, height) {
    const elContainer = document.querySelector('.canvas-container')
    elContainer.style.width = width + 'px'
    elContainer.style.height = height + 'px'
}

function resizeCanvas() {
    const elContainer = document.querySelector('.canvas-container')
    gElCanvas.width = elContainer.offsetWidth
    gElCanvas.height = elContainer.offsetHeight
}

function onScrollEmojiContainer(el) {
    const elEmojis = document.querySelector('.emojis-scrollbar')
    if (el.classList.contains("right")) elEmojis.scrollLeft += 100
    else elEmojis.scrollLeft += -100
}

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
    const textWidth = gCtx.measureText(line.text).width
    setTextWidth(textWidth)
    if (textWidth >= getMaxLineWidth()) onAddLine()
}

function onSetSelectedLine(el, lineIdx) {

    if (getGMeme().lines.length <= 1) return
    setGMemeSelectedLine(el)
    moveToTextInput()
    renderGMeme()
}

function onSetFontFamily(el) {
    setFontFamily(el.value)
    moveToTextInput()
    renderGMeme()
}

function onSetFontSize(el) {
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

function onClearSavedMems() {
    clearSavedMems()
    showContainer('gallery')
}

function clearCanvas() {
    gCtx.fillStyle = "white"
    gCtx.fillRect(0, 0, gElCanvas.width, gElCanvas.height)
}

function onDeleteLine() {
    if (!getGMemeLinesNum()) return
    deleteLineFromGMeme()
    moveToTextInput()
    renderGMeme()
}

// Helpers

function editMemeActive() {
    if (!getGMeme()) return
    getGMeme().isActive = true
    renderBorderLine()
}

function editMemeNotActive() {
    console.log('editMemeNotActive')

    if (!getGMeme()) return
    getGMeme().isActive = false
    renderGMeme()
}
