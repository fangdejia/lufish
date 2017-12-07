var Phaser=Phaser||{};
var LuFish=LuFish||{};

LuFish.BootState = function () {
    "use strict";
    LuFish.BaseState.call(this);
};

Phaser.World.prototype.displayObjectUpdateTransform = function() {
    if(game.scale.isLandscape) {
        this.x=-game.camera.x;
        this.y=-game.camera.y;
        this.rotation=0;
    } else {
        this.x=game.camera.y+game.width;
        this.y=-game.camera.x;
        this.rotation=Phaser.Math.degToRad(Phaser.Math.wrapAngle(90));
    }
    PIXI.DisplayObject.prototype.updateTransform.call(this);
}

LuFish.BootState.prototype=Object.create(LuFish.BaseState.prototype);
LuFish.BootState.prototype.constructor=LuFish.BootState;
LuFish.BootState.prototype.preload=function () {
    "use strict";
    game.scale.pageAlignHorizontally=true;
    game.scale.pageAlignVertically=true;
    game.scale.scaleMode=Phaser.ScaleManager.SHOW_ALL;
    game.scale.fullScreenScaleMode=Phaser.ScaleManager.SHOW_ALL
    game.load.image('preload', 'assets/preloader.gif');
    if(game.scale.isLandscape) {
        game.scale.setGameSize(WIDTH,HEIGHT);
        //game.scale.setShowAll();
        //game.scale.startFullScreen();
        //game.scale.refresh();
    } else {
        game.scale.setGameSize(HEIGHT,WIDTH);
        game.scale.stopFullScreen();
    }
};

LuFish.BootState.prototype.create=function(){
    "use strict";
    game.scale.onOrientationChange.add(function() {
        if(game.scale.isLandscape) {
            game.scale.setGameSize(WIDTH,HEIGHT);
        } else {
            game.scale.setGameSize(HEIGHT,WIDTH);
            game.scale.stopFullScreen();
        }
    }, this);
    game.state.start("load");
};
