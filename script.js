/* =========================
   SLIDESHOW
   ========================= */

const slides = document.querySelectorAll(".slide");
let currentSlide = 0;

function showNextSlide() {
    // Prüfen, ob es überhaupt Slides gibt
    if (slides.length === 0) return;

    slides[currentSlide].classList.remove("active");
    currentSlide++;
    if (currentSlide >= slides.length) {
        currentSlide = 0;
    }
    slides[currentSlide].classList.add("active");
}

// Nur starten, wenn es Slides gibt
if (slides.length > 0) {
    setInterval(showNextSlide, 2000);
}


/* =========================
   LIGHTBOX MIT FALL-EFFEKT
   ========================= */

document.addEventListener('DOMContentLoaded', function() {

    // Lightbox-Elemente
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxLocation = document.getElementById('lightboxLocation');
    const closeLightbox = document.getElementById('closeLightbox');
    const prevButton = document.getElementById('prevImage');
    const nextButton = document.getElementById('nextImage');

    // Alle Bilder in der aktuellen Kategorie
    const allImages = document.querySelectorAll('.project-category .gallery-item img');
    let currentProjectImages = [];
    let currentIndex = 0;

    // Prüfen, ob es Bilder gibt – sonst abbrechen
    if (allImages.length === 0) return;

    // Funktion: Lightbox mit einem bestimmten Bild öffnen
    function openLightbox(clickedImage) {
        const projectId = clickedImage.getAttribute('data-project') || 'default';

        // Alle Bilder mit gleichem data-project sammeln
        currentProjectImages = [];
        allImages.forEach(img => {
            if (img.getAttribute('data-project') === projectId) {
                currentProjectImages.push(img);
            }
        });

        currentIndex = currentProjectImages.indexOf(clickedImage);
        if (currentIndex === -1) currentIndex = 0;

        // ===== ALLE BILDER FALLEN LASSEN =====
        const allItems = document.querySelectorAll('.category-images .gallery-item');
        allItems.forEach((item, index) => {
            const img = item.querySelector('img');
            if (img && img.getAttribute('data-project') === projectId) {
                // Das angeklickte Bild bleibt stehen
                item.classList.add('staying');
            } else {
                // Alle anderen fallen nach unten
                setTimeout(() => {
                    item.classList.add('falling');
                }, index * 30);
            }
        });

        // Nach der Animation: Lightbox öffnen
        setTimeout(() => {
            showImage(currentIndex);
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }, 700);
    }

    // Ein Bild anzeigen
    function showImage(index) {
        const img = currentProjectImages[index];
        if (!img) return;

        const src = img.getAttribute('src');
        const title = img.getAttribute('title') || img.getAttribute('data-title') || 'Projekt';
        const location = img.getAttribute('data-location') || '';

        lightboxImage.src = src;
        lightboxTitle.textContent = title;
        lightboxLocation.textContent = location;

        // Pfeile ausblenden, wenn nur 1 Bild in der Gruppe
        if (currentProjectImages.length <= 1) {
            prevButton.style.display = 'none';
            nextButton.style.display = 'none';
        } else {
            prevButton.style.display = 'block';
            nextButton.style.display = 'block';
        }
    }

    // Klick auf Bild → Lightbox öffnen
    allImages.forEach(img => {
        img.addEventListener('click', function() {
            openLightbox(this);
        });
    });

    // Pfeil: nächstes Bild
    nextButton.addEventListener('click', function() {
        if (currentIndex < currentProjectImages.length - 1) {
            currentIndex++;
            showImage(currentIndex);
        } else {
            currentIndex = 0;
            showImage(currentIndex);
        }
    });

    // Pfeil: vorheriges Bild
    prevButton.addEventListener('click', function() {
        if (currentIndex > 0) {
            currentIndex--;
            showImage(currentIndex);
        } else {
            currentIndex = currentProjectImages.length - 1;
            showImage(currentIndex);
        }
    });

    // Lightbox schließen – Bilder kommen zurück
    function closeLightboxWithReturn() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';

        // Alle Bilder zurücksetzen
        const allItems = document.querySelectorAll('.category-images .gallery-item');
        allItems.forEach((item, index) => {
            item.classList.remove('falling', 'staying');
            setTimeout(() => {
                item.classList.add('returning');
            }, index * 30);
        });

        setTimeout(() => {
            allItems.forEach(item => {
                item.classList.remove('returning');
                item.style.opacity = '1';
                item.style.transform = 'translateY(0) scale(1)';
            });
        }, 800);

        lightboxImage.src = '';
    }

    closeLightbox.addEventListener('click', closeLightboxWithReturn);

    // Klick außerhalb der Box schließt auch
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightboxWithReturn();
        }
    });

    // ESC-Taste schließt Lightbox
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeLightboxWithReturn();
        }
        if (e.key === 'ArrowRight') {
            nextButton.click();
        }
        if (e.key === 'ArrowLeft') {
            prevButton.click();
        }
    });

});


