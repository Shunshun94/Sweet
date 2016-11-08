var com = com || {};
com.hiyoko = com.hiyoko || {};
com.hiyoko.sweet = com.hiyoko.sweet || {};
com.hiyoko.sweet.ApplicationBase = function(){};

com.hiyoko.sweet.ApplicationBase.prototype.getElement = function(query){
	return this.$html.find(query);
};

com.hiyoko.sweet.ApplicationBase.prototype.getElementById = function(idName){
	return this.getElement('#' + this.id + '-' + idName);
};

com.hiyoko.sweet.ApplicationBase.prototype.getElementsByClass = function(className){
	return this.getElement('.' + this.id + '-' + className);
};

com.hiyoko.sweet.ApplicationBase.prototype.setEnable = function(isEnable) {
	if(isEnable) {
		this.$html.show();
	} else {
		this.$html.hide();
	}
};

com.hiyoko.sweet.ApplicationBase.prototype.enable = function() {
	this.setEnable(true);
};

com.hiyoko.sweet.ApplicationBase.prototype.disable = function() {
	this.setEnable(false);
};

com.hiyoko.sweet.ApplicationBase.prototype.isEnabled = function() {
	return this.$html.attr('display') !== 'none';
};

com.hiyoko.sweet.ApplicationBase.prototype.fireEvent = function(event) {
	this.$html.trigger(event);
};

com.hiyoko.sweet.ApplicationBase.prototype.setStorage = function(id, value) {
	this.$html.trigger({type: 'setStorage', id: this.id + '-' + id, value: value});
};

com.hiyoko.sweet.ApplicationBase.prototype.getStorage = function(id, opt_callback) {
	var event = new $.Event('getStorage', {key: this.id + '-' + id,
		callback: opt_callback || console.log });
	this.$html.trigger(event);
};

com.hiyoko.sweet.ApplicationBase.prototype.getAsyncEvent = function(eventType, opt_eventProperties){
	return new com.hiyoko.sweet.ApplicationBase.AsyncEvent(eventType, opt_eventProperties);
};

com.hiyoko.sweet.ApplicationBase.AsyncEvent = function(eventType, opt_eventProperties){
	this.type = eventType;
	
	this.resolve = function(result){
		alert(result.result);
		console.log(result);
	};
	this.reject = function(result){
		alert(result.result);
		console.warn(result);
	};
	
	for(var key in opt_eventProperties){
		this[key] = opt_eventProperties[key];
	}
};

com.hiyoko.sweet.ApplicationBase.AsyncEvent.prototype.done = function(func) {
	this.resolve = func;
	return this;
};

com.hiyoko.sweet.ApplicationBase.AsyncEvent.prototype.fail = function(func) {
	this.reject = func;
	return this;
};

com.hiyoko.sweet.TableBase = function(){};

com.hiyoko.util.extend(com.hiyoko.sweet.ApplicationBase, com.hiyoko.sweet.TableBase);

com.hiyoko.sweet.TableBase.prototype.renderTable = function(cols){
	var headerClass = this.id + '-header';
	var totalClass = this.id + '-total';
	this.memberClass = this.id + '-member';
	this.cols = cols;
	
	var $header = $('<tr></tr>')
	$header.addClass(headerClass);
	
	this.cols.forEach(function(col, i){
		var $col = $('<th></th>');
		$col.addClass(this.headerClass + '-' + i);
		$col.text(col.title);
		$header.append($col);
	}.bind(this));
	
	this.$html.append($header);
	
	var $util = $(com.hiyoko.util.format('<tr colspan="%s"></tr>', this.cols.length));
	$util.append(com.hiyoko.util.format(
			'<button style="display:inline-block" id="%s">ADD</button>' +
			'<button style="display:inline-block" id="%s">REMOVE</button>',
			this.id + '-add',
			this.id + '-remove'));
	$util.addClass(this.id + '-util');
	
	this.$html.append($util);
	
	this.addMember();
	
	this.bindSharedEvent();
};

com.hiyoko.sweet.TableBase.prototype.addMember = function() {
	var $member = $('<tr></tr>')
	$member.addClass(this.memberClass);
	
	this.cols.forEach(function(col, i){
		var $col = $('<td></td>');
		$col.addClass(this.memberClass + '-' + i);
		
		if(col.type === 'text') {
			$col.attr('contenteditable', true);
		} else if (col.type === 'number') {
			$col.append('<input value="0" type="number" class="com-hiyoko-sweet-table-base-member-number" />');
		} else if (col.type === 'check') {
			
		} else if (col.type === 'auto') {
			$col.css('background-color', '#E0E0E0');
		}
		
		$member.append($col);
	}.bind(this));
	this.getElementsByClass('util').before($member);
};

com.hiyoko.sweet.TableBase.prototype.bindSharedEvent = function() {
	this.getElementById('add').click(this.addMember.bind(this));
	this.getElementById('remove').click(function(e) {
		this.getElementsByClass('member:last').remove();
	}.bind(this));
	
	console.log(this.getElementById('add'));
};


