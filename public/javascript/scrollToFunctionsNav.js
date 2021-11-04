// Scrolls user to elements on the page via icons
const scrollToGallery = () => {
    document.querySelector('.slideshow-container').scrollIntoView({
        behavior: 'smooth'
    });
}

const scrollToMap = () => {
    document.querySelector('#map').scrollIntoView({
        behavior: 'smooth'
    });
}

