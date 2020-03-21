<template>
  <div>
      <video muted ref="player" width="480"></video>
  </div>
</template>

<script>
import flvjs from "flv.js";

export default {
    name: 'Home',
    mounted () {
        if (flvjs.isSupported()) {
            let video = this.$refs.player;
            let path = encodeURIComponent("rtsp://www.mym9.com/101065?from=2019-06-28/01:12:13");
            //let path = encodeURIComponent("rtsp://admin:admin@192.168.1.80:80/cam/realmonitor?channel=1&subtype=0");
            console.log(path);
            if (video) {
                this.player = flvjs.createPlayer({
                    type: "flv",
                    isLive: true,
                    url: 'ws://127.0.0.1:8888/rtsp?url=' + path
                });
                this.player.attachMediaElement(video);
                this.player.load();
                console.log(this.player);
                this.player.play();
            }
        }
    },
    beforeDestroy () {
        this.player.destory();
    }
}
</script>
