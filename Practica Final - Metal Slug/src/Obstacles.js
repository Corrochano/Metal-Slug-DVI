function add_obstacles(Q){

	const obstacles = {
		red_car: {
			idle_sheet: "red_car_idle",
			hit_sheet: "red_car_hit",
			sprite: "red_car",
			explosion: "medium_explosion"
		},
		rebel_van: {
			asset: "rebel_van",
			explosion: "big_explosion"
		},
		fridge_truck: {
			idle_sheet: "fridge_truck_idle",
			hit_sheet: "fridge_truck_hit",
			sprite: "fridge_truck",
			explosion: "medium_explosion"
		},
		blockade: {
			asset: "blockade",
			explosion: "big_explosion"
		},
		guard_post: {
			asset: "guard_post.png",
			explosion: "big_explosion"
		},
		destroyed_turret: {
			asset: "destroyed_turret",
			explosion: "big_explosion"
		}
	}

	const effects = {
		none: 0,
		heavyMachinegun: 1
	};

	const objects = {
		meat: {
			sprite: "Carne.png",
			score: 1000,
			effect: effects.none
		},
		watermelon: {
			sprite: "Sandia.png",
			score: 1500,
			effect: effects.none
		},
		banana: {
			sprite: "Platano.png",
			score: 2000,
			effect: effects.none
		},
		machineGun: {
			sprite: "H.png",
			score: 0,
			effect: effects.heavyMachinegun
		}
	}

	Q.animations("red_car", {
		idle: {
			frames: [0],
			rate: 1 / 7,
			flip: false,
			loop: true
		},
		hit: {
			frames: [0,1,2,3,4],
			rate: 1 / 15,
			flip: false,
			loop: false,
			trigger: "idle"
		}
	})

	Q.animations("fridge_truck", {
		idle: {
			frames: [0],
			rate: 1 / 7,
			flip: false,
			loop: true
		},
		hit: {
			frames: [0,1,2,3,4,5,6,7,8],
			rate: 1 / 15,
			flip: false,
			loop: false,
			trigger: "idle"
		}
	})

	Q.animations("static", {
		static: {
			frames: [0],
			rate: 1 / 7,
			flip: false,
			loop: true
		}
	})

	Q.Sprite.extend("obstacle", {
		init: function(p) {
			this._super(p,{
				hitpoints: p.hitpoints,
				option: p.sprite,
				originx: p.x,
				originy: p.y
			});
			if(obstacles[this.p.option].hasOwnProperty("asset")){
				this.p.sprite = "static";
				this.p.sheet = obstacles[this.p.option].asset;
				this.size(true);
			}
			else{
				this.p.sprite = obstacles[this.p.option].sprite;
				this.p.sheet = obstacles[this.p.option].idle_sheet;
				this.size(true);
			}
			this.add("2d, animation");
			this.on("idle", this, "idle");
		},
		step: function(dt){
			this.p.x = this.p.originx;
			this.p.y = this.p.originy;
		},
		idle: function(){
			if(this.p.sheet){
				this.p.sheet = obstacles[this.p.option].idle_sheet;
				this.size(true);
				this.play("idle");
			}
		},
		takeDamage: function(damage){
			if(this.p.hitpoints != -1){
				this.p.hitpoints -= damage;
				if(this.p.hitpoints < 0){
					this.stage.insert(new Q.explosion({
						option: obstacles[this.p.option].explosion,
						x: this.p.x,
						y: this.p.y}));
					Q.audio.play("explosion.mp3", {loop: false});
					this.dropItem();
					this.destroy();
				}
				else if(obstacles[this.p.option].hasOwnProperty("hit_sheet")){
					this.p.sheet = obstacles[this.p.option].hit_sheet;
					this.size(true);
					this.play("hit");
				}
			}
		},
		dropItem: function(){
			let objectNames = Object.keys(objects);
			let randomPos = Math.floor(Math.random() * objectNames.length);
			this.stage.insert(new Q.DroppedObject({
				x: this.p.x,
				y: this.p.y,
				asset: objects[objectNames[randomPos]].sprite,
				score: objects[objectNames[randomPos]].score,
				effect: objects[objectNames[randomPos]].effect
			}));
		}
	})
}