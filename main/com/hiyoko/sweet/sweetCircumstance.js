var com = com || {};
com.hiyoko = com.hiyoko || {};
com.hiyoko.sweet = com.hiyoko.sweet || {};

com.hiyoko.sweet.Circumstance = function($html) {
	this.$html = $($html);
	this.LIST_NAME = 'SWEET Circumstance - 演出';
	this.id = this.$html.attr('id');
	
	this.buildComponents();
};
com.hiyoko.util.extend(com.hiyoko.sweet.ApplicationBase, com.hiyoko.sweet.Circumstance);

com.hiyoko.sweet.Circumstance.prototype.buildComponents = function() {
	this.music = new com.hiyoko.sweet.Circumstance.Music(this.getElementById('music'));
	//this.background = new com.hiyoko.sweet.Circumstance.BackGround(this.getElementById('background'));
	//this.cutin = new com.hiyoko.sweet.Circumstance.CutIn(this.getElementById('cutin'));
};

com.hiyoko.sweet.Circumstance.CommandBase = function(){};
com.hiyoko.util.extend(com.hiyoko.sweet.ApplicationBase, com.hiyoko.sweet.Circumstance.CommandBase);

com.hiyoko.sweet.Circumstance.CommandBase.prototype.render = function(){
	var $selector = $('<select></select>');
	$selector.attr('id', this.id + '-selector');
	
	var $send  = $('<button>適用</button>');
	$send.attr('id', this.id + '-send');
	
	var $edit = $('<button>編集/利用切替</button>');
	$edit.attr('id', this.id + '-edit');
	
	var $editor = $('<table border="1"></table>');
	$editor.attr('id', this.id + '-editor'); 
	$editor.append('<tr><th>コマンド名</th><th>URL</th><th>自分用メモ</th><th></th></tr>');
	
	this.$html.append($selector);
	this.$html.append($send);
	this.$html.append($editor);
	this.$html.append($edit);
};

com.hiyoko.sweet.Circumstance.CommandBase.prototype.toggle = function(){
	this.getElementById('selector').toggle(150);
	this.getElementById('editor').toggle(150);
	this.getElementById('send').toggle(150);
	
	this.updateSelect();
	this.saveTable();
};

com.hiyoko.sweet.Circumstance.CommandBase.prototype.initialize = function(){
	var self = this;
	this.getStorage('data', function(datalist){
		if(datalist === null) {
			datalist = self.defaultData;
		}
		self.renderTable(datalist);
		self.updateSelect();
	});
};

com.hiyoko.sweet.Circumstance.CommandBase.prototype.renderTable = function(datalist) {
	var table = this.getElementById('editor');
	var self = this;
	datalist.forEach(function(data) {
		table.append(com.hiyoko.util.format(
						'<tr class="%s"><td contenteditable="">%s</td>' +
						'<td contenteditable="">%s</td>' +
						'<td contenteditable="">%s</td>' +
						'<td><button class="%s">×</button></td></tr>',
						self.id + '-list',
						data.command, data.url, data.memo,
						self.id + '-list-delete'));
	});
	table.append(com.hiyoko.util.format(
			'<tr><td colspan="4"><button id="%s">ADD</button></td></tr>',
			self.id + '-add'));
};

com.hiyoko.sweet.Circumstance.CommandBase.prototype.sendCommand = function(e) {
	alert('This method must be implemetend in each Classes.');
};

com.hiyoko.sweet.Circumstance.CommandBase.prototype.updateSelect = function(){
	var selector = this.getElementById('selector');
	
	selector.empty();
	
	$.each(this.getElementsByClass('list'), function(i, v){
		var trdata = $(v).children();
		selector.append(com.hiyoko.util.format(
				'<option value="%s">%s</option>',
				i, $(trdata[0]).text() + '\n' + $(trdata[2]).text()
		));
	});
};

com.hiyoko.sweet.Circumstance.CommandBase.prototype.getData = function() {
	var data = [];
	$.each(this.getElementsByClass('list'), function(i, v){
		var trdata = $(v).children();
		data.push({
			command: $(trdata[0]).text(),
			url: $(trdata[1]).text(),
			memo: $(trdata[2]).text()
		});
	});
	
	return data;
};

com.hiyoko.sweet.Circumstance.CommandBase.prototype.saveTable = function() {
	var data = [];	
	this.setStorage('data', this.getData());
};

com.hiyoko.sweet.Circumstance.CommandBase.prototype.bindEvents = function() {
	this.getElementById('edit').click(function(e){
		this.toggle();
	}.bind(this));
	
	this.getElementById('send').click(function(e){
		this.sendCommand(e);
	}.bind(this));
	
	this.getElementById('add').click(function(e){
		this.getElementsByClass('list:last').after(com.hiyoko.util.format(
				'<tr class="%s"><td contenteditable=""></td>' +
				'<td contenteditable=""></td>' +
				'<td contenteditable=""></td>' +
				'<td><button class="%s">×</button></td></tr>',
				this.id + '-list', this.id + '-list-delete'));
	}.bind(this));
	
	this.getElementById('editor').click(function(e) {
		var clicked = $(e.target);
		if(clicked.hasClass(this.id + '-list-delete')) {
			clicked.parent().parent().remove();
		}
	}.bind(this));
};

