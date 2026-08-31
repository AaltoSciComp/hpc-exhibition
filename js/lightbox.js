// Click-to-expand lightbox for the part-thumb images on the info sheet.
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var lightbox = document.getElementById('lightbox');
    var lightboxImg = document.getElementById('lightbox-img');
    var lightboxCaption = document.getElementById('lightbox-caption');
    var closeBtn = lightbox ? lightbox.querySelector('.lightbox-close') : null;
    var lastFocused = null;

    if (!lightbox || !lightboxImg || !lightboxCaption || !closeBtn) return;

    function open(thumb) {
      var img = thumb.querySelector('img');
      lightboxImg.src = thumb.getAttribute('data-full');
      lightboxImg.alt = img ? img.alt : '';
      lightboxCaption.textContent = thumb.getAttribute('data-caption') || '';
      lastFocused = thumb;
      lightbox.hidden = false;
      closeBtn.focus();
    }

    function close() {
      lightbox.hidden = true;
      lightboxImg.src = '';
      if (lastFocused) lastFocused.focus();
    }

    document.querySelectorAll('.part-thumb').forEach(function (thumb) {
      thumb.addEventListener('click', function () { open(thumb); });
    });

    closeBtn.addEventListener('click', close);

    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) close();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !lightbox.hidden) close();
    });
  });
})();
