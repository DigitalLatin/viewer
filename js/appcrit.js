var appcrit = (function () {
  'use strict';

  var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var createClass = function () {
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

  var appcrit = function () {
  	function appcrit(c) {
  		classCallCheck(this, appcrit);

  		this.ceteicean = c;
  		this.variantBlocks = "tei-l,tei-speaker,tei-p";
  		this.genId = 0;
  		this.dom = null;
  		this.references = {};
  		this.log = [];
  		this.redoLog = [];
  	}

  	createClass(appcrit, [{
  		key: "generateId",
  		value: function generateId(prefix) {
  			if (prefix) {
  				return prefix + this.genId++;
  			} else {
  				return "id" + this.genId++;
  			}
  		}
  	}, {
  		key: "swapLem",
  		value: function swapLem(oldrdg) {
  			var self = this;
  			if (oldrdg[0].localName == "tei-rdg") {
  				// swapLem is a no-op if we clicked a lem
  				var copyfrom = oldrdg.attr("data-copyfrom");
  				var oldrdgid = oldrdg.attr("id");
  				var app = oldrdg.parents("tei-app").first();
  				var oldlem = void 0;
  				if ((oldlem = app.find(">tei-lem")).length == 0) {
  					if ((oldlem = app.find("tei-rdgGrp>tei-lem")).length == 0) {
  						if (app.attr("exclude")) {
  							app.attr("exclude").split(/ /).forEach(function (val) {
  								if ($(self.escapeID(val)).find(">tei-lem").length > 0) {
  									oldlem = $(self.escapeID(val)).find(">tei-lem");
  								}
  							});
  						}
  					}
  				}
  				if (oldlem.length > 0) {
  					this.log.push({ "lem": oldlem.attr("id"), "rdg": oldrdg.attr("id") });
  					var oldapp = oldlem.parent("tei-app");
  					var newlem = $("<tei-lem/>");
  					for (var i = 0; i < oldrdg[0].attributes.length; i++) {
  						newlem.attr(oldrdg[0].attributes[i].name, oldrdg[0].attributes[i].value);
  					}
  					newlem.append(oldrdg.html());
  					oldrdg.replaceWith(newlem[0].outerHTML);
  					var newrdg = $("<tei-rdg/>");
  					for (var _i = 0; _i < oldlem[0].attributes.length; _i++) {
  						newrdg.attr(oldlem[0].attributes[_i].name, oldlem[0].attributes[_i].value);
  					}
  					newrdg.append(oldlem.html());
  					oldlem.replaceWith(newrdg[0].outerHTML);
  					//reacquire handles to newlem and newrdg in the altered DOM
  					newlem = $("#" + self.escapeID(newlem.attr("id")));
  					newrdg = $("#" + self.escapeID(newrdg.attr("id")));
  					var l = void 0;
  					// Grab the button we clicked to open the dialog. We might need to move it.
  					var btn = void 0;
  					var append = false;
  					btn = $("#button-" + newlem.parents("tei-app").first().attr("id"));
  					if (app.find(this.variantBlocks).length > 0 && btn && app.find("#" + btn.attr("id").length == 0)) {
  						// It's a line-containing app, but doesn't contain the button; button needs to be moved
  						l = newlem.find(this.variantBlocks).first();
  						if (l.length == 0) {
  							// Look for a line preceding the app that can contain the button
  							l = $(document.evaluate("preceding::*[" + this.variantBlocks.split(',').map(function (val) {
  								return "local-name(.) = '" + val + "'";
  							}).join(" or ") + "][not(ancestor::tei-app) or parent::tei-lem][1]", btn[0], null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue);
  							if (l.length > 0) {
  								append = true;
  							}
  							// look for a following line instead
  							if (l.length == 0) {
  								l = $(document.evaluate("following::*[" + this.variantBlocks.split(',').map(function (val) {
  									return "local-name(.) = '" + val + "'";
  								}).join(" or ") + "][not(ancestor::tei-app) or parent::tei-lem][1]", btn[0], null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue);
  							}
  						}
  						if (l.find("span.apps").length > 0) {
  							if (append) {
  								l.find("span.apps").first().append(btn.detach());
  							} else {
  								l.find("span.apps").first().prepend(btn.detach());
  							}
  						} else {
  							l.append($("<span class=\"apps\"></span>").append(btn.detach()));
  						}
  						self.addToolTip(btn);
  					}
  					if (l && l.length > 0) {
  						app.find("button").each(function (i, elt) {
  							self.addToolTip(elt);
  						});
  					}
  					oldapp = newrdg.parent("tei-app");
  					if (newlem.attr("require")) {
  						newlem.attr("require").split(/ /).forEach(function (val) {
  							var req = $(val);
  							if (req[0].localName == "tei-rdg") {
  								self.swapLem(req);
  							}
  						});
  					}
  				}
  				//give copies the same treatment, so we don't get out of sync.
  				if (copyfrom) {
  					self.swapLem($("#" + self.escapeID(copyfrom)));
  				}
  				$("*[data-copyfrom=" + self.escapeID(oldrdgid) + "]").each(function (i, elt) {
  					self.swapLem($(elt));
  				});
  			}
  		}
  	}, {
  		key: "undo",
  		value: function undo() {
  			var step = this.log.pop();
  			this.swapLem($(document.getElementById(step.lem)));
  			this.redoLog.push(step);
  			this.log.pop(); // kill the undone step
  		}
  	}, {
  		key: "redo",
  		value: function redo() {
  			var step = this.redoLog.pop();
  			this.swapLem($(document.getElementById(step.rdg)));
  		}
  	}, {
  		key: "ttip",
  		value: function ttip(elt) {
  			var self = this;
  			return {
  				content: function content() {
  					return "<div class=\"apparatus\">" + $("#copy-" + self.escapeID($(elt).attr("data-app"))).html() + "</div>";
  				},
  				open: function open(event, ui) {
  					var app = $("#" + self.escapeID($(this).attr("data-app")));
  					app.addClass("highlight");
  					if (app.children("tei-lem").length == 0) {
  						var exclude = app.attr("exclude");
  						if (exclude) {
  							exclude.split(/ /).forEach(function (val) {
  								$(self.escapeID(val)).find(self.variantBlocks).addClass("highlight");
  							});
  						}
  					}
  					app.find(self.variantBlocks).addClass("highlight");
  				},
  				close: function close(event, ui) {
  					var app = $("#" + self.escapeID($(this).attr("data-app")));
  					app.find("hr").remove();
  					app.removeClass("highlight");
  					if (app.children("tei-lem").length == 0) {
  						var exclude = app.attr("exclude");
  						if (exclude) {
  							exclude.split(/ /).forEach(function (val) {
  								$(val).find(self.variantBlocks).removeClass("highlight");
  							});
  						}
  					}
  					app.find(self.variantBlocks).removeClass("highlight");
  					$(this).attr("title", "");
  				}
  			};
  		}
  	}, {
  		key: "addToolTip",
  		value: function addToolTip(elt) {
  			var _this = this;

  			if ($(elt).tooltip("instance")) {
  				$(elt).tooltip("destroy");
  			}
  			$(elt).attr("title", "");
  			$(elt).tooltip(this.ttip(elt));
  			if (!$(elt).hasClass("note")) {
  				(function () {
  					var self = _this;
  					$(elt).click(function (event) {
  						// Add apparatus dialogs
  						var d = $("#dialog-" + self.escapeID($(this).attr("data-app")).replace(/dialog-/, ""));
  						if (d.length == 0) {
  							d = $("<div/>", {
  								id: "dialog-" + $(this).attr("data-app"),
  								class: "dialog",
  								"data-exclude": $("#" + self.escapeID($(this).attr("data-app"))).attr("exclude") });
  							d.appendTo("body");
  							var content = $("#copy-" + self.escapeID($(this).attr("data-app"))).clone();
  							content.find("span.lem").remove();
  							d.html(content.html());
  							if (content.attr("exclude")) {
  								content.attr("exclude").split(/ /).forEach(function (val) {
  									var excl = $(self.escapeID(val).replace(/#/, "#copy-"));
  									d.append(excl.html());
  								});
  							}
  							d.find("*[id]").each(function (i, elt) {
  								$(elt).attr("data-id", $(elt).attr("id"));
  							});
  							d.find("*[id]").removeAttr("id");
  							d.find("tei-note[target]").each(function (i, elt) {
  								$(elt).attr("data-id", $(elt).attr("target").replace(/#/, ""));
  							});
  							if ($(elt).find(this.variantBlocks).length > 0) {
  								d.find("tei-lem,tei-rdg,tei-rdgGrp").remove();
  							}
  							d.find("tei-lem:empty").append("om. ");
  							d.find("tei-rdg:empty").append("om. ");
  							d.find("tei-rdg,tei-lem,tei-note[data-id],span[data-id]").each(function (i, elt) {
  								$(elt).click(function (evt) {
  									var rdg = $("#" + self.escapeID($(evt.currentTarget).attr("data-id")));
  									self.swapLem(rdg);
  								});
  							});
  							d.dialog({
  								autoOpen: false,
  								open: function open(event) {
  									$("#" + $(this).attr("id").replace(/dialog/, "button")).tooltip("close");
  									$("#" + $(this).attr("id").replace(/dialog-/, "")).addClass("highlight");
  									$("#" + $(this).attr("id").replace(/dialog-/, "")).find(this.variantBlocks).addClass("highlight");
  								},
  								close: function close(event) {
  									$("#" + $(this).attr("id").replace(/dialog-/, "")).removeClass("highlight");
  									$("#" + $(this).attr("id").replace(/dialog-/, "")).find(this.variantBlocks).removeClass("highlight");
  									var btn = $("#" + $(this).attr("id").replace(/dialog/, "button"));
  									if (btn.tooltip("instance")) {
  										btn.tooltip("close");
  									}
  									btn.attr("title", ""); // hack to handle JQuery UI bug
  								}
  							});
  						}
  						d.dialog("open");
  					});
  				})();
  			}
  		}
  	}, {
  		key: "escapeID",
  		value: function escapeID(id) {
  			return id.replace(/([\.,])/g, "\\$1");
  		}
  	}, {
  		key: "getLabel",
  		value: function getLabel(val) {
  			var elt = $(this.escapeID(val));
  			if (elt.length > 0 && elt.attr("n")) {
  				return elt.attr("n");
  			} else {
  				return val.replace(/#/, '');
  			}
  		}
  	}, {
  		key: "refLabel",
  		value: function refLabel(ref) {
  			if (this.references[ref]) {
  				return this.references[ref];
  			} else {
  				try {
  					var elt = this.dom.querySelector(this.escapeID(ref));
  					var siglum = $(elt).children("abbr[type=siglum]").html();
  					if (!siglum) {
  						this.references[ref] = elt.getAttribute("id");
  					} else {
  						this.references[ref] = siglum;
  					}
  					return this.references[ref];
  				} catch (e) {
  					//console.log("Unresolvable ref, " + ref);
  				}
  			}
  		}
  	}, {
  		key: "witOrSource",
  		value: function witOrSource(elt) {
  			return elt.attr("wit") ? elt.attr("wit") : elt.attr("source");
  		}
  	}, {
  		key: "addSigla",
  		value: function addSigla() {
  			var self = this;
  			return function (i, elt) {
  				if (elt.parentElement) {
  					(function () {
  						// Find labels (@n) for items referenced via @wit and/or @source
  						var wit = "";
  						var source = "";
  						var corr = "";
  						var e = $(elt);
  						e.attr("data-id", e.attr("id"));
  						e.removeAttr("id");
  						// Add note for corrections
  						if (elt.localName == "tei-rdggrp" && e.attr("type") && e.attr("type").match(/corr/i)) {
  							var rdg = e.children("tei-rdg:not(:first-child)");
  							corr = "<span class=\"ref\" data-id=\"" + $(rdg).attr("id") + "\" data-ref=\"" + self.witOrSource(rdg) + "\">(corr. " + self.refLabel(self.witOrSource(rdg)) + ")</span>";
  							rdg.remove();
  						}
  						// Add witness sigla
  						if (e.attr("wit")) {
  							e.attr("wit").split(/ /).forEach(function (val) {
  								wit += "<span class=\"ref\" data-id=\"" + e.attr("data-id") + "\" data-ref=\"" + val + "\">" + self.refLabel(val) + "</span>";
  								e.parents("tei-app").first().find("tei-witdetail[target=\"#" + e.attr("data-id") + "\"][wit=\"" + val + "\"]").each(function (i, elt) {
  									wit += elt.shadowRoot ? elt.shadowRoot.childNodes.item(1).outerHTML : elt.innerHTML;
  								});
  							});
  						}
  						// Add source references
  						if (e.attr("source")) {
  							e.attr("source").split(/ /).forEach(function (val) {
  								source += " <span class=\"ref\" data-id=\"" + e.attr("data-id") + "\" data-ref=\"" + val + "\">" + self.refLabel(val) + "</span> ";
  							});
  						}
  						if (elt.nextElementSibling && elt.nextElementSibling.localName == "tei-wit") {
  							source += " <span class=\"ref\" data-id=\"" + e.attr("data-id") + "\">" + $(elt.nextElementSibling).html() + "</span> ";
  						}
  						if ((wit + source + corr).length > 0) {
  							$(elt).after(" <span class=\"source\">" + wit + source + corr + "</span>");
  						}
  					})();
  				}
  			};
  		}
  	}, {
  		key: "appButton",
  		value: function appButton(elt) {
  			var e = $(elt);
  			if (e.children("tei-rdg").length > 0 || e.children("tei-lem").length > 0) {
  				return "<button id=\"button-" + e.attr("id") + "\" title=\"\" class=\"app\" data-app=\"" + e.attr("id") + "\"><svg class=\"svg-icon\"><use xlink:href=\"#rdg-icon\"></use></svg></button>";
  			} else {
  				// it's a note
  				return "<button id=\"button-" + e.attr("id") + "\" title=\"\" class=\"app note\" data-app=\"" + e.attr("id") + "\"><svg class=\"svg-icon\"><use xlink:href=\"#note-icon\"></use></svg></button>";
  			}
  		}
  	}, {
  		key: "makeCopy",
  		value: function makeCopy(node, keepIds) {
  			var newNode = void 0;
  			if (node.nodeType == Node.ELEMENT_NODE) {
  				newNode = node.cloneNode(false);

  				for (var i = 0; i < node.attributes.length; i++) {
  					// have to rewrite ids in copied content so there are no duplicates
  					var att = node.attributes.item(i);
  					if (att.name == "id") {
  						if (!keepIds) {
  							newNode.setAttribute("data-copyFrom", att.value);
  							newNode.setAttribute("id", this.generateId());
  						} else {
  							newNode.setAttribute(att.name, att.value);
  						}
  					} else if (att.name == "class") {
  						newNode.setAttribute("class", att.value + " app-copy");
  					} else {
  						newNode.setAttribute(att.name, att.value);
  					}
  				}
  				for (var _i2 = 0; _i2 < node.childNodes.length; _i2++) {
  					var n = node.childNodes[_i2];
  					if (n.nodeType == Node.ELEMENT_NODE) {
  						if (n.hasAttribute("copyof")) {
  							this.copy(n);
  						}
  						newNode.appendChild(this.makeCopy(n, keepIds));
  					} else {
  						newNode.appendChild(n.cloneNode(false));
  					}
  				}
  				if (newNode.shadowRoot) {
  					newNode.shadowRoot.innerHTML = node.shadowRoot.innerHTML; //TODO: tei-ref keeps reduplicating content when created
  				}
  				if (node.shadowRoot && !newNode.shadowRoot) {
  					var s = newNode.attachShadow({ mode: 'open' });
  					s.innerHTML = node.shadowRoot.innerHTML;
  				}
  			} else {
  				newNode = node.cloneNode();
  			}
  			return newNode;
  		}

  		// Copies the content of the target of the @copyOf attribute
  		// into the current element

  	}, {
  		key: "copy",
  		value: function copy(elt) {
  			if (elt.hasAttribute("data-copyfrom")) {
  				return; // copy() is a no-op if copying has already happened
  			}
  			var e = $(elt);
  			var src = this.dom.querySelector(this.escapeID(e.attr("copyof")));
  			if (src) {
  				e.attr("data-copyfrom", e.attr("copyof"));
  				for (var i = 0; i < src.childNodes.length; i++) {
  					e.append(this.makeCopy(src.childNodes[i]));
  				}
  				for (var _i3 = 0; _i3 < src.attributes.length; _i3++) {
  					var att = src.attributes.item(_i3);
  					if (att.name == "id") {
  						e.attr("id", this.generateId());
  					} else {
  						e.attr(att.name, att.value);
  					}
  				}
  			} else {
  				//console.log("Can't resolve " + e.attr("copyof"));
  			}
  		}
  	}, {
  		key: "doSection",
  		value: function doSection(section) {
  			var self = this;
  			$("tei-text button").remove();
  			$("div.apparatus").remove();
  			var sectionId = section.attr("id");
  			// Add Apparatus div
  			if (section.find("tei-app").length > 0) {
  				(function () {
  					var appDiv = $("<div id=\"apparatus-" + sectionId + "\" class=\"apparatus\"><h2>Apparatus</h2></div>");
  					section.after(appDiv);
  					// Pull content into @copyOf elements
  					section.find("*[copyof]").each(function (i, elt) {
  						self.copy(elt);
  					});
  					section.find("tei-app").each(function (i, elt) {
  						var app = void 0;
  						if (self.ceteicean.supportsShadowDom) {
  							app = $(self.makeCopy(elt, true));
  						} else {
  							app = $(elt).clone(true, true);
  						}
  						// Assemble distributed readings into the main app (with the lem)
  						if (app.children("tei-lem").length == 1 && app.attr("exclude")) {
  							app.attr("exclude").split(/ /).forEach(function (val) {
  								var rdg = section.find(self.escapeID(val)).clone();
  								app.append($(rdg).children().unwrap());
  							});
  						}
  						// Don't process distributed readings
  						if (!app.attr("exclude") || app.children("tei-lem").length == 1) {
  							var n = void 0,
  							    lines = void 0,
  							    unit = void 0;
  							app.attr("id", "copy-" + app.attr("id"));
  							// clean up descendant apps
  							var lem = app.children("tei-lem");
  							if (lem.find("tei-app").length > 0) {
  								lem.find("tei-rdg,tei-rdggrp,tei-note,tei-wit").remove();
  								lem.find("tei-lem").removeAttr("wit").removeAttr("source");
  							}
  							// turn phrases into first...last
  							if (lem.children(this.variantBlocks).length == 0) {
  								lem.html(lem.text().replace(/\n/g, " ").replace(/^(\S+) .+ (\S+)/, "$1...$2"));
  							}
  							app.find("tei-lem,tei-rdg,tei-rdggrp").each(self.addSigla($(self.dom)));
  							var blocks = void 0;
  							//generate block references for apps containing lines, paragraphs, etc.
  							if (app.find(self.variantBlocks).length > 0) {
  								var _lem = app.children("tei-lem");
  								var children = _lem.find(self.variantBlocks);
  								if (children.length > 0) {
  									unit = children[0].localName;
  									if (unit == "tei-l") {
  										if (children.length > 1) {
  											blocks = "<span class=\"ref lineref\" data-id=\"" + _lem.attr("data-id") + "\">ll. " + _lem.find(self.variantBlocks).first().attr("n") + "–" + _lem.find(self.variantBlocks).last().attr("n") + "</span> ";
  										} else {
  											blocks = "<span class=\"ref lineref\" data-id=\"" + _lem.attr("data-id") + "\">l. " + _lem.find(self.variantBlocks).attr("n") + "</span> ";
  										}
  									}
  									if (unit == "tei-p") {
  										if (children.length > 1) {
  											blocks = "<span class=\"ref lineref\" data-id=\"" + _lem.attr("data-id") + "\">" + _lem.find(self.variantBlocks).first().attr("n") + "–" + _lem.find(self.variantBlocks).last().attr("n") + "</span> ";
  										} else {
  											blocks = "<span class=\"ref lineref\" data-id=\"" + _lem.attr("data-id") + "\">" + _lem.find(self.variantBlocks).attr("n") + "</span> ";
  										}
  									}
  									if (unit == "tei-speaker") {
  										blocks = "<span class=\"ref lineref\" data-id=\"" + _lem.attr("data-id") + "\">sp. </span> ";
  									}
  									app.prepend(blocks);
  								}
  							}
  							if ((blocks = lem.find(self.variantBlocks)).length > 0) {
  								n = $(blocks[0]).attr("n");
  								if (!n && blocks[0].hasAttribute("copyof")) {
  									n = section.find(self.escapeID($(blocks[0]).attr("copyof"))).attr("n");
  								}
  								if (!n) {
  									for (var _i4 = 1; _i4 < blocks.length; _i4++) {
  										if ($(blocks[_i4]).attr("n")) {
  											n = $(blocks[_i4]).attr("n");
  											break;
  										}
  									}
  								}
  								// TODO: Any chance of n still being undefined?
  								if (blocks.length > 1) {
  									if ($(blocks[blocks.length - 1]).attr("n")) {
  										n += "–" + $(blocks[blocks.length - 1]).attr("n");
  									} else {
  										n += "–" + section.find($(blocks[blocks.length - 1]).attr("copyOf")).attr("n");
  									}
  								}
  								var l = $(elt).find("tei-lem").find(self.variantBlocks);
  								if (l.length == 0) {
  									l = $(elt).next(self.variantBlocks + ",tei-app");
  								}
  								l.first().append(self.appButton(elt));
  								// we don't want the full line showing up in the app., just its reference
  								app.find("tei-lem:not(:empty)").remove();
  								app.find("tei-rdg:not(:empty)").each(function (i, elt) {
  									var rdg = $(elt);
  									var children = rdg.find(self.variantBlocks);
  									rdg.html(children.toArray().reduce(function (result, elt) {
  										return result + (result ? "," : "") + elt.getAttribute("n");
  									}, ""));
  								});
  							} else {
  								n = $(elt).parents(self.variantBlocks).attr("n");
  								if (!n && elt.hasAttribute("copyof")) {
  									n = section.find(self.escapeID($(elt).parents(self.variantBlocks).attr("copyof"))).attr("n");
  								}
  								$(elt).parents(self.variantBlocks).append(self.appButton(elt));
  							}
  							// tei-wit should have been put into the sigla, so remove it
  							app.find("tei-wit").remove();
  							app.find("tei-rdg:empty").append("om. ");
  							if (n && appDiv.find("#app-l" + n).length == 0 || blocks.length > 0) {
  								app.prepend("<span class=\"lem\" id=\"app-l" + n + "\">" + n + "</span>");
  							}
  							app.find("tei-lem,tei-rdg").removeAttr("id");
  							app.children("tei-lem:parent").append("<span>] </span>");
  							appDiv.append(app);
  						}
  					});

  					// Add line numbers
  					var parents = ["tei-sp", "tei-ab", "tei-div", "tei-lem", "tei-lg"];
  					section.find(self.variantBlocks).each(function (i, elt) {
  						var e = $(elt);
  						if (Number(e.attr("n")) % 5 == 0 && parents.indexOf(elt.parentElement.localName) >= 0) {
  							e.attr("data-num", e.attr("n"));
  						}
  						e.find("button.app").wrapAll("<span class=\"apps\"></span>");
  					});

  					// Add apparatus links
  					section.find("button.app").each(function (i, elt) {
  						self.addToolTip(elt);
  					});

  					// Link up sigla in the apparatus to bibliography
  					appDiv.find("span.ref").each(function (i, elt) {
  						if (elt.hasAttribute("data-ref")) {
  							$(elt).attr("title", "");
  							$(elt).tooltip({
  								content: function content() {
  									var ref = $(self.escapeID($(elt).attr("data-ref")));
  									var title = void 0;
  									switch (ref[0].localName) {
  										case "tei-handnote":
  											title = $("<span>" + ref.parents("tei-witness,tei-bibl").find(">tei-title,tei-bibl>tei-title").first().html() + "</span>");
  											title.append("; ", ref.html());
  											break;
  										case "tei-listwit":
  											title = $("<span>" + ref.children("tei-head").html() + ": </span>");
  											title.append($.map(ref.children("tei-witness"), function (val) {
  												return $(val).find(">tei-title").html();
  											}).join(", "));
  											break;
  										case "tei-item":
  											title = $("<span>" + ref.html() + "</span>");
  											break;
  										case "tei-bibl":
  											title = $("<span>" + ref.html() + "</span>");
  										default:
  											title = $("<span>" + ref.find(">tei-title,tei-bibl>tei-title").first().html() + "</span>");
  									}
  									return "<div class=\"ref\">" + title.html() + "</div>";
  								}
  							});
  						}
  					});
  				})();
  			} else {
  				// View sources

  			}
  		}
  	}, {
  		key: "toggleApps",
  		value: function toggleApps(evt) {
  			$("tei-app[ana~=\"\\#" + evt.currentTarget.name + "\"]").each(function (i, elt) {
  				var btn = $("#button-" + $(elt).attr("id"));
  				if (evt.currentTarget.checked) {
  					btn.hide();
  				} else {
  					btn.show();
  				}
  			});
  			$("tei-rdg[ana~=\"\\#" + evt.currentTarget.name + "\"]").each(function (i, elt) {
  				if (evt.currentTarget.checked) {
  					$(elt).addClass("hidden");
  					$(elt).next("span").addClass("hidden");
  					if ($(elt.parentElement).children("tei-rdg").not(".hidden").length == 0) {
  						$("#button-" + $(elt.parentElement).attr("id")).hide();
  					}
  				} else {
  					$(elt).removeClass("hidden");
  					$(elt).next("span").removeClass("hidden");
  					$("#button-" + $(elt.parentElement).attr("id")).show();
  				}
  			});
  		}
  	}, {
  		key: "loadData",
  		value: function loadData(data) {
  			this.dom = data;
  			var self = this;
  			$(data).find("tei-app,tei-rdgGrp").each(function (i, elt) {
  				var remove = [];
  				// Strip whitespace inside app
  				for (var _i5 = 0; _i5 < elt.childNodes.length; _i5++) {
  					if (elt.childNodes[_i5].nodeType == Node.TEXT_NODE && !elt.childNodes[_i5].nodeValue.trim()) {
  						remove.push(elt.childNodes[_i5]);
  					}
  				}
  				remove.forEach(function (txt, index) {
  					elt.removeChild(txt);
  				});
  			});
  			// Add ids to app, lem, rdg, and rdgGrp if there are none
  			$(data).find("tei-app,tei-lem,tei-rdg,tei-rdgGrp").each(function (i, elt) {
  				var e = $(elt);
  				if (!e.attr("id")) {
  					e.attr("id", self.generateId());
  				}
  			});

  			// Add place notes
  			$(data).find("tei-add[place=margin]").append("<span class=\"note\"> (in mg.)</span>");

  			//Add navigation header
  			var nav = $("<div/>", { id: "navigation" });
  			nav.html("<h2>Contents:</h2><ul></ul>");
  			nav.appendTo("#controls");
  			var ul = nav.find("ul");
  			ul.append("<li><a href=\"#front\">Front Matter</a></li>");
  			var parts = $(data).find("tei-div[type=textpart]");
  			if (parts.length == 0) {
  				parts = $(data).find("tei-div[type=edition]");
  			}
  			parts.each(function (i, elt) {
  				ul.append("<li><a href=\"#" + $(elt).attr("id") + "\">" + $(elt).find("tei-head").html() + "</a></li>");
  			});
  			ul.append("<li><a href=\"#apparatus\">Apparatus</a></li>");

  			nav.find("a").click(function (e) {
  				$("a.selected").toggleClass("selected");
  				$(this).toggleClass("selected");
  				if ($(this).id != "apparatus") {
  					self.doSection($($(this).attr("href")));
  				}
  			});
  			$(":checkbox").change(this.toggleApps);
  			/*
     $(this.dom).find("tei-div[type=textpart],tei-front").each(function(i, elt){
     	self.doSection($(elt));
     });
     */
  			if (window.location.hash) {
  				self.doSection($(this.dom).find(window.location.hash));
  			} else {
  				self.doSection($(this.dom).find("#front"));
  			}

  			// cleanup
  			//this.dom = null;
  			//this.references = null;
  		}
  	}]);
  	return appcrit;
  }();

  return appcrit;

}());