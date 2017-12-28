var com = com || {};
com.hiyoko = com.hiyoko || {};
com.hiyoko.sweet = com.hiyoko.sweet || {};
com.hiyoko.sweet.PcManager = function($html) {
	this.$html = $html;
	this.id = $html.attr('id');
	this.manager = new io.github.shunshun94.trpg.CharacterManager(this.$html);

	this.bindEvents();
	this.buildComponent();

};

com.hiyoko.util.extend(com.hiyoko.component.ApplicationBase, com.hiyoko.sweet.PcManager);
com.hiyoko.sweet.PcManager.SheetIdListKey = 'com-hiyoko-sw2-player-entrance-option-sheetId-list';

com.hiyoko.sweet.PcManager.prototype.buildComponent = function() {
	this.prepare = new com.hiyoko.sweet.PcManager.Prepare(this.getElementById('prepare'));
};

com.hiyoko.sweet.PcManager.prototype.bindEvents = function() {
	this.$html.on(com.hiyoko.sweet.PcManager.Prepare.EVENTS.GET, function(e) {
		e.resolve(this.loadSheetIdList());
	}.bind(this));
	this.$html.on(com.hiyoko.sweet.PcManager.Prepare.EVENTS.PUT, function(e) {
		e.resolve(this.saveSheetIdList(e.id, e.name));
	}.bind(this));
};

com.hiyoko.sweet.PcManager.prototype.loadSheetIdList = function() {
	return JSON.parse(localStorage.getItem(com.hiyoko.sweet.PcManager.SheetIdListKey)) || {};
};

com.hiyoko.sweet.PcManager.prototype.saveSheetIdList = function(id, name) {
	var data = this.loadSheetIdList();
	data[id] = name;
	localStorage.setItem(com.hiyoko.sweet.PcManager.SheetIdListKey, JSON.stringify(data));
	return data;
};

com.hiyoko.sweet.PcManager.Prepare = function($html) {
	this.$html = $html;
	this.id = $html.attr('id');
	
	this.buildComponents();
	
	this.$html.on('change', function(e) {
		var $target = $(e.target);
		var text = $target.val();
		
		// もう少し効率的な書き方ができると思うけど疲れている時に書いたので後で考える
		if($target.hasClass(this.id + '-id-last')) {
			if(text.length > 0) {
				$target.css(
						'background-color',
						io.github.shunshun94.util.Color.HslToRgb((Number(text) % 360), 100, 80).code);
				this.appendNewInputBox();
			}
			return;
		}
		if($target.hasClass(this.id + '-id')) {
			if(text.length === 0) {
				$target.remove();				
			} else {
				$target.css(
						'background-color',
						io.github.shunshun94.util.Color.HslToRgb((Number(text) % 360), 100, 80).code);	
			}			
		}
	}.bind(this));
};
com.hiyoko.util.extend(com.hiyoko.component.ApplicationBase, com.hiyoko.sweet.PcManager.Prepare);
com.hiyoko.sweet.PcManager.Prepare.prototype.getInputBox = function() {
	return com.hiyoko.util.format('<input autocomplete="on" class="%s-id %s-id-last" list="%s-characterList" type="text" />',
			this.id, this.id, this.id);
};

com.hiyoko.sweet.PcManager.Prepare.prototype.appendNewInputBox = function() {
	this.getElementsByClass('id-last').removeClass(this.id + '-id-last');
	this.getElementById('characterList').before(this.getInputBox());
};

com.hiyoko.sweet.PcManager.Prepare.prototype.buildComponents = function() {
	var dataListBuildEvent = this.getAsyncEvent(com.hiyoko.sweet.PcManager.Prepare.EVENTS.GET).done(function(list) {
		var $list = this.getElementById('characterList');
		com.hiyoko.util.forEachMap(list, function(v, k) {
			$list.append(com.hiyoko.util.format('<option value="%s">%s</option>', k, v));
		});
		this.appendNewInputBox();
	}.bind(this));
	this.fireEvent(dataListBuildEvent);
};

com.hiyoko.sweet.PcManager.Prepare.EVENTS = {
	GET: 'com-hiyoko-sweet-PcManager-Prepare-EVENTS-GET',
	PUT: 'com-hiyoko-sweet-PcManager-Prepare-EVENTS-PUT'
};

com.hiyoko.sweet.PcManager.Manager = function($html) {
	this.$html = $html;
	this.id = $html.attr('id');
	


};
