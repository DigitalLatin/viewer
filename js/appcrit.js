var section = window.location.hash;

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
			appToolTips();
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
			if (app.find(">tei-lem").length == 0) {
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
			if (app.find(">tei-lem").length == 0) {
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
	section.find("tei-l button").each(function(i, elt) {
		if ($(elt).tooltip("instance")) {
			$(elt).tooltip("destroy");
		}
		$(elt).attr("title","");
		$(elt).tooltip(ttip(elt));
		$(elt).click(function (){
			$("#dialog-" + $(this).attr("data-app")).dialog("open");
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

var loadSection = function(id) {
	var stamp = Date.now();
	$("tei-div.textpart,tei-sourceDesc").css("display", "none");
	if (id) {
		section = $(id);
	} else {
		section = $($("tei-div.textpart")[0]);
	}
	section.css("display", "block");

	// Add Apparatus div
	$("div#apparatus").remove();

	if (section.find("tei-app").length > 0) {
		$("tei-TEI").after("<div id=\"apparatus\" class=\"apparatus\"><h2>Apparatus</h2></div>");
		// Set up app. crit.

		// Pull content into @copyOf elements
		section.find("*[copyOf]").each(function(i, elt) {
			var e = $(elt);
			e.html($(escapeID(e.attr("copyOf"))).clone().contents());
			// have to rewrite ids in copied content so there are no duplicates
			e.find("*[id]").each(function(i, elt) {
				$(elt).attr("copyOf", "#" + $(elt).attr("id"));
				$(elt).attr("id", $(elt).attr("id") + Math.random().toString(36).substr(2));
				$($(elt).attr("copyOf")).attr("data-copy", "#" + $(elt).attr("id"));
				$(elt).addClass("app-copy");
			});
		});

		section.find("tei-app").each(function(i, elt) {
			var app = $(elt).clone();
			var n, lines
			app.attr("id", "copy-" + app.attr("id"));
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
				app.find("tei-lem").remove();
				app.find("tei-rdg").remove();
			} else {
				n = $(elt).parent("tei-l").attr("n");
				if (!n) {
					n = $($(elt).parent("tei-l").attr("copyOf")).attr("n");
				}
				$(elt).parent("tei-l").append("<button id=\"button-" + $(elt).attr("id") + "\" title=\"\" class=\"app\" data-app=\"" + $(elt).attr("id") + "\">?</button>");
			}
			if ($("#app-l" + n).length == 0 || lines.length > 0) {
				app.prepend("<span class=\"lem\" id=\"app-l" + n +"\">" + n + "</span>");
			}
			app.find("tei-lem,tei-rdg").removeAttr("id");
			$("div#apparatus").append(app);
		});

		// Add line numbers
		section.find("tei-l").each(function(i,elt){
			var e = $(elt);
			if (Number(e.attr("n")) % 5 == 0 && (elt.parentElement.localName == "tei-sp" || elt.parentElement.localName == "tei-ab" || elt.parentElement.localName == "tei-lem")) {
				e.attr("data-lineno",e.attr("n"));
			}
			e.find("button.app").wrapAll("<span class=\"apps\"></span>");
		});

		// Add apparatus links
		appToolTips();

		// Add apparatus dialogs
		$("button.app").each(function(i, elt) {
			var d = $("#dialog-" + $(elt).attr("data-app"));
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
					var btn = $("#" + $(this).attr("id").replace(/dialog/, "button"))
					if (btn.tooltip("instance")) {
						btn.tooltip("destroy");
					}
					appToolTips();
				}
			});
			d.find("tei-rdg,tei-lem,tei-note[data-id],span[data-id]").each(function(i, elt) {
					$(elt).click(function(evt) {
						var rdg = $("#" + escapeID($(evt.currentTarget).attr("data-id")));
						swapLem(rdg);
						if (rdg.attr("copyOf")) {
							swapLem($(rdg.attr("copyOf")));
						}
						if (rdg.attr("data-copy")) {
							swapLem($(rdg.attr("data-copy")));
						}
					});
				});
		});

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

// Execute after the document is loaded
$(function() {

	if (!document.registerElement) {
		$("tei-ptr").each(function(i, elt) {
			var e = $(elt);
			e.html('<a href="' + e.attr("target") + '">' + e.attr("target").replace(/https?:\/\/([^/]+)\/.*/, "$1") + '</a>');
		});
		$("tei-ref").click(function(evt) {
			window.location = $(evt.target).attr("target");
		});
	}
	// If a section is specified, then show that one and load it up;
	// otherwise load the first one.
	loadSection(section);

	// Add event listeners to ToC
	$("div#navigation a").click(function(evt) {
		$("div#navigation a.clicked").removeClass("clicked");
		var elt = $(evt.target).addClass("clicked");
		$("span.apps").remove();
		loadSection($(evt.target).attr("href"));
		return false;
	})
});
