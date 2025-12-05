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
	import { pb } from '$lib/pocketbase';

	let menuOpen = false;
	let heroData = null;
	let portfolioItems = [];
	let showPositions = false;

	function toggleMenu() {
		menuOpen = !menuOpen;
	}

	async function fetchHero() {
		try {
			const records = await pb.collection('hero').getList(1, 1);
			if (records.items.length > 0) {
				heroData = records.items[0];
			}
		} catch (error) {
			console.error('Erreur hero:', error);
		}
	}

	async function fetchPortfolio() {
		try {
			const records = await pb.collection('portfolio_items').getList(1, 50, {
				sort: 'order'
			});
			portfolioItems = records.items;
			console.log('Portfolio items:', portfolioItems);
		} catch (error) {
			console.error('Erreur portfolio:', error);
		}
	}

	function openOverlay(item) {
		const overlay = document.getElementById('portfolioOverlay');
		const container = document.getElementById('overlayContentContainer');

		container.innerHTML = '';

		if (item.content_type === 'image' && item.image) {
			const img = document.createElement('img');
			img.src = `http://127.0.0.1:8090/api/files/${item.collectionId}/${item.id}/${item.image}`;
			img.alt = item.title || '';
			img.style.objectPosition = item.crop_position || 'center';
			container.appendChild(img);
		} else if (item.content_type === 'video' && item.video) {
			const video = document.createElement('video');
			video.controls = true;
			video.autoplay = true;
			const source = document.createElement('source');
			source.src = `http://127.0.0.1:8090/api/files/${item.collectionId}/${item.id}/${item.video}`;
			source.type = 'video/mp4';
			video.appendChild(source);
			container.appendChild(video);
		} else if (item.content_type === 'text') {
			const textDiv = document.createElement('div');
			textDiv.className = 'text-content';
			textDiv.innerHTML = item.text_content;
			container.appendChild(textDiv);
		}

		overlay.classList.add('active');
	}

	function closeOverlay() {
		const overlay = document.getElementById('portfolioOverlay');
		overlay.classList.remove('active');

		const videos = overlay.querySelectorAll('video');
		videos.forEach((video) => video.pause());
	}

	onMount(() => {
		fetchHero();
		fetchPortfolio();

		const links = document.querySelectorAll('a[href^="#"]');

		links.forEach((link) => {
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

		const observerOptions = {
			threshold: 0.1,
			rootMargin: '0px 0px -50px 0px'
		};

		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.classList.add('visible');
				}
			});
		}, observerOptions);

		const portfolioItems = document.querySelectorAll('.portfolio-item');
		portfolioItems.forEach((item) => observer.observe(item));
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

<div class="menu-overlay" class:active={menuOpen} onclick={toggleMenu}></div>

