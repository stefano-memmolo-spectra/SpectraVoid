document.addEventListener('DOMContentLoaded', () => {

    // ======================= GESTIONE HEADER STICKY =======================
    // Rende l'header semi-trasparente quando l'utente scorre la pagina
    const header = document.querySelector('.main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // ======================= ANIMAZIONE ELEMENTI ALLO SCORRIMENTO =======================
    // Utilizza IntersectionObserver per aggiungere la classe 'visible' quando
    // un elemento entra nella viewport, attivando l'animazione CSS.
    const animateOnScrollElements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Opzionale: smettere di osservare l'elemento dopo la prima animazione
                // observer.unobserve(entry.target); 
            }
        });
    }, {
        threshold: 0.1 // L'animazione parte quando almeno il 10% dell'elemento è visibile
    });

    animateOnScrollElements.forEach(element => {
        observer.observe(element);
    });

    // ======================= ANIMAZIONE HERO AL CARICAMENTO =======================
    // Aggiunge la classe 'visible' agli elementi della hero section con un leggero ritardo
    // per un effetto di ingresso più morbido.
    setTimeout(() => {
        document.querySelectorAll('.animate-on-load').forEach(el => {
            el.classList.add('visible');
        });
    }, 100);


    // ======================= GESTIONE FAQ ACCORDION =======================
    // Gestisce l'apertura e la chiusura delle risposte nelle FAQ.
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Chiude tutte le altre risposte per mantenere pulita l'interfaccia
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                otherItem.querySelector('.faq-answer').style.maxHeight = null;
            });

            // Se l'elemento cliccato non era attivo, lo apre
            if (!isActive) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + "px";
            }
        });
    });

    // ======================= GESTIONE FOOTER ANNO CORRENTE =======================
    // Aggiorna automaticamente l'anno nel footer.
    document.getElementById('year').textContent = new Date().getFullYear();

    // ======================= GESTIONE ROADMAP SLIDER (CON LOOP INFINITO E TRASCINAMENTO) =======================
    const roadmapSliderContainer = document.getElementById('roadmap-slider-container');

    if (roadmapSliderContainer) {
        const slider = document.getElementById('roadmap-slider');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');

        let items = Array.from(slider.children);
        let currentIndex = 0;
        let isTransitioning = false;
        let autoScrollInterval;

        // Variabili per il trascinamento
        let isDragging = false;
        let startPos = 0;
        let currentTranslate = 0;
        let prevTranslate = 0;
        let animationID = 0;

        const setupSlider = () => {
            // Clona i primi elementi per creare l'effetto loop
            const itemsToCloneCount = 5; // Cloniamo un numero sufficiente di elementi
            for (let i = 0; i < itemsToCloneCount; i++) {
                const clone = items[i % items.length].cloneNode(true);
                slider.appendChild(clone);
            }
            items = Array.from(slider.children); // Aggiorna l'array degli item
        };

        const getItemWidth = () => {
            return items[0].offsetWidth + 30; // Larghezza item + gap
        };

        const setSliderPosition = () => {
            slider.style.transform = `translateX(${currentTranslate}px)`;
        };
        
        const updateSliderPosition = (withTransition = true) => {
            const itemWidth = getItemWidth();
            currentTranslate = -currentIndex * itemWidth;
            prevTranslate = currentTranslate;
            slider.style.transition = withTransition ? 'transform 0.5s ease-in-out' : 'none';
            setSliderPosition();
        };
        
        // Funzioni per lo scorrimento automatico e manuale
        const moveToNext = () => {
            if (isTransitioning) return;
            currentIndex++;
            slider.style.transition = 'transform 0.5s ease-in-out';
            updateSliderPosition();
        };

        const moveToPrev = () => {
            if (isTransitioning) return;
            currentIndex--;
            slider.style.transition = 'transform 0.5s ease-in-out';
            updateSliderPosition();
        };
        
        const startAutoScroll = () => {
            stopAutoScroll();
            autoScrollInterval = setInterval(() => {
                // Controlla se l'utente sta interagendo prima di scorrere
                if (!isDragging) {
                    moveToNext();
                }
            }, 5000);
        };

        const stopAutoScroll = () => {
            clearInterval(autoScrollInterval);
        };

        // Gestione del loop infinito
        const handleTransitionEnd = () => {
            isTransitioning = false;
            if (currentIndex >= items.length - 5) {
                currentIndex = 0;
                updateSliderPosition(false);
            }
            if (currentIndex < 0) {
                currentIndex = items.length - 5 - 1;
                updateSliderPosition(false);
            }
        };
        
        // Funzioni per il trascinamento (drag/swipe)
        const getPositionX = (event) => {
            return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
        };
        
        const dragStart = (event) => {
            isDragging = true;
            startPos = getPositionX(event);
            animationID = requestAnimationFrame(animation);
            slider.classList.add('grabbing');
            slider.style.transition = 'none';
            stopAutoScroll();
        };

        const dragMove = (event) => {
            if (isDragging) {
                const currentPosition = getPositionX(event);
                currentTranslate = prevTranslate + currentPosition - startPos;
            }
        };

        const animation = () => {
            setSliderPosition();
            if (isDragging) requestAnimationFrame(animation);
        };

        const dragEnd = () => {
            isDragging = false;
            cancelAnimationFrame(animationID);
            slider.classList.remove('grabbing');
            
            const movedBy = currentTranslate - prevTranslate;
            const itemWidth = getItemWidth();
            // Se il trascinamento è maggiore di un quarto della larghezza dell'item, cambia slide
            if (movedBy < -itemWidth / 4 && currentIndex < items.length - 1) currentIndex++;
            if (movedBy > itemWidth / 4 && currentIndex > 0) currentIndex--;

            updateSliderPosition();
            startAutoScroll();
        };

        // Event Listeners
        slider.addEventListener('transitionend', handleTransitionEnd);
        nextBtn.addEventListener('click', () => { moveToNext(); startAutoScroll(); });
        prevBtn.addEventListener('click', () => { moveToPrev(); startAutoScroll(); });
        
        // Eventi per Drag & Swipe
        slider.addEventListener('mousedown', dragStart);
        slider.addEventListener('touchstart', dragStart);
        slider.addEventListener('mousemove', dragMove);
        slider.addEventListener('touchmove', dragMove);
        window.addEventListener('mouseup', dragEnd);
        slider.addEventListener('touchend', dragEnd);
        slider.addEventListener('mouseleave', () => { if (isDragging) dragEnd(); });

        // Inizializzazione
        setupSlider();
        startAutoScroll();
    }

});