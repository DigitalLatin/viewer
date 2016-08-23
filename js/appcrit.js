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
  	function appcrit() {
  		classCallCheck(this, appcrit);

  		this.section = window.location.hash;
  		this.variantBlocks = "tei-l,tei-speaker,tei-p";
  		this.genId = 0;
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
  				var app = oldrdg.parents("tei-app").first();
  				var oldlem = void 0;
  				if ((oldlem = app.find(">tei-lem")).length == 0) {
  					if ((oldlem = app.find("tei-rdgGrp>tei-lem")).length == 0) {
  						if (app.attr("exclude")) {
  							app.attr("exclude").split(/ /).forEach(function (val) {
  								if ($(val).find(">tei-lem").length > 0) {
  									oldlem = $(val).find(">tei-lem");
  								}
  							});
  						}
  					}
  				}
  				if (oldlem.length > 0) {
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
  					newlem = $("#" + newlem.attr("id"));
  					newrdg = $("#" + newrdg.attr("id"));
  					newlem.find("button.app").each(function (i, elt) {
  						self.addToolTip(elt);
  					});
  					var l = void 0,
  					    btn = void 0;
  					if (app.find(this.variantBlocks).length > 0 && app.find("#button-" + app.attr("id").length == 0)) {
  						// the app doesn't contain the button clicked, e.g. not a line-containing app or one containing only a rdg
  						l = newlem.find(this.variantBlocks).first();
  						if (l.length == 0) {
  							l = newlem.parents(this.variantBlocks);
  							if (l.length == 0) {
  								l = app.prev(this.variantBlocks + ",tei-app");
  								if (l.length > 0 && l[0].localName == "tei-app") {
  									l = l.find("tei-lem " + this.variantBlocks).last();
  								}
  								if (l.length == 0) {
  									l = app.next(this.variantBlocks + ",tei-app");
  									if (l.length > 0 && l[0].localName == "tei-app") {
  										l = l.find("tei-lem " + this.variantBlocks).first();
  									}
  								}
  							}
  						}
  						btn = $("#button-" + app.attr("id"));
  						if (l.find("span.apps").length > 0) {
  							l.find("span.apps").first().append(btn.detach());
  						} else {
  							l.append($("<span class=\"apps\"></span>").append(btn.detach()));
  						}
  						btn.click(function () {
  							$("#dialog-" + $(this).attr("data-app")).dialog("open");
  						});
  					}
  					oldapp = newrdg.parent("tei-app");
  					if (oldapp.attr("id") != app.attr("id")) {
  						if (oldlem.find("#button-" + oldapp.attr("id")).length > 0) {
  							l = newrdg.parent("tei-app").find(">tei-lem " + this.variantBlocks);
  							if (l.length == 0) {
  								l = newrdg.parents(this.variantBlocks);
  								if (l.length == 0) {
  									l = oldapp.prev(this.variantBlocks + ",tei-app");
  									if (l.length > 0 && l[0].localName == "tei-app") {
  										l = l.find("tei-lem " + this.variantBlocks).last();
  									}
  									if (l.length == 0) {
  										l = oldapp.next(this.variantBlocks + ",tei-app");
  										if (l[0].localName == "tei-app") {
  											l = l.find("tei-lem " + this.variantBlocks).first();
  										}
  									}
  								}
  							}
  							$("#button-" + oldapp.attr("id")).remove();
  							btn = oldlem.find("#button-" + oldapp.attr("id"));
  							if (l.find("span.apps").length > 0) {
  								l.find("span.apps").first().append(btn.detach());
  							} else {
  								l.append($("<span class=\"apps\"></span>").append(btn.detach()));
  							}
  							btn.click(function () {
  								$("#dialog-" + $(this).attr("data-app")).dialog("open");
  							});
  						}
  					}
  					if (newlem.attr("require")) {
  						newlem.attr("require").split(/ /).forEach(function (val) {
  							var req = $(val);
  							if (req[0].localName == "tei-rdg") {
  								self.swapLem(req);
  							}
  						});
  					}
  				}
  			}
  		}
  	}, {
  		key: "ttip",
  		value: function ttip(elt) {
  			var self = this;
  			return {
  				content: function content() {
  					return "<div class=\"apparatus\">" + $("#copy-" + $(elt).attr("data-app")).html() + "</div>";
  				},
  				open: function open(event, ui) {
  					var app = $("#" + $(this).attr("data-app"));
  					app.addClass("highlight");
  					if (app.children("tei-lem").length == 0) {
  						var exclude = app.attr("exclude");
  						if (exclude) {
  							exclude.split(/ /).forEach(function (val) {
  								$(val).find(self.variantBlocks).addClass("highlight");
  							});
  						}
  					}
  					app.find(self.variantBlocks).addClass("highlight");
  				},
  				close: function close(event, ui) {
  					var app = $("#" + $(this).attr("data-app"));
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
  				}
  			};
  		}
  	}, {
  		key: "addToolTip",
  		value: function addToolTip(elt) {
  			if ($(elt).tooltip("instance")) {
  				$(elt).tooltip("destroy");
  			}
  			$(elt).attr("title", "");
  			$(elt).tooltip(this.ttip(elt));
  			var self = this;
  			$(elt).click(function (event) {
  				// Add apparatus dialogs
  				var d = $("#dialog-" + $(this).attr("data-app").replace(/dialog-/, ""));
  				if (d.length == 0) {
  					d = $("<div/>", {
  						id: "dialog-" + $(this).attr("data-app"),
  						class: "dialog",
  						"data-exclude": $("#" + $(this).attr("data-id")).attr("exclude") });
  					d.appendTo("body");
  					var content = $("#copy-" + $(this).attr("data-app")).clone();
  					content.find("span.lem").remove();
  					d.html(content.html());
  					if (content.attr("exclude")) {
  						content.attr("exclude").split(/ /).forEach(function (val) {
  							d.append($(val).html());
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
  							if (rdg.attr("data-copyFrom")) {
  								self.swapLem($(rdg.attr("data-copyFrom")));
  							}
  							if (rdg.attr("data-copy")) {
  								self.swapLem($(rdg.attr("data-copy")));
  							}
  						});
  					});
  					d.dialog({
  						autoOpen: false,
  						open: function open(event) {
  							$("#" + $(this).attr("id").replace(/dialog/, "button")).tooltip("destroy");
  							$("#" + $(this).attr("id").replace(/dialog-/, "")).addClass("highlight");
  							$("#" + $(this).attr("id").replace(/dialog-/, "")).find(this.variantBlocks).addClass("highlight");
  						},
  						close: function close(event) {
  							$("#" + $(this).attr("id").replace(/dialog-/, "")).removeClass("highlight");
  							$("#" + $(this).attr("id").replace(/dialog-/, "")).find(this.variantBlocks).removeClass("highlight");
  							var btn = $("#" + $(this).attr("id").replace(/dialog/, "button"));
  							if (btn.tooltip("instance")) {
  								btn.tooltip("destroy");
  							}
  							btn.tooltip(self.ttip(btn[0]));
  						}
  					});
  				}
  				d.dialog("open");
  			});
  		}
  	}, {
  		key: "appToolTips",
  		value: function appToolTips() {
  			var self = this;
  			this.section.find("button.app").each(function (i, elt) {
  				self.addToolTip(elt);
  			});
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
  			var elt = $(this.escapeID(ref));
  			if (elt.attr("n")) {
  				return elt.attr("n");
  			} else {
  				return elt.attr("id");
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
  								$("tei-witDetail[target=\"#" + e.attr("data-id") + "\"][wit=\"" + val + "\"]").each(function (i, elt) {
  									wit += ", " + elt.innerHTML;
  								});
  							});
  						}
  						// Add source references
  						if (e.attr("source")) {
  							e.attr("source").split(/ /).forEach(function (val) {
  								source += " <span class=\"ref\" data-id=\"" + e.attr("data-id") + "\" data-ref=\"" + val + "\">" + self.refLabel(val) + "</span> ";
  							});
  						}
  						if ((wit + source + corr).length > 0) {
  							$(elt).after(" <span class=\"source\">" + wit + source + corr + "</span>");
  						}
  					})();
  				}
  			};
  		}
  	}, {
  		key: "copy",
  		value: function copy(elt) {
  			var e = $(elt);
  			e.html($(this.escapeID(e.attr("copyof"))).html());
  			// have to rewrite ids in copied content so there are no duplicates
  			var self = this;
  			e.find("*[id]").each(function (i, elt) {
  				$(elt).attr("data-copyFrom", "#" + $(elt).attr("id"));
  				$(elt).attr("id", self.generateId());
  				$($(elt).attr("data-copyFrom")).attr("data-copy", "#" + $(elt).attr("id"));
  				$(elt).addClass("app-copy");
  			});
  			e.find("*[copyof]").each(function (i, elt) {
  				self.copy(elt);
  			});
  		}
  	}, {
  		key: "loadSection",
  		value: function loadSection(id, ceteicean) {
  			var _this = this;

  			var self = this;
  			var stamp = Date.now();
  			$("tei-div[type=textpart],tei-sourceDesc,tei-front").css("display", "none");
  			if (id) {
  				this.section = $(id);
  			} else {
  				this.section = $($("tei-div[type=textpart]")[0]);
  			}
  			this.section.css("display", "block");

  			// Add Apparatus div
  			$("div#apparatus").remove();

  			if (this.section.find("tei-app").length > 0) {
  				(function () {
  					$("tei-TEI").after("<div id=\"apparatus\" class=\"apparatus\"><h2>Apparatus</h2></div>");

  					// Pull content into @copyOf elements
  					_this.section.find("*[copyOf]").each(function (i, elt) {
  						self.copy(elt);
  					});

  					_this.section.find("tei-app").each(function (i, elt) {
  						var app = void 0;
  						if (document.registerElement) {
  							app = $(elt.outerHTML);
  						} else {
  							app = $(elt).clone(true, true);
  						}
  						var n = void 0,
  						    lines = void 0,
  						    unit = void 0;
  						app.attr("id", "copy-" + app.attr("id"));
  						// clean up descendant apps
  						var lem = app.children("tei-lem");
  						if (lem.find("tei-app").length > 0) {
  							lem.find("tei-rdg,tei-rdggrp,tei-note").remove();
  							lem.find("tei-lem").removeAttr("wit").removeAttr("source");
  						}
  						if (lem.children(this.variantBlocks).length == 0) {
  							lem.html(lem.text().replace(/\n/g, " ").replace(/^(\S+) .+ (\S+)/, "$1...$2"));
  						}
  						app.find("tei-lem,tei-rdg,tei-rdggrp").each(self.addSigla());
  						var blocks = void 0;
  						if (app.find(">tei-lem:empty,>tei-rdg:empty,>tei-rdgGrp>tei-rdg:empty").length > 0 && app.find(self.variantBlocks).length > 0) {
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
  						if ((blocks = app.find(self.variantBlocks)).length > 0) {
  							n = $(blocks[0]).attr("n");
  							if (!n) {
  								n = $($(blocks[0]).attr("copyOf")).attr("n");
  							}
  							if (blocks.length > 1) {
  								if ($(blocks[blocks.length - 1]).attr("n")) {
  									n += "–" + $(blocks[blocks.length - 1]).attr("n");
  								} else {
  									n += "–" + $($(blocks[blocks.length - 1]).attr("copyOf")).attr("n");
  								}
  							}
  							var l = $(elt).find("tei-lem").find(self.variantBlocks);
  							if (l.length == 0) {
  								l = $(elt).next(self.variantBlocks + ",tei-app");
  							}
  							l.first().append("<button id=\"button-" + $(elt).attr("id") + "\" title=\"\" class=\"app\" data-app=\"" + $(elt).attr("id") + "\">?</button>");
  							app.find("tei-lem:not(:empty)").remove();
  							app.find("tei-rdg:not(:empty)").remove();
  						} else {
  							n = $(elt).parents(self.variantBlocks).attr("n");
  							if (!n) {
  								n = $($(elt).parents(self.variantBlocks).attr("copyOf")).attr("n");
  							}
  							$(elt).parents(self.variantBlocks).append("<button id=\"button-" + $(elt).attr("id") + "\" title=\"\" class=\"app\" data-app=\"" + $(elt).attr("id") + "\">?</button>");
  						}
  						app.find("tei-lem:empty").append("om. ");
  						app.find("tei-rdg:empty").append("om. ");
  						if (n && $("#app-l" + n).length == 0 || blocks.length > 0) {
  							app.prepend("<span class=\"lem\" id=\"app-l" + n + "\">" + n + "</span>");
  						}
  						app.find("tei-lem,tei-rdg").removeAttr("id");
  						$("div#apparatus").append(app);
  					});

  					// Add line numbers
  					var parents = ["tei-sp", "tei-ab", "tei-div", "tei-lem"];
  					_this.section.find(_this.variantBlocks).each(function (i, elt) {
  						var e = $(elt);
  						if (Number(e.attr("n")) % 5 == 0 && parents.indexOf(elt.parentElement.localName) >= 0) {
  							e.attr("data-num", e.attr("n"));
  						}
  						e.find("button.app").wrapAll("<span class=\"apps\"></span>");
  					});

  					// Add apparatus links
  					_this.appToolTips();

  					// Link up sigla in the apparatus to bibliography
  					$("div#apparatus span.ref").each(function (i, elt) {
  						$(elt).attr("title", "");
  						$(elt).tooltip({
  							content: function content() {
  								return "<div class=\"ref\">" + $(self.escapeID($(elt).attr("data-ref"))).html() + "</div>";
  							}
  						});
  					});
  				})();
  			} else {
  				// View sources

  			}
  		}
  	}, {
  		key: "loadData",
  		value: function loadData() {
  			var self = this;
  			return function (data, ceteicean) {
  				$(data).find("tei-app,tei-rdgGrp").each(function (i, elt) {
  					var remove = [];
  					// Strip whitespace inside app
  					for (var _i2 = 0; _i2 < elt.childNodes.length; _i2++) {
  						if (elt.childNodes[_i2].nodeType == Node.TEXT_NODE && !elt.childNodes[_i2].nodeValue.trim()) {
  							remove.push(elt.childNodes[_i2]);
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
  				document.getElementsByTagName("body")[0].appendChild(data);
  				// If a section is specified, then show that one and load it up;
  				// otherwise load the first one.
  				self.loadSection(self.section, ceteicean);
  				//Add navigation header
  				var nav = $("<div/>", { id: "navigation" });
  				nav.html("<h2>Contents:</h2><ul></ul>");
  				nav.appendTo("body");
  				nav.find("ul").append("<li><a href=\"#front\">Front Matter</a></li>");
  				$("tei-div[type=textpart]").each(function (i, elt) {
  					nav.find("ul").append("<li><a href=\"#" + $(elt).attr("id") + "\">" + $(elt).find("tei-head").html() + "</a></li>");
  				});
  				// Add event listeners to ToC
  				$("div#navigation a").click(function (evt) {
  					$("div#navigation a.clicked").removeClass("clicked");
  					var elt = $(evt.target).addClass("clicked");
  					$("span.apps").remove();
  					self.loadSection($(evt.target).attr("href"));
  					return false;
  				});
  			};
  		}
  	}]);
  	return appcrit;
  }();

  // Make main class available to pre-ES6 browser environments


  if (window) {
  	window.appcrit = appcrit;
  }

  return appcrit;

}());