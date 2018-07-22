var com = com || {};
com.hiyoko = com.hiyoko || {};
com.hiyoko.sweet = com.hiyoko.sweet || {};
com.hiyoko.sweet.RoomList = class extends com.hiyoko.component.ApplicationBase {
	constructor($html, opt = {list:[]}) {
		super($html, opt);
		this.suffix = opt.suffix || '';
		this.buildDom(opt.list);
		this.buildEvent();
	}

	buildDom(list) {
		this.$html.append(`<p>最近使った部屋</p>`);
		this.$html.append(`<span id="${this.id}-close">×</span>`);
		list.slice(1, 10).forEach((v) => {
			let room = $(`<div class="${this.id}-item" title="${v.url}"></div>`);
			room.text(v.name);
			this.$html.append(room);
		});
	}

	buildEvent() {
		this.getElementsByClass('item').click((e) => {
			location.href = `${location.origin + location.pathname}${$(e.target).attr('title')}${this.suffix}`;
		});
		this.getElementById('close').click((e) => {
			this.toggle();
		});
	}

	toggle() {
		this.$html.toggle(100);
	}
};

com.hiyoko.sweet.RoomList.indexOf = (list, search = location.search) => {
	for(var i = 0; i < list.length; i++) {
		if(list[i].url === search) {
			return i;
		}
	}
	return -1;
};
com.hiyoko.sweet.RoomList.updateList = (list, name, search = location.search) => {
	const currentIndex = com.hiyoko.sweet.RoomList.indexOf(list, search);
	if(currentIndex !== -1) {
		list = list.filter((v) => {
			return v.url !== search;
		});
	}
	list.unshift({
		url: search,
		name: name
	});
	return list.slice(0, 10);
};