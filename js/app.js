/*
CRUD - Create, Read, Update, and Delete
HTTP Methods: POST (typically require body data),
              GET,
              PUT (updates full object)/PATCH(updates object property),
              DELETE
*/

(function() {
    "use strict";

    const movieModule = function() {
      const apiKey = '65c712aceab67107956c481221a93060';
      const searchForm = document.querySelector('.search-form');
      let token, sessionID;

      // class constructor for movie details
      class MovieDetails {
        // sets properties for new MovieDetails instance
        constructor(movieObj) {
          this.image = `https://image.tmdb.org/t/p/w185_and_h278_bestv2/${movieObj.poster_path}`;
          this.movieId = movieObj.id;
          this.overview = movieObj.overview;
          this.title = movieObj.title;
          this.build();
        }

        // building a Handlebars template to display movie data on page
        build() {
          // grab string of html
          const source = $('#movie-template').html();
          // turns the html string into a Handlebars function
          const template = Handlebars.compile(source);
          // object that contains the keys we are using to build the template
          const context = {
            image: this.image,
            title: this.title,
            overview: this.overview,
            movieId: this.movieId
          };
          // passing our context object into the Handlebars template function
          const html = template(context);

          // prepend/append have a parent -> child relationship: parent.append(child)
          // prependTo/appendTo have a child -> parent relationship: child.appendTo(parent)
          $('.content').prepend(html);
        }
      }

      // binding event listeners
      function bindEvents() {
        searchForm.addEventListener('submit', () => {
          event.preventDefault();
          const searchValue = event.target[0].value;
          getSearchResults(searchValue);

          searchForm.reset();
        });

        // using jQuery so we have access to event delegation which provides access the .related-search-link that does not exist on initial page load
        // not using fat arrow so we don't shift scope.  we want the immediate scope of what we clicked.
        $('.content').on('click', '.related-search-link', function() {
          const id = $(this).attr('data-id');
          // fetching related movie data based on the current movie id
          getRelatedMovies(id);
        });

        $('.content').on('click', '.close', function() {
          $(this).parents('.movie-container').slideUp('fast', function() {
            this.remove(); // here this is referring to .movie-container since we selected that with the parents() method
          });
        });

        $('.content').on('change', '.movie-rating', function() {
          if ($(this).val()) { // only execute if .movie-rating has a value
            const rating = $(this).val(); // event.target[0].value
            const movieID = $(this).attr('data-id');

            if (rating === 'delete') {
              deleteRating(movieID);
            } else {
              rateMovie(rating, movieID);
            }
          }
        });
      }

      // clearing content container html
      function clearContent() {
        $('.content').html('');
      }

      // creating session for making POST requests to tmdb
      // promise chaining because we need each piece of data before we get the next piece (know this from API documentation)
      function createSession() {
        // Request access token
        $.get(`https://api.themoviedb.org/3/authentication/token/new?api_key=${apiKey}`)
          .then((data) => {
            token = data.request_token;
            // console.log(token);

            // Log in to verify token
            return $.get(`https://api.themoviedb.org/3/authentication/token/validate_with_login?api_key=65c712aceab67107956c481221a93060&username=nbryant&password=ZWWoizWi99&request_token=${token}`)
          }).then(() => {
            // Create session
            return $.get(`https://api.themoviedb.org/3/authentication/session/new?api_key=${apiKey}&request_token=${token}`)
          }).then((data) => {
            sessionID = data.session_id;
            // console.log(apiKey, token, sessionID);
          });
      }

      // deletes rating for movie
      function deleteRating(movieID) {
        $.ajax({
          method: 'DELETE',
          url: `https://api.themoviedb.org/3/movie/${movieID}/rating?api_key=${apiKey}&session_id=${sessionID}`,
          header: {
            "content-type": "application/json;charset=utf-8"
          }
        }).then((response) => {
          // inform user their delete was successful
          $('<p>').text('Movie rating deleted successfully').css({
            position: 'absolute',
            background: 'rgba(0,200,0,.75)',
            width: '100%',
            padding: '1rem',
            color: '#fff',
            top: 0,
            left: 0,
            textAlign: 'center'
          }).appendTo('body').fadeOut(3000, function() {
            this.remove();
          });
          console.log(response);
        }).catch((error) => {
          console.log(error);
        });
      }

      // gets related movie data
      function getRelatedMovies(id) {
        $.get(`https://api.themoviedb.org/3/movie/${id}/similar?api_key=${apiKey}`)
          .then((response) => {
            // only grabbing the first five results
            let topRelated = response.results.splice(0, 5);
            clearContent();

            // creating a new MovieDetails instance and building to page for each topRelated result
            for (let index = 0; index < topRelated.length; index++) {
              new MovieDetails(topRelated[index]);
              getUserRating(topRelated[index].id);
            }
          });
      }

      // call for data from tmdb
      function getSearchResults(query) {
        query = encodeURIComponent(query);
        $.get(`https://api.themoviedb.org/3/search/movie?query=${query}&api_key=${apiKey}`)
          .then((response) => { // you can do line breaks for the .then()
            clearContent();
            console.log(response.results[0]);
            new MovieDetails(response.results[0]); // grabbing first movie from our search request and using its data to create a new MovieDetails instance
            getUserRating(response.results[0].id);
          }).catch((error) => {
            console.log(error);
          });
      }

      // get a user's rating for a movie
      function getUserRating(movieID) {
        $.get(`https://api.themoviedb.org/3/movie/${movieID}/account_states?api_key=${apiKey}&session_id=${sessionID}`)
          .then((response) => {
            console.log(response);
            $(`.movie-rating[data-id=${movieID}]`).val(response.rated.value); // setting the value for the select menu matching the movie id to what we have rated the movie
          }).catch((error) => {
            console.log(error);
          });
      }

      // makes a POST to send rate value for movie
      function rateMovie(rating, movieID) {
        const settings = {
          method: 'POST', // from API docs
          url: `https://api.themoviedb.org/3/movie/${movieID}/rating?api_key=${apiKey}&session_id=${sessionID}`,
          headers: {
            "content-type": "application/json;charset=utf-8"
          },
          data: JSON.stringify({ "value": rating })
        };

        $.ajax(settings).then((response) => {
          // give user a message confirming their rating
          $('<p>').text('Movie rated successfully').css({
            position: 'absolute',
            background: 'rgba(0,200,0,.75)',
            width: '100%',
            padding: '1rem',
            color: '#fff',
            top: 0,
            left: 0,
            textAlign: 'center'
          }).appendTo('body').fadeOut(3000, function() {
            this.remove();
          });
          console.log(response);
        }).catch((error) => {
          console.log(error);
        });
      }

      // initialize with event listener binding
      function init() {
        bindEvents();
        createSession();
      }

      return {
        init: init
      };
    };

    const movieApp = movieModule();
    movieApp.init();
})();
