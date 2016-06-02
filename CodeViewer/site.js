var code = document.getElementById('code');

function loadFile(file) {
  var reader = new FileReader();
  reader.readAsText(file);

  reader.onload = function(e) {
    code.innerHTML = Prism.highlight(e.target.result, Prism.languages.clike);
  };

  reader.onerror = function(e) {
    code.textContent = e.target.error.toString();
  };
}

document.getElementById("input").addEventListener(
  'change',
  function(e) {
    var files = e.target.files;
    if (files.length == 0) return;
    loadFile(files[0]);
  }
);

document.addEventListener(
  'dragover',
  function(e) {
    e.stopPropagation();
    e.preventDefault();
  },
  false
);

document.addEventListener(
  'drop',
  function(e) {
    e.stopPropagation();
    e.preventDefault();

    var files = e.dataTransfer.files;
    if (files.length == 0) return;
    loadFile(files[0]);
  },
  false
);
