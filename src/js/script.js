if (crT) {
	var s = document.getElementById("theme-switch");
	"light" == crT ? addClass(s, "fa-moon") : addClass(s, "fa-sun")
} else addClass(document.getElementById("theme-switch"), "fa-moon");
var db, wordlist = [],
	cur_index = 0,
	match_id = "",
	endpoint = "https://dictionary.ml/.netlify/functions/function",
	request = window.indexedDB.open("dictionary", 1);

function suggest(e) {
	var t = document.getElementById("meaning"),
		n = document.createElement("span");
	n.style.fontSize = "18px";
	for (var a = e.split("|"), s = 0; s < a.length; s++) {
		var d = document.createElement("span");
		d.id = "match", d.innerHTML = a[s], n.appendChild(d), s != a.length - 1 && (n.innerHTML = n.innerHTML + ",")
	}
	e.includes("|") ? n.innerHTML = "Did you mean any of these " + n.innerHTML + "?" : n.innerHTML = "Did you mean" + n.innerHTML + "?", t.appendChild(n);
	for (var i = document.querySelectorAll("#match"), o = 0; o < i.length; o++) i[o].addEventListener("click", function () {
		document.getElementById("word").value = this.innerHTML, getData(this.innerHTML, !0, "animate-bottom")
	})
}

function toTitleCase(e) {
	return e.replace(/\w\S*/g, function (e) {
		return e.charAt(0).toUpperCase() + e.substr(1).toLowerCase()
	})
}

function toggleTheme() {
	var e = document.getElementById("theme-switch");
	"light" == document.documentElement.getAttribute("data-theme") ? (removeClass(e, "fa-moon"), addClass(e, "fa-sun"), document.documentElement.setAttribute("data-theme", "dark"), tg.content = "#1d1d1d", localStorage.setItem("theme", "dark")) : (removeClass(e, "fa-sun"), addClass(e, "fa-moon"), document.documentElement.setAttribute("data-theme", "light"), tg.content = "white", localStorage.setItem("theme", "light"))
}

function taggle() {
	var e = document.getElementById("word").value.trim(),
		t = document.getElementById("submit");
	e.length > 0 ? (t.removeAttribute("disabled"), t.disabled = !1, hasClass(t, "disabled") && removeClass(t, "disabled")) : (t.disabled = !0, hasClass(t, "disabled") || addClass(t, "disabled"))
}

function getData(e, t, n) {
	hasClass(document.getElementById("meaning"), "animate-bottom") && removeClass(document.getElementById("meaning"), "animate-bottom"), hasClass(document.getElementById("meaning"), "animate-left") && removeClass(document.getElementById("meaning"), "animate-left"), hasClass(document.getElementById("meaning"), "animate-right") && removeClass(document.getElementById("meaning"), "animate-right"), t && (wordlist = [], cur_index = 0, document.getElementById("word").blur()), document.getElementById("word").value = document.getElementById("word").value.trim(), document.getElementById("meaning").innerHTML = "", document.getElementById("loader").style.display = "", document.getElementById("fixed").style.boxShadow = "none", document.getElementById("meaning").scroll({
		top: 0,
		left: 0
	});
	var a = e.trim(),
		s = (new Date).getTime(),
		d = null,
		i = [0, 1, 2];
	a.toUpperCase() == a && (i = [2, 1, 0]), toTitleCase(a) == a && (i = [1, 0, 2]);
	var o = db.transaction("words", "readonly").objectStore("words").get(a.toLowerCase());
	o.onsuccess = function (e) {
		null != (d = o.result) && s - d.tmst > 2629746e3 && (d = null), 0 == wordlist.length && wordlist.push(a);
		var t, l = 0;
		if (0 == cur_index ? ((t = document.getElementById("backward")).disabled = !0, hasClass(t, "disabled") || addClass(t, "disabled"), l += 1) : ((t = document.getElementById("backward")).disabled = !1, hasClass(t, "disabled") && removeClass(t, "disabled")), cur_index + 1 == wordlist.length ? ((t = document.getElementById("forward")).disabled = !0, hasClass(t, "disabled") || addClass(t, "disabled"), l += 1) : ((t = document.getElementById("forward")).disabled = !1, hasClass(t, "disabled") && removeClass(t, "disabled")), 2 == l ? (document.getElementById("backward").style.display = "none", document.getElementById("forward").style.display = "none") : (document.getElementById("backward").style.display = "", document.getElementById("forward").style.display = ""), null == d) {
			var r = new XMLHttpRequest;
			r.addEventListener("readystatechange", function () {
				if (this.readyState === this.DONE)
					if (this.status >= 200 && this.status < 400) {
						var e = JSON.parse(this.responseText);
						formatData(e, i, n);
						var t = {
							data: e,
							tmst: s
						};
						db.transaction("words", "readwrite").objectStore("words").put(t, a.toLowerCase())
					} else document.getElementById("loader").style.display = "none", hasClass(document.getElementById("meaning"), n) || addClass(document.getElementById("meaning"), n), document.getElementById("meaning").innerHTML = "<span style='font-size:18px'>Unable to contact the server.</span>"
			}), r.open("POST", endpoint, !0), r.setRequestHeader("Content-type", "text/plain"), r.setRequestHeader("Referer2", "https://dictionary.ml/"), r.send(encodeURIComponent(a))
		} else formatData(d.data, i, n)
	}
}

