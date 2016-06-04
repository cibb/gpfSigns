var table;
   
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

$(document).ready(function () {
    $("#input").cleditor();
});

$("#createNewBtn").click(function () {
    if (document.getElementById('newSignBox').style.height == '0px') {
        document.getElementById('newSignBox').style.height = '380px';
    } else {
        document.getElementById('newSignBox').style.height = '0px';
    }
});

$("#addSigns").click(function () {
    var myBol = true

    if ($("#before").children(":selected").attr("id") == "true")
        myBol = false;

    if ($("#inpName").val().length < 2 || $("#inpName").val().length > 30) {
        alert(chrome.i18n.getMessage("errorNamelenght"));
        return;
    }

    var myAdded = {
        'name': $("#inpName").val(),
        'post': myBol,
        'used': 0,
        'message': $("#input").val()
    }

    mySigns.push(myAdded);
    saveInLocal(mySigns);
    saveInGoogle();
    
    myJ = [ 
            $("#inpName").val(),
            0,
            '<button id="delete" data-id="' + (mySigns.length - 1) + '"> Borrar </button>'
          ];    
    table.row.add(myJ).draw();

    $("#inpName").val("");
    $("#input").cleditor()[0].clear()

    alert(chrome.i18n.getMessage("savedSignDone"));
});

$(document).ready(function () {
    table = $('#dtable').DataTable({
        "info": false
    });

    for (var roow in mySigns) {
        myJ     = [ 
                    mySigns[roow].name,
                    mySigns[roow].used,
                    '<button id="delete" data-id="' + (mySigns.length - 1) + '"> Borrar </button>'
                  ];
        table.row.add(myJ).draw();
    };
});

$("#dtable").on("click", "#delete", (function () {
    var newJs = [];
    for (var roow in mySigns) {
        if (roow != $(this).attr("data-id"))
            newJs.push(mySigns[roow]);
    };
    table.row($(this).parents('tr')).remove().draw();
    mySigns = newJs;
    saveInLocal(mySigns);
    saveInGoogle();
}));