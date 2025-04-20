const hamburgerMenu = document.querySelector('.hamburger-menu');
const openMenu = document.querySelector('.open-menu');
const closeMenu = document.querySelector('.close-menu');
const nav = document.querySelector('nav');

// Toggle the hamburger menu
hamburgerMenu.addEventListener('click', () => {
    openMenu.classList.toggle('active-menu');
    closeMenu.classList.toggle('active-menu');
    nav.classList.toggle('nav-display');
}
);


// Sticky header on scroll
window.addEventListener('scroll', (event) => {
    const scrollPosition = window.scrollY;
    const header = document.querySelector('.header');
    const offerSection = document.querySelector('.offer');
    const offerHeight = offerSection.offsetHeight;

    if (scrollPosition > offerHeight) {
        header.classList.add('header-sticky');
    } else {
        header.classList.remove('header-sticky');
    }
} );

// Slider with custom scrollbar
document.addEventListener('DOMContentLoaded', () => {
    const sliderWrapper = document.querySelector('.slider-wrapper');
    const scrollbar = document.querySelector('.custom-scrollbar');
    const scrollbarTrack = document.querySelector('.scrollbar-track');
    const scrollbarThumb = document.querySelector('.scrollbar-thumb');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    const updateCardWidth = () => {
        return window.innerWidth >= 768 
            ? 800 
            : document.querySelector('.product-card').offsetWidth;
    };

    let cardWidth = updateCardWidth();
    let isDragging = false;
    let startX;
    let scrollLeftStart;

    function updateScrollbar() {
        const scrollWidth = sliderWrapper.scrollWidth;
        const clientWidth = sliderWrapper.clientWidth;

        if (scrollWidth <= clientWidth) {
            scrollbar.style.display = 'none';
            return;
        }

        scrollbar.style.display = 'block';
        const trackWidth = scrollbarTrack.clientWidth;
        const thumbWidth = Math.max(20, (clientWidth / scrollWidth) * trackWidth);
        scrollbarThumb.style.width = `${thumbWidth}px`;

        const maxScrollLeft = scrollWidth - clientWidth;
        const scrollPercentage = sliderWrapper.scrollLeft / maxScrollLeft;
        const maxThumbLeft = trackWidth - thumbWidth;
        const thumbLeft = scrollPercentage * maxThumbLeft;

        scrollbarThumb.style.left = `${thumbLeft}px`;
    }

    function updateButtonVisibility() {
        prevBtn.style.display = sliderWrapper.scrollLeft <= 0 ? 'none' : 'block';
        const maxScroll = sliderWrapper.scrollWidth - sliderWrapper.clientWidth;
        nextBtn.style.display = sliderWrapper.scrollLeft >= maxScroll ? 'none' : 'block';
    }

    window.addEventListener('resize', () => {
        cardWidth = updateCardWidth();
        requestAnimationFrame(() => {
            updateScrollbar();
            updateButtonVisibility();
        });
    });

    sliderWrapper.addEventListener('scroll', () => {
        requestAnimationFrame(() => {
            updateScrollbar();
            updateButtonVisibility();
        });
    });

    scrollbarThumb.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.pageX - scrollbarThumb.offsetLeft;
        scrollLeftStart = sliderWrapper.scrollLeft;
        scrollbarThumb.style.cursor = 'grabbing';
        document.body.style.userSelect = 'none';
        document.body.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();

        const walk = e.pageX - startX;
        const trackWidth = scrollbarTrack.clientWidth;
        const thumbWidth = scrollbarThumb.offsetWidth;
        const maxThumbLeft = trackWidth - thumbWidth;
        const newThumbLeft = Math.max(0, Math.min(walk, maxThumbLeft));
        const scrollPercentage = newThumbLeft / maxThumbLeft;
        const maxScrollLeft = sliderWrapper.scrollWidth - sliderWrapper.clientWidth;
        const newScrollLeft = scrollPercentage * maxScrollLeft;

        scrollbarThumb.style.left = `${newThumbLeft}px`;
        sliderWrapper.scrollLeft = newScrollLeft;
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            scrollbarThumb.style.cursor = 'grab';
            document.body.style.userSelect = '';
            document.body.style.cursor = '';
        }
    });

    scrollbarThumb.addEventListener('dragstart', (e) => e.preventDefault());

    prevBtn.addEventListener('click', () => {
        sliderWrapper.scrollBy({ left: -cardWidth, behavior: 'smooth' });
    });

    nextBtn.addEventListener('click', () => {
        sliderWrapper.scrollBy({ left: cardWidth, behavior: 'smooth' });
    });

    updateButtonVisibility();
    updateScrollbar();
});

