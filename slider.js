
const slider = new PIXI.Container();
const _bg = new PIXI.Graphics();
const slideWidth = 1000;
_bg.beginFill(0x000000, 0.6);
_bg.drawRect(0, 0, app.screen.width, 50);
_bg.endFill();
slider.addChild(_bg);

const slide_con = new PIXI.Container();
slide_con.x = (app.screen.width - slideWidth) / 2;
slide_con.y = 25;
slider.addChild(slide_con);


const dragIcon = new PIXI.Graphics();
dragIcon.beginFill(0xff0000);
dragIcon.drawCircle(0, 0, 5);
dragIcon.endFill();

const dragRange = new PIXI.Graphics();
dragRange.beginFill(0xffffff);
dragRange.drawRect(0, 0, slideWidth, 2);
dragRange.endFill();
// slider.interactive=true;
slide_con.addChild(dragRange);
slide_con.addChild(dragIcon);
addInteraction(dragIcon);

function addInteraction(obj) {
    obj.interactive = true;
    obj
        .on('pointerdown', onDragStart)
        .on('pointerup', onDragEnd)
        .on('pointerupoutside', onDragEnd)
        .on('pointermove', onDragMove);
}
function snap(obj) {
    obj.position.x = Math.min(Math.max(obj.position.x, 0), slider.width);
    obj.position.y = 0
}
function onDragStart(event) {
    this.data = event.data;
    this.dragging = true;
    // (app.stage as any).interactive = true;
    // (app.stage as any).addEventListener('pointermove', onDragMove);
}

function onDragEnd(event) {
    // (app.stage as any).interactive = false;
    // (app.stage as any).removeEventListener('pointermove', onDragMove);
    const obj = event.currentTarget;
    if (obj.dragging === 1) {
        // toggle(obj);
    } else {
        snap(obj);
    }
    obj.dragging = 0;
    obj.dragData = null;
    // app.renderer.view.dispatchEvent(new PointerEvent('pointerup', {
    //     pointerType: 'mouse',
    //     clientX: 1,
    //     clientY: 1,
    //     isPrimary: true,
    // }));

    callback(dragIcon.x, dragIcon.x / slideWidth);
    // set the interaction data to null
}

function onDragMove(event) {
    if (this.dragging) {
        let newPosition = this.data.getLocalPosition(this.parent);
        this.x = Math.min(Math.max(newPosition.x, 0), slideWidth);
        callback(this.x, this.x / slideWidth);
        // this.y = newPosition.y;
    }
   
    // if (event.currentTarget.dragging) {
    //     console.log(event)
    //     const newPosition = event.currentTarget.toLocal(event.currentTarget.data.global);
    //     dragIcon.x = Math.min(Math.max(newPosition.x, 0), slider.width);
    // }
}


const showSlider = (_callback) => {
    callback = _callback;
    return slider;
}