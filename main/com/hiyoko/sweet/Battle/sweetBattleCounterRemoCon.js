// https://syncer.jp/jquery-modal-window

var com = com || {};
com.hiyoko = com.hiyoko || {};
com.hiyoko.sweet = com.hiyoko.sweet || {};
com.hiyoko.sweet.Battle = com.hiyoko.sweet.Battle || {};

com.hiyoko.sweet.Battle.CounterRemoCon = function($html, opt_params) {
	this.$html = $($html);
	this.id = this.$html.attr('id');
	
	this.body = this.getElementById('body');
	this.overlay = this.getElementById('overlay');
	
	this.buildComponents();
	this.bindEvents();
};

com.hiyoko.util.extend(com.hiyoko.sweet.ApplicationBase, com.hiyoko.sweet.Battle.CounterRemoCon);

com.hiyoko.sweet.Battle.CounterRemoCon.prototype.buildComponents = function() {
	this.list = new com.hiyoko.sweet.Battle.CounterRemoCon.List(this.getElementById('list'));
};

com.hiyoko.sweet.Battle.CounterRemoCon.prototype.injectList = function(list) {
	this.list.buildList(list)
};

com.hiyoko.sweet.Battle.CounterRemoCon.prototype.bindEvents = function() {
	this.getElementById('open').click(function(e){
		this.fireEvent({
			type: 'CounterRemoConInitializeRequest'
		});
		this.body.show();
		this.overlay.show();
	}.bind(this));
	
	this.overlay.click(function(e){
		this.body.hide();
		this.overlay.hide();
	}.bind(this));
};

com.hiyoko.sweet.Battle.CounterRemoCon.List = function($html, opt_params) {
	this.$html = $($html);
	this.id = this.$html.attr('id');
	
};

com.hiyoko.util.extend(com.hiyoko.sweet.UlCheckBox, com.hiyoko.sweet.Battle.CounterRemoCon.List);

com.hiyoko.sweet.Battle.CounterRemoCon.List.prototype.renderDefaultLi = function($li, item) {
	if(item.type !== 'node') {
		var $check = $('<input type="checkbox" value="' + item.value + '" />');
		$check.attr('class', this.id + '-check');
		$li.append($check);
		
		var $name = $('<span></span>');
		$name.text(item.text);
		$li.append($name)
	}
	return $li;
}
