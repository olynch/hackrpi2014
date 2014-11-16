var apiKey = 'XUEYGQJA64K7UHRZZ';
var trackID;
var trackURL = 'audio/hbfs.mp3'

var remixer;
var player;
var track;
var remixed;
var playbackIndex = -1;
var context;

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
  $('#searchInput').keyup(function() {
    var searchString = $('#searchInput').val();
    if (enReq) { enReq.abort(); }
    var url = 'http://developer.echonest.com/api/v4/song/search?format=json&results=5&bucket=id:7digital-US&bucket=tracks'
    $.getJSON(url, {combined:searchString, api_key:apiKey}, function(data) {
      var songs = data.response.songs;
      $('#enSongs').empty();
      songs.forEach(function(song) {
        // Avoid songs with no tracks
        if (song.tracks.length != 0) {
          var htmlString = '<p class="enSong">' + song.artist_name + ' - ' + song.title + '</p>';
          $(htmlString).data({'enID': song.tracks[0].id, 'enTitle': song.title}).appendTo('#enSongs');
        }
      });

      // Set up the click function
      $(".enSong").click(function() {
        trackID = $(this).data('enID');
        $("#info").text('Selected ' +  $(this).data('enTitle'));

        if (remixFlag == false) {
          remixFlag = true;
        } else {
          $('#start-remix').removeAttr('disabled');
        }
      });

    });
  });


  document.querySelector('#myfile').onchange = function(e) {
    var files = this.files;
    // Load the file to the fs
    for (var i = 0, file; file = files[i]; ++i) {
      (function(f) {
        fs.root.getFile(f.name, {create: true, exclusive: false}, function(fileEntry) {
          fileEntry.createWriter(function(fileWriter) {
            fileWriter.write(f); // Note: write() can take a File or Blob object.
          }, errorHandler);
          // Get a URL for the file!
          trackURL = fileEntry.toURL();

          if (remixFlag == false) {
            remixFlag = true;
          } else {
            $('#start-remix').removeAttr('disabled');
          }

        }, errorHandler);
      })(file);
    }

  };
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
  return 60 / track.analysis.sections[player.newSectionIndex].tempo
}

function Inform(chunk) {
  player.newSectionIndex = chunk - 1;
}
