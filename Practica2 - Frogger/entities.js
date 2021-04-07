///////////////////////////////
// SPRITE
///////////////////////////////
var Sprite = function() { }

Sprite.prototype.setup = function(sprite,props) {
    this.sprite = sprite;
    this.merge(props);
    this.frame = this.frame || 0;
    this.w = SpriteSheet.map[sprite].w;
    this.h = SpriteSheet.map[sprite].h;
}
Sprite.prototype.merge = function(props) {
    if(props) {
        for (var prop in props) {
            this[prop] = props[prop];
        }
    }
}

Sprite.prototype.draw = function(ctx) {
    SpriteSheet.draw(ctx,this.sprite,this.x,this.y,this.frame);
}

Sprite.prototype.hit = function(damage) {
    this.board.remove(this);
}

var OBJECT_PLAYER = 1,
    OBJECT_PLAYER_PROJECTILE = 2,
    OBJECT_ENEMY = 4,
    OBJECT_ENEMY_PROJECTILE = 8,
    OBJECT_POWERUP = 16;

///////////////////////////////
//FROG
///////////////////////////////
var Frog = function(clear){
    
    this.setup('frog', { vx: 0, frame: 0 });

    this.x = Game.width/2 - 20;
    this.y = Game.height;
    this.w = SpriteSheet.map['frog'].w;
    this.h = SpriteSheet.map['frog'].h;

    this.reloadTime = 0.25;
    this.move = this.reloadTime;

    this.step = function(dt) {
        this.move -= dt;
        this.vx = 0; this.vy = 0;
        if(this.move < 0){
            if(Game.keys['left']) {         this.vx = -40; this.vy = 0; this.move = this.reloadTime; }
            else if(Game.keys['right']) {   this.vx = 40; this.vy = 0; this.move = this.reloadTime; }
            else if(Game.keys['up']) {      this.vy = -48; this.vx = 0; this.move = this.reloadTime; }
            else if(Game.keys['down']) {    this.vy = 48; this.vx = 0; this.move = this.reloadTime; }
        }
    
        this.x += this.vx;
        if(this.x < 0) { this.x = 0; }
        else if(this.x > Game.width - this.w) {
            this.x = Game.width - this.w;
        }

        this.y += this.vy;
        if(this.y < 0) { this.y = 0; }
        else if(this.y > Game.height - this.h) {
            this.y = Game.height - this.h;
        }
    
    }

}

Frog.prototype = new Sprite();


///////////////////////////////
//CAR
///////////////////////////////
var Car = function(carTypeSprite, row, dir, speed){
    
    this.setup(carTypeSprite, { vx: 0, frame: 0 });

    this.x = 
    this.y = 
    this.w = SpriteSheet.map[carTypeSprite].w;
    this.h = SpriteSheet.map[carTypeSprite].h;

    

    this.step = function(dt) {

        //Comprobar si esta fuera del tablero (y eliminarlo en tal caso)
        if(this.x > Game.width && (dir == 'right')) {
            this.board.remove(this);
        }

        if(this.x + this.w < 0 && (dir == 'left')) {
            this.board.remove(this);
        }
    
    }

}

Car.prototype = new Sprite();

///////////////////////////////
//TRUNK
///////////////////////////////
var Trunk = function(trunkTypeSprite, row, dir, speed){
    
    this.setup(trunkTypeSprite, { });

    this.x = 
    this.y = 
    this.w = SpriteSheet.map[trunkTypeSprite].w;
    this.h = SpriteSheet.map[trunkTypeSprite].h;

    

    this.step = function(dt) {

        //Comprobar si esta fuera del tablero (y eliminarlo en tal caso)
        if(this.x > Game.width && (dir == 'right')) {
            this.board.remove(this);
        }

        if(this.x + this.w < 0 && (dir == 'left')) {
            this.board.remove(this);
        }
    
    }

}

Trunk.prototype = new Sprite();

///////////////////////////////
//BACKGROUND
///////////////////////////////

var Background = function(clear) {
    this.setup('background', { vx: 0, frame: 0})
    this.x = 0;
    this.y = 0;
    this.w = SpriteSheet.map['background'].w;
    this.h = SpriteSheet.map['background'].h;
}

Background.prototype = new Sprite();

Background.prototype.step = function(dt){};

///////////////////////////////
//LEVEL
///////////////////////////////

var Level = function(levelData,callback) {
    this.levelData = [];
    for(var i = 0; i < levelData.length; i++) {
        this.levelData.push(Object.create(levelData[i]));
    }
    this.t = 0;
    this.callback = callback;
}

