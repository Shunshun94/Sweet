var com = com || {};
com.hiyoko = com.hiyoko || {};
com.hiyoko.sweet = com.hiyoko.sweet || {};

com.hiyoko.sweet.CommonCheck = function($html, character) {
	this.$html = $html;
	this.id = $html.attr('id');
	this.character = character;
	this.LIST_NAME = 'その他の判定';
	this.buildComponents();
	
	this.getElementById('exec').click(this.sendCommand.bind(this));
	this.getElementById('execNoSkill').click(this.sendCommandNoSkill.bind(this));

	this.getElementById('comment-clear').click(function(e) {
		this.getElementById('comment').val('');
		this.getElementById('comment').focus();
	}.bind(this));
};

com.hiyoko.util.extend(com.hiyoko.component.ApplicationBase, com.hiyoko.sweet.CommonCheck);

com.hiyoko.sweet.CommonCheck.prototype.buildComponents = function() {
	this.character.status.forEach(function(v, i){
		this.getElementById('status').append(com.hiyoko.util.format('<option value="%s">%s</option>', 
				v, com.hiyoko.VampireBlood.SW2.Status[i]));
	}.bind(this));
	
	this.getElementById('skill').append(com.hiyoko.util.format('<option value="%s">%s</option>',
			this.character.level, '冒険者レベル'));
	com.hiyoko.util.forEachMap(this.character.skills, function(v, name) {
		this.getElementById('skill').append(com.hiyoko.util.format('<option value="%s">%s</option>',v, name));
	}.bind(this));
	for(var i = this.character.level - 1; i > 0; i--) {
		this.getElementById('skill').append(com.hiyoko.util.format('<option value="%s">%s</option>',i, i));
	}
	this.option = new com.hiyoko.sweet.CommonChecker.OptionalValues(this.getElementById('option'));
};

com.hiyoko.sweet.CommonCheck.prototype.sendCommand = function(e) {
	var event = this.getAsyncEvent('tofRoomRequest').done(function(r){
		$(e.target).notify('ダイスが振られました', {className: 'success', position: 'top'});
		if(this.isCommentClearEvertytime()) {
			this.getElementById('comment').val('');
		}
	}.bind(this)).fail(function(r){
		alert('ダイスを振るのに失敗しました\n' + r.result);
	});
	
	var option = this.option.getOptionalValue();
	var text = com.hiyoko.util.format('2d6+%s+%s%s / %s (基準値：%s+%s)%s',
			this.getElementById('skill').val(),
			this.getElementById('status').val(),
			option.value, this.getElementById('comment').val(),
			this.getElementById('skill').children(':selected').text(), this.getElementById('status').children(':selected').text(),
			option.detail);
	
	event.args = [{name: this.character.name, message: text, bot:'SwordWorld2.0'}];
	event.method = 'sendChat';
	
	this.fireEvent(event);
};

com.hiyoko.sweet.CommonCheck.prototype.sendCommandNoSkill = function(e) {
	var event = this.getAsyncEvent('tofRoomRequest').done(function(r){
		$(e.target).notify('ダイスが振られました', {className: 'success', position: 'top'});
		if(this.isCommentClearEvertytime) {
			this.getElementById('comment').val('');
		}
	}.bind(this)).fail(function(r){
		alert('ダイスを振るのに失敗しました\n' + r.result);
	});
	
	var option = this.option.getOptionalValue();
	var text = com.hiyoko.util.format('2d6%s / %s (基準値：平目)%s',
			option.value, this.getElementById('comment').val(), option.detail);
	
	event.args = [{name: this.character.name, message: text, bot:'SwordWorld2.0'}];
	event.method = 'sendChat';
	this.fireEvent(event);
};

com.hiyoko.sweet.CommonCheck.prototype.isCommentClearEvertytime = function() {
	return this.getElementById('comment-clear-everytime').prop('checked');
	
};
