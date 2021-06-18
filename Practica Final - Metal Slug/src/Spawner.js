function add_spawners(Q){

	const enemies = {
		RifleSoldier: function() { return new Q.RifleSoldier() },
		TrueRifleSoldier: function() { return new Q.TrueRifleSoldier() },
		ShieldSoldier: function() { return new Q.ShieldSoldier() }
	}

	Q.Sprite.extend("Spawner", {
		init: function(p) {
			this._super(p, {
				spawnInterval: p.spawnInterval,
				spawns: p.spawns,
				totalSpawns: p.totalSpawns,
				currentSpawns: 0,
				active: false,
				activationRange: 350,
				asset: "gun_bullet.png",
				x: p.x,
				y: p.y,
				vx: p.vx,
				gravity: 0,
				type: Q.SPRITE_NONE,
				collisionMask: Q.SPRITE_NONE
			});
			this.p.spawnTimer = Math.floor(Math.random() * this.p.spawnInterval);
			this.p.spawns = this.p.spawns.split(",");
		},
		step: function(dt){
			if(this.p.active){
				if(this.p.currentSpawns < this.p.totalSpawns){
					this.p.spawnTimer += dt;
					if(this.p.spawnTimer > this.p.spawnInterval){
						let randomPos = Math.floor(Math.random() * this.p.spawns.length);
						let spawn = enemies[this.p.spawns[randomPos]]();
						spawn.p.x = this.p.x;
						spawn.p.y = this.p.y;
						this.stage.insert(spawn);
						this.p.spawnTimer = 0;
						this.p.currentSpawns++;
					}
				}
				else{
					this.destroy();
				}
			}
			else{
				let rossi = Q("RossiLegs");
				if(rossi.length > 0){
					rossi = rossi.items[0];
					if(Math.abs(rossi.p.x - this.p.x) < this.p.activationRange){
						this.p.active = true;
					}
				}
			}
		}
	})
}