Level.prototype.draw = function(ctx) { }

Level.prototype.step = function(dt) {
    var idx = 0, remove = [], curShip = null;

    // Update the current time offset
    this.t += dt * 1000;

    // Example levelData
    // Start, End, Gap, Type, Override
    // [[ 0, 4000, 500, 'step', { x: 100 } ]
    while((curShip = this.levelData[idx]) && 
        (curShip[0] < this.t + 2000)) {
            // Check if past the end time
            if(this.t > curShip[1]) {
                // If so, remove the entry
                remove.push(curShip);
            } else if(curShip[0] < this.t) {
                // Get the enemy definition blueprint
                var enemy = enemies[curShip[3]],
                override = curShip[4];
                // Add a new enemy with the blueprint and override
                this.board.add(new Enemy(enemy,override));
                // Increment the start time by the gap
                curShip[0] += curShip[2];
            }
            idx++;
    }
    // Remove any objects from the levelData that have passed
    for(var i = 0, len = remove.length; i < len; i++) {
        var idx = this.levelData.indexOf(remove[i]);
        if(idx != -1) this.levelData.splice(idx,1);
    }
    // If there are no more enemies on the board or in
    // levelData, this level is done
    if(this.levelData.length == 0 && this.board.cnt[OBJECT_ENEMY] == 0) {
        if(this.callback) this.callback();
    }
}


///////////////////////////////
//ANALYTICS
///////////////////////////////

var analytics = new function(){
    var lastDate = Date.now();
    var time = 0;
    var frames = 0;
    var fps = 0;
    this.step = function(dt){
        var now = Date.now();
        //Ignoramos el dt que nos indica el método loop()
        var dt = (now-lastDate);
        lastDate = now;
        time += dt;
        ++frames;
        fps = frames*1000 / time ;
        if(time>5000){
            time = 0;
            frames = 0;
        }
    }
    this.draw = function(ctx){
    ctx.fillStyle = "#FFFFFF";
    ctx.textAlign = "left";
    ctx.font = "bold 16px arial";
    ctx.fillText(Math.round(fps * 100) / 100,0,20);
    }
}


///////////////////////////////
//TOUCHCONTROLS
///////////////////////////////

var TouchControls = function() {

    var gutterWidth = 10;
    var unitWidth = Game.width/5;
    var blockWidth = unitWidth-gutterWidth;

    this.drawSquare = function(ctx,x,y,txt,on) {
        ctx.globalAlpha = on ? 0.9 : 0.6;
        ctx.fillStyle = "#CCC";
        ctx.fillRect(x,y,blockWidth,blockWidth);

        ctx.fillStyle = "#FFF";
        ctx.textAlign = "center";
        ctx.globalAlpha = 1.0;
        ctx.font = "bold " + (3*unitWidth/4) + "px arial";

        ctx.fillText(txt,
                    x+blockWidth/2,
                    y+3*blockWidth/4+5);
    };

    this.draw = function(ctx) {
        ctx.save();

        var yLoc = Game.height - unitWidth;
        this.drawSquare(ctx,gutterWidth,yLoc,"\u25C0", Game.keys['left']);
        this.drawSquare(ctx,unitWidth + gutterWidth,yLoc,"\u25B6", Game.keys['right']);
        this.drawSquare(ctx,4*unitWidth,yLoc,"A",Game.keys['fire']);
        ctx.restore();
    };

    this.step = function(dt) { };

    this.trackTouch = function(e) {
        var touch, x;

        e.preventDefault();
        Game.keys['left'] = false;
        Game.keys['right'] = false;

        for(var i=0;i<e.targetTouches.length;i++) {
            touch = e.targetTouches[i];
            x = touch.pageX / Game.canvasMultiplier - Game.canvas.offsetLeft;
            if(x < unitWidth) {
                Game.keys['left'] = true;
            }
            if(x > unitWidth && x < 2*unitWidth) {
                Game.keys['right'] = true;
            }
        }

        if(e.type == 'touchstart' || e.type == 'touchend') {
            for(i=0;i<e.changedTouches.length;i++) {
                touch = e.changedTouches[i];
                x = touch.pageX / Game.canvasMultiplier - Game.canvas.offsetLeft;
                if(x > 4 * unitWidth) {
                    Game.keys['fire'] = (e.type == 'touchstart');
                }
            }
        }
    };

    Game.canvas.addEventListener('touchstart',this.trackTouch,true);
    Game.canvas.addEventListener('touchmove',this.trackTouch,true);
    Game.canvas.addEventListener('touchend',this.trackTouch,true);

    Game.playerOffset = unitWidth + 20;
};