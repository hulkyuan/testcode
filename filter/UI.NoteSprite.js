import * as PIXI from 'pixi.js';
import { noteToLocation, midiToPitch } from './core.Note';

const noteColor = 0x47b1a8;
/**
 * ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
 * @param offset 起始偏移量
 * @param total 绘制琴键合计 
 */
export const drawPiano = (offset = 9, total = 88) => {
    let i = offset;
    let notes = [];
    while (i < total + offset) {
        const name = midiToPitch(i);
        const note = {
            name: `${name}`,
            midi: i,
            duration: 1,
            time: 0
        }
        notes.push(note);
        i++;
    }

    return addPiano(notes, offset);

}
/**
 * 绘制虚拟钢琴
 * @param notes 
 * @param offset 
 * @returns 
 */
const addPiano = (notes, offset = 0) => {
    let i = 0;
    const piano = new PIXI.Container();
    while (i < notes.length) {
        const location = noteToLocation(notes[i], offset);
        if (location.color === 'white') {
            // var canvas = document.createElement('canvas');
            // canvas.height = location.height;
            // canvas.width = location.width;
            // const ctx = canvas.getContext('2d');
            // ctx.fillStyle = 'white';
            // ctx.strokeRect(0, 0, location.width , location.height);

            // const graphics = new PIXI.Sprite(PIXI.Texture.from(canvas));
            const graphics = new PIXI.Graphics();
            graphics.lineStyle(1, 0x000000);
            graphics.beginFill(0xffffff, 0.25);
            graphics.drawRect( 0, 0, location.width, location.height);
            graphics.endFill();
            graphics.position.set(location.x, 0);
            piano.addChildAt(graphics, 0);
        } else {
            // var canvas = document.createElement('canvas');
            // canvas.height = location.height;
            // canvas.width = location.width;
            // const ctx = canvas.getContext('2d');
            // ctx.fillStyle = 'black';
            // ctx.fillRect(0.5, 0.5, location.width, location.height * 0.66);
            // const graphics = new PIXI.Sprite(PIXI.Texture.from(canvas));
            const graphics = new PIXI.Graphics();
            graphics.lineStyle(1, 0x000000);
            graphics.beginFill(0x000000);
            graphics.drawRect( 0, 0, location.width, location.height*0.6);
            graphics.endFill();
            graphics.position.set(location.x, 0);
            piano.addChild(graphics);
        }
        i++;
    }
    return piano;
}
/**
 *  duration: 0.4739583333333333
    durationTicks: 455
    midi: 52
    name: "E3"
    ticks: 0
    time: 0
    velocity: 0.5354330708661418
 * @param option 
 * @returns 采用graphics渲染，性能很差，每帧渲染所有元素
 */
export const drawNote = (option, offset = 9) => {
    const location = noteToLocation(option, offset);
    // const sp=new PIXI.Sprite(PIXI.Texture.from('/1.png'));
    // sp.width=location.width;
    // sp.height=location.height;
    // sp.position.set(location.x, location.y);
    const graphics = new PIXI.Graphics();
    graphics.lineStyle(1, 0xffffff);//这句话很神奇，屏蔽了后 帧数极速下降
    graphics.beginFill(0x650A5A);
    graphics.drawRoundedRect( 0, 0, location.width, location.height, 5);
    graphics.endFill();
    // const sp=new PIXI.Sprite();
    graphics.position.set(location.x, location.y);
    // sp.addChild(graphics)
    return graphics;
}
function roundRect(ctx, x, y, width, height, radius = 5, fill = false, stroke = false) {
    if (typeof radius === 'number') {
        radius = { tl: radius, tr: radius, br: radius, bl: radius };
    } else {
        radius = { ...{ tl: 0, tr: 0, br: 0, bl: 0 }, ...radius };
    }
    ctx.beginPath();
    ctx.moveTo(x + radius.tl, y);
    ctx.lineTo(x + width - radius.tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    ctx.lineTo(x + width, y + height - radius.br);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
    ctx.lineTo(x + radius.bl, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    ctx.lineTo(x, y + radius.tl);
    ctx.quadraticCurveTo(x, y, x + radius.tl, y);
    ctx.closePath();
    if (fill) {
        ctx.fill();
    }
    if (stroke) {
        ctx.stroke();
    }
}