var com = com || {};
com.hiyoko = com.hiyoko || {};
com.hiyoko.sweet = com.hiyoko.sweet || {};

com.hiyoko.sweet.Accounting = function($html, opt_params){
	this.$html = $($html);
	this.LIST_NAME = 'SWEET Accounting';
	this.id = this.$html.attr('id');

	this.buildComponents();
};

com.hiyoko.util.extend(com.hiyoko.sweet.ApplicationBase, com.hiyoko.sweet.Accounting);

com.hiyoko.sweet.Accounting.prototype.buildComponents = function() {
	this.detailIn = new com.hiyoko.sweet.Accounting.DetailIn(this.getElementById('detail-in'));
};

com.hiyoko.sweet.Accounting.DetailIn = function($html) {
	this.$html = $($html);
	this.id = this.$html.attr('id');

	this.renderTable([{title:'項目名', type:'text'},
	                  {title:'単価', type:'number'},
	                  {title:'数量', type:'number'},
	                  {title:'小計', type:'auto', value:this.calcSubTotal}
	]);
};

com.hiyoko.util.extend(com.hiyoko.sweet.TableBase, com.hiyoko.sweet.Accounting.DetailIn);

com.hiyoko.sweet.Accounting.DetailIn.prototype.calcSubTotal = function(e) {
	
};


