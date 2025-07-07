document.addEventListener('DOMContentLoaded', () => {

    // ======================= GESTIONE HEADER STICKY =======================
    const header = document.querySelector('.main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // ======================= ANIMAZIONE ELEMENTI ALLO SCORRIMENTO =======================
    const animateOnScrollElements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                //observer.unobserve(entry.target); 
            }
        });
    }, {
        threshold: 0.1 
    });

    animateOnScrollElements.forEach(element => {
        observer.observe(element);
    });

    // ======================= ANIMAZIONE HERO AL CARICAMENTO =======================
    setTimeout(() => {
        document.querySelectorAll('.animate-on-load').forEach(el => {
            el.classList.add('visible');
        });
    }, 100);


    // ======================= GESTIONE FAQ ACCORDION =======================
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                otherItem.querySelector('.faq-answer').style.maxHeight = null;
            });

            if (!isActive) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + "px";
            }
        });
    });
    // ======================= GESTIONE FOOTER ANNO CORRENTE =======================
    document.getElementById('year').textContent = new Date().getFullYear();

});