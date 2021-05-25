function add_allies(Q){
	
	Q.animations("prisoner", {
		tied_sit: {
			frames: [0,1,2,3,4,3,2,1],
			rate: 1 / 10,
			flip: false,
			loop: true
		},
		untied_sit: {
			frames: [0,1,2,3],
			rate: 1 / 10,
			flip: false,
			loop: false,
			trigger: "patrol"
		},
		run_left: {
			frames: [0,1,2,3,4,5,6,7,8,9,10,11],
			rate: 1 / 15,
			flip: false,
			loop: true
		},
		run_right: {
			frames: [0,1,2,3,4,5,6,7,8,9,10,11],
			rate: 1 / 15,
			flip: "x",
			loop: true	
		},
		drop_item: {
			frames: [0,1,2,3,4,5,6,7,8,9,10],
			rate: 1 / 10,
			flip: false,
			loop: false,
			trigger: "salute"
		},
		salute: {
			frames: [0,1,2,3,4,5,6,7,8,9,10,11,12,13],
			rate: 1 / 10,
			flip: false,
			loop: false,
			trigger: "flee"
		},
		flee: {
			frames: [0,1,2,3,4,5,6,7],
			rate: 1 / 15,
			flip: false,
			loop: true
		}
	});

	const allyStates = {
		tied: 0,
		untied: 1,
		dropItem: 2,
		patrol: 3,
		flee: 4
	}

	const directions = {
		up: 0,
		right: 1,
		down: 2,
		left: 3
	};

	Q.Sprite.extend("Prisoner", {
		init: function(p) {
			this._super(p,{
				sheet: "prisionero_atado_1",
				sprite: "prisoner",
				frame: 0,
				scale: 1,
				speed: 75,
				state: allyStates.tied,
				direction: directions.left
			})

			this.add("2d, animation, tween");
			this.on("patrol", this, "patrol");
			this.on("flee", this, "flee");
			this.on("hit", this, "collision");
			this.on("salute", this, "salute");
			this.on("bump.left, bump.right", this, "lateralCollision");
		},
		step: function(dt){
			if(this.p.vx > 0){
				this.p.direction = directions.right;
				this.play("run_right");
			} 
			else if(this.p.vx < 0) {
				this.p.direction = directions.left;
				this.play("run_left");
			}
		},
		collision: function(collision){
			if(this.p.state == allyStates.tied && 
				(collision.obj.isA("gunProjectile") || collision.obj.isA("HeavyMachinegunProjectile"))) {
				this.untie();
			}

			if(this.p.state == allyStates.patrol && collision.obj.isA("RossiLegs")) {
				this.dropItem();
			}
		},
		lateralCollision: function(collision){
			if(this.p.state == allyStates.flee && collision.obj.isA("TileLayer")) {
				this.destroy();
			}
		},
		dropItem: function(){
			this.p.vx = 0;
			this.p.state = allyStates.dropItem;
			this.p.sheet = "prisionero_saca_item_1";
			this.size(true);
			this.play("drop_item");
		},
		patrol: function(){
			this.add("aiBounce");
			this.p.vx = -this.p.speed;
			this.p.state = allyStates.patrol;
			this.p.sheet = "prisionero_andando_L";
			this.size(true);
		},
		flee: function(){
			this.p.vx = -(this.p.speed * 1.5);
			this.p.state = allyStates.flee;
			this.p.sheet = "prisionero_correr_L";
			this.size(true);
			this.play("flee");
		},
		untie: function(){
			console.log("untiding");
			this.p.state = allyStates.untied;
			this.p.sheet = "prisionero_desatandose_1";
			this.size(true);
			this.play("untied_sit");
		},
		salute: function() {
			this.p.sheet = "prisionero_saca_item_2";
			this.size(true);
			this.play("salute");
		}

	})
}