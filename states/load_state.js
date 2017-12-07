var Phaser=Phaser||{};
var LuFish=LuFish||{};

LuFish.LoadState = function () {
    "use strict";
    LuFish.BaseState.call(this);
};
LuFish.LoadState.prototype = Object.create(LuFish.BaseState.prototype);
LuFish.LoadState.prototype.constructor = LuFish.LoadState;

LuFish.LoadState.prototype.preload=function() {
    "use strict";
    game.load.setPreloadSprite(game.add.sprite(WIDTH/2-220/2,HEIGHT/2-19/2,'preload'));//预加载进度条
    var img_res=['myboat.png','water.png'];
    for(var i=0;i<img_res.length;i++){game.load.image(img_res[i].split(".")[0],'assets/'+img_res[i]);}
    game.load.physics("myboat_body","assets/myboat.json")
    var img_res=['bg3.png','bg4.png','bg5.png'];
    for(var i=0;i<img_res.length;i++){game.load.image(img_res[i].split(".")[0],'assets/background/forest_lake/'+img_res[i]);}
    var img_res=['startbtn.png'];
    for(var i=0;i<img_res.length;i++){game.load.image(img_res[i].split(".")[0],'assets/button/'+img_res[i]);}
    game.load.spritesheet('man', 'assets/gun/ready.png', 213,256, 15);
};

LuFish.LoadState.prototype.create=function() {
    "use strict";
    game.state.start("main");
};
