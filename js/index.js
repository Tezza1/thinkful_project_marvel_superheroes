let superhero_character = "";

// obtain data from clicked button
function superHeroSearch() {
  $(".js-superhero-search").click(
    function(){
      superhero_character = $('.superhero-search').val();
      getComicData();
      getMovieData();
  });  
}

// AJAX call for comic data 
function getComicData(){
    const MARVEL_API = 'https://gateway.marvel.com/v1/public/characters';
    const MARVEL_API_KEY = 'eae11ee652ce971f01cb2326df131052';

    const settings = {
        url: MARVEL_API,
        data: {
            apikey: MARVEL_API_KEY,
            name: superhero_character
        },
        dataType: 'json',
        type: 'GET',
        success: function() {
            console.log(search_results);
            console.log(search_results.responseJSON.data.results);
            renderComicData(search_results);
        },
        error: function() {
            console.log("An error occurred");
        }
    };
    let search_results = $.ajax(settings);
}

// render comic data to the page
function renderComicData(search_results) {
    const COMIC_PATH = search_results.responseJSON.data.results;
    $('.character-name').html(`${COMIC_PATH[0].name}`);
    $('.character-description').html(`${COMIC_PATH[0].description}`);
    $('.character-pic').html(`<img src="${COMIC_PATH[0].thumbnail.path}.jpg" alt="" />}`);
    
    // show links in a list
    let character_links = "";
    for (let i = 0; i < COMIC_PATH[0].urls.length; i++) {
        character_links += `<li><a href='${COMIC_PATH[0].urls[i].url}' target="_blank">${COMIC_PATH[0].urls[i].type}</a></li>`
    }
    $('.character-links ul').html(character_links);
    
    // show stories in a list
    let comic_stories = "";
    for (let i = 0; i < COMIC_PATH[0].stories.items.length; i++){
        comic_stories += `<li>${COMIC_PATH[0].series.items[i].name}</li>`
    }
    $('.display-comic-results ul').html(comic_stories);
}

// AJAX call for movie data
function getMovieData() {
    // const MOVIEDB_SEARCH_URL = 'https://api.themoviedb.org/3/genre/movie/list'; --> provides list of genres
    const MOVIEDB_SEARCH_URL = 'https://api.themoviedb.org/3/search/movie';
    const API_KEY = "efa46005a613a0a668c5a2f370d598e6";

    const settings = {
        url: MOVIEDB_SEARCH_URL,
        data: {
            api_key: API_KEY,
            query: superhero_character,
            with_genres: 878
        },
        dataType: 'json',
        type: 'GET',
        success: function() {
            console.log(search_results);
            console.log(search_results.responseJSON.results);
            renderMovieData(search_results.responseJSON.results);
        },
        error: function() {
            console.log("An error occurred");
        }
    };

    let search_results = $.ajax(settings);
}

function renderMovieData(search_results) {
    let movieData ="";
    let display_data = false;
    for (let i = 0; i < search_results.length; i++) {
        for (let j = 0; j < search_results[i].genre_ids.length; j++){
            if ((search_results[i].genre_ids[j] === 878 || search_results[i].genre_ids[j] === 14)&& search_results[i].original_language === "en") {
                display_data = true;        
            }
        }
        if (display_data) {
            movieData += `<ul>
                <li><h3>${search_results[i].title}</h3></li>
                <li>${search_results[i].overview}</li>
                <li>${search_results[i].release_date}</li>
                <li><img class="movie_pic" src="https://image.tmdb.org/t/p/w500/${search_results[i].backdrop_path}" alt=""/></li>
                <li><img class="movie_pic" src="https://image.tmdb.org/t/p/w500/${search_results[i].poster_path}" alt=""/></li>
            </ul>`;            
        }
        display_data = false;
    }
    $('.display-movies-results').html(movieData);
}

$(superHeroSearch)