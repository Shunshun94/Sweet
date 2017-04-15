var com = com || {};
com.hiyoko = com.hiyoko || {};
com.hiyoko.sweet = com.hiyoko.sweet || {};

com.hiyoko.sweet.Accounting = function($html, opt_params){
	this.$html = $($html);
	this.LIST_NAME = 'SWEET Accounting - 会計';
	this.id = this.$html.attr('id');

	this.buildComponents();
	this.bindEvents();
};

com.hiyoko.util.extend(com.hiyoko.component.ApplicationBase, com.hiyoko.sweet.Accounting);

com.hiyoko.sweet.Accounting.prototype.buildComponents = function() {
	this.input = new com.hiyoko.sweet.Accounting.InputTable(this.getElementById('detail'));
	this.summary = new com.hiyoko.sweet.Accounting.SummaryReport(this.getElementById('summary'));
	this.divide = new com.hiyoko.sweet.Accounting.FeePartition(this.getElementById('plan'));
};

com.hiyoko.sweet.Accounting.prototype.bindEvents = function() {
	this.getElementById('printReport').click(function(){
		var cost = this.calcCost(this.input.getIn(), this.input.getOut())
		this.summary.draw(cost);
		this.divide.print(cost);
	}.bind(this));
};

com.hiyoko.sweet.Accounting.prototype.calcCost = function(inCost, outCost) {
	var result = {};
	
	result.inCost = {
		raw: inCost,
		total: inCost.reduce(function(a, b){return a + Number(b[3])}, 0)
	};
	
	result.outCost = {
		raw: outCost,
		members: com.hiyoko.util.groupArray(outCost, function(v){return v[0]}),
		total: outCost.reduce(function(a, b){return a + Number(b[4])}, 0)
	};
	
	return result;
};
