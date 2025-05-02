'use strict';
var gLastContainer

// Lists
function onInitGallery() {
    gElCanvas = document.querySelector('.Search-canvas');
    gCtx = gElCanvas.getContext('2d')
    gLastContainer = 'gallery-container'
    renderGallery()
}

function renderGallery() {
    const imgs = getGImgs();
    for (let i = 0; i < 10; i++) {
        document.querySelector('.gallery-pics').innerHTML += `
                         <figure>
                         <figcaption class="img-name"></figcaption>
                         <img onclick="onImgSelect(this)" id="${i + 1}" src="style/assets/img/meme-imgs-(various-aspect-ratios)/${i + 1}.jpg" alt="img">
                         </figure>
        `;
    }

}
//not sure needed anymore...
function SwitchBetweenMainContainers() {
    document.querySelectorAll('.container').forEach(el => {
        if (el.classList.contains('hidden')) el.classList.remove('hidden')
        else el.classList.add('hidden')
    })
}

function showContainer(containerClassName) {
    document.querySelector(`.${containerClassName}.container`).classList.remove('hidden')
    document.querySelectorAll('.container').forEach((el) => {
        console.log("🚀 ~ document.querySelectorAll ~ el:", el)
        if (!el.classList.contains(containerClassName))
            el.classList.add('hidden')
    })
}

function showSavedMemeGallery() {
    document.querySelector('.saved-meme-gallery.container').classList.remove('hidden')
    document.querySelectorAll('.container').forEach((el) => {
        !el.classList.contains('gallery-pics')
        el.classList.add('hidden')
    })


    document.querySelector('.gallery.container').classList.add('hidden')
}


// Create

function onImgSelect(el) {
    // showEditorContainer()
    showContainer('meme')
    onIniMemeEdit()
    setImg(el)
}

function onGenerateRandomMeme() {
    SwitchBetweenMainContainers()
    onIniMemeEdit()
    const randomImg = getRandomImg()
    setImg(randomImg, () => {
        setRandomTextLines(3)
        onSetTextWidth()
        renderGMeme()
    })
}

// Update

function onChooseContainer(el) {
    const containerClassName = el.dataset.tab
    showContainer(containerClassName)
}