// Accordion functionality
document.addEventListener('DOMContentLoaded', () => {
    const accordionItems = document.querySelectorAll('.accordion-item');
    
    function handleAccordion(e) {
        // Only handle accordion on smaller screens
        if (window.innerWidth < 1024) {
            const header = e.currentTarget;
            const item = header.closest('.accordion-item');
            const currentlyActive = document.querySelector('.accordion-item.active');
            
            if (currentlyActive && currentlyActive !== item) {
                currentlyActive.classList.remove('active');
            }
            
            item.classList.toggle('active');
        }
    }

    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        header.addEventListener('click', handleAccordion);
    });

    // Handle resize events
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 1024) {
            // Remove active classes when screen size increases
            document.querySelectorAll('.accordion-item.active').forEach(item => {
                item.classList.remove('active');
            });
        }
    });
});

// Accessories section scrollbar

document.addEventListener('DOMContentLoaded', () => {
    const accessoriesScrollWrapper = document.querySelector('.accessories-scroll-wrapper');
    const accessoriesContainer = document.querySelector('.accessories-cards-container');
    const accessoriesTrack = document.querySelector('.accessories-scrollbar-track');
    const accessoriesThumb = document.querySelector('.accessories-scrollbar-thumb');

    if (!accessoriesScrollWrapper || !accessoriesContainer || !accessoriesTrack || !accessoriesThumb) {
        console.error("Scrollbar elements not found!");
        return;
    }

    let isAccessoriesDragging = false;

    let accessoriesStartX;
    let accessoriesScrollLeftStart;
    let rafId; // Request Animation Frame ID

    function updateAccessoriesScrollbar() {
        // Cancel previous animation frame request if any
        if (rafId) {
            cancelAnimationFrame(rafId);
        }

        // Use requestAnimationFrame for performance
        rafId = requestAnimationFrame(() => {
            const accessoriesScrollWidth = accessoriesContainer.scrollWidth;
            const accessoriesClientWidth = accessoriesContainer.clientWidth;
            const accessoriesScrollLeft = accessoriesContainer.scrollLeft;
            const accessoriesTrackWidth = accessoriesTrack.clientWidth;

            // Check if screen is below 600px AND if scrolling is needed
            const isMobileView = window.innerWidth < 600;
            const needsScroll = accessoriesScrollWidth > accessoriesClientWidth;

            if (isMobileView && needsScroll) {
                accessoriesScrollWrapper.classList.add('is-scrollable');

                // Calculate thumb width (proportional to visible content ratio)
                // Ensure minimum thumb width for usability
                const accessoriesThumbWidth = Math.max(120,((accessoriesClientWidth / accessoriesScrollWidth) * accessoriesTrackWidth)- 75);
                accessoriesThumb.style.width = `${accessoriesThumbWidth}px`;

                // Calculate thumb position (proportional to scroll position)
                // Max thumb position = track width - thumb width
                const maxThumbX = accessoriesTrackWidth - accessoriesThumbWidth;
                const thumbX = (accessoriesScrollLeft / (accessoriesScrollWidth - accessoriesClientWidth)) * maxThumbX;

                // Use translate for better performance
                accessoriesThumb.style.transform = `translateX(${thumbX}px)`;

            } else {
                // Hide scrollbar if not mobile or no scrolling needed
                accessoriesScrollWrapper.classList.remove('is-scrollable');
                // Reset thumb position and width might be good practice
                 accessoriesThumb.style.transform = `translateX(0px)`;
                 accessoriesThumb.style.width = `20px`; // Reset to min or default
            }
            rafId = null; // Reset ID after execution
        });
    }

    // --- Event Listeners ---

    // Update on accessoriesContainer scroll
    accessoriesContainer.addEventListener('scroll', updateAccessoriesScrollbar, { passive: true });

    // Update on window resize (handles changing view size and enabling/disabling)
    window.addEventListener('resize', updateAccessoriesScrollbar);

    // --- Thumb Dragging Logic ---
    accessoriesThumb.addEventListener('mousedown', (e) => {
        if (window.innerWidth >= 600) return; // Only allow drag on mobile view

        isAccessoriesDragging = true;
        accessoriesStartX = e.pageX - accessoriesThumb.offsetLeft; // Position relative to the track
        accessoriesScrollLeftStart = accessoriesContainer.scrollLeft;// Prevent text selection cursor
        e.preventDefault(); // Prevent text selection/drag image behavior
    });

    document.addEventListener('mousemove', (e) => {
        if (!isAccessoriesDragging || window.innerWidth >= 600) return;

        e.preventDefault();
        const x = e.pageX - accessoriesTrack.getBoundingClientRect().left; // Mouse position relative to track
        const walk = (x - (accessoriesStartX - accessoriesThumb.offsetLeft)) ; // How far the mouse moved *relative to the thumb start* is complex. Simpler: calculate scroll based on mouse pos

        const scrollableWidth = accessoriesContainer.scrollWidth - accessoriesContainer.clientWidth;
        const trackScrollableWidth = accessoriesTrack.clientWidth - accessoriesThumb.clientWidth;

        // Calculate the desired scrollLeft based on mouse position on track
        let newAccessoriesScrollLeft = (x / accessoriesTrack.clientWidth) * accessoriesContainer.scrollWidth;

        // Clamp newAccessoriesScrollLeft based on thumb position
        const mousePosRatio = Math.max(0, Math.min(1, (e.pageX - accessoriesTrack.getBoundingClientRect().left) / accessoriesTrack.clientWidth));
         newAccessoriesScrollLeft = mousePosRatio * scrollableWidth;


        accessoriesContainer.scrollLeft = newAccessoriesScrollLeft;
        // Update scrollbar immediately during drag
         // updateAccessoriesScrollbar(); // Can cause judder, update directly is smoother
         const maxThumbX = accessoriesTrack.clientWidth - accessoriesThumb.clientWidth;
         const thumbX = (accessoriesContainer.scrollLeft / scrollableWidth) * maxThumbX;
         accessoriesThumb.style.transform = `translateX(${thumbX}px)`;

    });

    document.addEventListener('mouseup', () => {
        if (isAccessoriesDragging) {
            isAccessoriesDragging = false;
            document.body.style.cursor = ''; // Restore default body cursor
        }
    });

    // Set initial state
    updateAccessoriesScrollbar();
});

