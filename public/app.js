(function () {
    // Query DOM elements
    let carouselItems = document.querySelectorAll('.carousel .list .item'); // Renamed from 'list'
    let carousel = document.querySelector('.carousel');
    let dots = document.querySelectorAll('.dots li');
    let nextBtn = document.getElementById('next');
    let prevBtn = document.getElementById('prev');

    // Carousel state
    let lastPosition = carouselItems.length - 1;
    let active = 0;
    let zIndex = 2;

    // Event listeners for buttons
    nextBtn.onclick = () => {
        let newValue = active + 1 > lastPosition ? 0 : active + 1;
        setItemActive(newValue, showSlider);
    };

    prevBtn.onclick = () => {
        let newValue = active - 1 < 0 ? lastPosition : active - 1;
        setItemActive(newValue, showSlider);
    };

    // Event listeners for dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            setItemActive(index, showSlider);
        });
    });

    // Function to set the active item
    const setItemActive = (newValue, callbackFunction) => {
        if (newValue === active) return;
        let type = newValue > active ? 'next' : 'prev';
        active = newValue;
        callbackFunction(type);
    };

    // Auto-run logic
    let removeEffect;
    let autoRun = setTimeout(() => {
        nextBtn.click();
    }, 5000);

    // Function to show the slider effect
    const showSlider = (type) => {
        carousel.style.pointerEvents = 'none';

        // Find and deactivate the old active item
        let itemActiveOld = document.querySelector('.carousel .list .item.active');
        if (itemActiveOld) itemActiveOld.classList.remove('active');

        zIndex++;
        carouselItems[active].style.zIndex = zIndex;
        carouselItems[active].classList.add('active');

        // Set transform based on type
        if (type === 'next') {
            carousel.style.setProperty('--transform', '300px');
        } else {
            carousel.style.setProperty('--transform', '-300px');
        }

        carousel.classList.add('effect');

        // Update dots
        let dotActiveOld = document.querySelector('.dots li.active');
        if (dotActiveOld) dotActiveOld.classList.remove('active');
        dots[active].classList.add('active');

        // Remove effect after animation ends
        clearTimeout(removeEffect);
        removeEffect = setTimeout(() => {
            carousel.classList.remove('effect');
            carousel.style.pointerEvents = 'auto';
        }, 1500);

        // Reset auto-run
        clearTimeout(autoRun);
        autoRun = setTimeout(() => {
            nextBtn.click();
        }, 5000);
    };
})();
