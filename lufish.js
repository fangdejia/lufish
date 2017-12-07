var Phaser=Phaser||{};
var LuFish=LuFish||{};
var game = new Phaser.Game(WIDTH, HEIGHT, Phaser.CANVAS, 'game');
game.state.add("boot", new LuFish.BootState());
game.state.add("load", new LuFish.LoadState());
game.state.add("main", new LuFish.MainState());
game.state.start("boot");
