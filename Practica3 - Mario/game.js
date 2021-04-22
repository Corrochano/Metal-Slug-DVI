var game = function() {

	var Q = window.Q = Quintus()
	.include(["Sprites", "Scenes", "Input", "2D", "Anim", "TMX"])
	.setup("myGame",{
		width: 800,
		height: 600,
		scaleToFit: true
	})
	.controls();

	Q.Sprite.extend("Mario", {
		init: function(p) {
			this._super(p,{
				sheet: "marioR",
				sprite: "mario_anim",
				x: 250,
				y: 250,
				frame: 0,
				scale: 1
			});
			this.add("2d, platformerControls, animation");
			// Q.input.on("left", this, function() { this.p.x -= 10; });
			// Q.input.on("right", this, function() { this.p.x += 10; });
			// Q.input.on("up", this, function() { this.p.y -= 10; });
			// Q.input.on("down", this, function() { this.p.y += 10; });
		},
		step: function(dt){
			if(this.p.vx > 0){this.play("walk_right");}
			else if(this.p.vx < 0){this.play("walk_left");}
			if(this.p.vy < 0) {
				if(this.p.vx < 0){this.play("jump_left");}
				else if(this.p.vx > 0){this.play("jump_right");}
			}
		}
	});

	Q.Sprite.extend("OneUp", {
		init: function(p) {
			this._super(p,{
				asset: "1up.png",
				scale: 1,
				x: 20,
				y: -10,
				sensor: true,
				taken: false
			});
			this.on("sensor", this, "hit");
		},
		hit: function(collision){
			if(this.taken) return;
			
			if(!collision.isA("Mario")) return
			this.taken=true;
			Q.state.inc("lives", 1);
			console.log(Q.state.get("lives"));
			collision.p.v = -400;

			this.animate({y: this.p.y-100, angle:360},
				1,Q.Easing.Quadratic.Out, {callback: function(){this.destroy()}});
		}
	});

	Q.Sprite.extend("Goomba", {
		init: function(p) {
			this._super(p,{
				sheet: "goomba",
				x: 400+(Math.random()*200),
				y: 250,
				frame: 0,
				vx: 100
			});
			this.add("2d, aiBounce");
			this.on("bump.top", this, "onTop");
			this.on("bump.botton, bump.left, bump.right", this, "kill");
		},
		onTop: function(collision){
			if(!collision.obj.isA("Mario")) return;
			collision.obj.p.vy = -100;
			console.log("Goomba dies");
			this.destroy();
		},
		kill: function(collision){
			if(!collision.obj.isA("Mario")) return;
			console.log("Mario dies");
			collision.obj.p.vy = -200;
			collision.obj.p.vx = collision.normalX*-500;
			collision.obj.p.x+= collision.normalX*-5;
			Q.state.dec("lives", 1);
			console.log(Q.state.get("lives"));
			if(Q.state.get("lives")<0){
				collision.obj.destroy();
			}
		}
	});

	Q.load([ "mario_small.png","mario_small.json", "1up.png", "bg.png", "mapa2021.tmx", "tiles.png", "goomba.png", "goomba.json"], function() {
		Q.compileSheets("mario_small.png","mario_small.json");
		Q.compileSheets("goomba.png","goomba.json");

		Q.animations("mario_anim",{
			walk_right: {frames: [1,2,3],rate: 1/6, next: "parado_r" },
			walk_left: {frames: [15,16,17],rate: 1/6, next: "parado_l" },
			jump_right: {frames: [4],rate: 1/6, next: "parado_r" },
			jump_left: {frames: [18],rate: 1/6, next: "parado_l" },
			parado_r: {frames: [0] },
			parado_l: {frames: [14] },
			morir:{frames: [12], loop:false,rate:1}
		});

		Q.scene("level1", function(stage){

			// stage.insert(new Q.Repeater(
			// 	{asset: "bg.png", speedX: 0.5, speedY: 0.5}
			// ));

			Q.stageTMX("mapa2021.tmx", stage);

			mario = new Q.Mario();
			mario.p.frame = stage.options.frame;
			stage.insert(mario);
			// stage.insert(new Q.OneUp(), mario);

			stage.add("viewport").follow(mario, {x:true, y:false});
			stage.viewport.scale = .75;
			stage.on("destroy", function(){
				mario.destroy();
			});

			stage.insert(new Q.Goomba());

			Q.state.reset({lives: 2});
		});

		Q.stageScene("level1", 0, {frame: 0});
	});
}

