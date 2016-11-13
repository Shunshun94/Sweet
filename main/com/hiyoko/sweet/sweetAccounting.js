var com = com || {};
com.hiyoko = com.hiyoko || {};
com.hiyoko.sweet = com.hiyoko.sweet || {};

com.hiyoko.sweet.Accounting = function($html, opt_params){
	this.$html = $($html);
	this.LIST_NAME = 'SWEET Accounting';
	this.id = this.$html.attr('id');

	this.buildComponents();
	this.bindEvents();
};

com.hiyoko.util.extend(com.hiyoko.sweet.ApplicationBase, com.hiyoko.sweet.Accounting);

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

com.hiyoko.sweet.Accounting.SummaryReport = function($html) {
	this.$html = $($html);
	this.id = this.$html.attr('id');
	
	this.buildComponents();
	this.bindEvents();
};

com.hiyoko.util.extend(com.hiyoko.sweet.ApplicationBase, com.hiyoko.sweet.Accounting.SummaryReport);

com.hiyoko.sweet.Accounting.SummaryReport.prototype.draw = function(cost) {
	this.$html.empty();

	var $table = $('<table border="2"></table>');
	$table.addClass(this.id + '-table');
	$table.append('<caption>収支報告</caption>');
	
	var inTable = this.renderInTable(cost.inCost.raw);
	var outTable = this.renderOutTable(cost.outCost.raw);
	
	var longerTable;
	var shorterTable;
	
	
	if(inTable.length === outTable.length) {
		longerTable = inTable;
		shorterTable = outTable;
	} else if (inTable.length > outTable.length){
		longerTable = inTable;
		shorterTable = outTable;
		shorterTable.push(com.hiyoko.util.format('<td rowspan="%s" colspan="5"></td>', longerTable.length - shorterTable.length));
	} else {
		longerTable = outTable;
		shorterTable = inTable;
		shorterTable.push(com.hiyoko.util.format('<td rowspan="%s" colspan="4"></td>', longerTable.length - shorterTable.length));
	}
	
	$table.append(com.hiyoko.util.format('<tr><td  colspan="4">収入</td><td rowspan="%s"></td><td colspan="5">支出</td></tr>',
			longerTable.length + 3));
	$table.append('<tr><td>項目名</td><td>単価</td><td>数</td><td>小計</td>' +
			'<td>出費者</td><td>項目名</td><td>単価</td><td>数</td><td>小計</td></tr>');
	
	longerTable.forEach(function(v, i){
		$table.append('<tr>' + (inTable[i] || '') + (outTable[i] || '') + '</tr>');
	}); 
	
	$table.append(com.hiyoko.util.format(
			'<tr><td class="%s" colspan="3">合計</td><td>%s</td>' +
			'<td class="%s" colspan="4">合計</td><td>%s</td></tr>',
			this.id + '-table-out-name',
			cost.inCost.total,
			this.id + '-table-out-name',
			cost.outCost.total));
	
	this.$html.append($table);
};

com.hiyoko.sweet.Accounting.SummaryReport.prototype.renderInTable = function(raw_data) {
	var tableContains = [];
	var base = '<td class="%s">%s</td><td>%s</td><td>%s</td><td>%s</td>';
	
	raw_data.forEach(function(v){
		tableContains.push(com.hiyoko.util.format(base,
				this.id + '-table-out-name',
				v[0], v[1], v[2], v[3]).replace(/\n/gm, '<br/>'));
	}.bind(this));
	
	return tableContains;
};

com.hiyoko.sweet.Accounting.SummaryReport.prototype.renderOutTable = function(raw_data) {
	var grouped_raw_data = com.hiyoko.util.groupArray(raw_data, function(line){
		return line[0];
	});
	
	var tableContains = [];
	
	for(var name in grouped_raw_data) {
		total = 0;
		
		tableContains.push(	com.hiyoko.util.format('<td class="%s" rowspan="%s">%s</td>',
							this.id + '-table-out-name',
							grouped_raw_data[name].length + 1, name).replace(/\n/gm, '<br/>') +
							this.renderOutTableLine(grouped_raw_data[name][0]));
		for(var i = 1; i < grouped_raw_data[name].length; i++) {
			tableContains.push(this.renderOutTableLine(grouped_raw_data[name][i]));
		}
		tableContains.push(com.hiyoko.util.format('<td class="%s %s" colspan="3">合計</td><td class="%s">%s</td>',
				this.id + '-table-out-total', this.id + '-table-out-name', this.id + '-table-out-total',
				grouped_raw_data[name].reduce(function(a, b){return a + Number(b[4])}, 0)));
	} 
	
	return tableContains;
};

