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
	this.memo = new com.hiyoko.sweet.Discussion.Memo(this.getElementById('memo'));
	this.vote = new com.hiyoko.sweet.Discussion.Vote(this.getElementById('vote'));
	var event = this.getAsyncEvent('tofRoomRequest').done((r) => {
		this.chatStreams = new com.hiyoko.DodontoF.V2.ChatClient(this.getElementById('chat'), {
			displayLimit: 256,
			input: com.hiyoko.sweet.Discussion.ChatInputDummy,
			display: com.hiyoko.sweet.Discussion.ChatDisplay,
			tabs: r.chatTab
		});
	}).fail(function(r){
		alert('Couldn\'t get DodontoF Room Info. Is URL correct?\n' + r.result);
	});
	event.method = 'getRoomInfo';
	this.fireEvent(event);
};

com.hiyoko.sweet.Discussion.prototype.bindEvents = function($html){

	this.$html.on(com.hiyoko.sweet.Discussion.COPY_CHAT_LOG_EVENT, (e) => {
		tempFix.push(e.msgId);
		this.memo.add(e);
	});
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

com.hiyoko.sweet.Discussion.Memo.prototype.add = function(msgObject)  {
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

com.hiyoko.sweet.Discussion.ChatInputDummy = function($html) {};

com.hiyoko.sweet.Discussion.ChatDisplay = class extends com.hiyoko.DodontoF.V2.ChatClient.SimpleDisplay {
	constructor($dom, opts = {}) {
		super($dom, opts);
		this.$html.click((e) => {
			const clicked = $(e.target);
			if(clicked.hasClass(`${this.id}-log-append`)) {
				const $msg = clicked.parent();
				this.fireEvent(new $.Event(com.hiyoko.sweet.Discussion.COPY_CHAT_LOG_EVENT, {
					name: $msg.find(`.${this.id}-log-name`).text(),
					text: $msg.find(`.${this.id}-log-message`).text()
				}));
			}
		});
	}
	
	updateLogs(logs) {
		this.$html.append(logs.map((log) => {
			const tab = log.tab || 0;
			var $log = $(com.hiyoko.util.format('<p style="color:#%s" class="%s-log %s-log"></p>',
					log.color, this.id, com.hiyoko.DodontoF.V2.ChatClient.SimpleDisplay.CLASS));
			var $name = $(com.hiyoko.util.format('<span class="%s-log-name %s-log-name"></span>',
					this.id, com.hiyoko.DodontoF.V2.ChatClient.SimpleDisplay.CLASS));
			$name.text(`${log.name} @ ${this.options.tabs[tab]}`);
			var $msg = $(com.hiyoko.util.format('<span class="%s-log-message %s-log-message"></span>',
					this.id, com.hiyoko.DodontoF.V2.ChatClient.SimpleDisplay.CLASS));
			var $appendButton = $(`<span class="${this.id}-log-append ` +
					`${com.hiyoko.DodontoF.V2.ChatClient.SimpleDisplay.CLASS}-log-append">メモに追加する</span>`);
			$msg.textWithLF(log.msg);
			$log.append($name);
			$log.append($msg);
			$log.append($appendButton);
			$log.css('background-color', com.hiyoko.sweet.Discussion.COLOR[tab % com.hiyoko.sweet.Discussion.COLOR.length]['background-color']);
			return $log;
		}));
		
		if(this.limit) {
			var count = this.getElementsByClass(com.hiyoko.DodontoF.V2.ChatClient.SimpleDisplay.CLASS + '-log').length;
			this.getElementsByClass('log:lt(' + (count - this.limit) + ')').remove();
		}
	}
};

com.hiyoko.sweet.Discussion.COPY_CHAT_LOG_EVENT  = 'com-hiyoko-sweet-Discussion-COPY_CHAT_LOG_EVENT';

com.hiyoko.sweet.Discussion.COLOR = [
{'border-color': '#FF0000', 'background-color': '#FFF0F0'},
{'border-color': '#00FF00', 'background-color': '#F0FFF0'},
{'border-color': '#0000FF', 'background-color': '#F0F0FF'},
{'border-color': '#FFFF00', 'background-color': '#FFFFF0'},
{'border-color': '#00FFFF', 'background-color': '#F0FFFF'},
{'border-color': '#FF00FF', 'background-color': '#FFF0FF'}
];




