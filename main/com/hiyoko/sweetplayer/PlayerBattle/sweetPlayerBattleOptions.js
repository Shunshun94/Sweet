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

	this.cols = [{title:'', type:'check'}, {title:'名称', type:'text'},
        {title:'命中', type:'number'}, {title:'追加 D', type:'number'},
        {title:'回避', type:'number'},
        {title:'生命抵抗', type:'number'}, {title:'精神抵抗', type:'number'},
        {title:'魔力', type:'number'}, {title:'威力', type:'number'},
        {title:'出目(2.5から)', type:'number'}];
	this.table = new com.hiyoko.sweet.PlayerBattle.OptionalValues.Table(
					this.$table, this.cols);
	this.bindEvent();
	this.updateTableStorage({value: this.table.getTableValue()});
};

com.hiyoko.util.extend(com.hiyoko.component.ApplicationBase, com.hiyoko.sweet.PlayerBattle.OptionalValues);

com.hiyoko.sweet.PlayerBattle.OptionalValues.prototype.updateTableStorage = function(e) {
	const list = e.value.map((d)=>{return d.slice(1).join(':')}).join(';');
	this.getElementById('export').val(`${location.origin}${location.pathname}?PlayerBattleOptions=${list}`);	
};

com.hiyoko.sweet.PlayerBattle.OptionalValues.prototype.getAllOptionValues = function() {
	let result = [];
	for(var i = 2; i < this.cols.length; i++) {
		const val = this.table.getOptionalValue(i).value;
		if(val !== '+0') {
			result.push({
				title: this.cols[i].title,
				val: val,
				text: `${this.cols[i].title.replace('(2.5から)', '')}:${val}`
			});
		}
	}
	return result;
};

com.hiyoko.sweet.PlayerBattle.OptionalValues.prototype.bindEvent = function(){
	this.$html.change((e)=>{
		const str = this.table.getOptionalValue();
		const editedList = this.getAllOptionValues();
		if(editedList.length) {
			this.$summary.text(`${str} (${editedList.map((v)=>{return v.text}).join(', ')})`);
		} else {
			this.$summary.text(str);
		}
	});
	this.$toggle.click(function(e) {
		this.$table.toggle(400);
		this.getElementById('exportbase').toggle(400); 
	}.bind(this));
	this.$html.on('setStorage', (e)=>{
		this.updateTableStorage(e);
	});
	this.getElementById('exportcopy').click((e)=>{
		this.getElementById('export').select();
		document.execCommand('copy');
		alertify.success('修正値表エクスポート用の URL をコピーしました。このURLを共有することで他の人に修正値表のデータを共有できます');
	});
};

com.hiyoko.sweet.PlayerBattle.OptionalValues.prototype.getOptionalValue = function(col) {
	return this.table.getOptionalValue(col);
};

com.hiyoko.sweet.PlayerBattle.OptionalValues.COLS = {HIT:2, ATK:3, DODGE:4, VITALITY:5, MENTALITY:6, RATE:7};

com.hiyoko.sweet.PlayerBattle.OptionalValues.Table = function($html, cols) {
	this.$html = $($html);
	this.id = this.$html.attr('id');

	this.renderTable(cols);

	this.bindEvent();
};

com.hiyoko.util.extend(com.hiyoko.component.TableBase, com.hiyoko.sweet.PlayerBattle.OptionalValues.Table);

com.hiyoko.sweet.PlayerBattle.OptionalValues.Table.prototype.bindEvent = function(){};

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

