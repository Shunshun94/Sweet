var com = com || {};
com.hiyoko = com.hiyoko || {};
com.hiyoko.sweet = com.hiyoko.sweet || {};
com.hiyoko.sweet.Pet || com.hiyoko.sweet.Pet || {};

com.hiyoko.sweet.Pet.PartsList = function($html, partsCandidate) {
	this.$html = $html;
	this.id = this.$html.attr('id');
	
	partsCandidate.forEach(function(v, i) {
		this.$html.append(com.hiyoko.util.format('<option value="%s">%s</option>', i, v.name));
	}.bind(this));
};

com.hiyoko.util.extend(com.hiyoko.component.ApplicationBase, com.hiyoko.sweet.Pet.PartsList);

com.hiyoko.sweet.Pet.PartsList.prototype.getId = function() {
	return this.$html.val();
};