// Portfolio section scrollbar
document.addEventListener('DOMContentLoaded', () => {
    const portfolioScrollWrapper = document.querySelector('.portfolio-scroll-wrapper');
    const portfolioContainer = document.querySelector('.portfolio-cards-container');
    const portfolioTrack = document.querySelector('.portfolio-scrollbar-track');
    const portfolioThumb = document.querySelector('.portfolio-scrollbar-thumb');

    if (!portfolioScrollWrapper || !portfolioContainer || !portfolioTrack || !portfolioThumb) {
        console.error("Scrollbar elements not found!");
        return;
    }

    let isPortfolioDragging = false;

    let portfolioStartX;
    let portfolioScrollLeftStart;
    let rafId; // Request Animation Frame ID

    function updatePortfolioScrollbar() {
        // Cancel previous animation frame request if any
        if (rafId) {
            cancelAnimationFrame(rafId);
        }

        // Use requestAnimationFrame for performance
        rafId = requestAnimationFrame(() => {
            const portfolioScrollWidth = portfolioContainer.scrollWidth;
            const portfolioClientWidth = portfolioContainer.clientWidth;
            const portfolioScrollLeft = portfolioContainer.scrollLeft;
            const portfolioTrackWidth = portfolioTrack.clientWidth;

            // Check if screen is below 600px AND if scrolling is needed
            const isMobileView = window.innerWidth < 1024;
            const needsScroll = portfolioScrollWidth > portfolioClientWidth;

            if (isMobileView && needsScroll) {
                portfolioScrollWrapper.classList.add('is-scrollable');

                // Calculate thumb width (proportional to visible content ratio)
                // Ensure minimum thumb width for usability
                const portfolioThumbWidth = Math.max(75,((portfolioClientWidth / portfolioScrollWidth) * portfolioTrackWidth)- 90);
                portfolioThumb.style.width = `${portfolioThumbWidth}px`;

                // Calculate thumb position (proportional to scroll position)
                // Max thumb position = track width - thumb width
                const maxThumbX = portfolioTrackWidth - portfolioThumbWidth;
                const thumbX = (portfolioScrollLeft / (portfolioScrollWidth - portfolioClientWidth)) * maxThumbX;

                // Use translate for better performance
                portfolioThumb.style.transform = `translateX(${thumbX}px)`;

            } else {
                // Hide scrollbar if not mobile or no scrolling needed
                portfolioScrollWrapper.classList.remove('is-scrollable');
                // Reset thumb position and width might be good practice
                 portfolioThumb.style.transform = `translateX(0px)`;
                 portfolioThumb.style.width = `20px`; // Reset to min or default
            }
            rafId = null; // Reset ID after execution
        }
        );
    }
    // --- Event Listeners ---
    // Update on portfolioContainer scroll
    portfolioContainer.addEventListener('scroll', updatePortfolioScrollbar, { passive: true });
    // Update on window resize (handles changing view size and enabling/disabling)
    window.addEventListener('resize', updatePortfolioScrollbar);
    // --- Thumb Dragging Logic ---     
    portfolioThumb.addEventListener('mousedown', (e) => {
        if (window.innerWidth >= 1024) return; // Only allow drag on mobile view

        isPortfolioDragging = true;
        portfolioStartX = e.pageX - portfolioThumb.offsetLeft; // Position relative to the track
        portfolioScrollLeftStart = portfolioContainer.scrollLeft;// Prevent text selection cursor
        e.preventDefault(); // Prevent text selection/drag image behavior
    });
    document.addEventListener('mousemove', (e) => {
        if (!isPortfolioDragging || window.innerWidth >= 1024) return;

        e.preventDefault();
        const x = e.pageX - portfolioTrack.getBoundingClientRect().left; // Mouse position relative to track
        const walk = (x - (portfolioStartX - portfolioThumb.offsetLeft)) ; // How far the mouse moved *relative to the thumb start* is complex. Simpler: calculate scroll based on mouse pos

        const scrollableWidth = portfolioContainer.scrollWidth - portfolioContainer.clientWidth;
        const trackScrollableWidth = portfolioTrack.clientWidth - portfolioThumb.clientWidth;

        // Calculate the desired scrollLeft based on mouse position on track
        let newPortfolioScrollLeft = (x / portfolioTrack.clientWidth) * portfolioContainer.scrollWidth;

        // Clamp newPortfolioScrollLeft based on thumb position
        const mousePosRatio = Math.max(0, Math.min(1, (e.pageX - portfolioTrack.getBoundingClientRect().left) / portfolioTrack.clientWidth));
         newPortfolioScrollLeft = mousePosRatio * scrollableWidth;
        portfolioContainer.scrollLeft = newPortfolioScrollLeft;
        // Update scrollbar immediately during drag
         // updatePortfolioScrollbar(); // Can cause judder, update directly is smoother
         const maxThumbX = portfolioTrack.clientWidth - portfolioThumb.clientWidth;
         const thumbX = (portfolioContainer.scrollLeft / scrollableWidth) * maxThumbX;
         portfolioThumb.style.transform = `translateX(${thumbX}px)`;
    }
    );
    document.addEventListener('mouseup', () => {
        if (isPortfolioDragging) {
            isPortfolioDragging = false;
            document.body.style.cursor = ''; // Restore default body cursor
        }
    });
    // Set initial state
    updatePortfolioScrollbar();
}
);

document.addEventListener('DOMContentLoaded', function() {
    const arButton = document.getElementById('ar-button');

    arButton.addEventListener('click', function() {
      alert('AR View is not available in this demonstration.');
    });
  });