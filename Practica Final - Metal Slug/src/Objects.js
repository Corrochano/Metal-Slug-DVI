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
			if(collision.obj.isA("RossiLegs")){
				console.log("obj", this.p);
				switch(this.p.effect){
					case effects.none:
						Q.state.inc("score", this.p.score);
						break;
					case effects.heavyMachinegun:
						// MachineGun
						break;
				}
				this.destroy();
			}
		}
	})
}