chrome.runtime.setUninstallURL("https://1ce.org");

if (!localStorage.created) {
  chrome.tabs.create({ url: "https://1ce.org" });
  var manifest = chrome.runtime.getManifest();
  localStorage.ver = manifest.version;
  localStorage.created = 1;
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    //console.log(request,sender);
    switch(request.action){
      case 'checkBalance':
        //aja().url('https://utils.1ce.org/check-balance?type=' + request.coin + '&hash=' + request.hash)
        aja().url('http://utils.1ce.org/check-balance?type=' + request.coin + '&hash=' + request.hash)
        .timeout(10000)  
        .on('200', function(data){
            if(!data.status){
              sendResponse({status:false});
            }
            else{
              sendResponse(data);
            }
              console.log(data);
              //well done
          })
        .on('timeout', function(){
            sendResponse({status:false});
        }).go();

        break;

    }
    return true;
});