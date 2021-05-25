function add_Rossi(Q) {
	Q.animations("rossi", {
		chest_stand: {
			frames: [0],
			rate: 1 / 15,
			flip: false,
			loop: true
		}
	});

	Q.Sprite.extend("RossiLegs", {

		init: function(p) {
			this._super(p,{
				sheet: "piernas",
				sprite: "rossi",
				x: 50,
				y: 200,
				frame: 0,
				scale: 1,
				move: true,
				type: Q.SPRITE_DEFAULT
			});
			this.add("2d, platformerControls, animation, tween");
			this.p.jumpSpeed = -350;
			this.on("marioDies", "die");
		},

		step: function(dt){
			//ANDANDO
			/*if(this.p.move){
				if(this.p.vx > 0){
					this.play("walk_right");
					this.lookback = false;
				}
				else if(this.p.vx < 0)
				{
					this.play("walk_left");
					this.lookback = true;
				}
				//SALTANDO
				if(this.p.vy < 0) {
					if(this.lookback){this.play("jump_left");}
					else{this.play("jump_right");}
				} else{ this.p.salto = false;}
			}*/

		},

		die: function() {
			
			if(Q.state.get("lives") >= 0){
				Q.state.dec("lives", 1);
			}
            if (Q.state.get("lives") < 0) {
				Q.audio.stop();
                Q.audio.play("music_die.mp3"); 
				this.p.move = false;
				this.stage.unfollow();
				this.del('2d, platformerControls');
				//this.play("morir");
				this.animate({y: this.p.y-100}, 0.4, Q.Easing.Linear, {callback: this.disappear});
                Q.stageScene("endMenu", 2, { label: "You lose!" });
            }
    
        },

		disappear: function(){
			this.animate({y: this.p.y+800}, 1, Q.Easing.Linear, {callback: this.Dead });
		},

		Dead: function(){
			this.destroy();
		}
	});

	Q.Sprite.extend("RossiChest", {
		init: function(p) {
			this._super(p,{
				sheet: "quietoT",
				sprite: "rossi",
				x: 50,
				y: 200,
				frame: 0,
				scale: 1,
				move: true,
				type: Q.SPRITE_NONE
			});
			this.add("animation, tween, platformerControls");
		},

		step: function(dt){
			let legs = Q("RossiLegs");
			if(legs.length > 0){
				legs = legs.items[0];
				this.p.y = legs.p.y-15;
				this.p.x = legs.p.x;
			}
		}
	})

}

