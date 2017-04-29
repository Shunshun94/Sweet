var com = com || {};
com.hiyoko = com.hiyoko || {};
com.hiyoko.sweet = com.hiyoko.sweet || {};
com.hiyoko.sweet.CommonChecker = com.hiyoko.sweet.CommonChecker || {};

com.hiyoko.sweet.CommonChecker.OptionalValues = function($html, opt_conf) {
	this.$html = $($html);
	this.id = this.$html.attr('id');
	
	this.$table = this.getElementById('table');
	this.$toggle = this.getElementById('toggle');
	this.$summary = this.getElementById('summary');

	this.table = new com.hiyoko.sweet.CommonChecker.OptionalValues.Table(
					this.$table,
					[{title:'', type:'check'}, {title:'名称', type:'text'}, {title:'修正値', type:'number'}]);
	this.bindEvent();
};

com.hiyoko.util.extend(com.hiyoko.component.ApplicationBase, com.hiyoko.sweet.CommonChecker.OptionalValues);

com.hiyoko.sweet.CommonChecker.OptionalValues.prototype.bindEvent = function(){
	this.$toggle.click(function(e) {
		this.$table.toggle(400);
		this.$summary.text(this.table.getOptionalValue().text);
	}.bind(this));
};

com.hiyoko.sweet.CommonChecker.OptionalValues.prototype.getOptionalValue = function() {
	return this.table.getOptionalValue();
};

com.hiyoko.sweet.CommonChecker.OptionalValues.Table = function($html, cols) {
	this.$html = $($html);
	this.id = this.$html.attr('id');

	this.renderTable(cols);
	
	this.bindEvent();
};

com.hiyoko.util.extend(com.hiyoko.component.TableBase, com.hiyoko.sweet.CommonChecker.OptionalValues.Table);

com.hiyoko.sweet.CommonChecker.OptionalValues.Table.prototype.bindEvent = function(){
	this.$html.change(function(e) {
		
	}.bind(this));
};

com.hiyoko.sweet.CommonChecker.OptionalValues.Table.prototype.getOptionalValue = function() {
	var table = this.getTableValue();
	var adjustedValue = 0;
	var text = [];
	var detail = '';

	table.forEach(function(l) {
		if(l[0]) {
			text.push(l[1]);
			var val = Number(l[2]);
			adjustedValue += val;
			if(val < 0) {
				detail += '\n　' + l[1] + '　' + Number(l[2]);
			} else {
				detail += '\n　' + l[1] + '　+' + Number(l[2]);
			}
			
		}
	});

	return {
		value: (adjustedValue < 0 ? String(adjustedValue) : '+' + adjustedValue),
		text: text.join(', '),
		detail: detail
	};
};

