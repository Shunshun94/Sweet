var com = com || {};
com.hiyoko = com.hiyoko || {};
com.hiyoko.sweet = com.hiyoko.sweet || {};
com.hiyoko.sweet.Accounting = com.hiyoko.sweet.Accounting || {}

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
	this.$html.append(this.textReport(cost));
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

com.hiyoko.sweet.Accounting.SummaryReport.prototype.textReport = function(cost) {
	var $html = $('<pre></pre>')
	var inbase = '%s\n\t%s × %s …… %s\n';
	var outbase = '\t%s\n\t\t%s × %s …… %s\n';
	
	$html.append('＊収入＊\n');
	cost.inCost.raw.forEach(function(v){
		$html.append(com.hiyoko.util.format(inbase, v[0], v[1], v[2], v[3]));
	});
	$html.append('合計\n\t' + cost.inCost.total);
	
	
	$html.append('\n\n＊支出＊\n');
	var grouped_raw_data = com.hiyoko.util.groupArray(cost.outCost.raw, function(line){return line[0];});
	for(var name in grouped_raw_data) {
		$html.append('\n' + name +'\n');
		grouped_raw_data[name].forEach(function(v){
			$html.append(com.hiyoko.util.format(outbase, v[1], v[2], v[3], v[4]));
		});	
	}
	$html.append('合計\n\t' + cost.outCost.total);
	
	return $html;
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
				memberCount, standardPaying, 0, this.id + '-table-coltotal', standardPaying * memberCount));
	}
	
	if(excess) {
		this.$table.append(com.hiyoko.util.format('<tr><td>未分配金</td><td>%s</td><td>%s</td><td class="%s">%s</td></tr>',
				excess, 0, this.id + '-table-coltotal', excess));
	}
	
	this.$table.append(com.hiyoko.util.format('<tr class="%s"><td>合計</td><td>%s</td><td>%s</td><td class="%s">%s</td></tr>',
			this.id + '-table-rowtotal', benefit, data.outCost.total, this.id + '-table-coltotal', data.inCost.total));
}; 








