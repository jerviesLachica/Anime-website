document.addEventListener("DOMContentLoaded", () => {
  const mainPlayer = document.getElementById("mainPlayer");
  const videoTitle = document.getElementById("videoTitle");
  const episodeList = document.querySelector(".episode-list");
  const episodeSearch = document.getElementById("episodeSearch");
  const downloadButton = document.getElementById("downloadButton");
  const reportButton = document.getElementById("reportButton");
  const malLink = document.getElementById("malLink");
  const refreshButton = document.getElementById("refreshButton");
  const viewModeButton = document.getElementById("viewModeButton");
  const menuToggle = document.getElementById('menuToggle');
  const sidebar = document.querySelector('.sidebar');
  const appContainer = document.querySelector('.app-container');
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');
  const exploreToggle = document.querySelector(".explore-toggle");
  const exploreGenresList = document.getElementById("exploreGenres");

  let currentEpisodes = [];
  let currentEpisode = null;

  // Get anime ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const animeId = urlParams.get("id");

  if (animeId && animeData[animeId]) {
    const anime = animeData[animeId];
    currentEpisodes = [...anime.episodes];

    document.title = anime.title;
    
    if (anime.mal_link) {
      malLink.href = anime.mal_link;
    } else {
      malLink.style.display = 'none'; // Hide if no link
    }

    renderPlaylist(currentEpisodes);

    if (currentEpisodes.length > 0) {
      loadVideo(currentEpisodes[0]);
    }
  } else {
    const container = document.querySelector('.app-container');
    if (container) {
      container.innerHTML = "<h1 style='color: white; text-align: center; width: 100%;'>Anime not found.</h1>";
    }
  }

  function loadVideo(episode) {
    currentEpisode = episode;
    mainPlayer.src = episode.file;
    videoTitle.textContent = episode.title;
    updateActiveClass();
    saveToHistory(animeId);
  }

  function renderPlaylist(episodes) {
    episodeList.innerHTML = "";
    episodes.forEach((episode, index) => {
      const item = document.createElement("div");
      item.className = "episode-item";
      item.dataset.episodeId = index; // Use index as a simple ID

      item.innerHTML = `
        <img src="${episode.thumbnail}" alt="${episode.title}" />
        <div class="episode-details">
          <h4>${index + 1}. ${episode.title}</h4>
          <p>${episode.description || ''}</p>
        </div>
      `;

      item.addEventListener("click", () => {
        loadVideo(episode);
      });

      episodeList.appendChild(item);
    });
    updateActiveClass();
  }

  function updateActiveClass() {
    const episodeItems = episodeList.querySelectorAll('.episode-item');
    const currentEpisodeIndex = currentEpisodes.indexOf(currentEpisode);

    episodeItems.forEach((item, index) => {
      if (index === currentEpisodeIndex) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  function saveToHistory(animeId) {
    const session = JSON.parse(localStorage.getItem('session'));
    console.log("Session in saveToHistory:", session);
    if (!session || !session.loggedIn) {
      console.log("User not logged in. History not saved.");
      return; // Only save history for logged-in users
    }

    let history = JSON.parse(localStorage.getItem('watchHistory')) || [];
    console.log("Current history:", history);
    
    // Remove the animeId if it already exists to move it to the front
    history = history.filter(id => id !== animeId);

    // Add the new animeId to the beginning of the array
    history.unshift(animeId);
    console.log("New history:", history);

    // Optional: Limit the history size
    if (history.length > 50) {
        history.pop();
    }

    localStorage.setItem('watchHistory', JSON.stringify(history));
    console.log("History saved to localStorage.");
  }

  episodeSearch.addEventListener("input", () => {
    const keyword = episodeSearch.value.toLowerCase();
    const filteredEpisodes = currentEpisodes.filter(ep => 
      ep.title.toLowerCase().includes(keyword)
    );
    renderPlaylist(filteredEpisodes);
  });

  downloadButton.addEventListener("click", () => {
    if (!currentEpisode) return;
    const a = document.createElement('a');
    a.href = currentEpisode.file;
    a.download = currentEpisode.title.replace(/[^a-z0-9\s]/gi, '').replace(/\s+/g, '_') + '.mp4';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });

  reportButton.addEventListener("click", () => {
    alert("The episode has been reported. We will look into it shortly.");
  });

  refreshButton.addEventListener("click", () => {
    episodeSearch.value = "";
    renderPlaylist(currentEpisodes);
  });
  
  // The function for this button is not clear, so it will be removed.
  viewModeButton.addEventListener("click", () => {
    alert("This feature is not yet implemented.");
  });

  function setSidebarState(isRetracted) {
      if (isRetracted) {
          sidebar.classList.add('retracted');
          appContainer.classList.add('sidebar-retracted');
      } else {
          sidebar.classList.remove('retracted');
          appContainer.classList.remove('sidebar-retracted');
      }
  }

  setSidebarState(false);

  menuToggle.addEventListener('click', () => {
      const isRetracted = sidebar.classList.contains('retracted');
      setSidebarState(!isRetracted);
  });

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

  const allGenres = new Set();
  for (const id in animeData) {
      animeData[id].genres.forEach(genre => allGenres.add(genre));
  }

  allGenres.forEach(genre => {
      const listItem = document.createElement("li");
      const link = document.createElement("a");
      link.href = `genre.html?genre=${encodeURIComponent(genre)}`;
      link.textContent = genre;
      link.className = "genre-item";
      link.innerHTML = `<i class='bx bx-category'></i> <span>${genre}</span>`;
      listItem.appendChild(link);
      exploreGenresList.appendChild(listItem);
  });

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
});