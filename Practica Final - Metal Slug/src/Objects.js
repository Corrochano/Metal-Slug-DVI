function add_objects(Q){

	const effects = {
		none: 0,
		heavyMachinegun: 1
	}

	Q.Sprite.extend("DroppedObject", {
		init: function(p) {
			this._super(p,{
				asset: p.sprite,
				scale: 1,
				score: p.score,
				effect: p.effect
			});
			this.add("2d, animation, tween");
			this.on("hit", this, "activate");
		},
		activate: function(collision){
			if(collision.obj.isA("RossiLegs") && collision.obj.p.move){
				switch(this.p.effect){
					case effects.none:
						Q.audio.play("metal_slug_ok.mp3", {loop: false});
						Q.state.inc("score", this.p.score);
						break;
					case effects.heavyMachinegun:
						collision.obj.getMachineGun();
						break;
				}
				this.destroy();
			}
		}
	})
}