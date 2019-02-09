var com = com || {};
com.hiyoko = com.hiyoko || {};
com.hiyoko.sweet = com.hiyoko.sweet || {};
com.hiyoko.sweet.ResourceManage = com.hiyoko.sweet.ResourceManage || {};

com.hiyoko.sweet.ResourceManage.ResourceTable = function($html, data) {
	this.$html = $html;
	this.id = this.$html.attr('id');
	this.data = data;
	this.buildComponents();
	this.bindEvent();
};

com.hiyoko.util.extend(com.hiyoko.component.ApplicationBase, com.hiyoko.sweet.ResourceManage.ResourceTable);

com.hiyoko.sweet.ResourceManage.ResourceTable.prototype.buildComponents = function() {
	this.hpmp = new com.hiyoko.sweet.ResourceManage.ResourceTable.HPMP(this.getElementById('points'), this.data);
	this.remocon = new com.hiyoko.sweet.ResourceManage.ResourceTableRemoCon(this.getElementById('RemoCon'), this.data);
};

com.hiyoko.sweet.ResourceManage.ResourceTable.prototype.bindEvent = function() {
	this.remocon.$html.on(com.hiyoko.sweet.ResourceManage.ResourceTableRemoCon.APPLY_EVENT, function(e){
		this.hpmp.applyValueWithExtend(e.arg);
	}.bind(this));
	this.getElementById('shareAsText').click((e) => {
		var event = {type: 'tofRoomRequest', resolve:function(){
			alertify.success('HP/MP の情報が無事送信されました');
		}, reject:function(){
			alertify.error('HP/MP の情報送信に失敗しました');
		}};
		const value = this.hpmp.getValue();
		event.args = [{name: this.data.name, message: this.generateHPMPText(value)}];
		event.method = 'sendChat';
		this.fireEvent(event);
		alertify.message('HP/MP の情報を送信しています……');
	});
}

com.hiyoko.sweet.ResourceManage.ResourceTable.prototype.generateHPMPText = (value) =>{
	let extendedHp = '';
	if(value.EXTENDED_HP) {
		if(value.EXTENDED_HP > 0) {
			extendedHp = `+${value.EXTENDED_HP}`;
		} else {
			extendedHp = `${value.EXTENDED_HP}`;
		}
	}
	let additionalHp = '';
	if(value.ADDITIONAL_HP) {
		if(value.ADDITIONAL_HP > 0) {
			additionalHp = `+${value.ADDITIONAL_HP}`;
		} else {
			additionalHp = `${value.ADDITIONAL_HP}`;
		}
	}
	let extendedMhp = '';
	if(value.EXTENDED_MHP) {
		if(value.EXTENDED_MHP > 0) {
			extendedMhp = `+${value.EXTENDED_MHP}`;
		} else {
			extendedMhp = `${value.EXTENDED_MHP}`;
		}
	}
	let extendedMp = '';
	if(value.EXTENDED_MP) {
		if(value.EXTENDED_MP > 0) {
			extendedMp = `+${value.EXTENDED_MP}`;
		} else {
			extendedMp = `${value.EXTENDED_MP}`;
		}
	}
	let extendedMmp = '';
	if(value.EXTENDED_MMP) {
		if(value.EXTENDED_MMP > 0) {
			extendedMmp = `+${value.EXTENDED_MMP}`;
		} else {
			extendedMmp = `${value.EXTENDED_MMP}`;
		}
	}

	return `HP:${value.HP}${extendedHp}${additionalHp}/${value.MHP}${extendedMhp}　MP:${value.MP}${extendedMp}/${value.MMP}${extendedMmp}`;
};

com.hiyoko.sweet.ResourceManage.ResourceTable.HPMP = function($html, data) {
	this.$html = $html;
	this.id = this.$html.attr('id');
	this.data = data;

	this.getElementById('hp').val(data.hp);
	this.getElementById('mhp').val(data.hp);
	this.getElementById('mp').val(data.mp);
	this.getElementById('mmp').val(data.mp);

	this.bindEvents();
};

com.hiyoko.util.extend(com.hiyoko.component.ApplicationBase, com.hiyoko.sweet.ResourceManage.ResourceTable.HPMP);

