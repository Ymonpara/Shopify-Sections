document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".swiper").forEach((swiperElement) => {
    const slidesPerView = parseInt(swiperElement.getAttribute("data-slidesperview"), 10) || 1;
    const mobileSlides = parseInt(swiperElement.getAttribute("data-mobileSlides"), 10) || 1;
    const spaceBetween = parseInt(swiperElement.getAttribute("data-spacebetween"), 10) || 0;
    const autoplay = swiperElement.getAttribute("data-autoplay") === "true";
    const autoplayDelay = parseInt(swiperElement.getAttribute("data-autoplay-delay"), 10) || 3000;
    const loop = swiperElement.getAttribute("data-loop") === "true";
    const speed = parseInt(swiperElement.getAttribute("data-speed"), 10) || 300;
    const nextEl = swiperElement.parentElement.querySelector(".swiper-next");
    const prevEl = swiperElement.parentElement.querySelector(".swiper-prev");
    const paginationEl = swiperElement.parentElement.querySelector(".swiper-pagination");
    
    new Swiper(swiperElement, {
      slidesPerView: slidesPerView,
      spaceBetween: spaceBetween,
      loop: loop,
      speed: speed,
      autoplay: autoplay ? { delay: autoplayDelay } : false,
      navigation: {
        nextEl: nextEl,
        prevEl: prevEl,
      },
      pagination: {
        el: paginationEl,
        clickable: true,
      },
      keyboard: {
        enabled: true,
        onlyInViewport: true,
      },
      breakpoints: {
        0: { slidesPerView: mobileSlides, spaceBetween: 10 },
        750: { slidesPerView: 3, spaceBetween: spaceBetween },
        990: { slidesPerView: slidesPerView, spaceBetween: spaceBetween }
      }
    });
  });
});