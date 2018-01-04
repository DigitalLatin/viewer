var morphlibrary = (function (jQuery) {
'use strict';

jQuery = 'default' in jQuery ? jQuery['default'] : jQuery;

var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();





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







var get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

















var set = function set(object, property, value, receiver) {
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent !== null) {
      set(parent, property, value, receiver);
    }
  } else if ("value" in desc && desc.writable) {
    desc.value = value;
  } else {
    var setter = desc.set;

    if (setter !== undefined) {
      setter.call(receiver, value);
    }
  }

  return value;
};

/**
 * Created by Elijah Cooke on 7/12/2016.
 * test
 */

var preferences = function () {
    function preferences(prefFile) {
        classCallCheck(this, preferences);
    }

    createClass(preferences, [{
        key: "getcurretlang",
        value: function getcurretlang() {}
    }, {
        key: "setMouseAction",
        value: function setMouseAction(lang, newAction) {
            var installedlangs = prefsobj.languages[2];
            for (var intlang in installedlangs["installedlangs"]) {
                if (installedlangs["installedlangs"][intlang]["code"] == lang) {
                    installedlangs["installedlangs"][intlang]["mouseaction"] == newAction;
                }
            }
        }
    }, {
        key: "getMouseAction",
        value: function getMouseAction(lang) {
            var installedlangs = prefsobj.languages[2];
            for (var intlang in installedlangs["installedlangs"]) {
                if (installedlangs["installedlangs"][intlang]["code"] == lang) {
                    return installedlangs["installedlangs"][intlang]["mouseaction"];
                }
            }
        }
    }, {
        key: "getdebugstatus",
        value: function getdebugstatus() {
            //placeholder till preference class is fixed
            return true;
            //return prefsobj.debug
        }
    }, {
        key: "getmorphservicetype",
        value: function getmorphservicetype(lang) {
            if (lang == "grc") {
                return "remote";
            }
            if (lang == "lat") {
                return "remote";
            }
            if (lang == "per") {
                return "remote";
            }
            if (lang == "ara") {
                return "remote";
            }
        }
    }, {
        key: "getmorphserviceuri",
        value: function getmorphserviceuri(lang) {
            if (lang == "grc") {
                return "http://morph.perseids.org/analysis/word?lang=grc&engine=morpheusgrc&word=";
            }
            if (lang == "lat") {
                return "http://morph.perseids.org/analysis/word?lang=lat&engine=whitakerLat&word=";
            }
            if (lang == "ara") {
                return "http://morph.alpheios.net/api/v1/analysis/word?lang=ara&engine=aramorph&word=";
            }
            if (lang == "per") {
                return ["http://morph.perseids.org/analysis/word?word=", "&lang=per&engine=hazm"];
            }
        }
    }, {
        key: "getmorphserviceapiformat",
        value: function getmorphserviceapiformat(lang) {
            if (lang == "grc") {
                return "alpheios";
            }
            if (lang == "lat") {
                return "ww";
            }
            if (lang == "ara") {
                return "alpheios";
            }
            if (lang == "per") {
                return "alpheios";
            }
        }
    }, {
        key: "getmorphserviceversion",
        value: function getmorphserviceversion(lang) {
            if (lang == "grc") {
                return "placeholder";
            }
            if (lang == "lat") {
                return "placeholder";
            }
            if (lang == "ara") {
                return "placeholder";
            }
            if (lang == "per") {
                return "placeholder";
            }
        }
    }]);
    return preferences;
}();

/**
 * Created by Elijah Cooke on 6/28/2016.
 *
 * Class that represents the response object and contains the different method to generate the different kinds of responses
 */
/**
 * Global namespace
 * @type {{}}
 */

var tokenresponse =
//constructor for response of token object that event handler creates
function tokenresponse(word, bcontext, fcontext, wordlang, textdir) {
    classCallCheck(this, tokenresponse);

    //Selected Token from triggered event
    this.selectedtoken = word;
    //Backwards context for selected token
    this.backwardcontext = bcontext;
    //forward context for selected token
    this.forwardcontext = fcontext;
    //language for selected token
    this.lang = wordlang;
    //text direction for selected token
    this.textdirection = textdir;
};

var morphresponse =
//constructor for response of parsed morphology object that morphology parser returns
function morphresponse(originform, objects, isordered, credit, lang) {
    classCallCheck(this, morphresponse);

    // the original analyzed form
    this.originalform = originform;
    // list of analysis objects
    this.analysisobjects = objects;
    // boolean which tells whether the analysis objects are ordered or not
    this.ordered = isordered;
    //credits
    this.credits = credit;
    //language of morphservice
    this.lang = lang;
};

