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
	
	this.bindEvents();
};

com.hiyoko.util.extend(com.hiyoko.sweet.UlList, com.hiyoko.sweet.Battle.CounterRemoCon.List);

com.hiyoko.sweet.Battle.CounterRemoCon.List.prototype.renderDefaultLi = function($li, item) {
	if(item.type !== 'node') {
		var $check = $('<input type="checkbox" value="' + item.value + '" />');
		$check.attr('class', this.id + '-check');
		$li.append($check);
		
		var $name = $('<span></span>');
		$name.text(item.text);
		$name.attr('class', this.id + '-name');
		$li.append($name)
	}
	return $li;
};

com.hiyoko.sweet.Battle.CounterRemoCon.List.prototype.bindEvents = function() {
	this.$html.change(function(e){
		if($(e.target).is('input')){
			this.onCheck(e);
		}
	}.bind(this));
};

com.hiyoko.sweet.Battle.CounterRemoCon.List.prototype.onCheck = function(event) {
	var $target = $(event.target);
	$target.parent().find('input').prop('checked', $target.is(':checked'));
	
	if(! $target.is(':checked')) {
		$($target.parent().parent().parent().find('input')[0]).prop('checked', $target.is(':checked'));
	}
};
