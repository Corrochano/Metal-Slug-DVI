
function add_Rossi(Q) {

	//POSICION
	const rossiXO = 40;
	const rossiYO = 200;
	const dif = 100;
	
	// ANIMACIONES DEL TORSO

	Q.animations("rossi_torso", {
		chest_stand_right: {
			frames: [0,1,2,3],
			rate: 1 / 7,
			flip: false,
			loop: true
		},

		chest_stand_left: {
			frames: [0,1,2,3],
			rate: 1 / 7,
			flip: "x",
			loop: true
		},

		chest_stand_mg_right: {
			frames: [0,1,2,3],
			rate: 1 / 7,
			flip: false,
			loop: true
		},

		chest_stand_mg_left: {
			frames: [0,1,2,3],
			rate: 1 / 7,
			flip: "x",
			loop: true
		},

		before_chest_shoot_gun_right: {
			frames: [0,1,2,3,4],
			rate: 1 / 30,
			flip: false,
			loop: false,
			trigger: "gunShooting"
		},
		after_chest_shoot_gun_right: {
			frames: [5,6,7,8,9],
			rate: 1 / 20,
			flip: false,
			loop: false,
			trigger: "shootStop"
		},
		before_chest_shoot_gun_left: {
			frames: [0,1,2,3,4],
			rate: 1 / 30,
			flip: "x",
			loop: false,
			trigger: "gunShooting"
		},
		after_chest_shoot_gun_left: {
			frames: [5,6,7,8,9],
			rate: 1 / 20,
			flip: "x",
			loop: false,
			trigger: "shootStop"
		},

		// ARRIBA
		before_chest_shoot_gun_up_right: {
			frames: [0,1,2,3,4,5],
			rate: 1 / 20,
			flip: false,
			loop: false,
			trigger: "upGunShooting"
		},
		after_chest_shoot_gun_up_right: {
			frames: [6,7,8,9,10,11,12,13],
			rate: 1 / 20,
			flip: false,
			loop: false,
			trigger: "shootStop"
		},
		before_chest_shoot_gun_up_left: {
			frames: [0,1,2,3,4,5],
			rate: 1 / 20,
			flip: "x",
			loop: false,
			trigger: "upGunShooting"
		},
		after_chest_shoot_gun_up_left: {
			frames: [6,7,8,9,10,11,12,13],
			rate: 1 / 20,
			flip: "x",
			loop: false,
			trigger: "shootStop"
		},

		// Disparo MG
		before_chest_shoot_mg_right: {
			frames: [0,1,2],
			rate: 1 / 30,
			flip: false,
			loop: false,
			trigger: "mgShooting"
		},
		after_chest_shoot_mg_right: {
			frames: [3,4],
			rate: 1 / 25,
			flip: false,
			loop: false,
			trigger: "shootStop"
		},
		before_chest_shoot_mg_left: {
			frames: [0,1,2],
			rate: 1 / 30,
			flip: "x",
			loop: false,
			trigger: "mgShooting"
		},
		after_chest_shoot_mg_left: {
			frames: [3,4],
			rate: 1 / 25,
			flip: "x",
			loop: false,
			trigger: "shootStop"
		},

		// ARRIBA
		before_chest_shoot_mg_up_right: {
			frames: [0,1],
			rate: 1 / 20,
			flip: false,
			loop: false,
			trigger: "upMgShooting"
		},
		after_chest_shoot_mg_up_right: {
			frames: [2,3],
			rate: 1 / 20,
			flip: false,
			loop: false,
			trigger: "shootStop"
		},
		before_chest_shoot_mg_up_left: {
			frames: [0,1],
			rate: 1 / 20,
			flip: "x",
			loop: false,
			trigger: "upMgShooting"
		},
		after_chest_shoot_mg_up_left: {
			frames: [2,3],
			rate: 1 / 20,
			flip: "x",
			loop: false,
			trigger: "shootStop"
		},
	});

	// ANIMACIONES DE LAS PIERNAS

	Q.animations("rossi_legs", {
		legs_stand_right: {
			frames: [0,1,2,3],
			rate: 1 / 7,
			flip: false,
			loop: true
		},
		legs_stand_left: {
			frames: [0,1,2,3],
			rate: 1 / 7,
			flip: "x",
			loop: true
		},
		walk_right: {
			frames: [4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22],
			rate: 1 / 15,
			flip: false,
			loop: true
		},
		walk_left: {
			frames: [4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22],
			rate: 1 / 15,
			flip: "x",
			loop: true
		},
		jump_right: {
			frames: [4,5,6,7,8,9,10,11,12,13,14,15],
			rate: 1 / 15,
			flip: false,
			loop: true
		},
		jump_left: {
			frames: [4,5,6,7,8,9,10,11,12,13,14,15],
			rate: 1 / 15,
			flip: "x",
			loop: true
		},
		die_right: {
			frames: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],
			rate: 1 / 15,
			flip: false,
			loop: false,
			trigger: "afterDeath"
		},
		die_left: {
			frames: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],
			rate: 1 / 15,
			flip: "x",
			loop: false,
			trigger: "afterDeath"
		}
	});

	const directions = {
		up: 0,
		right: 1,
		down: 2,
		left: 3
	};

	// PIERNAS DE ROSSI

	Q.Sprite.extend("RossiLegs", {

		init: function(p) {
			this._super(p,{
				sheet: "piernas_quietas",
				sprite: "rossi_legs",
				x: rossiXO,
				y: rossiYO,
				frame: 0,
				scale: 1,
				move: true,
				type: Q.SPRITE_DEFAULT,
				direction: directions.right,
				invulnerabilityTimer: 0,
				invulnerability: 2,
				resurrecting: false,
				resurrectTimer: 0,
				resurrect: 2
			});
			this.add("2d, platformerControls, animation, tween");
			this.on("afterDeath", this, "afterDeath");
			this.p.jumpSpeed = -350;
		},

		step: function(dt){
			this.p.invulnerabilityTimer += dt;
			if(this.p.move){
				//ANDANDO
				if(this.p.vx > 0){
					this.p.sheet = "movimiento"
					this.size(true);
					this.play("walk_right");
					this.p.direction = directions.right;
					this.lookback = false;
				}
				else if(this.p.vx < 0)
				{
					this.p.sheet = "movimiento"
					this.size(true);
					this.play("walk_left");
					this.p.direction = directions.left;
					this.lookback = true;
				}
				
				//SALTANDO
				if(this.p.vy < 0) {
					this.p.sheet = "salto"
					this.size(true);
					if(this.lookback){this.play("jump_left");}
					else{this.play("jump_right");}
				} else{ this.p.salto = false;}

				if(this.p.vx == 0 && this.p.vy == 0){
					
					this.p.sheet = "piernas_quietas"
					this.size(true);
					if(this.lookback) this.play(`legs_stand_left`)
					else this.play(`legs_stand_right`)
				}
			}

			if (this.p.resurrecting) {
				this.p.resurrectTimer += dt;
				if (this.p.resurrectTimer > this.p.resurrect) {
					this.resurrect();
					this.p.resurrecting = false;
				}
			}
		},
	
		die: function() {
			
			if (this.p.move && this.p.invulnerabilityTimer >= this.p.invulnerability) {
				Q.state.dec("lives", 1);
				Q.audio.play("Marco_Rossi_Death.mp3", {loop:false});
				this.p.move = false;
				this.del('platformerControls');
				this.p.vx = 0;
				Q.state.set({score: 0, prisioneros_liberados:0});
                let chest = Q("RossiChest");
				chest = chest.items[0];
				chest.destroy();
				this.p.sheet = "die_marco";
				this.size(true);
				if(this.p.direction == directions.right) this.play("die_right");
				else this.play("die_left");
				Q("Timer").items[0].resetTimer();
            }
    
        },

        afterDeath: function(){
        	this.del('2d');
        	/*this.p.collisionMask = Q.SPRITE_NONE;
        	this.p.type = Q.SPRITE_NONE;*/
        	if(Q.state.get("lives") < 0){
	        	let label = "Reinicia el juego";
				if(Q.state.get("coins") > 0){
					label = "¿Quieres continuar?"
				}
				Q.stageScene("continueMenu", 2, {label: label});
			}
			else{
				this.p.resurrecting = true;
				this.p.resurrectTimer = 0;
			}
        },

		getMachineGun: function(){ // TODO
			let chest = Q("RossiChest");
			chest = chest.items[0];
			Q.audio.play("metal_slug_HM.mp3", {loop: false});
			chest.getMachineGun();
		},

		resurrect: function(){
			this.stage.insert(new Q.RossiChest());
			this.add("2d, platformerControls");
			this.p.move = true;
			this.p.invulnerabilityTimer = 0;
		},

		disappear: function(){
			this.animate({y: this.p.y+800}, 1, Q.Easing.Linear, {callback: this.Dead });
		},

		Dead: function(){
			this.destroy();
		}
	});


	// TORSO DE ROSSI

	Q.Sprite.extend("RossiChest", {
		init: function(p) {
			this._super(p,{
				sheet: "normal",
				sprite: "rossi_torso",
				x: rossiXO,
				y: rossiYO - dif,
				frame: 0,
				scale: 1,
				type: Q.SPRITE_NONE,
				projectileSpeed: 500,
				mg: false,
				onShoot: false,
				vS: false,
			});
			this.add("animation, tween, platformerControls");
			Q.input.on("fire", this, "attackAction");
			Q.input.on("right", this, function(){ this.p.direction = directions.right});
			Q.input.on("left", this, function(){ this.p.direction = directions.left});
			Q.input.on('S',this, "attackUpAction");
			this.on("gunShooting", this, "gunShooting");
			this.on("mgShooting", this, "mgShooting");
			this.on("shootStop", this, "shootStop");
			this.on("upGunShooting", this, "upGunShooting");
			this.on("upMgShooting", this, "upMgShooting");
			Q.state.set("gun", 0);
		},

		step: function(dt){
			let legs = Q("RossiLegs");
			if(legs.length > 0){
				legs = legs.items[0];
				
				if(!this.p.mg){ // Si no tengo la MG
					
					if(!this.p.onShoot){
						this.p.sheet = "normal";
						this.size(true);
					}
					

					if(legs.lookback) {
						if(!this.p.vS){
							this.p.y = legs.p.y;
							this.p.x = legs.p.x-3;
						}
						else{
							this.p.y = legs.p.y-20;
							this.p.x = legs.p.x-3;
						}
						this.play("chest_stand_left")
					}
					else {
						if(!this.p.vS){
							this.p.y = legs.p.y;
							this.p.x = legs.p.x+3;
						}
						else{
							this.p.y = legs.p.y-20;
							this.p.x = legs.p.x+3;
						}
						this.play("chest_stand_right")
					}
				}
				else{ // Si la tengo
					if(!this.p.onShoot){
						this.p.sheet = "normalHM";
						this.size(true);
					}

					if(legs.lookback) {
						if(!this.p.vS){
							this.p.y = legs.p.y;
							this.p.x = legs.p.x-5;
						}
						else{
							this.p.y = legs.p.y-25;
							this.p.x = legs.p.x;
						}
						this.play("chest_stand_mg_left")
					}
					else {
						if(!this.p.vS){
							this.p.y = legs.p.y;
							this.p.x = legs.p.x+5;
						}
						else{
							this.p.y = legs.p.y-25;
							this.p.x = legs.p.x;
						}
						this.play("chest_stand_mg_right")
					}
				}
			}
		},
		attackAction: function(){
			if(this.p.onShoot) return;

			if(!this.p.mg){
				this.p.sheet = "disparo";
				this.size(true);

				let legs = Q("RossiLegs");
				legs = legs.items[0];


				if(legs.lookback) {
					this.p.y = legs.p.y;
					this.p.x = legs.p.x-3;
					this.play("before_chest_shoot_gun_left",200)
				}
				else {
					this.p.y = legs.p.y;
					this.p.x = legs.p.x+3;
					this.play("before_chest_shoot_gun_right",200)
				}
			}
			else{
				this.p.sheet = "disparoHM";
				this.size(true);
				
				let legs = Q("RossiLegs");
				legs = legs.items[0];

				if(legs.lookback) {
					this.p.y = legs.p.y;
					this.p.x = legs.p.x-3;
					this.play("before_chest_shoot_mg_left",200)
				}
				else {
					this.p.y = legs.p.y;
					this.p.x = legs.p.x+3;
					this.play("before_chest_shoot_mg_right",200)
				}
			}

			this.p.onShoot = true;
		},

		attackUpAction: function(){
			if(this.p.onShoot) return;
			
			if(!this.p.mg){
				this.p.sheet = "arriba";
				this.size(true);

				let legs = Q("RossiLegs");
				legs = legs.items[0];


				if(legs.lookback) {
					this.p.y = legs.p.y;
					this.p.x = legs.p.x-3;
					this.play("before_chest_shoot_gun_up_left",200)
				}
				else {
					this.p.y = legs.p.y;
					this.p.x = legs.p.x+3;
					this.play("before_chest_shoot_gun_up_right",200)
				}
			}
			else{
				this.p.sheet = "arribaHM";
				this.size(true);
				
				let legs = Q("RossiLegs");
				legs = legs.items[0];

				if(legs.lookback) {
					this.p.y = legs.p.y;
					this.p.x = legs.p.x-3;
					this.play("before_chest_shoot_mg_up_left",200)
				}
				else {
					this.p.y = legs.p.y;
					this.p.x = legs.p.x+3;
					this.play("before_chest_shoot_mg_up_right",200)
				}
			}

			this.p.onShoot = true;
			this.p.vS = true;
		},

		gunShooting: function(){
			let offset = 0;
			let speed = 0;

			let legs = Q("RossiLegs");
			legs = legs.items[0];
			Q.audio.play("rossi_shot.mp3", {loop: false});

			if (!legs.lookback){
				offset = legs.p.w;
				speed = this.p.projectileSpeed;
				this.play("after_chest_shoot_gun_right",200)
			}
			else{
				offset = legs.p.w * -1;
				speed = -this.p.projectileSpeed;
				this.play("after_chest_shoot_gun_left",200)
			}
			this.stage.insert(new Q.gunProjectile({
				x: this.p.x + offset,
				y: this.p.y - 2,
				vx: speed
			}));
			
		},

		upGunShooting: function(){
			let offset = 0;
			let speed = 0;

			let legs = Q("RossiLegs");
			legs = legs.items[0];
			Q.audio.play("rossi_shot.mp3", {loop: false});
			
			if (!legs.lookback){
				offset = legs.p.h * -1;
				speed = -this.p.projectileSpeed;
				this.play("after_chest_shoot_gun_up_right",200)
			}
			else{
				offset = legs.p.h * -1;
				speed = -this.p.projectileSpeed;
				this.play("after_chest_shoot_gun_up_left",200)
			}
			this.stage.insert(new Q.gunUpProjectile({
				x: this.p.x - 2,
				y: this.p.y + offset,
				vy: speed
			}));

		},

		mgShooting: function(){
			let offset = 0;
			let speed = 0;

			let y_offset = -2 + Math.floor(Math.random() * (10 - 0)) + 0;

			let legs = Q("RossiLegs");
			legs = legs.items[0];
			Q.audio.play("rossi_shot_HM.mp3", {loop: false});
			
			if (!legs.lookback){
				offset = legs.p.w;
				speed = this.p.projectileSpeed;
				this.play("after_chest_shoot_mg_right",200)
			}
			else{
				offset = legs.p.w * -1;
				speed = -this.p.projectileSpeed;
				this.play("after_chest_shoot_mg_left",200)
			}
			this.stage.insert(new Q.mhProjectile({
				x: this.p.x + offset,
				y: this.p.y + y_offset,
				vx: speed
			}));
			
			Q.state.dec("gun",1);
			if(Q.state.get("gun") == 0) this.disableMachineGun();

		},

		upMgShooting: function(){
			let offset = 0;
			let speed = 0;

			let y_offset = -2 + Math.floor(Math.random() * (10 - 0)) + 0;

			let legs = Q("RossiLegs");
			legs = legs.items[0];
			Q.audio.play("rossi_shot_HM.mp3", {loop: false});
			
			if (!legs.lookback){
				offset = legs.p.h * -1;
				speed = -this.p.projectileSpeed;
				this.play("after_chest_shoot_mg_up_right",200)
			}
			else{
				offset = legs.p.h * -1;
				speed = -this.p.projectileSpeed;
				this.play("after_chest_shoot_mg_up_left",200)
			}
			this.stage.insert(new Q.mhUpProjectile({
				x: this.p.x + y_offset,
				y: this.p.y + offset,
				vy: speed
			}));
			
			Q.state.dec("gun",1);
			if(Q.state.get("gun") == 0) this.disableMachineGun();

		},

		shootStop: function(){
			this.p.onShoot = false;
			this.p.vS = false;
		},

		getMachineGun: function(){
			this.p.mg = true;
			Q.state.inc("gun",50);
			Q.state.inc("gunType",1);

			this.p.sheet = "normalHM";
			this.size(true);
		},

		disableMachineGun: function(){
			this.p.mg = false;
			Q.state.dec("gunType",1);

			this.p.sheet = "normal";
			this.size(true);
		},

	})


	// PROYECTIL DE PISTOLA

	Q.Sprite.extend("gunProjectile", {
        init: function(p) {
            this._super(p, {
                asset: "enemy_bullet.png",
                x: p.x,
                y: p.y,
                vx: p.vx,
                gravity: 0
            });
            this.add("2d");
            this.on("hit", function(collision){
                projectileDoDamage(collision, 1, this);
            });
        }
    })

	Q.Sprite.extend("gunUpProjectile", {
        init: function(p) {
            this._super(p, {
                asset: "enemy_bullet.png",
                x: p.x,
                y: p.y,
                vy: p.vy,
                gravity: 0
            });
            this.add("2d");
            this.on("hit", function(collision){
                projectileDoDamage(collision, 1, this);
            });
        }
    })

	// PROYECTIL DE MACHINEGUN

	Q.Sprite.extend("mhProjectile", {
		init: function(p) {
			let as = "mg_bullet.png"
			if(p.vx < 0){
				as = "mg_bullet_left.png"
			}
			this._super(p, {
				asset: as,
				x: p.x,
				y: p.y,
				vx: p.vx,
				gravity: 0
			});
			this.add("2d");
			this.on("hit", function(collision){
				projectileDoDamage(collision, 2, this);
			});
		}
	})

	Q.Sprite.extend("mhUpProjectile", {
		init: function(p) {
			this._super(p, {
				asset: "mg_bullet_up.png",
				x: p.x,
				y: p.y,
				vy: p.vy,
				gravity: 0
			});
			this.add("2d");
			this.on("hit", function(collision){
				projectileDoDamage(collision, 2, this);
			});
		}
	})

	function projectileDoDamage(collision, damage, obj){
		if(collision.obj.isA("RifleSoldier") ||
			collision.obj.isA("TrueRifleSoldier") ||	
			collision.obj.isA("Helicopter") ||
			collision.obj.isA("obstacle")){
			collision.obj.takeDamage(damage);
			obj.destroy();    
		}
		if (!collision.obj.isA("gunProjectile") && 
		!collision.obj.isA("HelicopterProjectile") && 
		!collision.obj.isA("allenProjectile") && 
		!collision.obj.isA("TileLayer") && 
		!collision.obj.isA("testProjectile") &&
		!collision.obj.isA("Prisoner") &&
		!collision.obj.isA("HelicopterProjectile") &&
		!collision.obj.isA("allenProjectile") &&
		!collision.obj.isA("LevelEnd")){
			Q.state.inc("score", 100);
		}
		obj.destroy();
	}
}
