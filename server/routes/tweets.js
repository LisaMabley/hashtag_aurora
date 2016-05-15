var express = require('express');
var path = require('path');
var tweetGetter = require('../../modules/twitter');
var url = require('url');
var req= require('request');

var router = express.Router();

// Endpoints
router.get('/', function(request, response) {

	var hashtag;

	console.log( 'searching: ' + hashtag );
	// Validate the hashtag entered
	if ( ! ( hashtag = validate_hashtag( request ) ) ) {
		console.log( 'Received a bad hashtag: ' + hashtag );
		return;
	}

	//var tweet = require('../data/'+hashtag+'.json');
	tweetGetter( hashtag, parse_data, response );
});

function validate_hashtag ( request ) {
	var queryData = url.parse(request.url, true).query;
	var hashtag = queryData.q;


	if ( hashtag.length >= 140 ) {
		return null;
	}

	var regex = new RegExp( "[A-Za-z]([A-Za-z0-9\-\_]*)" );

	if ( regex.test( hashtag ) ) {
		return hashtag;
	}

	return null;
}

function parse_data ( tweets ) {

	var data = {}; 
	var header = [];
	console.log( 'parsing ' + tweets.statuses.length + ' tweets' );
	/*
	   data.push ( 
	   { name : 'Minnesota',
	   '#HackTheGap2016' : 10,
	   '#WomeInTech' : 2
	   });
	   */
	for (var key in tweets.statuses) {

		var state = get_random_state();
		//console.log( "------" + state+ "-------" );
		//console.log( tweets.statuses[key].coordinates);
		//console.log( "\nhashtags: " );

		//console.log( "coord: " + tweets.statuses[key].coordinates);
		for (var tag_key in tweets.statuses[key].entities.hashtags) {
			var hashtag = tweets.statuses[key].entities.hashtags[tag_key].text.toLowerCase();

			if ( header.indexOf(hashtag) == -1 ) {
				header.push( hashtag );
			}

			//console.log( 'hashtag: ' + hashtag);

				if ( ! data[state] ) {
					//console.log( 'starting ' + state );
					data[state] = {};
					data[state][hashtag] = 0;
				}

				if ( data[state][hashtag] ) {
					//console.log( '     adding to' + state );
					data[state][hashtag]++;
				}
				else {
					data[state][hashtag] = 1;
				}
		}
	}

	var new_data = [];
	for (var key in data ) {
		var vizData = {'name' : key};

		for ( var tweet  in data[key] ) {
			vizData[tweet] = data[key][tweet];
		}

		new_data.push(vizData);
	}


	var twitter_data = {
		'header' : header,
		'tweets' : new_data
	};

	return JSON.stringify(twitter_data);
}

function get_random_state( ) {
	var states = ["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","NewHampshire","NewJersey","NewMexico","NewYork","NorthCarolina","NorthDakota","Ohio","Oklahoma","Oregon","Pennsylvania","RhodeIsland","SouthCarolina","SouthDakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","WestVirginia","Wisconsin","Wyoming"];

	var rand = Math.floor(Math.random() * states.length + 0);
	var count = 0;

	return states[rand];
}

// Export
module.exports = router;
