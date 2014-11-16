var apiKey = 'XUEYGQJA64K7UHRZZ';
var trackID = 'TRCYWPQ139279B3308';
var trackURL = 'audio/bohemian.mp3'

var remixer;
var player;
var track;
var remixed;
var playbackIndex = -1;
var context;

function afterPlay() {
  if (! player.oldSectionIndex) {
    player.oldSectionIndex = 0;
  }
  if (! player.newSectionIndex) {
    player.newSectionIndex = 0;
  }
  if (! player.barIndex) {
    player.barIndex = 0;
  }
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
  var contextFunction = window.webkitAudioContext || window.AudioContext;
  if (contextFunction === undefined) {
    $("#info").text("Sorry, this app needs advanced web audio. Your browser doesn't"
        + " support it. Try the latest version of Chrome?");
  } else {
    context = new contextFunction();
    remixer = createJRemixer(context, $, apiKey);
    player = remixer.getPlayer();
    $("#info").text("Loading analysis data...");

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
        player.queue(remixed[0].children[0])
        $("#info").text("Remix complete!");
      }
    });
  }
}

function getChunkiness() {
  return track.analysis.section.length;
}

function Period() {
  return 60 / player.analysis.sections[player.newSectionIndex].tempo
}

function Inform(chunk) {
  console.log("new chunk: " + chunk);
  player.newSectionIndex = chunk - 1;
}
