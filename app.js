//Execute a web page for movie search. 
//When opening the page, a user can only see an input form for putting in the name (or part of the name) and choosing the type (movie, series, episode).



    document.getElementById('searchForm').addEventListener('submit', function(event) {
      event.preventDefault(); 

      
      var movieName = document.getElementById('movieNameInput').value;
      var type = document.getElementById('typeSelect').value;

      
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            if (response.Response === 'True') {
              displayMovies(response.Search);
              displayPagination(response.totalResults, movieName, type);
            } else {
              displayErrorMessage(response.Error);
            }
          } else {
            displayErrorMessage('Error: ' + xhr.status);
          }
        }
      };
      var url = 'https://www.omdbapi.com/?apikey=7cb44ccd&s=' + encodeURIComponent(movieName) + '&type=' + type;
      xhr.open('GET', url);
      xhr.send();
    });

    
    function displayMovies(movies) {
      var movieList = document.getElementById('movieList');
      movieList.innerHTML = '';

      for (var i = 0; i < movies.length; i++) {
        var movie = movies[i];

       
        var card = document.createElement('div');
        card.className = 'movie-card';

      
        card.innerHTML = '<h2>' + movie.Title + '</h2>' +
                         '<p>Type: ' + movie.Type + '</p>' +
                         '<p>Year: ' + movie.Year + '</p>' +
                         '<button class="details-btn" data-imdb-id="' + movie.imdbID + '">Details</button>';

        movieList.appendChild(card);
      }
    }

   
    function displayPagination(totalResults, movieName, type) {
      var pagination = document.getElementById('pagination');
      pagination.innerHTML = '';

      var totalPages = Math.ceil(totalResults / 10);
      for (var i = 1; i <= totalPages; i++) {
        var pageBtn = document.createElement('button');
        pageBtn.innerText = i;
        pageBtn.className = 'page-btn';
        pageBtn.setAttribute('data-page', i);
        pageBtn.addEventListener('click', function() {
          var page = this.getAttribute('data-page');
          searchMovies(movieName, type, page);
        });
        pagination.appendChild(pageBtn);
      }
    }

    
    function searchMovies(movieName, type, page) {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            if (response.Response === 'True') {
              displayMovies(response.Search);
            } else {
              displayErrorMessage(response.Error);
            }
          } else {
            displayErrorMessage('Error: ' + xhr.status);
          }
        }
      };
      var url = 'https://www.omdbapi.com/?apikey=7cb44ccd&s=' + encodeURIComponent(movieName) + '&type=' + type + '&page=' + page;
      xhr.open('GET', url);
      xhr.send();
    }

    
    function displayMovieDetails(imdbID) {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status === 200) {
            var movie = JSON.parse(xhr.responseText);

            var movieDetails = document.getElementById('movieDetails');
            movieDetails.innerHTML = '';

            
            var detailsDiv = document.createElement('div');
            detailsDiv.innerHTML = '<h2>' + movie.Title + '</h2>' +
                                   '<p>Year: ' + movie.Year + '</p>' +
                                   '<p>Rated: ' + movie.Rated + '</p>' +
                                   '<p>Released: ' + movie.Released + '</p>' +
                                   '<p>Plot: ' + movie.Plot + '</p>';

            movieDetails.appendChild(detailsDiv);
          } else {
            displayErrorMessage('Error: ' + xhr.status);
          }
        }
      };
      var url = 'https://www.omdbapi.com/?apikey=7cb44ccd&i=' + imdbID;
      xhr.open('GET', url);
      xhr.send();
    }

    
    document.addEventListener('click', function(event) {
      if (event.target.classList.contains('details-btn')) {
        var imdbID = event.target.getAttribute('data-imdb-id');
        displayMovieDetails(imdbID);
      }
    });

 
    function displayErrorMessage(message) {
      var movieList = document.getElementById('movieList');
      movieList.innerHTML = '<p>' + message + '</p>';
    }