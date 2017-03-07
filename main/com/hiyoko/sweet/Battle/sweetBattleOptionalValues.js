var com = com || {};
com.hiyoko = com.hiyoko || {};
com.hiyoko.sweet = com.hiyoko.sweet || {};
com.hiyoko.sweet.Battle = com.hiyoko.sweet.Battle || {};

com.hiyoko.sweet.Battle.OptionalValues = function($html, opt_conf) {
	this.$html = $($html);
	this.id = this.$html.attr('id');
	
	this.$table = this.getElementById('table');
	this.$toggle = this.getElementById('toggle');
	this.$summary = this.getElementById('summary');

	this.table = new com.hiyoko.sweet.Battle.OptionalValues.Table(
					this.$table,
					[{title:'', type:'check'}, {title:'名称', type:'text'},
	                 {title:'命中', type:'number'}, {title:'追加 D', type:'number'}, {title:'回避', type:'number'},
	                 {title:'生命抵抗', type:'number'}, {title:'精神抵抗', type:'number'}, {title:'魔力', type:'number'}]);
	
	this.bindEvent();
};

com.hiyoko.util.extend(com.hiyoko.sweet.ApplicationBase, com.hiyoko.sweet.Battle.OptionalValues);

com.hiyoko.sweet.Battle.OptionalValues.prototype.bindEvent = function(){
	this.$toggle.click(function(e) {
		this.$table.toggle();
		this.$summary.text(this.table.getOptionalValue());
	}.bind(this));
};

com.hiyoko.sweet.Battle.OptionalValues.prototype.getOptionalValue = function(col) {
	return this.table.getOptionalValue(col);
};

com.hiyoko.sweet.Battle.OptionalValues.COLS = {HIT:2, ATK:3, DODGE:4, VITALITY:5, MENTALITY:6};

com.hiyoko.sweet.Battle.OptionalValues.Table = function($html, cols) {
	this.$html = $($html);
	this.id = this.$html.attr('id');

	this.renderTable(cols);
	
	this.bindEvent();
};

com.hiyoko.util.extend(com.hiyoko.sweet.TableBase, com.hiyoko.sweet.Battle.OptionalValues.Table);

com.hiyoko.sweet.Battle.OptionalValues.Table.prototype.bindEvent = function(){
	this.$html.change(function(e) {
		
	}.bind(this));
};

com.hiyoko.sweet.Battle.OptionalValues.Table.prototype.getOptionalValue = function(opt_col) {
	var table = this.getTableValue();
	var adjustedValue = 0;
	var text = [];
	var detail = '';

	var col = opt_col || 3;
	
	table.forEach(function(l) {
		if(l[0]) {
			text.push(l[1]);
			var val = Number(l[col]);
			adjustedValue += val;
			if(val < 0) {
				detail += '\n　' + l[1] + '　' + Number(l[col]);
			} else {
				detail += '\n　' + l[1] + '　+' + Number(l[col]);
			}
			
		}
	});

	if(opt_col) {
		return {
			value: (adjustedValue < 0 ? String(adjustedValue) : '+' + adjustedValue),
			text: text.join(', '),
			detail: detail
		};
	} else {
		return text.join(',');
	}
};

