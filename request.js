var ids = [];
var query;

function foo() {
	query = document.getElementById("keyword").value;
}
function getStatistics() {
	var request = gapi.client.youtube.videos.list({
		part:'id, snippet, statistics',
		fields:'items(id, snippet(title),statistics(dislikeCount, viewCount, likeCount))',
		id:ids,
	});
	request.execute(calculateScore);
}

function calculateScore(response) {
	var highScore = 0;
	var winnerId;
	var winnerTitle;

	for (var i = 0; i<response.items.length; i++) {
		var param = response.items[i].statistics;
		likes = param.likeCount;
		dislikes = param.dislikeCount;
		sum = +likes + +dislikes;
		diff = +likes - +dislikes;
		if(param.likeCount != param.dislikeCount)
			var likeRatio = diff/sum;
		else
			var likeRatio = 0;
		var score = param.viewCount*0.0000001 + likeRatio;
		if (score > highScore) {
			highScore = score;
			winnerId = response.items[i].id;
			winnerTitle = response.items[i].snippet.title;
		}
	}
	console.log(winnerTitle);
	console.log("highscore: "+highScore);
	console.log(winnerId);
	console.log("-----------------------------");
	document.getElementById("video").innerHTML = 'You should watch <a href="https://www.youtube.com/watch?v='+winnerId+'">this video</a>.'

}
//called when youtube api is loaded
function onClientLoad() {
	gapi.client.setApiKey('AIzaSyDVBGwi_G3YF0dNxLVtmwntj-ZrbTx2jxM');
	gapi.client.load('youtube', 'v3');
}

//called automatically as a callback to onClientLoad() function
function makeRequest() {
	document.getElementById("video").innerHTML = '';
	console.log(query);
	var request = gapi.client.youtube.search.list({
        part: 'snippet',
        q: query,
        order:'viewCount',
        type:'video',
        maxResults:12,
    });
	request.execute(onResponse);
}

function onResponse(response) {
 	var data = response.items;
 	for(var i = 0; i<data.length; i++) {
 		ids[i] = data[i].id.videoId;
 	}
 	getStatistics();
}