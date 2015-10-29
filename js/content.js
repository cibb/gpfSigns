chrome.extension.onMessage.addListener(function (message, sender, sendResponse) {
    switch (message.type) {
        case "addSign":
            if (typeof document.getElementsByClassName("editable")[0] == 'undefined') {
                alert('Debes estar escribiendo una respuesta para poder insertar contenido. Por favor, aprieta sobre responder e intenta nuevamente.');
                return;
            }

            var myText = message.text;

            var link = "";

            if (document.location.href.indexOf(";") == -1)
                link = document.location.href;
            else {
                var linkAux = document.location.href.split(';');
                link = linkAux[0];
            }

            if (window.hadfield_standalone) {
                customerName = document.getElementsByClassName("NUXPAI-E-e")[0].getElementsByTagName("span")[0].innerText;
            } else {
                customerName = document.querySelector("._username span").innerText;
            }

            myText = myText.replace("{{topicLink}}", link);
            myText = myText.replace("{{userName}}", customerName);

            if (message.post)
                document.getElementsByClassName("editable")[0].innerHTML = document.getElementsByClassName("editable")[0].innerHTML + myText;
            else
                document.getElementsByClassName("editable")[0].innerHTML = myText + document.getElementsByClassName("editable")[0].innerHTML;
            break;
        case "addAction":
            document.getElementById("aConf").addEventListener("click", function () {
                chrome.tabs.create({
                    url: "config.html"
                });
            });
            break;
    }
});

console.log(chrome.i18n.getMessage("name") + " running now")