var analysisresponse =
//constructor for response object for the analysis a morphology service provides
function analysisresponse(hdwd, pofs, shortdef, posinfl, ordinfl) {
    classCallCheck(this, analysisresponse);

    // the lemma or head word
    this.lemma = hdwd;
    // part of speech
    this.partofspeech = pofs;
    // short definition if it exists
    this.shortdefinition = shortdef;
    // list of possible inflections
    this.inflections = posinfl;
    // boolean that tell whether the inflections are ordered
    this.orderedinfls = ordinfl;
};

/** * Created by Elijah Cooke on 8/30/2016.
 */
function eventhandler(event, instance, trigger) {
  if (instance.prefs.getdebugstatus()) {
    console.log("Event Triggered");
  }
  var elementlang;
  if (event.target.attributes["id"]) {
    var jqid = "#" + event.target.attributes["id"].nodeValue;
  } else {
    var jqid = false;
  }

  if (event.target.attributes["xml:lang"]) {
    elementlang = event.target.attributes["xml:lang"].nodeValue;
  } else if (jqid && $(jqid).parents("[xml\\:lang]").length > 0) {
    elementlang = $(jqid).parents("[xml\\:lang]")[0].attributes["xml:lang"].nodeValue;
  }

  var langfrom = 'element';
  if (!elementlang || elementlang == "") {
    if (!instance.defaultlang) {
      instance.deflangui();
    }
    elementlang = instance.defaultlang;
    langfrom = 'default';
  }
  if (instance.prefs.getdebugstatus()) {
    console.log("Running word as " + elementlang + ", lang taken from " + langfrom);
  }

  if (elementlang !== '') {
    instance.currentlang = elementlang;
    console.log("Running word as " + elementlang + ", lang taken from " + langfrom);
  } else {
    console.log("Unable to identify a language");
  }

  var rv = null;

  switch (elementlang) {
    case 'lat':
      rv = processwordlat(event.target, instance);
      break;
    case 'grc':
      rv = processwordgrc(event.target, instance);
      break;
    case 'ara':
      rv = processwordara(event.target, instance);
      break;
    case 'per':
      rv = processwordara(event.target, instance);
      break;
    default:
      console.log("Language not installed");
  }
  return rv;
}
// process a word with the default values for latin
function processwordlat(srcele, instance) {
  var word = window.getSelection().toString();
  //TODO tokenize context and send to response constructor
  var result = new tokenresponse(word, '', '', 'lat', 'ltr');
  if (instance.prefs.getdebugstatus()) {
    console.log(result);
  }
  return result;
}
// process a word with the default values for greek
function processwordgrc(srcele, instance) {
  var word = window.getSelection().toString();
  //TODO tokenize context and send to response constructor
  var result = new tokenresponse(word, '', '', 'grc', 'ltr');
  if (instance.prefs.getdebugstatus()) {
    console.log(result);
  }
  return result;
}
// process a word with the default values for arabic
function processwordara(srcele, instance) {
  var word = window.getSelection().toString();
  //TODO tokenize context and send to response constructor
  var result = new tokenresponse(word, '', '', 'ara', 'rtl');
  if (instance.prefs.getdebugstatus()) {
    console.log(result);
  }
  return result;
}

/**
 * Just an XmlHttpRequest helper
 *
 *
 * @param  {string}     method             HTTP Method
 * @param  {string}     url                HTTP URI to call
 * @param  {string}     datatype           Return data type
 * @param  {?function}  success            Function to call when request is done
 *
 */

function async(url, method, datatype, success) {
    jQuery.ajax({
        url: url,
        type: method,
        dataType: datatype,
        success: success
    });
}

/**
 * Created by Elijah Cooke on 1/20/2017.
 */
