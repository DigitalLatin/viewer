var TEI_CE = {
  registerAll: function(names) {
    for (var name of names) {
      var proto = Object.create(HTMLElement.prototype);
      if (TEI_CE[name]) {
        TEI_CE[name].call(TEI_CE[name], proto);
      }
      document.registerElement("tei-" + name, {prototype: proto});
    }
  },
  ptr: function(proto) {
    proto.createdCallback = function() {
      var shadow = this.createShadowRoot();
      var link = document.createElement('a');
      link.innerHTML = this.getAttribute("target").replace(/https?:\/\/([^/]+)\/.*/, "$1");
      link.href = this.getAttribute("target");
      shadow.appendChild(link);
    }
  },
  ref: function(proto) {
    proto.createdCallback = function() {
      this.onclick = function(evt) {
        window.location = evt.target.getAttribute("target");
      }
    }
  },
  img: function(proto) {
    proto.createdCallback = function() {
      var shadow = this.createShadowRoot();
      var img = document.createElement('img');
      img.src = this.getAttribute("url");
      img.width = this.getAttribute("width");
      img.height = this.getAttribute("height");
      shadow.apprendChild(img);
    }
  }
}
