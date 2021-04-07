///////////////////////////////
// JUGADOR
///////////////////////////////

var PlayerShip = function() {
    this.setup('ship_player', { vx: 0, frame: 0, reloadTime: 0.25, maxVel: 200 });

    this.x = Game.width/2 - this.w / 2;
    //this.y = Game.height - 10 - this.h;
    this.y = Game.height - Game.playerOffset - this.h;


    this.w = SpriteSheet.map['ship_player'].w;
    this.h = SpriteSheet.map['ship_player'].h;
    this.x = Game.width/2 - this.w / 2;
    this.y = Game.height - 10 - this.h;
    this.vx = 0;
    this.maxVel = 200;

    this.reloadTime = 0.25; // un cuarto de segundo
    this.reload = this.reloadTime;

    
    this.step = function(dt) {
        if(Game.keys['left']) { this.vx = -this.maxVel; }
        else if(Game.keys['right']) { this.vx = this.maxVel; }
        else { this.vx = 0; }
        this.x += this.vx * dt;
        if(this.x < 0) { this.x = 0; }
        else if(this.x > Game.width - this.w) {
            this.x = Game.width - this.w
        }

        this.reload-=dt;
        if(Game.keys['fire'] && this.reload < 0) {
            Game.keys['fire'] = false;
            this.reload = this.reloadTime;

            this.board.add(new PlayerMissile(this.x,this.y+this.h/2));
            this.board.add(new PlayerMissile(this.x+this.w,this.y+this.h/2));
        }

    };

    PlayerShip.prototype.hit = function(damage) {
        if(this.board.remove(this)) {
            loseGame();
        }
    }
}

PlayerShip.prototype = new Sprite();
PlayerShip.prototype.type = OBJECT_PLAYER

///////////////////////////////
//PLAYER MISSILE
///////////////////////////////

//OK
var PlayerMissile = function(x,y) {
    this.setup('player_missile',{ vy: -700, damage: 10 });
    this.x = x - this.w/2;
    this.y = y - this.h;
};  

PlayerMissile.prototype = new Sprite();
PlayerMissile.prototype.type = OBJECT_PLAYER_PROJECTILE;

PlayerMissile.prototype.step = function(dt) {
    this.y += this.vy * dt;
    var collision = this.board.collide(this,OBJECT_ENEMY);
    if(collision) {
        collision.hit(this.damage);
        this.board.remove(this);
    } else if(this.y < -this.h) {
        this.board.remove(this);
    }
};

///////////////////////////////
//EXPLOSION
///////////////////////////////

var Explosion = function(centerX,centerY) {
    this.setup('explosion', { frame: 0 });
    this.x = centerX - this.w/2;
    this.y = centerY - this.h/2;
    this.subFrame = 0;
};

Explosion.prototype = new Sprite();

Explosion.prototype.step = function(dt) {
    this.frame = Math.floor(this.subFrame++ / 3);
    if(this.subFrame >= 36) {
        this.board.remove(this);
    }
};

//y la explosión se crea cuando se destruye un enemigo:
Enemy.prototype.hit = function(damage) {
    this.health -= damage;
    if(this.health <=0) {
        if(this.board.remove(this)) {
            this.board.add(new Explosion(this.x + this.w/2, this.y + this.h/2));
        }
    }
}

///////////////////////////////
//STARFIELD
///////////////////////////////

var Starfield = function(speed,opacity,numStars,clear) {
    // Set up the offscreen canvas
    var stars = document.createElement("canvas");
    stars.width = Game.width;
    stars.height = Game.height;
    var starCtx = stars.getContext("2d");
    var offset = 0;
    // If the clear option is set,
    // make the background black instead of transparent
    if(clear) {
        starCtx.fillStyle = "#000";
        starCtx.fillRect(0,0,stars.width,stars.height);
    }
    // Now draw a bunch of random 2 pixel
    // rectangles onto the offscreen canvas
    starCtx.fillStyle = "#FFF";
    starCtx.globalAlpha = opacity;
    for(var i=0;i<numStars;i++) {
        starCtx.fillRect(Math.floor(Math.random()*stars.width),
        Math.floor(Math.random()*stars.height),
        2,
        2);
    }
    // This method is called every frame
    // to draw the starfield onto the canvas
    this.draw = function(ctx) {
        var intOffset = Math.floor(offset);
        var remaining = stars.height - intOffset;
        // Draw the top half of the starfield
        if(intOffset > 0) {
            ctx.drawImage(stars,
            0, remaining,
            stars.width, intOffset,
            0, 0,
            stars.width, intOffset);
        }
        // Draw the bottom half of the starfield
        if(remaining > 0) {
            ctx.drawImage(stars,
                0, 0,
            stars.width, remaining,
            0, intOffset,
            stars.width, remaining);
        }
    };
    // This method is called to update
    // the starfield
    this.step = function(dt) {
        offset += dt * speed;
        offset = offset % stars.height;
    };
};

///////////////////////////////
//ENEMIGOS
///////////////////////////////

var Enemy = function(blueprint,override) {
    this.merge(this.baseParameters);
    this.setup(blueprint.sprite,blueprint);
    this.merge(override);
}

Enemy.prototype = new Sprite();
Enemy.prototype.type = OBJECT_ENEMY;

Enemy.prototype.baseParameters = { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0, G: 0, H: 0, t: 0 }; 

Enemy.prototype.step = function(dt) {
    this.t += dt;
    this.vx = this.A + this.B * Math.sin(this.C * this.t + this.D);
    this.vy = this.E + this.F * Math.sin(this.G * this.t + this.H);
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    if(this.y > Game.height || this.x < -this.w || this.x > Game.width) {
        this.board.remove(this);
    }
    //Para ver si la nave colisiona con el jugador
    var collision = this.board.collide(this,OBJECT_PLAYER);
    if(collision) {
        collision.hit(this.damage);
        this.board.remove(this);
    }
}

Enemy.prototype.hit = function(damage) {
    this.health -= damage;
    if(this.health <= 0)
        this.board.remove(this);
}
    

// NOS TOCA PÁGINA 25, Colisiones de los enemigos con el jugador