'use strict';
var gImgs = []
// { id: 1, url: 'img/1.jpg', keywords: ['funny', 'cat'] }
var gMeme
var gKeywordSearchCountMap = { 'funny': 12, 'cat': 16, 'baby': 2 }

// Lists

function getAccurateBorderLinePosition() {
    const curLine = gMeme.lines[gMeme.selectedLineIdx]
    const elCanvasContainerWidth = document.querySelector('.canvas-container.meme').offsetWidth
    const centerOfCanvas = elCanvasContainerWidth / 2
    // starts with left
    const widthFallback = elCanvasContainerWidth - curLine.textPositionX * 2;
    const lineWidth = curLine.textWidth + 15 || widthFallback
    const lineHeight = curLine.size + 4
    const textAlign = curLine.textAlign || ''

    let linePositionX = curLine.textPositionX - 5
    let linePositionY = curLine.textPositionY - 2.5

    if (textAlign === 'center') {
        linePositionX = centerOfCanvas - lineWidth / 2
        linePositionY = curLine.textPositionY - 2.5
    }

    else if (textAlign === "right") {
        linePositionX = curLine.textPositionX + 5 - lineWidth
        linePositionY = curLine.textPositionY - 2.5
    }

    const accurateLinePositions = { linePositionX, linePositionY, lineWidth, lineHeight }
    return accurateLinePositions

}
function getAccurateUnderLinePosition() {
    const curLine = gMeme.lines[gMeme.selectedLineIdx]
    let strokeStartPointX = curLine.textPositionX - 2
    let strokeStartPointY = curLine.textPositionY + curLine.size + 2
    let strokeEndPointX = curLine.textPositionX + curLine.textWidth + 2
    const UnderLinePosition = { strokeStartPointX, strokeStartPointY, strokeEndPointX }
    return UnderLinePosition
}

function getSelectedLineIdx() {
    return gMeme.selectedLineIdx
}

function getLineIdxByPosition(ev) {
    if (!gMeme) return
    const pos = getEvPos(ev)
    const elCanvasContainerWidth = document.querySelector('.canvas-container.meme').offsetWidth
    const centerOfCanvas = elCanvasContainerWidth / 2
    const curLineIdx = gMeme.lines.findIndex(line => {
        let { textPositionX, textPositionY, lineHeight, textWidth } = line
        // In case the line was added without any text, Gives the line One time use width so it could be chosen.
        if (!textWidth) textWidth = getCanvasContainerWidth()
        var isClicked
        if (line.textAlign) {
            if (line.textAlign === "center") {
                isClicked =
                    pos.x >= centerOfCanvas - 10 - textWidth / 2 &&
                    pos.x <= centerOfCanvas + 10 + textWidth / 2
                    &&
                    pos.y >= textPositionY - 3 &&
                    pos.y <= textPositionY + lineHeight + 3
            }
            else if (line.textAlign === "right") {
                isClicked =
                    pos.x >= textPositionX - textWidth - 10 &&
                    pos.x <= textPositionX + 10
                    &&
                    pos.y >= textPositionY - 3 &&
                    pos.y <= textPositionY + lineHeight + 3
            }
            else {
                //text align to the left
                isClicked =
                    pos.x >= textPositionX - 10 &&
                    pos.x <= textPositionX + textWidth + 20
                    &&
                    pos.y >= textPositionY - 3 &&
                    pos.y <= textPositionY + lineHeight + 3
            }
            return isClicked
        }

        else {
            //text align to the left
            isClicked =
                pos.x >= textPositionX - 10 &&
                pos.x <= textPositionX + textWidth + 20
                &&
                pos.y >= textPositionY - 3 &&
                pos.y <= textPositionY + lineHeight + 3
            return isClicked
        }

    })
    return curLineIdx !== -1 ? curLineIdx : null
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
                size: 30,
                color: '#000000',
                textPositionX: 35,
                textPositionY: 30,
                lineHeight: 30,
            }
        ]
    }
}


// Update

function setFontFamily(value) {
    return gMeme.lines[gMeme.selectedLineIdx].fontFamily = value
}


function SetTextAlignment(el) {
    const CurLine = gMeme.lines[gMeme.selectedLineIdx]
    CurLine.textAlign = el.value
    CurLine.textPositionX = getUpdatedTextPositionX(el.value)


    // const textAlignment = {align, newPositionX}
    // textAlignment.align = gMeme.lines[gMeme.selectedLineIdx].textAlign
    // textAlignment.newPositionX = gMeme.lines[gMeme.selectedLineIdx].textAlign

}

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
    var { textPositionY, lineHeight, size } = lastLine
    const newLine = {
        txt: '',
        size: 20,
        color: '#000000',
        textPositionX: 35,
        textPositionY: textPositionY + size,
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

function CheckGMemeLinesNumb() {
    if (gMeme.lines.length <= 0) return null
    else return gMeme.lines.length
}