function bigdictlookup(instance, popup, lang, originalform, lemma) {
    if (instance.prefs.getdebugstatus()) {
        console.log("Starting big dictionary lookup");
    }
    var data;
    var uri;
    if (lang == "grc") {
        uri = "http://repos1.alpheios.net/exist/rest/db/xq/lexi-get.xq?lx=lsj&lg=grc&out=HTML&l=" + lemma;
    } else if (lang == "lat") {
        var splitlemma = lemma.split(",");
        if (Object.prototype.toString.call(splitlemma) === '[object Array]') {
            var lemmas = "";
            for (var i = 0; i < splitlemma.length; i++) {
                lemmas = lemmas + "&l=" + splitlemma[i];
            }
            uri = "http://repos1.alpheios.net/exist/rest/db/xq/lexi-get.xq?lx=ls&lg=lat&out=HTML" + lemmas;
        } else {
            uri = "http://repos1.alpheios.net/exist/rest/db/xq/lexi-get.xq?lx=ls&lg=lat&out=HTML&l=" + lemma;
        }
    } else if (lang == "ara") {
        uri = "http://repos1.alpheios.net/exist/rest/db/xq/lexi-get.xq?lx=sal&lg=ara&out=HTML&l=" + lemma;
    } else if (lang == "per") {
        uri = "http://repos1.alpheios.net/exist/rest/db/xq/lexi-get.xq?lx=stg&lg=per&out=HTML&l=" + lemma;
    }
    async(uri, "GET", "html", function (result) {
        popup.document.getElementById("morphlibwindowdictlookup").innerHTML = "<div id='dictentry1' class='morphlib-dict'>" + result + "</div>";
        if (lang == "grc") {
            uri = "http://repos1.alpheios.net/exist/rest/db/xq/lexi-get.xq?lx=ml&lg=grc&out=HTML&l=" + lemma;
            var secdict = document.createElement("div");
            secdict.setAttribute("id", "dictentry2");
            secdict.setAttribute("class", "morphlib-dict");
            secdict.setAttribute("style", "visibility: hidden; position: absolute; top: 0px;");
            popup.document.getElementById("morphlibwindowdictlookup").appendChild(secdict);
            var dicttoggle = document.createElement("button");
            dicttoggle.setAttribute("id", "toggledict");
            dicttoggle.setAttribute("type", "button");
            dicttoggle.setAttribute("onclick", "togglehiddengreek()");
            dicttoggle.setAttribute("style", "position: absolute; right: 10px; top: -25px;");
            dicttoggle.innerHTML = "Toggle Greek Dictionaries";
            popup.document.getElementById("morphlibwindowdictlookup").appendChild(dicttoggle);
            secdict.innerHTML = '<img src="http://www.cuisson.co.uk/templates/cuisson/supersize/slideshow/img/progress.BAK-FOURTH.gif">';
            async(uri, "GET", "html", function (result) {
                secdict.innerHTML = result;
            });
        }
    });
}

/**
 * Created by elijah on 6/30/16.
 */
