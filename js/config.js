/**globals document */

var sync = {
    get() {
        return new Promise((resolve, reject) => {
            chrome.storage.sync.get(null, function (items) {
                return resolve(items.signs ? JSON.parse(items.signs) : []);
            });
        });
    },
    set(value) {
        return new Promise((resolve, reject) => {
            chrome.storage.sync.set({
                'signs': value
            }, () => {
                if (chrome.runtime.lastError) {
                    return reject('Error al setear firmas ' + chrome.runtime.lastError.message);
                }
            });
            return resolve(value);
        });

    }
};

var signs = {

    data: new Array(),
    add(sign) {
        signs.data.push(sign);
    },
    remove(id) {
        signs.data.splice(id, 1);
    },
    get() {
        return signs.data;
    },
    init(newsigns) {
        signs.data = newsigns;
    },
    json() {
        return JSON.stringify(signs.data);
    }
}

var jUtils = {

    render(rows) {
        //[nombre, usado, boton]
        var $table = $('#dtable').DataTable();
        $table.rows().remove();
        for (row in rows) {
            myJ = [rows[row].name,
                rows[row].used,
                '<button class="delete" data-id="' + row + '"> Borrar </button>'
            ];
            $table.row.add(myJ);
        }
        $table.draw();
        $(".delete").bind("click", jUtils.delete);
        return rows;
    },
    init() {
        $("#input").cleditor();
        $('#dtable').DataTable();
    },
    delete(event) {
        signs.remove($(this).data('id'));
        sync.set(signs.json()).then(JSON.parse).then(jUtils.render);
    }

}

$(document).ready(() => {

    sync.get().then(jUtils.render).then(signs.init);

    $("#createNewBtn").click(() => {
        $('#newSignBox').slideToggle();
        $('#input').cleditor()[0].refresh(); // al redimensionar, hay que repintar =S
    });

    $("#addSigns").click(() => {

        if ($("#inpName").val().length < 2 || $("#inpName").val().length > 30) {
            window.alert(chrome.i18n.getMessage("errorNamelenght"));
            return;
        }

        var myAdded = {
            'name': $("#inpName").val(),
            'post': !($('#before option:selected').attr('id') == "true"),
            'used': 0,
            'message': $("#input").val()
        }

        signs.add(myAdded);

        sync.set(signs.json()).then(JSON.parse).then(jUtils.render);

        window.alert(chrome.i18n.getMessage("savedSignDone"));
        $("#inpName").val("");
        $("#input").cleditor()[0].clear();
        $('#newSignBox').slideToggle();
    });

});
