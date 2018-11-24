var com = com || {};
com.hiyoko = com.hiyoko || {};
com.hiyoko.sweet = com.hiyoko.sweet || {};
com.hiyoko.sweet.PlayerBattle = com.hiyoko.sweet.PlayerBattle || {};
com.hiyoko.sweet.PlayerBattle.PlayerBattleOptionalTableLoader = (query, key = com.hiyoko.sweet.PlayerBattle.PlayerBattleOptionalTableLoader_TARGET_KEY_ID) => {
	const rawQueryData = query.PlayerBattleOptions ? decodeURI(query.PlayerBattleOptions) : false;
	const queryData = rawQueryData ? rawQueryData.split(';').map((d)=>{
		let tmp = d.split(':');
		tmp.unshift(false);
		return tmp;
	}) : [];
	const names = queryData.map((d)=>{return d[1]});
	const currentRawData = localStorage.getItem(key);
	const currentData = (Boolean(currentRawData) ? JSON.parse(currentRawData) : []).filter((d)=>{
		return ! names.includes(d[1]);
	});
	localStorage.setItem(key, JSON.stringify(queryData.concat(currentData)));
};

com.hiyoko.sweet.PlayerBattle.PlayerBattleOptionalTableLoader_TARGET_KEY_ID = 'com-hiyoko-sw2-player-playerbattle-option-table-data';