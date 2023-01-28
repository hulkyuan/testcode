let app = new PIXI.Application({
    resolution: window.devicePixelRatio,
    width: window.innerWidth,
    height: window.innerHeight,
    antialias: true,
    transparent: true,
    autoDensity: true,
});
document.body.appendChild(app.view);
document.querySelector("#midi").addEventListener("change", (e) => {
    const files = e.target.files;
    if (files.length > 0) {
        const file = files[0];
        parseFile(file);
    }
});
let waitSeconds = 0;
function parseFile(file) {
    const reader = new FileReader();
    reader.onload = function (e) {
        const midi = new Midi(e.target.result);
        currentMidi = midi;
        const { loopAnimation, previewAnimation } = midiReady();
    };
    reader.readAsArrayBuffer(file);
}
function midiReady() {


    if (currentMidi.tracks.length > 0) {

        const notes = currentMidi.tracks.reduce(function (a, b) {
            return a.concat(b.notes);
        }, [])
        let i = 0;
        blocks = new PIXI.Container();

        firstMidi = notes[0];
        while (i < notes.length) {
            const graphics = drawNote(notes[i]);
            blocks.addChild(graphics);
            i++;
        }
    }

    const initH = blocks.height;

    const noteoffset = firstMidi.time;
    //从视频开始到用户按下第一个键时产生的位移量
    offsetY = calcSpeed() * (waitSeconds - noteoffset) * app.ticker.FPS;

    //音频播放偏移量，转换成y轴位移量 
    // blocks.y = -offsetY + piano.height;
    //平面2d的偏移量
    blocks.y = -offsetY + virtualPiano.position.y;


    pianoContainer.addChild(blocks);
    // let index=0;
    const loopAnimation = function () {
       
        if (blocks.y >= initH + Math.abs(offsetY) + virtualPiano.height) {
            blocks.visible=false;
        }else{
            blocks.y += calcSpeed();
            for(let i=0;i<blocks.children.length;i++){
                let block=blocks.children[i];
                if(block.getGlobalPosition().y+Math.abs(offsetY)>app.view.height){
                    block.visible=false;
                }else if(block.getGlobalPosition().y+Math.abs(offsetY)<0){
                    block.visible=false;
                }else {
                    block.visible=true;
                }
            }
        }
    }
    
    const previewAnimation = function () {
        if (blocks.y >= initH + Math.abs(offsetY) + virtualPiano.height) {
            blocks.visible=false;
        }else{
            blocks.y += previewSpeed();
            for(let i=0;i<blocks.children.length;i++){
                let block=blocks.children[i];
                if(block.getGlobalPosition().y+Math.abs(offsetY)>app.view.height){
                    block.visible=false;
                }else if(block.getGlobalPosition().y+Math.abs(offsetY)<0){
                    block.visible=false;
                }else {
                    block.visible=true;
                }
            }
        }
    }
    return { loopAnimation, previewAnimation };

}