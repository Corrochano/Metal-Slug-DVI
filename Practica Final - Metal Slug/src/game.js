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

	add_Rossi(Q);
	add_enemies(Q);
	add_allies(Q);
	add_objects(Q);
	add_coins(Q);

	////////////////////////////////////////
	// LOAD MUSIC AND SOUNDS
	////////////////////////////////////////

	// Q.load([ 

	// ]);
	
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
		"mg_bullet.png",
		"mapaMetalSlug.tmx","Neo Geo NGCD - Metal Slug - Mission 1.png",
		"bgMS.png", "titulo.jpg","GameOver.png",
		"Carne.png", "Sandia.png", "Platano.png",
		"MetalSlug.png",
		"H.png",
		"MetalSlug.png", "Creditos.png"
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

			let rossi = new Q.RossiLegs();
			rossi.p.frame = stage.options.frame;
			stage.insert(rossi);
			let chest = new Q.RossiChest();
			chest.p.frame = stage.options.frame;
			stage.insert(chest);
			console.log("stage lists", stage.lists.TileLayer[0].p.w);
			var maxX = stage.lists.TileLayer[0].p.w;
			stage.add("viewport").follow(rossi, {x:true, y:true},{minX: 0, minY: 0, maxX: maxX});
			//stage.viewport.scale = 0.75;
			stage.viewport.offsetY = 100;
			stage.on("destroy", function(){
				rossi.destroy();
			});

			/*let coin = new Q.Coin();
			stage.insert(coin);*/
			// TODO
			let mg =new Q.DroppedObject({x:120, y:0, asset: "H.png", score: 0, effect: 1});
			stage.insert(mg);
			/*let prisoner = new Q.Prisoner({x: 650, y: 0});
			stage.insert(prisoner);*/

			Q.state.reset({lives: 0, score: 0, coins: 0, gun: 0, gunType: 0}); // con "inf" no actualiza
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

		Q.scene("Credits", function(stage){
			var container = stage.insert(new Q.UI.Container({
				x: 0, 
				y: 0, 
				fill: "rgba(0,0,0,1)"
			}));
			var button = container.insert(new Q.UI.Button({
				asset: "Creditos.png",
				x: Q.width / 2,
				y: Q.height / 2
			}));
			button.on("click",function() {
				Q.clearStages();
				Q.stageScene('startMenu');
			});

			container.fit(20);
	
		});

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
				Q.stageScene('Credits');
			});

			container.fit(20);

		})

		Q.scene("continueMenu", function(stage){
			var container = stage.insert(new Q.UI.Container({
				x: Q.width/2, 
				y: Q.height/2, 
				fill: "rgba(0,0,0,0.5)"
			}));
			var labelGM = container.insert(new Q.UI.Text({
				x:0, 
				y: -100, 
				label: "GAME OVER",
				size: 20,
				align: "center"
			}));
			var label = container.insert(new Q.UI.Text({
				x:0, 
				y:-100 + labelGM.p.h, 
				label: stage.options.label,
				size: 20,
				align: "center"
			}));
			var buttonC = container.insert(new Q.UI.Button({
				x: -130, 
				y: 10, 
				fill: "#CCCCCC", 
				label: "Insertar moneda"
			}));
			var buttonR = container.insert(new Q.UI.Button({
				x: 130, 
				y: 10, 
				fill: "#CCCCCC", 
				label: "Finaliza partida"
			}));

			buttonR.on("click",function() {
				Q.clearStages();
				Q.stageScene('Credits');
			});
			buttonC.on("click", function(){
				if(Q.state.get("coins") >= 1){
					Q.state.dec("coins", 1);
					Q.state.inc("lives", 3);
					//Resucilar a Rossi
					let gameScene = Q.scene("level1");
					console.log("GAME", Q.state.get("rossiX"));
					let mario = new Q.RossiLegs({x: Q.state.get("rossiX"), y: Q.state.get("rossiY")});
					mario.p.frame = stage.options.frame;
					Q.stages[0].insert(mario);
					let chest = new Q.RossiChest({x: Q.state.get("rossiX"), y:Q.state.get("rossiY")});
					chest.p.frame = stage.options.frame;
					Q.stages[0].insert(chest);
					//Limpiar la escena 2
					Q.clearStage(2);
				}
			})

			container.fit(200);

		});

		////////////////////////////////////////
		// HUD
		////////////////////////////////////////
		Q.scene("hud", function(stage){

			label_points = new Q.UI.Text({x: 10, y: 0,family:"FuenteMetalSlug", color:"#d83b3b", outlineWidth:2, size:"26", align : "left", label: "Score: " + Q.state.get("score")});
			label_lives = new Q.UI.Text({x:10, y:35, family:"FuenteMetalSlug", color:"#3ba6d8", outlineWidth:2, size:"26", align : "left", label: "Lives: " + (Q.state.get("lives") + 1)});

			label_coins = new Q.UI.Text({x: 580, y: 35,family:"FuenteMetalSlug", color:"#d8aa3b", outlineWidth:2, size:"26", align : "right", label: "Coins: " + Q.state.get("coins")});
			//HUD DE ARMA CON HEAVY MACHINEGUN
			if(Q.state.get("gunType")){
				label_gun = new Q.UI.Text({x: 580, y: 0,family:"FuenteMetalSlug", color:"#d83b3b", outlineWidth:2, size:"26", align : "right", label: "Gun: " + Q.state.get("gun")});
			}else{
				label_gun = new Q.UI.Text({x: 580, y: 0,family:"FuenteMetalSlug", color:"#d83b3b", outlineWidth:2, size:"26", align : "right", label: "Gun: ∞"});
			}

			stage.insert(label_lives);
			stage.insert(label_points);
			stage.insert(label_coins);
			stage.insert(label_gun);

			Q.state.on("change.lives", this, function(){
				label_lives.p.label = "Lives: " + (Q.state.get("lives") + 1);
			});
			Q.state.on("change.score", this, function(){
				label_points.p.label = "Score: " + Q.state.get("score");
			});
			Q.state.on("change.coins", this, function(){
				label_coins.p.label = "Coins: " + Q.state.get("coins");
			});

			//Si tiene la hm se actualizará la municion
			if(Q.state.get("gunType")==1){
				Q.state.on("change.gun", this, function(){
					label_gun.p.label = "Gun: " + Q.state.get("gun");
					if(Q.state.get("gun") == 0){
						Q.state.dec("gunType", 1);
						label_gun.p.label = "Gun: ∞";
					}
				});
			}
		
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

