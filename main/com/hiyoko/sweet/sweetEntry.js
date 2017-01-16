var com = com || {};
com.hiyoko = com.hiyoko || {};
com.hiyoko.sweet = com.hiyoko.sweet || {};

com.hiyoko.sweet.Entry = function($html) {
	this.$html = $($html);
	this.LIST_NAME = 'SWEET Entry - 入室';
	this.id = this.$html.attr('id');
	
	this.bindEvents();
};
com.hiyoko.util.extend(com.hiyoko.sweet.ApplicationBase, com.hiyoko.sweet.Entry);

com.hiyoko.sweet.Entry.prototype.bindEvents = function() {
	this.getElementById('entry').click(function(e){
		document.location = document.location.protocol + '//' +
		document.location.host +
		document.location.pathname +
		"?url="   + this.getElementById('url').val() +
		"&room="  + this.getElementById('room').val()+
		"&pass="  + this.getElementById('pass').val()
	}.bind(this));
};
