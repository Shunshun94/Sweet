var com = com || {};
com.hiyoko = com.hiyoko || {};
com.hiyoko.sweet = com.hiyoko.sweet || {};
com.hiyoko.sweet.Battle = com.hiyoko.sweet.Battle || {};

com.hiyoko.sweet.Battle.CharacterLister = function($html) {
	this.$html = $($html);
	this.id = this.$html.attr('id');
	
	this.table = new com.hiyoko.sweet.Battle.CharacterLister.Table(this.getElementById('table'));
	
	this.getElementById('toggle').click(function(e){
		this.getElementById('table').toggle();
	}.bind(this));
};

com.hiyoko.util.extend(com.hiyoko.component.ApplicationBase, com.hiyoko.sweet.Battle.CharacterLister);

com.hiyoko.sweet.Battle.CharacterLister.Table = function($html) {
	this.$html = $($html);
	this.id = this.$html.attr('id');
	this.isSimpleTable = true;
	
	var cols = [{title:'魔物名', type:'auto'},
	            {title:'', type:'button', text:com.hiyoko.sweet.Battle.CharacterLister.Table.TEXT.USEDATA},
                {title:'', type:'button', text:com.hiyoko.sweet.Battle.CharacterLister.Table.TEXT.DELDATA}];
	this.fireEvent(this.getAsyncEvent('loadRequestAll').done(function(result){
		var arg = [];
		for(var key in result) {
			arg.push([key, '', '']);
		}
		this.renderTable(cols, arg);
	}.bind(this)));
	
	this.bindEvents();
};

com.hiyoko.util.extend(com.hiyoko.component.TableBase, com.hiyoko.sweet.Battle.CharacterLister.Table);

com.hiyoko.sweet.Battle.CharacterLister.Table.prototype.bindEvents = function() {
	this.$html.click(function(e) {
		var target = $(e.target);
		var text = target.val();
		
		if(target.is('input')) { 
			if(text === com.hiyoko.sweet.Battle.CharacterLister.Table.TEXT.USEDATA) {
				this.onAddClick(target);
			} else if(text === com.hiyoko.sweet.Battle.CharacterLister.Table.TEXT.DELDATA) {
				this.onDeleteClick(target);
			}			
		}
	}.bind(this));
};

com.hiyoko.sweet.Battle.CharacterLister.Table.prototype.onAddClick = function($clicked) {
	this.fireEvent({
		type: 'battleAddFromCharacterLister',
		name: $($clicked.parent().parent().children()[0]).text()
	});
};

com.hiyoko.sweet.Battle.CharacterLister.Table.prototype.onDeleteClick = function($clicked) {
	this.fireEvent({
		type: 'battleDeleteFromCharacterLister',
		name: $($clicked.parent().parent().children()[0]).text()
	});
	$clicked.parent().parent().remove();
};

com.hiyoko.sweet.Battle.CharacterLister.Table.TEXT = {
		USEDATA: 'このデータを利用する',
		DELDATA: '削除'
};
