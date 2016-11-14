var com = com || {};
com.hiyoko = com.hiyoko || {};
com.hiyoko.sweet = com.hiyoko.sweet || {};
com.hiyoko.sweet.Accounting = com.hiyoko.sweet.Accounting || {}

com.hiyoko.sweet.Accounting.InputTable = function($html) {
	this.$html = $($html);
	this.id = this.$html.attr('id');
	
	var detailInCols = [{title:'項目名', type:'text'},
	                    {title:'単価', type:'number'},
	                    {title:'数量', type:'number'},
		                {title:'小計', type:'auto', func:'calcSubTotal'}];
	var detailOutCols = [{title:'出費者', type:'text'},
		                 {title:'項目名', type:'text',
                          inputTrigger:'autoInputCost', autocomplete:this.getElementById('items')},
		                 {title:'単価', type:'number'},
		                 {title:'数量', type:'number'},
		                 {title:'小計', type:'auto', func:'calcSubTotal'}];
	
	this.bindEvents();
	
	this.detailIn = new com.hiyoko.sweet.Accounting.DetailIn(this.getElementById('in'), detailInCols);
	this.detailOut = new com.hiyoko.sweet.Accounting.DetailOut(this.getElementById('out'), detailOutCols);
};

com.hiyoko.util.extend(com.hiyoko.sweet.ApplicationBase, com.hiyoko.sweet.Accounting.InputTable);

com.hiyoko.sweet.Accounting.InputTable.prototype.bindEvents = function(){
	this.$html.on('updateItemList', function(e) {
		var tag = this.getElementById('items');
		tag.empty();
		e.itemList.forEach(function(item){
			tag.append('<option value="' + item + '"></option>');
		});
	}.bind(this));
};


com.hiyoko.sweet.Accounting.InputTable.prototype.getIn = function() {
	return this.detailIn.getTableValue();
};

com.hiyoko.sweet.Accounting.InputTable.prototype.getOut = function() {
	return this.detailOut.getTableValue();
};

com.hiyoko.sweet.Accounting.DetailIn = function($html, cols) {
	this.$html = $($html);
	this.id = this.$html.attr('id');

	this.renderTable(cols);
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

com.hiyoko.sweet.Accounting.DetailOut = function($html, cols) {
	this.$html = $($html);
	this.id = this.$html.attr('id');

	this.renderTable(cols);
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
	var table = this.getTableValue();
	table.forEach(function(v) {
		total += Number(v[4]);
		v[0] = null;
		v[3] = null;
		v[4] = null;
	});
	result.push(total);
	this.getStorage('item-cost', function(result) {
		var itemList = [];
		table.forEach(function(v) {
			result[v[1]] = v;
		});
		this.setStorage('item-cost', result);
		for(var key in result) {
			itemList.push(key);
		}
		this.fireEvent({
			type: 'updateItemList',
			itemList: itemList
		});
	}.bind(this));
	
	return result;
};
