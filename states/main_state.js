var Phaser=Phaser||{};
var LuFish=LuFish||{};
var player,myboat;
var boat_float_range=120;
var direct=1;
LuFish.MainState = function () {
    "use strict";
    LuFish.BaseState.call(this);
};
LuFish.MainState.prototype = Object.create(LuFish.BaseState.prototype);
LuFish.MainState.prototype.constructor = LuFish.MainState;

LuFish.MainState.prototype.make_fullscreen=function(){
    game.scale.startFullScreen(false);
    this.startbtn.visible=false;
}
LuFish.MainState.prototype.create=function() {
    "use strict";
    game.physics.startSystem(Phaser.Physics.P2JS);
    game.physics.p2.gravity.y = 1000;

    game.add.sprite(0,0,'bg5');
    var bg4=game.add.tileSprite(0,0,WIDTH,HEIGHT,'bg4');
    bg4.autoScroll(-10,0);
    var bg3cache=game.cache.getImage('bg3');
    var bgw=bg3cache.width;
    var bgh=bg3cache.height;
    var bg3=game.add.tileSprite(0,HEIGHT-bgh+50,bgw,bgh,'bg3');
    bg3.autoScroll(-20,0);

    var btcache=game.cache.getImage('myboat');
    var btw=btcache.width;
    var bth=btcache.height;
    console.log("btw:"+btw+",bth:"+bth);
    myboat=game.add.sprite((WIDTH-btw)/2,HEIGHT-bth+30,'myboat');
    game.physics.p2.enable(myboat,true);
    //myboat.body.clearShapes();
    //myboat.body.loadPolygon("myboat_body","myboat");
    //myboat.body.immovable = true;

    //game.add.tween(myboat).to({y:HEIGHT-bth+4},2000,null,true,0,Number.MAX_VALUE,true);

    var wtcache=game.cache.getImage('water');
    var wtw=wtcache.width;
    var wth=wtcache.height;
    var water=game.add.tileSprite(0,HEIGHT-wth+20,wtw+10,wth,'water');
    water.alpha=0.45;
    water.autoScroll(-400,0);

    var btcache=game.cache.getImage('startbtn');
    this.startbtn=game.add.button((WIDTH-btcache.width)/2,(HEIGHT-btcache.height)/2,'startbtn',this.make_fullscreen,this,0,0,0,0);

    player=game.add.sprite(500,10,"man");
    game.physics.arcade.enable(player);
    player.body.bounce.y=0.2;
    player.body.gravity.y=300;
    player.body.collideWorldBounds=true;

    player.animations.add('stand');
    player.animations.play('stand',20,true);
}
LuFish.MainState.prototype.update=function() {
    //game.physics.arcade.collide(player,platforms);
    //if(boat_float_range==0){
        //boat_float_range=120;
        //direct=direct*-1;
    //}
    //myboat.y-=0.2*direct;
    //boat_float_range-=1;
}

LuFish.MainState.prototype.render=function(){
    game.debug.body(myboat);
    game.debug.body(player);
}
//LuFish.MainState.prototype.render=function () {
    //if (game.scale.isFullScreen) {
        //game.debug.text('ESC to leave fullscreen', 270, 16);
    //} else {
        //game.debug.text('Click / Tap to go fullscreen', 270, 16);
    //}
//}
