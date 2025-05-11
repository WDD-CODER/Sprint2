'use strict';

const G_START_POSITION_X = 20
const G_START_POSITION_Y = 30
const MEME_STORAGE_KEY = 'memeDB'
const IMG_STORAGE_KEY = 'imgDB'
const gRandomTexts = [
    "You know I love you!",
    "Hey there... you!",
    "How's it hanging over there?",
    "That doesn't look good.",
    "Ah, shit... Here we go again.",
    "When you forget and open the fridge.",
    "Me? Normal? Never heard of it.",
    "404: Motivation not found.",
    "Just one more episode… at 3am.",
    "I came. I saw. I made it awkward."
]

const gImgs = loadGImgsFromStorage(IMG_STORAGE_KEY) || [
    { id: 1, url: './assets/img/pics/1.jpg', keywords: ['lady', 'fun'] },
    { id: 2, url: './assets/img/pics/2.jpg', keywords: ['baby', 'cute'] },
    { id: 3, url: './assets/img/pics/3.jpg', keywords: ['dog', 'cute'] },
    { id: 4, url: './assets/img/pics/4.jpg', keywords: ['baby', 'dog'] },
    { id: 5, url: './assets/img/pics/5.jpg', keywords: ['baby', 'cool'] },
    { id: 6, url: './assets/img/pics/6.jpg', keywords: ['man', 'fun'] },
    { id: 7, url: './assets/img/pics/7.jpg', keywords: ['cat', 'cute'] },
    { id: 8, url: './assets/img/pics/8.jpg', keywords: ['baby', 'funny'] },
    { id: 9, url: './assets/img/pics/9.jpg', keywords: ['man', 'strict'] },
    { id: 10, url: './assets/img/pics/10.jpg', keywords: ['man', 'funny'] },
    { id: 11, url: './assets/img/pics/Ancient-Aliens.jpg', keywords: ['actor', 'funny'] },
    { id: 12, url: './assets/img/pics/drevil.jpg', keywords: ['drEvil', 'man'] },
    { id: 13, url: './assets/img/pics/img2.jpg', keywords: ['kids', 'fun'] },
    { id: 14, url: './assets/img/pics/img6.jpg', keywords: ['dog', 'funny'] },
    { id: 15, url: './assets/img/pics/img11.jpg', keywords: ['obama', 'funny'] },
    { id: 16, url: './assets/img/pics/img12.jpg', keywords: ['man', 'funny'] },
    { id: 17, url: './assets/img/pics/leo.jpg', keywords: ['actor', 'fun'] },
    { id: 18, url: './assets/img/pics/meme1.jpg', keywords: ['actor', 'cool'] },
    { id: 19, url: './assets/img/pics/One-Does-Not-Simply.jpg', keywords: ['man', 'cool'] },
    { id: 20, url: './assets/img/pics/Oprah-You-Get-A.jpg', keywords: ['lady', 'funny'] },
    { id: 21, url: './assets/img/pics/patrick.jpg', keywords: ['man', 'funny'] },
    { id: 22, url: './assets/img/pics/X-Everywhere.jpg', keywords: ['funny', 'cute'] }
];

const gEmojis = createEmojis(7)


//I don't understand why there's the tree dots underneath below from storage. I just can't understand
var gSavedMems = loadFromLocalStorage(MEME_STORAGE_KEY) || []
var gMeme
var gKeywordSearchCountMap = { 'funny': 12, 'cat': 16, 'baby': 2, 'dog': 2, 'man': 2, 'cute': 2, 'cool': 2, 'strict': 2 }
var gEmoji
var gClickedObject
var gStartPos
// Lists

function loadGImgsFromStorage(key) {
    const savedImgs = loadFromLocalStorage(key)
    if (savedImgs) savedImgs.forEach(gImg => {
        const img = new Image();
        img.src = gImg.url;
        gImg.img = img;
    })
    return savedImgs
}



// Create
// למה לא להכניס פה את היצירה של התמונה ולקבוע אותה 
function createEmojis(num) {
    const emojis = []
    for (let i = 1; i <= num; i++) {
        let emoji = { id: i, url: `./assets/img/emojis/${i}.png` }
        emojis.push(emoji)
    }
    return emojis
}

function _createImg(el, onReady) {
    var curImg = {}
    const img = new Image()
    img.onload = () => {
        curImg = {
            id: +el.id,
            url: el.src,
            keywords: [],
            img: img
        }
        var curIdx = gImgs.findIndex(img => img.id === curImg.id)
        gImgs[curIdx].img = img
        _createGMeme(el.id)
        renderImgOnCanvas(img)
        if (onReady) onReady()
    }
    img.src = el.src
}

