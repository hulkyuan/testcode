let app = new PIXI.Application({
    resolution: window.devicePixelRatio,
    width: window.innerWidth,
    height: window.innerHeight,
    antialias: true,
    transparent: true,
    autoDensity: true,
});
// var MediaParams=function (){
//     this.video_currentTime=0;
//     this.midi_offset=0;
// }
const media_params = {
    params: {
        video_currentTime: 0,
        midi_offset: 0
    },
    setParams :function (data) {
        this.params={
            ...this.params,
            ...data
        }
    },
    getParams:function (){
        return this.params;
    }
};