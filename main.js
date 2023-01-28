



var midi = null;  // global MIDIAccess object
function onMIDISuccess(midiAccess) {
    console.log("MIDI ready!");
    console.log(midiAccess);
    midi = midiAccess;  // store in the global (in real usage, would probably keep in an object instance)
}

function onMIDIFailure(msg) {
    console.log("Failed to get MIDI access - " + msg);
}

navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);


const app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight, resolution: 1, transparent: true
});
document.body.appendChild(app.view);

const w = app.screen.width / 2;
const h = app.screen.height / 2;

function createSquare(x, y) {
    const square = new PIXI.Sprite(PIXI.Texture.WHITE);
    square.tint = 0xff0000;
    // square.factor = 1;
    square.anchor.set(0.5);
    square.position.set(x, y);
    return square;
}

const squares = [
    createSquare(0, 200),
    createSquare(1000, 200),
    createSquare(1000, 200 + 126),
    createSquare(0, 200 + 126),
];

const quad = squares.map((s) => s.position);


// var canvas = document.createElement('canvas');
// const noteW=13;
// const noteH=100;
// canvas.height = noteH;
// canvas.width = noteW;
// const ctx = canvas.getContext('2d');
// ctx.fillStyle='black';
// ctx.fillRect(0,0,noteW,noteH)
// ctx.fillStyle='white';
// ctx.strokeRect(0.5, 0.5, noteW-1, noteH-1);
// ctx.strokeStyle = 'green';
// ctx.strokeRect(20, 10, 160, 100);


// canvas.toBlob((b) => {
//     const a = document.createElement('a');
//     document.body.append(a);
//     a.download = 'screenshot';
//     a.href = URL.createObjectURL(b);
//     a.click();
//     a.remove();
// })
// ctx.fill();
const canvas_sp = new PIXI.Sprite.from(canvas);
canvas_sp.position.x = 20;
canvas_sp.position.y = 20;
app.stage.addChild(canvas_sp);
// add sprite itself
const piano = new PIXI.projection.Sprite2d(PIXI.Texture.from('examples/assets/piano.jpg'));
const cloneSprite = new PIXI.projection.Sprite2d(PIXI.Texture.from('examples/assets/bg_scene_rotate.jpg'));
// const graphics=new PIXI.Graphics();
// graphics.beginFill(0xffffff);
// graphics.drawRect(0,0,1000,2026);
// cloneSprite.scale.set(0.5)
const bg = PIXI.Texture.from('examples/assets/videobg.jpg');
let sp_bg;
bg.baseTexture.on('loaded', function () {
    const scale = Math.min(app.screen.width / bg.width, app.screen.height / bg.height);
    sp_bg = new PIXI.Sprite(bg);
    sp_bg.scale.set(scale, scale);
    // app.stage.addChild(sp_bg);
})

// app.stage.addChild(cloneSprite);
const containerSprite = new PIXI.projection.Sprite2d();
containerSprite.interactive = true;
containerSprite.buttonMode = true;
// containerSprite.anchor.set(0.5);
// containerSprite
// .on('pointerdown', onDragStartSp)
// .on('pointerup', onDragEndSp)
// .on('pointerupoutside', onDragEndSp)
// .on('pointermove', onDragMoveSp);
// containerSprite.addChild(graphics);
// containerSprite.addChild(cloneSprite);
// containerSprite.addChild(piano);

// containerSprite.anchor.set(0.5);
app.stage.addChild(containerSprite);
// squares.forEach((s) => { app.stage.addChild(s); });
const rect = new PIXI.Rectangle(0, 0, 1000, 126)
app.ticker.add((delta) => {
    containerSprite.proj.mapQuad(rect, quad);
});
// Listen for animate update
// app.ticker.add((delta) => {
//     containerSprite.proj.mapSprite(containerSprite, quad);
// });

squares.forEach((s) => { addInteraction(s); });


function onDragStartSp(event) {
    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    this.data = event.data;
    this.alpha = 0.5;
    this.dragging = true;
}

function onDragEndSp() {
    this.alpha = 1;
    this.dragging = false;
    // set the interaction data to null
    this.data = null;
}

function onDragMoveSp() {
    if (this.dragging) {
        const newPosition = this.data.getLocalPosition(this.parent);
        this.x = newPosition.x;
        this.y = newPosition.y;
    }
}

// let us add sprite to make it more funny

// const bunny = new PIXI.projection.Sprite2d(PIXI.Texture.from('examples/assets/flowerTop.png'));
// bunny.anchor.set(0.5);
// containerSprite.addChild(bunny);

// addInteraction(bunny);

// === INTERACTION CODE  ===

function toggle(obj) {
}

function snap(obj) {
    // if (obj === bunny) {
    //     obj.position.set(0);
    // } else {
    obj.position.x = Math.min(Math.max(obj.position.x, 0), app.screen.width);
    obj.position.y = Math.min(Math.max(obj.position.y, 0), app.screen.height);
    // }
}

function addInteraction(obj) {
    obj.interactive = true;
    obj
        .on('pointerdown', onDragStart)
        .on('pointerup', onDragEnd)
        .on('pointerupoutside', onDragEnd)
        .on('pointermove', onDragMove);
}

function onDragStart(event) {

    const obj = event.currentTarget;
    obj.dragData = event.data;
    obj.dragging = 1;
    obj.dragPointerStart = event.data.getLocalPosition(obj.parent);
    obj.dragObjStart = new PIXI.Point();
    obj.dragObjStart.copyFrom(obj.position);
    obj.dragGlobalStart = new PIXI.Point();
    obj.dragGlobalStart.copyFrom(event.data.global);
    console.log(event.currentTarget)
}

function onDragEnd(event) {
    const obj = event.currentTarget;
    if (obj.dragging === 1) {
        toggle(obj);
    } else {
        snap(obj);
    }
    obj.dragging = 0;
    obj.dragData = null;
    // set the interaction data to null
}

function onDragMove(event) {
    const obj = event.currentTarget;
    if (!obj.dragging) return;
    const data = obj.dragData; // it can be different pointer!
    if (obj.dragging === 1) {
        // click or drag?
        if (Math.abs(data.global.x - obj.dragGlobalStart.x)
            + Math.abs(data.global.y - obj.dragGlobalStart.y) >= 3) {
            // DRAG
            obj.dragging = 2;
        }
    }
    if (obj.dragging === 2) {
        const dragPointerEnd = data.getLocalPosition(obj.parent);
        // DRAG
        obj.position.set(
            obj.dragObjStart.x + (dragPointerEnd.x - obj.dragPointerStart.x),
            obj.dragObjStart.y + (dragPointerEnd.y - obj.dragPointerStart.y),
        );
    }
}
