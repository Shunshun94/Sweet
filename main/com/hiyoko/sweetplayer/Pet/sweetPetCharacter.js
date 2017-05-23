var com = com || {};
com.hiyoko = com.hiyoko || {};
com.hiyoko.sweet = com.hiyoko.sweet || {};
com.hiyoko.sweet.Pet || com.hiyoko.sweet.Pet || {};

com.hiyoko.sweet.Pet.Character = function($html, data, partsCandidates) {
	this.$html = $html;
	this.id = this.$html.attr('id');
	
	this.data = data;
	this.partsCandidates = partsCandidates;
	this.buildComponents();
};

com.hiyoko.util.extend(com.hiyoko.component.ApplicationBase, com.hiyoko.sweet.Pet.Character);

com.hiyoko.sweet.Pet.Character.prototype.buildComponents = function() {
	this.getElementById('name').text(this.data.name);
	this.partsList = new com.hiyoko.sweet.Pet.PartsList(this.getElementById('partsCandidates'), this.partsCandidates);
};






com.hiyoko.sweet.Pet.Character.render = function(idNo) {
	var $base = $('<div></div>')
	var id = this.id + '-character-' + idNo;
	var clazz = this.id + '-character';
	
	$base.addClass(clazz);
	$base.attr('id', id);
	
	$base.append(com.hiyoko.util.format('<button class="%s" id="%s">コマ追加</button>', clazz + '-append', id + '-append'));
	$base.append(com.hiyoko.util.format('<p>名前： <span class="%s" id="%s"></span></p>', clazz + '-name', id + '-name'));
	
	$base.append(com.hiyoko.util.format('<button class="%s" id="%s">生命抵抗判定</button>', clazz + '-physical', id + '-physical'));
	$base.append(com.hiyoko.util.format('<button class="%s" id="%s">精神抵抗判定</button>', clazz + '-mental', id + '-mental'));
	
	$base.append(com.hiyoko.util.format('<select class="%s" id="%s"></select>', clazz + '-partsCandidates', id + '-partsCandidates'));
	$base.append(com.hiyoko.util.format('<button class="%s" id="%s">部位追加</button>', clazz + '-appendParts', id + '-appendParts'));
	
	return $base;
};