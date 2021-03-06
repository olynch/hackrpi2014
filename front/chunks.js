var apiKey = 'CKRIHPARQ1ZSLUGQ7',
	trackID,
	trackURL = 'audio/hbfs.mp3',
	remixer,
	player,
	track,
	remixed,
	playbackIndex = -1,
	context;

function afterPlay() {
  if (player.oldSectionIndex !== player.newSectionIndex) {
    console.log("sections.length: " + track.analysis.sections.length);
    if (player.newSectionIndex >= track.analysis.sections.length - 1) {
      player.newSectionIndex = 0;
    }
    player.barIndex = 0;
    player.oldSectionIndex = player.newSectionIndex;
  }
  else if (player.barIndex === track.analysis.sections[player.newSectionIndex].children.length - 2) {
    player.barIndex = 0;
  }
  else {
    player.barIndex++;
  }
  console.log("section: " + player.newSectionIndex + "bar: " + player.barIndex);
  q = track.analysis.sections[player.newSectionIndex].children[player.barIndex];
  player.queue(q);
}

function init() {
  $('#start-remix').attr('disabled', 'disabled');

  if (window.File && window.FileReader && window.FileList && window.Blob && window.webkitRequestFileSystem) {
    window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
    window.requestFileSystem(window.TEMPORARY, 1024*1024, function(filesystem) {
      fs = filesystem;
    }, fileErrorHandler);
  }

  // Set up the search function
  var enReq = null;
  $('#searchInput').keyup(function(e) {
	if (e.which!==32 && e.which!=13) {return}
    var searchString = $('#searchInput').val();
    if (enReq) { enReq.abort(); }
    var url = 'http://developer.echonest.com/api/v4/song/search?format=json&results=5&bucket=id:7digital-US&bucket=tracks'
    $.getJSON(url, {combined:searchString, api_key:apiKey}, function(data) {
      var songs = data.response.songs;
      $('#enSongs').empty();
      songs.forEach(function(song) {
        // Avoid songs with no tracks
        if (song.tracks.length != 0) {
          var htmlString = '<button class="p n enSong">' + song.artist_name + ' - ' + song.title + '</button>';
          $(htmlString).data({'enID': song.tracks[0].id, 'enTitle': song.title}).appendTo('#enSongs');
        }
      });

      // Set up the click function
      $(".enSong").click(function() {
        trackID = $(this).data('enID');
        $("#info").text('Selected ' +  $(this).data('enTitle'));
		$('#start-remix').removeAttr('disabled');
		LOADER.open();startGame()
      });

    });
  });
}

function startGame() {
  var contextFunction = window.webkitAudioContext || window.AudioContext;
  if (contextFunction === undefined) {
    $("#info").text("Sorry, this app needs advanced web audio. Your browser doesn't"
        + " support it. Try the latest version of Chrome?");
  } else {
    context = new contextFunction();
    remixer = createJRemixer(context, $, apiKey);
    player = remixer.getPlayer();
    remixer.remixTrackById(trackID, trackURL, function(t, percent) {
      track = t;

      $("#info").text(percent + "% of the track loaded");
      if (percent == 100) {
        $("#info").text(percent + "% of the track loaded, remixing...");
      }

      if (track.status == 'ok') {
        remixed = new Array();
        for (var i=0; i < track.analysis.sections.length; i++) {
          remixed.push(track.analysis.sections[i]);
        }
        player.addOnPlayCallback(afterPlay);
        player.newSectionIndex = 0;
        player.oldSectionIndex = 0;
        player.barIndex = 0;
        player.queue(remixed[0].children[0])
        $("#info").text("Remix complete!");
        Game.start()
      }
    });
  }
}

function getChunkiness() {
  return track.analysis.sections.length;
}

function Period() {
  return 60 / (track.analysis.sections[player.newSectionIndex].tempo || track.audio_summary.tempo)
}

function Inform(chunk) {
  player.newSectionIndex = chunk - 1;
}
