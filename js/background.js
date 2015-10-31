function saveInLocal(datas)
{
    if(typeof datas == "string")
        localStorage.setItem("signs", datas);
    else
        localStorage.setItem("signs", JSON.stringify(datas));

    return true;
}

function getFromLocal(){
    if (localStorage.getItem("signs"))
        return JSON.parse(localStorage.getItem("signs"));
    else
        return false;
}

function saveInGoogle(signs){
    chrome.storage.sync.set({"signs":JSON.stringify(signs)}, function () {
        console.log("Saved in google cloud.")
    });
}

function getFromGoogle(){
    var Aux = false;

    chrome.storage.sync.getBytesInUse("signs",function(bytesInUse){
        if(bytesInUse>0){
            chrome.storage.sync.get("signs",function(items){
               console.log(items.signs);
               Aux2 = JSON.parse(items.signs);
            })
        }
    });

    if(typeof Aux2 != "undefined")
        return Aux2
    else
        return Aux;
}

var mySigns = [];
mySigns = getFromGoogle();
if(!mySigns)
    mySigns = getFromLocal();

chrome.storage.onChanged.addListener(function(changes,areaName){
    if(areaName == 'sync')
        saveInLocal(changes.signs.newValue);
});