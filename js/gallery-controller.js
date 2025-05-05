'use strict';
var gFilterBy

// Lists

function onInitGallery() {
    gElCanvas = document.querySelector('.Search-canvas');
    gCtx = gElCanvas.getContext('2d')
    renderGallery()
}

function renderGallery(filteredImages) {
    var gImgs = filteredImages || getGImgs()
    document.querySelector('.gallery-pics').innerHTML = ''

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
    const elContainer = document.querySelectorAll(`.${containerClassName}.container`)
    const elSearchBarContainer = document.querySelector('.Search-bar');
    elContainer.forEach(container => container.classList.remove('hidden'))
    document.querySelectorAll('.container').forEach((el) => {
        if (!el.classList.contains(containerClassName))
            el.classList.add('hidden')
    })

    if ([...elContainer].some(el => el.classList.contains('saved-meme-gallery'))) {
        onInitSavedMemeGallery()
    }
    else if ([...elContainer].some(el => el.classList.contains('meme'))) onIniMemeEdit()
    else if ([...elContainer].some(el => el.classList.contains('gallery'))) onInitGallery()
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
        createRandomTextLines(3)
        onSetTextWidth()
        renderGMeme()
    })

}

// Update

function wiggleElement(el) {
    console.log("🚀 ~ wiggleElement ~ el:", el)
    el.classList.remove('wiggle');
    setTimeout(() => {
        el.classList.add('wiggle')
    }, 50);
}

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