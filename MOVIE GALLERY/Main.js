document.addEventListener("DOMContentLoaded", function () {
    const mainContent = document.getElementById("main-content");
    const allAnimeList = document.getElementById("allAnimeList");
    const exploreToggle = document.querySelector(".explore-toggle");
    const exploreGenresList = document.getElementById("exploreGenres");
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    const allAnimeSwiper = document.getElementById('allAnimeSwiper');
    const loginLink = document.getElementById('loginLink');
    const logoutLink = document.getElementById('logoutLink');
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.querySelector('.sidebar');
    const appContainer = document.querySelector('.app-container');
    const header = document.querySelector('header');

    // === Collect All Unique Genres ===
    const allGenres = new Set();
    for (const id in animeData) {
        animeData[id].genres.forEach(genre => allGenres.add(genre));
    }

    // === Populate Explore Genres in Sidebar ===
    allGenres.forEach(genre => {
        const listItem = document.createElement("li");
        const link = document.createElement("a");
        link.href = `genre.html?genre=${encodeURIComponent(genre)}`; // Link to new genre page
        link.textContent = genre;
        link.className = "genre-item"; // Use a specific class for genre links
        link.innerHTML = `<i class='bx bx-category'></i> <span>${genre}</span>`; // Add icon and wrap text in span
        listItem.appendChild(link);
        exploreGenresList.appendChild(listItem);
    });

    // Toggle explore genres
    exploreToggle.addEventListener("click", (e) => {
        e.preventDefault();
        exploreGenresList.classList.toggle("active");
        const icon = exploreToggle.querySelector(".explore-icon");
        if (exploreGenresList.classList.contains("active")) {
            icon.classList.replace("bx-chevron-down", "bx-chevron-up");
        } else {
            icon.classList.replace("bx-chevron-up", "bx-chevron-down");
        }
    });

    // Function to set sidebar state
    function setSidebarState(isRetracted) {
        if (isRetracted) {
            sidebar.classList.add('retracted');
            appContainer.classList.add('sidebar-retracted');
            header.classList.add('sidebar-retracted');
        } else {
            sidebar.classList.remove('retracted');
            appContainer.classList.remove('sidebar-retracted');
            header.classList.remove('sidebar-retracted');
        }
    }

    // Set initial sidebar state
    setSidebarState(false);

    // Toggle sidebar on menu button click
    menuToggle.addEventListener('click', () => {
        const isRetracted = sidebar.classList.contains('retracted');
        setSidebarState(!isRetracted);
    });

    // === Populate All Anime Section ===
    if (allAnimeList) {
        allAnimeList.innerHTML = "";
        for (const id in animeData) {
            const anime = animeData[id];
            const card = createAnimeCard(id, anime);
            card.classList.remove("swiper-slide"); // Remove swiper-slide for grid
            allAnimeList.appendChild(card);
        }
    }

    // === Helper to Create Anime Cards ===
    function createAnimeCard(id, anime) {
        const card = document.createElement("div");
        card.className = "anime-card";
        card.innerHTML = `
            <a href="anime.html?id=${id}" class="anime-card-link">
                <div class="anime-image-container">
                    <img class="anime-img" src="${anime.image}" alt="${anime.title}" />
                    <span class="episode-badge">Episode ${anime.episodes.length || '1'}</span>
                </div>
                <h3 class="anime-title">${anime.title}</h3>
            </a>
        `;
        return card;
    }

    // === Swiper Carousel Initialization ===
    function initializeSwiper(selector = '.swiper-container') {
        const containers = document.querySelectorAll(selector);
        containers.forEach(container => {
            if (container.swiper) return; // Avoid re-initializing

            new Swiper(container, {
                slidesPerView: 'auto',
                spaceBetween: 15,
                loop: false,
                pagination: false,
                grabCursor: true,
                freeMode: true,
                navigation: {
                    nextEl: container.querySelector('.swiper-button-next'),
                    prevEl: container.querySelector('.swiper-button-prev'),
                },
            });
        });
    }

    // Initialize all carousels
    initializeSwiper('.genre-category .swiper-container');

    // === Search Functionality ===
    const localAnimeData = Object.keys(animeData).map(id => ({
        id: id,
        title: animeData[id].title.toLowerCase(),
        img: animeData[id].image,
        link: `anime.html?id=${id}`
    }));

    searchInput.addEventListener("input", () => {
        const keyword = searchInput.value.toLowerCase();
        searchResults.innerHTML = "";

        if (keyword.length === 0) {
            searchResults.style.display = "none";
            return;
        }

        const filtered = localAnimeData.filter(a => a.title.includes(keyword));

        filtered.forEach(anime => {
            const item = document.createElement("a");
            item.className = "search-result-item";
            item.href = anime.link;

            item.innerHTML = `
        <img src="${anime.img}" alt="${anime.title}">
        <div class="result-details">
          <h3>${animeData[anime.id].title}</h3>
          <div class="meta">Click to see more</div>
        </div>
      `;

            searchResults.appendChild(item);
        });

        searchResults.style.display = filtered.length > 0 ? "block" : "none";
    });
});
