var com = com || {};
com.hiyoko = com.hiyoko || {};
com.hiyoko.sweet = com.hiyoko.sweet || {};

com.hiyoko.sweet.AppList = function($html, apps, opt_platform) {
	this.$html = $html;
	this.id = $html.attr('id');
	this.$menu = this.getElementById('list');

	this.apps = apps;

	this.buildList(opt_platform || false);
	this.bindEvents();
	
	if(this.apps.length <= 1) {
		this.disable();
	}
};
com.hiyoko.util.extend(com.hiyoko.component.ApplicationBase, com.hiyoko.sweet.AppList);

com.hiyoko.sweet.AppList.prototype.activateSelectedItem = function(num) {
	this.getElementsByClass('list-item').removeClass('active');
	$(this.getElementsByClass('list-item')[num]).addClass('active');
};

com.hiyoko.sweet.AppList.prototype.isActivePlatform = (platform, component) => {
	if(component.ACTIVE_PLATFORMS) {
		return component.ACTIVE_PLATFORMS.includes(platform);
	} else {
		return true;
	}
};

com.hiyoko.sweet.AppList.prototype.buildList = function(platform){
	this.apps.forEach((v, i) => {
		var dom = $(
				com.hiyoko.util.format('<li title="%s" class="%s-list-item">%s</li>', i, this.id, v.LIST_NAME)		
		);
		if(this.isActivePlatform(platform, v)) {
			this.$menu.append(dom);
		}
	});
};

com.hiyoko.sweet.AppList.prototype.bindEvents = function() {
	this.$menu.click(function(e){
		if($(e.target).hasClass(this.id + '-list-item')){
			this.fireEvent(new $.Event('clickMenu', {num:$(e.target).attr('title')}));
		}
	}.bind(this));
};

