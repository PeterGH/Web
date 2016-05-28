var editor = document.getElementById("editor");
var matchResult = document.getElementById("match");

function resize() {
    var width = window.innerWidth;
    var height = window.innerHeight - 20;
    editor.style.width = width + "px";
    editor.style.height = height + "px";
    // matchResult.style.width = "400px";
    // matchResult.style.height = height + "px";
}

window.onload = resize;
window.onresize = resize;

function loadFile(file) {
    var reader = new FileReader();
    reader.readAsText(file);

    reader.onload = function (e) {
        editor.value = e.target.result;
    };

    reader.onerror = function (e) {
        editor.value = e.target.error.toString();
    };
}

document.getElementById("input").addEventListener(
    "change",
    function (e) {
        var files = e.target.files;
        if (files.length == 0)
            return;

        loadFile(files[0]);
    }
);

editor.addEventListener(
    "dragover",
    function (e) {
        e.stopPropagation();
        e.preventDefault();
    },
    false
);

editor.addEventListener(
    "drop",
    function (e) {
        e.stopPropagation();
        e.preventDefault();

        var files = e.dataTransfer.files;
        if (files.length == 0)
            return;

        loadFile(files[0]);
    },
    false
);

function saveFileIE(e) {
    var str = editor.value.replace(/\n/g, "\r\n");
    var win = window.open();
    win.document.write(str);
    win.document.close();
    win.document.execCommand("SaveAs", true, ".txt");
    win.close();
}

function saveFile(e) {
    var str = editor.value.replace(/\n/g, "\r\n");
    var blob = new Blob([str], { type: "text/plain" });

    if (window.navigator.msSaveOrOpenBlob != null) {
        // IE
        window.navigator.msSaveOrOpenBlob(blob, "temp.txt");
    } else {
        var a = document.createElement("a");
        a.download = "temp.txt";
        if (window.webkitURL != null) {
            // Chrome
            a.href = window.webkitURL.createObjectURL(blob);
        } else {
            a.href = window.URL.createObjectURL(blob);
            a.onclick = function (e) { document.body.removeChild(e.target); };
            a.style.display = "none";
            document.body.appendChild(a);
        }

        a.click();
        //var event = document.createEvent('Event');
        //event.initEvent('click', true, true);
        //a.dispatchEvent(event);
        (window.webkitURL || window.URL).revokeObjectURL(a.href);
    }
}

document.getElementById("save").addEventListener("click", saveFile);

var pattern = document.getElementById("pattern");
var regex;

pattern.addEventListener(
    "keyup",
    function () {
        if (this.value == "") {
            matchResult.style.display = "none";
            resize();
        } else {
            regex = new RegExp(this.value);
            var match = regex.exec(editor.value);
            matchResult.value = "";
            if (match != null) {
                console.log(match);
                for (var m in match) {
                    matchResult.value += match[m] + "\n";
                }
                var width = window.innerWidth - 200;
                var height = window.innerHeight - 20;
                editor.style.width = width + "px";
                editor.style.height = height + "px";
                matchResult.style.height = height + "px";
                matchResult.style.display = "inline";
            }
        }
    }
);