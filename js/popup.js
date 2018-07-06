var query = { active: true, currentWindow: true };
function addBlock(coin){
    var coinVal = localStorage.getItem('coin-' + coin),
            title = chrome.i18n.getMessage("insert_wallet", [coin]),
            edit = chrome.i18n.getMessage("edit"),
            check = chrome.i18n.getMessage("submit");
        //    console.log(coinVal,coin)
        let html = `
              <h3 id="title-${coin}" class="title">${title}</h3>
              <input type="text" class="hash hash-${coin}"/>
              <button type="button" class="submit submit-${coin} btn">${check}</button> 
              <div class="message message-${coin}"></div>
              <div class="clearfix">
                  <div class="balance balance-${coin} hidden"></div>
                  <button type="button" class="edit btn hidden">${edit}</button>
              </div>
              
        `
        let div  = document.createElement('div');
        $(div).html(html).addClass('coin-wrp coin-' + coin + '-wrp');
        $(div).find('.submit.btn').click(function(){
            checkIt($(div), coin);
        });
        $(div).find('.edit.btn').click(function(){
            switchToEdit($(div));
        });
        $(div).appendTo('.coins');
        if(coinVal && coinVal.trim()){
            $(div).find('.hash').val(coinVal)
            switchToShow($(div));
            callCheck($(div), coin, coinVal)
        }
}

function refreshBlocks(coin){
    $('.coin-wrp').hide();
    for(let coin of coins){
        if($('.coin-' + coin + '-wrp').length){
            $('.coin-' + coin + '-wrp').show();
        }
        else{
            addBlock(coin);
        }


    }
}

refreshBlocks();
//sub.addEventListener('click', checkIt);

function switchToShow(wrp){
    wrp.find('.submit,.hash,.title').hide();
}
function switchToEdit(wrp, coin){
    wrp.find('.submit,.hash,.title').show();
    wrp.find('.balance').addClass('hidden');
    wrp.find('.message').text('');
}


function checkIt(wrp, coin){
    var coinVal = wrp.find('.hash').val();
    localStorage.setItem('coin-' + coin, coinVal)
    
    callCheck(wrp, coin, coinVal);
    
}

function callCheck(wrp, coin, coinVal){
    wrp.find('.message').text(chrome.i18n.getMessage("please_wait") );
    chrome.runtime.sendMessage({action: "checkBalance",hash:coinVal, coin:coin},(ans) =>{
        //console.log(ans);
        if(ans.status && ans.balance){
            switchToShow(wrp);
            wrp.find('.message').addClass('with-value').text(chrome.i18n.getMessage("balance",[capitalizeFirstLetter(coin)])+ ':');
            wrp.find('.balance').text(ans.balance + ' ' + ( ans.USD ? '(' + ans.USD + ')' :''));
            wrp.find('.balance, .edit').removeClass('hidden');
            setTimeout(function(){
                chrome.runtime.sendMessage({action: "injectJs"});
            },3000);
        }
        else{
            wrp.find('.message').text(chrome.i18n.getMessage("error"));
        }
    });
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}