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
	this.memo = new com.hiyoko.sweet.Discussion.Memo(this.getElementById('memo'));
};



com.hiyoko.sweet.Discussion.prototype.bindEvents  = function($html){
	this.$html.on('copyChatLog', function(e){
		console.log(e);
	});
};

com.hiyoko.sweet.Discussion.Memo = function($html) {
	this.$html = $($html);
	this.id = this.$html.attr('id');
};

com.hiyoko.sweet.Discussion.Memo.prototype.add = function(text) {
	
}


com.hiyoko.sweet.Discussion.ChatStreams = function($html) {
	this.$html = $($html);
	this.id = this.$html.attr('id');
	this.chatLastUpdate = 0;
	
	this.chatStreams = [];
	
	var event = this.getAsyncEvent('tofRoomRequest').done(function(r){
		r.chatTab.forEach(function(v, i) {
			this.chatStreams.push(new com.hiyoko.sweet.Discussion.ChatStream(this.$html, v, i)); 
		}.bind(this));
		
		this.bindEvents();
	}.bind(this)).fail(function(r){
		alert('Couldn\'t get DodontoF Room Info. Is URL correct?\n' + r.result);
	});
	event.method = 'getRoomInfo';
	this.fireEvent(event);
};

com.hiyoko.util.extend(com.hiyoko.sweet.ApplicationBase, com.hiyoko.sweet.Discussion.ChatStreams);

com.hiyoko.sweet.Discussion.ChatStreams.prototype.bindEvents = function(){
	var self = this;
	window.setInterval(self.updateChat.bind(self), 5000);
};

com.hiyoko.sweet.Discussion.ChatStreams.prototype.updateChat = function(){
	var self = this;
	var event = self.getAsyncEvent('tofRoomRequest').done(function(r){
		var mapedByTab = com.hiyoko.util.groupArray(r.chatMessageDataLog.map(function(v){
			try{
				return com.hiyoko.DodontoF.V2.fixChatMsg(v);
			} catch(e){
				console.warn(e, v);
				return {tab: -1};
			}
			
		}), function(msg) {
			self.chatLastUpdate = msg.time;
			return msg.tab;
		});
		self.chatStreams.forEach(function(v,i){
			v.updateChat(mapedByTab[i]);
		});
	}.bind(this)).fail(function(r){
		alert('Failed to get data\nReason: ' + r.result);
	});
	event.method = 'getChat';
	event.args = [this.chatLastUpdate];
	this.fireEvent(event);
};

com.hiyoko.sweet.Discussion.ChatStream = function($html, title, number) {
	this.id = $html.attr('id') + '-' + number;
	this.clazz = $html.attr('id') + '-stream';
	
	$html.append(com.hiyoko.util.format('<div class="%s" id="%s"></div>',
			this.clazz, this.id));
	this.$html = $('#' + this.id);
	
	this.title = title;
	this.number = number;
	this.render();
	
	this.$messages = this.getElement('.' + this.clazz + '-messages');
	
	this.bindEvents();
};
com.hiyoko.util.extend(com.hiyoko.sweet.ApplicationBase, com.hiyoko.sweet.Discussion.ChatStream);

com.hiyoko.sweet.Discussion.ChatStream.prototype.render = function(){
	this.$html.css(com.hiyoko.sweet.Discussion.ChatStream.COLOR[this.number % 6]);
	this.$html.append('<h2>' + this.title + '</h2>');
	this.$html.append(com.hiyoko.util.format('<div class="%s"></div>',
			this.clazz + '-messages'));
};

com.hiyoko.sweet.Discussion.ChatStream.prototype.bindEvents = function() {
	this.$messages.click(function(e) {
		var $msg = $(e.target).parent();
		var event = {
				type: 'copyChatLog',
				name: $msg.find('.' + this.clazz + '-messages-message-name').text(),
				text: $msg.find('.' + this.clazz + '-messages-message-text').text()
		};
		this.fireEvent(event);
	}.bind(this));
};


com.hiyoko.sweet.Discussion.ChatStream.prototype.updateChat = function(msgs){
	if(! msgs) {
		return;
	}
	
	var base = $('<div></div>');
	msgs.forEach(function(v){
		var msg = $('<div></div>');
		msg.addClass(this.clazz + '-messages-message');
		msg.css({'color': '#' + v.color});
		
		var name = $('<div></div>');
		name.addClass(this.clazz + '-messages-message-name');
		name.text(v.name);
		
		var text = $('<p></p>');
		text.addClass(this.clazz + '-messages-message-text');
		text.text(v.msg);
		
		var copy = $('<button>⇒</button>');
		copy.addClass(this.clazz + '-messages-message-button');
		copy.addClass(this.clazz + '-messages-message-copy');
		
		msg.append(name);
		msg.append(text);
		msg.append(copy);
		base.append(msg);
	}.bind(this));
	this.$messages.append(base);
};

com.hiyoko.sweet.Discussion.ChatStream.COLOR = [
{'border-color': '#FF0000', 'background-color': '#FFF0 F0'},
{'border-color': '#00FF00', 'background-color': '#F0FFF0'},
{'border-color': '#0000FF', 'background-color': '#F0F0FF'},
{'border-color': '#FFFF00', 'background-color': '#FFFFF0'},
{'border-color': '#00FFFF', 'background-color': '#F0FFFF'},
{'border-color': '#FF00FF', 'background-color': '#FFF0FF'}
];




