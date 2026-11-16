document.addEventListener('DOMContentLoaded', () => {
    // 1. Set Tahun Otomatis di Footer
    const tahunEl = document.getElementById('tahun');
    if (tahunEl) {
        tahunEl.textContent = new Date().getFullYear();
    }

    // 2. Toggle Menu Navigasi Mobile
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');

    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Tutup menu otomatis saat link diklik di tampilan mobile
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });

    // 3. Efek Bayangan Navbar saat Di-scroll
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 4. Animasi Penghitung Angka (Counter) Menggunakan Intersection Observer
    const counters = document.querySelectorAll('.counter');
    let hasCounted = false;

    const animateCounters = () => {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const duration = 1500; // milidetik
            const increment = target / (duration / 16);

            let current = 0;
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };
            updateCounter();
        });
    };

    const statsSection = document.getElementById('program');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !hasCounted) {
                animateCounters();
                hasCounted = true;
            }
        }, { threshold: 0.4 });

        observer.observe(statsSection);
    }

    // 5. Penanganan Pengiriman Formulir Kontak
    const contactForm = document.getElementById('contactForm');
    const formFeedback = document.getElementById('formFeedback');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nama = document.getElementById('nama').value.trim();
            const email = document.getElementById('email').value.trim();
            const pesan = document.getElementById('pesan').value.trim();

            if (!nama || !email || !pesan) {
                formFeedback.style.color = '#dc2626';
                formFeedback.textContent = 'Harap lengkapi seluruh kolom formulir.';
                return;
            }

            formFeedback.style.color = '#059669';
            formFeedback.textContent = `Terima kasih, ${nama}! Pesan Anda untuk Jangkar SMKN 1 Watulimo telah berhasil dikirim.`;
            contactForm.reset();
        });
    }
});
