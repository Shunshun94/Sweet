var com = com || {};
com.hiyoko = com.hiyoko || {};
com.hiyoko.sweet = com.hiyoko.sweet || {};
com.hiyoko.sweet.PcManager = function($html) {
	this.$html = $html;
	this.id = $html.attr('id');

	var $pcs = this.getElementById('pcs');

	this.pcManager = new com.hiyoko.sweet.PcManager.PcManager($pcs);
	this.getElementById('toggle').click(function(e) {
		$pcs.toggle(500);
	});
};
com.hiyoko.util.extend(com.hiyoko.component.ApplicationBase, com.hiyoko.sweet.PcManager);

com.hiyoko.sweet.PcManager.PcManager = function($html) {
	this.$html = $html;
	this.id = $html.attr('id');
	this.manager = new io.github.shunshun94.trpg.CharacterManager(this.$html);

	this.bindEvents();
	this.buildComponent();
};

com.hiyoko.util.extend(com.hiyoko.component.ApplicationBase, com.hiyoko.sweet.PcManager.PcManager);
com.hiyoko.sweet.PcManager.PcManager.SheetIdListKey = 'com-hiyoko-sw2-player-entrance-option-sheetId-list';

com.hiyoko.sweet.PcManager.PcManager.prototype.buildComponent = function() {
	this.prepare = new com.hiyoko.sweet.PcManager.PcManager.Prepare(this.getElementById('prepare'));
	this.console = new com.hiyoko.sweet.PcManager.PcManager.Console(this.getElementById('manager'));
};

com.hiyoko.sweet.PcManager.PcManager.prototype.bindEvents = function() {
	this.$html.on(com.hiyoko.sweet.PcManager.PcManager.Prepare.EVENTS.GET, function(e) {
		e.resolve(this.loadSheetIdList());
	}.bind(this));
	this.$html.on(com.hiyoko.sweet.PcManager.PcManager.Prepare.EVENTS.PUT, function(e) {
		e.resolve(this.saveSheetIdList(e.id, e.name));
	}.bind(this));
	this.$html.on(com.hiyoko.sweet.PcManager.PcManager.Prepare.EVENTS.EXEC, function(e) {
		this.manager.appendCharacters(e.sheets).then(function(characterList) {
			this.prepare.disable();
			characterList = characterList.map((d, i) => {
				d.id = e.sheets[i];
				return d;
			});
			this.console.insertCharacters(characterList);
			this.console.enable();
		}.bind(this), function(failedReason) {
			alert(failedReason);
		});
	}.bind(this));
	this.$html.on(com.hiyoko.sweet.PcManager.PcManager.Console.EVENTS.UPDATE, function(e) {
		this.manager.getCharacters(e.sheets).then(function(characterList) {
			this.console.insertCharacters(characterList);
		}.bind(this), function(failedReason) {
			alert(failedReason);
		});
	}.bind(this));
	this.$html.on(com.hiyoko.sweet.PcManager.PcManager.Console.EVENTS.PUT, function(e) {
		this.saveSheetIdList(e.id, e.name);
	}.bind(this));
};

com.hiyoko.sweet.PcManager.PcManager.prototype.loadSheetIdList = function() {
	return JSON.parse(localStorage.getItem(com.hiyoko.sweet.PcManager.PcManager.SheetIdListKey)) || {};
};

com.hiyoko.sweet.PcManager.PcManager.prototype.saveSheetIdList = function(id, name) {
	var data = this.loadSheetIdList();
	data[id] = name;
	localStorage.setItem(com.hiyoko.sweet.PcManager.PcManager.SheetIdListKey, JSON.stringify(data));
	return data;
};

com.hiyoko.sweet.PcManager.PcManager.Prepare = function($html) {
	this.$html = $html;
	this.id = $html.attr('id');
	
	this.buildComponents();
	this.getElementById('exec').click(this.onExec.bind(this));
	this.$html.on('change', this.onInputBoxChange.bind(this));
};
com.hiyoko.util.extend(com.hiyoko.component.ApplicationBase, com.hiyoko.sweet.PcManager.PcManager.Prepare);

com.hiyoko.sweet.PcManager.PcManager.Prepare.prototype.onExec = function(e) {
	var list = [];
	this.getElementsByClass('id').each(function(i, v) {
		list.push($(this).val());
	});
	list = list.filter(function(v){return Number(v) || v.startsWith('http')}).filter(function (x, i, self) {return self.indexOf(x) === i;});
	this.fireEvent(new $.Event(com.hiyoko.sweet.PcManager.PcManager.Prepare.EVENTS.EXEC, {
		// https://qiita.com/cocottejs/items/7afe6d5f27ee7c36c61f
		sheets: list
	}));
};

