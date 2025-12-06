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
	let showToggleButton = false;
	let presentationData = null;
	let expositions = [];
	let publications = [];
	let formations = [];
	let contactForm = {
		name: '',
		email: '',
		message: '',
		honeypot: ''
	};
	let formStatus = ''; // '', 'sending', 'success', 'error'
	let formMessage = '';

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

	async function fetchPresentation() {
		try {
			const records = await pb.collection('presentation').getList(1, 1);
			if (records.items.length > 0) {
				presentationData = records.items[0];
			}
		} catch (error) {
			console.error('Erreur présentation:', error);
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

	async function fetchExpositions() {
		try {
			const records = await pb.collection('expositions').getList(1, 100, {
				sort: '-year'
			});
			expositions = records.items;
			console.log('Expositions:', expositions);
		} catch (error) {
			console.error('Erreur expositions:', error);
		}
	}

	async function fetchPublications() {
		try {
			const records = await pb.collection('publications').getList(1, 100, {
				sort: '-year'
			});
			publications = records.items;
			console.log('Publications:', publications);
		} catch (error) {
			console.error('Erreur publications:', error);
		}
	}

	async function fetchFormations() {
		try {
			const records = await pb.collection('formations').getList(1, 100, {
				sort: '-year'
			});
			formations = records.items;
			console.log('Formations:', formations);
		} catch (error) {
			console.error('Erreur formations:', error);
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

	async function handleContactSubmit(e) {
		e.preventDefault();

		// Anti-spam : si honeypot rempli, ignorer
		if (contactForm.honeypot !== '') {
			console.log('Bot détecté');
			return;
		}

		// Validation basique
		if (contactForm.name.length < 2) {
			formStatus = 'error';
			formMessage = 'Le nom doit contenir au moins 2 caractères.';
			return;
		}

		if (contactForm.message.length < 10) {
			formStatus = 'error';
			formMessage = 'Le message doit contenir au moins 10 caractères.';
			return;
		}

		// Envoi
		formStatus = 'sending';
		formMessage = 'Envoi en cours...';

		try {
			await pb.collection('messages').create({
				name: contactForm.name,
				email: contactForm.email,
				message: contactForm.message,
				honeypot: contactForm.honeypot,
				read: false
			});

			formStatus = 'success';
			formMessage = 'Message envoyé avec succès ! Je vous répondrai rapidement.';

			// Réinitialiser le formulaire
			contactForm = {
				name: '',
				email: '',
				message: '',
				honeypot: ''
			};

			// Masquer le message après 5 secondes
			setTimeout(() => {
				formStatus = '';
				formMessage = '';
			}, 5000);
		} catch (error) {
			console.error('Erreur envoi message:', error);
			formStatus = 'error';
			formMessage = "Erreur lors de l'envoi. Veuillez réessayer.";
		}
	}

	onMount(() => {
		fetchHero();
		fetchPortfolio();
		fetchPresentation();
		fetchExpositions();
		fetchPublications();
		fetchFormations();

		// Raccourci clavier Ctrl+Shift+P pour afficher/masquer le toggle
		window.addEventListener('keydown', (e) => {
			if (e.ctrlKey && e.shiftKey && e.key === 'P') {
				showToggleButton = !showToggleButton;
				console.log('Toggle button:', showToggleButton ? 'visible' : 'caché');
			}
		});

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

	<section id="profile" style="color: var(--{presentationData?.text_color || 'dark'});">
		<h2>Présentation</h2>
		{#if presentationData}
			<div class="presentation-content">
				{@html presentationData.content}
			</div>
		{:else}
			<p>Chargement...</p>
		{/if}
		<button class="scroll-top" onclick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
			🢕
		</button>
	</section>

	<section id="portfolio">
		<h2>Portfolio</h2>

		{#if showToggleButton}
			<button class="preview-toggle" onclick={() => (showPositions = !showPositions)}>
				{showPositions ? '🔒 Masquer numéros' : '👁️ Voir numéros'}
			</button>
		{/if}

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

		<!-- EXPOSITIONS -->
		<div class="expositions-section">
			<h3>Expositions</h3>

			{#if expositions.filter((e) => e.type === 'collective').length > 0}
				<h4>Expositions Collectives</h4>
				{#each expositions.filter((e) => e.type === 'collective') as expo}
					<div class="course-item">
						<span class="year">{expo.year}</span>
						<span class="title">{expo.title}</span>
						{#if expo.venue}
							<span class="venue">{expo.venue}</span>
						{/if}
						<span class="location">{expo.location}</span>
					</div>
				{/each}
			{/if}

			{#if expositions.filter((e) => e.type === 'personnelle').length > 0}
				<h4>Expositions Personnelles</h4>
				{#each expositions.filter((e) => e.type === 'personnelle') as expo}
					<div class="course-item">
						<span class="year">{expo.year}</span>
						<span class="title">{expo.title}</span>
						{#if expo.venue}
							<span class="venue">{expo.venue}</span>
						{/if}
						<span class="location">{expo.location}</span>
					</div>
				{/each}
			{/if}

			{#if expositions.filter((e) => e.type === 'performance').length > 0}
				<h4>Performances</h4>
				{#each expositions.filter((e) => e.type === 'performance') as expo}
					<div class="course-item">
						<span class="year">{expo.year}</span>
						<span class="title">{expo.title}</span>
						{#if expo.venue}
							<span class="venue">{expo.venue}</span>
						{/if}
						<span class="location">{expo.location}</span>
					</div>
				{/each}
			{/if}
		</div>

		<!-- SÉPARATEUR -->
		<div class="course-divider">
			<span class="course-divider-symbol">◆</span>
		</div>

		<!-- COLONNES -->
		<div class="course-columns">
			<!-- PUBLICATIONS -->
			<div class="publications-column">
				<h3>Publications</h3>

				{#if publications.filter((p) => p.type === 'presse').length > 0}
					<h4>Presse</h4>
					{#each publications.filter((p) => p.type === 'presse') as pub}
						<div class="course-item">
							<span class="year">{pub.year}</span>
							<span class="title">{pub.title}</span>
							<span class="source">{pub.source}</span>
							{#if pub.link}
								<a href={pub.link} target="_blank" rel="noopener noreferrer">Lire l'article →</a>
							{/if}
						</div>
					{/each}
				{/if}

				{#if publications.filter((p) => p.type === 'fanzine').length > 0}
					<h4>Fanzines</h4>
					{#each publications.filter((p) => p.type === 'fanzine') as pub}
						<div class="course-item">
							<span class="year">{pub.year}</span>
							<span class="title">{pub.title}</span>
							<span class="source">{pub.source}</span>
							{#if pub.link}
								<a href={pub.link} target="_blank" rel="noopener noreferrer">Voir →</a>
							{/if}
						</div>
					{/each}
				{/if}

				{#if publications.filter((p) => p.type === 'podcast').length > 0}
					<h4>Podcasts</h4>
					{#each publications.filter((p) => p.type === 'podcast') as pub}
						<div class="course-item">
							<span class="year">{pub.year}</span>
							<span class="title">{pub.title}</span>
							<span class="source">{pub.source}</span>
							{#if pub.link}
								<a href={pub.link} target="_blank" rel="noopener noreferrer">Écouter →</a>
							{/if}
						</div>
					{/each}
				{/if}
			</div>

			<!-- SÉPARATEUR MOBILE -->
			<div class="mobile-divider">
				<span class="mobile-divider-symbol">◆</span>
			</div>

			<!-- FORMATIONS -->
			<div class="formations-column">
				<h3>Formations</h3>
				{#each formations as formation}
					<div class="formation-item">
						<span class="year">{formation.year}</span>
						<span class="school">{formation.school}</span>
						{#if formation.diploma}
							<span class="diploma">{formation.diploma}</span>
						{/if}
						{#if formation.speciality}
							<span class="speciality">{formation.speciality}</span>
						{/if}
						<span class="location">{formation.location}</span>
					</div>
				{/each}
			</div>
		</div>

		<button class="scroll-top" onclick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
			🢕
		</button>
	</section>

	<section id="contact">
		<h2>Contact</h2>
		<form class="contact-form" onsubmit={handleContactSubmit}>
			<div class="form-group">
				<label for="name">Nom</label>
				<input
					type="text"
					id="name"
					name="name"
					bind:value={contactForm.name}
					required
					disabled={formStatus === 'sending'}
				/>
			</div>

			<div class="form-group">
				<label for="email">Email</label>
				<input
					type="email"
					id="email"
					name="email"
					bind:value={contactForm.email}
					required
					disabled={formStatus === 'sending'}
				/>
			</div>

			<div class="form-group">
				<label for="message">Message</label>
				<textarea
					id="message"
					name="message"
					rows="5"
					bind:value={contactForm.message}
					required
					disabled={formStatus === 'sending'}
				></textarea>
			</div>

			<!-- Honeypot (invisible pour les humains) -->
			<input
				type="text"
				name="website"
				class="honeypot"
				bind:value={contactForm.honeypot}
				tabindex="-1"
				autocomplete="off"
			/>

			<!-- Messages de feedback -->
			{#if formMessage}
				<div class="form-message {formStatus}">
					{formMessage}
				</div>
			{/if}

			<button type="submit" class="submit-btn" disabled={formStatus === 'sending'}>
				{formStatus === 'sending' ? 'Envoi...' : 'Envoyer'}
			</button>
		</form>
	</section>
</main>

<div class="section-divider"></div>

<footer>
	<p>© 2025 Tanguy Pinault</p>
</footer>

<style>
</style>
