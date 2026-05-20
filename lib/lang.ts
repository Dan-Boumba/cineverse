export type Lang = "en" | "fr";

export const TMDB_LOCALE: Record<Lang, string> = {
  en: "en-US",
  fr: "fr-FR",
};

export const t: Record<Lang, Record<string, string>> = {
  en: {
    // Navbar
    home:      "Home",
    movies:    "Movies",
    series:    "Series",
    streaming: "Streaming",
    genres:    "Genres",
    search_placeholder: "Search movies & series...",

    // Homepage sections
    trending_movies:  "Trending Movies",
    trending_series:  "Trending Series",
    now_playing:      "Now Playing",
    popular_series:   "Popular Series",
    on_netflix:       "On Netflix",
    on_prime:         "On Prime Video",
    on_disney:        "On Disney+",
    popular_movies:   "Popular Movies",
    top_rated_series: "Top Rated Series",
    top_rated_movies: "Top Rated Movies",
    upcoming:         "Upcoming",
    nollywood:        "Nollywood",

    // Hero
    more_info: "More Info",

    // Movies page
    movies_title:   "Movies",
    movies_subtitle: "Sort, filter by genre and year — find exactly what you want.",

    // Series page
    series_title:    "Series",
    series_subtitle: "Explore TV shows and series from around the world.",

    // Streaming page
    streaming_title:    "Streaming",
    streaming_subtitle: "Browse movies available on your favorite platforms.",

    // Genres page
    genres_title:    "Genres",
    genres_subtitle: "Pick a genre and explore movies that match your mood.",

    // Sort options
    sort_popular:     "Popular",
    sort_trending:    "Trending",
    sort_top_rated:   "Top Rated",
    sort_now_playing: "Now Playing",
    sort_upcoming:    "Upcoming",
    sort_on_the_air:  "On The Air",

    // Filters
    all_years:     "All years",
    filtering_by:  "Filtering by:",
    load_more:     "Load more",
    loading:       "Loading...",
    no_results:    "No results found for this combination.",

    // Detail page
    director:  "Director",
    language:  "Language",
    network:   "Network",
    seasons:   "season",
    seasons_p: "seasons",
    episodes:  "episodes",
    where_to_watch:  "Where to Watch",
    stream:    "Stream",
    rent:      "Rent",
    view_all_justwatch: "View all options on JustWatch →",
    cast:      "Cast",
    trailer:   "Trailer",
    similar_movies: "Similar Movies",
    similar_series: "Similar Series",

    // Search
    see_all_results: "See all results for",
    results_found:   "results found",
    search_title:    "Search Movies & Series",
    search_hint:     "Use the search bar at the top to find movies and series.",
    no_movies_found: "No results found for",

    // Footer
    footer:          "Powered by TMDB",
    footer_tagline:  "Discover movies, TV series, trailers and where to watch them legally.",
    footer_browse:   "Browse",
    footer_legal:    "Legal",
    footer_social:   "Follow Us",
    footer_privacy:  "Privacy Policy",
    footer_terms:    "Terms of Use",
    footer_contact:  "Contact",
  },
  fr: {
    // Navbar
    home:      "Accueil",
    movies:    "Films",
    series:    "Séries",
    streaming: "Streaming",
    genres:    "Genres",
    search_placeholder: "Rechercher films & séries...",

    // Homepage sections
    trending_movies:  "Films tendance",
    trending_series:  "Séries tendance",
    now_playing:      "En ce moment",
    popular_series:   "Séries populaires",
    on_netflix:       "Sur Netflix",
    on_prime:         "Sur Prime Video",
    on_disney:        "Sur Disney+",
    popular_movies:   "Films populaires",
    top_rated_series: "Séries les mieux notées",
    top_rated_movies: "Films les mieux notés",
    upcoming:         "Prochainement",
    nollywood:        "Nollywood",

    // Hero
    more_info: "En savoir plus",

    // Movies page
    movies_title:    "Films",
    movies_subtitle: "Trier, filtrer par genre et année — trouvez exactement ce que vous cherchez.",

    // Series page
    series_title:    "Séries",
    series_subtitle: "Explorez les séries TV du monde entier.",

    // Streaming page
    streaming_title:    "Streaming",
    streaming_subtitle: "Parcourez les films disponibles sur vos plateformes préférées.",

    // Genres page
    genres_title:    "Genres",
    genres_subtitle: "Choisissez un genre et explorez les films qui correspondent à votre humeur.",

    // Sort options
    sort_popular:     "Populaire",
    sort_trending:    "Tendances",
    sort_top_rated:   "Mieux notés",
    sort_now_playing: "En salle",
    sort_upcoming:    "À venir",
    sort_on_the_air:  "En cours",

    // Filters
    all_years:     "Toutes les années",
    filtering_by:  "Filtrer par :",
    load_more:     "Charger plus",
    loading:       "Chargement...",
    no_results:    "Aucun résultat pour cette combinaison.",

    // Detail page
    director:  "Réalisateur",
    language:  "Langue",
    network:   "Chaîne",
    seasons:   "saison",
    seasons_p: "saisons",
    episodes:  "épisodes",
    where_to_watch:  "Où regarder",
    stream:    "Streaming",
    rent:      "Location",
    view_all_justwatch: "Voir toutes les options sur JustWatch →",
    cast:      "Casting",
    trailer:   "Bande-annonce",
    similar_movies: "Films similaires",
    similar_series: "Séries similaires",

    // Search
    see_all_results: "Voir tous les résultats pour",
    results_found:   "résultats trouvés",
    search_title:    "Rechercher Films & Séries",
    search_hint:     "Utilisez la barre de recherche pour trouver des films et séries.",
    no_movies_found: "Aucun résultat pour",

    // Footer
    footer:          "Propulsé par TMDB",
    footer_tagline:  "Découvrez films, séries TV, bandes-annonces et où les regarder légalement.",
    footer_browse:   "Explorer",
    footer_legal:    "Légal",
    footer_social:   "Nous suivre",
    footer_privacy:  "Politique de confidentialité",
    footer_terms:    "Conditions d'utilisation",
    footer_contact:  "Contact",
  },
};