function createEmojiImgObject() {
    if (!gEmojis) return
    gEmojis.forEach((emoji, idx) => {
        const img = new Image()
        img.src = emoji.url
        gEmojis[idx].img = img
    })
}

function _createGMeme(ImgId) {
    gMeme = {
        selectedImgId: +ImgId,
        selectedLineIdx: 0,
        isActive: false,
        lines: [
            {
                text: '',
                size: 20,
                color: '#f5f5f5',
                positionX: G_START_POSITION_X,
                positionY: G_START_POSITION_Y,
                lineHeight: 30,
            }
        ]
    }
    moveToTextInput()
}

function createMemeEmoji(ev) {
    console.log('gMeme', gMeme)

    const emoji = getGEmoji()
    const randomId = getRandomId()
    if (!gMeme.emojis) gMeme.emojis = []
    const pos = getEvPos(ev)
    const emojiObject = { id: randomId, img: emoji.img, positionX: pos.x, positionY: pos.y }
    getGMeme().emojis.push(emojiObject)
    drawEmoji(randomId)
}

function createLine() {
    const lastLine = getLastLine();
    const baseY = lastLine ? lastLine.positionY + lastLine.lineHeight : G_START_POSITION_Y;
    const newLine = {
        text: '',
        size: 16,
        color: '#f5f5f5',
        positionX: G_START_POSITION_X,
        positionY: baseY,
        lineHeight: 30
    };

    gMeme.lines.push(newLine);
    gMeme.selectedLineIdx = gMeme.lines.length - 1;
}

function createRandomTextLines(numOfLines) {
    gMeme.lines = []
    for (let i = 0; i < numOfLines; i++) {
        createLine()
    }
    gMeme.lines.forEach(line => line.text = getRandomText())
}

// Reade


function getBorderLinePosition(line) {

    const curLine = line || gMeme.lines[gMeme.selectedLineIdx]
    const elCanvasContainerWidth = document.querySelector('.canvas-container.meme').offsetWidth
    const centerOfCanvas = elCanvasContainerWidth / 2
    const marginInline = G_START_POSITION_X * 2
    const lineWidthFallback = elCanvasContainerWidth - marginInline;

    // starts with left
    const lineWidth = curLine.textWidth + 15 || lineWidthFallback
    const textColor = curLine.color
    const textSize = curLine.size
    const lineHeight = textSize + 4
    const textAlign = curLine.textAlign || ''

    let positionX = curLine.positionX - 5
    let positionY = curLine.positionY - 2.5

    if (textAlign === 'center') positionX = centerOfCanvas - lineWidth / 2
    else if (textAlign === "right") {
        positionX = curLine.positionX + 5 - lineWidth
    }
    const accurateLinePositions = { positionX, positionY, lineWidth, lineHeight, textSize, textColor }
    return accurateLinePositions
}
function getUnderlinePosition(line) {
    const { positionX, positionY, lineWidth, textSize } = getBorderLinePosition(line)
    let strokePositionX = positionX
    let strokePositionY = positionY + textSize + 4
    let strokeWidth = lineWidth
    var UnderlinePosition = { strokePositionX, strokePositionY, strokeWidth }
    return UnderlinePosition
}

function getMaxLineWidth() {
    const elCanvasContainerWidth = document.querySelector('.canvas-container.meme').offsetWidth
    const marginInline = G_START_POSITION_X * 2
    return elCanvasContainerWidth - marginInline
}

