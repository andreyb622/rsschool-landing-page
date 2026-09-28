const slider = document.querySelector(".slider");

if (slider) {
  const wrapper = slider.querySelector(".slider-wrapper");
  const track = slider.querySelector(".slider-track");
  const slides = slider.querySelectorAll(".slide");
  const dots = slider.querySelectorAll(".dot");
  const prevBtn = slider.querySelector('[data-direction="prev"]');
  const nextBtn = slider.querySelector('[data-direction="next"]');
  const lastIndex = slides.length - 1;
  const SWIPE_THRESHOLD = 50;

  let currentIndex = 0;
  let isDragging = false;
  let startX = 0;
  let startOffset = 0;

  function goTo(index) {
    if (index < 0) {
      currentIndex = lastIndex;
    } else if (index > lastIndex) {
      currentIndex = 0;
    } else {
      currentIndex = index;
    }

    track.style.transition = "transform 0.6s ease";
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === currentIndex);
    });
  }

  function getTrackOffset() {
    return -currentIndex * wrapper.clientWidth;
  }

  prevBtn.addEventListener("click", () => {
    goTo(currentIndex - 1);
  });

  nextBtn.addEventListener("click", () => {
    goTo(currentIndex + 1);
  });

  wrapper.addEventListener("pointerdown", (event) => {
    isDragging = true;
    startX = event.clientX;
    startOffset = getTrackOffset();
    track.style.transition = "none";
    wrapper.setPointerCapture(event.pointerId);
  });

  wrapper.addEventListener("pointermove", (event) => {
    if (!isDragging) {
      return;
    }

    const shift = startOffset + (event.clientX - startX);
    track.style.transform = `translateX(${shift}px)`;
  });

  function finishSwipe(endX) {
    if (!isDragging) {
      return;
    }

    isDragging = false;
    const dx = endX - startX;

    if (dx < -SWIPE_THRESHOLD) {
      goTo(currentIndex + 1);
    } else if (dx > SWIPE_THRESHOLD) {
      goTo(currentIndex - 1);
    } else {
      goTo(currentIndex);
    }
  }

  wrapper.addEventListener("pointerup", (event) => {
    finishSwipe(event.clientX);
  });

  wrapper.addEventListener("pointercancel", () => {
    finishSwipe(startX);
  });
}
