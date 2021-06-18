function add_coins(Q){

	Q.Sprite.extend("Coin", {
		init: function(p) {
			this._super(p,{
				sheet: "moneda",
                sprite: "coin_anim",
				scale: 1,
				x: 100,
				y: 400
			});
			this.add("animation, tween");
			this.on("hit", this, "colision");
			this.play("rotation");
		},
		colision: function(collision){
			if(collision.obj.isA("RossiLegs")){
				Q.audio.play("metal_slug_coin.mp3", {loop: false});
                Q.state.inc("coins", 1);
				this.destroy();
			}
		}
	});

	Q.animations("coin_anim", {
		rotation: { frames: [0, 1, 2, 3, 4, 5, 6, 7, 8], rate: 1/9, loop:true},
	});
}