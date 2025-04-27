'use strict';
var gImgs = []
// { id: 1, url: 'img/1.jpg', keywords: ['funny', 'cat'] }
var gMeme
var gKeywordSearchCountMap = { 'funny': 12, 'cat': 16, 'baby': 2 }

// Lists

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
                color: 'black',
                textPositionX: 35,
                textPositionY: 30,
                lineHeight: 30,
            
            }
        ]
    }
}


// Update

function setGMemeSelectedLine(el) {
    let change = changeByELClassListContainsDecreaseOrIncrease(1, el)

    if (change < 0 && gMeme.selectedLineIdx <= 0) return
    if (change > 0 && gMeme.selectedLineIdx >= gMeme.lines.length - 1) return
    gMeme.selectedLineIdx += change

}

function setImg(el) {
    _createMemeImg(el)
}

function setLineHeight(setSize) {
    return gMeme.lines[gMeme.lines.length - 1].lineHeight += +setSize
}

function setFontSize(setSize) {
    return gMeme.lines[gMeme.lines.length - 1].size += +setSize
}

function setLineTxt(txt) {
    gMeme.selectedLineIdx
    return gMeme.lines[gMeme.selectedLineIdx].txt = txt
}

function GetLastLine() {
    return gMeme.lines[gMeme.lines.length - 1]
}

function createNewLine() {
    let lastLine = GetLastLine()
    const { textPositionX, textPositionY } = lastLine
    const newLine = {
         txt: '',
          size: 20,
           color: 'black',
            textPositionX,
             textPositionY,
              lineHeight: 30,
             }
    newLine.textPositionY += 30
    gMeme.selectedLineIdx++
    gMeme.lines.push(newLine)
    gMeme.selectedLineIdx = gMeme.lines.length - 1
    renderBorderLine()
}

function setTextWidth(textWidth) {
    return gMeme.lines[gMeme.selectedLineIdx].textWidth = textWidth
}


function saveTextColor(color) {
    return gMeme.lines[gMeme.lines.length - 1].color = color
}

// Helpers

function _calculateTextPositionOnLine(lineIdx) {
    const textPosition = {}
    textPosition.x = gLines[lineIdx].lineStartPointX + 10
    textPosition.y = gLines[lineIdx].lineStartPointy + 10
    return textPosition
}

function changeByELClassListContainsDecreaseOrIncrease(factor, el) {
    if (el.classList.contains('decrease')) return -factor
    else return factor
}

