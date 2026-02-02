document.addEventListener("DOMContentLoaded", function () {
    const mainContent = document.getElementById("main-content");
    const genreTitleElement = document.getElementById("genreTitle");
    const genreAnimeList = document.getElementById("genreAnimeList");
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    const exploreToggle = document.querySelector('.explore-toggle');
    const exploreGenresList = document.getElementById('exploreGenres');
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

    // Get genre from URL
    const urlParams = new URLSearchParams(window.location.search);
    const genre = decodeURIComponent(urlParams.get('genre') || '');

    if (genreTitleElement) {
        genreTitleElement.textContent = `${genre} Anime`;
        document.getElementById("pageTitle").textContent = `${genre} Anime`;
    }

    // Filter anime by genre
    const filteredAnimeEntries = Object.entries(animeData).filter(([id, anime]) =>
        anime.genres.includes(genre)
    );

    // Display anime cards
    if (genreAnimeList) {
        genreAnimeList.innerHTML = "";
        if (filteredAnimeEntries.length > 0) {
            filteredAnimeEntries.forEach(([id, anime]) => {
                const card = createAnimeCard(id, anime);
                card.classList.remove("swiper-slide"); // Remove swiper-slide for grid
                genreAnimeList.appendChild(card);
            });
        } else {
            genreAnimeList.innerHTML = `<p>No anime found for the genre \"${genre}\".</p>`;
        }
    }

    // Helper to Create Anime Cards
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

  // Toggle sidebar on menu button click
  menuToggle.addEventListener('click', () => {
    const isRetracted = sidebar.classList.contains('retracted');
    setSidebarState(!isRetracted);
  });

  // Function to set sidebar state
  function setSidebarState(isRetracted) {
    if (isRetracted) {
      sidebar.classList.add('retracted');
      appContainer.classList.add('sidebar-retracted');
    } else {
      sidebar.classList.remove('retracted');
      appContainer.classList.remove('sidebar-retracted');
    }
  }

  // Set initial sidebar state
  setSidebarState(false);

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
