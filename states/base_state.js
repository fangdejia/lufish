var Phaser=Phaser||{};
var LuFish=LuFish||{};

LuFish.BaseState = function () {
  "use strict";
  Phaser.State.call(this);
};

LuFish.BaseState.prototype = Object.create(Phaser.State.prototype);
LuFish.BaseState.prototype.constructor = LuFish.BaseState;
