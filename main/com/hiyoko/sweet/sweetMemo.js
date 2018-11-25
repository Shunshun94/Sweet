var com = com || {};
com.hiyoko = com.hiyoko || {};
com.hiyoko.sweet = com.hiyoko.sweet || {};
com.hiyoko.sweet.Memo = class extends com.hiyoko.component.ApplicationBase {
	constructor($html, opt = {}) {
		super($html, opt);
		this.LIST_NAME = 'SWEET Handout - メモ閲覧';
		this.buildComponents();
		this.urls = [];
		this.bindEvents();
		
	}

	buildComponents(){
		this.$html.append(`<p id="${this.id}-header">
				<input type="text" id="${this.id}-url"
					value="https://character-sheets.appspot.com/scenario/"
					list="com-hiyoko-sweet-Memo-urlList" />
				<span class="${this.id}-header-button" id="${this.id}-jump">▼</span>
				<span class="${this.id}-header-button" id="${this.id}-web">🌎</span>
				<span class="${this.id}-header-button" id="${this.id}-memo">📝</span>
			</p>`);
		this.$html.append(`<datalist id="${this.id}-urlList"></datalist>`);
		this.$html.append(`<iframe src="https://character-sheets.appspot.com/scenario/" id="${this.id}-browser" />`);
		this.$html.append(`<textarea id="${this.id}-textmemo"></textarea>`);

		const urls = localStorage.getItem(com.hiyoko.sweet.Memo.URL_STORAGETS_KEY) || false;
		const urlList = this.getElementById('urlList'); 
		if(urls) {
			JSON.parse(urls).forEach((url) => {
				urlList.append(`<option value="${url}">${url}</option>`);
			});
		}
	}
	
	activateWebBrowser() {
		this.getElementById('browser').show(800);
		this.getElementById('textmemo').hide(800);
	}

	bindEvents() {
		this.getElementById('jump').click((e)=>{
			const url = this.getElementById('url').val();
			this.getElementById('browser').attr('src', url);
			if(this.urls.includes(url)) {
				this.urls = this.urls.filter((tmpurl)=>{return tmpurl !== url});
			}
			this.urls.unshift(url);
			if(this.urls.length > 10) {
				this.urls = this.urls.slice(this.urls - 10);
			}
			localStorage.setItem(com.hiyoko.sweet.Memo.URL_STORAGETS_KEY, JSON.stringify(this.urls));
			if(this.getElementById(`urlList > option[value="${url}"]`).length === 0) {
				this.getElementById('urlList').append(`<option value="${url}">${url}</option>`);
			}
		});
		this.getElementById('web').click((e)=>{
			this.activateWebBrowser();
		});
		this.getElementById('memo').click((e)=>{
			this.getElementById('browser').hide(800);
			this.getElementById('textmemo').show(800);
		});
	}
};

com.hiyoko.sweet.Memo.URL_STORAGETS_KEY = 'com-hiyoko-sweet-Memo-URL_STORAGETS_KEY';