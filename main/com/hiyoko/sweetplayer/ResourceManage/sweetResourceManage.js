var com = com || {};
com.hiyoko = com.hiyoko || {};
com.hiyoko.sweet = com.hiyoko.sweet || {};
com.hiyoko.sweet.ResourceManage = function($html, character) {
	this.$html = $html;
	this.id = this.$html.attr('id');
	this.character = character;
	this.initialize();
};
com.hiyoko.sweet.ResourceManage.SIGNATURE = 'By PCSweet';

com.hiyoko.util.extend(com.hiyoko.component.ApplicationBase, com.hiyoko.sweet.ResourceManage);

com.hiyoko.sweet.ResourceManage.prototype.initialize = function() {
	this.$html.show();
	this.getCharacters(function(list) {
		if(list.length === 0) {
			this.getElementById('append').show();
		}
		
		
		this.bindEvents();
		this.buildComponents();
		
	}.bind(this));
};

com.hiyoko.sweet.ResourceManage.prototype.buildComponents = function() {
	
};

com.hiyoko.sweet.ResourceManage.prototype.bindEvents = function() {
	this.getElementById('toggle').click(function(e) {
		this.getElementById('base').toggle(400);
	}.bind(this));
	
	this.getElementById('append').click(function(e) {
		this.putCharacter(e);
	}.bind(this));
};

com.hiyoko.sweet.ResourceManage.prototype.getCharacters = function(callback) {
	var event = this.getAsyncEvent('tofRoomRequest').done(function(r) {
		callback(r.characters.filter(function(c) {return c.name === this.character.name;}.bind(this)));
	}.bind(this));
	event.method = 'getCharacters';
	this.fireEvent(event);
};

com.hiyoko.sweet.ResourceManage.prototype.putCharacter = function(e) {
	var event = this.getAsyncEvent('tofRoomRequest').done(function(r){
		$(e.target).notify('キャラクターが追加されました', {className: 'success', position: 'top'});
	}.bind(this)).fail(function(r){
		alert('キャラクターの追加に失敗しました\n' + r.result);
	});
	
	event.method = 'addCharacter';
	 
	event.args = [{
		name:this.character.name,
		HP: this.character.hp,
		MP: this.character.mp,
		'防護点': this.character.gard,
		info:com.hiyoko.sweet.ResourceManage.SIGNATURE
	}];	
	this.fireEvent(event);
};

