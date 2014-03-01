/* 3hgj Testing
*/

var t;
var i = 0;
var freq1 = (15);
var freq2 = (30);
var level = 0;
var justChanged = false;
var currentLevel = 1;
var innerWidth = window.innerWidth;
var innerHeight = window.innerHeight;
var amp = innerHeight-2*120-62*3;

window.onload = function() {
	var state = {preload:preload, create:create, update:update, render:render};
	game = new Phaser.Game(innerWidth, innerHeight, Phaser.CANVAS, "", state);

	function preload() {
		game.load.image('background', 'background.jpg');
	}

	function create() {
		bg = game.add.tileSprite(0, 0, innerWidth, innerHeight, 'background');

		game.world.setBounds(0, 0, innerWidth, innerHeight);

		player = game.add.sprite(innerWidth/4, innerHeight/2);

		player.gameOver = false;
		player.totMove = 0;

		player.body.setRectangle(32, 32);
		player.body.collideWorldBounds = true;

		cursors = game.input.keyboard.createCursorKeys();
		jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);


		ceilin = game.add.group();
		ground = game.add.group();
		for(i=0; i<Math.ceil(innerWidth/32); i++) {
			var h = (amp*Math.sin(2*Math.PI*(i/15))+120 + amp*Math.cos(2*Math.PI*(i/30))+120)/2;
			var block = ground.create(i*32, innerHeight-h);

			block.anchor.setTo(-0.5, -0.5);
			block.top = false;

			block.body.immovable = true;
			block.body.setRectangle(32, h);
			block.body.collideWorldBounds = false;

			var h = (amp*Math.cos(2*Math.PI*(i/15))+120 + amp*Math.sin(2*Math.PI*(i/30))+120)/2;
			var block = ground.create(i*32, 0);

			block.anchor.setTo(0, 0);
			block.top = true;

			block.body.immovable = true;
			block.body.setRectangle(32, h);
			block.body.collideWorldBounds = false;
		}

		var text = "Score = "+(i-Math.ceil(innerWidth/32)).toString()+"\nLevel = "+currentLevel.toString();
	    var style = { font: "20px Arial", fill: "#ff0044", align: "center" };
	    t = game.add.text(innerWidth-100, 100, text, style);
	    t.anchor.setTo(0.5, 0.5);
	}

	function update() {
		player.body.velocity.x = 0;
		player.body.acceleration.y = 0;

		if(player.gameOver) {

			t.setText("Score = "+(i-Math.ceil(innerWidth/32)).toString()+"\nLevel = "+currentLevel.toString()+"\nGAME OVER!");
			t.x = innerWidth/2;
			t.y = innerHeight/2;

			return;
		} 

		player.body.velocity.x = 100;
		if(cursors.up.isDown) player.body.acceleration.y = -600;
		else if(cursors.down.isDown) player.body.acceleration.y = 600;

		ground.forEach(function(block) {
			block.body.x -= player.body.deltaX();
		}, this, true);

		game.physics.collide(player, ground, handler, null, this);

		ground.forEach(function(block) {
			block.body.velocity.setTo(0, 0);
		}, this, true);

		if(i%60==0 && justChanged) {
			console.log(i);
			freq1 = (-level*Math.random()+15);
			freq2 = (-level*Math.random()+30);
			level += 1;
			currentLevel++;
			justChanged = false;
		}

		ground.forEach(function(block) {
			if(block.x<=0) {
				if(block.top) {
					i++;
					justChanged = true;
					var h = (amp*Math.cos(2*Math.PI*(i/freq1))+120 + amp*Math.sin(2*Math.PI*(i/freq2))+120)/2;
					block.x += innerWidth+32;
					block.y  = 0;
					block.body.setRectangle(32, h);
				} else {
					var h = (amp*Math.sin(2*Math.PI*(i/freq1))+120 + amp*Math.cos(2*Math.PI*(i/freq2))+120)/2;
					block.x += innerWidth+32;
					block.y  = 16+innerHeight-h;
					block.body.setRectangle(32, h);
				}
			}
		}, this, true);

		player.body.x -= player.body.deltaX();

		t.setText("Score = "+(i-Math.ceil(innerWidth/32)).toString()+"\nLevel = "+currentLevel.toString());
	}

	function render() {
		game.debug.renderSpriteBody(player, "#FFFFFF");

		ground.forEach(function(block) {
			game.debug.renderSpriteBody(block, "#00FF00");
		}, this, true);
	}

	function handler() {
		player.gameOver = true;
	}
};
