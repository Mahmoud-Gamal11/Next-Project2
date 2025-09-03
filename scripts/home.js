
        function clicked() {
            window.location.href = "../Pages/dashboard.html";
        }

        document.addEventListener('DOMContentLoaded', function() {
            // Animate header text letter by letter
            const header = document.getElementById('animated-header');
            const text = header.textContent;
            header.textContent = '';
            text.split('').forEach((char, index) => {
                const span = document.createElement('span');
                span.textContent = char === ' ' ? '\u00A0' : char;
                span.style.animationDelay = `${index * 0.1}s`;
                header.appendChild(span);
            });

            // Highlight active nav link
            const links = document.querySelectorAll('nav ul li a');
            const currentPath = window.location.pathname.split('/').pop() || 'index.html';
            links.forEach(link => {
                const linkPath = link.getAttribute('href').split('/').pop();
                if (linkPath === currentPath) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });

            // Section visibility observer
            const sections = document.querySelectorAll('section');
            const observerOptions = {
                root: null,
                threshold: 0.1,
                rootMargin: '0px'
            };
            const observer = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, observerOptions);
            sections.forEach(section => {
                observer.observe(section);
            });

            // Mobile menu toggle
            const menuToggle = document.querySelector('.menu-toggle');
            const navUl = document.querySelector('nav ul');

            menuToggle.addEventListener('click', () => {
                menuToggle.classList.toggle('active');
                navUl.classList.toggle('active');
            });
        });
