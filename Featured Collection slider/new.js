
function initAllSwipers() {
  document.querySelectorAll(".swiper:not([data-swiper-initialized])").forEach((swiperElement) => {

    if (!swiperElement.getAttribute("data-swiper-id")) {
      swiperElement.setAttribute("data-swiper-id", "swiper-" + Date.now() + "-" + Math.random());
    }

    const slidesPerView = parseInt(swiperElement.getAttribute("data-slidesperview"), 10) || 1;
    const tabletSlides  = parseInt(swiperElement.getAttribute("data-tabletSlides"), 10) || 1;
    const mobileSlides  = parseInt(swiperElement.getAttribute("data-mobileSlides"), 10) || 1;
    const spaceBetween  = parseInt(swiperElement.getAttribute("data-spacebetween"), 10) || 0;
    const autoplay      = swiperElement.getAttribute("data-autoplay") === "true";
    const autoplayDelay = parseInt(swiperElement.getAttribute("data-autoplay-delay"), 10) || 3000;
    const loop          = swiperElement.getAttribute("data-loop") === "true";
    const speed         = parseInt(swiperElement.getAttribute("data-speed"), 10) || 300;

    // Search for controls INSIDE the swiper itself first, then fall back to parent
    const searchScope = swiperElement;

    let nextEl = null, prevEl = null, paginationEl = null, scrollbarEl = null;

    searchScope.querySelectorAll(".swiper-next, .swiper-prev, .swiper-pagination, .swiper-scrollbar").forEach(el => {
      // Make sure this control belongs to THIS swiper, not a nested one
      if (el.closest(".swiper") === swiperElement) {
        if (el.classList.contains("swiper-next"))       nextEl       = el;
        if (el.classList.contains("swiper-prev"))       prevEl       = el;
        if (el.classList.contains("swiper-pagination")) paginationEl = el;
        if (el.classList.contains("swiper-scrollbar"))  scrollbarEl  = el;
      }
    });

    // Also check parent scope for controls placed outside the swiper element
    if (!nextEl && !prevEl && !paginationEl) {
      const parent = swiperElement.parentElement;
      parent.querySelectorAll(".swiper-next, .swiper-prev, .swiper-pagination, .swiper-scrollbar").forEach(el => {
        const closestSwiper = el.closest(".swiper");
        if (!closestSwiper || closestSwiper === swiperElement) {
          if (el.classList.contains("swiper-next"))       nextEl       = el;
          if (el.classList.contains("swiper-prev"))       prevEl       = el;
          if (el.classList.contains("swiper-pagination")) paginationEl = el;
          if (el.classList.contains("swiper-scrollbar"))  scrollbarEl  = el;
        }
      });
    }

    const isImageSlider = swiperElement.classList.contains("card__media-slider");

    new Swiper(swiperElement, {
      slidesPerView: isImageSlider ? 1 : slidesPerView,
      spaceBetween:  isImageSlider ? 0 : spaceBetween,
      loop:          loop,
      speed:         speed,
      autoplay:      autoplay ? { delay: autoplayDelay, disableOnInteraction: false } : false,
      navigation: {
        nextEl: nextEl || null,
        prevEl: prevEl || null,
      },
      pagination: {
        el: paginationEl || null,
        clickable: true,
      },
      scrollbar: {
        el: scrollbarEl || null,
        draggable: true,
        hide: false,
      },
      keyboard: {
        enabled: true,
        onlyInViewport: true,
      },
      breakpoints: isImageSlider ? {} : {
        0:   { slidesPerView: mobileSlides, spaceBetween: 10 },
        750: { slidesPerView: tabletSlides, spaceBetween: spaceBetween },
        990: { slidesPerView: slidesPerView, spaceBetween: spaceBetween }
      }
    });

    swiperElement.setAttribute("data-swiper-initialized", "true");
  });
}
