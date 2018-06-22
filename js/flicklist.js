

var model = {
  watchlistItems: [],
  browseItems: [],
  delbrowseItems: []
}


var api = {
  root: "https://api.themoviedb.org/3",
  token: "594c9d612a37f337374ab16d226b9f0c"
}


/**
 * Makes an AJAX request to themoviedb.org, asking for some movies
 * if successful, updates the model.browseItems appropriately, and then invokes
 * the callback function that was passed in
 */
function discoverMovies(callback) {
	$.ajax({
		url: api.root + "/discover/movie",
		data: {
			api_key: api.token,
		},
		success: function(response) {
			console.log("We got a response from The Movie DB!");
			console.log(response);
			
			// update the model, setting its .browseItems property equal to the movies we recieved in the response
      model.browseItems = response.results;
			
			// invoke the callback function that was passed in. 
			callback();
		}
	});
  
}


/**
 * re-renders the page with new content, based on the current state of the model
 */
function render() {
  // clear everything from both lists
  $("#section-watchlist ul").empty();
  $("#section-browse ul").empty();
  
  // for each movie on the user's watchlist, insert a list item into the <ul> in the watchlist section
  model.watchlistItems.forEach(function(movie) {
    let para = $("<p></p>").text(movie.title);
    let listitem = $("<li></li>").append(para);
    $("#section-watchlist ul").append(listitem);
  });
  
  // remove movie on the current browse list that appears in watchlist
  model.delbrowseItems.forEach(function(toDelMovie) {
    model.browseItems = model.browseItems.filter(function(movie) {
      return movie.title != toDelMovie.title;
    });
  });

  // for each movie on the current browse list, 
  model.browseItems.forEach(function(movie) {
		// insert a list item into the <ul> in the browse section
    let para = $("<p></p>").text(movie.title);
    let listitem = $("<li></li>").append(para);
    $("#section-browse ul").append(listitem);
		
		// the list item should include a button that says "Add to Watchlist"
    let button = $("<button></button>").text("Add to watchlist");
    $("#section-browse ul").append(button);
		
		// when the button is clicked, this movie should be added to the model's watchlist and render() should be called again
    button.click(function() {
      model.watchlistItems.push(movie);
      model.delbrowseItems.push(movie);
      render();
    });
  });
  
}


// When the HTML document is ready, we call the discoverMovies function,
// and pass the render function as its callback
$(document).ready(function() {
  discoverMovies(render);
});

