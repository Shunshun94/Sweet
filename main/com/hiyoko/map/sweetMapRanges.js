var com = com || {};
com.hiyoko = com.hiyoko || {};
com.hiyoko.sweet = com.hiyoko.sweet || {};
com.hiyoko.sweet.MapOrganizer = com.hiyoko.sweet.MapOrganizer || {};
com.hiyoko.sweet.MapOrganizer.Map = com.hiyoko.sweet.MapOrganizer.Map || {};

com.hiyoko.sweet.MapOrganizer.Map.getRange = function(args) {
	return com.hiyoko.sweet.MapOrganizer.Map.CircleRange;
};

com.hiyoko.sweet.MapOrganizer.Map.CircleRange = {};

com.hiyoko.sweet.MapOrganizer.Map.CircleRange.clearRanges = function() {
	this.getElementsByClass('rangeCircle').remove();
	this.$base = null;
};

com.hiyoko.sweet.MapOrganizer.Map.CircleRange.drawRanges = function($base, ranges) {
	var length = ranges.length;
	var drawCircle = com.hiyoko.sweet.MapOrganizer.Map.CircleRange.drawCircle.bind(this);
	ranges.sort(function(a, b){return b-a;}).forEach(function(range, i) {
		var color = com.hiyoko.util.format('rgb(%s,0,%s)', Math.floor((255/length) * i), Math.floor((255/length) * (length - i)));
		drawCircle($base, range, color);
	}.bind(this));
	this.$base = $base;
};

com.hiyoko.sweet.MapOrganizer.Map.CircleRange.drawCircle = function($base, range, color) {
	var distance = (range/this.scale) * this.size;
	var basePoint = $base.position();
	basePoint.top += (Number($base.css('width').replace('px', '')) / 2) - distance;
	basePoint.left += (Number($base.css('width').replace('px', '')) / 2) - distance;
	
	var $circle = $(com.hiyoko.util.format('<div class="%s-rangeCircle"><span class="%s-rangeCircle-text">%s</span></div>', this.id, this.id, range + 'm'));
	$circle.css({
		'background-color': color, 'border-color': color,
		top: basePoint.top + 'px', left: basePoint.left + 'px',
		height: distance * 2 + 'px', width: distance * 2 + 'px'
	});
	this.$html.append($circle);
};

