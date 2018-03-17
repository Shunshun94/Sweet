var com = com || {};
com.hiyoko = com.hiyoko || {};
com.hiyoko.sweet = com.hiyoko.sweet || {};

com.hiyoko.sweet.Discussion = function($html, opt_params){
	this.$html = $($html);
	this.LIST_NAME = 'SWEET Discussion - 相談';
	this.id = this.$html.attr('id');
	 
	this.memoId = '';
	

	this.buildComponents();
	this.bindEvents();		

};

com.hiyoko.util.extend(com.hiyoko.component.ApplicationBase, com.hiyoko.sweet.Discussion);

com.hiyoko.sweet.Discussion.prototype.buildComponents = function(){
	this.chatStreams = new com.hiyoko.DodontoF.V2.ChatClient(this.getElementById('chat'), {displayLimit: 256});
	this.memo = new com.hiyoko.sweet.Discussion.Memo(this.getElementById('memo'));
	this.vote = new com.hiyoko.sweet.Discussion.Vote(this.getElementById('vote'));
};



com.hiyoko.sweet.Discussion.prototype.bindEvents  = function($html){
	this.$html.on('copyChatLog', function(e){
		this.memo.add(e);
	}.bind(this));
};

com.hiyoko.sweet.Discussion.Memo = function($html) {
	this.$html = $($html);
	this.id = this.$html.attr('id');
	
	this.memoId = '';
	
	this.editor = this.getElementById('editor');
	this.clear = this.getElementById('clear');
	this.bindEvents();
};

com.hiyoko.util.extend(com.hiyoko.component.ApplicationBase, com.hiyoko.sweet.Discussion.Memo);

com.hiyoko.sweet.Discussion.Memo.prototype.add = function(msgObject) {
	this.editor.val(com.hiyoko.util.format('%s\n┌────────────────\n│%s\n├────────────────\n%s',
			this.editor.val(), msgObject.name, msgObject.text));
	this.update();
};

com.hiyoko.sweet.Discussion.Memo.prototype.bindEvents = function() {
	this.editor.change(this.update.bind(this));
	this.clear.click(function(e) {
		this.editor.val('');
		this.memoId = '';
	}.bind(this));
};

com.hiyoko.sweet.Discussion.Memo.prototype.update = function(e) {
	var id = this.memoId ? '' : com.hiyoko.util.rndString(8, '#');
	var text = this.memoId ? this.editor.val() : this.editor.val() + '\n\n' + id;
	
	var event = this.getAsyncEvent('tofRoomRequest', {
		method: 'updateMemo',
		args:[text, this.memoId]
	}).done(function(r){
		this.editor.notify('更新しました', 'success');
		if (this.memoId === '') {
			this.setMemoId(id);
		}
	}.bind(this)).fail(function(r){
		this.editor.notify('更新に失敗しました\n理由：' + r.result, 'warn');
	}.bind(this));
	
	this.fireEvent(event);
};

com.hiyoko.sweet.Discussion.Memo.prototype.setMemoId = function(suffix) {
	var event = this.getAsyncEvent('tofRoomRequest', {
		method: 'getCharacters'
	}).done(function(r){
		r.characters.forEach(function(memoCand) {
			if(memoCand.type === 'Memo' && memoCand.message.endsWith(suffix)) {
				this.memoId = memoCand.imgId;
			}
		}.bind(this));
	}.bind(this)).fail(function(r){
		this.editor.notify('メモの追加には成功しましたが、\n次の更新がうまくいかなそうです\n理由：' + r.result, 'warn');
	}.bind(this));

	this.fireEvent(event);
};

com.hiyoko.sweet.Discussion.Vote = function($html) {
	this.$html = $($html);
	this.id = this.$html.attr('id');

	this.list = this.getElementById('list');
	this.submit = this.getElementById('submit');

	this.bindEvents();
};

com.hiyoko.util.extend(com.hiyoko.component.ApplicationBase, com.hiyoko.sweet.Discussion.Vote);

com.hiyoko.sweet.Discussion.Vote.prototype.bindEvents = function() {
	this.submit.click(function(e){
		var voteTargets = this.list.val().split('\n');
		var message = [];
		var voteCount = 1;
		var sweetUrl = (document.location.protocol + '//' +
						document.location.host +
						document.location.pathname);
		var url = '';
		
		var urlSuffix = com.hiyoko.util.format('%s&vid=%s', location.search, com.hiyoko.util.rndString(18));
		
		if(sweetUrl.endsWith('index.html')) {
			url = sweetUrl.replace('index.html', 'vote.html' + urlSuffix);
		} else if (sweetUrl.endsWith('/')) {
			url = sweetUrl + 'vote.html' + urlSuffix;
		} else {
			url = sweetUrl + '/vote.html' + urlSuffix;
		}
	
		voteTargets.forEach(function(v) {
			var text = v.trim();
			if(text !== '') {
				message.push(com.hiyoko.util.format('案　%s %s\n%s', voteCount, text, url + '&selection=' + voteCount));
				voteCount++;
			} 
		});
		
		if(confirm('以下の条件で投票を開始します。よろしいですか?\n\n' + message.join('\n\n'))) {
			this.sendVoteChoice(message);
		}
		
	}.bind(this));
};

com.hiyoko.sweet.Discussion.Vote.prototype.sendVoteChoice = function(list) {
	if(list.length === 0) {
		this.submit.notify('投票を開始しました', 'success');
	} else {
		var event = this.getAsyncEvent('tofRoomRequest', {
			method: 'sendChat',
			args: [{
				name: 'SWEET',
				message: list.shift()
			}]
		}).done(function(r){
			this.sendVoteChoice(list);
		}.bind(this)).fail(function(r){
			this.submit.notify('投票の開始に失敗しました\n理由:' + r.result, 'warn');
		}.bind(this));

		this.fireEvent(event);	
	}
};



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

com.hiyoko.util.extend(com.hiyoko.component.ApplicationBase, com.hiyoko.sweet.Discussion.ChatStreams);

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
com.hiyoko.util.extend(com.hiyoko.component.ApplicationBase, com.hiyoko.sweet.Discussion.ChatStream);

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




