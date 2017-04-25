var state = {
	totalPages: 0,
	currentPage: 1, 
	resultSet: 0,
	resultLength:0,
	recordsPerPage: 10,
	currentPosition: 0,
	url_meetup: "https://api.meetup.com/find/groups",
	numberResults: function(){
		var remainder = this.resultLength % this.recordsPerPage;
		return this.currentPosition + remainder < this.resultLength ? this.currentPage * this.recordsPerPage : this.resultLength;
			
	}
};

$(document).ready(function(){
$('#js-search-form').submit(function(event){
		event.preventDefault();
		var result = $('.query').val();
		console.log(result);
		
		if( result.length == 5 && result != null){
			$('.js-next').removeClass('hide');
			state.resultSet = 0;
			state.currentPage = 1;
			state.currentPosition = 0;
			state.totalPages = 0;
			state.resultLength = 0;
			searchMeetup(result, displayMeetup);
		} else {
			$('.js-results').append('<h2 class ="container">There are no results in your area or you did not enter a Zip Code</h2>');
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


function displayMeetup(data){
	console.log(data);
	var searchResults = data.data;
	if(state.resultSet == 0){
		state.resultSet = data;
		state.resultLength = searchResults.length;
		var totalPages = 0;
		if(searchResults.length % state.recordsPerPage == 0){
			 totalPages =  searchResults.length / state.recordsPerPage; 
		} else {
			totalPages = (searchResults.length / state.recordsPerPage) + 1;
		}
		state.totalPages = Math.floor(totalPages);
 		
	}
	
    
	var numResults = state.numberResults();
	
	$('.js-results').html('<h2 class="title">Here are the '+state.resultLength+' Groups in your area</h2>');


	for(var i = state.currentPosition; i < numResults; i++){
			
			$('.js-results').append(
			 "<div class='meetup'><h2>"+ searchResults[i].name +"</h2><p>"+searchResults[i].description+
			 "</p><p>"+searchResults[i].city+","+searchResults[i].state+
			 "</p><input type='hidden' value='"+
			 searchResults[i].lon+
			 "' class='longitude'><input type='hidden' value='"+
			 searchResults[i].lat+
			 "' class='latitude'><a target='_blank' href='"+
			 searchResults[i].link+"'>Click me to go to the Meetup</a></div>");
						
	}
	state.currentPosition = i; 
	

} 

//takes value of longitude and latitude and plots them on google maps

$('.js-results').on('click','.meetup', function(e){
		var lng1= $(this).find('.longitude').val();
		var lat1= $(this).find('.latitude').val();
		placepointGoogle(lng1,lat1);
	});


$('.js-next').on("click", ".next", function(e){
	e.preventDefault();
	if(state.currentPage == 1){
		$('.js-prev').removeClass('hide');
	}
	state.currentPage++;
	console.log("next called");

	if(state.currentPage == state.totalPages){
		$('.js-next').addClass('hide');
	} 
	displayMeetup(state.resultSet);
});

$('.js-prev').on("click",".prev", function(e){
	e.preventDefault();
	
	if(state.currentPage == state.totalPages){
		var remainder = state.resultLength % state.recordsPerPage;
		state.currentPosition = (state.currentPosition - remainder) - state.recordsPerPage;
		$('.js-next').removeClass('hide');
	} else{
		state.currentPosition = state.currentPosition - (state.recordsPerPage *2);
		$('.js-prev').removeClass('hide');
		$('.js-next').removeClass('hide');
	}
	
	state.currentPage--;
	if(state.currentPage == 1){
		$('.js-prev').addClass('hide');
	}
	

	displayMeetup(state.resultSet);
	
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
