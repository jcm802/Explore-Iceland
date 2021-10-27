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

