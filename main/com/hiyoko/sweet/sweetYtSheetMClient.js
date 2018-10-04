var com = com || {};
com.hiyoko = com.hiyoko || {};
com.hiyoko.sweet = com.hiyoko.sweet || {};

com.hiyoko.sweet.YtSheetMClient = class {
	constructor(algorithmiaToken) {
		this.algorithmiaClient = new com.hiyoko.Algorithmia(algorithmiaToken);
		this.ytSheetM2_5_Client = new io.github.shunshun94.trpg.ytsheet.ytsheetMSW2_5();
	}

	getSheet(url) {
		return new Promise((resolve, reject) =>{
			this.ytSheetM2_5_Client.getSheet(url).then((result)=>{
				resolve(result);
			}, (error_1)=>{
				this.algorithmiaClient.request(com.hiyoko.sweet.YtSheetMClient.Algorithm, url).then((result)=>{
					resolve(result);
				}, (error_2)=>{
					reject(error_2);
				});
			});
		});
	}
};

com.hiyoko.sweet.YtSheetMClient.Algorithm = 'algo://Shunshun94/ytSheetMParser/0.4.3';
