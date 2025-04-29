'use strict';
var gImgs = []
// { id: 1, url: 'img/1.jpg', keywords: ['funny', 'cat'] }
var gMeme
var gKeywordSearchCountMap = { 'funny': 12, 'cat': 16, 'baby': 2 }

// Lists

function getSelectedLineIdx() {
    return gMeme.selectedLineIdx
}

function getLineIdxByPosition(ev) {
    if (!gMeme) return
    const pos = getEvPos(ev)
    const curLineIdx = gMeme.lines.findIndex(line => {
        let { textPositionX, textPositionY, lineHeight, textWidth } = line
        // In case the line was added without any text, Gives the line One time use width so it could be chosen.
        if (!textWidth) textWidth = getCanvasContainer()
        const isClicked =
            pos.x >= textPositionX - 10 &&
            pos.x <= textPositionX + textWidth + 20
            &&
            pos.y <= textPositionY - 5 + lineHeight &&
            pos.y >= textPositionY - 5
        return isClicked
    })
    var res = curLineIdx !== -1 ? curLineIdx : null
    return res
}


function getImgById(id) {
    const curImgIdx = gImgs.findIndex(img => img.id === id)
    return gImgs[curImgIdx];
}

function getGImgs() {
    return gImgs;
}

function getGMeme() {
    return gMeme
}

// Create

function _createMemeImg(el) {
    //First load the main image and then create the object
    var MemeImg = {}
    const img = new Image()
    img.onload = () => {
        MemeImg = {
            id: +el.id,
            url: el.src,
            keywords: [],
            img: img
        }
        gImgs.push(MemeImg)
        // Create GMeme object
        _createNewGMeme(MemeImg.id)
        renderImgOnCanvas(img)
    }
    img.src = el.src
}

function _createNewGMeme(ImgId) {
    gMeme = {
        selectedImgId: ImgId,
        selectedLineIdx: 0,
        lines: [
            {
                txt: '',
                size: 20,
                color: '#000000',
                textPositionX: 35,
                textPositionY: 30,
                lineHeight: 30,
            }
        ]
    }
}


// Update

function setGMemeSelectedLine(el) {
    let change = IncreaseOrDecreaseByFactor(1, el)
    if (change < 0 && gMeme.selectedLineIdx <= 0) return
    if (change > 0 && gMeme.selectedLineIdx >= gMeme.lines.length - 1) return
    gMeme.selectedLineIdx += change
}
function setGMemeSelectedLineIdxTo(lineIdx) {
    return gMeme.selectedLineIdx = lineIdx
}

function setImg(el) {
    _createMemeImg(el)
}

function setFontSize(change) {
    const line = gMeme.lines[gMeme.selectedLineIdx]
    line.size += change
    gCtx.font = `${line.size}px Arial`
    // line.textWidth = gCtx.measureText(line.txt).width;
    return
}

function setLineTxt(txt) {
    return gMeme.lines[gMeme.selectedLineIdx].txt = txt
}

function GetLastLine() {
    return gMeme.lines[gMeme.lines.length - 1]
}

function createNewLine() {
    let lastLine = GetLastLine()
    var { textPositionX, textPositionY, lineHeight, size } = lastLine
    const newLine = {
        txt: '',
        size: 20,
        color: '#000000',
        textPositionX,
        textPositionY:textPositionY + size,
        lineHeight,
    }
    newLine.textPositionY += lineHeight
    gMeme.selectedLineIdx++
    gMeme.lines.push(newLine)
    // Make sure when creating a new line always set it to the last idx
    gMeme.selectedLineIdx = gMeme.lines.length - 1
    renderBorderLine()
}

function setTextWidth(width) {
   return gMeme.lines[gMeme.selectedLineIdx].textWidth = width
} 


function saveTextColor(color) {
    return gMeme.lines[gMeme.selectedLineIdx].color = color
}

// Delete

function DeleteLineFromGMeme() {
    gMeme.lines.splice(gMeme.selectedLineIdx, 1)
    gMeme.selectedLineIdx--
}


// Helpers

function _calculateTextPositionOnLine(lineIdx) {
    const textPosition = {}
    textPosition.x = gLines[lineIdx].lineStartPointX + 10
    textPosition.y = gLines[lineIdx].lineStartPointy + 10
    return textPosition
}

function IncreaseOrDecreaseByFactor(factor, el) {
    if (el.classList.contains('decrease')) return -factor
    else return factor
}

function CheckGMemeLinesNumb(){
    if (gMeme.lines.length <= 0) return null
    else return gMeme.lines.length
    }
    
