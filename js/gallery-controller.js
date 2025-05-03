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

function showContainer(containerClassName) {
    const elContainer = document.querySelector(`.${containerClassName}.container`)
    elContainer.classList.remove('hidden')
    document.querySelectorAll('.container').forEach((el) => {
        if (!el.classList.contains(containerClassName))
            el.classList.add('hidden')
    })
    if (elContainer.classList.contains('saved-meme-gallery')) renderSavedMemeGallery()
}

// Create

function onImgSelect(el) {
    showContainer('meme')
    onIniMemeEdit()
    setImgObject(el)
}

function onGenerateRandomMeme() {
    showContainer('meme')
    onIniMemeEdit()
    const randomImg = getRandomImgFromGallery()
    setImgObject(randomImg, () => {
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
