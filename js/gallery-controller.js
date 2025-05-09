'use strict';
var gFilterBy

// Lists

function onInitGallery() {
    renderGallery()
    createEmojiImgObject()
}

function renderGallery(filteredImages) {
    var gImgs = filteredImages || getGImgs()
    document.querySelector('.gallery-pics').innerHTML = ''

    gImgs.forEach(img => {
        document.querySelector('.gallery-pics').innerHTML += `
                         <figure>
                         <figcaption class="img-name"></figcaption>
                         <img onclick="onImgSelect(this)" id="${img.id}" src="${img.url}" alt="img">
                         </figure>`
    })

}

function onFilterImgs(el) {
    gFilterBy = el.value
    const filteredImgs = getGImgs().filter(img => img.keywords.includes(gFilterBy))
    renderGallery(filteredImgs)
}

function showContainer(containerClassName) {
    const allElContainers = document.querySelectorAll(`.container`)
    const curElContainer = document.querySelector(`.${containerClassName}.container`)
    // Takes off all the hidden and adds hidden to who needed
    // allElContainers.forEach(container => container.classList.remove('hidden'))
    allElContainers.forEach((elContainer) => {
        if (!elContainer.classList.contains(containerClassName)) elContainer.classList.add('hidden')
        else elContainer.classList.remove('hidden')
    })
    if (curElContainer.classList.contains('saved-meme-gallery')) onInitSavedMemeGallery()
    else if (curElContainer.classList.contains('meme')) onInitMemeEditor()
    else if (curElContainer.classList.contains('gallery')) onInitGallery()
}

// Create

function onImgSelect(el) {
    showContainer('meme')
    onInitMemeEditor()
    setImgObject(el)
}

function onGenerateRandomMeme() {
    showContainer('meme')
    onInitMemeEditor()
    const randomImg = getRandomImgFromGallery()
    setImgObject(randomImg, () => {
        createRandomTextLines(3)
        onSetTextWidth()
        renderGMeme()
        editMemeActive()
        moveToTextInput()
    })
}

// Update

function onWiggleElement(el) {
    el.classList.remove('wiggle')
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