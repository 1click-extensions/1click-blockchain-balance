coinsAvailable = ['bitcoin','ethereum', 'bitcoin-cash'];
function getEnabledCoins(){
	let coins;
	try{
		coins = JSON.parse(localStorage.getItem('coins'));
	}
	catch(e){
		//coins = coinsAvailable;
	}
	return coins ? coins : coinsAvailable;
}
function setEnabledCoins(coinsToSave){
	localStorage.setItem('coins', JSON.stringify(coinsToSave));
	coins = coinsToSave;
	refreshBlocks();
}

coins = getEnabledCoins();
$('.coins').before('<div class="choose-coins"></div>');
var toChoose = $('.choose-coins');
toChoose.append('<h2>' + chrome.i18n.getMessage("choose_coins") + '</h2><style >h2{margin:0;padding:2px 8px 6px;}.choose-coin-wrp{display: inline-block;padding: 2px 7px;}.coins {border-top: 1px solid #1cffff;margin-top: 10px;}</style>')
for(let coin of coinsAvailable){
	let checked = coins.indexOf(coin) > -1 ? ' checked="checked" ' : '';
	toChoose.append('<div class="choose-coin-wrp"><input type="checkbox" name="' + coin + '" id="' + coin + '"' + checked + ' /><label for="' + coin + '">' + coin + '</label></div>')
}
toChoose.find(':checkbox').change(function(){
	var _this = this;
	setTimeout(function(){
		let coinsNow = JSON.parse(localStorage.getItem('coins')),
			coin = $(_this).attr('name'),
			enabledCoins = getEnabledCoins(),
			indexOfCoin = enabledCoins.indexOf(coin);
		if($(_this).is(':checked') && indexOfCoin == -1){
			enabledCoins.push(coin);
			setEnabledCoins(enabledCoins);
		}
		else if(!$(_this).is(':checked') && indexOfCoin > -1){
			enabledCoins.splice(indexOfCoin,1);
			setEnabledCoins(enabledCoins);
		}
	},30);

});
