var url_meetup="https://api.meetup.com/find/groups";

$(document).ready(function(){
$('#js-search-form').submit(function(event){
		event.preventDefault();
		var result = $('.query').val();
		// Add in Case if query is not 5 letters long
		console.log(result);
		searchMeetup(result, displayMeetup);
		//locationMeetup();


	});
});

	/* $.getJSON(url, params, function(data){
	 	console.log(data);
	 });*/
function searchMeetup(search, callback){
	var params ={
	 	sign: true,
	 	key: '4d1e9275292c52331d2e706c4555',
	 	zip: search,
	 	text: 'basketball',
	 	page: 10

	 };

	$.ajax({ 
		type: "GET", 
		crossdomain: true, 
		data: params,
		dataType: 'JSONP',
		headers: {"Access-Control-Allow-Origin": "*"}, 
		url: url_meetup,
		success: callback, 
		error: function(data){
			console.log('failure');
		}
	}); 
} 



function displayMeetup(data){
	 var searchResults = data.data;
	 console.log(data);
	$('.js-results').html('<h2 class="title">Here are the Top 10 Groups in your area</h2>');
	console.log(searchResults.length);
	console.log(data.data.length);
	for(var i = 0; i<searchResults.length; i++){
			$('.js-results').append('<div class="meetup" id="'+i+'"><h2>'+searchResults[i].name+'</h2><p>'+searchResults[i].description+'</p><p>'+searchResults[i].city+'</p>'+
				"<input type='hidden' value='"+searchResults[i].lon+"' class='longitude'><input type='hidden' value='"+searchResults[i].lat+"' class='latitude'></div>");

	}
	/* Set up onclick statement for picture and name 
	*/
	
} 
$('.js-results').on('click','.meetup', function(e){
		console.log($(this));
		console.log($(this).children());
		console.log($(this).find('.longitude').val());
		console.log($(this).find('.latitude').val());
		var lng1= $(this).find('.longitude').val();
		var lat1= $(this).find('.latitude').val();
		placepointGoogle(lng1,lat1);
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
	}
		
		
}
//	initMap(longitude,latitude);

/*function initMap(longitude, latitude) { 
  // var latitude = ;
   // var longitude = ;
    var location = {lat: Number(latitude), lng: Number(longitude)};
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 16,
      center: location
    });
    var marker = new google.maps.Marker({
      position: location,
      map: map
    });
}*/