function launchPopup(morpgresponse, instance) {
    var debug = instance.prefs.getdebugstatus();
    var myWindow;
    if (instance.popup) {
        instance.popup.close();
        myWindow = window.open("", "morplibWindow", "width=600,height=400");
        myWindow.document.open();
        myWindow.focus();
    } else {
        myWindow = window.open("", "morplibWindow", "width=600,height=400");
    }
    myWindow.document.write('<head><link rel="stylesheet" href="morphwindow.css" type="text/css" /><title>Morphology Library Window</title> </head>');
    myWindow.document.write('<script> function togglehidden() { if(document.getElementById("morphlibwinmorph").style.visibility=="hidden"){ document.getElementById("morphlibwinmorph").style.visibility = "visible"; document.getElementById("morphlibwindowdictlookup").style.visibility = "hidden"; document.getElementById("dictentry1").style.visibility = "hidden"; document.getElementById("dictentry2").style.visibility = "hidden"; } else { document.getElementById("morphlibwinmorph").style.visibility = "hidden"; document.getElementById("morphlibwindowdictlookup").style.visibility = "visible";  document.getElementById("dictentry1").style.visibility = "visible";} }</script>');
    myWindow.document.write('<script> function togglehiddengreek() { if(document.getElementById("dictentry1").style.visibility=="hidden"){ document.getElementById("dictentry1").style.visibility = "visible"; } else { document.getElementById("dictentry1").style.visibility = "hidden"; } if(document.getElementById("dictentry2").style.visibility== "hidden"){ document.getElementById("dictentry2").style.visibility = "visible"; } else { document.getElementById("dictentry2").style.visibility = "hidden"; } } </script>');
    if (!myWindow) {
        if (debug) {
            console.log("Warning popup window failed to create popup window");
        }
        alert("Morphology Library failed to create a popup");
        return;
    }
    if (debug) {
        console.log("Popup window created successfully");
    }
    var entries = morpgresponse.analysisobjects;
    myWindow.document.write('<div><button id="toggledict" type="button" style="z-index: 1" onclick="togglehidden()">Toggle Full Dictionary</button></div>');
    myWindow.document.write('<div id="morphlibwinmorph" style="visibility: visible" context="' + morpgresponse.originalform + ' class="morphlib-word morphlib-word-first">');
    for (var i = 0; i < entries.length; i++) {
        myWindow.document.write('<div class="morphlib-entry">');
        myWindow.document.write('<div class="morplib-dict"><span class="morphlib-hdwd">' + entries[i].lemma + ': </span>');
        myWindow.document.write('<div class="morphlib-morph"><span class="morphlib-pofs" context="' + entries[i].partofspeech + '">' + entries[i].partofspeech + '</span>');
        myWindow.document.write('</div>');
        myWindow.document.write('</div>');
        myWindow.document.write('<div class="morphlib-mean">' + entries[i].shortdefinition);
        myWindow.document.write('</div>');
        myWindow.document.write('<div class="morphlib-label morphlib-form-label">Form(s):</div>');
        for (var x = 0; x < entries[i].inflections.length; x++) {
            var form = entries[i].inflections[x]["term"]["stem"]["$"];
            if (entries[i].inflections[x]["term"]["suff"]) {
                form = form + "-" + entries[i].inflections[x]["term"]["suff"]["$"];
            }
            myWindow.document.write('<div class="morphlib-infl-set" context="' + form + '" class="morphlib-infl-set"><span class="morphlib-term">' + form + '</span>');
            myWindow.document.write('<div class="morphlib-infl">');
            if (entries[i].inflections[x]["pers"]) {
                myWindow.document.write('<span class="morphlib-pers">' + entries[i].inflections[x]["pers"]["$"] + ' person</span>');
            }
            if (entries[i].inflections[x]["num"]) {
                myWindow.document.write('<span class="morphlib-num">' + entries[i].inflections[x]["num"]["$"] + '; </span>');
            }
            if (entries[i].inflections[x]["tense"]) {
                myWindow.document.write('<span class="morphlib-tense">' + entries[i].inflections[x]["tense"]["$"] + ' </span>');
            }
            if (entries[i].inflections[x]["mood"]) {
                myWindow.document.write('<span class="morphlib-mood">' + entries[i].inflections[x]["mood"]["$"] + '; </span>');
            }
            if (entries[i].inflections[x]["voice"]) {
                myWindow.document.write('<span class="morphlib-voice">' + entries[i].inflections[x]["voice"]["$"] + '</span>');
            }
            if (entries[i].inflections[x]["case"]) {
                myWindow.document.write('<span class="morphlib-case">' + entries[i].inflections[x]["case"]["$"] + '</span>');
            }
            if (entries[i].inflections[x]["gend"]) {
                myWindow.document.write('<span class="morphlib-gend">' + entries[i].inflections[x]["gend"]["$"] + '</span>');
            }
            myWindow.document.write('</div></div>');
        }
        myWindow.document.write('</div>');
    }
    myWindow.document.write('<div>' + morpgresponse.credits + '</div>');
    myWindow.document.write("</div>");
    myWindow.focus();
    myWindow.document.write('<div id="morphlibwindowdictlookup" style="visibility: hidden"><img src="http://www.cuisson.co.uk/templates/cuisson/supersize/slideshow/img/progress.BAK-FOURTH.gif"></div>');
    bigdictlookup(instance, myWindow, morpgresponse.lang, morpgresponse.originalform, entries[0].lemma);
    //myWindow.document.write("<div id='morphlibwindowdictlookup' style='visibility: hidden; position: relative'>" + bigdictlookup(instance, morpgresponse.lang, morpgresponse.originalform, entries[0].lemma) + "</div>")
    instance.popup = myWindow;
}

/**
 * Created by Elijah Cooke on 9/7/2016.
 */
