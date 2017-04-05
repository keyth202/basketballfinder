var url_meetup="https://api.meetup.com/find/groups";

$(document).ready(function(){
$('#js-search-form').submit(function(event){
		event.preventDefault();
		var result = $('.query').val();
		// Add in Case if query is not 5 letters long
		console.log(result);
		searchMeetup(result, displayMeetup);

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
	$('.js-results').html('<h2>Here are the Top 10 Groups in your area</h2>');
	console.log(searchResults.length);
	console.log(data.data.length);
	for(var i = 0; i<searchResults.length; i++){
			$('.js-results').append('<p>'+searchResults[i].name);
	}
} 

function searchGoogle(search, callback){

}

function displayGoogle(data){

}