function add_enemies(Q){

	////////////////////////////////////////
	// DEFAULT ENEMY
	////////////////////////////////////////

	Q.component("defaultEnemy", {
        added: function() {},
        extend: {
            die: function() {
                Q.audio.play("kill_enemy.mp3");
				this.p.vx = 0;
				this.p.vy = 0;
				this.animate(this.play("morir"), 0.6, Q.Easing.Linear, {callback: this.dead});
            },
			dead: function(){
				this.destroy();
			}
        }
    });

    ////////////////////////////////////////
	// TEST PROJECTILE
	////////////////////////////////////////

	Q.Sprite.extend("testProjectile", {
		init: function(p) {
			this._super(p, {
				asset: "1up.png",
				x: p.x,
				y: p.y,
				vx: p.vx,
				gravity: 0
			});
			this.add("2d");
			this.on("hit", function(collision){
				if(collision.obj.isA("Mario")){
					if(Q.state.get("lives") > 0){
						collision.obj.p.vy = -200;
						collision.obj.p.vx = collision.normalX*-500;
						collision.obj.p.x+= collision.normalX*-20;
					}
					collision.obj.die();
				}
				this.destroy();	
			});
		}
	})

	////////////////////////////////////////
	// MELEE ENEMY
	////////////////////////////////////////

	Q.component("meleeEnemy", {
		added: function() {
			this.entity.on("bump.left, bump.right", this, "startAttack")
			this.entity.p.isAttacking = false;
		},
		startAttack: function(collision){
			if(collision.obj.isA("Mario")){
				let entity = this.entity;
				if(!entity.p.isAttacking){
					entity.p.isAttacking = true;
					let directionsNames = Object.keys(directions);
					entity.p.sheet = "melee";
					entity.size(true);
					entity.play(`melee_${directionsNames[entity.p.direction]}`);
				}
			}
		},
		extend: {
			melee: function(){
				let mario = Q("Mario", 0);
				if(mario.length > 0){
					if(Math.abs(this.p.x - mario.items[0].p.x) < this.p.w){
						mario.items[0].die();
						let directionsNames = Object.keys(directions);
						this.p.sheet = "run";
						this.size(true);
						this.play(`run_${directionsNames[this.p.direction]}`);
					}
				}
				this.p.isAttacking = false;
			}
		}
	})

    ////////////////////////////////////////
	// SHOOTER ENEMY
	////////////////////////////////////////

	Q.component("shooterEnemy", {
		added: function(){
			this.entity.on("step", this, "step");
			this.entity.p.shootCooldown = 3;
			this.entity.p.detectionRangeX = 300;
			this.entity.p.detectionRangeY = this.entity.p.h;
			this.entity.p.shootTimer = this.entity.p.shootCooldown;
			this.entity.p.isShooting = false;
			this.entity.p.stop = false;
		},
		step: function(dt){
			let mario = Q("Mario", 0);
			let entity = this.entity;
			if(mario.length > 0){
				entity.p.shootTimer += dt;
				if(Math.abs(entity.p.x - mario.items[0].p.x) < entity.p.detectionRangeX && 
					Math.abs(entity.p.y - mario.items[0].p.y) < entity.p.detectionRangeY){
					if(entity.has("aiBounce")){
						entity.del("aiBounce");
						entity.p.stop = true;
					}
					if(mario.items[0].p.x < entity.p.x){
						entity.p.direction = directions.left;
					}
					else{
						entity.p.direction = directions.right;
					}
				}
				else{
					if(!entity.has("aiBounce")){
						entity.add("aiBounce");
						entity.p.stop = false;
					}
				}

				if(entity.p.stop){
					if(entity.p.vx != 0){
						entity.p.vx = 0;
					}
					if(!entity.p.isShooting && !entity.p.isAttacking){
						entity.p.isShooting = true;
						let directionsNames = Object.keys(directions);
						entity.p.sheet = "shoot";
						entity.size(true);
						entity.play(`before_shoot_${directionsNames[entity.p.direction]}`);
					}

				}
				else if(entity.p.vx == 0){
					entity.p.isShooting = false;
					entity.p.vx = entity.p.speed;
					let directionsNames = Object.keys(directions);
					entity.p.sheet = "run";
					entity.size(true);
					entity.play(`run_${directionsNames[entity.p.direction]}`);
				}
				//console.log("component is shooting", this.entity.p.isShooting);
			}
		},
		extend: {
			shoot: function(){
				console.log("firing ", this.p.direction);
				let offset = 0;
				let speed = 0;
				if (this.p.direction == directions.right){
					offset = this.p.w / 2;
					speed = 100;
				}
				else{
					offset = (this.p.w / 2) * -1;
					speed = -100;
				}
				this.stage.insert(new Q.testProjectile({
					x: this.p.x + offset,
					y: this.p.y - 6,
					vx: speed,
					scale: 0.2
				}));
				this.p.shootTimer = 0;
				let directionsNames = Object.keys(directions);
				this.play(`after_shoot_${directionsNames[this.p.direction]}`);
			}
		}
	})

	////////////////////////////////////////
	// RIFLE SOLDIER
	////////////////////////////////////////

	/*
	Q.animations("mario_anim",{
		walk_right: {frames: [1,2,3],rate: 1/6, next: "parado_r" },
		walk_left: {frames: [15,16,17],rate: 1/6, next: "parado_l" },
		jump_right: {frames: [4],rate: 1/6, next: "parado_r" },
		jump_left: {frames: [18],rate: 1/6, next: "parado_l" },
		parado_r: {frames: [0] },
		parado_l: {frames: [14] },
		morir:{frames: [12], loop:false,rate:1, trigger: "marioDies"}
	});

	
	Q.animations("goomba_anim", {
		move: { frames: [0, 1], rate: 1/3, loop:true},
		morir: { frames: [2], loop:false, trigger: "deadGoomba" }
	});
	*/

	Q.animations("rifleSoldier", {
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
		stand_left: {
			frames: [0,1,2,3,4,5,6,7,8,9,10,11],
			rate: 1 / 10,
			flip: false,
			loop: true
		},
		stand_right: {
			frames: [0,1,2,3,4,5,6,7,8,9,10,11],
			rate: 1 / 10,
			flip: "x",
			loop: true
		},
		before_shoot_left: {
			frames: [0,1,2,3,4,5],
			rate: 1 / 10,
			flip: false,
			loop: false,
			trigger: "shoot"
		},
		after_shoot_left: {
			frames: [6,7,8,4,3,2,1,0],
			rate: 1 / 10,
			flip: false,
			loop: false,
			next: "before_shoot_left"
		},
		before_shoot_right: {
			frames: [0,1,2,3,4,5],
			rate: 1 / 10,
			flip: "x",
			loop: false,
			trigger: "shoot"
		},
		after_shoot_right: {
			frames: [6,7,8,4,3,2,1,0],
			rate: 1 / 10,
			flip: "x",
			loop: false,
			next: "before_shoot_right"
		},
		die_left: {
			frames: [0,1,2,3,4,5,6,7,8,9,10,11,12],
			rate: 1 / 10,
			flip: "x",
			loop: false,
			trigger: "die"
		},
		die_right: {
			frames: [0,1,2,3,4,5,6,7,8,9,10,11,12],
			rate: 1 / 10,
			flip: false,
			loop: false,
			trigger: "die"
		},
		melee_left: {
			frames: [0,1,2,3,4],
			rate: 1 / 10,
			flip: false,
			loop: false,
			trigger: "melee"
		},
		melee_right: {
			frames: [0,1,2,3,4],
			rate: 1 / 10,
			flip: "x",
			loop: false,
			trigger: "melee"
		}
	})

	Q.Sprite.extend("RifleSoldier", {
		init: function(p) {
			this._super(p, {
				sprite: "rifleSoldier",
				sheet: "run",
				frame: 0,
				vx: 100,
				speed: 100,
				isDead: false,
				direction: directions.right,
				stop: false
			});

			this.add("2d, aiBounce, animation, defaultEnemy, tween, meleeEnemy, shooterEnemy");
			this.on("shoot", this, "shoot");
			this.on("melee", this, "melee");
		},
		step: function(dt){
			if(this.p.vx > 0){
				this.play("run_right");
				if(this.p.direction != directions.right) this.p.direction = directions.right;
			}
			else if(this.p.vx < 0){
				this.play("run_left");
				if(this.p.direction != directions.left) this.p.direction = directions.left;
			}
		}
	})

	////////////////////////////////////////
	//GOOMBA
	////////////////////////////////////////

	const directions = {
		up: 0,
		right: 1,
		down: 2,
		left: 3
	};

	Q.Sprite.extend("Goomba", {
		init: function(p) {
			this._super(p,{
				sheet: "goomba",
				sprite: "goomba_anim",
				x: 400+(Math.random()*200),
				y: 250,
				frame: 0,
				vx: 100,
				speed: 100,
				isDead: false,
				reload: 0,
				direction: directions.right
			});
			
			this.add("2d, aiBounce, animation, defaultEnemy, tween, shooterEnemy");
			this.on("deadGoomba", "die");
		},
		/*onTop: function(collision){
			if(!collision.obj.isA("Mario")) return;
			collision.obj.p.vy = -300;
			console.log("Goomba dies");
			this.p.isDead = true;
			this.die();
		},*/
		step: function(dt){
			if(this.p.vx > 0 && this.p.direction != directions.right){
				this.p.direction = directions.right;
			}
			else if(this.p.vx < 0 && this.p.direction != directions.left){
				this.p.direction = directions.left;
			}
			if(!this.p.isDead){
				this.play("move");
			}
		}
	});
}