/* =========================
   HAMBURGER-MENÜ
   ========================= */

document.addEventListener('DOMContentLoaded', function() {

    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('open');
            document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
        });

        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }

});


/* =========================
   KATEGORIE-HAMBURGER
   ========================= */

document.addEventListener('DOMContentLoaded', function() {

    const categoryHamburger = document.getElementById('categoryHamburger');
    const categoryLinks = document.getElementById('categoryLinks');

    if (categoryHamburger && categoryLinks) {
        categoryHamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            categoryLinks.classList.toggle('open');
        });
    }

});


/* =========================
   KATEGORIE-TITEL AKTUALISIEREN
   ========================= */

document.addEventListener('DOMContentLoaded', function() {

    const categoryTitle = document.getElementById('categoryTitle');
    const categoryLinks = document.querySelectorAll('.category-links a');

    if (categoryTitle && categoryLinks.length > 0) {
        // Aktuelle Seite erkennen
        const currentPage = window.location.pathname.split('/').pop();

        categoryLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage || (currentPage === '' && href === 'projekte.html')) {
                categoryTitle.textContent = link.textContent;
            }
        });
    }

});

/* =========================
   KATEGORIE-BUTTON (Handy)
   ========================= */

document.addEventListener('DOMContentLoaded', function() {

    const categoryToggle = document.getElementById('categoryToggle');
    const categoryLinks = document.getElementById('categoryLinks');

    if (categoryToggle && categoryLinks) {
        categoryToggle.addEventListener('click', function() {
            categoryLinks.classList.toggle('open');
        });
    }

});


/* =========================
   VIDEO-OVERLAY (Handy)
   ========================= */

document.addEventListener('DOMContentLoaded', function() {

    const hamburger = document.getElementById('hamburger');
    const videoOverlay = document.getElementById('videoOverlay');
    const video = document.getElementById('introVideo');

    // Nur auf Handys (max-width: 768px)
    function isMobile() {
        return window.innerWidth <= 768;
    }

    if (hamburger && videoOverlay && video) {
        hamburger.addEventListener('click', function() {
            // Nur auf Handys
            if (!isMobile()) {
                // Auf Desktop: Menü direkt öffnen
                this.classList.toggle('active');
                document.getElementById('navMenu').classList.toggle('open');
                return;
            }

            // Auf Handy: Video abspielen
            videoOverlay.classList.add('active');
            video.currentTime = 0;
            video.play();

            // Nach 3 Sekunden: Video ausblenden, Menü öffnen
            setTimeout(() => {
                video.pause();
                videoOverlay.classList.remove('active');
                
                // Menü öffnen
                hamburger.classList.add('active');
                document.getElementById('navMenu').classList.add('open');
                document.body.style.overflow = 'hidden';
            }, 3000); // 3 Sekunden
        });
    }

});