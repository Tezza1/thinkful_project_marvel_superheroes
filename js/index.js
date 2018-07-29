let superhero_character = "";

// obtain data from clicked button
function superHeroSearch() {
  $(".js-superhero-search").click(
    function(){
      superhero_character = $('.superhero-search').val();
      getComicData();
      getMovieData();
      findYouTubeVideos()
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
            // console.log(search_results);
            // console.log(search_results.responseJSON.data.results);
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
    $('.character-pic').html(`<img src="${COMIC_PATH[0].thumbnail.path}.jpg" alt="" class="character-pic"/>`);
    
    // show links in a list
    let character_links = "";
    for (let i = 0; i < COMIC_PATH[0].urls.length; i++) {
        character_links += `<div class="ext-button"><a href='${COMIC_PATH[0].urls[i].url}' target="_blank" class="external-link">${COMIC_PATH[0].urls[i].type} <i class="fas fa-external-link-alt"></i></a></div>`
    }
    $('.character-links').html(character_links);
    
    // show stories in a list
    let comic_stories = "";
    for (let i = 0; i < COMIC_PATH[0].stories.items.length; i++){
        comic_stories += `<div><i class="fas fa-square"></i> ${COMIC_PATH[0].series.items[i].name}</div>`
    }
    $('.display-comic-results').html(comic_stories);
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
            // console.log(search_results);
            // console.log(search_results.responseJSON.results);
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
            movieData += `
                <div class="col-6">        
                    <h3>${search_results[i].title}</h3>
                    <p class="extended-paragraph">${search_results[i].overview}<p>
                    <p>${search_results[i].release_date}</p>
                    <img class="left-pic" src="https://image.tmdb.org/t/p/w500/${search_results[i].backdrop_path}" alt=""/>
                </div>
                <div class="col-6">
                    <img class="right-pic" src="https://image.tmdb.org/t/p/w500/${search_results[i].poster_path}" alt=""/>
                </div>
                <div class="col-12 row-breaker"></div>
            `;            
        }
        display_data = false;
    }
    $('.display-movies-results').html(movieData);
}

function findYouTubeVideos() {

    const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';
    const API_KEY = "AIzaSyDEwfk3b9G0Oap6N7GHBeDHPzhnXxxr5hM";

    const settings = {
        url: YOUTUBE_SEARCH_URL,
        data: {
            part: 'snippet',
            key: API_KEY,
            channelId: 'UCvC4D8onUfXzvjTOM-dBfEA',
            q: `${superhero_character} in:name`,
            per_page: 5
        },
        dataType: 'json',
        type: 'GET',
        success: function() {
            renderYouTubeData(search_results);
        },
        error: function() {
            console.log("An error occurred");
        }
    };

    let search_results = $.ajax(settings);
}

function renderYouTubeData(search_results) {
    let result_arr = search_results.responseJSON.items;
    let resultString = "";
    result_arr.map(result => {
        resultString += `
            <div class="col-6">
                <h4>${result.snippet.title}</h4>
                <p>${result.snippet.description}</p>
            </div>
            <div class="col-6">
                <iframe src="https://www.youtube.com/embed/${result.id.videoId}" allow="autoplay; encrypted-media" width="350" height="200" frameborder="0" allowFullScreen></iframe>
            </div>
            <div class="col-12 row-breaker"></div>`;
    });
    $('.display-trailer').html(resultString);
} 


$(superHeroSearch)