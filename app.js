var state = {
	totalPages: 0,
	currentPage: 1, 
	resultSet: 0,
	resultAmount:0,
	currentPosition: 0,
	url_meetup: "https://api.meetup.com/find/groups",
	numberResults: function(){
		return this.currentPosition + 10 < this.resultAmount ? this.currentPosition + 10 : this.resultAmount;
	}
};

$(document).ready(function(){
$('#js-search-form').submit(function(event){
		event.preventDefault();
		var result = $('.query').val();
		$('.js-prev').removeClass('hide');
		$('.js-next').removeClass('hide');
		if( result.length == 5){
			console.log(result);
			state.resultSet = 0;
			searchMeetup(result, displayMeetup);
		} else {
			$('.js-results').append('<h2>There are no results in your area</h2>');
		}


	});
});


function searchMeetup(search, callback){
	var params ={
	 	sign: true,
	 	key: '4d1e9275292c52331d2e706c4555',
	 	zip: search,
	 	text: 'basketball'
	 	//page: 10

	 };

	$.ajax({ 
		type: "GET", 
		crossdomain: true, 
		data: params,
		dataType: 'JSONP',
		headers: {"Access-Control-Allow-Origin": "*"}, 
		url: state.url_meetup,
		success: callback, 
		error: function(data){
			console.log('failure');
		}
	}); 
} 

// displayMeetup(state.Resultset)

function displayMeetup(data){
	var searchResults = data.data;
	
	if(!state.resultSet){
		 state.resultSet = data;
		 state.resultAmount = searchResults.length;
		var totalPages = searchResults.length % 10 == 0 ? searchResults.length / 10 : (searchResults.length / 10) + 1;
	 state.totalPages = totalPages;
	}
	var numResults = state.numberResults();
	var counter = state.currentPosition;
	 //console.log(typeof numResults);
	 //console.log(numResults);
	// console.log(data);
	 //console.log(counter);
	 //console.log(searchResults.length);
	 console.log(state.resultSet);
	$('.js-results').html('<h2 class="title">Here are the Top 10 Groups in your area</h2>');
	console.log(numResults,"numResults");
	console.log(state.currentPosition, "Current Position");
	for(var i = state.currentPosition; i < numResults; i++){
			$('.js-results').append(
			 "<div class='meetup'><h2>"+
			 searchResults[i].name +
			 "</h2><p>"+
			 searchResults[i].description+
			 "</p><p>"+searchResults[i].city+
			 "</p><input type='hidden' value='"+
			 searchResults[i].lon+
			 "' class='longitude'><input type='hidden' value='"+
			 searchResults[i].lat+
			 "' class='latitude'></div>");
			counter++;
			
	}
	state.currentPosition = counter; 
	console.log(state.currentPosition);
	
} 

$('.js-results').on('click','.meetup', function(e){
		console.log($(this).find('.longitude').val());
		console.log($(this).find('.latitude').val());
		var lng1= $(this).find('.longitude').val();
		var lat1= $(this).find('.latitude').val();
		placepointGoogle(lng1,lat1);
	});

$('.js-next').on("click", ".next", function(e){
	e.preventDefault();
	console.log(state.currentPage);
	console.log(state.totalPages);
	//console.log(state.resultSet);
	if(state.totalPages != state.currentPage){
		state.currentPage++;
		displayMeetup(state.resultSet);
	}
});

$('.js-prev').on("click",".prev", function(e){
	e.preventDefault();
	console.log("prev called");
	if(state.currentPage != 1){
		state.currentPage--;
		if(state.resultAmount == state.numberResults()){
			var remainder = state.resultAmount % 10;
			state.currentPosition = state.currentPosition - (10 + remainder);

		} else{
			state.currentPosition = state.currentPosition - 10; 
		}
		displayMeetup(state.resultSet);

	}
});

function placepointGoogle(longitude,latitude){

	if(longitude && latitude){
		$('#map').removeClass('hide');
			var uluru = {lat: Number(latitude), lng:Number(longitude)};
			var map = new google.maps.Map(document.getElementById('map'),{
			zoom: 10,
			center:uluru
		});
		var marker = new google.maps.Marker({
          position: uluru,
          map: map
        });
	} else {
		$('#map').append('<h2>Sorry I cannot find the location</h2>');
	}
		
		
}
