var ids = [];
var query = prompt("Enter Keyword");
function getStatistics() {
	var request = gapi.client.youtube.videos.list({
		part:'snippet, statistics',
		fields:'items(snippet(title),statistics(dislikeCount, viewCount, likeCount))',
		id:ids,
		maxResults:10,
	});
	request.execute(calculateScore);
}

function calculateScore(response) {
	console.log(response);
	var highScore = 0;
	var winnerId;
	var winnerTitle;

	for (var i = 0; i<response.items.length; i++) {
		var param = response.items[i].statistics;
		console.log(param.viewCount);
		console.log(param.likeCount);
		console.log(param.dislikeCount);
		if(param.likeCount != param.dislikeCount)
			var likeRatio = (param.likeCount-param.dislikeCount)/(param.likeCount+param.dislikeCount);
		else
			var likeRatio = 0;
		console.log("likeratio: "+likeRatio);
		var score = param.viewCount*0.0000001 + 10*likeRatio;
		console.log("score:"+score);
		console.log("-----------------------------");
		if (score > highScore) {
			highScore = score;
			winnerId = ids[i];
			winnerTitle = response.items[i].snippet.title;
		}
	}
	console.log(winnerTitle);
	console.log("highscore: "+highScore);
	document.getElementById("video").innerHTML = 'You should watch <a href="https://www.youtube.com/watch?v='+winnerId+'">this video</a>.'

}
//called when youtube api is loaded
function onClientLoad() {
	gapi.client.setApiKey('AIzaSyDVBGwi_G3YF0dNxLVtmwntj-ZrbTx2jxM');
	gapi.client.load('youtube', 'v3', makeRequest);
	console.log(query);
}

//called automatically as a callback to onClientLoad() function
function makeRequest() {
	console.log(query);
	var request = gapi.client.youtube.search.list({
        part: 'snippet',
        q: query,
        order:'viewCount',
        type:'video',
        maxResults:'10',
    });
	request.execute(onResponse);
}

function onResponse(response) {
 	var data = response.items;
 	for(var i = 0; i<data.length; i++) {
 		ids[ids.length] = data[i].id.videoId;
 	}
 	console.log(ids);
 	getStatistics();
}