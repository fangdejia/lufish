var game=new Phaser.Game(240,400,Phaser.CANVAS,"game");
game.my_status={};
game.score=0;
var upKey;
//启动动画
game.my_status.boot={
    preload: function(){
        game.load.image('preload', 'assets/preloader.gif');
        if(!game.device.desktop){ game.scale.scaleMode=Phaser.ScaleManager.EXACT_FIT; }
    },
    create: function(){
        game.stage.disableVisibilityChange=false;//失去焦点后还可以运行
        game.state.start("load");
    }
}
//加载资源
game.my_status.load={
    preload: function(){
        game.load.setPreloadSprite(game.add.sprite(game.width/2-220/2,game.height/2-19/2,'preload'));//预加载进度条
        img_res=['bg.jpg','copyright.png','mybullet.png','bullet.png','enemy1.png','enemy2.png','enemy3.png','award.png'];
        for(var i=0;i<img_res.length;i++){game.load.image(img_res[i].split(".")[0],'assets/'+img_res[i]);}
        audio_res=['normalback.mp3','playback.mp3','fashe.mp3','crash1.mp3','crash2.mp3','crash3.mp3','ao.mp3','pi.mp3','deng.mp3']
        for(var i=0;i<audio_res.length;i++){game.load.image(audio_res[i].split(".")[0],'assets/'+audio_res[i]);}
        game.load.spritesheet('myplane', 'assets/myplane.png', 40, 40, 4);
        game.load.spritesheet('myexplode', 'assets/myexplode.png', 40, 40, 3);
        game.load.spritesheet('startbutton', 'assets/startbutton.png', 100, 40, 2);
        game.load.spritesheet('replaybutton', 'assets/replaybutton.png', 80, 30, 2);
        game.load.spritesheet('sharebutton', 'assets/sharebutton.png', 80, 30, 2);
        game.load.spritesheet('explode1', 'assets/explode1.png', 20, 20, 3);
        game.load.spritesheet('explode2', 'assets/explode2.png', 30, 30, 3);
        game.load.spritesheet('explode3', 'assets/explode3.png', 50, 50, 3);
        game.load.onFileComplete.add(function(){ console.log(arguments); });//前面都是加载指令，都是异步
    },
    create: function(){ game.state.start("start"); },
}
game.my_status.start={
    create: function(){
        //开始游戏背景和按钮
        game.add.image(0,0,"bg");
        game.add.image((game.width-216)/2,game.height-16,"copyright");
        var myplane=game.add.sprite(100,100,"myplane");
        myplane.animations.add('fly');
        myplane.animations.play('fly',12,true);
        game.add.button(70,200,'startbutton',this.on_click_start,this,1,1,0);
        this.normalback=game.add.audio('normalback', 0.2, true); // 背景音乐
        try{this.normalback.play();}catch(e){}
    },
    on_click_start:function(){
        game.state.start("play");
        this.normalback.stop();
    }
}
game.my_status.play={
    create: function(){
        //开启物理引擎,让背景循环向下滚动
        game.physics.startSystem(Phaser.Physics.ARCADE);
        var bg=game.add.tileSprite(0,0,game.width,game.height,'bg');
        bg.autoScroll(0,20);
        this.myplane=game.add.sprite(100,100,"myplane");
        this.myplane.animations.add('fly');
        this.myplane.animations.play('fly',12,true);
        game.physics.arcade.enable(this.myplane);
        this.myplane.body.collideWorldBounds=true;
        this.myplane.life=2;
        var ptween=game.add.tween(this.myplane).to({y:game.height-40},1000,null,true);
        ptween.onComplete.add(this.onStart,this);
        // 背景音乐
        this.playback = game.add.audio('playback', 0.2, true);
        try{ this.playback.play();}catch(e){}
        // 开火音乐
        this.pi = game.add.audio('pi', 1, false);
        // 打中敌人音乐
        this.firesound = game.add.audio('fashe', 5, false);
        // 爆炸音乐
        this.crash1 = game.add.audio('crash1', 10, false);
        this.crash2 = game.add.audio('crash2', 10, false);
        this.crash3 = game.add.audio('crash3', 20, false);
        this.ao = game.add.audio('ao', 10, false); // 挂了音乐
        this.deng = game.add.audio('deng', 10, false); // 接到了奖音乐

    },
    update: function(){
        if(this.myplane.startFire){
            this.myPlaneFire();
            this.generateEnemy();
            this.enemyFire();
            //子弹和敌人的碰撞检测
            game.physics.arcade.overlap(this.mybullets,this.enemys,this.hitEnemy,null,this);
            game.physics.arcade.overlap(this.enemyBullets,this.myplane,this.hitPlane,null,this);
            game.physics.arcade.overlap(this.awards,this.myplane,this.getAward,null,this);
            game.physics.arcade.overlap(this.enemys,this.myplane,this.crash,null,this);
        }
    },
    crash:function(myplane,enemy){
        myplane.kill();
        myplane.alive=false;
        var expl=game.add.sprite(myplane.x,myplane.y,'myexplode');
        expl.anchor.setTo(0.5,0.5);
        var anim=expl.animations.add('explode');
        anim.play(30,false,false);
        anim.onComplete.addOnce(function(){
            expl.destroy();
            game.state.start('over');
            this.playback.stop();
        },this);
    },
    hitEnemy:function(bullet,enemy){
        enemy.life=enemy.life-1;
        if(enemy.life<=0){
            enemy.kill();
            var expl=game.add.sprite(enemy.x,enemy.y,'explode'+enemy.index);
            expl.anchor.setTo(0.5,0.5);
            var anim=expl.animations.add('explode');
            anim.play(30,false,false);
            anim.onComplete.addOnce(function(){
                expl.destroy();
            });
            game.score+=enemy.score;
            this.text.text="Score:"+game.score;
        }
        bullet.kill();
    },
    hitPlane:function(myplane,bullet){
        bullet.kill();
        console.log(myplane.life);
        myplane.life=myplane.life-1;
        console.log(myplane.life);
        if(myplane.life<=0){
            myplane.kill();
            myplane.alive=false;
            var expl=game.add.sprite(myplane.x,myplane.y,'myexplode');
            expl.anchor.setTo(0.5,0.5);
            var anim=expl.animations.add('explode');
            anim.play(30,false,false);
            anim.onComplete.addOnce(function(){
                expl.destroy();
                game.state.start('over');
                this.playback.stop();
            },this);
        }
    },
    getAward:function(myplane,award){
        award.kill();
        if(myplane.life<=2){
            myplane.life=myplane.life+1;
        }
    },
    onStart:function(){
        //运行飞机可以拖动
        this.myplane.inputEnabled=true;
        this.myplane.input.enableDrag(false);
        this.myplane.startFire=true;
        this.myplane.lastFireTime=0;
        this.mybullets=game.add.group();
        this.enemys=game.add.group();
        this.enemys.lastEnemyTime=0;
        this.enemyBullets=game.add.group();
        this.awards=game.add.group();
        this.text=game.add.text(0, 0, "Score: 0", {font: "16px Arial", fill: "#ff0000"});
        game.time.events.loop(Phaser.Timer.SECOND*3,this.generateAward, this);//每隔3秒执行一次
    },
    myPlaneFire:function(){
        var now=game.time.now;
        var getMyPlaneBullet=function(){
            var mybullet=this.mybullets.getFirstExists(false,false,this.myplane.x+15,this.myplane.y-7);
            if(!mybullet){
                mybullet=game.add.sprite(this.myplane.x+15,this.myplane.y-7,'mybullet');
                mybullet.outOfBoundsKill=true;
                mybullet.checkWorldBounds=true;
                this.mybullets.addChild(mybullet);
                game.physics.enable(mybullet,Phaser.Physics.ARCADE);//一定要放addChild后？
            }
            return mybullet;
        }
        if(this.myplane.alive && now-this.myplane.lastFireTime>500){
            var mybullet=getMyPlaneBullet.call(this);
            mybullet.body.velocity.y=-200;
            if(this.myplane.life>=2){
                var mybullet=getMyPlaneBullet.call(this);
                mybullet.body.velocity.x=-40;
                mybullet.body.velocity.y=-200;
                var mybullet=getMyPlaneBullet.call(this);
                mybullet.body.velocity.x=40;
                mybullet.body.velocity.y=-200;
            }
            this.myplane.lastFireTime=now;
        }
    },
    generateEnemy:function(){
        var now=game.time.now;
        if(now-this.enemys.lastEnemyTime>2000){
            var enemyIndex=game.rnd.integerInRange(1,3);
            var key='enemy'+enemyIndex;
            var size=game.cache.getImage(key).width;
            var x=game.rnd.integerInRange(size/2,game.width-size/2);
            var y=0;
            var enemy=this.enemys.getFirstExists(false,true,x,y,key);
            enemy.anchor.set(0.5,0.5);
            enemy.outOfBoundsKill=true;
            enemy.checkWorldBounds=true;
            game.physics.arcade.enable(enemy);
            enemy.body.setSize(size,size);
            enemy.body.velocity.y=20;
            enemy.lastFireTime=0;
            enemy.size=size;
            enemy.index=enemyIndex
            if(enemyIndex==1){
                enemy.bulletV=40;
                enemy.bulletTime=6000;
                enemy.life=2;
                enemy.score=20;
            }else if (enemyIndex==2){
                enemy.bulletV=80;
                enemy.bulletTime=4000;
                enemy.life=4;
                enemy.score=30;
            }else if (enemyIndex==3){
                enemy.bulletV=120;
                enemy.bulletTime=2000;
                enemy.life=6;
                enemy.score=50;
            }
            this.enemys.lastEnemyTime=now;
        }
    },
    enemyFire:function(){
        var now=game.time.now;
        this.enemys.forEachAlive(function(enemy){
            if(now-enemy.lastFireTime>enemy.bulletTime){
                var bullet=this.enemyBullets.getFirstExists(false,true,enemy.x,enemy.y+enemy.size/2,'bullet');
                bullet.anchor.set(0.5,0.5);
                bullet.outOfBoundsKill=true;
                bullet.checkWorldBounds=true;
                game.physics.arcade.enable(bullet);
                bullet.body.velocity.y=enemy.bulletV;
                enemy.lastFireTime=now;
            }
        },this);
    },
    generateAward:function(){
        var awardSize=game.cache.getImage('award');
        var x=game.rnd.integerInRange(0,game.width-awardSize.width);
        var y=-awardSize.height;
        var award=this.awards.getFirstExists(false,true,x,y,'award');
        award.outOfBoundsKill=true;
        award.checkWorldBounds=true;
        game.physics.arcade.enable(award);
        award.body.velocity.y=300;
        console.log(this.awards.length);
    }
    //render:function(){
        //if(this.enemys){
            //this.enemys.forEachAlive(function(enemy){
                //game.debug.body(enemy);
            //});
        //}
    //}
}
game.my_status.over={
    create: function(){
        //开始游戏背景和按钮
        game.add.image(0,0,"bg");
        game.add.image((game.width-216)/2,game.height-16,"copyright");
        var myplane=game.add.sprite(100,100,"myplane");
        myplane.animations.add('fly');
        myplane.animations.play('fly',12,true);
        this.text=game.add.text(0, 0, "Score: "+game.score, {font: "bold 32px Arial", fill: "#ff0000", boundsAlignH: "center", boundsAlignV: "middle"});
        this.text.setTextBounds(0, 0, game.width, game.height);
        this.replaybutton = game.add.button(30, 300, 'replaybutton', this.onReplayClick, this, 0, 0, 1); // 重来按钮
        this.sharebutton = game.add.button(130, 300, 'sharebutton', this.onShareClick, this, 0, 0, 1); // 分享按钮
        this.normalback = game.add.audio('normalback', 0.2, true); // 背景音乐
        this.normalback.play();

    },
    onReplayClick:function(){
        game.score=0;
        this.normalback.stop();
        game.state.start("play");
    },
    onShareClick:function(){

    }
}
for( k in game.my_status){game.state.add(k,game.my_status[k]);}
game.state.start("boot");
