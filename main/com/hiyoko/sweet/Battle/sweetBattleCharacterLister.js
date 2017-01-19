var com = com || {};
com.hiyoko = com.hiyoko || {};
com.hiyoko.sweet = com.hiyoko.sweet || {};
com.hiyoko.sweet.Battle = com.hiyoko.sweet.Battle || {};

com.hiyoko.sweet.Battle.CharacterLister = function($html) {
	this.$html = $($html);
	this.id = this.$html.attr('id');
	this.isSimpleTable = true;
	
	var cols = [{title:'魔物名', type:'auto'},
	            {title:'', type:'button', text:'このデータを利用する'},
                {title:'', type:'button', text:'削除'}];
	
	var event = this.getAsyncEvent('loadRequestAll');
	event.done(function(result){
		var arg = [];
		for(var key in result) {
			arg.push([key, '', '']);
		}
		this.renderTable(cols, arg);
	}.bind(this));
	this.fireEvent(event);
	
};

com.hiyoko.util.extend(com.hiyoko.sweet.TableBase, com.hiyoko.sweet.Battle.CharacterLister);