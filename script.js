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

    // ======================= GESTIONE ROADMAP SLIDER (CON LOOP INFINITO) =======================
    const roadmapSliderContainer = document.getElementById('roadmap-slider-container');

    if (roadmapSliderContainer) {
        const slider = document.getElementById('roadmap-slider');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');

        let items = Array.from(slider.children);
        let currentIndex = 0;
        let isTransitioning = false;
        let autoScrollInterval;

        const setupSlider = () => {
            // Clona i primi elementi per creare l'effetto loop
            const itemsToClone = 4; // Numero di elementi visibili + buffer
            for (let i = 0; i < itemsToClone; i++) {
                const clone = items[i].cloneNode(true);
                slider.appendChild(clone);
            }
            items = Array.from(slider.children); // Aggiorna l'array degli item
        };

        const updateSliderPosition = (withTransition = true) => {
            const itemWidth = items[0].offsetWidth + 30; // Larghezza item + gap
            slider.style.transition = withTransition ? 'transform 0.5s ease-in-out' : 'none';
            slider.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
        };

        const moveToNext = () => {
            if (isTransitioning) return;
            isTransitioning = true;
            currentIndex++;
            updateSliderPosition();

            // Listener per il "salto" invisibile
            slider.addEventListener('transitionend', () => {
                if (currentIndex >= items.length - 4) { // Se siamo arrivati ai cloni
                    currentIndex = 0;
                    updateSliderPosition(false); // Salta indietro senza animazione
                }
                isTransitioning = false;
            }, { once: true });
        };

        const moveToPrev = () => {
            if (isTransitioning) return;
            isTransitioning = true;
            
            if (currentIndex === 0) {
                currentIndex = items.length - 4;
                updateSliderPosition(false);
                
                // Forza un reflow del browser prima di animare
                setTimeout(() => {
                    currentIndex--;
                    updateSliderPosition(true);
                    isTransitioning = false;
                }, 20);

            } else {
                currentIndex--;
                updateSliderPosition();
                isTransitioning = false;
            }
        };

        const startAutoScroll = () => {
            stopAutoScroll();
            autoScrollInterval = setInterval(moveToNext, 5000);
        };

        const stopAutoScroll = () => {
            clearInterval(autoScrollInterval);
        };

        // Event Listeners
        nextBtn.addEventListener('click', () => {
            moveToNext();
            startAutoScroll(); // Resetta il timer
        });

        prevBtn.addEventListener('click', () => {
            moveToPrev();
            startAutoScroll(); // Resetta il timer
        });
        
        roadmapSliderContainer.addEventListener('mouseover', stopAutoScroll);
        roadmapSliderContainer.addEventListener('mouseout', startAutoScroll);

        // Inizializzazione
        setupSlider();
        startAutoScroll();
    }

});