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
	this.inputer = new com.hiyoko.sweet.Battle.CounterRemoCon.Inputer(this.getElementById('inputer'));
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
		/*
		this.fireEvent({
			type: 'CounterRemoConChangeHP',
			characters: this.list.getValue()
		});
		*/
	}.bind(this));
	
	this.$html.on('CounterRemoConUpdated', function(e) {
		this.inputer.buildCharacterList(e.characters);
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
		$check.addClass(this.id + '-check');
		$li.append($check);
		
		var $name = $('<span></span>');
		$name.text(item.text);
		$name.addClass(this.id + '-name');
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
	
	if((! $target.is(':checked')) && $target.parent().hasClass('com-hiyoko-sweet-ul-list-li-child')) {
		$($target.parent().parent().parent().find('input')[0]).prop('checked', $target.is(':checked'));
	}
	
	this.fireEvent({
		type: 'CounterRemoConUpdated',
		characters: this.getValue()
	});
};

com.hiyoko.sweet.Battle.CounterRemoCon.List.prototype.getValueLi = function($li) {
	var result = {};
	
	var text = $li.children('.' + this.id + '-name').text();
	result.text = text;
	
	var $ul = $li.children('ul');
	if($ul.length) {
		result.list = this.getValue($ul);
	}
	
	result.check = $li.children('.' + this.id + '-check').is(':checked');
	result.value = $li.children('.' + this.id + '-check').val();
	
	if(result.text && result.list) {
		result.type = 'namednode';
	} else if(result.list) {
		result.type = 'node';
	} else {
		result.type = 'leaf';
	}
	
	return result;
};

com.hiyoko.sweet.Battle.CounterRemoCon.Inputer = function($html) {
	this.$html = $($html);
	this.id = this.$html.attr('id');
	
	this.members = this.getElementById('members');
	
	this.bindEvents();	
};

com.hiyoko.util.extend(com.hiyoko.sweet.ApplicationBase, com.hiyoko.sweet.Battle.CounterRemoCon.Inputer);

com.hiyoko.sweet.Battle.CounterRemoCon.Inputer.prototype.bindEvents = function(){
	this.getElementsByClass('tabs-tab').click(function(e){
		this.getElementsByClass('active').removeClass(this.id + '-active');
		$(e.target).addClass(this.id + '-active');
	}.bind(this));
};

com.hiyoko.sweet.Battle.CounterRemoCon.Inputer.prototype.buildCharacterList = function(list) {
	this.members.empty();
	list.forEach(function(character) {
		if(character.type === 'leaf' && character.check) {
			this.members.append(com.hiyoko.util.format(
					'<li>+ <input class="%s" id="%s" value="0" /><span class="%s">%s</span></li>',
					this.id + '-fix', character.value + '_0', this.id + '-name', character.text
			));
		} else if(character.type !== 'leaf') {
			character.list.forEach(function(parts){
				if(parts.check) {
					this.members.append(com.hiyoko.util.format(
							'<li>+ <input class="%s" id="%s" value="0" /><span class="%s">%s</span></li>',
							this.id + '-fix', character.value + '_' + parts.value,
							this.id + '-name', character.text + ' ' + parts.text
					));
				}
			}.bind(this));
		}
	}.bind(this));
};








