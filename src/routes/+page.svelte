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

	// Récupérer le hero depuis PocketBase
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

	// Récupérer le portfolio depuis PocketBase
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

	// Convertir les noms de couleurs en valeurs CSS
	function getColorVar(colorName) {
		const colorMap = {
			dark: 'var(--dark)',
			grey: 'var(--grey)',
			beige: 'var(--beige-medium)',
			'beige-light': 'var(--beige-light)',
			gold: 'var(--gold)'
		};
		return colorMap[colorName] || 'var(--beige-light)';
	}

	// Smooth scroll (déjà présent)
	onMount(() => {
		fetchHero();
		fetchPortfolio();

		//Gestion du scroll pour le portfolio
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

		// Animation au scroll pour portfolio items
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

		// Observer tous les items portfolio
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
		<button class="scroll-top" onclick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
			>🢕</button
		>
	</section>

	<section id="portfolio">
		<h2>Portfolio</h2>

		<!-- Bouton toggle pour Tanguy -->
		<button class="preview-toggle" onclick={() => (showPositions = !showPositions)}>
			{showPositions ? '🔒 Masquer numéros' : '👁️ Voir numéros'}
		</button>

		<div class="portfolio-grid" class:show-positions={showPositions}>
			<!-- Items 1-17 : Desktop + Tablette -->
			<div class="portfolio-item desktop-tablet item-1">
				<span class="position-label">#1 - Tab:C / Desk:E</span>
				{#if portfolioItems.find((item) => item.order === 1)}
					{@const item = portfolioItems.find((item) => item.order === 1)}
					{#if item.content_type === 'image' && item.image}
						<img
							src="http://127.0.0.1:8090/api/files/{item.collectionId}/{item.id}/{item.image}"
							alt={item.title}
							style="object-position: {item.crop_position || 'center'};"
						/>
					{:else if item.content_type === 'video' && item.video}
						<video autoplay muted loop playsinline
							><source
								src="http://127.0.0.1:8090/api/files/{item.collectionId}/{item.id}/{item.video}"
								type="video/mp4"
							/></video
						>
					{:else if item.content_type === 'text'}
						<div class="text-content">{@html item.text_content}</div>
					{/if}
				{:else}
					1
				{/if}
			</div>

			<div class="portfolio-item desktop-tablet item-2">
				<span class="position-label">#2 - Tab:B / Desk:C</span>
				{#if portfolioItems.find((item) => item.order === 2)}
					{@const item = portfolioItems.find((item) => item.order === 2)}
					{#if item.content_type === 'image' && item.image}
						<img
							src="http://127.0.0.1:8090/api/files/{item.collectionId}/{item.id}/{item.image}"
							alt={item.title}
							style="object-position: {item.crop_position || 'center'};"
						/>
					{:else if item.content_type === 'video' && item.video}
						<video autoplay muted loop playsinline
							><source
								src="http://127.0.0.1:8090/api/files/{item.collectionId}/{item.id}/{item.video}"
								type="video/mp4"
							/></video
						>
					{:else if item.content_type === 'text'}
						<div class="text-content">{@html item.text_content}</div>
					{/if}
				{:else}
					2
				{/if}
			</div>

			<div class="portfolio-item desktop-tablet item-3">
				<span class="position-label">#3 - Tab:D / Desk:B</span>
				{#if portfolioItems.find((item) => item.order === 3)}
					{@const item = portfolioItems.find((item) => item.order === 3)}
					{#if item.content_type === 'image' && item.image}
						<img
							src="http://127.0.0.1:8090/api/files/{item.collectionId}/{item.id}/{item.image}"
							alt={item.title}
							style="object-position: {item.crop_position || 'center'};"
						/>
					{:else if item.content_type === 'video' && item.video}
						<video autoplay muted loop playsinline
							><source
								src="http://127.0.0.1:8090/api/files/{item.collectionId}/{item.id}/{item.video}"
								type="video/mp4"
							/></video
						>
					{:else if item.content_type === 'text'}
						<div class="text-content">{@html item.text_content}</div>
					{/if}
				{:else}
					3
				{/if}
			</div>

			<div class="portfolio-item desktop-tablet item-4">
				<span class="position-label">#4 - Tab:E / Desk:D</span>
				{#if portfolioItems.find((item) => item.order === 4)}
					{@const item = portfolioItems.find((item) => item.order === 4)}
					{#if item.content_type === 'image' && item.image}
						<img
							src="http://127.0.0.1:8090/api/files/{item.collectionId}/{item.id}/{item.image}"
							alt={item.title}
							style="object-position: {item.crop_position || 'center'};"
						/>
					{:else if item.content_type === 'video' && item.video}
						<video autoplay muted loop playsinline
							><source
								src="http://127.0.0.1:8090/api/files/{item.collectionId}/{item.id}/{item.video}"
								type="video/mp4"
							/></video
						>
					{:else if item.content_type === 'text'}
						<div class="text-content">{@html item.text_content}</div>
					{/if}
				{:else}
					4
				{/if}
			</div>

			<div class="portfolio-item desktop-tablet item-5">
				<span class="position-label">#5 - Tab:C / Desk:D</span>
				{#if portfolioItems.find((item) => item.order === 5)}
					{@const item = portfolioItems.find((item) => item.order === 5)}
					{#if item.content_type === 'image' && item.image}
						<img
							src="http://127.0.0.1:8090/api/files/{item.collectionId}/{item.id}/{item.image}"
							alt={item.title}
							style="object-position: {item.crop_position || 'center'};"
						/>
					{:else if item.content_type === 'video' && item.video}
						<video autoplay muted loop playsinline
							><source
								src="http://127.0.0.1:8090/api/files/{item.collectionId}/{item.id}/{item.video}"
								type="video/mp4"
							/></video
						>
					{:else if item.content_type === 'text'}
						<div class="text-content">{@html item.text_content}</div>
					{/if}
				{:else}
					5
				{/if}
			</div>

			<div class="portfolio-item desktop-tablet item-6">
				<span class="position-label">#6 - Tab:B / Desk:C</span>
				{#if portfolioItems.find((item) => item.order === 6)}
					{@const item = portfolioItems.find((item) => item.order === 6)}
					{#if item.content_type === 'image' && item.image}
						<img
							src="http://127.0.0.1:8090/api/files/{item.collectionId}/{item.id}/{item.image}"
							alt={item.title}
							style="object-position: {item.crop_position || 'center'};"
						/>
					{:else if item.content_type === 'video' && item.video}
						<video autoplay muted loop playsinline
							><source
								src="http://127.0.0.1:8090/api/files/{item.collectionId}/{item.id}/{item.video}"
								type="video/mp4"
							/></video
						>
					{:else if item.content_type === 'text'}
						<div class="text-content">{@html item.text_content}</div>
					{/if}
				{:else}
					6
				{/if}
			</div>

			<div class="portfolio-item desktop-tablet item-7">
				<span class="position-label">#7 - Tab:D / Desk:B</span>
				{#if portfolioItems.find((item) => item.order === 7)}
					{@const item = portfolioItems.find((item) => item.order === 7)}
					{#if item.content_type === 'image' && item.image}
						<img
							src="http://127.0.0.1:8090/api/files/{item.collectionId}/{item.id}/{item.image}"
							alt={item.title}
							style="object-position: {item.crop_position || 'center'};"
						/>
					{:else if item.content_type === 'video' && item.video}
						<video autoplay muted loop playsinline
							><source
								src="http://127.0.0.1:8090/api/files/{item.collectionId}/{item.id}/{item.video}"
								type="video/mp4"
							/></video
						>
					{:else if item.content_type === 'text'}
						<div class="text-content">{@html item.text_content}</div>
					{/if}
				{:else}
					7
				{/if}
			</div>

			<div class="portfolio-item desktop-tablet item-8">
				<span class="position-label">#8 - Tab:D / Desk:C</span>
				{#if portfolioItems.find((item) => item.order === 8)}
					{@const item = portfolioItems.find((item) => item.order === 8)}
					{#if item.content_type === 'image' && item.image}
						<img
							src="http://127.0.0.1:8090/api/files/{item.collectionId}/{item.id}/{item.image}"
							alt={item.title}
							style="object-position: {item.crop_position || 'center'};"
						/>
					{:else if item.content_type === 'video' && item.video}
						<video autoplay muted loop playsinline
							><source
								src="http://127.0.0.1:8090/api/files/{item.collectionId}/{item.id}/{item.video}"
								type="video/mp4"
							/></video
						>
					{:else if item.content_type === 'text'}
						<div class="text-content">{@html item.text_content}</div>
					{/if}
				{:else}
					8
				{/if}
			</div>

			<div class="portfolio-item desktop-tablet item-9">
				<span class="position-label">#9 - Tab:C / Desk:C</span>
				{#if portfolioItems.find((item) => item.order === 9)}
					{@const item = portfolioItems.find((item) => item.order === 9)}
					{#if item.content_type === 'image' && item.image}
						<img
							src="http://127.0.0.1:8090/api/files/{item.collectionId}/{item.id}/{item.image}"
							alt={item.title}
							style="object-position: {item.crop_position || 'center'};"
						/>
					{:else if item.content_type === 'video' && item.video}
						<video autoplay muted loop playsinline
							><source
								src="http://127.0.0.1:8090/api/files/{item.collectionId}/{item.id}/{item.video}"
								type="video/mp4"
							/></video
						>
					{:else if item.content_type === 'text'}
						<div class="text-content">{@html item.text_content}</div>
					{/if}
				{:else}
					9
				{/if}
			</div>

			<div class="portfolio-item desktop-tablet item-10">
				<span class="position-label">#10 - Tab:E / Desk:—</span>
				{#if portfolioItems.find((item) => item.order === 10)}
					{@const item = portfolioItems.find((item) => item.order === 10)}
					{#if item.content_type === 'image' && item.image}
						<img
							src="http://127.0.0.1:8090/api/files/{item.collectionId}/{item.id}/{item.image}"
							alt={item.title}
							style="object-position: {item.crop_position || 'center'};"
						/>
					{:else if item.content_type === 'video' && item.video}
						<video autoplay muted loop playsinline
							><source
								src="http://127.0.0.1:8090/api/files/{item.collectionId}/{item.id}/{item.video}"
								type="video/mp4"
							/></video
						>
					{:else if item.content_type === 'text'}
						<div class="text-content">{@html item.text_content}</div>
					{/if}
				{:else}
					10
				{/if}
			</div>

			<div class="portfolio-item desktop-tablet item-11">
				<span class="position-label">#11 - Tab:D / Desk:B</span>
				{#if portfolioItems.find((item) => item.order === 11)}
					{@const item = portfolioItems.find((item) => item.order === 11)}
					{#if item.content_type === 'image' && item.image}
						<img
							src="http://127.0.0.1:8090/api/files/{item.collectionId}/{item.id}/{item.image}"
							alt={item.title}
							style="object-position: {item.crop_position || 'center'};"
						/>
					{:else if item.content_type === 'video' && item.video}
						<video autoplay muted loop playsinline
							><source
								src="http://127.0.0.1:8090/api/files/{item.collectionId}/{item.id}/{item.video}"
								type="video/mp4"
							/></video
						>
					{:else if item.content_type === 'text'}
						<div class="text-content">{@html item.text_content}</div>
					{/if}
				{:else}
					11
				{/if}
			</div>

			<div class="portfolio-item desktop-tablet item-12">
				<span class="position-label">#12 - Tab:C / Desk:D</span>
				{#if portfolioItems.find((item) => item.order === 12)}
					{@const item = portfolioItems.find((item) => item.order === 12)}
					{#if item.content_type === 'image' && item.image}
						<img
							src="http://127.0.0.1:8090/api/files/{item.collectionId}/{item.id}/{item.image}"
							alt={item.title}
							style="object-position: {item.crop_position || 'center'};"
						/>
					{:else if item.content_type === 'video' && item.video}
						<video autoplay muted loop playsinline
							><source
								src="http://127.0.0.1:8090/api/files/{item.collectionId}/{item.id}/{item.video}"
								type="video/mp4"
							/></video
						>
					{:else if item.content_type === 'text'}
						<div class="text-content">{@html item.text_content}</div>
					{/if}
				{:else}
					12
				{/if}
			</div>

			<div class="portfolio-item desktop-tablet item-13">
				<span class="position-label">#13 - Tab:B / Desk:D</span>
				{#if portfolioItems.find((item) => item.order === 13)}
					{@const item = portfolioItems.find((item) => item.order === 13)}
					{#if item.content_type === 'image' && item.image}
						<img
							src="http://127.0.0.1:8090/api/files/{item.collectionId}/{item.id}/{item.image}"
							alt={item.title}
							style="object-position: {item.crop_position || 'center'};"
						/>
					{:else if item.content_type === 'video' && item.video}
						<video autoplay muted loop playsinline
							><source
								src="http://127.0.0.1:8090/api/files/{item.collectionId}/{item.id}/{item.video}"
								type="video/mp4"
							/></video
						>
					{:else if item.content_type === 'text'}
						<div class="text-content">{@html item.text_content}</div>
					{/if}
				{:else}
					13
				{/if}
			</div>

			<div class="portfolio-item desktop-tablet item-14">
				<span class="position-label">#14 - Tab:C / Desk:C</span>
				{#if portfolioItems.find((item) => item.order === 14)}
					{@const item = portfolioItems.find((item) => item.order === 14)}
					{#if item.content_type === 'image' && item.image}
						<img
							src="http://127.0.0.1:8090/api/files/{item.collectionId}/{item.id}/{item.image}"
							alt={item.title}
							style="object-position: {item.crop_position || 'center'};"
						/>
					{:else if item.content_type === 'video' && item.video}
						<video autoplay muted loop playsinline
							><source
								src="http://127.0.0.1:8090/api/files/{item.collectionId}/{item.id}/{item.video}"
								type="video/mp4"
							/></video
						>
					{:else if item.content_type === 'text'}
						<div class="text-content">{@html item.text_content}</div>
					{/if}
				{:else}
					14
				{/if}
			</div>

			<div class="portfolio-item desktop-tablet item-15">
				<span class="position-label">#15 - Tab:E / Desk:B</span>
				{#if portfolioItems.find((item) => item.order === 15)}
					{@const item = portfolioItems.find((item) => item.order === 15)}
					{#if item.content_type === 'image' && item.image}
						<img
							src="http://127.0.0.1:8090/api/files/{item.collectionId}/{item.id}/{item.image}"
							alt={item.title}
							style="object-position: {item.crop_position || 'center'};"
						/>
					{:else if item.content_type === 'video' && item.video}
						<video autoplay muted loop playsinline
							><source
								src="http://127.0.0.1:8090/api/files/{item.collectionId}/{item.id}/{item.video}"
								type="video/mp4"
							/></video
						>
					{:else if item.content_type === 'text'}
						<div class="text-content">{@html item.text_content}</div>
					{/if}
				{:else}
					15
				{/if}
			</div>

			<div class="portfolio-item desktop-tablet item-16">
				<span class="position-label">#16 - Tab:B / Desk:C</span>
				{#if portfolioItems.find((item) => item.order === 16)}
					{@const item = portfolioItems.find((item) => item.order === 16)}
					{#if item.content_type === 'image' && item.image}
						<img
							src="http://127.0.0.1:8090/api/files/{item.collectionId}/{item.id}/{item.image}"
							alt={item.title}
							style="object-position: {item.crop_position || 'center'};"
						/>
					{:else if item.content_type === 'video' && item.video}
						<video autoplay muted loop playsinline
							><source
								src="http://127.0.0.1:8090/api/files/{item.collectionId}/{item.id}/{item.video}"
								type="video/mp4"
							/></video
						>
					{:else if item.content_type === 'text'}
						<div class="text-content">{@html item.text_content}</div>
					{/if}
				{:else}
					16
				{/if}
			</div>

			<div class="portfolio-item desktop-tablet item-17">
				<span class="position-label">#17 - Tab:C / Desk:E</span>
				{#if portfolioItems.find((item) => item.order === 17)}
					{@const item = portfolioItems.find((item) => item.order === 17)}
					{#if item.content_type === 'image' && item.image}
						<img
							src="http://127.0.0.1:8090/api/files/{item.collectionId}/{item.id}/{item.image}"
							alt={item.title}
							style="object-position: {item.crop_position || 'center'};"
						/>
					{:else if item.content_type === 'video' && item.video}
						<video autoplay muted loop playsinline
							><source
								src="http://127.0.0.1:8090/api/files/{item.collectionId}/{item.id}/{item.video}"
								type="video/mp4"
							/></video
						>
					{:else if item.content_type === 'text'}
						<div class="text-content">{@html item.text_content}</div>
					{/if}
				{:else}
					17
				{/if}
			</div>

			<!-- Items 18-31 : Mobile uniquement -->
			<div class="portfolio-item mobile-only item-18">
				<span class="position-label">#M1 - Mob:C</span
				>{#if portfolioItems.find((item) => item.order === 18)}{@const item = portfolioItems.find(
						(item) => item.order === 18
					)}{#if item.content_type === 'image' && item.image}<img
							src="http://127.0.0.1:8090/api/files/{item.collectionId}/{item.id}/{item.image}"
							alt={item.title}
							style="object-position: {item.crop_position || 'center'};"
						/>{:else if item.content_type === 'video' && item.video}<video
							autoplay
							muted
							loop
							playsinline
							><source
								src="http://127.0.0.1:8090/api/files/{item.collectionId}/{item.id}/{item.video}"
								type="video/mp4"
							/></video
						>{:else if item.content_type === 'text'}<div class="text-content">
							{@html item.text_content}
						</div>{/if}{:else}M1{/if}
			</div>
			<div class="portfolio-item mobile-only item-19">
				<span class="position-label">#M2 - Mob:B</span
				>{#if portfolioItems.find((item) => item.order === 19)}{@const item = portfolioItems.find(
						(item) => item.order === 19
					)}{#if item.content_type === 'image' && item.image}<img
							src="http://127.0.0.1:8090/api/files/{item.collectionId}/{item.id}/{item.image}"
							alt={item.title}
							style="object-position: {item.crop_position || 'center'};"
						/>{:else if item.content_type === 'video' && item.video}<video
							autoplay
							muted
							loop
							playsinline
							><source
								src="http://127.0.0.1:8090/api/files/{item.collectionId}/{item.id}/{item.video}"
								type="video/mp4"
							/></video
						>{:else if item.content_type === 'text'}<div class="text-content">
							{@html item.text_content}
						</div>{/if}{:else}M2{/if}
			</div>
			<div class="portfolio-item mobile-only item-20">
				<span class="position-label">#M3 - Mob:A</span
				>{#if portfolioItems.find((item) => item.order === 20)}{@const item = portfolioItems.find(
						(item) => item.order === 20
					)}{#if item.content_type === 'image' && item.image}<img
							src="http://127.0.0.1:8090/api/files/{item.collectionId}/{item.id}/{item.image}"
							alt={item.title}
							style="object-position: {item.crop_position || 'center'};"
						/>{:else if item.content_type === 'video' && item.video}<video
							autoplay
							muted
							loop
							playsinline
							><source
								src="http://127.0.0.1:8090/api/files/{item.collectionId}/{item.id}/{item.video}"
								type="video/mp4"
							/></video
						>{:else if item.content_type === 'text'}<div class="text-content">
							{@html item.text_content}
						</div>{/if}{:else}M3{/if}
			</div>
			<div class="portfolio-item mobile-only item-21">
				<span class="position-label">#M4 - Mob:A</span
				>{#if portfolioItems.find((item) => item.order === 21)}{@const item = portfolioItems.find(
						(item) => item.order === 21
					)}{#if item.content_type === 'image' && item.image}<img
							src="http://127.0.0.1:8090/api/files/{item.collectionId}/{item.id}/{item.image}"
							alt={item.title}
							style="object-position: {item.crop_position || 'center'};"
						/>{:else if item.content_type === 'video' && item.video}<video
							autoplay
							muted
							loop
							playsinline
							><source
								src="http://127.0.0.1:8090/api/files/{item.collectionId}/{item.id}/{item.video}"
								type="video/mp4"
							/></video
						>{:else if item.content_type === 'text'}<div class="text-content">
							{@html item.text_content}
						</div>{/if}{:else}M4{/if}
			</div>
			<div class="portfolio-item mobile-only item-22">
				<span class="position-label">#M5 - Mob:C</span
				>{#if portfolioItems.find((item) => item.order === 22)}{@const item = portfolioItems.find(
						(item) => item.order === 22
					)}{#if item.content_type === 'image' && item.image}<img
							src="http://127.0.0.1:8090/api/files/{item.collectionId}/{item.id}/{item.image}"
							alt={item.title}
							style="object-position: {item.crop_position || 'center'};"
						/>{:else if item.content_type === 'video' && item.video}<video
							autoplay
							muted
							loop
							playsinline
							><source
								src="http://127.0.0.1:8090/api/files/{item.collectionId}/{item.id}/{item.video}"
								type="video/mp4"
							/></video
						>{:else if item.content_type === 'text'}<div class="text-content">
							{@html item.text_content}
						</div>{/if}{:else}M5{/if}
			</div>
			<div class="portfolio-item mobile-only item-23">
				<span class="position-label">#M6 - Mob:A</span
				>{#if portfolioItems.find((item) => item.order === 23)}{@const item = portfolioItems.find(
						(item) => item.order === 23
					)}{#if item.content_type === 'image' && item.image}<img
							src="http://127.0.0.1:8090/api/files/{item.collectionId}/{item.id}/{item.image}"
							alt={item.title}
							style="object-position: {item.crop_position || 'center'};"
						/>{:else if item.content_type === 'video' && item.video}<video
							autoplay
							muted
							loop
							playsinline
							><source
								src="http://127.0.0.1:8090/api/files/{item.collectionId}/{item.id}/{item.video}"
								type="video/mp4"
							/></video
						>{:else if item.content_type === 'text'}<div class="text-content">
							{@html item.text_content}
						</div>{/if}{:else}M6{/if}
			</div>
			<div class="portfolio-item mobile-only item-24">
				<span class="position-label">#M7 - Mob:A</span
				>{#if portfolioItems.find((item) => item.order === 24)}{@const item = portfolioItems.find(
						(item) => item.order === 24
					)}{#if item.content_type === 'image' && item.image}<img
							src="http://127.0.0.1:8090/api/files/{item.collectionId}/{item.id}/{item.image}"
							alt={item.title}
							style="object-position: {item.crop_position || 'center'};"
						/>{:else if item.content_type === 'video' && item.video}<video
							autoplay
							muted
							loop
							playsinline
							><source
								src="http://127.0.0.1:8090/api/files/{item.collectionId}/{item.id}/{item.video}"
								type="video/mp4"
							/></video
						>{:else if item.content_type === 'text'}<div class="text-content">
							{@html item.text_content}
						</div>{/if}{:else}M7{/if}
			</div>
			<div class="portfolio-item mobile-only item-25">
				<span class="position-label">#M8 - Mob:A</span
				>{#if portfolioItems.find((item) => item.order === 25)}{@const item = portfolioItems.find(
						(item) => item.order === 25
					)}{#if item.content_type === 'image' && item.image}<img
							src="http://127.0.0.1:8090/api/files/{item.collectionId}/{item.id}/{item.image}"
							alt={item.title}
							style="object-position: {item.crop_position || 'center'};"
						/>{:else if item.content_type === 'video' && item.video}<video
							autoplay
							muted
							loop
							playsinline
							><source
								src="http://127.0.0.1:8090/api/files/{item.collectionId}/{item.id}/{item.video}"
								type="video/mp4"
							/></video
						>{:else if item.content_type === 'text'}<div class="text-content">
							{@html item.text_content}
						</div>{/if}{:else}M8{/if}
			</div>
			<div class="portfolio-item mobile-only item-26">
				<span class="position-label">#M9 - Mob:A</span
				>{#if portfolioItems.find((item) => item.order === 26)}{@const item = portfolioItems.find(
						(item) => item.order === 26
					)}{#if item.content_type === 'image' && item.image}<img
							src="http://127.0.0.1:8090/api/files/{item.collectionId}/{item.id}/{item.image}"
							alt={item.title}
							style="object-position: {item.crop_position || 'center'};"
						/>{:else if item.content_type === 'video' && item.video}<video
							autoplay
							muted
							loop
							playsinline
							><source
								src="http://127.0.0.1:8090/api/files/{item.collectionId}/{item.id}/{item.video}"
								type="video/mp4"
							/></video
						>{:else if item.content_type === 'text'}<div class="text-content">
							{@html item.text_content}
						</div>{/if}{:else}M9{/if}
			</div>
			<div class="portfolio-item mobile-only item-27">
				<span class="position-label">#M10 - Mob:C</span
				>{#if portfolioItems.find((item) => item.order === 27)}{@const item = portfolioItems.find(
						(item) => item.order === 27
					)}{#if item.content_type === 'image' && item.image}<img
							src="http://127.0.0.1:8090/api/files/{item.collectionId}/{item.id}/{item.image}"
							alt={item.title}
							style="object-position: {item.crop_position || 'center'};"
						/>{:else if item.content_type === 'video' && item.video}<video
							autoplay
							muted
							loop
							playsinline
							><source
								src="http://127.0.0.1:8090/api/files/{item.collectionId}/{item.id}/{item.video}"
								type="video/mp4"
							/></video
						>{:else if item.content_type === 'text'}<div class="text-content">
							{@html item.text_content}
						</div>{/if}{:else}M10{/if}
			</div>
			<div class="portfolio-item mobile-only item-28">
				<span class="position-label">#M11 - Mob:A</span
				>{#if portfolioItems.find((item) => item.order === 28)}{@const item = portfolioItems.find(
						(item) => item.order === 28
					)}{#if item.content_type === 'image' && item.image}<img
							src="http://127.0.0.1:8090/api/files/{item.collectionId}/{item.id}/{item.image}"
							alt={item.title}
							style="object-position: {item.crop_position || 'center'};"
						/>{:else if item.content_type === 'video' && item.video}<video
							autoplay
							muted
							loop
							playsinline
							><source
								src="http://127.0.0.1:8090/api/files/{item.collectionId}/{item.id}/{item.video}"
								type="video/mp4"
							/></video
						>{:else if item.content_type === 'text'}<div class="text-content">
							{@html item.text_content}
						</div>{/if}{:else}M11{/if}
			</div>
			<div class="portfolio-item mobile-only item-29">
				<span class="position-label">#M12 - Mob:A</span
				>{#if portfolioItems.find((item) => item.order === 29)}{@const item = portfolioItems.find(
						(item) => item.order === 29
					)}{#if item.content_type === 'image' && item.image}<img
							src="http://127.0.0.1:8090/api/files/{item.collectionId}/{item.id}/{item.image}"
							alt={item.title}
							style="object-position: {item.crop_position || 'center'};"
						/>{:else if item.content_type === 'video' && item.video}<video
							autoplay
							muted
							loop
							playsinline
							><source
								src="http://127.0.0.1:8090/api/files/{item.collectionId}/{item.id}/{item.video}"
								type="video/mp4"
							/></video
						>{:else if item.content_type === 'text'}<div class="text-content">
							{@html item.text_content}
						</div>{/if}{:else}M12{/if}
			</div>
			<div class="portfolio-item mobile-only item-30">
				<span class="position-label">#M13 - Mob:B</span
				>{#if portfolioItems.find((item) => item.order === 30)}{@const item = portfolioItems.find(
						(item) => item.order === 30
					)}{#if item.content_type === 'image' && item.image}<img
							src="http://127.0.0.1:8090/api/files/{item.collectionId}/{item.id}/{item.image}"
							alt={item.title}
							style="object-position: {item.crop_position || 'center'};"
						/>{:else if item.content_type === 'video' && item.video}<video
							autoplay
							muted
							loop
							playsinline
							><source
								src="http://127.0.0.1:8090/api/files/{item.collectionId}/{item.id}/{item.video}"
								type="video/mp4"
							/></video
						>{:else if item.content_type === 'text'}<div class="text-content">
							{@html item.text_content}
						</div>{/if}{:else}M13{/if}
			</div>
			<div class="portfolio-item mobile-only item-31">
				<span class="position-label">#M14 - Mob:C</span
				>{#if portfolioItems.find((item) => item.order === 31)}{@const item = portfolioItems.find(
						(item) => item.order === 31
					)}{#if item.content_type === 'image' && item.image}<img
							src="http://127.0.0.1:8090/api/files/{item.collectionId}/{item.id}/{item.image}"
							alt={item.title}
							style="object-position: {item.crop_position || 'center'};"
						/>{:else if item.content_type === 'video' && item.video}<video
							autoplay
							muted
							loop
							playsinline
							><source
								src="http://127.0.0.1:8090/api/files/{item.collectionId}/{item.id}/{item.video}"
								type="video/mp4"
							/></video
						>{:else if item.content_type === 'text'}<div class="text-content">
							{@html item.text_content}
						</div>{/if}{:else}M14{/if}
			</div>
		</div>

		<button class="scroll-top" onclick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
			>🢕</button
		>
	</section>

	<section id="course">
		<h2>Parcours</h2>
		<button class="scroll-top" onclick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
			>🢕</button
		>
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
