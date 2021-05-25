    ////////////////////////////////////////
	// Generic NPC
	////////////////////////////////////////

	Q.component("generic_npc", {
		added: function(){
			this.entity.p.detectionRangeX = 300;
			this.entity.p.detectionRangeY = this.entity.p.h;
		},
		extend: {
			checkIfRossi: function() {
				let rossiLegs = Q("RossiLegs", 0);
				if(rossiLegs.length > 0){
					rossiLegs = rossiLegs.items[0];
					if(Math.abs(this.p.x - rossiLegs.p.x) == 0 && 
						Math.abs(this.p.y - rossiLegs.p.y) == 0){
						return true;
					}
				}
				return false;
			},
			dropObject: function(){// Soltar objeto y luego salir corriendo
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
					vx: speed,
					scale: 0.2
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