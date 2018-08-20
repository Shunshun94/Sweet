var com = com || {};
com.hiyoko = com.hiyoko || {};
com.hiyoko.sweet = com.hiyoko.sweet || {};

com.hiyoko.sweet.Links = function($html, character) {
	this.$html = $html;
	this.id = this.$html.attr('id');
	this.character = character
	this.options = com.hiyoko.util.getQueries();
	this.LIST_NAME = 'リンク集';
	this.buildComponents();
	this.bindEvents();
};

com.hiyoko.util.extend(com.hiyoko.component.ApplicationBase, com.hiyoko.sweet.Links);

com.hiyoko.sweet.Links.prototype.buildComponents = function() {
	var $links = $('<ul></ul>');
	
	var queries = [];
	com.hiyoko.util.forEachMap(this.options, function(v, k) {
		queries.push(k + '=' + v);
	});
	
	$links.append(com.hiyoko.util.format('<li><a href="http://sy17.sakura.ne.jp/shunshun/hiyontof.html?%s&name=%s">ひよんとふ</a> (どどんとふ使用時のみ有効)',
			queries.join('&'), this.character.name
	));
	$links.append(com.hiyoko.util.format('<li><a href="http://charasheet.vampire-blood.net/%s">キャラクターシート</a></li>', this.character.id));
	
	var $map = $('<li></li>');

	$map.append(com.hiyoko.util.format('<a id="%s-map-exec">マップ</a> (どどんとふ使用時のみ有効)<br/>', this.id));
	$map.append(com.hiyoko.util.format('どどんとふ1マス辺りの距離<input value="1" id="%s-map-scale" type="number" />m<br/>', this.id));
	$map.append(com.hiyoko.util.format('表示したい射程距離 (カンマ区切り)<input value="3,5,10,20,30,50" id="%s-map-distance" type="text" />m<br/>', this.id));
	$map.append(com.hiyoko.util.format('表示方法<select id="%s-map-range"><option value="circle">同心円</option><option value="srw">スーパーロ〇ット〇戦風</option></select>', this.id));
	$links.append($map);

	this.$html.append($links);
};

com.hiyoko.sweet.Links.prototype.bindEvents = function() {
	this.getElementById('map-exec').click(function(e){
		var url = './map.html?';
		url += '&url=' + this.options.url;
		url += '&room=' + this.options.room;
		url += '&scale=' + this.getElementById('map-scale').val();
		url += '&distances=' + this.getElementById('map-distance').val();
		url += '&range=' + this.getElementById('map-range').val();
		if(this.options.pass) {
			url += '&pass=' + this.options.pass;
		}
		window.open(url, 'map');
		//document.location = url;
	}.bind(this));
};

