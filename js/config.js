/**globals document */

var table;

chrome.storage.sync.get(null, function (items) {
    var mySigns = (items.signs ? JSON.parse(items.signs) : []);

    $(document).ready(function () {
        $("#input").cleditor();
    });

    $("#createNewBtn").click(evt => {
        $('#newSignBox').fadeToggle();
    });

    $("#addSigns").click(function () {

        var myBol = !($('#before option:selected').attr('id') == "true")

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

        chrome.storage.sync.set({
            "signs": JSON.stringify(mySigns)
        });

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
            myJ = [
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

        chrome.storage.sync.set({
            "signs": JSON.stringify(mySigns)
        });
    }));
});
