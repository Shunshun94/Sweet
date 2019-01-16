var com = com || {};
com.hiyoko = com.hiyoko || {};
com.hiyoko.sweet = com.hiyoko.sweet || {};
com.hiyoko.sweet.ResourceManage = function($html, character, query = {}) {
	this.$html = $html;
	this.id = this.$html.attr('id');
	this.character = character;
	this.isTableExist = com.hiyoko.sweet.ResourceManage.hasInitTable(query);
	this.initialize();
};
com.hiyoko.sweet.ResourceManage.SIGNATURE = 'By PCSweet';

com.hiyoko.util.extend(com.hiyoko.component.ApplicationBase, com.hiyoko.sweet.ResourceManage);

com.hiyoko.sweet.ResourceManage.prototype.initialize = function() {
	this.$html.show();
	
	if(this.isTableExist) {
		this.getCharacters(function(list) {
			if(list.length === 0) {
				this.getElementById('append').show();
			} else {
				this.getElementById('resources').show();
				var data = list[0].counters;
				
				this.character.hp = data.HP || data.hp;
				this.character.mp = data.MP || data.mp;
			}
			this.bindEvents();
			this.buildComponents();
		}.bind(this));
	} else {
		this.getElementById('resources').show();
		this.bindEvents();
		this.buildComponents();
	}
};

com.hiyoko.sweet.ResourceManage.prototype.buildComponents = function() {
	this.resources = new com.hiyoko.sweet.ResourceManage.ResourceTable(this.getElementById('resources'), this.character);
};

com.hiyoko.sweet.ResourceManage.prototype.bindEvents = function() {
	this.getElementById('toggle').click(function(e) {
		this.getElementById('base').toggle(400);
	}.bind(this));

	this.getElementById('append').click(function(e) {
		this.putCharacter(e);
		this.getElementById('resources').show();
		this.getElementById('append').hide();
	}.bind(this));
	if(this.isTableExist) {
		this.$html.on(com.hiyoko.sweet.ResourceManage.ResourceTable.HPMP.UPDATE_EVENT, this.updateCharacter.bind(this));
	}
};

com.hiyoko.sweet.ResourceManage.prototype.getCharacters = function(callback) {
	var event = this.getAsyncEvent('tofRoomRequest').done(function(r) {
		callback(r.characters.filter(function(c) {return c.name === this.character.name;}.bind(this)));
	}.bind(this));
	event.method = 'getCharacters';
	this.fireEvent(event);
};

com.hiyoko.sweet.ResourceManage.prototype.updateCharacter = function(e) {
	var event = this.getAsyncEvent('tofRoomRequest').done(function(r){
		alertify.success('更新されました');
	}.bind(this)).fail(function(r){
		alertify.error('更新に失敗しました\n' + r.result);
	});
	
	event.method = 'updateCharacter';
	 
	event.args = [e.params];	
	this.fireEvent(event);
}

com.hiyoko.sweet.ResourceManage.prototype.putCharacter = function(e) {
	var event = this.getAsyncEvent('tofRoomRequest').done(function(r){
		alertify.success('キャラクターが追加されました');
	}.bind(this)).fail(function(r){
		alertify.error('キャラクターの追加に失敗しました\n' + r.result);
	});
	
	event.method = 'addCharacter';
	 
	event.args = [{
		name:this.character.name,
		HP: this.character.hp,
		MP: this.character.mp,
 		info:com.hiyoko.sweet.ResourceManage.SIGNATURE
	}];	
	this.fireEvent(event);
};

com.hiyoko.sweet.ResourceManage.hasInitTable = (query) => {
	const platform = query.platform || '';
	return ['tof', 'DodontoF',　'とふ', 'どどんとふ'].includes(platform) || platform.endsWith('tof');
};
