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
			 "bg.png", "tiles.png", "mapaFinal.tmx",
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

			Q.stageTMX("mapaFinal.tmx", stage);

			mario = new Q.Mario();
			mario.p.frame = stage.options.frame;
			stage.insert(mario);
			console.log("stage lists", stage.lists.TileLayer[0].p.w);
			var maxX = stage.lists.TileLayer[0].p.w
			stage.add("viewport").follow(mario, {x:true, y:true},{minX: 0, minY: 0, maxX: maxX});
			//stage.viewport.scale = 0.75;
			stage.viewport.offsetY = 100;
			stage.on("destroy", function(){
				mario.destroy();
			});

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
			label_lives = new Q.UI.Text({x:60, y:20, label: "Lives: " + (Q.state.get("lives") + 1)});
			label_coins = new Q.UI.Text({x: 250, y: 20, label: "Coins: " + Q.state.get("score")});
			stage.insert(label_lives);
			stage.insert(label_coins);
			Q.state.on("change.lives", this, function(){
				label_lives.p.label = "Lives: " + (Q.state.get("lives") + 1);
			});
			Q.state.on("change.score", this, function(){
				label_coins.p.label = "Coins: " + Q.state.get("score");
			})
		});

		Q.stageScene("startMenu");

	});
}

