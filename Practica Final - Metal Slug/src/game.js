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
	add_obstacles(Q);
	add_explosions(Q);
	add_spawners(Q);

	////////////////////////////////////////
	// LOAD MUSIC AND SOUNDS
	////////////////////////////////////////

	Q.load([ 
		"main_theme.mp3",
		"title.mp3",
		"boss_fight.mp3",
		"game_over.mp3",
		"mission_complete.mp3",
		"boss_fight.mp3",
		"metal_slug_ok.mp3",
		"metal_slug_HM.mp3",
		"Marco_Rossi_Death.mp3",
		"rebel_scream.mp3",
		"allen_die.mp3",
		"prisionero.mp3",
		"explosion.mp3",
		"metal_slug_coin.mp3",
		"allen_go_to.mp3",
		"allen_laugh.mp3",
		"allen_come_on.mp3",
		"rossi_shot.mp3",
		"rossi_shot_HM.mp3",
		"allen_shot.mp3",
		"allen_reload.mp3"
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
		"mg_bullet_left.png",
		"mg_bullet_up.png",
		"allen_bullet.png",
		"Rifle.png", "shield_soldier.png",
		"mapaMetalSlug.tmx","ms01.tmx","boss_map.tmx",
		"Neo Geo NGCD - Metal Slug - Mission 1.png",
		"Neo Geo NGCD - Metal Slug - Mission 4.png",
		"Neo Geo NGCD - Metal Slug - Mission 5.png",
		"bgMS.png", "titulo.jpg","GameOver.png", 
		"houses_background.png", "boss_map.png",
		"Carne.png", "Sandia.png", "Platano.png",
		"MetalSlug.png",
		"H.png",
		"MetalSlug.png", "Creditos.png", 
		"big_explosion.png", "big_explosion.json",
		"medium_explosion.png", "medium_explosion.json",
		"blockade.png", "blockade.json",
		"rebel_van.png", "rebel_van.json",
		"guard_post.png", "destroyed_turret.png",
		"red_car.png", "red_car.json",
		"fridge_truck.png", "fridge_truck.json", 
		"true_rifle.json", "shield_soldier.json",
		"helicoptero.png", "helicopter.json",
		"GameOver2.png"
	], function() {

		Q.compileSheets("allen_boss.png","allen_boss.json");
		Q.compileSheets("rifle_soldier.png","rifle_soldier.json");
		Q.compileSheets("ROSSI.png","MarcoRossI_Legs.json");
		Q.compileSheets("ROSSI.png","MarcoRossI_Torso.json");
		Q.compileSheets("objetos.png","objetos.json");
		Q.compileSheets("disparos.png","disparos.json");
		Q.compileSheets("NPC.png", "npc.json");
		Q.compileSheets("big_explosion.png", "big_explosion.json");
		Q.compileSheets("medium_explosion.png", "medium_explosion.json");
		Q.compileSheets("red_car.png", "red_car.json");
		Q.compileSheets("fridge_truck.png", "fridge_truck.json");
		Q.compileSheets("blockade.png", "blockade.json");
		Q.compileSheets("rebel_van.png", "rebel_van.json");
		Q.compileSheets("Rifle.png", "true_rifle.json");
		Q.compileSheets("shield_soldier.png", "shield_soldier.json");
		Q.compileSheets("helicoptero.png", "helicopter.json");

		////////////////////////////////////////
		//NIVEL 1
		////////////////////////////////////////
		
		Q.scene("level1", function(stage){

			Q.audio.stop();
        	Q.audio.play("main_theme.mp3",{ loop: true });

			Q.stageTMX("ms01.tmx", stage);

			let rossi = new Q.RossiLegs();
			rossi.p.frame = stage.options.frame;
			stage.insert(rossi);
			let chest = new Q.RossiChest();
			chest.p.frame = stage.options.frame;
			stage.insert(chest);
			var maxX = stage.lists.TileLayer[0].p.w;
			stage.add("viewport").follow(rossi, {x:true, y:true},{minX: 0, minY: 0, maxX: maxX});
			//stage.viewport.scale = 0.75;
			stage.viewport.offsetY = 100;
			stage.on("destroy", function(){
				rossi.destroy();
			});
			stage.insert(new Q.Timer());
			/////////////////////////////////////////
			// 			TEST ZONE
			/////////////////////////////////////////

			/*let coin = new Q.Coin({x:225,y:310});
			stage.insert(coin);
			
			let mg =new Q.DroppedObject({x:100, y:310, asset: "H.png", score: 0, effect: 1});
			stage.insert(mg);*/
			/*let prisoner = new Q.Prisoner({x: 650, y: 0});
			stage.insert(prisoner);*/

      
			/*let s1 = new Q.Helicopter({x: 800, y: 155});
			stage.insert(s1);
      

			let s2 = new Q.RifleSoldier({x: 350, y: 200});
			stage.insert(s2);

			let s3 = new Q.TrueRifleSoldier({x: 370, y: 200});
			stage.insert(s3);

			let s5 = new Q.ShieldSoldier({x: 510, y: 200});
			stage.insert(s5);*/

			/////////////////////////////////////////
			// 			TEST ZONE
			/////////////////////////////////////////

			Q.state.reset({lives: 2, score: 0, coins: 0, gun: 0, gunType: 0, prisioneros_liberados:0, timer: 60}); // con "inf" no actualiza
		});

		////////////////////////////////////////
		//NIVEL JEFE
		////////////////////////////////////////
		
		Q.scene("level2", function(stage){
			Q.audio.stop();
			Q.audio.play("boss_fight.mp3");

			Q.stageTMX("boss_map.tmx", stage);
			Q.stageScene("hud", 1);

			let rossi = new Q.RossiLegs();
			rossi.p.frame = stage.options.frame;
			stage.insert(rossi);
			let chest = new Q.RossiChest();
			chest.p.frame = stage.options.frame;
			stage.insert(chest);
			var maxX = stage.lists.TileLayer[0].p.w;
			stage.add("viewport").follow(rossi, {x:true, y:true},{minX: 0, minY: 0, maxX: maxX});
			//stage.viewport.scale = 0.75;
			stage.viewport.offsetY = 100;
			stage.on("destroy", function(){
				rossi.destroy();
			});
			stage.insert(new Q.Timer());
			Q.state.set({timer:60});

			// TEST

			/*let mg =new Q.DroppedObject({x:100, y:310, asset: "H.png", score: 0, effect: 1});
			stage.insert(mg);
			
			let allen = new Q.AllenBoss({x: 400, y: 200});
			stage.insert(allen);*/
		})

		////////////////////////////////////////
		// PANTALLAS
		////////////////////////////////////////

		Q.scene("startMenu", function(stage){
			var button = stage.insert(new Q.UI.Button({
				asset: "titulo.jpg",
				x: Q.width / 2,
				y: Q.height / 2
			}));

			Q.audio.stop();

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
			
			////////////////////////////////
			//		RESUMEN DE PARTIDA
			///////////////////////////////
			label_points_end = new Q.UI.Text({x: 200, y: 175,family:"FuenteMetalSlug", color:"#d83b3b", outlineWidth:2, size:"45", align : "left", label: "Score: " + Q.state.get("score")});
			container.insert(label_points_end);
			label_coins_end = new Q.UI.Text({x: 200, y: 225,family:"FuenteMetalSlug", color:"#d8aa3b", outlineWidth:2, size:"45", align : "left", label: "Coins: " + Q.state.get("coins")});
			container.insert(label_coins_end);
			label_prisioneros_end = new Q.UI.Text({x: 200, y: 275,family:"FuenteMetalSlug", color:"#3ba6d8", outlineWidth:2, size:"45", align : "left", label: "Prisioneros: " + Q.state.get("prisioneros_liberados")});
			container.insert(label_prisioneros_end);

			// When the button is clicked, clear all the stages
			// and restart the game.
			button.on("click",function() {
				Q.clearStages();
				Q.stageScene('Credits');
			});

			Q.audio.stop();
			Q.audio.play("mission_complete.mp3", {loop: false});

			container.fit(20);

		})

		Q.scene("endMenu2", function(stage){
			var container = stage.insert(new Q.UI.Container({
				x: 0, 
				y: 0, 
				fill: "rgba(0,0,0,1)"
			}));
			var button = container.insert(new Q.UI.Button({
				asset: "GameOver2.png",
				x: Q.width / 2,
				y: Q.height / 2
			}));

			// When the button is clicked, clear all the stages
			// and restart the game.
			button.on("click",function() {
				Q.clearStages();
				Q.stageScene('Credits');
			});

			Q.audio.stop();
			Q.audio.play("game_over.mp3", {loop: false});

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
				color:"#ffffff",
				label: "GAME OVER",
				size: 20,
				align: "center"
			}));
			var label = container.insert(new Q.UI.Text({
				x:0, 
				y:-100 + labelGM.p.h, 
				color:"#ffffff",
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
				Q.stageScene("endMenu2", { label: "You Lose!" });
			});
			buttonC.on("click", function(){
				if(Q.state.get("coins") >= 1){
					Q.state.dec("coins", 1);
					Q.state.set("lives", 2);
					//Resucilar a Rossi
					Q("RossiLegs").items[0].resurrect();
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

			label_points = new Q.UI.Text({x: 35, y: 35,family:"FuenteMetalSlug", color:"#3ba6d8", outline:"#f7dc48", outlineWidth:2, size:"30", align : "left", label: "Score: " + Q.state.get("score")});
			label_timer = new Q.UI.Text({x: 300, y: 35,family:"FuenteMetalSlug", color:"#ffffff", outline:"#f7dc48", outlineWidth:2, size:"30", align : "left", label: "" + Q.state.get("timer")});
			label_prisioners = new Q.UI.Text({x: 420, y: 35,family:"FuenteMetalSlug", color:"#3ba6d8", outlineWidth:2, size:"30", align : "left", label: "Prisoners: " + Q.state.get("prisioneros_liberados")});
			label_lives = new Q.UI.Text({x:35, y:380, family:"FuenteMetalSlug", color:"#33c63d", outlineWidth:2, size:"30", align : "left", label: "♥ : " + (Q.state.get("lives")+1)});
			label_coins = new Q.UI.Text({x: 350, y: 380,family:"FuenteMetalSlug", color:"#d8aa3b", outlineWidth:2, size:"30", align : "right", label: "Coins: " + Q.state.get("coins")});

			//HUD DE ARMA CON HEAVY MACHINEGUN
			if(Q.state.get("gunType")){
				label_gun = new Q.UI.Text({x: 565, y: 380,family:"FuenteMetalSlug", color:"#d83b3b", outlineWidth:2, size:"30", align : "right", label: "Gun: " + Q.state.get("gun")});
			}else{
				label_gun = new Q.UI.Text({x: 565, y: 380,family:"FuenteMetalSlug", color:"#d83b3b", outlineWidth:2, size:"30", align : "right", label: "Gun: ∞"});
			}

			stage.insert(label_lives);
			stage.insert(label_timer);
			stage.insert(label_points);
			stage.insert(label_coins);
			stage.insert(label_gun);
			stage.insert(label_prisioners);

			Q.state.on("change.lives", this, function(){
				label_lives.p.label = "♥ : " + (Q.state.get("lives")+1);
			});
			Q.state.on("change.score", this, function(){
				label_points.p.label = "Score: " + Q.state.get("score");
			});
			Q.state.on("change.coins", this, function(){
				label_coins.p.label = "Coins: " + Q.state.get("coins");
			});
			Q.state.on("change.prisioneros_liberados", this, function(){
				label_prisioners.p.label = "Prisoners: " + Q.state.get("prisioneros_liberados");
			});
			Q.state.on("change.timer", this, function(){
				label_timer.p.label = "" + Q.state.get("timer");
			});

			//Si tiene la hm se actualizará la municion

			Q.state.on("change.gun", this, function(){
				label_gun.p.label = "Gun: " + Q.state.get("gun");
				if(Q.state.get("gun") == 0){
					Q.state.dec("gunType", 1);
					label_gun.p.label = "Gun: ∞";
				}
			});


		});

		Q.stageScene("startMenu");

	});

	Q.Sprite.extend("LevelEnd", {
		
		init: function(p) {
			this._super(p,{
				asset: p.asset,
				x: p.x,
				y: p.y,
				nextLevel: p.nextLevel,
				sensor: true
			});
			//this.add("2d");
			this.on("sensor", this, "changeLevel");
		},
		changeLevel: function(collision){
			if(!collision.isA("RossiLegs")) return;
			Q.clearStages();
			Q.stageScene(this.p.nextLevel, 0);
			Q.stageScene("hud", 1);

		}
	});
	Q.Sprite.extend("Timer", {
		init: function(p) {
			this._super(p,{
				timer: 0,
				timerInterval: 4,
				x: 0,
				y: 0,
				gravityX: 0,
				gravityY: 0,
				type: Q.SPRITE_NONE
			});
		},
		step: function(dt){
			let rossi = Q("RossiLegs");
			if(rossi.items.length > 0){
				rossi = rossi.items[0];
				if(rossi.p.move){
					this.p.timer += dt;
					if(this.p.timer > this.p.timerInterval){
						this.p.timer = 0;
						Q.state.dec("timer", 1);
						if(Q.state.get("timer") == 0){
							rossi.die()
						}
					}
				}
			}
		},
		resetTimer: function(){
			Q.state.set({timer: 60});
		}
	})
}