function hasClass(e, t) {
	return e.classList ? e.classList.contains(t) : !!e.className.match(new RegExp("(\\s|^)" + t + "(\\s|$)"))
}

function addClass(e, t) {
	e.classList ? e.classList.add(t) : hasClass(e, t) || (e.className += " " + t)
}

function removeClass(e, t) {
	if (e.classList) e.classList.remove(t);
	else if (hasClass(e, t)) {
		var n = new RegExp("(\\s|^)" + t + "(\\s|$)");
		e.className = e.className.replace(n, " ")
	}
}

function playThis(e) {
	var t = document.getElementById("a" + e);
	t.paused && t.play()
}

function navigation() {
	document.getElementById("backward").style.display = "", document.getElementById("forward").style.display = "";
	var e = "animate-right";
	wordlist.length >= 2 && wordlist[cur_index - 1] == this.innerHTML.trim() ? (cur_index -= 1, e = "animate-left") : ((wordlist = wordlist.slice(0, cur_index + 1)).push(this.innerHTML.trim()), cur_index += 1), getData(this.innerHTML.trim(), !1, e)
}

function formatData(e, t, n) {
	var a = e.words,
		s = 0,
		d = !1;
	document.getElementById("loader").style.display = "none", hasClass(document.getElementById("meaning"), n) || addClass(document.getElementById("meaning"), n), null != a[a.length - 1].match && (a[a.length - 1].match.length > 0 ? suggest(a[a.length - 1].match) : document.getElementById("meaning").innerHTML = "<span style='font-size:18px'>No matches found</span>", d = !0), d || t.forEach(function (e, t) {
		var n = a[e].entries;
		if (n.length > 0) {
			for (var d = 0; d < n.length; d++) {
				s += 1;
				var i = n[d].entry,
					o = document.createElement("div");
				if (o.id = "mainword", n[d].hyphenations && n[d].hyphenations[0]) {
					var l = 0;
					for (l = 0; l < n[d].hyphenations[0].length - 1; l++) o.innerHTML = o.innerHTML + n[d].hyphenations[0][l] + "<span style='margin:2px;color:gray'>·</span>";
					o.innerHTML = o.innerHTML + n[d].hyphenations[0][l] + "<sup>  " + s + "</sup>"
				} else o.innerHTML = i + "<sup>  " + s + "</sup>";
				document.getElementById("meaning").appendChild(o);
				var r = "";
				if (n[d].pronunciations) {
					var m = n[d].pronunciations,
						c = document.createElement("div");
					c.id = "pronunciation";
					for (var u = 0; u < m.length; u++) {
						if (pronunciation = m[u], pronunciation.context)
							for (var g = pronunciation.context.regions, p = 0; p < g.length; p++) r = r + g[p] + ": ";
						if (pronunciation.transcriptions) {
							transcriptions = pronunciation.transcriptions;
							for (var h = 0; h < transcriptions.length; h++) transcription = transcriptions[h].transcription, r = r + "<trans>" + transcription + "</trans> "
						}
						pronunciation.audio && (r = r + "<audio id='a" + u + "' src=\"", r = (r += pronunciation.audio.url) + "\"></audio><i class='fas fa-volume-up' id='x" + u + "' onclick=\"playThis(" + u + ')"></i>'), r += "<br>"
					}
					c.innerHTML = r, document.getElementById("meaning").appendChild(c)
				}
				for (var y = n[d].lexemes, v = y.length, f = 0; f < v; f++) {
					var E = y[f],
						C = E.lemma,
						w = E.partOfSpeech,
						b = E.senses,
						B = document.createElement("div");
					B.id = "lexeme";
					var I = document.createElement("span"),
						L = document.createElement("span");
					I.id = "lemma", L.id = "pos", I.innerHTML = C, L.innerHTML = w, C != i && (I.style.cursor = "pointer", I.addEventListener("click", navigation), addClass(I, "different")), B.appendChild(I), B.appendChild(L);
					for (var x = b.length, T = "", H = 0; H < x; H++) {
						sense = b[H];
						var M = document.createElement("div");
						if (M.id = "newsense", sense.context && sense.context.domains && sense.context.domains.length > 0)
							for (var S = 0; S < sense.context.domains.length; S++) {
								var _ = document.createElement("div");
								_.id = "context", _.innerHTML = sense.context.domains[S], M.appendChild(_)
							}
						if (sense.context && sense.context.regions && sense.context.regions.length > 0)
							for (S = 0; S < sense.context.regions.length; S++) {
								var k = document.createElement("div");
								k.id = "context", k.innerHTML = sense.context.regions[S], M.appendChild(k)
							}
						var D = document.createElement("div");
						if (D.id = "definition", D.innerHTML = sense.definition.replace("(", "<it>(").replace(")", ")</it>"), M.appendChild(D), sense.usageExamples) {
							var N = document.createElement("div");
							N.id = "examples";
							for (var q = 0; q < sense.usageExamples.length; q++) {
								var A = sense.usageExamples[q];
								if (A.search(/\s{2,}/) > 0)
									for (var O = A.split(/\s{2,}/), R = 0; R < O.length; R++) {
										var j;
										(j = document.createElement("div")).innerHTML = "<i id='ex'>\"" + O[R].trim() + '"</i>', N.appendChild(j)
									} else(j = document.createElement("div")).innerHTML = "<i id='ex'>\"" + sense.usageExamples[q] + '"</i>', N.appendChild(j)
							}
							M.appendChild(N), M.appendChild(document.createElement("br"))
						}
						B.appendChild(M)
					}
					var z = 0;
					if (E.synonymSets) {
						synset = E.synonymSets, synset_len = synset.length, (J = document.createElement("div")).id = "synonyms", J.innerHTML = "<span id='sim_text'>Similar:</span>   ";
						for (var U = 0; U < synset_len; U++) {
							synset0 = synset[U].synonyms;
							for (var $ = 0; $ < synset0.length; $++) synset0[$] != i && ((T = document.createElement("div")).innerHTML = synset0[$], T.id = "syn0", T.addEventListener("click", navigation), J.appendChild(T), z++)
						}
						z > 0 && B.appendChild(J)
					}
					if (E.antonymSets) {
						var J;
						for (antset = E.antonymSets, antset_len = antset.length, (J = document.createElement("div")).id = "antonyms", J.innerHTML = "<span id='op_text'>Opposite:</span>   ", U = 0; U < antset_len; U++)
							for (antset0 = antset[U].antonyms, $ = 0; $ < antset0.length; $++) {
								var P = document.createElement("div");
								P.innerHTML = antset0[$], P.id = "ant0", P.addEventListener("click", navigation), J.appendChild(P)
							}
						B.appendChild(J)
					}
					document.getElementById("meaning").appendChild(B)
				}
			}
			for (var X = document.getElementsByTagName("audio"), F = 0; F < X.length; F++) X[F].addEventListener("playing", function () {
				addClass(document.getElementById("x" + this.id.substring(1)), "playing")
			}), X[F].addEventListener("ended", function () {
				removeClass(document.getElementById("x" + this.id.substring(1)), "playing")
			})
		}
	})
}
request.onsuccess = function (e) {
	db = request.result
}, request.onupgradeneeded = function (e) {
	e.target.result.createObjectStore("words")
}, document.getElementById("meaning").addEventListener("scroll", function () {
	var e = document.getElementById("mainword");
	if (void 0 !== e && null != e) {
		var t = document.getElementById("fixed");
		e.getBoundingClientRect().top < 123.5 ? t.style.boxShadow = "var(--float-shadow)" : t.style.boxShadow = "none"
	}
}), document.getElementById("forward").addEventListener("click", function () {
	cur_index + 1 < wordlist.length && getData(wordlist[cur_index += 1], !1, "animate-right")
}), document.getElementById("backward").addEventListener("click", function () {
	cur_index - 1 >= 0 && getData(wordlist[cur_index -= 1], !1, "animate-left")
}), document.body.addEventListener("keyup", function (e) {
	13 === e.keyCode && (e.preventDefault(), 0 == document.getElementById("submit").disabled && getData(document.getElementById("word").value, !0, "animate-bottom"))
}), document.getElementById("word").addEventListener("keyup", taggle), document.getElementById("word").addEventListener("focus", taggle), document.getElementById("submit").addEventListener("mousedown", function () {
	getData(document.getElementById('word').value, true, 'animate-bottom')
});