function getClickedOnItem(ev) {
    if (!gMeme) return
    const pos = getEvPos(ev)
    const elCanvasContainerWidth = document.querySelector('.canvas-container.meme').offsetWidth
    const centerOfCanvas = elCanvasContainerWidth / 2
    const emojiSize = 50
    var pictItem = {}
    var isClicked
    if (gMeme.emojis !== undefined) {
        pictItem.idx = gMeme.emojis.findIndex(emoji => {
            let { positionX, positionY } = emoji
            isClicked =
                pos.x >= positionX - emojiSize / 2 &&
                pos.x <= positionX + emojiSize / 2
                &&
                pos.y >= positionY - emojiSize / 2 &&
                pos.y <= positionY + emojiSize / 2
            return isClicked
        })

        if (pictItem.idx !== -1) {
            pictItem.type = 'emoji'
            pictItem.isClicked = true

        }
    }

    if (pictItem.idx === -1 || pictItem.idx === undefined) {
        pictItem.idx = gMeme.lines.findIndex(line => {
            let { positionX, positionY, lineHeight, textWidth } = line
            // In case the line was added without any text, Gives the line One time use width so it could be chosen.
            if (!textWidth) textWidth = getCanvasContainerWidth()
            if (line.textAlign) {
                if (line.textAlign === "center") {
                    isClicked =
                        pos.x >= centerOfCanvas - 10 - textWidth / 2 &&
                        pos.x <= centerOfCanvas + 10 + textWidth / 2
                        &&
                        pos.y >= positionY - 3 &&
                        pos.y <= positionY + lineHeight + 3
                }
                else if (line.textAlign === "right") {
                    isClicked =
                        pos.x >= positionX - textWidth - 10 &&
                        pos.x <= positionX + 10
                        &&
                        pos.y >= positionY - 3 &&
                        pos.y <= positionY + lineHeight + 3
                }
                else {
                    //text align to the left
                    isClicked =
                        pos.x >= positionX - 10 &&
                        pos.x <= positionX + textWidth + 20
                        &&
                        pos.y >= positionY - 3 &&
                        pos.y <= positionY + lineHeight + 3
                }

            } else {
                //text align to the left
                isClicked =
                    pos.x >= positionX - 10 &&
                    pos.x <= positionX + textWidth + 20
                    &&
                    pos.y >= positionY - 3 &&
                    pos.y <= positionY + lineHeight + 3
            }
            return isClicked
        })

        if (pictItem.idx !== -1) {
            pictItem.type = 'line'
            pictItem.isClicked = true
        }

        else pictItem = null
    }
    setObjectIsClicked(pictItem)
    console.log("🚀 ~ getClickedOnItem ~ pictItem:", pictItem)
    return pictItem
}

function getTextInputValue() {
    const textInput = document.querySelector('.line-text.meme')
    if (!gMeme.lines.length) return textInput.value = ''
    const lineIdx = getSelectedLineIdx()
    textInput.value = getGMeme().lines[lineIdx].text
}

function getGEmojis() {
    return gEmojis
}
function getGEmoji() {
    return gEmoji
}
function getImgById(id) {
    const curImgIdx = gImgs.findIndex(img => img.id === id)
    return gImgs[curImgIdx];
}
function getGSavedMems() {
    return gSavedMems
}
function getLastLine() {
    return gMeme.lines[gMeme.lines.length - 1]
}

function getSelectedLineIdx() {
    return gMeme.selectedLineIdx
}
function setSelectedLine(lineIdx) {
    return gMeme.selectedLineIdx = lineIdx
}

function getGImgs() {
    return gImgs;
}

function getGMeme() {
    return gMeme
}

function getMemeById(memeId) {
    return gSavedMems.find(meme => meme.id === memeId)
}

function getGTextPosition() {
    const gTextPosition = {
        x: G_START_POSITION_X,
        y: G_START_POSITION_Y
    }
    return gTextPosition
}



// Update
function isCircleClicked(clickedPos) {
    const { pos } = gCircle
    // Calc the distance between two dots
    const distance = Math.sqrt((pos.x - clickedPos.x) ** 2 + (pos.y - clickedPos.y) ** 2)
    // console.log('distance', distance)
    //If its smaller then the radius of the circle we are inside
    return distance <= gCircle.size
  }
  
function setDragItem(value) {
    if (gClickedObject.type === 'line')gMeme.lines[gClickedObject.idx].setIsDrag = value
    else gMeme.emojis[gClickedObject.idx].setIsDrag = value
}

function moveItem(dx, dy) {
    const item = {}
    if (gClickedObject.type === 'line') item = gMeme.lines[gClickedObject.idx]
    else item = gMeme.emojis[gClickedObject.idx]
    item.positionX += dx
    item.positionY += dy
    console.log("🚀 ~ moveItem ~ item:", item)
    
}

function setObjectIsClicked(obj) {
    if (!obj) return gClickedObject = null
    if (obj.type === 'line') {
        gMeme.selectedLineIdx = obj.idx
        return gClickedObject = obj
    }
    else
        gMeme.selectedEmojiIdx = obj.idx
    return gClickedObject = obj
}

function setImgObject(el, onReady) {
    _createImg(el, onReady)
}

function setCurGEmoji(el) {
    if (!el) {
        gEmoji = undefined
        return
    }
    const emoji = gEmojis.find(emoji => emoji.id === +el.id)
    gEmoji = emoji
    return gEmoji
}

function setGMeme(meme) {
    return gMeme = meme
}

function saveMemeToLocalStorage(meme) {
    const alreadyExists = gSavedMems.findIndex(savedMeme => savedMeme.id === meme.id)
    if (alreadyExists !== -1) {
        gSavedMems[alreadyExists] = meme
        saveToLocalStorage(MEME_STORAGE_KEY, gSavedMems)
    }
    else {
        gSavedMems.push(meme)
        saveToLocalStorage(MEME_STORAGE_KEY, gSavedMems)
    }
}


