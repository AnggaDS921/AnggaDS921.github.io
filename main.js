// ===== NAVBAR INTERACTIVE ====== //
(function navbarInteractive(navbarMenu,navToggle,navLinks,navLi,sectionHome,navbarHeader,btnToTop){
    const navMenu = document.getElementById(navbarMenu),
    toggle = document.getElementById(navToggle),
    links = document.querySelectorAll(navLinks),
    linksLi = document.querySelectorAll(navLi),
    sHome = document.querySelector(sectionHome),
    navHeader = document.getElementById(navbarHeader),
    btnTop = document.getElementById(btnToTop);

    // SHOW NAVBAR MENU AND ADD ANIMATION NAV-LI //
    toggle.addEventListener('click',()=>{
        navMenu.classList.toggle('show');
        toggle.classList.toggle('rotate');

        linksLi.forEach((linkLi,i) => {
            if(linkLi.style.animation){
                linkLi.style.animation = '';
            } else{
                linkLi.style.animation = `linksFadeIn .5s ease forwards ${ (i + 1) / 6}s`;
            };
        });
    });

    // ADD ANIMAITON TO LINKS WHEN ON CLICK //
    links.forEach( link => link.addEventListener('click', ()=>{
        if(navMenu.classList.contains('show')){
            toggle.click();
        };
    }));

    // ADD ANIMATION WHEN SCROLLING //
    window.addEventListener('scroll', ()=> {
        const heightHomeSection = sHome.offsetHeight;
        let fromTop = window.scrollY;

        // CHANGE BACKGROUND COLOR NAVBAR //
        if(fromTop > heightHomeSection){
            navHeader.classList.add('scroll-header')
        } else {
            navHeader.classList.remove('scroll-header')
        }
        
        // ADD CLASS ACTIVE //
        links.forEach( link => {
            if(link.classList.contains('nav-link')){
                let section = document.querySelector(link.hash);
                let fix = 50;
                if(
                    (section.offsetTop - fix) <= fromTop && (section.offsetTop - fix) + section.offsetHeight > fromTop
                ){
                    link.classList.add('active-link');
                } else{
                    link.classList.remove('active-link')
                };
            };
        });

        // BTN TO TOP //
        if(fromTop >  heightHomeSection - 250){
            // if(!btnTop.classList.contains('btnFadeIn')){
            //     btnTop.classList.add('btnFadeIn');
            //     btnTop.classList.remove('btnFadeOut');
            // }
            btnTop.style.display = 'block';
        } else {
            // if(btnTop.classList.contains('btnFadeIn')){
            //     btnTop.classList.remove('btnFadeIn');
            //     btnTop.classList.add('btnFadeOut');
            //     setTimeout( ()=> {
            //     }, 250);
            // };
            btnTop.style.display = 'none';
        };
    });

    btnTop.addEventListener('click', ()=> {
        const targetPosition = 0,
        startPosition = window.scrollY,
        distance = targetPosition - startPosition,
        duration = 1000;
        let start = null;

        window.requestAnimationFrame(step);
        function step(timestamp){
            if(!start) start = timestamp;
            const progress = timestamp - start;
            window.scrollTo(0, easeInOutQuad(progress, startPosition, distance, duration));
            if(progress < duration) window.requestAnimationFrame(step);
        }
    });

    links.forEach( link => link.addEventListener('click', (e)=> {
        e.preventDefault();
        const startPosition = window.scrollY,
        targetPosition = document.querySelector(link.hash).offsetTop,
        distance = targetPosition - startPosition,
        duration = 1000;
        let start = null;

        window.requestAnimationFrame(step);
        function step(timestamp){
            if(!start) start = timestamp;
            const progress = timestamp - start;
            window.scrollTo(0, easeInOutQuad(progress, startPosition, distance, duration));
            if(progress < duration) window.requestAnimationFrame(step);
        }
    }));

    // ======= EASING FUNCTION FOR SMOOTHSCROLL ====== //
    function easeInOutQuad(t, b, c, d) {
        t /= d/2;
        if (t < 1) return c/2*t*t + b;
        t--;
        return -c/2 * (t*(t-2) - 1) + b;
    };
}('nav-menu','nav-toggle','.nav-header a','.nav-items','.home','header','btn-scroll-top'));

