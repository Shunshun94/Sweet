var com = com || {};
com.hiyoko = com.hiyoko || {};
com.hiyoko.sweet = com.hiyoko.sweet || {};

com.hiyoko.sweet.Discussion = function($html, opt_params){
	this.$html = $($html);
	this.LIST_NAME = 'SWEET Discussion';
	this.id = this.$html.attr('id');
	 
	this.memoId = '';
	
	this.buildComponents(this.$html);
	this.bindEvents();
};

com.hiyoko.util.extend(com.hiyoko.sweet.ApplicationBase, com.hiyoko.sweet.Discussion);

com.hiyoko.sweet.Discussion.prototype.buildComponents = function($html){
	this.disscussTable = new com.hiyoko.sweet.Discussion.Table(this.getElementById('options'));
};

com.hiyoko.sweet.Discussion.prototype.bindEvents  = function($html){
	
};

com.hiyoko.sweet.Discussion.Table = function($html) {
	this.id = $html.attr('id');
	this.$html = $html;
	
	this.bindEvents();
	this.onAddEvent();
	this.onAddEvent();
};

com.hiyoko.util.extend(com.hiyoko.sweet.ApplicationBase, com.hiyoko.sweet.Discussion.Table);

com.hiyoko.sweet.Discussion.Table.prototype.bindEvents = function() {
	this.getElementById('add').click(function(e){
		this.onAddEvent(e);
	}.bind(this));
	
	this.getElementById('apply').click(function(e){
		this.onApplyEvent(e);
	}.bind(this));
	
	this.getElementById('reset').click(function(e){
		this.onResetEvent(e);
	}.bind(this));
	
	this.$html.click(function(e){
		var $target = $(e.target);
		if($target.hasClass(this.id + '-option-delete')) {
			this.onDeleteEvent($target);
			return;
		}
	}.bind(this));
};

com.hiyoko.sweet.Discussion.Table.prototype.onAddEvent = function(e) {
	this.getElementsByClass('operation').before(
			$(	'<tr class="com-hiyoko-sweet-disscussion-options-option">' +
				'<td contenteditable="">-</td><td contenteditable=""></td><td contenteditable=""></td>'+
				'<td><button class="com-hiyoko-sweet-disscussion-options-option-delete">×</button></td></tr>')
	);
};

com.hiyoko.sweet.Discussion.Table.prototype.onDeleteEvent = function($target) {
	$target.parent().parent().remove();
};

com.hiyoko.sweet.Discussion.Table.prototype.onApplyEvent = function($target) {
	var event = this.getAsyncEvent('tofRoomRequest');
	
	var text = '';
	$.each(this.getElementsByClass('option'), function(i, v){
		var row = $(v).children();
		text += com.hiyoko.util.format(	'\n案%s %s\n●メリット\n%s\n●デメリット\n%s\n',
										(i+1),
										$(row[0]).html().replace(/<br\/?>/gmi, '\n'),
										$(row[1]).html().replace(/<br\/?>/gmi, '\n'),
										$(row[2]).html().replace(/<br\/?>/gmi, '\n')
										);		
	});
	
	event.args = [];
	event.args.push(text);
	event.args.push(this.memoId);
	event.method = 'updateMemo';
	console.log(event);
	this.fireEvent(event);
};

com.hiyoko.sweet.Discussion.Table.prototype.onResetEvent = function($target) {
	this.getElementsByClass('option').remove();
	this.onAddEvent();
	this.onAddEvent();
};






