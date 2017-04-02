var com = com || {};
com.hiyoko = com.hiyoko || {};
com.hiyoko.sweet = com.hiyoko.sweet || {};
com.hiyoko.sweet.Battle = com.hiyoko.sweet.Battle || {};

com.hiyoko.sweet.Battle.TofLoader = function($html) {
	this.$html = $html;
	
	var self = this;
	self.loadCharacters(function(tmpTofCharacterList) {
		self.loadSavedData(function(enemyList){
			var characterList = tmpTofCharacterList.characters.filter(function(character){
				return (character.type === 'characterData') && (character.info.indexOf(com.hiyoko.sweet.Battle.TofLoader.SIGNATURE) !== -1)
			}).map(function(character) {
				var result = {};
				var name = character.name.split(':');
				
				result.fullName = name[0];
				result.fullPartsName = name[1];
				
				result.name = name[0].split('_')[0];
				result.partsName = name[1].split('_')[0];
				
				result.hp = Number(character.counters.HP);
				result.mp = Number(character.counters.MP);
				
				return result;
			});
			
			console.log(characterList);
		});
	});
};

com.hiyoko.util.extend(com.hiyoko.sweet.ApplicationBase, com.hiyoko.sweet.Battle.TofLoader);

com.hiyoko.sweet.Battle.TofLoader.prototype.loadCharacters = function(cb) {
	this.fireEvent(this.getAsyncEvent('tofRoomRequest', {method: 'getCharacters'}).done(cb));
	
};

com.hiyoko.sweet.Battle.TofLoader.prototype.loadSavedData = function(cb) {
	this.fireEvent(this.getAsyncEvent('loadRequestAll').done(cb));
};


com.hiyoko.sweet.Battle.TofLoader.SIGNATURE = 'By Sweet';