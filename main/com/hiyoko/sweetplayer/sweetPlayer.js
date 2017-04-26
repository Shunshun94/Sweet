var com = com || {};
com.hiyoko = com.hiyoko || {};
com.hiyoko.sweet = com.hiyoko.sweet || {};
com.hiyoko.sweet.Player = function($html) {
	this.query = com.hiyoko.util.getQueries();
	
	this.$html = $html;
	this.id = this.$html.attr('id');

	this.tofRoomAccess;
	
	this.bindEvents();	
	this.buildComponents();

};
com.hiyoko.util.extend(com.hiyoko.component.ApplicationBase, com.hiyoko.sweet.Player);

com.hiyoko.sweet.Player.prototype.initRoomTitle = function() {
	this.tofRoomAccess.getRoomInfo()
	.done(function(r){
		this.getElementById('title').text('【' + this.character.name + ' @ ' + r.roomName + '】');
	}.bind(this))
	.fail(function(r){
		alert('Couldn\'t get DodontoF Room Info. Is URL correct?');
	}.bind(this));	
};

com.hiyoko.sweet.Player.prototype.buildComponents = function() {
	if(this.query.url && this.query.room && this.query.sheetId) {
		com.hiyoko.VampireBlood.SW2.getSheet(this.query.sheetId).done(function(character){
			this.character = character;
			this.tofRoomAccess = new com.hiyoko.DodontoF.V2.Room(this.query.url, this.query.room, this.query.pass);
			this.initRoomTitle();
			
			this.battle = new com.hiyoko.sweet.PlayerBattle(this.getElementById('playerbattle'), this.character);
			this.commonCheck = new com.hiyoko.sweet.CommonCheck(this.getElementById('commoncheck'), this.character);
			
		}.bind(this));
	} else {
		this.$html.children('div').hide();
		new com.hiyoko.DodontoF.V2.Entrance(this.getElementById('entrance'));
		this.getElementById('entrance').show();
	}
};

com.hiyoko.sweet.Player.prototype.bindEvents = function(e) {
	var self = this;
	
	this.$html.on('tofRoomRequest', function(e){
		self.tofRoomAccess[e.method].apply(self.tofRoomAccess, e.args).done(e.resolve).fail(e.reject);
	});
	
	this.$html.on('getStorage', function(e){
		e.callback(localStorage.getItem(e.key) ? JSON.parse(localStorage.getItem(e.key)) : null);
	});
	
	this.$html.on('setStorage', function(e){
		localStorage.setItem(e.id, JSON.stringify(e.value));
	});
	
	this.$html.on(com.hiyoko.component.InputFlow.Events.Finish, function(e) {
		var url = './player.html?';
		url += '&url=' + e.value.url;
		url += '&room=' + e.value.room.no;
		url += '&sheetId=' + e.value.option.sheetId;
		if(e.value.room.isLocked) {
			url += '&pass=' + e.value.password.password;
		}
		document.location = url;
	});
};


