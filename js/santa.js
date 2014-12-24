/**
 * Urucas animatedSprite.js
 * https://github.com/Urucas/animatedSprite.js
 */
var _as = _as || new _asController();

function _asController() {

	this.sprites = [];

	this.addSprite = function(id, params) {
		this.sprites.push(new _asInstance(id, params));
	}

	this.interval = 100;
	this.intervalID = setInterval(function(){
		for(var i=0; i < _as.sprites.length; i++) {
			_as.sprites[i].animate();
		}
	}, this.interval);

	this.stop = function(){
		window.clearInterval(this.intervalID);
	}
}

function _asInstance(id, params){
	this.el = document.getElementById(id);

	this.w = params.width;
	this.h = params.height;
	this.cols   = params.cols;
	this.rows   = params.rows;
	this.image  = params.image;
	this.interval   = params.interval || 100;

	this.posX = 0;
	this.posY = 0;

	this.moveLeft = this.cols != 0 ? this.w/this.cols : 0;
	this.moveDown = this.rows != 0 ? this.h/this.rows : 0;

	this.el.style.width=(this.w/this.cols)+"px";
	this.el.style.height=(this.h/this.rows)+"px";
	this.el.style.backgroundImage = "url('"+this.image+"')";
	this.el.style.backgroundRepeat = "no-repeat";
	this.el.style.backgroundPosition = "0% 0%";

	this.animate = function() {
		this.posX = this.posX-this.moveLeft;
		if(this.posX <= -this.w) {
			this.posX = 0;
			this.posY = this.posY-this.moveDown;
			if(this.posY <= -this.h) {
				this.posY = 0;
			}

		}
		this.el.style.backgroundPosition = this.posX+"px "+this.posY+"px";
	}
}


/*
 * Santa.js
 */
$(document).ready(function(){
	$('#santa').ScrollTo();

	_as.addSprite("santa",{
		width:600,
		height:600,
		cols:4,
		rows:4,
		image:"images/santa.jpg",
		interval: 10
	});

	var audio = document.getElementById("smooth");
	var w = window.screen.availWidth;
	var michael = w/2;
	var stopMichael = (w/4)*3;
	var flipped = false;
	var t = setInterval(function(){
		var pos = parseInt(santa.style.left);
		if(pos > michael && !flipped && pos < stopMichael){
			flipped = true;
			santa.classList.add("flipped");
			bubble.style.display = "block";
		}
		if(pos > stopMichael) {
			santa.classList.remove("flipped");
			bubble.style.display = "none";
		}
		if(pos > w+150) {
			window.clearInterval(t);
			_as.stop();
		}else{
			bubble.style.left = (pos+5)+"px";
			santa.style.left = (pos+10)+"px";
		}
	}, 100);

});

santa.style.position = "relative";
santa.style.left= "-150px";
santa.style.top = "-32px";
santa.style.display = "inline-block";



