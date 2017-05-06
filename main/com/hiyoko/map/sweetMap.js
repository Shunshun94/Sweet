var com = com || {};
com.hiyoko = com.hiyoko || {};
com.hiyoko.sweet = com.hiyoko.sweet || {};
com.hiyoko.sweet.MapOrganizer = com.hiyoko.sweet.MapOrganizer || {};

com.hiyoko.sweet.MapOrganizer.Map = function($html, opt_options) {
	var options = opt_options || {};
	this.$html = $($html);
	this.id = this.$html.attr('id');
	this.base = com.hiyoko.DodontoF.V2.Map;
	this.$base = null;
	this.addMethods(com.hiyoko.sweet.MapOrganizer.Map.getRange(options));
	
	this.scale = options.scale || 1;
	this.size = options.size || 20;
	this.maxSize = options.maxSize || 0;
	
	if(this.$html.css('position') === 'static') {
		this.$html.css('position', 'relative');
	}
	 
	this.drawStarter(function(dummy, mapSize) {
		this.canvas = this.addCanvas(mapSize.size);
	}.bind(this));
	this.bindEvents();
};

com.hiyoko.util.extend(com.hiyoko.DodontoF.V2.Map, com.hiyoko.sweet.MapOrganizer.Map);

com.hiyoko.sweet.MapOrganizer.Map.prototype.addMethods = function(base) {
	com.hiyoko.util.forEachMap(base, function(v, k){
		this[k] = v.bind(this);
	}.bind(this));
};

com.hiyoko.sweet.MapOrganizer.Map.prototype.bindEvents = function() {
	this.$html.click(function(e) {
		var $target = $(e.target);
		this.clearRanges();
		this.clearCanvas();
		if(! $target.hasClass('com-hiyoko-dodontof-map-object-characterData')) {
			return;
		}
		this.drawRanges($target, [50,30,20,10,5,3]);
	}.bind(this));
	
	this.$html.mousemove(function(e) {
		if(this.$base) {
			this.drawLine(this.$base, e);
		}
	}.bind(this));
};

com.hiyoko.sweet.MapOrganizer.Map.prototype.addCanvas = function(size) {
	var $canvas = $(com.hiyoko.util.format('<canvas id="%s-canvas" width="%s" height="%s"></canvas>',
			this.id, size.x * this.size, size.y * this.size));
	this.$html.append($canvas);
	var canvas = document.getElementById(this.id + '-canvas').getContext('2d');
	canvas.strokeStyle = "#ff42ff";
	canvas.save();
	return canvas;
};

com.hiyoko.sweet.MapOrganizer.Map.prototype.clearCanvas = function() {
	this.canvas.clearRect(0, 0, Number(this.$html.css('width').replace('px', '')), Number(this.$html.css('height').replace('px', '')));
};

com.hiyoko.sweet.MapOrganizer.Map.prototype.drawLine = function($base, e) {
	this.clearCanvas();
	this.canvas.beginPath();
	var basePoint = $base.position();
	basePoint.top += (Number($base.css('width').replace('px', '')) / 2);
	basePoint.left += (Number($base.css('width').replace('px', '')) / 2);
	this.canvas.moveTo(basePoint.left, basePoint.top);
	this.canvas.lineTo(e.pageX, e.pageY);
	this.canvas.stroke();
};


com.hiyoko.sweet.MapOrganizer.Map.prototype.clearRanges = function() {
	throw "clearRanges must be overridden by com.hiyoko.sweet.MapOrganizer.Map.XxxRange";
};

com.hiyoko.sweet.MapOrganizer.Map.prototype.drawRanges = function($base, ranges) {
	throw "clearRanges must be overridden by com.hiyoko.sweet.MapOrganizer.Map.XxxRange";
};
