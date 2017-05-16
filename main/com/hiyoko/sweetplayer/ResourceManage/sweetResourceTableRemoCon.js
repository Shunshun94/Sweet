var com = com || {};
com.hiyoko = com.hiyoko || {};
com.hiyoko.sweet = com.hiyoko.sweet || {};
com.hiyoko.sweet.ResourceManage = com.hiyoko.sweet.ResourceManage || {};

com.hiyoko.sweet.ResourceManage.ResourceTableRemoCon = function($html, data) {
	this.$html = $html;
	this.id = this.$html.attr('id');
	this.getElementById('physical-guard').val(data.guard);
	
	this.bindEvents();
};

com.hiyoko.util.extend(com.hiyoko.component.ApplicationBase, com.hiyoko.sweet.ResourceManage.ResourceTableRemoCon);

com.hiyoko.sweet.ResourceManage.ResourceTableRemoCon.prototype.apply = function(arg) {
	this.fireEvent({
		type: com.hiyoko.sweet.ResourceManage.ResourceTableRemoCon.APPLY_EVENT,
		arg: arg
	});
}

com.hiyoko.sweet.ResourceManage.ResourceTableRemoCon.APPLY_EVENT = 'com-hiyoko-sweet-resourcemanage-resourcetable-remocon-applyevent';

com.hiyoko.sweet.ResourceManage.ResourceTableRemoCon.prototype.bindEvents = function() {
	this.getElementById('physical-exec').click(function(e) {
		this.apply({
			hp: Math.max(
					Number(this.getElementById('physical-base').val()) -
					Number(this.getElementById('physical-guard').val()) +
					Number(this.getElementById('physical-help').val()),
					0)
		});
	}.bind(this));
	
	this.getElementById('magical-exec').click(function(e) {
		this.apply({
			hp: Math.max(
					Number(this.getElementById('magical-base').val()) +
					Number(this.getElementById('magical-help').val()),
					0)
		});
	}.bind(this));

	this.getElementById('mp-exec').click(function(e) {
		this.apply({
			mp: Math.max(
					(Number(this.getElementById('mp-base').val()) * Number(this.getElementById('mp-times').val())) -
					Number(this.getElementById('mp-help').val()),
					0)
		});
	}.bind(this));
};

//