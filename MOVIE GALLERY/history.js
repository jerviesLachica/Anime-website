document.addEventListener('DOMContentLoaded', () => {
    const historyAnimeList = document.getElementById('historyAnimeList');
    const allAnime = animeData;

    function getWatchHistory() {
        const history = localStorage.getItem('watchHistory');
        console.log("Raw history from localStorage:", history);
        const parsedHistory = history ? JSON.parse(history) : [];
        console.log("Parsed history:", parsedHistory);
        return parsedHistory;
    }

    function displayHistory() {
        const history = getWatchHistory();
        historyAnimeList.innerHTML = '';

        if (history.length === 0) {
            historyAnimeList.innerHTML = '<p>No watch history found.</p>';
            return;
        }

        history.forEach(animeId => {
            const anime = allAnime[animeId];
            console.log(`Processing animeId: ${animeId}`, anime);
            if (anime) {
                const animeCard = `
                    <div class="anime-card">
                        <a href="anime.html?id=${animeId}" class="anime-card-link">
                            <div class="anime-image-container">
                                <img src="${anime.image}" alt="${anime.title}" class="anime-img">
                                <div class="episode-badge">Ep ${anime.episodes.length}</div>
                            </div>
                            <p class="anime-title">${anime.title}</p>
                        </a>
                    </div>
                `;
                historyAnimeList.innerHTML += animeCard;
            } else {
                console.warn(`Anime with ID ${animeId} not found in animeData.`);
            }
        });
    }

    displayHistory();
});