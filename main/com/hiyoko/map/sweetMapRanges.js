var com = com || {};
com.hiyoko = com.hiyoko || {};
com.hiyoko.sweet = com.hiyoko.sweet || {};
com.hiyoko.sweet.MapOrganizer = com.hiyoko.sweet.MapOrganizer || {};
com.hiyoko.sweet.MapOrganizer.Map = com.hiyoko.sweet.MapOrganizer.Map || {};

com.hiyoko.sweet.MapOrganizer.Map.getRange = function(args) {
	if(args.range === 'circle') {
		return com.hiyoko.sweet.MapOrganizer.Map.CircleRange;
	} else {
		return com.hiyoko.sweet.MapOrganizer.Map.SRWRange;
	}
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
		var color = com.hiyoko.util.format('rgb(%s,0,0)', Math.floor((255/length) * i));
		drawCircle($base, range, color);
	}.bind(this));
	this.$base = $base;
};

com.hiyoko.sweet.MapOrganizer.Map.CircleRange.drawCircle = function($base, range, color) {
	var distance = (range/this.scale) * this.size;
	var basePoint = $base.position();
	basePoint.top += (Number($base.css('width').replace('px', '')) / 2) - distance;
	basePoint.left += (Number($base.css('width').replace('px', '')) / 2) - distance;
	
	var $circle = $(com.hiyoko.util.format('<div class="%s-rangeCircle"><span class="%s-range-text">%s</span></div>', this.id, this.id, range + 'm'));
	$circle.css({
		'background-color': color, 'border-color': color,
		top: basePoint.top + 'px', left: basePoint.left + 'px',
		height: distance * 2 + 'px', width: distance * 2 + 'px'
	});
	this.$html.append($circle);
};

com.hiyoko.sweet.MapOrganizer.Map.SRWRange = {};

com.hiyoko.sweet.MapOrganizer.Map.SRWRange.clearRanges = function() {
	this.getElementsByClass('background-col-box').css({
		'border': '1px black solid',
		'background-color': 'transparent',
		'position': 'relative'
	});
	this.getElementsByClass('range-text').remove();
	this.$base = null;
}; 

com.hiyoko.sweet.MapOrganizer.Map.SRWRange.drawRanges = function($base, ranges) {
	var basePoint = $base.position();
	basePoint.top += (Number($base.css('width').replace('px', '')) / 2);
	basePoint.left += (Number($base.css('width').replace('px', '')) / 2);
	basePoint.top = Math.floor(basePoint.top / this.size);
	basePoint.left = Math.floor(basePoint.left / this.size);
	var drawRange = com.hiyoko.sweet.MapOrganizer.Map.SRWRange.drawRange.bind(this);
	console.log(
			'style   =', this.getElementsByClass('background-col').attr('style'),
			'\nclass   =', this.getElementsByClass('background-col').attr('class'),
			'\nz-index =', this.getElementsByClass('background-col').css('zIndex'))
	ranges.filter(function(a){
		return a >= this.scale;
	}.bind(this)).sort(function(a, b){
		return b-a;
	}).forEach(function(range, i) {
		var bgcolor = com.hiyoko.util.format('rgba(%s, 201, %s, 0.38)',
				(i % 2) ? 147 : 255,
				(i % 2) ? 255 : 147);
		var bdcolor = com.hiyoko.util.format('rgba(%s, 192, %s, 1)',
				(i % 2) ? 127 : 255,
				(i % 2) ? 255 : 127);
		drawRange(basePoint, range, bgcolor, bdcolor);
	}.bind(this));
	this.$base = $base;
};

com.hiyoko.sweet.MapOrganizer.Map.SRWRange.drawRange = function(basePoint, range, bgcolor, bdcolor) {
	var distance = Math.ceil(range/this.scale);
	var edge = {
		n: basePoint.top - distance,
		e: basePoint.left + distance,
		w: basePoint.left - distance,
		s: basePoint.top + distance	
	};
	var css = {
		'background-color': bgcolor,
		'border': '3px double ' + bdcolor
	};
	var height = 1;
	this.getElementById('background-col-box-' + edge.n + '-' + basePoint.left)
		.append(com.hiyoko.util.format('<div style="position:absolute;width:%spx" class="%s-range-text">' + range + '</div>', this.size - 6, this.id));
	for(var i = edge.w; i <= basePoint.left; i++) {
		for(var j = 0; j < height; j++) {
			this.getElementById('background-col-box-' + (basePoint.top - Math.ceil(height / 2) + 1 + j) + '-' + i).css(css);
		}
		height += 2;
	}
	height = 1;
	for(var i = edge.e; i > basePoint.left; i--) {
		for(var j = 0; j < height; j++) {
			 this.getElementById('background-col-box-' + (basePoint.top - Math.ceil(height / 2) + 1 + j) + '-' + i).css(css);
		}
		height += 2;
	}
};
