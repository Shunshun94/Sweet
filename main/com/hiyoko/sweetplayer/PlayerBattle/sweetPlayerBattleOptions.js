var com = com || {};
com.hiyoko = com.hiyoko || {};
com.hiyoko.sweet = com.hiyoko.sweet || {};
com.hiyoko.sweet.PlayerBattle = com.hiyoko.sweet.PlayerBattle || {};

com.hiyoko.sweet.PlayerBattle.OptionalValues = function($html, opt_conf) {
	this.$html = $($html);
	this.id = this.$html.attr('id');
	
	this.$table = this.getElementById('table');
	this.$toggle = this.getElementById('toggle');
	this.$summary = this.getElementById('summary');

	this.table = new com.hiyoko.sweet.PlayerBattle.OptionalValues.Table(
					this.$table,
					[{title:'', type:'check'}, {title:'名称', type:'text'},
	                 {title:'命中', type:'number'}, {title:'追加 D', type:'number'}, {title:'回避', type:'number'},
	                 {title:'生命抵抗', type:'number'}, {title:'精神抵抗', type:'number'}, {title:'魔力', type:'number'}]);
	
	this.bindEvent();
};

com.hiyoko.util.extend(com.hiyoko.component.ApplicationBase, com.hiyoko.sweet.PlayerBattle.OptionalValues);

com.hiyoko.sweet.PlayerBattle.OptionalValues.prototype.bindEvent = function(){
	this.$toggle.click(function(e) {
		this.$table.toggle(400);
		this.$summary.text(this.table.getOptionalValue());
	}.bind(this));
};

com.hiyoko.sweet.PlayerBattle.OptionalValues.prototype.getOptionalValue = function(col) {
	return this.table.getOptionalValue(col);
};

com.hiyoko.sweet.PlayerBattle.OptionalValues.COLS = {HIT:2, ATK:3, DODGE:4, VITALITY:5, MENTALITY:6};

com.hiyoko.sweet.PlayerBattle.OptionalValues.Table = function($html, cols) {
	this.$html = $($html);
	this.id = this.$html.attr('id');

	this.renderTable(cols);
	
	this.bindEvent();
};

com.hiyoko.util.extend(com.hiyoko.component.TableBase, com.hiyoko.sweet.PlayerBattle.OptionalValues.Table);

com.hiyoko.sweet.PlayerBattle.OptionalValues.Table.prototype.bindEvent = function(){
	this.$html.change(function(e) {
		
	}.bind(this));
};

com.hiyoko.sweet.PlayerBattle.OptionalValues.Table.prototype.getOptionalValue = function(opt_col) {
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

