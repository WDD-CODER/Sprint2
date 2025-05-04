'use strict';
var gFilterBy

// Lists
window.onerror = (msg, src, line, col, err) => {
    console.error('💥 Global error:', { msg, src, line, col, err });
};


function onInitGallery() {
    gElCanvas = document.querySelector('.Search-canvas');
    gCtx = gElCanvas.getContext('2d')
    renderGallery()
}

function renderGallery(filteredImages) {
    var gImgs = filteredImages || getGImgs()
    gImgs.forEach(img => {
        document.querySelector('.gallery-pics').innerHTML += `
                         <figure>
                         <figcaption class="img-name"></figcaption>
                         <img onclick="onImgSelect(this)" id="${img.id}" src="${img.url}" alt="img">
                         </figure>
        `;
    })

}

function onFilterImgs(el) {
    gFilterBy = el.value
    var filteredImgs = getGImgs().filter(img => img.keywords.includes(gFilterBy))
    renderGallery(filteredImgs)
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

// Delete

function onClearFilter() {
    gFilterBy = ''
    document.querySelector('.keyWords-input').value = ''
    renderGallery()
}