
document.body.appendChild(app.view);


// Create play button that can be used to trigger the video
const button = new PIXI.Graphics()
   .beginFill(0x0, 0.5)
   .drawRoundedRect(0, 0, 100, 100, 10)
   .endFill()
   .beginFill(0xffffff)
   .moveTo(36, 30)
   .lineTo(36, 70)
   .lineTo(70, 50);

// Position the button
button.x = (app.screen.width - button.width) / 2;
button.y = (app.screen.height - button.height) / 2;

// Enable interactivity on the button
button.interactive = true;
button.buttonMode = true;

// Add to the stage
app.stage.addChild(button);
app.stage.addChild(showSlider(callback));

button.on('pointertap', onPlayVideo);

// let texture = PIXI.Texture.from('examples/assets/video.mp4');
let texture;
let video;
let vr;
let recording = false;
document
   .querySelector("#video")
   .addEventListener("change", (e) => {
      const files = e.target.files;
      if (files.length > 0) {
         const file = files[0];
         var videoUrl = URL.createObjectURL(file);
         // video = document.querySelector("#playingvideo");
         video = document.createElement("video")
         video.src = videoUrl;
         texture = PIXI.Texture.from(video);
         video = texture.baseTexture.resource.source;
         // video.addEventListener('timeupdate', onUpdate);
         video.addEventListener('seeked', onSeek);
         texture.baseTexture.on('loaded', function () {
            const scale = Math.min(app.screen.width / texture.width, app.screen.height / texture.height);
            const videoSprite = new PIXI.Sprite(texture);
            texture.baseTexture.resource.autoPlay = false;
            videoSprite.width = texture.width * scale;
            videoSprite.height = texture.height * scale;
            videoSprite.position.x = Math.abs((videoSprite.width - app.screen.width) / 2);
            app.stage.addChildAt(videoSprite);
         });
      }

   });
function loadStart(e) {

}
//video的playrate 范围 0.0625（16fps） - 16.0 
function onPlayVideo() {
   button.destroy();
   // video.play();
}
function callback(data, percent) {
   const duration = video.duration;
   const offsetTime = duration * percent;
   video.currentTime = offsetTime;
}

document.querySelector('#record').addEventListener('click', startRecording, false);
document.querySelector('#stopRecord').addEventListener('click', stopRecording);

function startRecording(e) {
   initRecording();
}

function stopRecording() {
   capturer.stop();
   capturer.save();
}
var capturer = null;
let renderer;
var lastTime = null;
var ellapsedTime = 0;
function initRecording() {

   capturer = new CCapture({
      format: 'webm',
      framerate: 30,
      display: true,
      quality: 99.9,
      syncVideo: video
   });
   renderer = PIXI.autoDetectRenderer({
      width: window.innerWidth,
      height: window.innerHeight,
      resolution: 2
   });
   //hi thespite when i uncomment this timeupdate won't fire;
   capturer.start();
   animate();

}

function animate() {
   lastTime += 1000 / app.ticker.FPS / 1000
   video.currentTime = lastTime;
   if (lastTime > video.duration) {
      stopRecording();
   } else {
      if (renderer) {
         renderer.render(app.stage);
         if (capturer) capturer.capture(renderer.view);
      }
   }
}
function onSeek(e) {
   // console.log(e.type, e.target.currentTime);
   texture.update();
   requestAnimationFrame(animate);
}
function onUpdate(e) {
   console.log(e.type, e.target.currentTime);
   texture.update();
   if (capturer) {
      if (renderer) {
         renderer.render(app.stage);
         capturer.capture(renderer.view);
         requestAnimationFrame(animate);
      }
   }
}