// ======= PORTFOLIO ====== //
(function portfolio(pItem,contentFilter,containerTrack,nextButton,prevButton,nav){
    const menuItems = document.querySelectorAll(pItem),
    filters = document.querySelectorAll(contentFilter),
    track = document.querySelector(containerTrack),
    tContents = Array.from(track.children),
    nextBtn = document.querySelector(nextButton),
    prevBtn = document.querySelector(prevButton),
    dotsNav = document.querySelector(nav),
    dots = Array.from(dotsNav.children);

    // ===== ACTIVE NAV  PORTFOLIO  AND FILTER THE PROJECT ====== //
    menuItems.forEach( item => item.addEventListener('click', ()=> {
        menuItems.forEach(item => item.classList.remove('active-portfolio'))
        item.classList.add('active-portfolio')

        let targetData = item.getAttribute('data-target');
        for(let i = 0; i < filters.length; i++){
            filters[i].classList.remove('active');
            filters[i].classList.add('delete');

            if(filters[i].getAttribute('data-item') == targetData || targetData == "all"){
                filters[i].classList.remove('delete');
                filters[i].classList.add('active');
            };
        };
    }));

    // ====== CAROUSEL ======= //
    // set up position carousel //
    const slidewidth = tContents[0].offsetWidth;
    const setSlidePosition = (tContent, i) => {
        tContent.style.left = slidewidth * i + 'px';
    };
    tContents.forEach(setSlidePosition);

    // function slide //
    const moveToSlide = (track,currentSlide, targetSlide)=>{
        track.style.transform = `translateX(-${targetSlide.style.left})`;
        currentSlide.classList.remove('current-slide');
        targetSlide.classList.add('current-slide');
    };

    const updatesDots = (currentDot, targetDot) => {
        currentDot.classList.remove('current-slide');
        targetDot.classList.add('current-slide')
    }

    const hideShowArrows = (tContents, prevBtn, nextBtn, targetIndex) => {
        if(targetIndex === 0){
            prevBtn.classList.add('is-hidden');
            nextBtn.classList.remove('is-hidden');
        } else if(targetIndex === tContents.length - 1){
            prevBtn.classList.remove('is-hidden');
            nextBtn.classList.add('is-hidden');
        } else {
            prevBtn.classList.remove('is-hidden');
            nextBtn.classList.remove('is-hidden');
        } 
    };

    // add event to nextBtn and prevBtn //
    nextBtn.addEventListener('click', ()=>{
        const currentSlide = track.querySelector('.current-slide'),
        nextSlide = currentSlide.nextElementSibling,
        currentDot = dotsNav.querySelector('.current-slide'),
        nextDot = currentDot.nextElementSibling,
        nextIndex = tContents.findIndex(tContent => tContent === nextSlide);

        moveToSlide(track, currentSlide, nextSlide);
        updatesDots(currentDot,nextDot)
        hideShowArrows(tContents, prevBtn, nextBtn, nextIndex);
    });

    prevBtn.addEventListener('click', ()=>{
        const currentSlide = track.querySelector('.current-slide'),
        prevSlide = currentSlide.previousElementSibling,
        currentDot = dotsNav.querySelector('.current-slide'),
        prevDot = currentDot.previousElementSibling,
        prevIndex = tContents.findIndex(tContent => tContent === prevSlide);

        moveToSlide(track, currentSlide, prevSlide);
        updatesDots(currentDot, prevDot);
        hideShowArrows(tContents, prevBtn, nextBtn, prevIndex);
    });

    // indicator active
    dotsNav.addEventListener('click', (e)=> {
        const targetDot = e.target.closest('button');
        if(!targetDot) return;
    
        const currentSlide = track.querySelector('.current-slide'),
        currentDot = dotsNav.querySelector('.current-slide'),
        targetIndex = dots.findIndex(dot => dot === targetDot),
        targetSlide = tContents[targetIndex];

        moveToSlide(track, currentSlide, targetSlide);
        updatesDots(currentDot, targetDot);
        hideShowArrows(tContents, prevBtn, nextBtn, targetIndex);
    });

}('.portfolio-item','.portfolio-content','.carousel__track','.carousel__button-right','.carousel__button-left','.carousel__nav'));
