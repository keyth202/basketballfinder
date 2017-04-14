var state = {
	totalPages: 0,
	currentPage: 1, 
	resultSet: 0,
	resultAmount:0,
	currentPosition: 0,
	url_meetup: "https://api.meetup.com/find/groups",
	numberResults: function(){
		var remainder = this.resultAmount % 10;
		return this.currentPosition + remainder < this.resultAmount ? this.currentPage * 10 : this.resultAmount;
			
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
	var searchResults = data.data;
	if(state.resultSet == 0){
		state.resultSet = data;
		state.resultAmount = searchResults.length;
 		
	}
	

	var totalPages = searchResults.length % 10 == 0 ? searchResults.length / 10 : (searchResults.length / 10) + 1;
    state.totalPages = Math.floor(totalPages);
	var numResults = state.numberResults();
	var remainder = state.resultAmount % 10;



	$('.js-results').html('<h2 class="title">Here are the '+state.resultAmount+' Groups in your area</h2>');

	
	console.log(numResults,"Number Returned");
	console.log(state.currentPosition, "StartingPosition");
	
	for(var i = state.currentPosition; i < numResults; i++){
			
			$('.js-results').append(
			 "<div class='meetup'><h2>"+ searchResults[i].name +"</h2><p>"+searchResults[i].description+
			 "</p><p>"+searchResults[i].city+
			 "</p><input type='hidden' value='"+
			 searchResults[i].lon+
			 "' class='longitude'><input type='hidden' value='"+
			 searchResults[i].lat+
			 "' class='latitude'></div>");
						
	}
	if(state.currentPage != state.totalPages){
		state.currentPosition = i; 
	}
	
	console.log(state.currentPosition, "Current Position");
	console.log(state.currentPage, "Current Page")
	console.log(state.totalPages, "Total Pages")
	
} 

$('.js-results').on('click','.meetup', function(e){
		//console.log($(this).find('.longitude').val());
		//console.log($(this).find('.latitude').val());
		var lng1= $(this).find('.longitude').val();
		var lat1= $(this).find('.latitude').val();
		placepointGoogle(lng1,lat1);
	});

$('.js-next').on("click", ".next", function(e){
	e.preventDefault();
	$('.js-prev').removeClass('hide');
	console.log("next called");
	//console.log(state.currentPage, "Current Page");
	//console.log(state.totalPages);
	//var endPage = Math.floor(state.totalPages);
	//console.log(endPage, "End Page");

	if(state.currentPage == state.totalPages){
		$('.js-next').addClass('hide');
	} else {
		state.currentPage++;
		displayMeetup(state.resultSet);
		//console.log(state.currentPage, "After itteration");
	}
});

$('.js-prev').on("click",".prev", function(e){
	e.preventDefault();
	console.log("prev called");
	var endAmount = state.currentPosition + (state.resultAmount % 10);
	var remainder = state.resultAmount % 10;
	//console.log(remainder, "Remainder");

	state.currentPage--;

	if(state.currentPage == 2){
		$('.js-prev').addClass('hide');
		state.currentPosition= 0;
	}else{
		state.currentPosition= state.currentPosition - 10;
	}
	//console.log(state.currentPage, "Current Page");

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