com.hiyoko.sweet.Circumstance.Music = function($html) {
	this.$html = $($html);
	this.id = this.$html.attr('id');
	
	this.defaultData = [{
		command: 'BGM:停止',
		url: '',
		memo: '再生中の BGM を停止させます'
	},{
		command: 'BGM:休憩1',
		url: 'https://www.dropbox.com/s/ozdbu91awrwzmoz/rest01.mp3?dl=1',
		memo: '音楽：魔王魂 http://maoudamashii.jokersounds.com/'
	},{
		command: 'BGM:休憩2',
		url: 'https://www.dropbox.com/s/vgfa9s1f7vmy8uy/rest02.mp3?dl=1',
		memo: '音楽：魔王魂 http://maoudamashii.jokersounds.com/'
	},{
		command: 'BGM:休憩3',
		url: 'https://www.dropbox.com/s/jwvc0ndx37od1zy/rest03.mp3?dl=1',
		memo: '音楽：魔王魂 http://maoudamashii.jokersounds.com/'
	},{
		command: 'BGM:緊張1',
		url: 'https://www.dropbox.com/s/3b3dvjdzrfouryz/tention01.mp3?dl=1',
		memo: '音楽：魔王魂 http://maoudamashii.jokersounds.com/'
	},{
		command: 'BGM:緊張2',
		url: 'https://www.dropbox.com/s/6qbg6honyijmauu/tention02.mp3?dl=1',
		memo: '音楽：魔王魂 http://maoudamashii.jokersounds.com/'
	},{
		command: 'BGM:緊張3',
		url: 'https://www.dropbox.com/s/5simtmgszfy3323/tention03.mp3?dl=1',
		memo: '音楽：魔王魂 http://maoudamashii.jokersounds.com/'
	},{
		command: 'BGM:緊張4',
		url: 'https://www.dropbox.com/s/n8f650ygv2t9r2d/tention04.mp3?dl=1',
		memo: '音楽：魔王魂 http://maoudamashii.jokersounds.com/'
	},{
		command: 'BGM:探索1',
		url: 'https://www.dropbox.com/s/lxx1eqa1inus8bk/dungeon01.mp3?dl=1',
		memo: '音楽：魔王魂 http://maoudamashii.jokersounds.com/'
	},{
		command: 'BGM:探索2',
		url: 'https://www.dropbox.com/s/p3wyz91jut12uzb/dungeon02.mp3?dl=1',
		memo: '音楽：魔王魂 http://maoudamashii.jokersounds.com/'
	},{
		command: 'BGM:探索3',
		url: 'https://www.dropbox.com/s/j50akn5v2nuc6ma/dungeon03.mp3?dl=1',
		memo: '音楽：魔王魂 http://maoudamashii.jokersounds.com/'
	},{
		command: 'BGM:探索4',
		url: 'https://www.dropbox.com/s/g6vdajr2is3ez0o/dungeon04.mp3?dl=1',
		memo: '音楽：魔王魂 http://maoudamashii.jokersounds.com/'
	},{
		command: 'BGM:戦闘1',
		url: 'https://www.dropbox.com/s/s2wozgdobwlmfbb/battle01.mp3?dl=1',
		memo: '音楽：魔王魂 http://maoudamashii.jokersounds.com/'
	},{
		command: 'BGM:戦闘2',
		url: 'https://www.dropbox.com/s/3m8btkowvrebnhl/battle02.mp3?dl=1',
		memo: '音楽：魔王魂 http://maoudamashii.jokersounds.com/'
	},{
		command: 'BGM:戦闘3',
		url: 'https://www.dropbox.com/s/1ijg5u5sbb35g4s/battle03.mp3?dl=1',
		memo: '音楽：魔王魂 http://maoudamashii.jokersounds.com/'
	},{
		command: 'BGM:戦闘4',
		url: 'https://www.dropbox.com/s/ebsk9d10iguejup/battle04.mp3?dl=1',
		memo: '音楽：魔王魂 http://maoudamashii.jokersounds.com/'
	}];
	
	this.render();
	this.initialize();
	
	this.bindEvents();
};
com.hiyoko.util.extend(com.hiyoko.sweet.Circumstance.CommandBase, com.hiyoko.sweet.Circumstance.Music);

