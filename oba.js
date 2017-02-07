

$(document).ready(function(){
	var qs = (function(a) {
	    if (a == "") return {};
	    var b = {};
	    for (var i = 0; i < a.length; ++i)
	    {
	        var p=a[i].split('=');
	        if (p.length != 2) continue;
	        b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
	    }
	    return b;
	})(window.location.search.substr(1).split('&'));
	// stations = qs['train'].split(' ');
	console.log(qs);
	var count = 0
	// $('span.list').empty()
	queryStops();
	setInterval(function(){
		$('span.list').empty()
		queryStops();

	},30000);

})



function queryStops(){
	var stops = [
		{
			"id": "MARTA_907842",
			"name": "Peachtree Center"
		},
		{
			"id": "MARTA_908986",
			"name": "Five Points"
		},
		{
			"id": "MARTA_908696",
			"name": "GSU"
		}
	]
	$.each(stops, function(i, stop){
		queryStop(stop)

	});
}

function queryStop(stop){
	var url = 'http://atlanta.onebusaway.org/api/api/where/arrivals-and-departures-for-stop/'+stop.id+'.json?key=TEST&minutesAfter=20&minutesBefore=-8'
	$.ajax({
		type: "GET",
		url: url,
		contentType: "application/json; charset=utf-8",
		dataType: 'jsonp',
		ProcessData: true,
		success: function(data){
			console.log(data)
			parseTime(stop.name, data.data.entry.arrivalsAndDepartures)
		}
	});
}
function parseTime(stopName, arrivals){
	var previous = null;
	var trips = []
	$.each(arrivals, function(i, arrival){
		console.log(arrival)
		var seconds = arrival.predictedArrivalTime || arrival.scheduledArrivalTime
		var d = moment(seconds).format('h:mm');
		var diff = seconds - moment().unix();
		var fromNow = moment(seconds).fromNow(true).replace('minutes', 'min');
		// var fromNow = seconds/60
		var dir = arrival.tripHeadsign.split(' ')[1][0]

		// if (arrival.numberOfStopsAway >= 0){
			// console.log(fromNow)
			// console.log(moment(seconds).format("dddd, MMMM Do YYYY, h:mm:ss a"))
			console.log(i)
			var route = arrival.routeLongName.split('-')[0];
			var station = '<span class="station">' + stopName + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>'
			var trip = '<span class="dir ' + dir.toLowerCase() + '">' + dir + '</span> ' + '<span class="route ' + route.toLowerCase() + '">' +  route + '</span> ' + '<span class="time">' + fromNow + '</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
			var el = (i == 0) ? station + trip : trip
			$('#' + arrival.stopId).append(el)

			// if (previous != null && arrival.tripHeadsign){

			// }
			// previous = arrival;
		// }
	})
}
