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

com.hiyoko.sweet.MapOrganizer.Map.prototype.bindEvents = function() {
	this.$html.click(function(e) {
		var $target = $(e.target);
		this.clearCircles();
		this.clearCanvas();
		if(! $target.hasClass('com-hiyoko-dodontof-map-object-characterData')) {
			return;
		}
		this.drawCircles($target, [50,30,20,10,5,3]);
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
	canvas.strokeStyle = "rgb(0, 255, 0)";
	canvas.save();
	return canvas;
};

com.hiyoko.sweet.MapOrganizer.Map.prototype.clearCanvas = function() {
	this.canvas.clearRect(0, 0, Number(this.$html.css('width').replace('px', '')), Number(this.$html.css('height').replace('px', '')));
};

com.hiyoko.sweet.MapOrganizer.Map.prototype.clearCircles = function() {
	this.getElementsByClass('rangeCircle').remove();
	this.$base = null;
};

com.hiyoko.sweet.MapOrganizer.Map.prototype.drawCircles = function($base, ranges) {
	var length = ranges.length;
	ranges.sort(function(a, b){return b-a;}).forEach(function(range, i) {
		var color = com.hiyoko.util.format('rgb(%s,0,%s)', Math.floor((255/length) * i), Math.floor((255/length) * (length - i)));
		this.drawCircle($base, range, color);
	}.bind(this));
	this.$base = $base;
};

com.hiyoko.sweet.MapOrganizer.Map.prototype.drawCircle = function($base, range, color) {
	var distance = (range/this.scale) * this.size;
	var basePoint = $base.position();
	basePoint.top += (Number($base.css('width').replace('px', '')) / 2) - distance;
	basePoint.left += (Number($base.css('width').replace('px', '')) / 2) - distance;
	
	$circle = $(com.hiyoko.util.format('<div class="%s-rangeCircle"><span class="%s-rangeCircle-text">%s</span></div>', this.id, this.id, range + 'm'));
	$circle.css({
		'background-color': color, 'border-color': color,
		top: basePoint.top + 'px', left: basePoint.left + 'px',
		height: distance * 2 + 'px', width: distance * 2 + 'px'
	});
	this.$html.append($circle);
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

