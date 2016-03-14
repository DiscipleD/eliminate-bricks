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
		this.ball = new Ball(this.ct);
		this.board = new ControlBoard(this.ct);
		this.ref;
	};
	GameFrame.prototype.getBoardX = function(x) {
		return x < this.board.width / 2 ? 0 : x > this.canvas.width - this.board.width / 2 ? this.canvas.width - this.board.width : x - this.board.width / 2;
	};
	GameFrame.prototype.clear = function() {
		// this.ct.fillStyle = 'rgba(255,255,255,0.3)';
		this.ct.clearRect(0, 0, this.canvas.width, this.canvas.height - this.board.height);
	};
	GameFrame.prototype.init = function() {
		var $this = this;

		$this.board.x = ($this.canvas.width - $this.board.width) / 2;
		$this.board.y = $this.canvas.height - $this.board.height;
		$this.ball.x = $this.canvas.width / 2;
		$this.ball.y = $this.board.y - $this.ball.radius;

		$this.ball.draw();
		$this.board.draw();

		$this.canvas.addEventListener('mousemove', function (e) {
			if ($this.game.run) {
				$this.ct.clearRect(0, $this.canvas.height - $this.board.height, $this.canvas.width, $this.canvas.height);
				$this.board.x = $this.getBoardX(e.clientX, $this.board);
				$this.board.draw();
			} else {
				$this.ct.clearRect(0, 0, $this.canvas.width, $this.canvas.height);
				$this.board.x = $this.getBoardX(e.clientX, $this.board);
				$this.ball.x = e.clientX < $this.ball.radius ? $this.ball.radius : e.clientX > $this.canvas.width - $this.ball.radius ? $this.canvas.width - $this.ball.radius : e.clientX;

				$this.ball.draw();
				$this.board.draw();
			}
		});

		this.canvas.addEventListener('click', function() {
			if (!$this.game.run) {
				$this.game.run = true;
				$this.ref = window.requestAnimationFrame(function(){$this.draw($this);});
			}
		});

		this.canvas.addEventListener('mouseenter', function() {
			if ($this.game.run) {
				$this.ref = window.requestAnimationFrame(function(){$this.draw($this);});
			}
		});

		$this.canvas.addEventListener('mouseout', function() {
			window.cancelAnimationFrame($this.ref);
		});
	};
	GameFrame.prototype.draw = function(frame) {
		frame.clear();

		frame.ball.x += frame.ball.vx;
		frame.ball.y += frame.ball.vy;

		frame.ball.draw();

		frame.judgeOver() && frame.gameOver();

		if (frame.ball.y + frame.ball.vy > frame.canvas.height - frame.board.height - frame.ball.radius || frame.ball.y + frame.ball.vy < frame.ball.radius) {
			frame.ball.vy = -frame.ball.vy;
		}
		if (frame.ball.x + frame.ball.vx > frame.canvas.width - frame.ball.radius || frame.ball.x + frame.ball.vx < frame.ball.radius) {
			frame.ball.vx = -frame.ball.vx;
		}

		!frame.judgeOver() && (frame.ref = window.requestAnimationFrame(function(){frame.draw(frame);}));
	};
	GameFrame.prototype.judgeOver = function() {
		return this.ball.y + this.ball.vy > this.canvas.height - this.board.height - this.ball.radius && (this.ball.x < this.board.x || this.ball.x > this.board.x + this.board.width);
	};
	GameFrame.prototype.gameOver = function() {
		window.cancelAnimationFrame(this.ref);
		this.game.run = false;
	};

	var Ball = function (ct) {
		this.ct = ct;
		this.x = 0;
		this.vx = 4;
		this.y = 0;
		this.vy = 1;
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