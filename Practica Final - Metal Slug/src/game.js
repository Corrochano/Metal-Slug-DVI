var game = function() {

	var Q = window.Q = Quintus()
					.include(["Sprites", "Scenes", "Input", "2D", "Anim", "TMX", "UI", "Touch", "Audio"])
					.setup("myGame",{
						width: 640,
						height: 480,
						scaleToFit: false
					})
	.controls().touch();

	Q.audio.enableHTML5Sound();

	add_Mario(Q);
	add_Rossi(Q);
	add_enemies(Q);
	add_allies(Q);
	add_objects(Q);

	// Mario stuff

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



	////////////////////////////////////////
	// LOAD MUSIC AND SOUNDS
	////////////////////////////////////////

	Q.load(["music_level_complete.mp3", 
			 "music_die.mp3", 
			 "music_main.mp3", 
			 "jump_small.mp3", 
			 "kill_enemy.mp3",
			 "item_rise.mp3", 
			 "hit_head.mp3",

			 "coin.ogg",
			 "music_level_complete.ogg", 
			 "music_die.ogg", 
			 "music_main.ogg", 
			 "jump_small.ogg", 
			 "kill_enemy.ogg", 
			 "item_rise.ogg", 
			 "hit_head.ogg"
	]);
	
	////////////////////////////////////////
	// LOAD MUSIC AND SOUNDS
	////////////////////////////////////////

	Q.load([ 
		"main_theme.mp3",
		"title.mp3",
		"boss_fight.mp3",
		"game_over.mp3",
		"mission_complete.mp3"
	]);

	////////////////////////////////////////
	// LOAD ASSETS, ANIMATIONS AND SCENES
	////////////////////////////////////////

	Q.load([ 
		"allen_boss.png", "allen_boss.json",
		"rifle_soldier.png", "rifle_soldier.json",
		"ROSSI.png", "MarcoRossI_Legs.json", "MarcoRossI_Torso.json",
		"objetos.png", "objetos.json",
		"disparos.png", "disparos.json",
		"NPC.png", "npc.json",
		"enemy_bullet.png",
		"gun_bullet.png",
		"mapaMetalSlug.tmx","Neo Geo NGCD - Metal Slug - Mission 1.png",
		"bgMS.png", "titulo.jpg","GameOver.png",
		"Carne.png", "Sandia.png", "Platano.png",
		"MetalSlug.png",
		// mario stuff TODO -> QUITAR LA SETA, QUE LE PASA?
		"1up.png"

	], function() {

		Q.compileSheets("allen_boss.png","allen_boss.json");
		Q.compileSheets("rifle_soldier.png","rifle_soldier.json");
		Q.compileSheets("ROSSI.png","MarcoRossI_Legs.json");
		Q.compileSheets("ROSSI.png","MarcoRossI_Torso.json");
		Q.compileSheets("objetos.png","objetos.json");
		Q.compileSheets("disparos.png","disparos.json");
		Q.compileSheets("NPC.png", "npc.json");

		////////////////////////////////////////
		//NIVEL 1
		////////////////////////////////////////
		
		Q.scene("level1", function(stage){

			Q.audio.stop();
        	Q.audio.play("main_theme.mp3",{ loop: true });

			Q.stageTMX("mapaMetalSlug.tmx", stage);

			//mario = new Q.Mario();
			let mario = new Q.RossiLegs();
			mario.p.frame = stage.options.frame;
			stage.insert(mario);
			let chest = new Q.RossiChest();
			chest.p.frame = stage.options.frame;
			stage.insert(chest);
			console.log("stage lists", stage.lists.TileLayer[0].p.w);
			var maxX = stage.lists.TileLayer[0].p.w;
			stage.add("viewport").follow(mario, {x:true, y:true},{minX: 0, minY: 0, maxX: maxX});
			//stage.viewport.scale = 0.75;
			stage.viewport.offsetY = 100;
			stage.on("destroy", function(){
				mario.destroy();
			});

			/*let prisoner = new Q.Prisoner({x: 650, y: 0});
			stage.insert(prisoner);*/

			Q.state.reset({lives: 0, score: 0});
		});

		////////////////////////////////////////
		// PANTALLAS
		////////////////////////////////////////

		Q.scene("startMenu", function(stage){
			var button = stage.insert(new Q.UI.Button({
				asset: "titulo.jpg",
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
				x: 0, 
				y: 0, 
				fill: "rgba(0,0,0,1)"
			}));
			var button = container.insert(new Q.UI.Button({
				asset: "GameOver.png",
				x: Q.width / 2,
				y: Q.height / 2
			}));
			/*var label = container.insert(new Q.UI.Text({
				x:10, 
				y: -10 - button.p.h, 
				label: "Score" + Q.state.get("score"),
				size: 20,
				align: "center"
			}));*/
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
			label_lives = new Q.UI.Text({x:60, y:20, label: "Lives: " + (Q.state.get("lives") + 1)});
			label_coins = new Q.UI.Text({x: 250, y: 20, label: "Points: " + Q.state.get("score")});
			stage.insert(label_lives);
			stage.insert(label_coins);
			Q.state.on("change.lives", this, function(){
				label_lives.p.label = "Lives: " + (Q.state.get("lives") + 1);
			});
			Q.state.on("change.score", this, function(){
				label_coins.p.label = "Points: " + Q.state.get("score");
			})
		});

		Q.stageScene("startMenu");

	});

	Q.Sprite.extend("GameOver", {
		
		init: function(p) {
			this._super(p,{
				asset:"MetalSlug.png",
				x: 1500,
				y: 250,
				sensor: true
			});
			//this.add("2d");
			this.on("sensor", this, "win");
		},
		win: function(collision){
			if(!collision.isA("RossiLegs")) return;

			this.sensor = false;
			collision.del('2d, platformerControls');
			collision.gravity = 0;
			Q.stageScene("endMenu", 2, { label: "You Win!" });

		}
	});
}

