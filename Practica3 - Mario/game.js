var game = function() {

	var Q = window.Q = Quintus()
					.include(["Sprites", "Scenes", "Input", "2D", "Anim", "TMX", "UI", "Touch", "Audio"])
					.setup("myGame",{
						width: 800,
						height: 600,
						scaleToFit: false
					})
	.controls().touch();

	Q.audio.enableHTML5Sound();
	
	

	////////////////////////////////////////
	//ANIMACIONES
	////////////////////////////////////////

    Q.animations("block", {
        rotate: { frames: [23, 30, 37], rate: 1/6, loop:true},
        used: {frames: [24], rate: 1, loop:true}
    });
	
	////////////////////////////////////////
	//MARIO
	////////////////////////////////////////

	Q.Sprite.extend("Mario", {

		init: function(p) {
			this._super(p,{
				sheet: "marioR",
				sprite: "mario_anim",
				x: 250,
				y: 250,
				frame: 0,
				scale: 1,
				salto: false
			});
			this.add("2d, platformerControls, animation");
			this.on("marioDies", "die");
		},

		step: function(dt){
			if(this.p.vx > 0){this.play("walk_right");}
			else if(this.p.vx < 0){this.play("walk_left");}
			if(this.p.vy < 0) {
				if(!this.p.salto){
					Q.audio.play("jump_small.mp3");
					this.p.salto = true;
				}
				if(this.p.vx < 0){this.play("jump_left");}
				else if(this.p.vx > 0){this.play("jump_right");}
			
			} else{ this.p.salto = false;}
		},

		die: function() {
			
			Q.state.dec("lives", 1);
			console.log(Q.state.get("lives"));
            if (Q.state.get("lives") < 0) {
                //this.del("platformerControls");
				Q.audio.stop();
                Q.audio.play("music_die.mp3"); 
				console.log("muere marioooo");
                Q.stageScene("endMenu", 2, { label: "You lose!" });
                this.destroy();
            }
    
        }
	});

	////////////////////////////////////////
	//SETA
	////////////////////////////////////////

	Q.Sprite.extend("OneUp", {
		init: function(p) {
			this._super(p,{
				asset: "1up.png",
				scale: 1,
				x: 30,
				y: -10,
				sensor: true,
			});
			this.on("sensor", this, "hit");
		},
		hit: function(collision){
			
			if(!collision.isA("Mario")) return
			Q.state.inc("lives", 1);
			console.log(Q.state.get("lives"));
			this.destroy();
		}
	});

	////////////////////////////////////////
	// DEFAULT ENEMY
	////////////////////////////////////////

	Q.component("defaultEnemy", {
        added: function() {
            this.entity.on("bump.left,bump.right,bump.bottom",function(collision) {
				if(collision.obj.isA("Mario")) {
					collision.obj.p.vy = -200;
           	 		collision.obj.p.vx = collision.normalX*-500;
           		 	collision.obj.p.x+= collision.normalX*-5;
					collision.obj.die();
				}
            });   
        },

        extend: {
            die: function() {
                Q.audio.play("kill_enemy.mp3");
                this.destroy();
            },
        }

    });

	////////////////////////////////////////
	//GOOMBA
	////////////////////////////////////////

	Q.Sprite.extend("Goomba", {
		init: function(p) {
			this._super(p,{
				sheet: "goomba",
				sprite: "goomba_anim",
				x: 400+(Math.random()*200),
				y: 250,
				frame: 0,
				vx: 100
			});
			
			this.add("2d, aiBounce, animation, defaultEnemy");
			this.on("deadGoomba", "die");
			this.on("bump.top", this, "onTop");
			//this.on("bump.left,bump.right,bump.bottom", this, "kill");
		},
		onTop: function(collision){
			if(!collision.obj.isA("Mario")) return;
			collision.obj.p.vy = -300;
			console.log("Goomba dies");
			this.play("morir");
			this.die();
		},
	
		step: function(dt){
			this.play("move");
		}
	});

	////////////////////////////////////////
	//BLOOPA
	////////////////////////////////////////

	Q.Sprite.extend("Bloopa", {
		init: function(p) {
			this._super(p,{
				sheet: "bloopa",
				sprite: "bloopa_anim",
				x: 400+(Math.random()*200),
				y: 250,
				frame: 0,
				vx: 0,
				vy: 300,
				gravity: 0.5
			});
			
			this.add("2d, animation, defaultEnemy");
			this.on("bump.top", this, "onTop");
			//this.on("bump.left,bump.right", this, "kill");
			
			this.on("bump.bottom", function(collision) {
                if(!collision.obj.isA("Mario")) { //Cuando choca con algo que no sea Mario, rebota
					this.p.vy = -300;
                }
				else{
					this.p.vy = -500;	
					//COLISIONA CON MARIO
					Q.state.dec("lives", 1);
					console.log(Q.state.get("lives"));
				}
            });

		},

		onTop: function(collision){
			if(!collision.obj.isA("Mario")) return;
			collision.obj.p.vy = -300;
			console.log("Bloopa dies");
			this.destroy();
		},

		step: function(dt){
			this.play("move");
		}
	});

	////////////////////////////////////////
	// PRINCESS
	////////////////////////////////////////

	Q.Sprite.extend("Princess", {
		
		init: function(p) {
			this._super(p,{
				asset: "princess.png",
				x: 1500,
				y: 250,
				played: false
			});
			this.add("2d");
			this.on("bump.top, bump.botton, bump.left, bump.right", this, "win");
		},
		win: function(collision){
			if(!collision.obj.isA("Mario")) return;

			Q.audio.stop();
			if(!this.played)
			{
				Q.audio.play("music_level_complete.mp3");
				console.log("MUSICA");
				this.played = true;
			}
			
			
			Q.stageScene("endMenu", 1, { label: "Mario Wins!" });
			collision.obj.del("platformerControls");

		}
	});

	////////////////////////////////////////
	// COIN
	////////////////////////////////////////

	Q.Sprite.extend("Coin", {
        init: function(p){
            this._super(p, {
                sheet: "coin",
                sprite: "coin_anim",
                frame: 0,
				gravity: 0,
                sensor: true 
            });
			
            this.add('2d, animation, tween');
			this.on("sensor", this, "raise");
            this.play("rotate");
        },    
    
        raise: function(collision) { 
			if(!collision.isA("Mario")) return;
            this.chain( {x: this.p.x, y: this.p.y-50}, .3, Q.Easing.Quadratic.Out, {delay: 0, callback: this.dissapear});
        },

        dissapear: function() {
			Q.audio.play("coin.mp3");
            Q.state.inc("score",1);
            this.destroy();
        }
    });

	Q.Sprite.extend("OneUp", {
		init: function(p) {
			this._super(p,{
				asset: "1up.png",
				scale: 1,
				x: 30,
				y: -10,
				sensor: true,
			});
			this.on("sensor", this, "hit");
		},
		hit: function(collision){
			
			if(!collision.isA("Mario")) return
			Q.state.inc("lives", 1);
			console.log(Q.state.get("lives"));
			//collision.p.v = -400;
			this.destroy();
		}
	});

	////////////////////////////////////////
	//ANIMACIONES
	////////////////////////////////////////

	Q.animations("mario_anim",{
		walk_right: {frames: [1,2,3],rate: 1/6, next: "parado_r" },
		walk_left: {frames: [15,16,17],rate: 1/6, next: "parado_l" },
		jump_right: {frames: [4],rate: 1/6, next: "parado_r" },
		jump_left: {frames: [18],rate: 1/6, next: "parado_l" },
		parado_r: {frames: [0] },
		parado_l: {frames: [14] },
		morir:{frames: [12], loop:false,rate:1}
	});

	Q.animations("coin_anim", {
		rotate: { frames: [0, 1, 2], rate: 1/6, loop:true}
	});

	Q.animations("goomba_anim", {
		move: { frames: [0, 1], rate: 1/3, loop:true},
		morir: { frames: [2], loop:false, trigger: "deadGoomba" }
	});

	Q.animations("bloopa_anim", {
		move: { frames: [0, 1], rate: 1/2, loop:true},
		morir: { frames: [2], loop:false, trigger: "deadBloopa"}
	});


	////////////////////////////////////////
	// LOAD MUSIC AND SOUNDS
	////////////////////////////////////////

	Q.load([ "coin.mp3",
			 "music_level_complete.mp3", 
			 "music_die.mp3", 
			 "music_main.mp3", 
			 "jump_small.mp3", 
			 "kill_enemy.mp3", 
			 "1up.mp3", 
			 "item_rise.mp3", 
			 "hit_head.mp3",

			 "coin.ogg",
			 "music_level_complete.ogg", 
			 "music_die.ogg", 
			 "music_main.ogg", 
			 "jump_small.ogg", 
			 "kill_enemy.ogg", 
			 "1up.ogg", 
			 "item_rise.ogg", 
			 "hit_head.ogg"
	]);

	////////////////////////////////////////
	// LOAD ASSETS, ANIMATIONS AND SCENES
	////////////////////////////////////////

	Q.load([ "mario_small.png","mario_small.json",
			 "1up.png", 
			 "bg.png", "mapa2021.tmx", "tiles.png",
			 "goomba.png", "goomba.json", 
			 "bloopa.png", "bloopa.json", 
			 "title-screen.png", 
			 "princess.png",
			 "coin.png", "coin.json"
	], function() {

		Q.compileSheets("mario_small.png","mario_small.json");
		Q.compileSheets("goomba.png","goomba.json");
		Q.compileSheets("bloopa.png","bloopa.json");
		Q.compileSheets("coin.png","coin.json");
		
		////////////////////////////////////////
		//NIVEL 1
		////////////////////////////////////////
		
		Q.scene("level1", function(stage){

			Q.audio.stop();
        	Q.audio.play("music_main.mp3",{ loop: true });

			// stage.insert(new Q.Repeater(
			// 	{asset: "bg.png", speedX: 0.5, speedY: 0.5}
			// ));

			Q.stageTMX("mapa2021.tmx", stage);

			mario = new Q.Mario();
			mario.p.frame = stage.options.frame;
			stage.insert(mario);
			//stage.insert(new Q.OneUp(), mario);

			stage.add("viewport").follow(mario, {x:true, y:true});
			stage.viewport.scale = .75;
			stage.viewport.offsetY = 100;
			stage.on("destroy", function(){
				mario.destroy();
			});

			stage.insert(new Q.Goomba());

			stage.insert(new Q.Bloopa());

			stage.insert(new Q.Princess());

			stage.insert(new Q.Coin( {x: 400, y: 500}));

			Q.state.reset({lives: 3, score: 0});
		});

		////////////////////////////////////////
		// PANTALLAS
		////////////////////////////////////////

		Q.scene("startMenu", function(stage){
			var button = stage.insert(new Q.UI.Button({
				asset: "title-screen.png",
				x: Q.width / 2,
				y: Q.height / 2
			}));

			button.on("click", function() {
				Q.clearStages();
				Q.stageScene("level1", 0, {frame: 0});
				Q.stageScene("hud", 1);
			})
		})

		Q.scene("endMenu", function(stage){
			var container = stage.insert(new Q.UI.Container({
				x: Q.width/2, 
				y: Q.height/2, 
				fill: "rgba(0,0,0,0.5)"
			}));
			var button = container.insert(new Q.UI.Button({
				x: 0, 
				y: 0, 
				fill: "#CCCCCC", 
				label: "Play Again"
			}));
			var label = container.insert(new Q.UI.Text({
				x:10, 
				y: -10 - button.p.h, 
				label: stage.options.label,
				size: 20,
				align: "center"
			}));
			// When the button is clicked, clear all the stages
			// and restart the game.
			button.on("click",function() {
				Q.clearStages();
				Q.stageScene('startMenu');
			});

			container.fit(20);

		})

		////////////////////////////////////////
		// HUD
		////////////////////////////////////////
		Q.scene("hud", function(stage){
			label_lives = new Q.UI.Text({x:60, y:20, label: "Lives: " + Q.state.get("lives")});
			label_coins = new Q.UI.Text({x: 250, y: 20, label: "Coins: " + Q.state.get("score")});
			stage.insert(label_lives);
			stage.insert(label_coins);
			Q.state.on("change.lives", this, function(){
				label_lives.p.label = "Lives: " + Q.state.get("lives");
			});
			Q.state.on("change.score", this, function(){
				label_coins.p.label = "Coins: " + Q.state.get("score");
			})
		});

		Q.stageScene("startMenu");

		//Q.stageScene("level1", 0, {frame: 0});
	});
}

