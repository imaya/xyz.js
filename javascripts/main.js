(function(global) {

var targetId = 'dropbox';
var dragenterClassName = 'dragenter';

window.addEventListener('DOMContentLoaded', function(ev) {
  setEventListener(document.getElementById('dropbox'));
  prettyPrint();
}, false);

function setEventListener(handler) {
  var element = handler;

  element.addEventListener('drop', onDrop, false);
  element.addEventListener('dragenter', enterHandler, false);
  element.addEventListener('dragover', enterHandler, false);
  element.addEventListener('dragleave', leaveHandler, false);
  element.addEventListener('dragout', leaveHandler, false);
}

/**
 * default event handler.
 * @param {Event} ev event object.
 * @return {boolean} false only.
 */
function enterHandler(ev) {
  ev.target.classList.add(dragenterClassName);
  ev.preventDefault();
}

/**
 * default event handler.
 * @param {Event} ev event object.
 * @return {boolean} false only.
 */
function leaveHandler(ev) {
  ev.target.classList.remove(dragenterClassName);
  ev.preventDefault();
}

/**
 * drop event handler.
 * @param {Event} ev event object.
 */
function onDrop(ev) {
  /** @type {FileList} */
  var files = ev.dataTransfer.files;
  /** @type {number} */
  var i;
  /** @type {number} */
  var il;
  /** @type {HTMLDivElement} */
  var target = document.getElementById(targetId);

  ev.preventDefault();

  while (target.childNodes.length > 0) {
    target.removeChild(target.firstChild);
  }

  for (i = 0, il = files.length; i < il; ++i) {
    fileHandler(files[i], target);
  }

  leaveHandler.apply(this, arguments);
}

function fileHandler(file, target) {
  var reader = new FileReader();

  reader.onload = function () {
    var filename;
    var data = new Uint8Array(reader.result);
    var canvas = document.createElement('canvas');

    // filename
    filename = file.fileName ? file.filename : // Chrome
               file.name     ? file.name :     // Firefox
               '(ファイル名の取得に失敗)';

    CanvasTool.XyzLoad(data, canvas);

    target.appendChild(canvas);
  };

  reader.readAsArrayBuffer(file);
}

}).call(this, this);
