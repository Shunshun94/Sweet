var com = com || {};
com.hiyoko = com.hiyoko || {};
com.hiyoko.sweet = com.hiyoko.sweet || {};

com.hiyoko.sweet.MapOrganizer = function($html) {
	this.query = com.hiyoko.util.getQueries();
	
	this.$html = $html;
	this.id = this.$html.attr('id');
	this.tofRoomAccess;
	
	this.bindEvents();	
	this.buildComponents();
};

com.hiyoko.util.extend(com.hiyoko.component.ApplicationBase, com.hiyoko.sweet.MapOrganizer);

com.hiyoko.sweet.MapOrganizer.prototype.buildComponents = function() {
	if(this.query.url && this.query.room) {
		this.tofRoomAccess = new com.hiyoko.DodontoF.V2.Room(this.query.url, this.query.room, this.query.pass);
		this.map = new com.hiyoko.sweet.MapOrganizer.Map(this.getElementById('map'), {
			range: this.query.range || 'circle',
			scale: Number(this.query.scale),
			size: 30});
	} else {
		alert('どどんとふの URL と部屋番号が入力されていません');
		throw 'DodontoF URL and Room No. aren\'t inputted.'
	}
};

com.hiyoko.sweet.MapOrganizer.prototype.bindEvents = function(e) {
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
};
