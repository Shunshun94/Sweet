/**
 * http://www.dodontof.com/DodontoF/README.html#aboutWebIf
 * @fileoverview どどんとふを利用するクライアントです
 * @author @Shunshun94 (しゅんしゅんひよこ)
 */

var com = com || {};
com.hiyoko = com.hiyoko || {};
com.hiyoko.DodontoF = com.hiyoko.DodontoF || {};
com.hiyoko.DodontoF.V2 = com.hiyoko.DodontoF.V2 || {};

com.hiyoko.DodontoF.V2.Server = function(url) {
	this.url = com.hiyoko.DodontoF.V2.util.urlSuiter_(url);
};

com.hiyoko.DodontoF.V2.Room = function(url, room, opt_pass) {
	this.url = com.hiyoko.DodontoF.V2.util.urlSuiter_(url);
	this.base = {
			room: room,
			pass: opt_pass || ''
	};
};

(function(tofServer){
	tofServer.API_NAMES = {
			BUSY_INFO: 'getBusyInfo',
			SERVER_INFO: 'getServerInfo',
			ROOM_LIST: 'getRoomList'
	};
	
	tofServer.prototype.buildRequest_ = function(params) {
		var args = [];
		for(var key in params) {
			args.push(key + '=' + params[key]);
		}
		console.log(this.url + args.join('&'));
		return this.url + args.join('&');
	};
	
	tofServer.prototype.sendRequest_ = function(apiName, params, opt_additionalParams) {
		params.webif = apiName;
		return $.ajax({
			type:'get',
			url:this.buildRequest_(params),
			async:true,
			dataType:'jsonp'
		});
	};
	
	tofServer.prototype.getRoom = function(room, pass) {
		return new com.hiyoko.DodontoF.V2.Room(this.url, room, pass);
	};
	
	tofServer.prototype.getStress = function() {
		return this.sendRequest_(tofServer.API_NAMES.BUSY_INFO, {});
	};
	
	tofServer.prototype.getDiceList = function() {
		return this.sendRequest_(tofServer.API_NAMES.SERVER_INFO, {dice:true});
	};
	
	tofServer.prototype.getCardList = function() {
		return this.sendRequest_(tofServer.API_NAMES.SERVER_INFO, {card:true});
	};
	
	tofServer.prototype.getRoomList = function() {
		return this.sendRequest_(tofServer.API_NAMES.ROOM_LIST, {dice:true});
	};
	
})(com.hiyoko.DodontoF.V2.Server);

(function(tofRoom){
	tofRoom.API_NAMES = {
			LOGIN_INFO: 'getLoginInfo',
			LOGIN_USER_INFO: 'getLoginUserInfo',
			GET_CHAT: 'chat',
			SEND_CHAT: 'talk',
			CHAT_COLOR: 'getChatColor',
			ADD_CHARACTER: 'addCharacter',
			CHANGE_CHARACTER: 'changeCharacter',
			GET_ROOM_INFO: 'getRoomInfo',
			SET_ROOM_INFO: 'setRoomInfo',
			ADD_MEMO: 'addMemo',
			CHANGE_MEMO: 'changeMemo',
			REFRESH: 'refresh',
			GET_CHARACTER: 'refresh',
			GET_MAP: 'refresh'
	};
	
	tofRoom.prototype.buildRequest_ = function(params) {
		var args = [];
		for(var key in params) {
			args.push(key + '=' + params[key]);
		}
		args.push('room=' + this.base.room);
		args.push('password=' + this.base.pass);
		return this.url + args.join('&');
	};
	
	tofRoom.prototype.sendRequest_ = function(apiName, params, opt_additionalParams) {
		params.webif = apiName;
		return $.ajax({
			type:'get',
			url:this.buildRequest_(params),
			async:true,
			dataType:'jsonp'
		});
	};
	
	tofRoom.prototype.getId = function() {
		return this.sendRequest_(tofRoom.API_NAMES.LOGIN_INFO, {});
	};
	
	tofRoom.prototype.getUserList = function(opt_name, opt_id) {
		var param = {};
		if(opt_name && opt_id) {
			param.name = opt_name;
			param.uniqueId = opt_id;
		}
		return this.sendRequest_(tofRoom.API_NAMES.LOGIN_USER_INGO, param);
	};
	
	tofRoom.prototype.getChat = function(opt_from) {
		var param = {};
		if(opt_from) {
			param.time = opt_from;
		} else {
			param.sec = 'all';
		}
		return this.sendRequest_(tofRoom.API_NAMES.GET_CHAT, param);
	};
	
	tofRoom.prototype.sendChat = function() {
		return this.sendRequest_(tofRoom.API_NAMES.SEND_CHAT, {dice:true});
	};
	
	tofRoom.prototype.addMemo = function(msg) {
		return this.sendRequest_(tofRoom.API_NAMES.ADD_MEMO, {message:msg});
	};
	
	tofRoom.prototype.updateMemo = function(msg, opt_id) {
		console.log(msg, opt_id);
		var updateMemoPromise = new $.Deferred; 
		if(opt_id) {
			this.sendRequest_(tofRoom.API_NAMES.CHANGE_MEMO, {message:msg, targetId: opt_id}).done(function(result){
				result.tofMethod = tofRoom.API_NAMES.CHANGE_MEMO;
				if(result.result === 'OK') {
					updateMemoPromise.resolve(result);
				} else {
					updateMemoPromise.reject(result);
				}
			}).fail(function(result){
				result.tofMethod = tofRoom.API_NAMES.CHANGE_MEMO;
				updateMemoPromise.reject(result);
			});
		} else {
			this.addMemo(msg).done(function(result){
				result.tofMethod = tofRoom.API_NAMES.ADD_MEMO;
				if(result.result === 'OK') {
					updateMemoPromise.resolve(result);
				} else {
					updateMemoPromise.reject(result);
				}
			}).fail(function(result){
				result.tofMethod = tofRoom.API_NAMES.ADD_MEMO;
				updateMemoPromise.reject(result);
			});
		}
		return updateMemoPromise.promise();
	};
	
	
	  
})(com.hiyoko.DodontoF.V2.Room);

com.hiyoko.DodontoF.V2.util = com.hiyoko.DodontoF.V2.util || {};

com.hiyoko.DodontoF.V2.util.urlSuiter_ = function(url) {
	var swf = "DodontoF.swf";
	var rb = "DodontoFServer.rb?";
	if(url.indexOf(rb) === url.length - rb.length) {
		// DodontoF/DodontoFServer.rb?
		return url;
	}
	if(url.slice(-3) === ".rb") {
		// DodontoF/DodontoFServer.rb
		return url + "?";
	}
	if(url.indexOf(swf) === url.length - swf.length ) {
		// DodontoF/DodontoF.swf
		return url.replace(swf, rb);
	}
	if(url.slice(-1) === "/") {
		// DodontoF/DodontoF.swf
		return url + rb;
	}
	if(url.indexOf(swf + '?') !== -1) {
		// DodontoF/DodontoF.swf?loginInfo
		return url.split(swf)[0] + rb;
	}
	// DodontoF
	return url + "/" + rb;
};