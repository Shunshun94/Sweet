var com = com || {};
com.hiyoko = com.hiyoko || {};
com.hiyoko.sweet = com.hiyoko.sweet || {};
com.hiyoko.sweet.ResourceManage = com.hiyoko.sweet.ResourceManage || {};

com.hiyoko.sweet.ResourceManage.ResourceTable = function($html, data) {
	this.$html = $html;
	this.id = this.$html.attr('id');
	this.data = data;
	this.buildComponents();
};

com.hiyoko.util.extend(com.hiyoko.component.ApplicationBase, com.hiyoko.sweet.ResourceManage.ResourceTable);

com.hiyoko.sweet.ResourceManage.ResourceTable.prototype.buildComponents = function() {
	this.hpmp = new com.hiyoko.sweet.ResourceManage.ResourceTable.HPMP(this.getElementById('points'), this.data);
};

com.hiyoko.sweet.ResourceManage.ResourceTable.HPMP = function($html, data) {
	this.$html = $html;
	this.id = this.$html.attr('id');
	this.data = data;
	
	this.getElementById('hp').val(data.hp);
	this.getElementById('mp').val(data.mp);
	
	this.bindEvents();
};

com.hiyoko.util.extend(com.hiyoko.component.ApplicationBase, com.hiyoko.sweet.ResourceManage.ResourceTable.HPMP);

com.hiyoko.sweet.ResourceManage.ResourceTable.HPMP.prototype.bindEvents = function() {
	this.$html.change(this.update.bind(this));
};

com.hiyoko.sweet.ResourceManage.ResourceTable.HPMP.prototype.update = function() {
	this.fireEvent({
		type: com.hiyoko.sweet.ResourceManage.ResourceTable.HPMP.UPDATE_EVENT,
		params: this.getValue()
	});
	
};

com.hiyoko.sweet.ResourceManage.ResourceTable.HPMP.prototype.getValue = function() {
	return {
		targetName: this.data.name,
		HP: this.getElementById('hp').val(),
		MP: this.getElementById('mp').val()
	};
};

com.hiyoko.sweet.ResourceManage.ResourceTable.HPMP.prototype.setValue = function(value) {
	if(value.hp) {
	 	this.getElementById('hp').val(data.hp);
	}
	
	if(value.mp) {
		this.getElementById('mp').val(data.mp);
	}
	
	this.$html.change();
};

com.hiyoko.sweet.ResourceManage.ResourceTable.HPMP.UPDATE_EVENT = 'com-hiyoko-sweet-ResourceManage-ResourceTable-HPMP-UPDATE_EVENT';


