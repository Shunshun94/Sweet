var com = com || {};
com.hiyoko = com.hiyoko || {};
com.hiyoko.sweet = com.hiyoko.sweet || {};
com.hiyoko.sweet.Battle = com.hiyoko.sweet.Battle || {};
com.hiyoko.sweet.Battle.CharacterOptionalValues = class extends com.hiyoko.component.ApplicationBase {
	constructor($html, opt={}) {
		super($html, opt);
		this.callback = console.log;
		this.nameList = [];
		this.buildDom();
		this.bindEvents();
	}

	buildDom() {
		this.$html.append(`<div id="${this.id}-body"></div>`);
		this.$html.append(`<div id="${this.id}-background"></div>`);
		this.body = this.getElementById('body');
		this.background = this.getElementById('background');
		this.disable();
	}

	bindEvents() {
		this.background.click((e)=>{this.disable()});
		this.$html.change((e) => {
			const $dom = $(e.target);
			if($dom.hasClass(`${this.id}-body-table-member-all-col-checkbox`)) {
				this.changeByCharacter(e);
			}
		});
		this.body.click((e)=>{
			const $dom = $(e.target);
			if($dom.attr('id') === `${this.id}-body-decide`) {
				this.callback(this.getValues(), this.nameList);
				this.disable();
			}
		})
	}

	enable(opt_time = 0, opt_rollback) {
		this.callback = opt_rollback || console.log;
		this.setEnable(true, opt_time);
	}

	changeByCharacter(e) {
		const $dom = $(e.target);
		const optionIndex = $dom.attr('id').split('-').pop();
		$(`.${this.id}-body-table-member-col-checkbox-${optionIndex}`).prop('checked', $dom.prop('checked'));
	}
	
	getValues() {
		const $doms = $(`.${this.id}-body-table-member-col-checkbox`);
		let result = [];
		$doms.each((i, dom) => {
			const $dom =  $(dom);
			const ids = $dom.attr('id').split('-').reverse();
			if(! result[Number(ids[0])]) {
				result[Number(ids[0])] = [];
			}
			if($dom.prop('checked')) {
				result[Number(ids[0])].push(Number(ids[1]));
			}
		});
		return result;
	}

	insertData(character, options, optionStatus) {
		this.body.empty();
		this.nameList = [];
		let $table = $(`<table id="${this.id}-body-table" border="1"></table>`);
		$table.append(
			`<tr id="${this.id}-body-table-header" class="${this.id}-body-table-header">
			<th class="${this.id}-body-table-header-col ${this.id}-body-table-header-empty"></th>
			<th class="${this.id}-body-table-header-col ${this.id}-body-table-header-characterName">${character.name}</th>
			${character.parts.map((p)=>{
				return `<td class="${this.id}-body-table-header-col ${this.id}-body-table-header-partsName">${p.name}</td>`
			}).join('')}
			</tr>`);
		options.forEach((o, i)=>{
			this.nameList.push(o[1]);
			let $tr = $(`<tr class="${this.id}-body-table-member" id="${this.id}-body-table-member-${i}"></tr>`);
			$tr.append(`<td class="${this.id}-body-table-member-col ${this.id}-body-table-member-title">${o[1]}</td>`);
			$tr.append(
				`<td class="${this.id}-body-table-member-col ${this.id}-body-table-member-col-all">
				<input 	class="${this.id}-body-table-member-all-col-checkbox"
						id="${this.id}-body-table-member-all-col-checkbox-${i}"
						${optionStatus.character.includes(i) ? ' checked ' : ' '}
						type="checkbox" />
				</td>`);
			character.parts.forEach((p, j)=> {
				$tr.append(
						`<td class="${this.id}-body-table-member-col" id="${this.id}-body-table-member-col-${i}-${j}">
						<input 	class="${this.id}-body-table-member-col-checkbox ${this.id}-body-table-member-col-checkbox-${i}"
								id="${this.id}-body-table-member-col-checkbox-${i}-${j}"
								${optionStatus.parts[j].includes(i) ? ' checked ' : ' '}
								type="checkbox" />
						</td>`);
			});
			$table.append($tr);
		});
		this.body.append($table);
		this.body.append(`<button id="${this.id}-body-decide">決定</button>`);
	}
};