function morphservice(tokenobj, typeservice, serviceuri, apiformat, version, morplibinstance) {
    if (apiformat == "alpheios") {
        if (morplibinstance.prefs.getdebugstatus()) {
            console.log("using Alpeios API format");
        }
        if (typeservice == "remote") {
            if (morplibinstance.prefs.getdebugstatus()) {
                console.log("performing jQuery ajax request");
            }
            if (Object.prototype.toString.call(serviceuri) === '[object Array]') {
                async(serviceuri[0] + tokenobj.selectedtoken + serviceuri[1], "GET", "json", function (result) {
                    return alpheiosparser(result, morplibinstance, tokenobj);
                });
            } else {
                async(serviceuri + tokenobj.selectedtoken, "GET", "json", function (result) {
                    return alpheiosparser(result, morplibinstance, tokenobj);
                });
            }
        }
    } else {
        if (apiformat == "ww") {
            if (morplibinstance.prefs.getdebugstatus()) {
                console.log("using Whitakers Words API format");
            }
            if (typeservice == "remote") {
                if (morplibinstance.prefs.getdebugstatus()) {
                    console.log("performing jQuery ajax request");
                }
                async(serviceuri + tokenobj.selectedtoken, "GET", "json", function (result) {
                    return wwparser(result, morplibinstance, tokenobj);
                });
            } else {
                if (morplibinstance.prefs.getdebugstatus()) {
                    console.log("Unknown API format");
                }
            }
        }
    }
}

function wwparser(result, instance, tokenobj) {
    instance.morphService = "whitakerswords";
    if (instance.currentlang == "lat") {
        if (instance.prefs.getdebugstatus()) {
            console.log("Whitakers Words parser for latin started");
        }
        var analysisobjects = [];
        var analysis = result["RDF"]["Annotation"]["Body"];
        if (analysis) {
            if (instance.prefs.getdebugstatus()) {
                console.log("body element found in Json morphology json response");
            }
        } else {
            analysis = result["RDF"]["Annotation"];
            if (instance.prefs.getdebugstatus()) {
                console.log("No body element found");
            }
        }
        if (Object.prototype.toString.call(analysis) === '[object Array]') {
            for (var i = 0; i < analysis.length; i++) {
                var lemma = "";
                var pofs = "";
                var shortdef = "";
                var infls = [];
                if (instance.prefs.getdebugstatus()) {
                    console.log("Looping through different analyses from morph service");
                }
                if (analysis[i]["rest"]["entry"]["dict"]) {
                    if (analysis[i]["rest"]["entry"]["dict"]["hdwd"]) {
                        lemma = analysis[i]["rest"]["entry"]["dict"]["hdwd"]["$"];
                        if (instance.prefs.getdebugstatus()) {
                            console.log("Lemma found");
                        }
                    }
                }
                if (analysis[i]["rest"]["entry"]["dict"]) {
                    if (analysis[i]["rest"]["entry"]["dict"]["pofs"]) {
                        pofs = analysis[i]["rest"]["entry"]["dict"]["pofs"]["$"];
                        if (instance.prefs.getdebugstatus()) {
                            console.log("part of speech found");
                        }
                    }
                }

                var shortdefh = analysis[i]["rest"]["entry"]["mean"];
                if (Object.prototype.toString.call(shortdefh) === '[object Array]') {
                    for (var l = 0; l < shortdefh.length; l++) {
                        shortdef = shortdef + shortdefh[l]["$"] + "&#13;&#10;";
                    }
                } else {
                    shortdef = shortdefh["$"];
                }
                if (instance.prefs.getdebugstatus()) {
                    console.log("short definition found");
                }

                if (instance.prefs.getdebugstatus()) {
                    console.log("starting loop to capture inflections");
                }
                var inflections = analysis[i]["rest"]["entry"]["infl"];
                if (Object.prototype.toString.call(inflections) === '[object Array]') {
                    for (var infl in analysis[i]["rest"]["entry"]["infl"]) {
                        infls.push(analysis[i]["rest"]["entry"]["infl"][infl]);
                    }
                } else {
                    infls.push(analysis[i]["rest"]["entry"]["infl"]);
                }

                if (instance.prefs.getdebugstatus()) {
                    console.log("inflections captured");
                }
                analysisobjects.push(new analysisresponse(lemma, pofs, shortdef, infls, true));
                if (instance.prefs.getdebugstatus()) {
                    console.log("analysis added");
                }
            }
        } else {
            if (analysis["rest"]["entry"]["mean"]["$"] == "Assume\nthis\nis\ncapitalized\nproper\nname/abbr") {
                if (instance.prefs.getdebugstatus()) {
                    console.log("Proper noun");
                }
                shortdef = analysis["rest"]["entry"]["mean"]["$"];
                var infls = [];
                infls.push(analysis["rest"]["entry"]["infl"]);
                var lemma = "";
                var pofs = "";
                analysisobjects.push(new analysisresponse(lemma, pofs, shortdef, infls, true));
                if (instance.prefs.getdebugstatus()) {
                    console.log("analysis added");
                }
            } else {
                var lemma = "";
                var pofs = "";
                var shortdef = "";
                var infls = [];
                if (analysis["rest"]["entry"]["dict"]) {
                    if (analysis["rest"]["entry"]["dict"]["hdwd"]) {
                        lemma = analysis["rest"]["entry"]["dict"]["hdwd"]["$"];
                    }
                }
                if (instance.prefs.getdebugstatus()) {
                    console.log("Lemma found");
                }
                if (analysis["rest"]["entry"]["dict"]) {
                    if (analysis["rest"]["entry"]["dict"]["pofs"]) {
                        pofs = analysis["rest"]["entry"]["dict"]["pofs"]["$"];
                    }
                }
                if (instance.prefs.getdebugstatus()) {
                    console.log("part of speech found");
                }
                if (analysis["rest"]["entry"]["mean"]) {
                    var shortdefh = analysis["rest"]["entry"]["mean"];
                    if (Object.prototype.toString.call(shortdefh) === '[object Array]') {
                        for (var l = 0; l < shortdefh.length; l++) {
                            shortdef = shortdef + shortdefh[l]["$"] + "&#13;&#10;";
                        }
                    } else {
                        shortdef = shortdefh["$"];
                    }
                }
                if (instance.prefs.getdebugstatus()) {
                    console.log("short definition found");
                }
                if (instance.prefs.getdebugstatus()) {
                    console.log("starting loop to capture inflections");
                }
                var inflections = analysis["rest"]["entry"]["infl"];
                if (Object.prototype.toString.call(inflections) === '[object Array]') {
                    for (var infl in analysis["rest"]["entry"]["infl"]) {
                        infls.push(analysis["rest"]["entry"]["infl"][infl]);
                    }
                } else {
                    infls.push(analysis["rest"]["entry"]["infl"]);
                }

                if (instance.prefs.getdebugstatus()) {
                    console.log("inflections captured");
                }
                analysisobjects.push(new analysisresponse(lemma, pofs, shortdef, infls, true));
                if (instance.prefs.getdebugstatus()) {
                    console.log("analysis added");
                }
            }
        }
    }
    var response = new morphresponse(tokenobj, analysisobjects, false, "Short definitions and morphology from Words by William Whitaker, Copyright © 1993-2016. Services provided by The Perseids Project at Tufts University and Alpheios.net.", instance.currentlang);
    launchPopup(response, instance);
    return response;
}