com.hiyoko.sweet.ResourceManage.ResourceTable.HPMP.prototype.bindEvents = function() {
	this.$html.change(this.update.bind(this));
	this.getElementById('hp-full').click((e) => {
		let value = this.getValue();
		if(value.EXTENDED_MHP > 0) {
			value.HP = value.MHP;
			value.EXTENDED_HP = value.EXTENDED_MHP;
		} else {
			value.HP = value.MHP + value.EXTENDED_MHP;
			value.EXTENDED_HP = 0;
		}
		this.setValue(value);
	});
	this.getElementById('mp-full').click((e) => {
		let value = this.getValue();
		if(value.EXTENDED_MMP > 0) {
			value.MP = value.MMP;
			value.EXTENDED_MP = value.EXTENDED_MMP;
		} else {
			value.MP = value.MMP + value.EXTENDED_MMP;
			value.EXTENDED_MP = 0;
		}
		this.setValue(value);
	});
};

com.hiyoko.sweet.ResourceManage.ResourceTable.HPMP.prototype.update = function() {
	this.fireEvent({
		type: com.hiyoko.sweet.ResourceManage.ResourceTable.HPMP.UPDATE_EVENT,
		params: this.getValue()
	});
};

com.hiyoko.sweet.ResourceManage.ResourceTable.HPMP.prototype.getValue = function() {
	return {
		targetName: this.data.name,
		HP: Number(this.getElementById('hp').val()),
		EXTENDED_HP: Number(this.getElementById('hp-extend-1').val()),
		ADDITIONAL_HP: Number(this.getElementById('hp-extend-2').val()),
		MHP: Number(this.getElementById('mhp').val()),
		EXTENDED_MHP: Number(this.getElementById('mhp-extend').val()),
		MP: Number(this.getElementById('mp').val()),
		EXTENDED_MP: Number(this.getElementById('mp-extend').val()),
		MMP: Number(this.getElementById('mmp').val()),
		EXTENDED_MMP: Number(this.getElementById('mmp-extend').val()),
	};
};

com.hiyoko.sweet.ResourceManage.ResourceTable.HPMP.prototype.applyValueWithExtend = function(damage) {
	let value = this.getValue();
	if(damage.hpDamage) {
		let addedDamage = damage.hpDamage;
		const reduceDamage = damage.hpGuard;
		
		// ホリブレ処理
		if(value.ADDITIONAL_HP > 0) {
			if(addedDamage > value.ADDITIONAL_HP) {
				addedDamage -= value.ADDITIONAL_HP;
				value.ADDITIONAL_HP = 0;
			} else {
				value.ADDITIONAL_HP -= addedDamage;
				addedDamage = 0;
			}
		}
		addedDamage = Math.max(addedDamage - reduceDamage, 0);
		
		// バータフ処理
		if(value.EXTENDED_HP > 0) {
			if(addedDamage > value.EXTENDED_HP) {
				addedDamage -= value.EXTENDED_HP;
				value.EXTENDED_HP = 0;
			} else {
				value.EXTENDED_HP -= addedDamage;
				addedDamage = 0;
			}
		}
		if(addedDamage > 0) {
			value.HP -= addedDamage;
		}
	}
	if(damage.mp) {
		let mpDamage = damage.mp;
		
		// その他の MP 増強手段処理
		if(value.EXTENDED_MP > 0) {
			if(mpDamage > value.EXTENDED_MP) {
				mpDamage -= value.EXTENDED_MP;
				value.EXTENDED_MP = 0;
			} else {
				value.EXTENDED_MP -= mpDamage;
				mpDamage = 0;
			}
		}
		if(mpDamage) {
			value.MP -= mpDamage;
		}
	}
	this.setValue(value);
};

com.hiyoko.sweet.ResourceManage.ResourceTable.HPMP.prototype.applyValue = function(value) {
	if(value.hp) {
	 	this.getElementById('hp').val(Number(this.getElementById('hp').val()) - value.hp);
	}
	
	if(value.mp) {
		this.getElementById('mp').val(Number(this.getElementById('mp').val()) - value.mp);
	}
	
	this.$html.change();
};

com.hiyoko.sweet.ResourceManage.ResourceTable.HPMP.prototype.setValue = function(value) {
 	this.getElementById('hp').val(value.hp || value.HP);
	this.getElementById('hp-extend-1').val(value.EXTENDED_HP);
	this.getElementById('hp-extend-2').val(value.ADDITIONAL_HP);
	this.getElementById('mp').val(value.mp || value.MP);
	this.getElementById('mp-extend').val(value.EXTENDED_MP);
	this.$html.change();
};

com.hiyoko.sweet.ResourceManage.ResourceTable.HPMP.UPDATE_EVENT = 'com-hiyoko-sweet-ResourceManage-ResourceTable-HPMP-UPDATE_EVENT';


