document.addEventListener("DOMContentLoaded", postLoad);

let searchBar;
let searchBarLabel;
let genreSelector;
let allShows;
let filteredShows;
let genres;
let genreDictionary = {};

function postLoad()
{
    searchBar = document.querySelector("#search-bar");
    searchBarLabel = document.querySelector("label[for=search]");
    genreSelector = document.querySelector(".genre-selector")

    fetch("https://api.tvmaze.com/shows")
    .then(parseJSON)
    .then(setAllShows)
    .then(displayShows);

    searchBar.addEventListener("input", filterMovies);
    searchBar.addEventListener("focus", addShrinkClass);
    searchBar.addEventListener("blur", removeShrinkClass);
    genreSelector.addEventListener("change", filterByGenre);
}

function filterByGenre(event)
{
    console.log(event.target.value);

    removeCards();

    filteredShows.some(show => genres.includes(show))
}

function filterMovies(event)
{
    removeCards();

    filteredShows = allShows.filter(show => show.name.toLowerCase().includes(event.target.value.toLowerCase()));
    if (filteredShows.length === 0) { genres = [] }
    
    genreDictionary = {};
    displayShows(filteredShows);
}

function removeCards()
{
    const cards = Array.from(document.querySelectorAll(".card"));
    cards.forEach(card => card.remove());
}

function setGenreSelectors()
{
    const previousSelectors = Array.from(genreSelector.querySelectorAll("option"));
    const previouslyAddedSelectors = previousSelectors.filter(selector => selector.value.length > 0);
    previouslyAddedSelectors.forEach(selector => selector.remove());

    genres.forEach(createGenreSelectors);
}

function createGenreSelectors(genre)
{
    const selector = document.createElement("option");
    selector.classList.add("genre-option");
    selector.value = genre;
    selector.innerText = genre;

    genreSelector.append(selector);
}

function addShrinkClass()
{
    console.log("shrink")
    searchBarLabel.classList.remove("shrink-uncolored");
    searchBarLabel.classList.add("shrink-colored");
}

function removeShrinkClass()
{
    if (!searchBar.value)
    {
        console.log("unshrink no value")
        searchBarLabel.classList.remove("shrink-colored");
        searchBarLabel.classList.remove("shrink-uncolored");
    }
    else
    {
        console.log("unshrink value")
        searchBarLabel.classList.remove("shrink-colored");
        searchBarLabel.classList.add("shrink-uncolored");
    }
}

function setAllShows(shows)
{
    allShows = shows;

    return shows;
}

function displayShows(shows)
{
    const cardsContainer = document.querySelector(".cards-container");

    shows.forEach(show => createShowCard(show, cardsContainer));
}

function createShowCard(show, cardsContainer)
{
    show.genres.forEach(genre => genreDictionary[genre] = true);
    genres = Object.keys(genreDictionary);
    setGenreSelectors();

    const card = document.createElement("div");
    card.classList.add("card");

    const image = document.createElement("img");
    image.classList.add("show-image")
    image.src = show.image.medium;

    const movieInfo = document.createElement("div");
    movieInfo.classList.add("movie-info");

    const name = document.createElement("p");
    name.classList.add("movie-title");
    name.innerText = show.name;

    const year = document.createElement("p");
    year.innerText = "Premiered " + show.premiered.slice(0, 4);

    const runtime = document.createElement("p");
    runtime.innerText = "Runtime " + show.runtime + " mins";

    const officialSite = document.createElement("p");
    officialSite.innerText = "Official Site";
    const link = document.createElement("a")
    link.href = show.officialSite;

    officialSite.append(link);
    movieInfo.append(name, year, runtime, officialSite);
    card.append(image, movieInfo);
    cardsContainer.append(card);

    card.addEventListener("click", () => showInfo(movieInfo));
}

function showInfo(movieInfo)
{   
    if (!movieInfo.classList.contains("shown"))
    {
        movieInfo.classList.add("shown");
    }
    else
    {
        movieInfo.classList.remove("shown");
    }
}

function parseJSON(response)
{
    return response.json();
}