com.hiyoko.sweet.Circumstance.Music.prototype.sendCommand = function(e) {
	var $button = this.getElementById('send');
	if($button.text() !== '適用') {
		$button.notify('設定中です……', 'warn');
		return;
	}
	
	var index = this.getElementById('selector').val();
	var data = this.getData()[Number(index)];
	$button.text('……');
	
	var event = this.getAsyncEvent('tofRoomRequest').done(function(r){
		$button.notify('BGM 設定しました', 'success');
		$button.text('適用');
	}).fail(function(r){
		alert('BGM 設定に失敗しました\n' + r.result, 'warn');
		$button.text('適用');
	});
	
	event.args = [data.url, data.command, this.getElementById('volume').val(),'SWEET'];
	event.method = 'playBGM';
	this.fireEvent(event);
};


com.hiyoko.sweet.Circumstance.BackGround = function($html) {
	this.$html = $($html);
	this.id = this.$html.attr('id');
	this.defaultData = [{
		command: '背景画像：森',
		url: 'https://www.evernote.com/shard/s76/sh/05f02ae5-cde7-4451-84cf-74cb7a1de5d9/36afd92b75f9f2ce65e6edbbc4d0c4d3/res/bd43fcdb-842b-4b5a-a39f-0bcf4d47aad7/forest_2.jpg',
		memo: '本画像は写真素材ぱくたそで配布されている素材です。利用規約は https://www.pakutaso.com/userpolicy.html をご参照ください'
	},{
		command: '背景画像：森',
		url: 'https://www.evernote.com/shard/s76/sh/05f02ae5-cde7-4451-84cf-74cb7a1de5d9/36afd92b75f9f2ce65e6edbbc4d0c4d3/res/a282e067-61b0-4746-8ac9-c4ab73baf8f3/forest_1.jpg',
		memo: '本画像は写真素材ぱくたそで配布されている素材です。利用規約は https://www.pakutaso.com/userpolicy.html をご参照ください'
	},{
		command: '背景画像：森',
		url: 'https://www.evernote.com/shard/s76/sh/05f02ae5-cde7-4451-84cf-74cb7a1de5d9/36afd92b75f9f2ce65e6edbbc4d0c4d3/res/fe306925-5cde-405b-8be4-6d7aa5cd5794/forest_3.jpg',
		memo: '本画像は写真素材ぱくたそで配布されている素材です。利用規約は https://www.pakutaso.com/userpolicy.html をご参照ください'
	},{
		command: '背景画像：洞窟',
		url: 'https://www.evernote.com/shard/s76/sh/05f02ae5-cde7-4451-84cf-74cb7a1de5d9/36afd92b75f9f2ce65e6edbbc4d0c4d3/res/d8dc9d96-a448-4694-9a43-26394f240178/cave.jpg',
		memo: '本画像は写真素材ぱくたそで配布されている素材です。利用規約は https://www.pakutaso.com/userpolicy.html をご参照ください'
	},{
		command: '背景画像：遺跡',
		url: 'https://www.evernote.com/shard/s76/sh/05f02ae5-cde7-4451-84cf-74cb7a1de5d9/36afd92b75f9f2ce65e6edbbc4d0c4d3/res/87f5a8fa-7803-4af4-b0e4-3eb64769de65/ruin_1.jpg',
		memo: '本画像は写真素材ぱくたそで配布されている素材です。利用規約は https://www.pakutaso.com/userpolicy.html をご参照ください'
	},{
		command: '背景画像：遺跡',
		url: 'https://www.evernote.com/shard/s76/sh/05f02ae5-cde7-4451-84cf-74cb7a1de5d9/36afd92b75f9f2ce65e6edbbc4d0c4d3/res/168c1ebc-feee-4b7e-9fa6-64180a52022a/ruin_2.jpg',
		memo: '本画像は写真素材ぱくたそで配布されている素材です。利用規約は https://www.pakutaso.com/userpolicy.html をご参照ください'
	}];
	
	this.render();
	this.initialize();
	
	this.bindEvents();
};
com.hiyoko.util.extend(com.hiyoko.sweet.Circumstance.CommandBase, com.hiyoko.sweet.Circumstance.BackGround);

com.hiyoko.sweet.Circumstance.BackGround.prototype.sendCommand = function(e) {
	var index = this.getElementById('selector').val();
	var data = this.getData()[Number(index)];
	
	var event = this.getAsyncEvent('tofRoomRequest').done(function(r){
		alert('設定しました');
	}).fail(function(r){
		alert('設定に失敗しました\n' + r.result);
	});
	
	// という所まで書いて、どどんとふの背景画像は WEBIF からは変更できないと気付いて挫折
};

com.hiyoko.sweet.Circumstance.CutIn = function($html) {
	this.$html = $($html);
	this.id = this.$html.attr('id');
	
	this.render();
};
com.hiyoko.util.extend(com.hiyoko.sweet.Circumstance.CommandBase, com.hiyoko.sweet.Circumstance.CutIn);


