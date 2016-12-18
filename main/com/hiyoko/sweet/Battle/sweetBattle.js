var com = com || {};
com.hiyoko = com.hiyoko || {};
com.hiyoko.sweet = com.hiyoko.sweet || {};

com.hiyoko.sweet.Battle = function($html, opt_params) {
	this.$html = $($html);
	this.LIST_NAME = 'SWEET Battle';
	this.id = this.$html.attr('id');
	this.list = {};
	this.enemyList = {};
	this.optionalValues;
	
	this.datalist = this.getElementById('datalist');
	
	this.buildComponents();
	this.bindEvents();
};

com.hiyoko.util.extend(com.hiyoko.sweet.ApplicationBase, com.hiyoko.sweet.Battle);

com.hiyoko.sweet.Battle.prototype.buildComponents = function() {
	this.optionalValues = new com.hiyoko.sweet.Battle.OptionalValues(this.getElementById('optionalValues'));
	this.appendCharacter();
	
	this.getStorage('enemy-list', function(result){
		if (result) {
			this.enemyList = result;
			for(var name in this.enemyList) {
				this.datalist.append('<option>' + name + '</option>');
			}
		}
	}.bind(this));
};

com.hiyoko.sweet.Battle.prototype.bindEvents = function() {
	this.getElementById('appendCharacter').click(function(e){
		this.appendCharacter();
	}.bind(this));
	
	this.$html.on('executeRequest', function(e) {
		var option = this.optionalValues.getOptionalValue(e.col);
		var text = e.value.startsWith('C') ?
			com.hiyoko.util.format('%s%s) / %s', e.value, option.value, e.text) : 
			com.hiyoko.util.format('%s%s / %s', e.value, option.value, e.text);
		if(option.text) {
			text += ' (' + option.text + ')';
		}
		
		var event = this.getAsyncEvent('tofRoomRequest').done(function(r){
			this.$html.notify('ダイスが振られました', 'success');
		}.bind(this)).fail(function(r){
			alert('送信に失敗しました\n' + r.result);
		});
		
		event.args = [{name: e.name, message: text, bot:'SwordWorld2.0'}];
		event.method = 'sendChat';
		this.fireEvent(event);
		this.$html.notify('コマンドを送信しました' + text, 'info');
	}.bind(this));
	
	this.$html.on('saveRequest', function(e){
		this.enemyList[e.value.name] = e.value;
		this.setStorage('enemy-list', this.enemyList);
	}.bind(this));
	
	this.$html.on('loadRequest', function(e){
		if(this.enemyList[e.value]) {
			e.resolve(this.enemyList[e.value]);
		} else {
			e.reject();
		}
	}.bind(this));
};

com.hiyoko.sweet.Battle.prototype.appendCharacter = function() {
	var newId = com.hiyoko.util.rndString(8, '-');
	
	this.$html.append(com.hiyoko.util.format('<div class="%s" id="%s"></div>',
			this.id + '-character',
			this.id + '-character' + newId));
	this.list[newId] = new com.hiyoko.sweet.Battle.BattleCharacter(this.getElementById('character' + newId),
			{autocomplete:this.datalist.attr('id')});
};

