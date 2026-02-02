# Project Plan: Data-Driven Anime Site

This document outlines the plan to refactor the anime website to be more dynamic, maintainable, and scalable.

## The Goal

The primary goal is to move away from a system of static, individual HTML files for each anime and adopt a data-driven approach. This will centralize anime data, making the site easier to update and manage.

## The Plan

The new architecture will consist of three core components:

1.  **Centralized Data (`anime-data.js`):** A single JavaScript file will act as a mini-database, holding all information for all anime series. This includes titles, poster images, detailed descriptions, and a list of episodes with their own titles, video files, and thumbnails.

    **Example Data Structure:**
    ```javascript
    const animeData = {
      "assassination-classroom": {
        title: "Assassination Classroom",
        image: "assassin.jpg",
        description: "A powerful creature claims that within a year, Earth will be destroyed by him... but he offers mankind a chance to avert this fate by teaching a class of misfits how to assassinate him.",
        episodes: [
          { title: "01. Assassination Time", file: "ep1.mp4", thumbnail: "thumbnail1.jpg" },
          { title: "02. Baseball Time", file: "ep2.mp4", thumbnail: "thumbnail2.jpg" }
          // ... more episodes
        ]
      },
      // ... more anime entries
    };
    ```

2.  **A Reusable Anime Page Template (`anime.html`):** A single, generic `anime.html` page will serve as a template for displaying any anime. This page will contain placeholder elements for the title, description, video player, and episode playlist.

3.  **Dynamic Content Loading (`anime.js`):** A new JavaScript file, `anime.js`, will be created for the `anime.html` page. Its responsibilities will be:
    *   To read an anime identifier from the page's URL (e.g., `anime.html?id=assassination-classroom`).
    *   To use this identifier to find the correct anime's data in `anime-data.js`.
    *   To dynamically populate the `anime.html` template with the fetched data, building the complete page for the user.

## Visual Architecture

This diagram illustrates the data flow in the new system:

```mermaid
graph TD
    subgraph "User's Browser"
        A[Main.html] -->|User clicks an anime| B(anime.html?id=anime-name)
    end

    subgraph "Website Data"
        C[anime-data.js <br> (Contains title, image, <b>description</b>, episodes)]
    end

    subgraph "Website Logic"
        D[Main.js] -->|Reads data from| C
        D -->|Generates anime list on| A

        E[anime.js] -->|Reads data from| C
        E -->|Gets 'id' from URL of| B
        E -->|Builds the anime details (including description) and playlist on| B
    end

    A -- "Uses" --> D
    B -- "Uses" --> E
```

## Summary of Changes

*   **Create `anime-data.js`:** To store all anime information.
*   **Create `anime.html`:** A new template to display any anime.
*   **Create `anime.js`:** A new script to power the `anime.html` page.
*   **Update `Main.html` and `Main.js`:** To load the anime list dynamically from `anime-data.js`.
*   **Delete old anime files:** Remove `test.html`, `test2.html`, `onepiece.html`, etc., as they will become obsolete.