function alpheiosparser(result, instance, tokenobj) {
    instance.morphService = "alpheios";
    if (instance.prefs.getdebugstatus()) {
        console.log("Alpeios parser for " + instance.currentlang + " started");
    }
    var analysisobjects = [];
    var body = result["RDF"]["Annotation"]["Body"];
    var credits = void 0;
    if (analysis) {
        if (instance.prefs.getdebugstatus()) {
            console.log("body element found in Json morphology json response");
        }
    } else {
        analysis = result["RDF"]["Annotation"];
        if (instance.prefs.getdebugstatus()) {
            console.log("No body element found");
        }
    }
    var analysis = void 0;
    if (Object.prototype.toString.call(body) !== '[object Array]') {
        analysis = [body];
    } else {
        analysis = body;
    }
    for (var i = 0; i < analysis.length; i++) {
        var lemma = "";
        var pofs = "";
        var shortdef = "";
        var infls = [];
        if (instance.prefs.getdebugstatus()) {
            console.log("Looping through different analyses from morph service");
        }

        if (analysis[i]["rest"]["entry"]["dict"]) {
            if (analysis[i]["rest"]["entry"]["dict"]["hdwd"]) {
                lemma = analysis[i]["rest"]["entry"]["dict"]["hdwd"]["$"];
                if (instance.prefs.getdebugstatus()) {
                    console.log("Lemma found");
                }
            }
            if (analysis[i]["rest"]["entry"]["dict"]["pofs"]) {
                pofs = analysis[i]["rest"]["entry"]["dict"]["pofs"]["$"];
                if (instance.prefs.getdebugstatus()) {
                    console.log("part of speech found");
                }
            }
        }
        switch (instance.currentlang) {
            case 'lat':
                if (instance.shortdeflatin) {
                    shortdef = instance.shortdeflatin[lemma];
                    if (instance.prefs.getdebugstatus()) {
                        console.log("short definition found in file");
                    }
                } else {
                    shortdef = "Short Definition file Missing";
                    if (instance.prefs.getdebugstatus()) {
                        console.log("attempting to find shortdef through WW service");
                    }
                    async("http://services.perseids.org/bsp/morphologyservice/analysis/word?lang=lat&engine=whitakerLat&word=" + lemma, "GET", "json", function (result) {
                        shortdef = result["RDF"]["Annotation"]["Body"]["rest"]["entry"]["mean"]["$"];
                    });
                    console.log("short definition uri found");
                }
                credits = "";
                break;
            case 'grc':
                if (instance.shortdefgreek) {
                    shortdef = instance.shortdefgreek[lemma];
                    if (instance.prefs.getdebugstatus()) {
                        console.log("short definition uri found");
                    }
                }
                credits = "Morphology provided by Morpheus from the Perseus Digital Library at Tufts University. Short Definitions from A Greek-English Lexicon (Henry George Liddell, Robert Scott). Services provided by The Perseids Project at Tufts University.";
                break;
            case 'per':
                if (instance.shortdefpersian) {
                    shortdef = instance.shortdefpersian[lemma];
                }
                if (instance.prefs.getdebugstatus()) {
                    console.log("short definition found");
                }
                credits = "Morphology from the HAZM Analyzer adapted by the Roshan Institute for Persian Studies at UMD and the Perseids Project at Tufts University. Short definitions from A Comprehensive Persian-English Dictionary (Joseph Steingass).";
                break;
            case 'ara':
                shortdef = analysis[i]["rest"]["entry"]["mean"]["$"];
                if (instance.prefs.getdebugstatus()) {
                    console.log("short definition id found");
                }
                credits = "Morphology provided by Buckwalter Arabic Morphological Analyzer Version 2.0 from QUAMUS LLC (www.quamus.org). Short definitions from An Advanced Learner's Arabic Dictionary (H. Anthony Salmone). Services provided by The Perseids Project at Tufts University and Alpheios.net.";
                break;
            default:
                break;
        }

        if (instance.prefs.getdebugstatus()) {
            console.log("starting loop to capture inflections");
        }
        var inflections = analysis[i]["rest"]["entry"]["infl"];
        if (Object.prototype.toString.call(inflections) === '[object Array]') {
            for (var infl in analysis[i]["rest"]["entry"]["infl"]) {
                infls.push(analysis[i]["rest"]["entry"]["infl"][infl]);
            }
        } else {
            infls.push(analysis[i]["rest"]["entry"]["infl"]);
        }

        if (instance.prefs.getdebugstatus()) {
            console.log("inflections captured");
        }
        analysisobjects.push(new analysisresponse(lemma, pofs, shortdef, infls, true));
        if (instance.prefs.getdebugstatus()) {
            console.log("analysis added");
        }
    }
    var response = new morphresponse(tokenobj, analysisobjects, false, credits, instance.currentlang);
    launchPopup(response, instance);
    return response;
}

