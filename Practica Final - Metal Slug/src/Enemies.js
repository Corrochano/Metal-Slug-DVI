function add_enemies(Q){

	////////////////////////////////////////
	// DEFAULT ENEMY
	////////////////////////////////////////

	Q.component("defaultEnemy", {
        added: function() {},
        extend: {
            takeDamage: function(damage) {
                this.p.health -= damage;
            }
        }
    });

    ////////////////////////////////////////
	// TEST PROJECTILE
	////////////////////////////////////////

	Q.Sprite.extend("testProjectile", {
		init: function(p) {
			this._super(p, {
				asset: "enemy_bullet.png",
				frame: 0,
				x: p.x,
				y: p.y,
				vx: p.vx,
				gravity: 0
			});
			this.add("2d");
			this.on("hit", function(collision){
				if(collision.obj.isA("RossiLegs")){	
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
		},
		extend: {
			checkIfInMeleeRange: function() {
				let rossiLegs = Q("RossiLegs", 0);
				if(rossiLegs.length > 0){
					rossiLegs = rossiLegs.items[0];
					if(Math.abs(this.p.x - rossiLegs.p.x) < this.p.w && 
						Math.abs(this.p.y - rossiLegs.p.y) < this.p.h){
						return true;
					}
				}
				return false;
			},
			meleeAttack: function(){
				let rossiLegs = Q("RossiLegs", 0);
				if(rossiLegs.length > 0){
					if(Math.abs(this.p.x - rossiLegs.items[0].p.x) < this.p.w){
						rossiLegs.items[0].die();
					}
					let directionsNames = Object.keys(directions);
					this.play(`after_melee_${directionsNames[this.p.direction]}`);
				}
			},
			meleeAction: function(){
				if(this.p.vx != 0) this.p.vx = 0;
				let rossiLegs = Q("RossiLegs", 0);
				if(rossiLegs.length > 0){
					rossiLegs = rossiLegs.items[0];
					if(rossiLegs.p.x > this.p.x) this.p.direction = directions.right;
					else this.p.direction = directions.left;
				}
				let directionsNames = Object.keys(directions);
				this.p.sheet = "melee";
				this.size(true);
				this.play(`before_melee_${directionsNames[this.p.direction]}`);
			}
		}
	})

    ////////////////////////////////////////
	// SHOOTER ENEMY
	////////////////////////////////////////

	Q.component("shooterEnemy", {
		added: function(){
			this.entity.p.detectionRangeX = 300;
			this.entity.p.detectionRangeY = this.entity.p.h;
		},
		extend: {
			checkIfInShootRange: function() {
				let rossiLegs = Q("RossiLegs", 0);
				if(rossiLegs.length > 0){
					rossiLegs = rossiLegs.items[0];
					if(Math.abs(this.p.x - rossiLegs.p.x) < this.p.detectionRangeX && 
						Math.abs(this.p.y - rossiLegs.p.y) < this.p.detectionRangeY){
						return true;
					}
				}
				return false;
			},
			shootProjectile: function(){
				let offset = 0;
				let speed = 0;
				if (this.p.direction == directions.right){
					offset = this.p.w / 2;
					speed = this.p.projectileSpeed;
				}
				else{
					offset = (this.p.w / 2) * -1;
					speed = -this.p.projectileSpeed;
				}
				this.stage.insert(new Q.testProjectile({
					x: this.p.x + offset,
					y: this.p.y - 6,
					vx: speed
				}));
				let directionsNames = Object.keys(directions);
				this.play(`after_shoot_${directionsNames[this.p.direction]}`);
			},
			shootAction: function(){
				if(this.p.vx != 0) this.p.vx = 0;
				let rossiLegs = Q("RossiLegs", 0);
				if(rossiLegs.length > 0){
					rossiLegs = rossiLegs.items[0];
					if(rossiLegs.p.x > this.p.x) this.p.direction = directions.right;
					else this.p.direction = directions.left;
				}
				let directionsNames = Object.keys(directions);
				this.p.sheet = "shoot";
				this.size(true);
				this.play(`before_shoot_${directionsNames[this.p.direction]}`);
			}
		}
	})

	////////////////////////////////////////
	// ENEMY BEHAVIOUR CONTROLLER
	////////////////////////////////////////

	// Enemy states
	const enemyStates = {
		stand: 0,
		patrol: 1,
		range: 2,
		melee: 3,
		dead: 4
	}

	Q.component("enemyBehaviourController", {
		added: function() {
			this.entity.on("step", this, "step");
			this.entity.doingAction = false;
			//this.entity.p.debug = 0;
		},
		step: function(dt) {
			let entity = this.entity;
			/*entity.p.debug += dt;
			if(entity.p.debug > 1){
				entity.p.debug = 0;
				console.log("entity state", entity.p.state);
			}*/
			if(entity.state != enemyStates.dead && entity.p.health > 0){
				if(entity.p.state == enemyStates.stand || entity.p.state == enemyStates.patrol){
					if(entity.has("meleeEnemy") && entity.checkIfInMeleeRange()){
						entity.p.state = enemyStates.melee;
					}
					else if(entity.has("shooterEnemy") && entity.checkIfInShootRange()){
						entity.p.state = enemyStates.range;
					}
				}
			}
			else{
				entity.p.state = enemyStates.dead;
				entity.p.doingAction = false;
			}

			if(!entity.p.doingAction){
				let directionsNames = Object.keys(directions);
				switch(entity.p.state){
					case enemyStates.stand:
						if(entity.p.vx != 0) {
							entity.p.vx = 0;
							entity.p.sheet = "stand";
							entity.size(true);
						}
						entity.play(`stand_${directionsNames[entity.p.direction]}`);
						break;
					case enemyStates.patrol:
						entity.patrol();
						break;
					case enemyStates.range:
						entity.shootAction();
						entity.p.doingAction = true;
						break;
					case enemyStates.melee:
						entity.meleeAction();
						entity.p.doingAction = true;
						break;
					case enemyStates.dead:
						if(entity.p.vx != 0) {
							entity.p.vx = 0;
							entity.size(true);
						}
						entity.p.sheet = "die";
						entity.play(`die_${directionsNames[entity.p.direction]}`,200);
						break;
				}
			}
		}
	});

	////////////////////////////////////////
	// RIFLE SOLDIER
	////////////////////////////////////////

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
			frames: [0,1,2,3,4,5,6,7,8,9,10,11,10,10,10,10,10,10,8,7,6,5,4,3,2,1],
			rate: 1 / 10,
			flip: false,
			loop: true
		},
		stand_right: {
			frames: [0,1,2,3,4,5,6,7,8,9,10,11,10,10,10,10,10,10,8,7,6,5,4,3,2,1],
			rate: 1 / 10,
			flip: "x",
			loop: true
		},
		before_shoot_left: {
			frames: [0,1,2,3,4,5],
			rate: 1 / 10,
			flip: false,
			loop: false,
			trigger: "shootProjectile"
		},
		after_shoot_left: {
			frames: [6,7,8,4,3,2,1,0],
			rate: 1 / 10,
			flip: false,
			loop: false,
			trigger: "reset"
		},
		before_shoot_right: {
			frames: [0,1,2,3,4,5],
			rate: 1 / 10,
			flip: "x",
			loop: false,
			trigger: "shootProjectile"
		},
		after_shoot_right: {
			frames: [6,7,8,4,3,2,1,0],
			rate: 1 / 10,
			flip: "x",
			loop: false,
			trigger: "reset"
		},
		die_left: {
			frames: [0,1,2,3,4,5,6,7,8,9,10,11,12],
			rate: 1 / 20,
			flip: "x",
			loop: false,
			trigger: "die"
		},
		die_right: {
			frames: [0,1,2,3,4,5,6,7,8,9,10,11,12],
			rate: 1 / 20,
			flip: false,
			loop: false,
			trigger: "die"
		},
		before_melee_left: {
			frames: [0,1,2],
			rate: 1 / 10,
			flip: false,
			loop: false,
			trigger: "meleeAttack"
		},
		after_melee_left: {
			frames: [3,4,3,4],
			rate: 1 / 10,
			flip: false,
			loop: false,
			trigger: "reset"
		},
		before_melee_right: {
			frames: [0,1,2],
			rate: 1 / 10,
			flip: "x",
			loop: false,
			trigger: "meleeAttack"
		},
		after_melee_right: {
			frames: [3,4,3,4],
			rate: 1 / 10,
			flip: "x",
			loop: false,
			trigger: "reset"
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
				direction: directions.right,
				projectileSpeed: 100,
				health: 1,
				state: enemyStates.patrol
			});

			this.add("2d, aiBounce, animation, defaultEnemy, tween, meleeEnemy, shooterEnemy, enemyBehaviourController");
			this.on("shootProjectile", this, "shootProjectile");
			this.on("meleeAttack", this, "meleeAttack");
			this.on("reset", this, "reset");
			this.on("die", this, "die");
		},
		patrol: function() {
			if(this.p.vx == 0) this.p.vx = this.p.speed;
			else if(this.p.vx > 0) this.p.direction = directions.right;
			else this.p.direction = directions.left;
			let directionsNames = Object.keys(directions);
			this.p.sheet = "run";
			this.size(true);
			this.play(`run_${directionsNames[this.p.direction]}`);
		},
		reset: function() {
			this.p.state = enemyStates.patrol;
			this.p.doingAction = false;
		},
		die: function() {
			this.destroy();
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
			if(!collision.obj.isA("RossiLegs")) return;
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