function saveImgToLocalStorage(gImg) {
    const curId = gImg.id
    const alreadyExists = gImgs.findIndex(img => img.id === curId)
    if (alreadyExists !== -1) {
        gImgs[alreadyExists].img = gImg.img
        saveToLocalStorage(IMG_STORAGE_KEY, gImgs)
    }
    else {
        console.log('saveImgToLocalStorage');
        gImgs.push(gImg)
        saveToLocalStorage(IMG_STORAGE_KEY, gImgs)
    }
}

function saveEmojiToLocalStorage(gEmoji) {
    const curId = gEmoji.id
    const alreadyExists = gEmojis.findIndex(gEmoji => gEmoji.id === curId)
    if (alreadyExists !== -1) return
    else {
        gEmojis.push(gEmoji)
        saveToLocalStorage(IMG_STORAGE_KEY, gImgs)
    }
}

function SetTextAlignment(el) {
    const line = gMeme.lines[gMeme.selectedLineIdx]
    line.textAlign = el.value
    line.positionX = getCurTextPosition(el.value)
}

function setGMemeSelectedLine(el) {
    let change = IncreaseOrDecreaseByFactor(1, el)
    if (change < 0 && gMeme.selectedLineIdx <= 0) return
    if (change > 0 && gMeme.selectedLineIdx >= gMeme.lines.length - 1) return
    return gMeme.selectedLineIdx += change
}

function setSelectedObject(obj) {
    if (obj.type === 'line') return gMeme.selectedLineIdx = obj.idx
    else return gMeme.selectedEmojiIdx = obj.idx
}

// function setSelectedObject(obj) {
//     if (obj.type === 'line') return gMeme.selectedLineIdx = obj.idx
//     else return gMeme.selectedEmojiIdx = obj.idx
// }


function setLineText(str) {
    return gMeme.lines[gMeme.selectedLineIdx].text = str
}
function setGMemeUnderline() {
    gMeme.lines[gMeme.selectedLineIdx].underline = !gMeme.lines[gMeme.selectedLineIdx].underline;
    return gMeme.lines[gMeme.selectedLineIdx].underline;
}

function setFontFamily(value) {
    return gMeme.lines.forEach(line => line.fontFamily = value)
}

function setTextWidth(width) {
    return gMeme.lines[gMeme.selectedLineIdx].textWidth = width
}

function setFontSize(change) {
    const line = gMeme.lines[gMeme.selectedLineIdx]
    line.size += change
    gCtx.font = `${line.size}px Arial`
    return gCtx.font
}

function saveTextColor(color) {
    return gMeme.lines[gMeme.selectedLineIdx].color = color
}

function setLinePosition(change) {
    return gMeme.lines[gMeme.selectedLineIdx].positionY += change
}

// Delete

// function deleteLineFromGMeme() {
//     gMeme.lines.splice(gMeme.selectedLineIdx, 1)
//     if (gMeme.selectedLineIdx <= 0) return
//     gMeme.selectedLineIdx--
//     gMeme.isActive = false
// }

function deleteFromGMeme(obj) {
    const textInput = document.querySelector('.line-text.meme')
    const objType = gClickedObject.type
    if (objType === 'emoji') {
        gMeme.emojis.splice(obj.idx, 1)
        gMeme.isActive = false
        if (gMeme.selectedEmojiIdx <= 0) return
        gMeme.selectedEmojiIdx--
        gClickedObject = null
    }

    else {
        gMeme.lines.splice(obj.idx, 1)
        gMeme.isActive = false
        if (gMeme.selectedLineIdx <= 0) return
        gMeme.selectedLineIdx--
        gClickedObject = null
    }

    if (!gMeme.lines[gMeme.selectedLineIdx].text) {
        return textInput.value = ''
    }

    else textInput.value = gMeme.lines[gMeme.selectedLineIdx].text

}

function clearGMeme() {
    return gMeme = {}
}



// Helpers

function onDownloadImg(elLink) {
    const imgContent = gElCanvas.toDataURL('image/jpeg')
    elLink.href = imgContent
}

function clearSavedMems() {
    gSavedMems = []
    localStorage.clear()
}

function IncreaseOrDecreaseByFactor(factor, el) {
    if (el.classList.contains('decrease')) return -factor
    else return factor
}

function getGMemeLinesNum() {
    if (gMeme.lines.length <= 0) return null
    else return gMeme.lines.length
}