/**
 * Created by Elijah Cooke on 6/28/2016.
 */

/**
 * Main controller function for the Alpheios morphology library
 * @type {{
 *      defaultLang: string,
 *      response: string,
 *      morphService: string,
 *      shortDefService: string,
 *      disambugationProvider: string,
 *      copyrightInfo: string,
 *      debugging: boolean,
 *      ignoreElements: list,
 *      focusElements: list
 *    }}
 */
var morphlib = function () {
    function morphlib(shortdefgrc) {
        classCallCheck(this, morphlib);

        var xx = this;
        //Default Language the Alphieos Morphology library will use
        this.defaultlang = "";
        //Current Language the morphology library is using
        this.currentlang = "";
        //Holds the morphlib.response object
        this.response = "";
        //holds the name of the current morphology provider
        this.morphService = "";
        //holds the locations of the short definition provider
        this.shortDefService = "";
        //holds the location of the disambugation provider
        this.disambugationProvider = "";
        //Copyright information
        this.copyrightInfo = "";
        //Object to hold the current popup
        this.popup = false;
        //a list of element @id and @class values regions of the page to be ignored by the library
        this.ignoreElements = false;
        //a list of element @id and @class values the page to which to limit the activity of the library
        this.focusElements = false;
        //setup preferences from saved preference file
        this.prefs = new preferences("preferences.json");
        //previous morphology results
        this.morphresults = [];
        //short definitions for greek
        jQuery.getJSON("grc-lsj-defs.json", function (data) {
            xx.shortdefgreek = data;
        });
        //short definitions for persian
        jQuery.getJSON("per-stg-defs.json", function (data) {
            xx.shortdefpersian = data;
        });
        //short definitions for arabic
        jQuery.getJSON("ara-sal-ids.json", function (data) {
            xx.shortdefarabic = data;
        });
        //short definitions for latin
        this.shortdeflatin = false;
    }
    /*
     activate the library to run on a browser window
     * @param {String} deflang - the default language
     * @param {Obj} selector - array of elements to attach event listeners to
     * @param {String[]} events = list of events to listen to
     */


    createClass(morphlib, [{
        key: "activate",
        value: function activate(deflang, selector, events) {
            var instance = this;
            this.defaultlang = deflang;
            if (this.prefs.getdebugstatus()) {
                console.log("activate morphology library started");
            }
            this.selector = selector || $('body');
            if (this.prefs.getdebugstatus()) {
                console.log("Adding default listener");
            }
            if (events) {
                if (this.prefs.getdebugstatus()) {
                    console.log("Adding events");
                }
                for (var x in events) {
                    if (this.prefs.getdebugstatus()) {
                        console.log("Adding " + x + "event");
                    }
                    $(this.selector).bind(x, function (event) {
                        eventhandler(event, this, x);
                    });
                    if (this.prefs.getdebugstatus()) {
                        console.log(x + "event added");
                    }
                }
            } else {
                if (this.prefs.getdebugstatus()) {
                    console.log("Adding default events (Click and Touch)");
                    var bodydebug = $('body');
                    console.log(bodydebug);
                }
                $(this.selector).on('dblclick', function (event) {
                    var tokenobject = eventhandler(event, instance, "click");
                    var morphresponse = morphservice(tokenobject, instance.prefs.getmorphservicetype(instance.currentlang), instance.prefs.getmorphserviceuri(instance.currentlang), instance.prefs.getmorphserviceapiformat(instance.currentlang), instance.prefs.getmorphserviceversion(instance.currentlang), instance);
                });
                $(this.selector).on('touch', function (event) {
                    var tokenobject = eventhandler(event, instance, "touch");
                    this.response = morphservice(tokenobject, instance.prefs.getmorphservicetype(instance.currentlang), instance.prefs.getmorphserviceuri(instance.currentlang), instance.prefs.getmorphserviceapiformat(instance.currentlang), instance.prefs.getmorphserviceversion(instance.currentlang), instance);
                });
                if (this.prefs.getdebugstatus()) {
                    console.log("Default events added");
                }
            }

            if (this.prefs.getdebugstatus()) {
                console.log("morphology library activated");
            }
        }
    }, {
        key: "deactivate",
        value: function deactivate() {
            if (this.prefs.getdebugstatus()) {
                console.log("Deactivating Morphology library");
            }
            $(this.selector).unbind();
            alert("Morphology Library Deactivated");
            if (this.prefs.getdebugstatus()) {
                console.log("Morphology library deactivated");
            }
        }
    }, {
        key: "currentLanguage",
        value: function currentLanguage() {
            return this.currentlang;
        }
    }, {
        key: "deflangui",
        value: function deflangui() {
            var uilang = window.prompt("Enter the default language for the page");
            if (uilang.toUpperCase() === "LATIN") {
                this.defaultlang = "lat";
            } else {
                if (uilang.toUpperCase() === "GREEK") {
                    this.defaultlang = "grc";
                } else {
                    if (uilang.toUpperCase() === "ARABIC") {
                        this.defaultlang = "ara";
                    } else {
                        if (uilang.toUpperCase() === "PERSIAN") {
                            this.defaultlang = "per";
                        } else {
                            window.alert("Language not installed please check spelling");
                        }
                    }
                }
            }
            //var deflangwin = window.open("", "defaultLanguageWindow", "width=200,height=200,top=200,left=500");
            //deflangwin.document.write('<html><body><form><input type="radio" name="lang" value="lat" checked> Latin<br><input type="radio" name="lang" value="grc"> Greek<br><input type="radio" name="lang" value="ara"> Arabic<br><input type="radio" name="lang" value="per"> Persian<input type="submit" value="Submit"><br></form></body></html>');
        }

        //get the appropiate language tool

    }, {
        key: "getLanguageTool",
        value: function getLanguageTool(elm) {
            var langTool;
            var langKey;
            if (elm) {
                langKey = util.getLanguageforElement(elm);
            }
            if (!langKey) {
                langKey = m_defaultLang;
            }
            if (langKey) {
                langTool = languages.getLanguageToolfromKey();
            }
        }
    }]);
    return morphlib;
}();

return morphlib;

}(jQuery));
