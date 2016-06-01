var section = window.location.hash;

var genId = 0;

var generateId = function(prefix) {
	if (prefix) {
		return prefix + genId++;
	} else {
		return "id" + genId++;
	}
}

var swapLem = function(oldrdg) {
	if (oldrdg[0].localName == "tei-rdg") { // swapLem is a no-op if we clicked a lem
		var app = oldrdg.parents("tei-app").first();
		var oldlem;
		if ((oldlem = app.find(">tei-lem")).length == 0) {
			if ((oldlem = app.find("tei-rdgGrp>tei-lem")).length == 0) {
				if (app.attr("exclude")) {
					app.attr("exclude").split(/ /).forEach (function(val) {
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
			for (var i = 0; i < oldlem[0].attributes.length; i++) {
				newrdg.attr(oldlem[0].attributes[i].name, oldlem[0].attributes[i].value);
			}
			newrdg.append(oldlem.html());
			oldlem.replaceWith(newrdg[0].outerHTML);
			//reacquire handles to newlem and newrdg in the altered DOM
			newlem = $("#" + newlem.attr("id"));
			newrdg = $("#" + newrdg.attr("id"));
			var l, btn;
			if (app.find("tei-l").length > 0 && app.find("#button-" + app.attr("id").length == 0)) {
				// the app doesn't contain the button clicked, i.e. not a line-containing app or one containing only a rdg
				l = newlem.find("tei-l").first();
				if (l.length == 0) {
					l = newlem.parents("tei-l");
					if (l.length == 0) {
						l = app.prev("tei-l,tei-app");
						if (l.length > 0 && l[0].localName == "tei-app") {
							l = l.find("tei-lem tei-l").last();
						}
						if (l.length == 0) {
							l = app.next("tei-l,tei-app");
							if (l.length > 0 && l[0].localName == "tei-app") {
								l = l.find("tei-lem tei-l").first();
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
				btn.click(function (){
					$("#dialog-" + $(this).attr("data-app")).dialog("open");
				});
			}
			var oldapp = newrdg.parent("tei-app");
			if (oldapp.attr("id") != app.attr("id")) {
				if (oldlem.find("#button-" + oldapp.attr("id")).length > 0) {
					l = newrdg.parent("tei-app").find(">tei-lem tei-l");
					if (l.length == 0) {
						l = newrdg.parents("tei-l");
						if (l.length == 0) {
							l = oldapp.prev("tei-l,tei-app");
							if (l.length > 0 && l[0].localName == "tei-app") {
								l = l.find("tei-lem tei-l").last();
							}
							if (l.length == 0) {
								l = oldapp.next("tei-l,tei-app");
								if (l[0].localName == "tei-app") {
									l = l.find("tei-lem tei-l").first();
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
					btn.click(function (){
						$("#dialog-" + $(this).attr("data-app")).dialog("open");
					});
				}
			}
		}
	}
};
var applyWit = function(wit) {
	$("tei-text tei-rdg[wit]").each(function(i,elt) {
		var foo = $(elt);
		if (!foo.attr("copyOf")) {
			foo.attr("wit").split(/ /).forEach(function(val) {
				if (val == wit) {
					swapLem(foo);
				}
			});
		}
	});
}
var applySource = function(source) {
	$("tei-text tei-rdg[source]").each(function(i,elt){
		var foo = $(elt);
		if (!foo.attr("copyOf")) {
			foo.attr("source").split(/ /).forEach(function(val) {
				if (val == source) {
					swapLem(foo);
				}
			});
		}
	});
}
var ttip = function(elt) {
	return {
		content: function() {
			return "<div class=\"apparatus\">" + $("#copy-" + $(elt).attr("data-app")).html() + "</div>";
		},
		open: function(event, ui) {
			var app = $("#" + $(this).attr("data-app"));
			app.addClass("highlight");
			if (app.children("tei-lem").length == 0) {
				var exclude = app.attr("exclude");
				if (exclude) {
					exclude.split(/ /).forEach(function(val) {
						$(val).find("tei-l").addClass("highlight");
					});
				}
			}
			app.find("tei-l").addClass("highlight");
		},
		close: function(event, ui) {
			var app = $("#" + $(this).attr("data-app"));
			app.find("hr").remove();
			app.removeClass("highlight");
			if (app.children("tei-lem").length == 0) {
				var exclude = app.attr("exclude")
				if (exclude) {
					exclude.split(/ /).forEach(function(val) {
						$(val).find("tei-l").removeClass("highlight");
					});
				}
			}
			app.find("tei-l").removeClass("highlight");
		}
	};
}
var appToolTips = function() {
	section.find("button.app").each(function(i, elt) {
		if ($(elt).tooltip("instance")) {
			$(elt).tooltip("destroy");
		}
		$(elt).attr("title","");
		$(elt).tooltip(ttip(elt));
		$(elt).click(function (event) {
			// Add apparatus dialogs
			var d = $("#dialog-" + $(this).attr("data-app").replace(/dialog-/,""))
			if (d.length == 0) {
			  d = $("<div/>", {
					id: "dialog-" + $(this).attr("data-app"),
					class: "dialog",
					"data-exclude": $("#" + $(this).attr("data-id")).attr("exclude")});
				d.appendTo("body");
				var content = $("#copy-" + $(this).attr("data-app")).clone();
				content.find("span.lem").remove();
				d.html(content.html());
				if (content.attr("exclude")) {
					content.attr("exclude").split(/ /).forEach(function(val) {
						d.append($(val).html());
					});
				}
				d.find("*[id]").each(function(i, elt) {
					$(elt).attr("data-id", $(elt).attr("id"));
				});
				d.find("*[id]").removeAttr("id");
				d.find("tei-note[target]").each(function(i, elt) {
					$(elt).attr("data-id", $(elt).attr("target").replace(/#/, ""));
				});
				if ($(elt).find("tei-l").length > 0) {
					d.find("tei-lem,tei-rdg,tei-rdgGrp").remove();
				}
				d.find("tei-lem:empty").append("om. ");
				d.find("tei-rdg:empty").append("om. ");
				d.find("tei-rdg,tei-lem,tei-note[data-id],span[data-id]").each(function(i, elt) {
					$(elt).click(function(evt) {
						var rdg = $("#" + escapeID($(evt.currentTarget).attr("data-id")));
						swapLem(rdg);
						if (rdg.attr("data-copyFrom")) {
							swapLem($(rdg.attr("data-copyFrom")));
						}
						if (rdg.attr("data-copy")) {
							swapLem($(rdg.attr("data-copy")));
						}
					});
				});
				d.dialog({
					autoOpen: false,
					open: function(event) {
						$("#" + $(this).attr("id").replace(/dialog/, "button")).tooltip("destroy");
						$("#" + $(this).attr("id").replace(/dialog-/, "")).addClass("highlight");
						$("#" + $(this).attr("id").replace(/dialog-/, "")).find("tei-l").addClass("highlight");
					},
					close: function(event) {
						$("#" + $(this).attr("id").replace(/dialog-/, "")).removeClass("highlight");
						$("#" + $(this).attr("id").replace(/dialog-/, "")).find("tei-l").removeClass("highlight");
						var btn = $("#" + $(this).attr("id").replace(/dialog/, "button"));
						if (btn.tooltip("instance")) {
							btn.tooltip("destroy");
						}
						btn.tooltip(ttip(btn[0]));
					}
				});
			}
			d.dialog("open");
		});
	});
}

var escapeID = function(id) {
	return id.replace(/([\.,])/g, "\\$1");
}

var getLabel = function(val) {
	var elt = $(escapeID(val));
	if (elt.length > 0 && elt.attr("n")) {
		return elt.attr("n");
	} else {
		return val.replace(/#/, '');
	}
}

var refLabel = function(ref) {
	var elt = $(escapeID(ref));
	if (elt.attr("n")) {
		return elt.attr("n");
	} else {
		return elt.attr("id");
	}
}

var witOrSource = function(elt) {
	return elt.attr("wit")?elt.attr("wit"):elt.attr("source");
}

// Set up app. crit.
var addSigla = function(i, elt) {
	if (elt.parentElement) {
		// Find labels (@n) for items referenced via @wit and/or @source
		var wit = "";
		var source = "";
		var corr = "";
		var lines = "";
		var e = $(elt);
		e.attr("data-id", e.attr("id"));
		e.removeAttr("id");
		// Add note for corrections
		if (elt.localName == "tei-rdggrp" && e.attr("type") && e.attr("type").match(/corr/i)) {
			var rdg = e.children("tei-rdg:not(:first-child)");
			corr = "<span class=\"ref\" data-id=\"" + $(rdg).attr("id") + "\" data-ref=\"" + witOrSource(rdg) + "\">(corr. " + refLabel(witOrSource(rdg)) + ")</span>"
			rdg.remove();
		}
		// Add witness sigla
		if (e.attr("wit")) {
			e.attr("wit").split(/ /).forEach(function(val) {
				wit += "<span class=\"ref\" data-id=\"" + e.attr("data-id") + "\" data-ref=\"" + val + "\">" + refLabel(val) + "</span>";
				e.siblings("tei-witDetail[target=\"#" + e.attr("data-id") + "\"][wit=\"" + val + "\"]").each(function(i, elt) {
					wit += " (" + elt.innerHTML + ") ";
				});
			});
		}
		// Add source references
		if (e.attr("source")) {
			e.attr("source").split(/ /).forEach(function(val) {
				source += " <span class=\"ref\" data-id=\"" + e.attr("data-id") + "\" data-ref=\"" + val + "\">" + refLabel(val) + "</span> ";
			});
		}
		if ((wit + source + corr).length > 0) {
			$(elt).after(" <span class=\"source\">" + wit + source + corr + "</span>");
		}
	}
}

var copy = function(elt) {
	var e = $(elt);
	e.html($(escapeID(e.attr("copyof"))).html());
	// have to rewrite ids in copied content so there are no duplicates
	e.find("*[id]").each(function(i, elt) {
		$(elt).attr("data-copyFrom", "#" + $(elt).attr("id"));
		$(elt).attr("id", generateId());
		$($(elt).attr("data-copyFrom")).attr("data-copy", "#" + $(elt).attr("id"));
		$(elt).addClass("app-copy");
	});
	e.find("*[copyof]").each(function(i, elt) {
		copy(elt);
	});
}

var loadSection = function(id) {
	var stamp = Date.now();
	$("tei-div[type=textpart],tei-sourceDesc").css("display", "none");
	if (id) {
		section = $(id);
	} else {
		section = $($("tei-div[type=textpart]")[0]);
	}
	section.css("display", "block");

	// Add Apparatus div
	$("div#apparatus").remove();

	if (section.find("tei-app").length > 0) {
		$("tei-TEI").after("<div id=\"apparatus\" class=\"apparatus\"><h2>Apparatus</h2></div>");

		// Pull content into @copyOf elements
		section.find("*[copyOf]").each(function(i, elt) {
			copy(elt);
		});

		section.find("tei-app").each(function(i, elt) {
			var app = $(elt).clone();
			var n, lines
			app.attr("id", "copy-" + app.attr("id"));
			// clean up descendant apps
			var lem = app.children("tei-lem");
			if (lem.find("tei-app").length > 0) {
				lem.find("tei-rdg,tei-rdggrp,tei-note").remove();
				lem.find("tei-lem").removeAttr("wit").removeAttr("source");
			}
			if (lem.children("tei-l").length == 0) {
				lem.html(lem.text().replace(/\n/g, " ").replace(/^(\S+) .+ (\S+)/, "$1...$2"));
			}
			app.find("tei-lem,tei-rdg,tei-rdggrp").each(addSigla);
			if (app.find(">tei-lem:empty,>tei-rdg:empty,>tei-rdgGrp>tei-rdg:empty").length > 0 && app.find("tei-l").length > 0) {
				var lines;
				var lem = app.children("tei-lem");
				if (lem.find("tei-l").length > 1) {
					lines = "<span class=\"ref lineref\" data-id=\"" + lem.attr("data-id") + "\">ll. " + lem.find("tei-l:first-child").attr("n") + "–" + lem.find("tei-l:last-child").attr("n") + "</span> ";
				} else {
					lines = "<span class=\"ref lineref\" data-id=\"" + lem.attr("data-id") + "\">l. " + lem.find("tei-l").attr("n") + "</span> ";
				}
				app.prepend(lines);
			}
			if ((lines = app.find("tei-l")).length > 0) {
				n = $(lines[0]).attr("n");
				if (!n) {
					n = $($(lines[0]).attr("copyOf")).attr("n");
				}
				if (lines.length > 1) {
					if ($(lines[lines.length - 1]).attr("n")) {
						n += "–" + $(lines[lines.length - 1]).attr("n");
					} else {
						n += "–" + $($(lines[lines.length - 1]).attr("copyOf")).attr("n");
					}
				}
				var l = $(elt).find("tei-lem").find("tei-l");
				if (l.length == 0) {
					l = $(elt).next("tei-l,tei-app");
				}
				l.first().append("<button id=\"button-" + $(elt).attr("id") + "\" title=\"\" class=\"app\" data-app=\"" + $(elt).attr("id") + "\">?</button>");
				app.find("tei-lem:not(:empty)").remove();
				app.find("tei-rdg:not(:empty)").remove();
			} else {
				n = $(elt).parents("tei-l").attr("n");
				if (!n) {
					n = $($(elt).parents("tei-l").attr("copyOf")).attr("n");
				}
				$(elt).parents("tei-l").append("<button id=\"button-" + $(elt).attr("id") + "\" title=\"\" class=\"app\" data-app=\"" + $(elt).attr("id") + "\">?</button>");
			}
			app.find("tei-lem:empty").append("om. ");
			app.find("tei-rdg:empty").append("om. ");
			if ($("#app-l" + n).length == 0 || lines.length > 0) {
				app.prepend("<span class=\"lem\" id=\"app-l" + n +"\">" + n + "</span>");
			}
			app.find("tei-lem,tei-rdg").removeAttr("id");
			$("div#apparatus").append(app);
		});

		// Add line numbers
		var parents = ["tei-sp", "tei-ab", "tei-div", "tei-lem"];
		section.find("tei-l").each(function(i,elt){
			var e = $(elt);
			if (Number(e.attr("n")) % 5 == 0 && (parents.indexOf(elt.parentElement.localName) >= 0)) {
				e.attr("data-lineno",e.attr("n"));
			}
			e.find("button.app").wrapAll("<span class=\"apps\"></span>");
		});

		// Add apparatus links
		appToolTips();



		// Link up sigla in the apparatus to bibliography
		$("div#apparatus span.ref").each(function(i, elt) {
			$(elt).attr("title","");
			$(elt).tooltip({
				content: function() {
					return "<div class=\"ref\">" + $(escapeID($(elt).attr("data-ref"))).html() + "</div>";
				},
			});
		});
	} else {
		// View sources

	}
}

var loadData = function(data) {
	$(data).find("tei-app,tei-rdgGrp").each(function(i, elt) {
		var remove = [];
		// Strip whitespace inside app
		for (var i = 0; i < elt.childNodes.length; i ++) {
			if (elt.childNodes[i].nodeType == Node.TEXT_NODE && !elt.childNodes[i].nodeValue.trim()) {
				remove.push(elt.childNodes[i]);
			}
		}
		remove.forEach(function(txt, index) {
			elt.removeChild(txt);
		});
	});
	// Add ids to app, lem, rdg, and rdgGrp if there are none
	$(data).find("tei-app,tei-lem,tei-rdg,tei-rdgGrp").each(function(i, elt) {
		var e = $(elt);
		if (!e.attr("id")) {
			e.attr("id",generateId());
		}
	});
	document.getElementsByTagName("body")[0].appendChild(data);
	// If a section is specified, then show that one and load it up;
	// otherwise load the first one.
	loadSection(section);
	//Add navigation header
	var nav = $("<div/>", {id:"navigation"});
	nav.html("<h2>Contents:</h2><ul></ul>");
	nav.appendTo("body");
	$("tei-div[type=textpart]").each(function(i, elt) {
		nav.find("ul").append("<li><a href=\"#" + $(elt).attr("id") + "\">" + $(elt).find("tei-head").html() + "</a></li>");
	});
	nav.find("ul").append("<li><a href=\"#sources\">Sources</a></li>");
	// Add event listeners to ToC
	$("div#navigation a").click(function(evt) {
		$("div#navigation a.clicked").removeClass("clicked");
		var elt = $(evt.target).addClass("clicked");
		$("span.apps").remove();
		loadSection($(evt.target).attr("href"));
		return false;
	});
}
