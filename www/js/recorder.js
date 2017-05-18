/**
 * const stopRecording = recordAudio(streamingDataEvent => {})
 * stopRecording(blob => {})
 */
window.recordAudio = (function() {
  function gUM() {
    return new Promise(function(res, rej) {
      navigator.getUserMedia({ audio: true }, res, rej);
    });
  }

  return function recordAudio(preCallback) {
    var stop = null;

    gUM()
      .then(function(currentStream) {
        var audioContext = new AudioContext();
        var scriptprocessor = audioContext.createScriptProcessor(2048, 1, 1);

        var mediaRecorder = new MediaRecorder(currentStream);
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
})
