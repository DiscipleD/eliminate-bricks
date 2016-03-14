/**
 * @author jianzhe.ding
 * @homepage https://github.com/discipled/
 * @since 2016-03-11 16:58
 */

(function (window) {
	var canvas = document.getElementById('main-screen');

	var Game = function() {
		this.run = false;
	};

	var GameFrame = function(canvas, game) {
		this.canvas = canvas;
		this.ct = this.canvas.getContext('2d');
		this.game = game;
	};
	GameFrame.prototype.getBoardX = function(x, board) {
		return x < board.width / 2 ? 0 : x > this.canvas.width - board.width / 2 ? this.canvas.width - board.width : x - board.width / 2;
	};
	GameFrame.prototype.clear = function() {
		// this.ct.fillStyle = 'rgba(255,255,255,0.3)';
		this.ct.clearRect(0, 0, this.canvas.width, this.canvas.height);
	};
	GameFrame.prototype.init = function() {
		var $this = this;
		var ref;
		var ball = new Ball($this.ct);
		var board = new ControlBoard($this.ct);

		board.x = ($this.canvas.width - board.width) / 2;
		board.y = $this.canvas.height - board.height;
		ball.x = $this.canvas.width / 2;
		ball.y = board.y - ball.radius;

		ball.draw();
		board.draw();

		$this.canvas.addEventListener('mousemove', function (e) {
			if ($this.game.run) {

			} else {
				$this.clear();
				board.x = $this.getBoardX(e.clientX, board);
				ball.x = e.clientX < ball.radius ? ball.radius : e.clientX > $this.canvas.width - ball.radius ? $this.canvas.width - ball.radius : e.clientX;

				ball.draw();
				board.draw();
			}
		});

		this.canvas.addEventListener();

		$this.canvas.addEventListener('mouseout', function() {
			window.cancelAnimationFrame(ref);
			$this.game.run = false;
		});
	};

	var Ball = function (ct) {
		this.ct = ct;
		this.x = 0;
		this.y = 0;
		this.radius = 15;
		this.color = 'blue';
	};

	Ball.prototype.draw = function() {
		this.ct.beginPath();
		this.ct.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
		this.ct.closePath();
		this.ct.fillStyle = this.color;
		this.ct.fill();
	};

	var ControlBoard = function (ct) {
		this.ct = ct;
		this.x = 0;
		this.y = 0;
		this.width = 150;
		this.height = 20;
		this.color = 'brown';
	};
	ControlBoard.prototype.draw = function() {
		this.ct.beginPath();
		this.ct.fillStyle = this.color;
		this.ct.fillRect(this.x, this.y, this.width, this.height);
	};

	var game = new Game();
	var gameFrame = new GameFrame(canvas, game);
	gameFrame.init();
})(window);