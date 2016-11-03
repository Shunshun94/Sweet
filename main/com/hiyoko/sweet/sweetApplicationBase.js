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
