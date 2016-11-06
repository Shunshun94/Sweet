var com = com || {};
com.hiyoko = com.hiyoko || {};
com.hiyoko.sweet = com.hiyoko.sweet || {};

com.hiyoko.sweet.Discussion = function($html, opt_params){
	this.$html = $($html);
	this.LIST_NAME = 'SWEET Discussion';
	this.id = this.$html.attr('id');
	 
	this.memoId = '';
	

	this.buildComponents();
	this.bindEvents();		

};

com.hiyoko.util.extend(com.hiyoko.sweet.ApplicationBase, com.hiyoko.sweet.Discussion);

com.hiyoko.sweet.Discussion.prototype.buildComponents = function(){
	
	this.chatStreams = new com.hiyoko.sweet.Discussion.ChatStreams(this.getElementById('chat'));
	
};



com.hiyoko.sweet.Discussion.prototype.bindEvents  = function($html){
	
};

com.hiyoko.sweet.Discussion.ChatStreams = function($html) {
	this.$html = $($html);
	this.id = this.$html.attr('id');
	
	this.chatStreams = [];
	
	var event = this.getAsyncEvent('tofRoomRequest').done(function(r){
		r.chatTab.forEach(function(v, i) {
			this.chatStreams.push(new com.hiyoko.sweet.Discussion.ChatStream(this.$html, v, i)); 
		}.bind(this));
	}.bind(this)).fail(function(r){
		alert('Couldn\'t get DodontoF Room Info. Is URL correct?\n' + r.result);
	});
	event.method = 'getRoomInfo';
	this.fireEvent(event);
};

com.hiyoko.util.extend(com.hiyoko.sweet.ApplicationBase, com.hiyoko.sweet.Discussion.ChatStreams);


com.hiyoko.sweet.Discussion.ChatStream = function($html, title, number) {
	this.id = $html.attr('id') + '-' + number;
	$html.append(com.hiyoko.util.format('<div class="%s" id="%s"></div>',
			$html.attr('id') + '-stream', this.id));
	this.$html = $('#' + this.id);
	
	this.title = title;
	this.render();

};
com.hiyoko.util.extend(com.hiyoko.sweet.ApplicationBase, com.hiyoko.sweet.Discussion.ChatStream);

com.hiyoko.sweet.Discussion.ChatStream.prototype.render = function(){
	this.$html.append('<h2>' + this.title + '</h2>');
};