<main>
	<section
		id="hero"
		style="--hero-text-color: {heroData
			? `var(--${heroData.hero_text_color})`
			: 'var(--beige-light)'};"
	>
		{#if heroData}
			{#if heroData.media_type === 'image' && heroData.image}
				<img
					class="hero-background"
					src="http://127.0.0.1:8090/api/files/{heroData.collectionId}/{heroData.id}/{heroData.image}"
					alt="Hero background"
					style="object-position: {heroData.image_position || 'center'};"
				/>
			{:else if heroData.media_type === 'video' && heroData.video}
				<video class="hero-background" autoplay muted loop playsinline>
					<source
						src="http://127.0.0.1:8090/api/files/{heroData.collectionId}/{heroData.id}/{heroData.video}"
						type="video/mp4"
					/>
				</video>
			{/if}

			<div class="hero-content">
				<h1>{heroData.title}</h1>
				<p>{heroData.subtitle}</p>
			</div>
		{:else}
			<h1>Chargement...</h1>
		{/if}
	</section>

	<section id="profile">
		<h2>Présentation</h2>
		<p>lorem ipsum niezOFH B HUHEZui efjze uiifhze e jibfhkz uihfui z nnjihui</p>
		<button class="scroll-top" onclick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
			🢕
		</button>
	</section>

	<section id="portfolio">
		<h2>Portfolio</h2>

		<button class="preview-toggle" onclick={() => (showPositions = !showPositions)}>
			{showPositions ? '🔒 Masquer numéros' : '👁️ Voir numéros'}
		</button>

		<div class="portfolio-grid" class:show-positions={showPositions}>
			<!-- Desktop & Tablet (positions 1-17) -->
			{#each [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17] as orderNum}
				{@const sizeLabels = {
					1: 'Tab:C / Desk:E',
					2: 'Tab:B / Desk:C',
					3: 'Tab:D / Desk:B',
					4: 'Tab:E / Desk:D',
					5: 'Tab:C / Desk:D',
					6: 'Tab:B / Desk:C',
					7: 'Tab:D / Desk:B',
					8: 'Tab:D / Desk:C',
					9: 'Tab:C / Desk:C',
					10: 'Tab:E / Desk:—',
					11: 'Tab:D / Desk:B',
					12: 'Tab:C / Desk:D',
					13: 'Tab:B / Desk:D',
					14: 'Tab:C / Desk:C',
					15: 'Tab:E / Desk:B',
					16: 'Tab:B / Desk:C',
					17: 'Tab:C / Desk:E'
				}}
				{#each ['desktop', 'tablet'] as breakpoint}
					{@const item = portfolioItems.find((i) => {
						if (i.order !== orderNum) return false;
						if (!i.breakpoints) return false;
						const bps = Array.isArray(i.breakpoints) ? i.breakpoints : [i.breakpoints];
						return bps.includes(breakpoint);
					})}
					<div
						class="portfolio-item {breakpoint}-only item-{orderNum}"
						role="button"
						tabindex="0"
						onclick={() => item && openOverlay(item)}
						onkeydown={(e) => {
							if ((e.key === 'Enter' || e.key === ' ') && item) {
								e.preventDefault();
								openOverlay(item);
							}
						}}
					>
						<span class="position-label">#{orderNum} - {sizeLabels[orderNum]}</span>
						{#if item}
							{#if item.content_type === 'image' && item.image}
								<img
									src="http://127.0.0.1:8090/api/files/{item.collectionId}/{item.id}/{item.image}"
									alt={item.title}
									style="object-position: {item.crop_position || 'center'};"
								/>
							{:else if item.content_type === 'video' && item.video}
								<video autoplay muted loop playsinline>
									<source
										src="http://127.0.0.1:8090/api/files/{item.collectionId}/{item.id}/{item.video}"
										type="video/mp4"
									/>
								</video>
							{:else if item.content_type === 'text'}
								<div class="text-content">{@html item.text_content}</div>
							{/if}
						{:else}
							{orderNum}
						{/if}
					</div>
				{/each}
			{/each}

			<!-- Mobile (positions M1-M14 = order 1-14) -->
			{#each [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14] as orderNum}
				{@const sizeLabels = {
					1: 'Mob:C',
					2: 'Mob:B',
					3: 'Mob:A',
					4: 'Mob:A',
					5: 'Mob:C',
					6: 'Mob:A',
					7: 'Mob:A',
					8: 'Mob:A',
					9: 'Mob:A',
					10: 'Mob:C',
					11: 'Mob:A',
					12: 'Mob:A',
					13: 'Mob:B',
					14: 'Mob:C'
				}}
				{@const item = portfolioItems.find((i) => {
					if (i.order !== orderNum) return false;
					if (!i.breakpoints) return false;
					const bps = Array.isArray(i.breakpoints) ? i.breakpoints : [i.breakpoints];
					return bps.includes('mobile');
				})}
				<div
					class="portfolio-item mobile-only item-{orderNum}"
					role="button"
					tabindex="0"
					onclick={() => item && openOverlay(item)}
					onkeydown={(e) => {
						if ((e.key === 'Enter' || e.key === ' ') && item) {
							e.preventDefault();
							openOverlay(item);
						}
					}}
				>
					<span class="position-label">#M{orderNum} - {sizeLabels[orderNum]}</span>
					{#if item}
						{#if item.content_type === 'image' && item.image}
							<img
								src="http://127.0.0.1:8090/api/files/{item.collectionId}/{item.id}/{item.image}"
								alt={item.title}
								style="object-position: {item.crop_position || 'center'};"
							/>
						{:else if item.content_type === 'video' && item.video}
							<video autoplay muted loop playsinline>
								<source
									src="http://127.0.0.1:8090/api/files/{item.collectionId}/{item.id}/{item.video}"
									type="video/mp4"
								/>
							</video>
						{:else if item.content_type === 'text'}
							<div class="text-content">{@html item.text_content}</div>
						{/if}
					{:else}
						M{orderNum}
					{/if}
				</div>
			{/each}
		</div>

		<button class="scroll-top" onclick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
			🢕
		</button>
	</section>

	<div class="portfolio-overlay" id="portfolioOverlay" onclick={closeOverlay}>
		<div class="overlay-content" onclick={closeOverlay}>
			<div id="overlayContentContainer"></div>
		</div>
	</div>

	<section id="course">
		<h2>Parcours</h2>
		<button class="scroll-top" onclick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
			🢕
		</button>
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
	</section>
</main>

<div class="section-divider"></div>

<footer>
	<p>© 2025 Tanguy Pinault</p>
</footer>

<style>
</style>