var com = com || {};
com.hiyoko = com.hiyoko || {};
com.hiyoko.sweet = com.hiyoko.sweet || {};
com.hiyoko.sweet.Battle = com.hiyoko.sweet.Battle || {};
com.hiyoko.sweet.Battle.CharacterOptionalValues = class extends com.hiyoko.component.ApplicationBase {
	constructor($html, opt={}) {
		super($html, opt);
		this.buildDom();
		this.bindEvents();
	}

	buildDom() {
		this.$html.append(`<div id="${this.id}-body">aaaaaaaa</div>`);
		this.$html.append(`<div id="${this.id}-background"></div>`);
		this.body = this.getElementById('body');
		this.background = this.getElementById('background');
		this.disable();
	}

	bindEvents() {
		this.background.click((e)=>{this.disable();});
	}

	insertData(character, options) {
		this.body.empty();
		let $table = $(`<table id="${this.id}-body-table" border="1"></table>`);
		$table.append(
			`<tr id="${this.id}-body-table-header" class="${this.id}-body-table-header">
			<th></th>
			<th>${character.name}</th>
			${character.parts.map((p)=>{
				return `<td class="${this.id}-body-table-header-col">${p.name}</td>`
			}).join('')}
			</tr>`);
		options.forEach((o, i)=>{
			let $tr = $(`<tr class="${this.id}-body-table-member" id="${this.id}-body-table-member-${i}"></tr>`);
			$tr.append(`<td class="${this.id}-body-table-member-col ${this.id}-body-table-member-title">${o[1]}</td>`);
			$tr.append(
				`<td class="${this.id}-body-table-member-col ${this.id}-body-table-member-col-all">
				<input class="${this.id}-body-table-member-all-col-checkbox" id="${this.id}-body-table-member-all-col-checkbox-${i}" type="checkbox" />
				</td>`);
			character.parts.forEach((p, j)=> {
				$tr.append(
						`<td class="${this.id}-body-table-member-col" id="${this.id}-body-table-member-col-${i}-${j}">
						<input class="${this.id}-body-table-member-col-checkbox" id="${this.id}-body-table-member-col-checkbox-${i}-${j}" type="checkbox" />
						</td>`);
			});
			$table.append($tr);
		});
		this.body.append($table);
	}
};