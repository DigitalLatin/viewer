class appcrit {

	constructor() {
		this.variantBlocks = "tei-l,tei-speaker,tei-p";
		this.genId = 0;
		this.dom = null;
		this.references = {};
	}

	generateId(prefix) {
		if (prefix) {
			return prefix + this.genId++;
		} else {
			return "id" + this.genId++;
		}
	}

	swapLem(oldrdg) {
		let self = this;
		if (oldrdg[0].localName == "tei-rdg") { // swapLem is a no-op if we clicked a lem
			let app = oldrdg.parents("tei-app").first();
			let oldlem;
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
				newlem = $("#" + newlem.attr("id"));
				newrdg = $("#" + newrdg.attr("id"));
				newlem.find("button.app").each(function(i, elt) {
					self.addToolTip(elt);
				});
				let l, btn;
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
					btn.click(function (){
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
						btn.click(function (){
							$("#dialog-" + $(this).attr("data-app")).dialog("open");
						});
					}
				}
				if (newlem.attr("require")) {
					newlem.attr("require").split(/ /).forEach(function(val) {
						let req = $(val);
						if (req[0].localName == "tei-rdg") {
							self.swapLem(req);
						}
					});
				}
			}
		}
	}

	ttip(elt) {
		let self = this;
		return {
			content: function() {
				return "<div class=\"apparatus\">" + $("#copy-" + $(elt).attr("data-app")).html() + "</div>";
			},
			open: function(event, ui) {
				let app = $("#" + $(this).attr("data-app"));
				app.addClass("highlight");
				if (app.children("tei-lem").length == 0) {
					let exclude = app.attr("exclude");
					if (exclude) {
						exclude.split(/ /).forEach(function(val) {
							$(val).find(self.variantBlocks).addClass("highlight");
						});
					}
				}
				app.find(self.variantBlocks).addClass("highlight");
			},
			close: function(event, ui) {
				let app = $("#" + $(this).attr("data-app"));
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
			let d = $("#dialog-" + $(this).attr("data-app").replace(/dialog-/,""))
			if (d.length == 0) {
				d = $("<div/>", {
					id: "dialog-" + $(this).attr("data-app"),
					class: "dialog",
					"data-exclude": $("#" + $(this).attr("data-id")).attr("exclude")});
				d.appendTo("body");
				let content = $("#copy-" + $(this).attr("data-app")).clone();
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
				if ($(elt).find(this.variantBlocks).length > 0) {
					d.find("tei-lem,tei-rdg,tei-rdgGrp").remove();
				}
				d.find("tei-lem:empty").append("om. ");
				d.find("tei-rdg:empty").append("om. ");
				d.find("tei-rdg,tei-lem,tei-note[data-id],span[data-id]").each(function(i, elt) {
					$(elt).click(function(evt) {
						let rdg = $("#" + self.escapeID($(evt.currentTarget).attr("data-id")));
						self.swapLem(rdg);
					});
				});
				d.dialog({
					autoOpen: false,
					open: function(event) {
						$("#" + $(this).attr("id").replace(/dialog/, "button")).tooltip("destroy");
						$("#" + $(this).attr("id").replace(/dialog-/, "")).addClass("highlight");
						$("#" + $(this).attr("id").replace(/dialog-/, "")).find(this.variantBlocks).addClass("highlight");
					},
					close: function(event) {
						$("#" + $(this).attr("id").replace(/dialog-/, "")).removeClass("highlight");
						$("#" + $(this).attr("id").replace(/dialog-/, "")).find(this.variantBlocks).removeClass("highlight");
						let btn = $("#" + $(this).attr("id").replace(/dialog/, "button"));
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
					source += " ";
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
				}
				if (att.name == "class") {
					newNode.setAttribute("class", att.value + " app-copy");
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
			for (let i = 0; i < src.childNodes.length; i++) {
				e.append(this.makeCopy(src.childNodes[i]));
			}
		} else {
			//console.log("Can't resolve " + e.attr("copyof"));
		}
	}

	doSection(section) {
		let self = this;
		let stamp = Date.now();
		let sectionId = section.attr("id");
		// Add Apparatus div
		if (section.find("tei-app").length > 0) {
			let appDiv = $("<div id=\"apparatus-" + sectionId + "\" class=\"apparatus\"><h2>Apparatus</h2></div>");
			section.after(appDiv);

			section.find("tei-app").each(function(i, elt) {
				// Pull content into @copyOf elements
				$(elt).find("*[copyOf]").each(function(i, elt) {
					self.copy(elt);
				});
				let app;
				if (document.registerElement) {
					app = $(elt.outerHTML);
				} else {
					app = $(elt).clone(true, true);
				}
				let n, lines, unit;
				app.attr("id", "copy-" + app.attr("id"));
				// clean up descendant apps
				let lem = app.children("tei-lem");
				if (lem.find("tei-app").length > 0) {
					lem.find("tei-rdg,tei-rdggrp,tei-note").remove();
					lem.find("tei-lem").removeAttr("wit").removeAttr("source");
				}
				if (lem.children(this.variantBlocks).length == 0) {
					lem.html(lem.text().replace(/\n/g, " ").replace(/^(\S+) .+ (\S+)/, "$1...$2"));
				}
				app.find("tei-lem,tei-rdg,tei-rdggrp").each(self.addSigla($(self.dom)));
				let blocks;
				if (app.find(">tei-lem:empty,>tei-rdg:empty,>tei-rdgGrp>tei-rdg:empty").length > 0 && app.find(self.variantBlocks).length > 0) {
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
				if ((blocks = app.find(self.variantBlocks)).length > 0) {
					n = $(blocks[0]).attr("n");
					if (!n) {
						n = $($(blocks[0]).attr("copyOf")).attr("n");
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
							n += "–" + $($(blocks[blocks.length - 1]).attr("copyOf")).attr("n");
						}
					}
					let l = $(elt).find("tei-lem").find(self.variantBlocks);
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
				if (n && appDiv.find("#app-l" + n).length == 0 || blocks.length > 0) {
					app.prepend("<span class=\"lem\" id=\"app-l" + n +"\">" + n + "</span>");
				}
				app.find("tei-lem,tei-rdg").removeAttr("id");
				appDiv.append(app);

			});

			// Add line numbers
			let parents = ["tei-sp", "tei-ab", "tei-div", "tei-lem"];
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
				$(elt).attr("title","");
				$(elt).tooltip({
					content: function() {
						return "<div class=\"ref\">" + $(self.escapeID($(elt).attr("data-ref"))).html() + "</div>";
					},
				});
			});
		} else {
		// View sources

		}

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
		nav.appendTo("body");
		nav.find("ul").append("<li><a href=\"#front\">Front Matter</a></li>");
		$(data).find("tei-div[type=textpart]").each(function(i, elt) {
			nav.find("ul").append("<li><a href=\"#" + $(elt).attr("id") + "\">" + $(elt).find("tei-head").html() + "</a></li>");
		});
		$(this.dom).find("tei-div[type=textpart],tei-front").each(function(i, elt){
			self.doSection($(elt));
		});
		// cleanup
		this.dom = null;
		this.references = null;
	}

}

// Make main class available to pre-ES6 browser environments
if (window) {
    window.appcrit = appcrit;
}
export default appcrit;
