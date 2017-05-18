/* eslint-env browser */
/* global window, Promise */

/**
 * var stopRecording = recordAudio(streamingDataEvent => {})
 * stopRecording(blob => {})
 */
window.recordAudio = (function() {
  function gUM() {
    return new Promise(function(res, rej) {
      window.navigator.getUserMedia({ audio: true }, res, rej);
    });
  }

  return function recordAudio(preCallback) {
    var stop = null;

    gUM()
      .then(function(currentStream) {
        var audioContext = new window.AudioContext();
        var scriptprocessor = audioContext.createScriptProcessor(2048, 1, 1);

        var mediaRecorder = new window.MediaRecorder(currentStream);
        mediaRecorder.start();

        var mic = audioContext.createMediaStreamSource(currentStream);
        mic.connect(scriptprocessor);
        scriptprocessor.connect(audioContext.destination);
        scriptprocessor.onaudioprocess = preCallback;

        var blob = null;

        mediaRecorder.ondataavailable = function(e) {
          blob = e.data;
        };

        stop = function(cb) {
          mediaRecorder.onstop = function() {
            cb(blob);
          };
          mediaRecorder.stop();
          scriptprocessor.onaudioprocess = undefined;
          scriptprocessor.disconnect();
          mic.disconnect();
          currentStream.getTracks().forEach(function(track) {
            track.stop();
          });
        };
      })
      .catch(function(err) {
        console.log({ err: err });
      });

    return function(cb) {
      stop(cb);
    };
  };
})();

var streamingAudioEventToGainPercentage = function(data) {
  var avg =
    data.reduce(function(acc, curr) {
      return acc + Math.abs(curr);
    }, 0) / data.length;
  return Math.round(avg * 100);
};


window.drawCanvasOfValues = function(width, height, values) {
  var canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  canvas.style.display = "block";
  var ctx = canvas.getContext("2d");

  var maxY = Math.max.apply(0, values);
  var getY = coordinationCalculatorGenerators.y(maxY, height);
  var getX = coordinationCalculatorGenerators.x(values.length, width);

  for (var i = 1; i < values.length; i++) {
    ctx.moveTo(getX(i - 1), getY(values[i - 1]));
    ctx.lineTo(getX(i), getY(values[i]));
    ctx.stroke();
  }

  return canvas;
};

var coordinationCalculatorGenerators = {
  y: function(max, height) {
    return function(current) {
      return height - current / max * height;
    };
  },

  x: function(max, width) {
    return function(current) {
      return current / max * width;
    };
  }
};

window.appendEventData = function(xys, checkIfNeedToAlert) {
  checkIfNeedToAlert = checkIfNeedToAlert || function() {}

  return function(event) {
    var data = event.inputBuffer.getChannelData(0);
    var firstPart = streamingAudioEventToGainPercentage(
      data.slice(0, data.length / 2)
    );
    var secondPart = streamingAudioEventToGainPercentage(
      data.slice(data.length / 2)
    );
    xys.push(firstPart);
    xys.push(secondPart);

    var amount = (firstPart + secondPart) / 2;
    checkIfNeedToAlert(xys);
    return amount;
  };
};

window.createAudioElement = function(blob, className) {
  var audioURL = URL.createObjectURL(blob);
  var audio = document.createElement("audio");
  audio.setAttribute("controls", true);
  audio.className = className;
  audio.src = audioURL;
  return audio;
}

