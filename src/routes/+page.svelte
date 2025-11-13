<script>
	import '../styles/reset.css';
	import '../styles/global.css';
	import '../styles/nav.css';
	import '../styles/hero.css';
	import '../styles/profile.css';
	import '../styles/portfolio.css';
	import '../styles/course.css';
	import '../styles/contact.css';
	import '../styles/footer.css';

	import { onMount } from 'svelte';


	let menuOpen = false;

	function toggleMenu() {
		menuOpen = !menuOpen;
	}

	// Smooth scroll (déjà présent)
onMount(() => {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                menuOpen = false;
            }
        });
    });
    
    // Animation au scroll pour portfolio items
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observer tous les items portfolio
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    portfolioItems.forEach(item => observer.observe(item));
});
</script>

<header>
	<nav id="menu">
		<button class="burger" onclick={toggleMenu} aria-label="Menu">☰</button>
		<ul class:open={menuOpen}>
			<li><a href="#profile" onclick={toggleMenu}>Présentation</a></li>
			<li><a href="#portfolio" onclick={toggleMenu}>Portefolio</a></li>
			<li><a href="#course" onclick={toggleMenu}>Parcours</a></li>
			<li><a href="#contact" onclick={toggleMenu}>Contact</a></li>
		</ul>
	</nav>
</header>

<main>
	<section id="hero">
		<h1>Pinault Tanguy</h1>
		<p>Artiste Plasticien & Maskmaker</p>
	</section>

	<section id="profile">
		<h2>Présentation</h2>
		<p>lorem ipsum niezOFH B HUHEZui efjze uiifhze e jibfhkz uihfui z nnjihui</p>
		<button class="scroll-top" aria-label="Retour en haut">🢕</button>
	</section>

	<section id="portfolio">
		<h2>Portfolio</h2>
		<div class="portfolio-grid">
    <!-- Items 1-17 : Desktop + Tablette -->
    <div class="portfolio-item desktop-tablet item-1">1</div>
    <div class="portfolio-item desktop-tablet item-2">2</div>
    <div class="portfolio-item desktop-tablet item-3">3</div>
    <div class="portfolio-item desktop-tablet item-4">4</div>
    <div class="portfolio-item desktop-tablet item-5">5</div>
    <div class="portfolio-item desktop-tablet item-6">6</div>
    <div class="portfolio-item desktop-tablet item-7">7</div>
    <div class="portfolio-item desktop-tablet item-8">8</div>
    <div class="portfolio-item desktop-tablet item-9">9</div>
    <div class="portfolio-item desktop-tablet item-10">10</div>
    <div class="portfolio-item desktop-tablet item-11">11</div>
    <div class="portfolio-item desktop-tablet item-12">12</div>
    <div class="portfolio-item desktop-tablet item-13">13</div>
    <div class="portfolio-item desktop-tablet item-14">14</div>
    <div class="portfolio-item desktop-tablet item-15">15</div>
    <div class="portfolio-item desktop-tablet item-16">16</div>
    <div class="portfolio-item desktop-tablet item-17">17</div>
    
    <!-- Items 18-31 : Mobile uniquement -->
    <div class="portfolio-item mobile-only item-18">M1</div>
    <div class="portfolio-item mobile-only item-19">M2</div>
    <div class="portfolio-item mobile-only item-20">M3</div>
    <div class="portfolio-item mobile-only item-21">M4</div>
    <div class="portfolio-item mobile-only item-22">M5</div>
    <div class="portfolio-item mobile-only item-23">M6</div>
    <div class="portfolio-item mobile-only item-24">M7</div>
    <div class="portfolio-item mobile-only item-25">M8</div>
    <div class="portfolio-item mobile-only item-26">M9</div>
    <div class="portfolio-item mobile-only item-27">M10</div>
    <div class="portfolio-item mobile-only item-28">M11</div>
    <div class="portfolio-item mobile-only item-29">M12</div>
    <div class="portfolio-item mobile-only item-30">M13</div>
    <div class="portfolio-item mobile-only item-31">M14</div>
</div>
		<button class="scroll-top" aria-label="Retour en haut">🢕</button>
	</section>

	<section id="course">
		<h2>Parcours</h2>
		<button class="scroll-top" aria-label="Retour en haut">🢕</button>
	</section>

	<section id="contact">
    <h2>Contact</h2>
    <form class="contact-form">
        <div class="form-group">
            <label for="name">Nom</label>
            <input type="text" id="name" name="name" required />
        </div>
        
        <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" required />
        </div>
        
        <div class="form-group">
            <label for="message">Message</label>
            <textarea id="message" name="message" rows="5" required></textarea>
        </div>
        
        <button type="submit" class="submit-btn">Envoyer</button>
    </form>
    <button class="scroll-top" aria-label="Retour en haut">🢕</button>
</section>
</main>

<footer>
	<h4>Instagram</h4>
	<img class="instagram_logo" src="" alt="" />
	<p>© 2025 Tanguy Pinault</p>
</footer>

<style>
</style>
