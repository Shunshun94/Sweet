com.hiyoko = com.hiyoko || {};
com.hiyoko.sweet = com.hiyoko.sweet || {};
com.hiyoko.sweet.PlayerEntrance = com.hiyoko.sweet.PlayerEntrance = class extends io.github.shunshun94.HiyokoCross.Entrance {
	constructor($html) {
		super($html);
	}
	getSheetId() {
		return this.getElementById('sheet-input').val();
	}
	buildTofUrl(e) {
		document.location = `./player.html?platform=tof&sheetId=${this.getSheetId()}&url=${e.value.url}&room=${e.value.room.no}&pass=${e.value.password.password}`;
	}
	buildDiscordUrl(e) {
		document.location = `./player.html?platform=discord&system=SwordWorld2.0&sheetId=${this.getSheetId()}&url=${e.value.url}&room=${e.value.room}&dicebot=${e.value.dicebot}`
	}
	buildDummyUrl(e) {
		document.location = `./player.html?platform=dummy&system=SwordWorld2.0&sheetId=${this.getSheetId()}&dicebot=${this.getElementById('dummy-bcdice-url').val()}`;
	}
	buildDom() {
		this.$html.empty();
		this.$html.append(`<button id="${this.id}-init">シート URL から入力しなおす</button><hr/>`);

		let buttons = '';
		for(var key in io.github.shunshun94.HiyokoCross.Entrance.PLATFORMS) {
			const platform = io.github.shunshun94.HiyokoCross.Entrance.PLATFORMS[key];
			buttons += 	`<button id="${this.id}-sheet-${key}"><span class="${this.id}-sheet-button-label">${platform.label}</span><br/>` +
						`　　<span class="${this.id}-sheet-button-text">${platform.text}</span></button><br/>`;
		}

		this.$html.append(
			`<div id="${this.id}-sheet">` +
			'<p><a href="https://charasheet.vampire-blood.net/">キャラクター保管所</a>で作成したキャラクターの ID を入力してください<br/>' +
			'例<br/>　　https://charasheet.vampire-blood.net/116063 なら <strong>116063</strong></p>' +
			`<p>キャラクターシートの ID： <input list="${this.id}-sheet-list" id="${this.id}-sheet-input" type="text" /></p>` +
			`<datalist id="${this.id}-sheet-list"></datalist>` + buttons + '</div>'
		);
		this.$html.append(
				`<div id="${this.id}-tof">` +
				`<div id="${this.id}-tof-url"><h2>使うどどんとふを選択してください</h2>`+
				`<div id="${this.id}-tof-url-StaticInput"><h3>リストから選択</h3>` +
				`<select id="${this.id}-tof-url-StaticInput-List"></select><br/>` +
				`<button id="${this.id}-tof-url-StaticInput-Hide">URL を手入力する場合はこちらから</button></div>` +
				`<div id="${this.id}-tof-url-FreeInput"><h3>URL を手入力</h3>` +
				`<input type="text" id="${this.id}-tof-url-FreeInput-Url" /><br/>` +
				`<button id="${this.id}-tof-url-FreeInput-Hide">リストから選択する場合はこちらから</button>` +
				`</div><br/><button id="${this.id}-tof-url-Next">次へ</button></div>` +
				`<div id="${this.id}-tof-room"><button id="${this.id}-tof-room-back">戻る</button>` +
				`<div id="${this.id}-tof-room-list"></div></div>` +
				`<div id="${this.id}-tof-password"><button id="${this.id}-tof-password-back">戻る</button><br/>` +
				`入室パスワード<input id="${this.id}-tof-password-password" type="text" /><br/>` +
				`<button id="${this.id}-tof-password-next">次へ</button></div>` +
				`<div id="${this.id}-tof-option">` +
				`<button id="${this.id}-tof-option-back">戻る</button><br/>` +
				`<button id="${this.id}-tof-option-next">入力完了</button>` +
				`</div></div>`
		);
		this.$html.append(`<div id="${this.id}-discord"></div>`);
		this.$html.append(	`<div id="${this.id}-dummy"><div id="${this.id}-dummy-bcdice">`+
							`<p>BCDice-API についてはこちら： <a href="https://github.com/ysakasin/bcdice-api/blob/master/README.md">bcdice-api/README.md at master · ysakasin/bcdice-api</a></p>` +
							`<p>BCDiceAPI の URL：` +
							`<input list="${this.id}-dummy-bcdice-list" placeholder="https://www.example.com/bcdice-api" id="${this.id}-dummy-bcdice-url" type="text" />` +
							`<button id="${this.id}-dummy-bcdice-next">入力完了</button>` +
							`<datalist id="${this.id}-dummy-bcdice-list"></datalist></div></div>`);
		this.getElementById('init').hide();
		
		this.getElementById('tof-url-FreeInput').hide();
		this.getElementById('tof').hide();

		this.getElementById('dummy').hide();
		const list = JSON.parse(localStorage.getItem(io.github.shunshun94.trpg.discord.Entrance.BCDice.UrlList) || '[]');
		this.getElementById('dummy-bcdice-list').append(list.map((url) => {
			return `<option value="${url}"></option>`;
		}).join(''));

		this.getElementById('discord').hide();

		this.getElementById('sheet > button').hide();
		com.hiyoko.util.forEachMap(JSON.parse(localStorage.getItem('com-hiyoko-sw2-player-entrance-option-sheetId-list') || '{}'), (v, k) => {
			$(`#${this.id}-sheet-list`).append(`<option value="${k}">${v}</option>`);
		});
	}
}