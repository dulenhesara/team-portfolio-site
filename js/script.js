// MEMBER 3: all JavaScript interactivity
document.addEventListener("DOMContentLoaded", () => {
    const typingText = document.querySelector("#typing-text");
    const phrases = ["creative thinkers", "web developers", "team players"];

    if (typingText) {
        let phraseIndex = 0;
        let characterIndex = 0;
        let deleting = false;

        const typeNextCharacter = () => {
            const phrase = phrases[phraseIndex];
            typingText.textContent = phrase.slice(0, characterIndex);

            if (!deleting && characterIndex < phrase.length) {
                characterIndex += 1;
                window.setTimeout(typeNextCharacter, 100);
            } else if (deleting && characterIndex > 0) {
                characterIndex -= 1;
                window.setTimeout(typeNextCharacter, 55);
            } else {
                deleting = !deleting;
                if (!deleting) {
                    phraseIndex = (phraseIndex + 1) % phrases.length;
                }
                window.setTimeout(typeNextCharacter, deleting ? 900 : 250);
            }
        };

        typeNextCharacter();
    }

    const menuToggle = document.querySelector(".menu-toggle");
    const navigation = document.querySelector("#primary-navigation");

    if (menuToggle && navigation) {
        const closeMenu = () => {
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute("aria-label", "Open navigation menu");
            navigation.classList.remove("is-open");
        };

        menuToggle.addEventListener("click", () => {
            const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
            menuToggle.setAttribute("aria-expanded", String(!isExpanded));
            menuToggle.setAttribute("aria-label", isExpanded ? "Open navigation menu" : "Close navigation menu");
            navigation.classList.toggle("is-open", !isExpanded);
        });

        navigation.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", closeMenu);
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                closeMenu();
                menuToggle.focus();
            }
        });
    }

    const themeToggle = document.querySelector("#theme-toggle");
    const savedTheme = window.localStorage.getItem("team-portfolio-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    const setTheme = (theme) => {
        document.documentElement.dataset.theme = theme;
        if (themeToggle) {
            const isDark = theme === "dark";
            themeToggle.setAttribute("aria-pressed", String(isDark));
            themeToggle.textContent = isDark ? "☀️ Light mode" : "🌙 Dark mode";
        }
    };

    setTheme(savedTheme || (prefersDark ? "dark" : "light"));

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
            setTheme(nextTheme);
            window.localStorage.setItem("team-portfolio-theme", nextTheme);
        });
    }

    const navigationLinks = Array.from(document.querySelectorAll("#primary-navigation a[href^='#']"));
    const sections = navigationLinks
        .map((link) => document.querySelector(link.getAttribute("href")))
        .filter(Boolean);

    const setActiveLink = (sectionId) => {
        navigationLinks.forEach((link) => {
            const isActive = link.getAttribute("href") === `#${sectionId}`;
            link.classList.toggle("active", isActive);
            if (isActive) {
                link.setAttribute("aria-current", "location");
            } else {
                link.removeAttribute("aria-current");
            }
        });
    };

    if ("IntersectionObserver" in window && sections.length > 0) {
        const sectionObserver = new IntersectionObserver((entries) => {
            const visibleSections = entries
                .filter((entry) => entry.isIntersecting)
                .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

            if (visibleSections[0]) {
                setActiveLink(visibleSections[0].target.id);
            }
        }, {
            rootMargin: "-25% 0px -55% 0px",
            threshold: [0, 0.25, 0.5, 0.75, 1]
        });

        sections.forEach((section) => sectionObserver.observe(section));
    }

    const contactForm = document.querySelector("#contact-form");
    const formMessage = document.querySelector("#form-message");

    if (contactForm && formMessage) {
        contactForm.addEventListener("input", () => {
            formMessage.textContent = "";
            formMessage.classList.remove("is-success", "is-error");
        });

        contactForm.addEventListener("submit", (event) => {
            event.preventDefault();
            formMessage.classList.remove("is-success", "is-error");

            if (!contactForm.checkValidity()) {
                contactForm.reportValidity();
                formMessage.textContent = "Please complete all fields with a valid email address.";
                formMessage.classList.add("is-error");
                return;
            }

            formMessage.textContent = "Thanks! Your message passed validation. This demo does not send messages.";
            formMessage.classList.add("is-success");
            contactForm.reset();
        });
    }
});
