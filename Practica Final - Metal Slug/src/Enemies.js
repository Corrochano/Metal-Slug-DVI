function add_enemies(Q){

	////////////////////////////////////////
	// DEFAULT ENEMY
	////////////////////////////////////////

	Q.component("defaultEnemy", {
        added: function() {},
        extend: {
            takeDamage: function(damage) {
                this.p.health -= damage;
				if(this.p.health <= 0){
					switch(this.className){
						case "Helicopter":
							Q.audio.play("explosion.mp3", {loop:false});
							break;
						case "AllenBoss":
							Q.audio.play("allen_die.mp3", {loop:false}); 
							break;
						
						default:
							Q.audio.play("rebel_scream.mp3", {loop:false});
							break;
					}
				}
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
				
				switch(this.className){
					case "RifleSoldier":
						this.p.sheet = "melee";
						this.size(true);
						break;
					case "TrueRifleSoldier":
						this.p.sheet = "melee_rifle";
						this.size(true);
						break;
					case "ShieldSoldier":
						this.p.sheet = "espada";
						this.size(true);
						break;
					default:
						break;
				}
			
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
					if(rossiLegs.p.move && 
						Math.abs(this.p.x - rossiLegs.p.x) < this.p.detectionRangeX && 
						Math.abs(this.p.y - rossiLegs.p.y) < this.p.detectionRangeY){
						return true;
					}
				}
				return false;
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
				
				switch(this.className){
					case "RifleSoldier":
						this.p.sheet = "shoot";
						this.size(true);
						break;
					case "TrueRifleSoldier":
						this.p.sheet = "shoot_rifle";
						this.size(true);
						break;
					default:
						break;
				}
				
				
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
		},
		step: function(dt) {
			let entity = this.entity;
			if(entity.state != enemyStates.dead && entity.p.health > 0){
				if(entity.p.state == enemyStates.stand || entity.p.state == enemyStates.patrol){
					if(entity.has("meleeEnemy") && entity.checkIfInMeleeRange()){
						entity.p.state = enemyStates.melee;
					}
					else if((entity.has("shooterEnemy") || entity.isA("AllenBoss")) && entity.checkIfInShootRange()){
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
							switch(entity.className){
								case "RifleSoldier":
									entity.p.sheet = "stand";
									entity.size(true);
									break;
									
								case "AllenBoss":
									entity.p.sheet = "allen_stand";
									entity.size(true);
									break;
								case "TrueRifleSoldier":
									entity.p.sheet = "stand_rifle";
									entity.size(true);
									break;
								case "ShieldSoldier":
									entity.p.sheet = "quietoS";
									entity.size(true);
									break;
								case "Helicopter":
									entity.p.sheet = "helicopteroR";
									entity.size(true);
									break;
								default:
									break;
							}
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

						switch(entity.className){
							case "RifleSoldier":
								entity.p.sheet = "die";
								entity.size(true);
								break;
							case "AllenBoss":
								entity.p.sheet = "allen_dead_1";
								entity.size(true);
								break;
							case "Helicopter":
								entity.p.sheet = "big_explosion";
								entity.size(true);
								entity.play("explosion");
								return;
							default:
								entity.p.sprite = "rifleSoldier";
								entity.p.sheet = "die";
								entity.size(true);
								break;
								
						}
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
			frames: [0,1,2,3,4,5,6,7,8],
			rate: 1 / 15,
			flip: false,
			loop: false,
			trigger: "meleeAttack"
		},
		after_melee_left: {
			frames: [11,12,13,10,9,8,7,6,5,4,3,2,1,0],
			rate: 1 / 15,
			flip: false,
			loop: false,
			trigger: "reset"
		},
		before_melee_right: {
			frames: [0,1,2,3,4,5,6,7,8],
			rate: 1 / 15,
			flip: "x",
			loop: false,
			trigger: "meleeAttack"
		},
		after_melee_right: {
			frames: [11,12,13,10,9,8,7,6,5,4,3,2,1,0],
			rate: 1 / 15,
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
		checkIfInMeleeRange: function() {
			let rossiLegs = Q("RossiLegs", 0);
			if(rossiLegs.length > 0){
				rossiLegs = rossiLegs.items[0];
				if(rossiLegs.p.move && 
					Math.abs(this.p.x - rossiLegs.p.x) <= this.p.w && 
					Math.abs(this.p.y - rossiLegs.p.y) <= this.p.h){
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
	//ALLEN
	////////////////////////////////////////

	Q.animations("allenBoss", {
		run_left: {
			frames: [0,1,2,3,4,5,6,7,8,9],
			rate: 1 / 15,
			flip: "x",
			loop: true
		},
		run_right: {
			frames: [0,1,2,3,4,5,6,7,8,9],
			rate: 1 / 15,
			flip: false,
			loop: true
		},
		stand_left: {
			frames: [0,1,2,3,4,3,4,3,4,3,2,1],
			rate: 1 / 10,
			flip: "x",
			loop: false,
			trigger: "reset_ammo"
		},
		stand_right: {
			frames: [0,1,2,3,4,3,4,3,4,3,2,1],
			rate: 1 / 10,
			flip: false,
			loop: false,
			trigger: "reset_ammo"
		},
		before_shoot_left: { // Primera bala
			frames: [0,1],
			rate: 1 / 10,
			flip: "x",
			loop: false,
			trigger: "shootProjectile"
		},
		after_shoot_left_1: { // Segunda bala
			frames: [2,3],
			rate: 1 / 10,
			flip: "x",
			loop: false,
			trigger: "shootProjectile2"
		},
		after_shoot_left_2: { // Tercera bala
			frames: [4,5],
			rate: 1 / 10,
			flip: "x",
			loop: false,
			trigger: "shootProjectile3"
		},
		after_shoot_left_3: { // Final de animación
			frames: [6,7],
			rate: 1 / 10,
			flip: "x",
			loop: false,
			trigger: "reset"
		},
		before_shoot_right: { // Primera bala
			frames: [0,1],
			rate: 1 / 10,
			flip: false,
			loop: false,
			trigger: "shootProjectile"
		},
		after_shoot_right_1: { // Segunda bala
			frames: [2,3],
			rate: 1 / 10,
			flip: false,
			loop: false,
			trigger: "shootProjectile2"
		},
		after_shoot_right_2: { // Tercera bala
			frames: [4,5],
			rate: 1 / 10,
			flip: false,
			loop: false,
			trigger: "shootProjectile3"
		},
		after_shoot_right_3: { // Final anim
			frames: [6,7],
			rate: 1 / 10,
			flip: false,
			loop: false,
			trigger: "reset"
		},
		die_right: {
			frames: [0,1,2,3,4,5,6,7,8,9,10,11],
			rate: 1 / 5,
			flip: false,
			loop: false,
			trigger: "die"
		},
		die_left: {
			frames: [0,1,2,3,4,5,6,7,8,9,10,11],
			rate: 1 / 5,
			flip: "x",
			loop: false,
			trigger: "die"
		},
		reload_right: {
			frames: [0,1,2,3,4,5,6,7,8],
			rate: 1 / 5,
			flip: false,
			loop: false,
			trigger: "reset_ammo"
		},
		reload_left: {
			frames: [0,1,2,3,4,5,6,7,8],
			rate: 1 / 5,
			flip: "x",
			loop: false,
			trigger: "reset_ammo"
		},
		jump_left: {
			frames: [0,1,2,3],
			rate: 1 / 20,
			flip: "x",
			loop: false
		},
		jump_right: {
			frames: [0,1,2,3],
			rate: 1 / 20,
			flip: false,
			loop: false
		}
	})

	let ACOOLDOWN = 3;

	Q.Sprite.extend("AllenBoss", {
		init: function(p) {
			this._super(p, {
				sprite: "allenBoss",
				sheet: "allen_stand",
				frame: 0,
				vx: 120,
				speed: 120,
				direction: directions.right,
				projectileSpeed: 100,
				health: 80,
				state: enemyStates.patrol,
				detectionRangeX: 300,
				cooldown: 0,
			});
			
			this.add("2d, animation, defaultEnemy, tween, enemyBehaviourController");
			this.on("reset", this, "reset");
			this.on("reset_ammo", this, "reset_ammo");
			this.on("die", this, "die");
			this.on("shootProjectile", this, "shootProjectile");
			this.on("shootProjectile2", this, "shootProjectile2");
			this.on("shootProjectile3", this, "shootProjectile3");
			this.on("bump.left", this, "onLeft");
			this.on("bump.right", this, "onRight");
			this.on("bump.bottom", this, "onBottom");
			this.on("bump.top", this, "onTop");
		},
		onTop: function(collision){
			if(collision.obj.isA("RossiLegs")){
				collision.obj.die();
			}
		},
		onBottom: function(collision){
			if(collision.obj.isA("RossiLegs")){
				collision.obj.die();
			}
		},
		onLeft: function(collision){
			if (collision.obj.isA("gunUpProjectile") || collision.obj.isA("gunProjectile") ||
				collision.obj.isA("mhProjectile") || collision.obj.isA("mhUpProjectile")){

				if(collision.obj.isA("gunUpProjectile") || collision.obj.isA("gunProjectile")){
					this.takeDamage(1);
				}
				else if(collision.obj.isA("mhProjectile") || collision.obj.isA("mhUpProjectile")){
					this.takeDamage(2);
				}
				return;
			}
			else if(collision.obj.isA("RossiLegs")){
				collision.obj.die();
			}
			else{
				this.p.vx = collision.impact;
				this.p.direction == directions.right;
			}
		},	
		onRight: function(collision){
			if (collision.obj.isA("gunUpProjectile") || collision.obj.isA("gunProjectile") ||
				collision.obj.isA("mhProjectile") || collision.obj.isA("mhUpProjectile")){

				if(collision.obj.isA("mhProjectile") || collision.obj.isA("mhUpProjectile")){			
					this.takeDamage(2);
				}
				
				if(collision.obj.isA("gunUpProjectile") || collision.obj.isA("gunProjectile")){
					this.takeDamage(1);
				}
				return;
			}
			else if(collision.obj.isA("RossiLegs")){
				collision.obj.die();
			}
			else{
				this.p.vx = -collision.impact;		
				this.p.direction == directions.left;
			}
		},	
		patrol: function() {
			if(this.p.vx == 0){
				if(this.p.direction == directions.right) this.p.vx = this.p.speed;
				else this.p.vx = -this.p.speed;
			}
			else if(this.p.vx > 0) this.p.direction = directions.right;
			else this.p.direction = directions.left;
			let directionsNames = Object.keys(directions);
			this.p.sheet = "allenR";
			this.size(true);
			this.play(`run_${directionsNames[this.p.direction]}`);
		},
		reset: function() {
			this.p.state = enemyStates.patrol;
			this.p.doingAction = false;
		},
		reset_ammo: function() {
			this.p.cooldown = 0;
			this.p.state = enemyStates.patrol;
			this.p.doingAction = false;
		},
		die: function() {
			Q.stageScene("endMenu", 2, { label: "You Win!" });
			this.destroy();
		},
		shootProjectile: function(){
			let offset = 0;
			let speed = 0;
			
			let behaviour = Math.floor(Math.random() * (4 - 1)) + 1;;
			if(behaviour === 1){
				this.p.cooldown = ACOOLDOWN;
				this.p.sheet="allen_stand";
				let directionsNames = Object.keys(directions);
				this.play(`stand_${directionsNames[this.p.direction]}`);
				Q.audio.play("allen_laugh.mp3", {loop: false});
				return;
			}

			Q.audio.play("allen_shot.mp3", {loop:true});
			if (this.p.direction == directions.right){
				offset = this.p.w / 2;
				speed = this.p.projectileSpeed;
			}
			else{
				offset = (this.p.w / 2) * -1;
				speed = -this.p.projectileSpeed;
			}
			this.stage.insert(new Q.allenProjectile({
				x: this.p.x + offset,
				y: this.p.y - 2,
				vx: speed
			}));

			if(behaviour == 2 && this.p.cooldown === 0){
				Q.audio.play("allen_go_to.mp3", {loop: false});
			}
			else if(behaviour == 3 && this.p.cooldown === 0){
				Q.audio.play("allen_come_on.mp3", {loop: false});
			}
			let directionsNames = Object.keys(directions);
			this.play(`after_shoot_${directionsNames[this.p.direction]}_1`);
			
		},
		shootProjectile2: function(){
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
				this.stage.insert(new Q.allenProjectile({
					x: this.p.x + offset,
					y: this.p.y,
					vx: speed
				}));
				let directionsNames = Object.keys(directions);
				this.play(`after_shoot_${directionsNames[this.p.direction]}_2`);
		},
		shootProjectile3: function(){
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
				this.stage.insert(new Q.allenProjectile({
					x: this.p.x + offset,
					y: this.p.y + 3,
					vx: speed
				}));
				let directionsNames = Object.keys(directions);
				this.play(`after_shoot_${directionsNames[this.p.direction]}_3`);
				this.p.cooldown += 1;
				Q.audio.stop("allen_shot.mp3");
		},
		checkIfInShootRange: function() {

			let detectionRangeY = this.p.h

			let rossiLegs = Q("RossiLegs", 0);
			if(rossiLegs.length > 0){
				rossiLegs = rossiLegs.items[0];
				if(Math.abs(this.p.x - rossiLegs.p.x) < this.p.detectionRangeX && 
					Math.abs(this.p.y - rossiLegs.p.y) < detectionRangeY){
					return true;
				}
			}
			return false;
		},
		shootAction: function(){
			let directionsNames = Object.keys(directions);
			if(this.p.cooldown == ACOOLDOWN){
				this.p.sheet = "allen_reload";
				this.p.vx = 0;
				this.size(true);
				Q.audio.play("allen_reload.mp3" , {loop: false});
				this.play(`reload_${directionsNames[this.p.direction]}`);
			}
			else{
				if(this.p.vx != 0) this.p.vx = 0;
				let rossiLegs = Q("RossiLegs", 0);
				if(rossiLegs.length > 0){
					rossiLegs = rossiLegs.items[0];
					if(rossiLegs.p.x > this.p.x) this.p.direction = directions.right;
					else this.p.direction = directions.left;
				}
				this.p.sheet = "allen_shooting";
				this.size(true);
				this.play(`before_shoot_${directionsNames[this.p.direction]}`);
			}
		}

	})

	//////////////////////////////////
	/// ALLEN PROJECTILE
	//////////////////////////////////

	Q.Sprite.extend("allenProjectile", {
		init: function(p) {
			this._super(p, {
				asset: "allen_bullet.png",
				frame: 0,
				x: p.x,
				y: p.y,
				vx: p.vx + 50,
				gravity: 0
			});
			this.add("2d");
			this.on("hit", function(collision){
				if(collision.obj.isA("RossiLegs")){	
					collision.obj.die();
				}
				this.destroy();	
			});
		}
	})
  
	////////////////////////////////////////
	// TRUE RIFLE SOLDIER
	////////////////////////////////////////

	Q.animations("trueRifleSoldier", {
		run_left: {
			frames: [0,1,2,3,4,5,6,7,8,9,10],
			rate: 1 / 15,
			flip: false,
			loop: true
		},
		run_right: {
			frames: [0,1,2,3,4,5,6,7,8,9,10],
			rate: 1 / 15,
			flip: "x",
			loop: true
		},
		stand_left: {
			frames: [0,1,2,3,4,4,3,2,1],
			rate: 1 / 15,
			flip: false,
			loop: true
		},
		stand_right: {
			frames: [0,1,2,3,4,4,3,2,1],
			rate: 1 / 15,
			flip: "x",
			loop: true
		},
		before_shoot_left: {
			frames: [0,1],
			rate: 1 / 5,
			flip: false,
			loop: false,
			trigger: "shootProjectile"
		},
		after_shoot_left: {
			frames: [2,3,4,1,0],
			rate: 1 / 5,
			flip: false,
			loop: false,
			trigger: "reset"
		},
		before_shoot_right: {
			frames: [0,1],
			rate: 1 / 5,
			flip: "x",
			loop: false,
			trigger: "shootProjectile"
		},
		after_shoot_right: {
			frames: [2,3,4,1,0],
			rate: 1 / 5,
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

	Q.Sprite.extend("TrueRifleSoldier", {
		init: function(p) {
			this._super(p, {
				sprite: "trueRifleSoldier",
				sheet: "run_rifle",
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
		checkIfInMeleeRange: function() {
			let rossiLegs = Q("RossiLegs", 0);
			if(rossiLegs.length > 0){
				rossiLegs = rossiLegs.items[0];
				if(rossiLegs.p.move && 
					Math.abs(this.p.x - rossiLegs.p.x) <= this.p.w && 
					Math.abs(this.p.y - rossiLegs.p.y) <= this.p.h){
					return true;
				}
			}
			return false;
		},
		shootProjectile: function(){
			let offset = 0;
			let speed = 0;
			if (this.p.direction == directions.right){
				offset = (this.p.w / 2) + 5;
				speed = this.p.projectileSpeed;
			}
			else{
				offset = ((this.p.w / 2) * -1) - 5;
				speed = -this.p.projectileSpeed;
			}

			this.stage.insert(new Q.testProjectile({
				x: this.p.x + offset ,
				y: this.p.y - 6,
				vx: speed
			}));
			let directionsNames = Object.keys(directions);
			this.play(`after_shoot_${directionsNames[this.p.direction]}`);
		},
		patrol: function() {
			if(this.p.vx == 0) this.p.vx = this.p.speed;
			else if(this.p.vx > 0) this.p.direction = directions.right;
			else this.p.direction = directions.left;
			let directionsNames = Object.keys(directions);
			this.p.sheet = "run_rifle";
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
	// SHIELD SOLDIER
	////////////////////////////////////////

	Q.animations("shieldSoldier", {
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
			frames: [0,1,2,3,4,5,5,4,3,2,1],
			rate: 1 / 15,
			flip: false,
			loop: true
		},
		stand_right: {
			frames: [0,1,2,3,4,5,5,4,3,2,1],
			rate: 1 / 15,
			flip: "x",
			loop: true
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
			frames: [0,1,2,3,4,5,6,7],
			rate: 1 / 10,
			flip: false,
			loop: false,
			trigger: "meleeAttack"
		},
		after_melee_left: {
			frames: [4,3,2,1,0],
			rate: 1 / 10,
			flip: false,
			loop: false,
			trigger: "reset"
		},
		before_melee_right: {
			frames: [0,1,2,3,4,5,6,7],
			rate: 1 / 10,
			flip: "x",
			loop: false,
			trigger: "meleeAttack"
		},
		after_melee_right: {
			frames: [4,3,2,1,0],
			rate: 1 / 10,
			flip: "x",
			loop: false,
			trigger: "reset"
		}
	})

	Q.Sprite.extend("ShieldSoldier", {
		init: function(p) {
			this._super(p, {
				sprite: "shieldSoldier",
				sheet: "moveS",
				frame: 0,
				vx: 100,
				speed: 100,
				direction: directions.right,
				projectileSpeed: 100,
				health: 1,
				state: enemyStates.patrol
			});

			this.add("2d, animation, defaultEnemy, tween, meleeEnemy, enemyBehaviourController");
			this.on("meleeAttack", this, "meleeAttack");
			this.on("bump.left", this, "onLeft");
			this.on("bump.right", this, "onRight");
			this.on("reset", this, "reset");
			this.on("die", this, "die");
		},
		checkIfInMeleeRange: function() {
			let rossiLegs = Q("RossiLegs", 0);
			if(rossiLegs.length > 0){
				rossiLegs = rossiLegs.items[0];
				if(rossiLegs.p.move && 
					Math.abs(this.p.x - rossiLegs.p.x) <= 60 && 
					Math.abs(this.p.y - rossiLegs.p.y) <= 50){
					return true;
				}
			}
			return false;
		},
		onLeft: function(collision){
			if (collision.obj.isA("gunUpProjectile") || collision.obj.isA("gunProjectile") ||
				collision.obj.isA("mhProjectile") || collision.obj.isA("mhUpProjectile")){
				if(this.p.direction == directions.left) return;

				if(collision.obj.isA("gunUpProjectile") || collision.obj.isA("gunProjectile")){
					this.takeDamage(1);
				}
				else if(collision.obj.isA("mhProjectile") || collision.obj.isA("mhUpProjectile")){
					this.takeDamage(2);
				}
				return;
			}
			else{
				this.p.vx = collision.impact;
				this.p.direction == directions.right;
			}
		},	
		onRight: function(collision){
			if (collision.obj.isA("gunUpProjectile") || collision.obj.isA("gunProjectile") ||
				collision.obj.isA("mhProjectile") || collision.obj.isA("mhUpProjectile")){
				if(this.p.direction == directions.right) return;

				if(collision.obj.isA("mhProjectile") || collision.obj.isA("mhUpProjectile")){			
					this.takeDamage(2);
				}
				
				if(collision.obj.isA("gunUpProjectile") || collision.obj.isA("gunProjectile")){
					this.takeDamage(1);
				}
				return;
			}
			else{
				this.p.vx = -collision.impact;		
				this.p.direction == directions.left;
			}
		},	
		patrol: function() {
			if(this.p.vx == 0){
				if(this.p.direction == directions.right) this.p.vx = this.p.speed;
				else this.p.vx = -this.p.speed;
			}
			else if(this.p.vx > 0) this.p.direction = directions.right;
			else this.p.direction = directions.left;
			let directionsNames = Object.keys(directions);
			this.p.sheet = "moveS";
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
	// HELICOPTER
	////////////////////////////////////////

	Q.animations("helicopter", {
		standH: {
			frames: [0,1,2,3,4],
			rate: 1 / 50,
			flip: false,
			loop: true
		},
		explosion: {
			frames: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27],
			rate: 1 / 15,
			flip: false,
			loop: false,
			trigger: "die"
		}
	})

	const MAXHMOVE = 100;
	const HCOOLDOWN = 200;

	Q.Sprite.extend("Helicopter", {
		init: function(p) {
			this._super(p, {
				sprite: "helicopter",
				sheet: "helicopteroR",
				frame: 0,
				vx: 100,
				speed: 100,
				direction: directions.right,
				projectileSpeed: 100,
				health: 1,
				state: enemyStates.patrol,
				initX: 0,
				inicio: true,
				gravity: 0,
				health: 5,
				cooldown: 0
			});

			this.add("2d, animation, defaultEnemy, tween, enemyBehaviourController");
			this.on("bump.left", this, "OnLeft");
			this.on("bump.right", this, "OnRight");
			this.on("bump.bottom", this, "OnBottom");
			this.on("reset", this, "reset");
			this.on("die", this, "die");
		},
		OnLeft: function(collision){	
			if(collision.obj.isA("RossiLegs")){
				collision.obj.die();
			}
		},
		OnRight: function(collision){	
			if(collision.obj.isA("RossiLegs")){
				collision.obj.die();
			}
		},
		OnBottom: function(collision){	
			if(collision.obj.isA("RossiLegs")){
				collision.obj.die();
			}
		},
		patrol: function() {
			if(this.p.inicio){this.p.initX = this.p.x; this.p.inicio = false}
			if(this.p.vx == 0){
				if(this.p.direction == directions.right) this.p.vx = this.p.speed;
				else this.p.vx = -this.p.speed;
			}
			else if(this.p.vx > 0) this.p.direction = directions.right;
			else this.p.direction = directions.left;

			if(this.p.x < this.p.initX - MAXHMOVE){
				this.p.vx = this.p.speed;
				this.p.direction = directions.right;
			}
			else if(this.p.x > this.p.initX + MAXHMOVE){
				this.p.vx = -this.p.speed;
				this.p.direction = directions.left;
			}
			this.play("standH");

			if(this.p.cooldown == HCOOLDOWN){
				let speed = this.p.projectileSpeed;
				this.stage.insert(new Q.testProjectile({
					x: this.p.x,
					y: this.p.y + 60,
					vy: speed
				}));
				this.p.cooldown = 0;
			}
			else{
				this.p.cooldown += 1;
			}

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
	// HELICOPTER PROJECTILE
	////////////////////////////////////////

	Q.Sprite.extend("HelicopterProjectile", {
		init: function(p) {
			this._super(p, {
				asset: "enemy_bullet.png",
				frame: 0,
				x: p.x,
				y: p.y,
				vy: p.vy,
				gravity: 0
			});
			this.add("2d");
			this.on("hit", function(collision){
				if(collision.obj.isA("RossiLegs")){
					collision.obj.die();
				}
				this.destroy();	
			});
		}
	})

	////////////////////////
	/// Directions
	////////////////////////
	
	const directions = {
		up: 0,
		right: 1,
		down: 2,
		left: 3
	};


}