com.hiyoko.sweet.Accounting.SummaryReport.prototype.renderOutTableLine = function(detailData) {
	return com.hiyoko.util.format('<td class="%s">%s</td><td>%s</td><td>%s</td><td>%s</td>',
			this.id + '-table-out-name',
			detailData[1], detailData[2],detailData[3], detailData[4]).replace(/\n/gm, '<br/>');
};

com.hiyoko.sweet.Accounting.FeePartition = function($html) {
	this.$html = $($html);
	this.id = this.$html.attr('id');
	
	this.$memberCount = this.getElementById('memberCount');
	this.$table = this.getElementById('table');
	
	this.bindEvents();
};

com.hiyoko.util.extend(com.hiyoko.sweet.ApplicationBase, com.hiyoko.sweet.Accounting.FeePartition);

com.hiyoko.sweet.Accounting.FeePartition.prototype.bindEvents = function() {
	this.$memberCount.change(function(e) {
		if(this.data){
			this.print(this.data, this.$memberCount.val());	
		}
	}.bind(this));
};

com.hiyoko.sweet.Accounting.FeePartition.prototype.defineMemberCount = function(data, opt_members) {
	if((Number(this.$memberCount.val()) !== 0)) {
		return this.$memberCount.val(); 
	} else {
		if(opt_members) {
			return opt_members;
		} else {
			var count = 0;
			for(var key in data.outCost.members) {
				count++;
			}
			if(count) {
				return count;
			} else {
				return 4;
			}
		}
	}
};

com.hiyoko.sweet.Accounting.FeePartition.prototype.print = function(data, opt_members, opt_denomi) {
	this.data = data;
	
	var benefit = data.inCost.total - data.outCost.total;
	var memberCount = this.defineMemberCount(data);
	var denomi = opt_denomi || 10;
	var count = 0;
	var itemCost;
	
	var standardPaying = denomi * Math.floor(benefit / (memberCount * denomi));
	var excess = benefit - (standardPaying * memberCount);
	
	this.$memberCount.val(memberCount);
	this.$table.empty();
	
	
	this.$table.append('<caption>報酬配分</caption>');
	this.$table.append(com.hiyoko.util.format('<tr><th>名前</th><th>基本金額</th><th>補填金額</th><th class="%s">合計金額</th></tr>',
			this.id + '-table-coltotal'));
	for(var key in data.outCost.members) {
		memberCount--;
		itemCost = data.outCost.members[key].reduce(function(a, b){return a + Number(b[4])}, 0);
		this.$table.append(com.hiyoko.util.format('<tr><td>%s</td><td>%s</td><td>%s</td><td class="%s">%s</td></tr>',
				key, standardPaying, itemCost, this.id + '-table-coltotal', standardPaying + itemCost));
	}
	
	if(memberCount > 0) {
		this.$table.append(com.hiyoko.util.format('<tr><td>他のメンバー (%s名)</td><td>%s</td><td>%s</td><td class="%s">%s</td></tr>',
				memberCount, standardPaying, 0, this.id + '-table-coltotal', standardPaying));
	}
	
	if(excess) {
		this.$table.append(com.hiyoko.util.format('<tr><td>未分配金</td><td>%s</td><td>%s</td><td class="%s">%s</td></tr>',
				excess, 0, this.id + '-table-coltotal', standardPaying));
	}
	
	this.$table.append(com.hiyoko.util.format('<tr class="%s"><td>合計</td><td>%s</td><td>%s</td><td class="%s">%s</td></tr>',
			this.id + '-table-rowtotal', benefit, data.outCost.total, this.id + '-table-coltotal', data.inCost.total));
}; 








