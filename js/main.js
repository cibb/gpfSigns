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

if (mySigns.length < 1) {
    $("#exe").hide();
    $("#lstSigns").hide();
    $("#msg").html(chrome.i18n.getMessage("error_no_signs"));
    document.getElementById("aConf").addEventListener("click", function () {
        chrome.tabs.create({
            url: "config.html"
        });
    });
} else {
    for (var row in mySigns) {
        var select = document.getElementById('lstSigns');
        var opt = document.createElement('option');
        opt.value = row;
        opt.innerHTML = mySigns[row].name;
        select.appendChild(opt);
    }
}

document.getElementById("exe").addEventListener("click", function () {
    chrome.tabs.query({
        currentWindow: true,
        active: true,
        url: "https://productforums.google.com/*"
    }, function (tab) {
        if (tab.length < 1) {
            alert(chrome.i18n.getMessage("error_no_gpf_tab"));
            return;
        }

        if (typeof mySigns[$("#lstSigns").children(":selected").attr("value")] == 'undefined') {
            alert(chrome.i18n.getMessage("error_haha"));
            return;
        }
        var sitem = mySigns[$("#lstSigns").children(":selected").attr("value")];
        mySigns[$("#lstSigns").children(":selected").attr("value")].used++;
        chrome.tabs.sendMessage(tab[0].id, {
            type: "addSign",
            tab: tab[0],
            text: sitem.message,
            "post": sitem.post
        });
        localStorage.setItem("signs", JSON.stringify(mySigns))
    })
});


document.getElementById("btnConf").addEventListener("click", function () {
    chrome.tabs.create({
        url: "config.html"
    });
});
