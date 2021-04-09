var startGame = function() {
  Game.setBoard(0,new TitleScreen("START", "Press enter to start playing",
    playGame));
}

var playGame = function() {
    var board = new GameBoard();
    board.add(new Background());
    Game.setBoard(0,board);
    
    var playBoard = new GameBoard();

    playBoard.add(new Car("blue_car", 2, 50));
    playBoard.add(new Car("red_truck", 1, 50));
    playBoard.add(new Car("yellow_car", 0, 50));
    playBoard.add(new Car("green_car", 3, 50));
    playBoard.add(new Car("brown_truck", 4, 50));

    playBoard.add(new Trunk("medium_log", 6,55));
    playBoard.add(new Trunk("medium_log", 8,55));
    playBoard.add(new Trunk("short_log", 10,55));

    playBoard.add(new Tortoise("tortoise_swim", 7,55));
    playBoard.add(new Tortoise("tortoise_swim", 9,55));

    playBoard.add(new Water());

    playBoard.add(new Frog());
    
    Game.setBoard(1,playBoard);
};

var winGame = function() {
    Game.setBoard(0,new TitleScreen("You win!",
    "Press space to play again",
    playGame));
};

var loseGame = function() {
    var playBoard = new GameBoard();
    Game.setBoard(1,playBoard);
    Game.setBoard(0,new TitleScreen("You lose!",
    "Press enter to play again",
    playGame));
    };

var level1 = [
    // Start, End, Gap, Type, Override
    [ 0, 4000, 500, 'step' ],
    [ 6000, 13000, 800, 'ltr' ],
    [ 12000, 16000, 400, 'circle' ],
    [ 18200, 20000, 500, 'straight', { x: 150 } ],
    [ 18200, 20000, 500, 'straight', { x: 100 } ],
    [ 18400, 20000, 500, 'straight', { x: 200 } ],
    [ 22000, 25000, 400, 'wiggle', { x: 300 }],
    [ 22000, 25000, 400, 'wiggle', { x: 200 }]
];
    
var sprites = { 
    frog:            {sx:0, sy:338, w:39, h:53, frames:7},
    blue_car:        {sx:8, sy:8, w:90, h:47, frames:1},
    green_car:       {sx:109, sy:6, w:93, h:47, frames:1},
    yellow_car:      {sx:214, sy:7, w:93, h:47, frames:1},
    red_truck:       {sx:7, sy:64, w:123, h:42, frames:1},
    brown_truck:     {sx:147, sy:63, w:200, h:45, frames:1},
    short_log:       {sx:270, sy:172, w:131, h:40, frames:1},
    medium_log:      {sx:9, sy:123, w:191, h:40, frames:1},
    long_log:        {sx:9, sy:172, w:248, h:4, frames:1},
    skull:           {sx:211, sy:127, w:48, h:36, frames:4},
    lilypad:         {sx:5, sy:235, w:42, h:39, frames:1},
    fly:             {sx:58, sy:240, w:28, h:31, frames:1},
    green_box:       {sx:95, sy:225, w:57, h:57, frames:1},
    blue_box:        {sx:159, sy:225, w:57, h:57, frames:1},
    road_box:        {sx:222, sy:225, w:57, h:57, frames:1},
    leaves:          {sx:285, sy:225, w:57, h:57, frames:1},
    leaves_lilypad:  {sx:348, sy:225, w:57, h:57, frames:1},
    tortoise_framed: {sx:6, sy:288, w:48, h:47, frames:8},
    tortoise_swim:   {sx:282, sy:344, w:53, h:43, frames:2},
    logo:            {sx:8, sy:395, w:260, h:162, frames:1},
    background:      {sx:421, sy:0, w:550, h:625, frames:1},
    water:           {sx:421, sy:48, w:550, h:240, frames:1},
};

// Indica que se llame al método de inicialización una vez
// se haya terminado de cargar la página HTML
// y este después de realizar la inicialización llamará a
// startGame
window.addEventListener("load", function() {
    Game.initialize("game",sprites,startGame);
});

/*var callback = function(){
        SpriteSheet.draw(ctx, "ship_player", 0,0,0);
        SpriteSheet.draw(ctx, "ship_purple_enemy", 0,50,0);
        SpriteSheet.draw(ctx, "ship_orange_enemy", 0,100,0);
        SpriteSheet.draw(ctx, "ship_grey_enemy", 0,150,0);
        SpriteSheet.draw(ctx, "ship_green_enemy", 0,200,0);
        SpriteSheet.draw(ctx, "player_missile", 0,250,0);
        SpriteSheet.draw(ctx, "enemy_missile", 0,300,0);
        var i = 11;
        timer = setInterval(function() {
            SpriteSheet.draw(ctx, "explosion", 0,350,i)
            i -= 1;
            if(i == -1){
                clearInterval(timer);
            }
          }, 16);
    }*/