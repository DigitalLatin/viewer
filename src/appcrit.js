class appcrit {

	constructor() {
		this.variantBlocks = "tei-l,tei-speaker,tei-p";
		this.genId = 0;
		this.dom = null;
		this.references = {};
		this.log = [];
	}

	generateId(prefix) {
		if (prefix) {
			return prefix + this.genId++;
		} else {
			return "id" + this.genId++;
		}
	}

	swapLem(oldrdg, evt) {
		let self = this;
		if (oldrdg[0].localName == "tei-rdg") { // swapLem is a no-op if we clicked a lem
			let copyfrom = oldrdg.attr("data-copyfrom");
			let oldrdgid = oldrdg.attr("id");
			let app = oldrdg.parents("tei-app").first();
			let oldlem;
			if ((oldlem = app.find(">tei-lem")).length == 0) {
				if ((oldlem = app.find("tei-rdgGrp>tei-lem")).length == 0) {
					if (app.attr("exclude")) {
						app.attr("exclude").split(/ /).forEach (function(val) {
							if ($(self.escapeID(val)).find(">tei-lem").length > 0) {
								oldlem = $(self.escapeID(val)).find(">tei-lem");
							}
						});
					}
				}
			}
			if (oldlem.length > 0) {
				this.log.push({"lem": oldlem.attr("id"), "rdg": oldrdg.attr("id")});
				let oldapp = oldlem.parent("tei-app");
				let newlem = $("<tei-lem/>");
				for (let i = 0; i < oldrdg[0].attributes.length; i++) {
					newlem.attr(oldrdg[0].attributes[i].name, oldrdg[0].attributes[i].value);
				}
				newlem.append(oldrdg.html());
				oldrdg.replaceWith(newlem[0].outerHTML);
				let newrdg = $("<tei-rdg/>");
				for (let i = 0; i < oldlem[0].attributes.length; i++) {
					newrdg.attr(oldlem[0].attributes[i].name, oldlem[0].attributes[i].value);
				}
				newrdg.append(oldlem.html());
				oldlem.replaceWith(newrdg[0].outerHTML);
				//reacquire handles to newlem and newrdg in the altered DOM
				newlem = $("#" + self.escapeID(newlem.attr("id")));
				newrdg = $("#" + self.escapeID(newrdg.attr("id")));
				let l;
				// Grab the button we clicked to open the dialog. We might need to move it.
				let btn;
				let append = false;
				if (evt) {
					btn = $("#" + self.escapeID($(evt.currentTarget).parents("div").first().attr("id").replace(/^dialog/, "button")));
				}
				if (app.find(this.variantBlocks).length > 0 && btn && app.find("#" + btn.attr("id").length == 0)) {
					// It's a line-containing app, but doesn't contain the button; button needs to be moved
					l = newlem.find(this.variantBlocks).first();
					if (l.length == 0) {
						// Look for a line preceding the app that can contain the button
						l = $(document.evaluate("preceding::*["
							+ this.variantBlocks.split(',').map(function(val) {return "local-name(.) = '" + val + "'";}).join(" or ")
							+ "][not(ancestor::tei-app) or parent::tei-lem][1]", btn[0], null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue);
						if (l.length > 0) {
							append = true;
						}
						// look for a following line instead
						if (l.length == 0) {
							l = $(document.evaluate("following::*["
								+ this.variantBlocks.split(',').map(function(val) {return "local-name(.) = '" + val + "'";}).join(" or ")
								+ "][not(ancestor::tei-app) or parent::tei-lem][1]", btn[0], null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue);
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
					app.find("button").each(function(i, elt) {
						self.addToolTip(elt);
					});
				}
				oldapp = newrdg.parent("tei-app");
				if (newlem.attr("require")) {
					newlem.attr("require").split(/ /).forEach(function(val) {
						let req = $(val);
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
			$("*[data-copyfrom=" + self.escapeID(oldrdgid) + "]").each(function(i, elt){
				self.swapLem($(elt));
			});
		}
	}

	ttip(elt) {
		let self = this;
		return {
			content: function() {
				return "<div class=\"apparatus\">" + $("#copy-" + self.escapeID($(elt).attr("data-app"))).html() + "</div>";
			},
			open: function(event, ui) {
				let app = $("#" + self.escapeID($(this).attr("data-app")));
				app.addClass("highlight");
				if (app.children("tei-lem").length == 0) {
					let exclude = app.attr("exclude");
					if (exclude) {
						exclude.split(/ /).forEach(function(val) {
							$(self.escapeID(val)).find(self.variantBlocks).addClass("highlight");
						});
					}
				}
				app.find(self.variantBlocks).addClass("highlight");
			},
			close: function(event, ui) {
				let app = $("#" + self.escapeID($(this).attr("data-app")));
				app.find("hr").remove();
				app.removeClass("highlight");
				if (app.children("tei-lem").length == 0) {
					let exclude = app.attr("exclude")
					if (exclude) {
						exclude.split(/ /).forEach(function(val) {
							$(val).find(self.variantBlocks).removeClass("highlight");
						});
					}
				}
				app.find(self.variantBlocks).removeClass("highlight");
				$(this).attr("title","");
			}
		};
	}

	addToolTip(elt) {
		if ($(elt).tooltip("instance")) {
			$(elt).tooltip("destroy");
		}
		$(elt).attr("title","");
		$(elt).tooltip(this.ttip(elt));
		let self = this;
		$(elt).click(function (event) {
			// Add apparatus dialogs
			let d = $("#dialog-" + self.escapeID($(this).attr("data-app")).replace(/dialog-/,""))
			if (d.length == 0) {
				d = $("<div/>", {
					id: "dialog-" + $(this).attr("data-app"),
					class: "dialog",
					"data-exclude": $("#" + self.escapeID($(this).attr("data-app"))).attr("exclude")});
				d.appendTo("body");
				let content = $("#copy-" + self.escapeID($(this).attr("data-app"))).clone();
				content.find("span.lem").remove();
				d.html(content.html());
				if (content.attr("exclude")) {
					content.attr("exclude").split(/ /).forEach(function(val) {
						let excl = $(self.escapeID(val).replace(/#/, "#copy-"))
						d.append(excl.html());
					});
				}
				d.find("*[id]").each(function(i, elt) {
					$(elt).attr("data-id", $(elt).attr("id"));
				});
				d.find("*[id]").removeAttr("id");
				d.find("tei-note[target]").each(function(i, elt) {
					$(elt).attr("data-id", $(elt).attr("target").replace(/#/, ""));
				});
				if ($(elt).find(this.variantBlocks).length > 0) {
					d.find("tei-lem,tei-rdg,tei-rdgGrp").remove();
				}
				d.find("tei-lem:empty").append("om. ");
				d.find("tei-rdg:empty").append("om. ");
				d.find("tei-rdg,tei-lem,tei-note[data-id],span[data-id]").each(function(i, elt) {
					$(elt).click(function(evt) {
						let rdg = $("#" + self.escapeID($(evt.currentTarget).attr("data-id")));
						self.swapLem(rdg, evt);
					});
				});
				d.dialog({
					autoOpen: false,
					open: function(event) {
						$("#" + $(this).attr("id").replace(/dialog/, "button")).tooltip("close");
						$("#" + $(this).attr("id").replace(/dialog-/, "")).addClass("highlight");
						$("#" + $(this).attr("id").replace(/dialog-/, "")).find(this.variantBlocks).addClass("highlight");
					},
					close: function(event) {
						$("#" + $(this).attr("id").replace(/dialog-/, "")).removeClass("highlight");
						$("#" + $(this).attr("id").replace(/dialog-/, "")).find(this.variantBlocks).removeClass("highlight");
						let btn = $("#" + $(this).attr("id").replace(/dialog/, "button"));
						if (btn.tooltip("instance")) {
							btn.tooltip("close");
						}
						btn.attr("title", ""); // hack to handle JQuery UI bug
					}
				});
			}
			d.dialog("open");
		});
	}

	escapeID(id) {
		return id.replace(/([\.,])/g, "\\$1");
	}

	getLabel(val) {
		let elt = $(this.escapeID(val));
		if (elt.length > 0 && elt.attr("n")) {
			return elt.attr("n");
		} else {
			return val.replace(/#/, '');
		}
	}

	refLabel(ref) {
		if (this.references[ref]) {
			return this.references[ref];
		} else {
			try {
				let elt = this.dom.querySelector(this.escapeID(ref));
				let siglum = $(elt).children("abbr[type=siglum]").html();
				if (!siglum) {
					this.references[ref] = elt.getAttribute("id")
				} else {
					this.references[ref] = siglum;
				}
				return this.references[ref];
			} catch (e) {
				//console.log("Unresolvable ref, " + ref);
			}
		}
	}

	witOrSource(elt) {
		return elt.attr("wit")?elt.attr("wit"):elt.attr("source");
	}

	addSigla() {
		let self = this;
		return function(i, elt) {
			if (elt.parentElement) {
				// Find labels (@n) for items referenced via @wit and/or @source
				let wit = "";
				let source = "";
				let corr = "";
				let e = $(elt);
				e.attr("data-id", e.attr("id"));
				e.removeAttr("id");
				// Add note for corrections
				if (elt.localName == "tei-rdggrp" && e.attr("type") && e.attr("type").match(/corr/i)) {
					let rdg = e.children("tei-rdg:not(:first-child)");
					corr = "<span class=\"ref\" data-id=\"" + $(rdg).attr("id") + "\" data-ref=\"" + self.witOrSource(rdg) + "\">(corr. " + self.refLabel(self.witOrSource(rdg)) + ")</span>"
					rdg.remove();
				}
				// Add witness sigla
				if (e.attr("wit")) {
					e.attr("wit").split(/ /).forEach(function(val) {
						wit += "<span class=\"ref\" data-id=\"" + e.attr("data-id") + "\" data-ref=\"" + val + "\">" + self.refLabel(val) + "</span>";
						e.parents("tei-app").first().find("tei-witDetail[target=\"#" + e.attr("data-id") + "\"][wit=\"" + val + "\"]").each(function(i, elt) {
							wit += ", " + elt.innerHTML;
						});
					});
				}
				// Add source references
				if (e.attr("source")) {
					e.attr("source").split(/ /).forEach(function(val) {
						source += " <span class=\"ref\" data-id=\"" + e.attr("data-id") + "\" data-ref=\"" + val + "\">" + self.refLabel(val) + "</span> ";
					});
				}
				if (elt.nextElementSibling && elt.nextElementSibling.localName == "tei-wit") {
					source += " <span class=\"ref\" data-id=\"" + e.attr("data-id") +"\">" + $(elt.nextElementSibling).html() + "</span> ";
				}
				if ((wit + source + corr).length > 0) {
					$(elt).after(" <span class=\"source\">" + wit + source + corr + "</span>");
				}
			}
		}
	}

	makeCopy(node) {
		let newNode;
		if (node.nodeType == Node.ELEMENT_NODE) {
			newNode = document.createElement(node.localName);
			for (let i = 0; i < node.attributes.length; i++) {
				// have to rewrite ids in copied content so there are no duplicates
				let att = node.attributes.item(i);
				if (att.name == "id") {
					newNode.setAttribute("data-copyFrom", att.value);
					newNode.setAttribute("id", this.generateId());
				} else if (att.name == "class") {
					newNode.setAttribute("class", att.value + " app-copy");
				} else {
					newNode.setAttribute(att.name, att.value);
				}
			}
			for (let i = 0; i < node.childNodes.length; i++) {
				let n = node.childNodes[i];
				if (n.nodeType == Node.ELEMENT_NODE) {
					if (n.hasAttribute("copyof")) {
						this.copy(n);
					}
					newNode.appendChild(this.makeCopy(n));
				} else {
					newNode.appendChild(n.cloneNode());
				}
			}
		} else {
			newNode = node.cloneNode();
		}
		return newNode;
	}

	// Copies the content of the target of the @copyOf attribute
	// into the current element
	copy(elt) {
		let e = $(elt);
		let src = this.dom.querySelector(this.escapeID(e.attr("copyof")));
		if (src) {
			e.attr("data-copyfrom", e.attr("copyof"))
			for (let i = 0; i < src.childNodes.length; i++) {
				e.append(this.makeCopy(src.childNodes[i]));
			}
		} else {
			//console.log("Can't resolve " + e.attr("copyof"));
		}
	}

	doSection(section) {
		let self = this;
		$("button").remove();
		$("div.apparatus").remove();
		let sectionId = section.attr("id");
		// Add Apparatus div
		if (section.find("tei-app").length > 0) {
			let appDiv = $("<div id=\"apparatus-" + sectionId + "\" class=\"apparatus\"><h2>Apparatus</h2></div>");
			section.after(appDiv);
			// Pull content into @copyOf elements
			section.find("*[copyof]").each(function(i, elt) {
				if (!elt.hasAttribute("data-copyfrom")) {
					self.copy(elt);
				}
			});
			section.find("tei-app").each(function(i, elt) {
				let app;
				if (document.registerElement) {
					app = $(elt.outerHTML);
				} else {
					app = $(elt).clone(true, true);
				}
				// Assemble distributed readings into the main app (with the lem)
				if (app.children("tei-lem").length == 1 && app.attr("exclude")) {
					app.attr("exclude").split(/ /).forEach(function(val){
						let rdg = section.find(self.escapeID(val)).clone();
						app.append($(rdg).children().unwrap());
					});
				}
				// Don't process distributed readings
				if (!app.attr("exclude") || app.children("tei-lem").length == 1) {
					let n, lines, unit;
					app.attr("id", "copy-" + app.attr("id"));
					// clean up descendant apps
					let lem = app.children("tei-lem");
					if (lem.find("tei-app").length > 0) {
						lem.find("tei-rdg,tei-rdggrp,tei-note,tei-wit").remove();
						lem.find("tei-lem").removeAttr("wit").removeAttr("source");
					}
					// turn phrases into first...last
					if (lem.children(this.variantBlocks).length == 0) {
						lem.html(lem.text().replace(/\n/g, " ").replace(/^(\S+) .+ (\S+)/, "$1...$2"));
					}
					app.find("tei-lem,tei-rdg,tei-rdggrp").each(self.addSigla($(self.dom)));
					let blocks;
					//generate block references for apps containing lines, paragraphs, etc.
					if (app.find(self.variantBlocks).length > 0) {
						let lem = app.children("tei-lem");
						let children = lem.find(self.variantBlocks);
						if (children.length > 0) {
							unit = children[0].localName;
							if (unit == "tei-l") {
								if (children.length > 1) {
									blocks = "<span class=\"ref lineref\" data-id=\"" + lem.attr("data-id") + "\">ll. " + lem.find(self.variantBlocks).first().attr("n") + "–" + lem.find(self.variantBlocks).last().attr("n") + "</span> ";
								} else {
									blocks = "<span class=\"ref lineref\" data-id=\"" + lem.attr("data-id") + "\">l. " + lem.find(self.variantBlocks).attr("n") + "</span> ";
								}
							}
							if (unit == "tei-p") {
								if (children.length > 1) {
									blocks = "<span class=\"ref lineref\" data-id=\"" + lem.attr("data-id") + "\">" + lem.find(self.variantBlocks).first().attr("n") + "–" + lem.find(self.variantBlocks).last().attr("n") + "</span> ";
								} else {
									blocks = "<span class=\"ref lineref\" data-id=\"" + lem.attr("data-id") + "\">" + lem.find(self.variantBlocks).attr("n") + "</span> ";
								}
							}
							if (unit == "tei-speaker") {
									blocks = "<span class=\"ref lineref\" data-id=\"" + lem.attr("data-id") + "\">sp. </span> ";
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
							for (let i = 1; i < blocks.length; i++) {
								if ($(blocks[i]).attr("n")) {
									n = $(blocks[i]).attr("n");
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
						let l = $(elt).find("tei-lem").find(self.variantBlocks);
						if (l.length == 0) {
							l = $(elt).next(self.variantBlocks + ",tei-app");
						}
						l.first().append("<button id=\"button-" + $(elt).attr("id") + "\" title=\"\" class=\"app\" data-app=\"" + $(elt).attr("id") + "\">?</button>");
						// we don't want the full line showing up in the app., just its reference
						app.find("tei-lem:not(:empty)").remove();
						app.find("tei-rdg:not(:empty)").remove();
					} else {
						n = $(elt).parents(self.variantBlocks).attr("n");
						if (!n && elt.hasAttribute("copyof")) {
							n = section.find(self.escapeID($(elt).parents(self.variantBlocks).attr("copyof"))).attr("n");
						}
						$(elt).parents(self.variantBlocks).append("<button id=\"button-" + $(elt).attr("id") + "\" title=\"\" class=\"app\" data-app=\"" + $(elt).attr("id") + "\">?</button>");
					}
					// tei-wit should have been put into the sigla, so remove it
					app.find("tei-wit").remove();
					app.find("tei-rdg:empty").append("om. ");
					if (n && appDiv.find("#app-l" + n).length == 0 || blocks.length > 0) {
						app.prepend("<span class=\"lem\" id=\"app-l" + n +"\">" + n + "</span>");
					}
					app.find("tei-lem,tei-rdg").removeAttr("id");
					app.find("tei-lem:parent").append("<span>] </span>");
					appDiv.append(app);
				}
			});

			// Add line numbers
			let parents = ["tei-sp", "tei-ab", "tei-div", "tei-lem", "tei-lg"];
			section.find(self.variantBlocks).each(function(i,elt){
				let e = $(elt);
				if (Number(e.attr("n")) % 5 == 0 && (parents.indexOf(elt.parentElement.localName) >= 0)) {
					e.attr("data-num",e.attr("n"));
				}
				e.find("button.app").wrapAll("<span class=\"apps\"></span>");
			});

			// Add apparatus links
			section.find("button.app").each(function(i, elt) {
				self.addToolTip(elt);
			});

			// Link up sigla in the apparatus to bibliography
			appDiv.find("span.ref").each(function(i, elt) {
				if (elt.hasAttribute("data-ref")) {
					$(elt).attr("title","");
					$(elt).tooltip({
						content: function() {
							let ref = $(self.escapeID($(elt).attr("data-ref")));
							let title;
							switch (ref[0].localName) {
								case "tei-handnote":
									title = $("<span>" + ref.parents("tei-witness,tei-bibl").find(">tei-title,tei-bibl>tei-title").first().html() + "</span>");
									title.append("; ", ref.html());
									break;
								case "tei-listwit":
									title = $("<span>" + ref.children("tei-head").html() + ": </span>");
									title.append($.map(ref.children("tei-witness"), function(val) {
										return $(val).find(">tei-title").html();
									}).join(", "));
									break;
								case "tei-item":
									title = $("<span>" + ref.html() + "</span>");
									break;
								case "tei-bibl":
									title = $("<span>" + ref.html() + "</span>")
								default:
									title = $("<span>" + ref.find(">tei-title,tei-bibl>tei-title").first().html() + "</span>");
							}
							return "<div class=\"ref\">" + title.html() + "</div>";
						},
					});
				}
			});
		} else {
		// View sources

		}

	}

	toggleApps(evt) {
		$("tei-app[ana~=\"\\#" + evt.currentTarget.name + "\"]").each(function(i, elt) {
			let btn = $("#button-" + $(elt).attr("id"));
			if (evt.currentTarget.checked) {
				btn.hide();
			} else {
				btn.show();
			}
		});
		$("tei-rdg[ana~=\"\\#" + evt.currentTarget.name + "\"]").each(function(i, elt) {
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

	loadData(data) {
		this.dom = data;
		let self = this;
		$(data).find("tei-app,tei-rdgGrp").each(function(i, elt) {
			let remove = [];
			// Strip whitespace inside app
			for (let i = 0; i < elt.childNodes.length; i ++) {
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
			let e = $(elt);
			if (!e.attr("id")) {
				e.attr("id",self.generateId());
			}
		});

		//Add navigation header
		let nav = $("<div/>", {id:"navigation"});
		nav.html("<h2>Contents:</h2><ul></ul>");
		nav.prependTo("#controls");
		let ul = nav.find("ul");
		ul.append("<li><a href=\"#front\">Front Matter</a></li>");
		let parts = $(data).find("tei-div[type=textpart]");
		if (parts.length == 0) {
			parts = $(data).find("tei-div[type=edition]");
		}
		parts.each(function(i, elt) {
			ul.append("<li><a href=\"#" + $(elt).attr("id") + "\">" + $(elt).find("tei-head").html() + "</a></li>");
		});
		ul.append("<li><a href=\"#apparatus\">Apparatus</a></li>");

		nav.find("a").click(function(e) {
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

}

// Make main class available to pre-ES6 browser environments
/*if (window) {
    window.appcrit = appcrit;
}*/
export default appcrit;
