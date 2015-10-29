function localizeHtmlPage() {
    //Localize by replacing __MSG_***__ meta tags
    var objects = document.getElementsByTagName('html');
    for (var j = 0; j < objects.length; j++) {
        var obj = objects[j];

        var valStrH = obj.innerHTML.toString();
        var valNewH = valStrH.replace(/__MSG_(\w+)__/g, function (match, v1) {
            return v1 ? chrome.i18n.getMessage(v1) : "";
        });

        if (valNewH != valStrH) {
            obj.innerHTML = valNewH;
        }
    }
}
localizeHtmlPage();

var AuxLocal = JSON.parse(localStorage.getItem("signs"));
if (typeof localStorage.signs == 'undefined' || AuxLocal.length < 1) {
    $("#exe").hide();
    $("#lstSigns").hide();
    $("#msg").html(chrome.i18n.getMessage("error_no_signs"));
    document.getElementById("aConf").addEventListener("click", function () {
        chrome.tabs.create({
            url: "config.html"
        });
    });
} else {
    for (var row in AuxLocal) {
        var select = document.getElementById('lstSigns');
        var opt = document.createElement('option');
        opt.value = row;
        opt.innerHTML = AuxLocal[row].name;
        select.appendChild(opt);
    }
}

document.getElementById("exe").addEventListener("click", function () {
    chrome.tabs.query({
        currentWindow: true,
        active: true,
        url: "https://productforums.google.com/*"
    }, function (tab) {
        console.log(tab);
        if (tab.length < 1) {
            alert(chrome.i18n.getMessage("error_no_gpf_tab"));
            return;
        }

        if (typeof AuxLocal[$("#lstSigns").children(":selected").attr("value")] == 'undefined') {
            alert(chrome.i18n.getMessage("error_haha"));
            return;
        }
        var sitem = AuxLocal[$("#lstSigns").children(":selected").attr("value")];
        AuxLocal[$("#lstSigns").children(":selected").attr("value")].used++;
        chrome.tabs.sendMessage(tab[0].id, {
            type: "addSign",
            tab: tab[0],
            text: sitem.message,
            "post": sitem.post
        });
        localStorage.setItem("signs", JSON.stringify(AuxLocal))
    })
});


document.getElementById("btnConf").addEventListener("click", function () {
    chrome.tabs.create({
        url: "config.html"
    });
});
