// ライトボックス機能
function openLightbox() {
  document.getElementById("lightbox").style.display = "block";
}

function closeLightbox() {
  document.getElementById("lightbox").style.display = "none";
}

var slideIndex = 1;
function currentSlide(n) {
  slideIndex = n;
  showSlide(slideIndex);
}

function showSlide(n) {
  var artImages = document.querySelectorAll(".art-piece img");
  var artTitles = document.querySelectorAll(".art-piece .art-info h2");
  var lightboxImg = document.getElementById("lightbox-img");
  var captionText = document.getElementById("caption");
  if(n > artImages.length) { slideIndex = 1; }
  if(n < 1) { slideIndex = artImages.length; }
  lightboxImg.src = artImages[slideIndex - 1].src;
  captionText.innerText = artTitles[slideIndex - 1].innerText;
}

if (typeof module !== 'undefined') {
  module.exports = { openLightbox, closeLightbox, showSlide, currentSlide };
}
