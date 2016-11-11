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
	this.detailOut = new com.hiyoko.sweet.Accounting.DetailOut(this.getElementById('detail-out'));
};

com.hiyoko.sweet.Accounting.DetailIn = function($html) {
	this.$html = $($html);
	this.id = this.$html.attr('id');

	this.renderTable([{title:'項目名', type:'text'},
	                  {title:'単価', type:'number'},
	                  {title:'数量', type:'number'},
	                  {title:'小計', type:'auto', func:this.calcSubTotal}
	]);
};

com.hiyoko.util.extend(com.hiyoko.sweet.TableBase, com.hiyoko.sweet.Accounting.DetailIn);

com.hiyoko.sweet.Accounting.DetailIn.prototype.calcSubTotal = function(vals) {
	return vals[1] * vals[2];
};

com.hiyoko.sweet.Accounting.DetailIn.prototype.calcTotal = function(e) {
	var result = ['', '', ''];
	var total = 0;
	var table = this.getTableValue();
	table.forEach(function(v) {
		total += Number(v[3]);
	});
	result.push(total);
	return result;
};

com.hiyoko.sweet.Accounting.DetailOut = function($html) {
	this.$html = $($html);
	this.id = this.$html.attr('id');

	this.renderTable([{title:'出費者', type:'text'},
	                  {title:'項目名', type:'text', autocomplete:this.autoInputCost},
	                  {title:'単価', type:'number'},
	                  {title:'数量', type:'number'},
	                  {title:'小計', type:'auto', func:this.calcSubTotal}
	]);
};

com.hiyoko.util.extend(com.hiyoko.sweet.TableBase, com.hiyoko.sweet.Accounting.DetailOut);

com.hiyoko.sweet.Accounting.DetailOut.prototype.calcSubTotal = function(vals) {
	return vals[2] * vals[3];
};

com.hiyoko.sweet.Accounting.DetailOut.prototype.autoInputCost = function(val, $tr, callback) {
	this.getStorage('item-cost', function(result){
		if(result) {
			var line = result[val];
			if(line) {
				this.setLine(line, $tr);
			}
		}
		callback();
	}.bind(this));
};

com.hiyoko.sweet.Accounting.DetailOut.prototype.calcTotal = function(e) {
	var result = ['', '', '', ''];
	var total = 0;
	var itemCost = {};
	var table = this.getTableValue();
	table.forEach(function(v) {
		total += Number(v[4]);
		v[0] = null;
		v[3] = null;
		v[4] = null;
		itemCost[v[1]] = v;
	});
	result.push(total);
	this.setStorage('item-cost', itemCost);
	return result;
};

