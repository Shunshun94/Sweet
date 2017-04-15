var com = com || {};
com.hiyoko = com.hiyoko || {};
com.hiyoko.sweet = com.hiyoko.sweet || {};

com.hiyoko.sweet.Entry = function($html) {
	this.LIST_NAME = 'SWEET Entry - 入室';
	this.$html = $($html);
	this.id = this.$html.attr('id');

	var base = com.hiyoko.DodontoF.V2.Entrance;
	this.buildComponents([base.Url, base.Room, base.Password, base.Option]);
	this.bindEvents();
	
	this.fireEvent(new $.Event('getStorage', {key: com.hiyoko.sweet.Entry.AlgorithmiaTokenStorage,
		callback: function(token) {
			if(token) {
				this.inputFlows[3].setValue('algorithmia', token);
			}
		}.bind(this)}));
};
com.hiyoko.util.extend(com.hiyoko.DodontoF.V2.Entrance, com.hiyoko.sweet.Entry);

com.hiyoko.sweet.Entry.AlgorithmiaTokenStorage = 'com-hiyoko-sweet-entry-algorithmia';

