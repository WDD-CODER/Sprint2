'use strict';



function onInitSavedMemeGallery() {

}
renderSavedMemeGallery()
//אני מציג רק את התמונה מתוך מה שנשמר במיים!!
function renderSavedMemeGallery() {
    document.querySelector('.meme.gallery-pics').innerHTML = ''
    getGSavedMems().forEach(meme => {
        document.querySelector('.meme.gallery-pics').innerHTML += `
                         <figure>
                         <figcaption class="img-name"></figcaption>
                         <img onclick="onEditMeme(this)" id="${meme.selectedImgId}" src="${meme.imgUrl}" alt="img">
                         </figure>
        `;
    })
}

function onEditMeme(el) {
    setGMeme(getMemeById(el.id))
    console.log('gMeme', gMeme);
    showContainer('meme')
    onIniMemeEdit()
    renderGMeme()
}



// const imgs = getGImgs();
// for (let i = 0; i < imgs.length; i++) {
//     document.querySelector('.gallery-pics').innerHTML += `
//                      <figure>
//                      <figcaption class="img-name"></figcaption>
//                      <img onclick="onImgSelect(this)" id="${i + 1}" src="${}" alt="img">
//                      </figure>
//     `;
// }



