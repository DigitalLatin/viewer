var CETEI = (function () {
  'use strict';

  var babelHelpers = {};

  babelHelpers.classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  babelHelpers.createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  babelHelpers;

  var CETEI = function () {
    function CETEI() {
      babelHelpers.classCallCheck(this, CETEI);

      this.els = [];
      this.behaviors = [{ "handlers": {}, "fallbacks": {} }];
      var methods = Object.getOwnPropertyNames(CETEI.prototype);
      for (var i = 0; i < methods.length; i++) {
        if (methods[i].startsWith("_h_")) {
          this.behaviors[0]["handlers"][methods[i].replace("_h_", "")] = this[methods[i]];
        }
        if (methods[i].startsWith("_fb_")) {
          this.behaviors[0]["fallbacks"][methods[i].replace("_fb_", "")] = this[methods[i]];
        }
      }
    }

    // public method


    babelHelpers.createClass(CETEI, [{
      key: "getHTML5",
      value: function getHTML5(TEI_url, callback) {
        var _this = this;

        // Get TEI from TEI_url and create a promise
        var promise = new Promise(function (resolve, reject) {
          var client = new XMLHttpRequest();

          client.open('GET', TEI_url);
          client.send();

          client.onload = function () {
            if (this.status >= 200 && this.status < 300) {
              resolve(this.response);
            } else {
              reject(this.statusText);
            }
          };
          client.onerror = function () {
            reject(this.statusText);
          };
        }).then(function (TEI) {
          var TEI_dom = new window.DOMParser().parseFromString(TEI, "text/xml");
          _this._fromTEI(TEI_dom);

          var newTree = void 0;
          var convertEl = function convertEl(el) {
            // Create new element
            var newElement = document.createElement('tei-' + el.tagName);
            // Copy attributes
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
              for (var _iterator = Array.from(el.attributes)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var att = _step.value;

                if (att.name != "xmlns") {
                  newElement.setAttribute(att.name, att.value);
                }
                if (att.name == "xml:id") {
                  newElement.setAttribute("id", att.value);
                }
                if (att.name == "xml:lang") {
                  newElement.setAttribute("lang", att.value);
                }
              }
            } catch (err) {
              _didIteratorError = true;
              _iteratorError = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
                }
              } finally {
                if (_didIteratorError) {
                  throw _iteratorError;
                }
              }
            }

            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
              for (var _iterator2 = Array.from(el.childNodes)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var node = _step2.value;

                if (node.nodeType == 1) {
                  newElement.appendChild(convertEl(node));
                } else {
                  newElement.appendChild(node.cloneNode());
                }
              }
            } catch (err) {
              _didIteratorError2 = true;
              _iteratorError2 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                  _iterator2.return();
                }
              } finally {
                if (_didIteratorError2) {
                  throw _iteratorError2;
                }
              }
            }

            return newElement;
          };

          newTree = convertEl(TEI_dom.documentElement);

          if (document.registerElement) {
            _this.registerAll(_this.els);
          } else {
            _this.fallback(newTree, _this.els);
          }

          if (callback) {
            callback(newTree);
          } else {
            return newTree;
          }
        }).catch(function (reason) {
          // TODO: better error handling?
          console.log(reason);
        });

        return promise;
      }

      // public method

    }, {
      key: "addBehaviors",
      value: function addBehaviors(bhvs) {
        if (bhvs["handlers"] || bhvs["fallbacks"]) {
          this.behaviors.push(bhvs);
        } else {
          console.log("No handlers or fallback methods found.");
        }
      }
    }, {
      key: "getHandler",
      value: function getHandler(fn) {
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = this.behaviors.reverse()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var b = _step3.value;

            if (b["handlers"][fn]) {
              return b["handlers"][fn];
            }
          }
        } catch (err) {
          _didIteratorError3 = true;
          _iteratorError3 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion3 && _iterator3.return) {
              _iterator3.return();
            }
          } finally {
            if (_didIteratorError3) {
              throw _iteratorError3;
            }
          }
        }
      }
    }, {
      key: "getFallback",
      value: function getFallback(fn) {
        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
          for (var _iterator4 = this.behaviors.reverse()[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            var b = _step4.value;

            if (b["fallbacks"][fn]) {
              return b["fallbacks"][fn];
            }
          }
        } catch (err) {
          _didIteratorError4 = true;
          _iteratorError4 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion4 && _iterator4.return) {
              _iterator4.return();
            }
          } finally {
            if (_didIteratorError4) {
              throw _iteratorError4;
            }
          }
        }
      }
    }, {
      key: "registerAll",
      value: function registerAll(names) {
        var _iteratorNormalCompletion5 = true;
        var _didIteratorError5 = false;
        var _iteratorError5 = undefined;

        try {
          for (var _iterator5 = names[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
            var name = _step5.value;

            var proto = Object.create(HTMLElement.prototype);
            var fn = this.getHandler(name);
            if (fn) {
              fn.call(fn, proto);
            }
            document.registerElement("tei-" + name, { prototype: proto });
          }
        } catch (err) {
          _didIteratorError5 = true;
          _iteratorError5 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion5 && _iterator5.return) {
              _iterator5.return();
            }
          } finally {
            if (_didIteratorError5) {
              throw _iteratorError5;
            }
          }
        }
      }
    }, {
      key: "fallback",
      value: function fallback(dom, names) {
        var _iteratorNormalCompletion6 = true;
        var _didIteratorError6 = false;
        var _iteratorError6 = undefined;

        try {
          for (var _iterator6 = names[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
            var name = _step6.value;

            var fn = this.getFallback(name);
            if (fn) {
              fn.call(fn, dom);
            }
          }
        } catch (err) {
          _didIteratorError6 = true;
          _iteratorError6 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion6 && _iterator6.return) {
              _iterator6.return();
            }
          } finally {
            if (_didIteratorError6) {
              throw _iteratorError6;
            }
          }
        }
      }

      // Handler methods

    }, {
      key: "_h_ptr",
      value: function _h_ptr(proto) {
        proto.createdCallback = function () {
          var shadow = this.createShadowRoot();
          var link = document.createElement("a");
          link.innerHTML = this.getAttribute("target");
          link.href = this.getAttribute("target");
          shadow.appendChild(link);
        };
      }
    }, {
      key: "_h_ref",
      value: function _h_ref(proto) {
        proto.createdCallback = function () {
          var shadow = this.createShadowRoot();
          var link = document.createElement("a");
          link.innerHTML = this.innerHTML;
          link.href = this.getAttribute("target");
          shadow.appendChild(link);
        };
      }
    }, {
      key: "_h_graphic",
      value: function _h_graphic(proto) {
        proto.createdCallback = function () {
          var shadow = this.createShadowRoot();
          var img = new Image();
          img.src = this.getAttribute("url");
          img.width = this.getAttribute("width");
          img.height = this.getAttribute("height");
          shadow.apprendChild(img);
        };
      }

      // Fallback handler methods

    }, {
      key: "_fb_ptr",
      value: function _fb_ptr(dom) {
        var elts = dom.getElementsByTagName("tei-ptr");
        for (var i = 0; i < elts.length; i++) {
          var content = document.createElement("a");
          var elt = elts[i];
          content.setAttribute("href", elt.getAttribute("target"));
          content.innerHTML = elt.getAttribute("target");
          elt.appendChild(content);
          elt.addEventListener("click", function (event) {
            window.location = this.getAttribute("target");
          });
        }
      }
    }, {
      key: "_fb_ref",
      value: function _fb_ref(dom) {
        var elts = dom.getElementsByTagName("tei-ref");
        for (var i = 0; i < elts.length; i++) {
          elts[i].addEventListener("click", function (event) {
            window.location = this.getAttribute("target");
          });
        }
      }
    }, {
      key: "_fb_graphic",
      value: function _fb_graphic(dom) {
        var elts = dom.getElementsByTagName("tei-graphic");
        for (var i = 0; i < elts.length; i++) {
          var content = new Image();
          var elt = elts[i];
          content.src = elt.getAttribute("url");
          content.width = elt.getAttribute("width");
          content.height = elt.getAttribute("height");
          elt.appendChild(content);
        }
      }

      // public method

    }, {
      key: "fromODD",
      value: function fromODD() {}
      // Place holder for ODD-driven setup.
      // For example:
      // Create table of elements from ODD
      //    * default HTML behaviour mapping on/off (eg tei:div to html:div)
      //    ** phrase level elements behave like span (can I tell this from ODD classes?)
      //    * optional custom behaviour mapping


      // "private" method

    }, {
      key: "_fromTEI",
      value: function _fromTEI(TEI_dom) {
        var root_el = TEI_dom.documentElement;
        this.els = new Set(Array.from(root_el.getElementsByTagName("*"), function (x) {
          return x.tagName;
        }));
        this.els.add(root_el.tagName); // Add the root element to the array
      }
    }]);
    return CETEI;
  }();

  // Make main class available to pre-ES6 browser environments


  if (window) {
    window.CETEI = CETEI;
  }

  return CETEI;

}());