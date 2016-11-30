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
	this.saveData = new com.hiyoko.sweet.Accounting.SaveDataManager(this.getElementById('savedData'));
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
	
	this.getElementById('savedData').on('ApplyScenario', function(e) {
		this.detailIn.clear();
		e.inCost.forEach(function(l) {
			this.detailIn.addMember();
			this.detailIn.setLine(l);
		}.bind(this));
		this.detailOut.clear();
		e.outCost.forEach(function(l) {
			this.detailOut.addMember();
			this.detailOut.setLine(l);
		}.bind(this));
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

com.hiyoko.sweet.Accounting.SaveDataManager = function($html) {
	this.$html = $($html);
	this.id = this.$html.attr('id');
	
	this.toggler = this.getElementById('toggle');
	this.display = this.getElementById('display');
	this.list = this.getElementById('display-list');
	this.detail = this.getElementById('display-detail');
	this.apply = this.getElementById('display-apply');
	
	this.loadData();
	this.bindEvents();
};

com.hiyoko.util.extend(com.hiyoko.sweet.ApplicationBase, com.hiyoko.sweet.Accounting.SaveDataManager);

com.hiyoko.sweet.Accounting.SaveDataManager.prototype.bindEvents = function() {
	this.toggler.click(function(e) {
		this.display.toggle(300);
	}.bind(this));
	
	this.getElementsByClass('display-list-data').click(function(e){
		var $clicked = $(e.target);
		this.getElement('.active').removeClass('active');
		$clicked.addClass('active');
		var id = $clicked.attr('title');
		this.detail.text(com.hiyoko.sweet.Accounting.SaveDataManager.SampleScenario[id].detail);
	}.bind(this));
	
	this.apply.click(function(e) {
		var id = Number(this.getElement('.active').attr('title'));
		var event = new $.Event('ApplyScenario', com.hiyoko.sweet.Accounting.SaveDataManager.SampleScenario[id]);
		this.fireEvent(event);
	}.bind(this));
	
	
};

com.hiyoko.sweet.Accounting.SaveDataManager.prototype.loadData = function() {
	com.hiyoko.sweet.Accounting.SaveDataManager.SampleScenario.forEach(function(v, i) {
		var $li = $('<li></li>');
		
		$li.text(v.title);
		$li.addClass(this.id + '-display-list-data');
		$li.attr('title', i);
		
		this.list.append($li);
	}.bind(this));
};

com.hiyoko.sweet.Accounting.SaveDataManager.SampleScenario = [
{ 
	title: '基本的な使い方',
	detail: 'アイナ達一行はゴブリン退治の依頼をうけ、これを達成した。\n依頼料は1人400ガメル。ゴブリンが持っていた宝石3つ (1つ300ガメル相当) を道中で取得した。\n\n' +
		'かかった経費として、アイナがもっていたヒーリングポーションを2つ使い、\nソーサラーのケーンが3点の魔晶石を1つ消費した。',
	member: 4,
	inCost: [['依頼報酬', 400, 4, 1600], ['宝石', 300, 3, 900]],
	outCost: [['アイナ', 'ヒーリングポーション', 100, 2, 200], ['ケーン', '魔晶石(3点)', 300, 1, 300]]
}, { 
	title: 'アイテムで経費を補填する',
	detail: 'アルケミストのケインは戦闘で緑Aランクのカードを4枚消費した。\n' +
		'しかし、戦闘で松ヤニ (100G/緑A) を6個入手していたので、\n金ではなくこちらから4つを粗製のマテリアルカードにして補填とすることにした。\n',
	member: 1,
	inCost: [['松ヤニ', 100, 6, 400], ['松ヤニ', 100, -4, -400]],
	outCost: [['ケイン', '緑A', 200, 4, 800], ['ケイン', '松ヤニ (カードに加工済み)', -200, 4, -800]]
}/*
, { 
	title: '',
	detail: '',
	inCost: [[], []],
	outCost: [[], []]
}, { 
	title: '',
	detail: '',
	inCost: [[], []],
	outCost: [[], []]
}*/

];







