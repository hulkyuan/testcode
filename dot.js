var Dot = function () {
    const dot_arr = [];
    const max_dota = 80;
    const pc = new PIXI.ParticleContainer(max_dota, {
        position: true,
        uvs: true,
        alpha: true,
    });
    pc.position.x = 300;
    pc.position.y = app.screen.height;
    for (var i = 0; i < max_dota; i++) {
        const dot = PIXI.Sprite.from('./examples/images/hexagon.png');
        dot_arr.push(dot);
        dot.anchor.set(0.5);
        dot.scale.set(0.05);
        dot.tint = Math.random() * 10000 * 0x19d3f2;
        dot.rotation = Math.random() * Math.PI * 2;
        dot.position.x = Math.random() * 100;
    }
    app.stage.addChild(pc);
    for (let i = 0; i < max_dota; i++) {
        gsap.to(dot_arr[i], {
            y: Math.random() * 10 - 190, x: Math.random() * 20, ease: "sine", duration: 3, delay: i * 0.05, alpha: 0, repeat: -1,
            onStart: () => {
                pc.addChild(dot_arr[i]);
            }
        })
    }
}