com.hiyoko.sweet.PcManager.PcManager.Prepare.prototype.onInputBoxChange = function(e) {
	var $target = $(e.target);
	var text = $target.val();
	
	// もう少し効率的な書き方ができると思うけど疲れている時に書いたので後で考える
	if($target.hasClass(this.id + '-id-last')) {
		if(text.length > 0) {
			$target.css(
					'background-color',
					io.github.shunshun94.util.Color.HslToRgb((Number(text) % 360), 100, 80).code);
			this.appendNewInputBox();
		}
		return;
	}
	if($target.hasClass(this.id + '-id')) {
		if(text.length === 0) {
			$target.remove();				
		} else {
			$target.css(
					'background-color',
					io.github.shunshun94.util.Color.HslToRgb((Number(text) % 360), 100, 80).code);	
		}			
	}
};

com.hiyoko.sweet.PcManager.PcManager.Prepare.prototype.getInputBox = function() {
	return com.hiyoko.util.format('<input autocomplete="on" class="%s-id %s-id-last" list="%s-characterList" type="text" />',
			this.id, this.id, this.id);
};

com.hiyoko.sweet.PcManager.PcManager.Prepare.prototype.appendNewInputBox = function() {
	this.getElementsByClass('id-last').removeClass(this.id + '-id-last');
	this.getElementById('characterList').before(this.getInputBox());
};

com.hiyoko.sweet.PcManager.PcManager.Prepare.prototype.buildComponents = function() {
	var dataListBuildEvent = this.getAsyncEvent(com.hiyoko.sweet.PcManager.PcManager.Prepare.EVENTS.GET).done(function(list) {
		var $list = this.getElementById('characterList');
		com.hiyoko.util.forEachMap(list, function(v, k) {
			$list.append(com.hiyoko.util.format('<option value="%s">%s</option>', k, v));
		});
		this.appendNewInputBox();
	}.bind(this));
	this.fireEvent(dataListBuildEvent);
};

com.hiyoko.sweet.PcManager.PcManager.Prepare.EVENTS = {
	GET: 'com-hiyoko-sweet-PcManager-Prepare-EVENTS-GET',
	PUT: 'com-hiyoko-sweet-PcManager-Prepare-EVENTS-PUT',
	EXEC:'com-hiyoko-sweet-PcManager-Prepare-EVENTS-EXEC'
};

com.hiyoko.sweet.PcManager.PcManager.Console = function($html) {
	this.$html = $html;
	this.id = $html.attr('id');
	this.sheets = [];
	this.colorTool = new io.github.shunshun94.util.Color.RateColor({
		100: 'white', 80: 'white', 50: 'cornsilk', 25: 'lightsalmon', 0:'#ff7f50'
	});
	this.$html.append(com.hiyoko.util.format('<button id="%s-update">更新</button>', this.id));
	this.getElementById('update').click(function(e) {
		this.fireEvent(new $.Event(com.hiyoko.sweet.PcManager.PcManager.Console.EVENTS.UPDATE, {sheets: this.sheets}));
	}.bind(this));
	this.disable();
};
com.hiyoko.util.extend(com.hiyoko.component.ApplicationBase, com.hiyoko.sweet.PcManager.PcManager.Console);

com.hiyoko.sweet.PcManager.PcManager.Console.prototype.generateCharacterDom = function(character) {
	var baseClass = com.hiyoko.util.format('%s-character', this.id)
	var $base = $(com.hiyoko.util.format('<div class="%s" style="color:white"></div>', baseClass));
	$base.css(
			'background-color',
			io.github.shunshun94.util.Color.HslToRgb((Number(character.id) % 360), 100, 20).code);
	$base.append(com.hiyoko.util.format('<span class="%s-name">%s</span><br/>', baseClass, character.name));
	var $hp = $(com.hiyoko.util.format('<span class="%s-hp">H <strong>%s / %s</strong></span>', baseClass, character.hp, character.mhp));
	$hp.css('color', this.colorTool.getColor(100 * Number(character.hp) / Number(character.mhp)).code);
	$base.append($hp);
	$base.append(com.hiyoko.util.format('<br/><span class="%s-mp">M <strong>%s / %s</strong></span><br/>', baseClass, character.mp, character.mmp));
	
	var skills = [];
	com.hiyoko.util.forEachMap(character.skills, function(v, k) {skills.push({lv: v, name: k});});
	$base.append(com.hiyoko.util.format('<span class="%s-skills">', baseClass) + skills.sort(function(a, b) {return b.lv - a.lv}).map(function(v) {
		return com.hiyoko.util.format('<span class="%s-skill">%s: %sLv</span>', baseClass, v.name, v.lv);
	}).join(' / ') + '</span>');
	
	return $base;
};

com.hiyoko.sweet.PcManager.PcManager.Console.prototype.insertCharacters = function(characters) {
	this.getElementsByClass('character').remove();
	this.sheets = characters;
	characters.forEach(function(character) {
		this.fireEvent(new $.Event(com.hiyoko.sweet.PcManager.PcManager.Console.EVENTS.PUT, {
			id: character.id, name: character.name
		}))
		this.getElementById('update').before(this.generateCharacterDom(character));
	}.bind(this));
};

com.hiyoko.sweet.PcManager.PcManager.Console.EVENTS = {
	UPDATE: 'com-hiyoko-sweet-PcManager-Console-EVENTS-update',
	PUT: 'com-hiyoko-sweet-PcManager-Console-EVENTS-put'
};