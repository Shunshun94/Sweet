var com = com || {};
com.hiyoko = com.hiyoko || {};
com.hiyoko.sweet = com.hiyoko.sweet || {};
com.hiyoko.sweet.Battle = com.hiyoko.sweet.Battle || {};

com.hiyoko.sweet.Battle.TofLoader = function($html) {
	this.$html = $html;
};

com.hiyoko.util.extend(com.hiyoko.component.ApplicationBase, com.hiyoko.sweet.Battle.TofLoader);

com.hiyoko.sweet.Battle.TofLoader.prototype.loadCharacters = function(cb, opt_fail) {
	this.fireEvent(this.getAsyncEvent('tofRoomRequest', {method: 'getCharacters'}).done(function(result){
		var arg = [];
		com.hiyoko.util.forEachMap(com.hiyoko.util.groupArray(result.characters.filter(function(character){
			return (character.type === 'characterData');
		}).map(function(character) {
			return character.name;
		}), function(parts) {
			return parts.split(':')[0];
		}), function(v, k) {
			arg.push(k);
		});
		
		cb(arg);
	}).fail(function(result) {
		if(opt_fail) {
			opt_fail(result);
		} else {
			alertify.error(result.result);
		}
	}));
};

com.hiyoko.sweet.Battle.TofLoader.prototype.loadSavedData = function(cb) {
	this.fireEvent(this.getAsyncEvent('loadRequestAll').done(cb));
};


com.hiyoko.sweet.Battle.TofLoader.SIGNATURE = 'By Sweet';