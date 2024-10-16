// Smooth Scrolling
document.querySelectorAll('#navbar a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Highlight Current Section in Navbar
window.addEventListener('scroll', () => {
    let fromTop = window.scrollY + 60;

    document.querySelectorAll('section').forEach(section => {
        if (
            section.offsetTop <= fromTop &&
            section.offsetTop + section.offsetHeight > fromTop
        ) {
            document.querySelectorAll('#navbar a').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + section.id) {
                    link.classList.add('active');
                }
            });
        }
    });
});

// Lightbox Functionality
function openLightbox() {
    document.getElementById('lightbox').style.display = 'block';
}

function closeLightbox() {
    document.getElementById('lightbox').style.display = 'none';
}

function currentSlide(n) {
    let lightboxImg = document.getElementById('lightbox-img');
    let captionText = document.getElementById('caption');
    // Update this logic based on your actual image data
    // Example: You can map image indices to their sources and captions
    const images = [
        { src: 'images/artwork1.jpg', caption: 'Title of Artwork 1 (2023)' },
        { src: 'images/artwork2.jpg', caption: 'Title of Artwork 2 (2024)' },
        // Add more images as needed
    ];

    if (n > 0 && n <= images.length) {
        lightboxImg.src = images[n - 1].src;
        captionText.innerHTML = images[n - 1].caption;
    }
}

// Optional: Close lightbox when clicking outside the image
window.onclick = function(event) {
    const lightbox = document.getElementById('lightbox');
    if (event.target == lightbox) {
        lightbox.style.display = "none";
    }
}
