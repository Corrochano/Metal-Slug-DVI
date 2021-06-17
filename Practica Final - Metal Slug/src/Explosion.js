function add_explosions(Q){

	Q.animations("explosion", {
		idle: {
			frames: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27],
			rate: 1 / 15,
			flip: false,
			loop: false,
			trigger: "destroySelf"
		}
	})

	Q.Sprite.extend("explosion", {
		init: function(p) {
			this._super(p,{
				sprite: "explosion",
				sheet: p.option,
				type: Q.SPRITE_NONE,
				collisionMask: Q.SPRITE_NONE,
				x: p.x,
				y: p.y
			});
			this.add("animation");
			this.on("destroySelf", this, "destroySelf");
		},
		step: function(dt){
			this.play("idle");
		},
		destroySelf: function(){
			this.destroy();
		}
	})
}