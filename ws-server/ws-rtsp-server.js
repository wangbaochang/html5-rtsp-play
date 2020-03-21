
var express = require('express');
var expressWebSocket = require('express-ws');
var ffmpeg = require('fluent-ffmpeg');
var webSocketStream = require("websocket-stream/stream");
var urlencode = require('urlencode');


localServer();

function localServer() {
    server = express();
    server.use(express.static(__dirname));
    expressWebSocket(server, undefined, {
      perMessageDeflate: true
    });
    //server.ws("/rtsp/:id/", rtspRequestHandle);
    server.ws("/rtsp", rtspRequestHandle);
    server.listen(8888);
  }
  
  function rtspRequestHandle(ws, req) {
    try {
      let url = urlencode.decode(req.query.url);
      console.log("rtsp url:", url);
      console.log("rtsp params:", req.params);
      const stream = webSocketStream(ws, {
          binary: true
      });
      //url = `e:/test.mp4`
      console.log("rtsp url:", url);
      let ffmpegCommand = ffmpeg(url)
        .addInputOption("-analyzeduration", "100000", "-max_delay", "1000000")
        .on("start", function () {
            console.log(url, "Stream started.");
        })
        .on("codecData", function () {
            console.log(url, "Stream codecData.")
        })
        .on("error", function (err) {
            console.log(url, "An error occured: ", err.message);
            stream.end();
        })
        .on("end", function () {
            console.log(url, "Stream end!");
            stream.end();
        })
        .outputFormat("flv").videoCodec("copy").noAudio()
      stream.on("close", function () {
        ffmpegCommand.kill('SIGKILL');
      });
      try {
          ffmpegCommand.pipe(stream);
      } catch (error) {
          console.log(error);
      }
      console.log("end");
    } catch (error) {
        console.log(error);
    }
}
  