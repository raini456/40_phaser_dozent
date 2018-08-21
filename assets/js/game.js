//https://phaser.io/tutorials/making-your-first-phaser-3-game/part10

//https://photonstorm.github.io/phaser3-docs/index.html

//https://photonstorm.github.io/phaser-ce/

//Examples
//https://labs.phaser.io/

(function () {

    var platforms, player, cursors, stars, bombs;
    var score = 0;
    var scoreText;

    var config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: {y: 400},
                debug: false
            }
        },
        scene: {
            preload: preload,
            create: create,
            update: update
        }
    };

    var game = new Phaser.Game(config);

    function preload() {
        this.load.image('sky', 'assets/images/sky.png');
        this.load.image('star', 'assets/images/star.png');
        this.load.image('ground', 'assets/images/platform.png');
        this.load.image('bomb', 'assets/images/bomb.png');
        this.load.spritesheet('dude', 'assets/images/dude.png', {
            frameWidth: 32,
            frameHeight: 48
        });
        this.load.audioSprite('sfx', 'assets/audio/fx_mixdown.json', [
            'assets/audio/fx_mixdown.ogg',
            'assets/audio/fx_mixdown.mp3'
        ]);
    }
    function create() {
        this.add.image(400, 300, 'sky');

        platforms = this.physics.add.staticGroup();
        platforms.create(400, 568, 'ground').setScale(2).refreshBody();
        platforms.create(600, 400, 'ground');
        platforms.create(50, 250, 'ground');
        platforms.create(750, 220, 'ground');

        //Player
        player = this.physics.add.sprite(300, 150, 'dude');
        player.setBounce(0.2);
        player.setCollideWorldBounds(true);

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', {
                start: 0,
                end: 3
            }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', {
                start: 5,
                end: 8
            }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'turn',
            frames: [{key: 'dude', frame: 4}],
            frameRate: 20
        });


        this.physics.add.collider(player, platforms);

        cursors = this.input.keyboard.createCursorKeys();

//        this.add.image(400, 300, 'star');
        stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: {x: 10, y: 10, stepX: 50}
        });

        stars.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.2, 0.7));
        });

        this.physics.add.collider(stars, platforms);

        this.physics.add.overlap(player, stars, collectStar, null, this);

        //Text
        scoreText = this.add.text(20, 20, 'Points: 0', {
            fontSize: '40px',
            fill: '#fff'
        });

        //bombs
        bombs = this.physics.add.group();
        /**
         * {
         key: 'bomb',
         repeat: 3,
         setXY: {x: 30, y: 5, stepX: 150}
         }
         */
        this.physics.add.collider(bombs, platforms);
        this.physics.add.overlap(player, bombs, bumm, null, this);


    }

    function bumm(player, bomb) {
        this.sound.playAudioSprite('sfx', 'death');
        player.setTint(0xff0000);//.clearTint();
        this.physics.pause();
        player.anims.play('turn');
    }




    function collectStar(player, star) {
        //Audio
        
        this.sound.playAudioSprite('sfx', 'ping');
        
        star.disableBody(true, true);//(disable,hide)
        score += 1;
        scoreText.setText('Points: ' + score);


        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        var bomb = bombs.create(x, 16, 'bomb');
        bomb.setBounce(0.1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        bomb.allowGravity = false;



    }


    function update() {

        if (cursors.left.isDown) {

            player.setVelocityX(-160);
            player.anims.play('left', true);
        } else if (cursors.right.isDown) {
            player.setVelocityX(160);
            player.anims.play('right', true);
        } else {
            player.setVelocityX(0);
            player.anims.play('turn', true);
        }

        if (cursors.up.isDown && player.body.touching.down) {
            player.setVelocityY(-400);

        }


    }

})();