// Rewrites root-absolute src/href attributes so they work when the app is
// hosted under a subpath (e.g. GitHub Pages at /Tensei_Slime/). No-op at root.
(function rewriteRootUrls(){
	var BASE = window.APP_BASE || ""
	if (!BASE) return

	function fix(el){
		var src = el.getAttribute("src")
		var href = el.getAttribute("href")
		if (src && src.charAt(0) === "/") el.setAttribute("src", BASE + src)
		if (href && href.charAt(0) === "/") el.setAttribute("href", BASE + href)
	}

	function scan(root){
		if (root.querySelectorAll){
			root.querySelectorAll('[src^="/"],[href^="/"]').forEach(fix)
		}
	}

	scan(document)

	new MutationObserver(function(mutations){
		mutations.forEach(function(m){
			m.addedNodes.forEach(function(node){
				if (node.nodeType !== 1) return
				if (node.nodeType === 1 && node.querySelectorAll){
					if ((node.getAttribute("src") || "").charAt(0) === "/" || (node.getAttribute("href") || "").charAt(0) === "/"){
						fix(node)
					}
					scan(node)
				}
			})
		})
	}).observe(document.documentElement, {childList: true, subtree: true})
})()

async function app(initConfigs) {
	// uwu test

	// respoond to the incoming global configs
	app.saveSettings = function () {
		app.updateSettings(initConfigs.presist)
	}

	// code to do with changing and saving of theme
	initConfigs.presist.theme = Object.prototype.hasOwnProperty.call(initConfigs.presist, "theme") ? initConfigs.presist.theme : "dark"
	if (initConfigs.presist.theme === "") initConfigs.presist.theme = "light"
	proxymity.watch(initConfigs.presist, "theme", updateTheme)
	updateTheme(initConfigs.presist.theme)

	let themeClasses = ["oled", "dark", "light", "sepialight", "sepiadark", "system"]

	function updateTheme(newTheme) {
		document.documentElement.classList.remove(...themeClasses)
		if (newTheme) {
			document.documentElement.classList.add(newTheme)
		}
		app.saveSettings()
	}

	function initiateConfigProperty(configuredPropertyName, defaultValue) {
		initConfigs.presist[configuredPropertyName] = Object.prototype.hasOwnProperty.call(initConfigs.presist, configuredPropertyName) ? initConfigs.presist[configuredPropertyName] : defaultValue
		proxymity.watch(initConfigs.presist, configuredPropertyName, app.saveSettings)
	}

	// code to do with hiding and showing of the underline of chooseable terms
	initiateConfigProperty("underlineChooseable", true)
	initiateConfigProperty("coloredIllustrations", true)

	initiateConfigProperty("fontFace", "serif")
	initiateConfigProperty("fontSize", undefined)
	let appRoot = document.getElementById("app")

	// "Default" maps to a quality serif stack used for reading
	function applyFontFace(fontFam) {
		if (fontFam === "serif") {
			appRoot.style.fontFamily = "'Georgia', 'Times New Roman', Times, serif"
			return
		}
		if (!fontFam) {
			appRoot.style.removeProperty("font-family")
			return
		}
		appRoot.style.fontFamily = fontFam
	}
	proxymity.watch(initConfigs.presist, "fontFace", applyFontFace)
	applyFontFace(initConfigs.presist.fontFace)

	function applyFontSize(fontSize) {
		if (!fontSize) {
			appRoot.style.removeProperty("font-size")
			return
		}
		appRoot.style.fontSize = fontSize + "px"
	}
	proxymity.watch(initConfigs.presist, "fontSize", applyFontSize)
	applyFontSize(initConfigs.presist.fontSize)

	// reading comfort: line height and content column width
	initiateConfigProperty("lineHeight", undefined)
	initiateConfigProperty("readingWidth", "normal")
	const readingWidths = { narrow: "30rem", normal: "42rem", wide: "52rem" }

	function applyLineHeight(lineHeight) {
		if (!lineHeight) {
			appRoot.style.removeProperty("--line-height-reading")
			return
		}
		appRoot.style.setProperty("--line-height-reading", lineHeight)
	}
	proxymity.watch(initConfigs.presist, "lineHeight", applyLineHeight)
	applyLineHeight(initConfigs.presist.lineHeight)

	function applyReadingWidth(width) {
		if (!readingWidths[width]) {
			appRoot.style.removeProperty("--reading-max-width")
			return
		}
		appRoot.style.setProperty("--reading-max-width", readingWidths[width])
	}
	proxymity.watch(initConfigs.presist, "readingWidth", applyReadingWidth)
	applyReadingWidth(initConfigs.presist.readingWidth)

	// setup the different views
	let router = app.router = app.routerFactory(appRoot)

	let navEl = document.getElementById("nav")
	let appEl = document.getElementById("app")

	let nav = app.nav = await app.initNav(initConfigs.presist, router)
	nav.appendTo(navEl)

	let indexView = app.indexView = await app.initIndexView(initConfigs.volumeList, router)

	let globalTermchoices = initConfigs.presist.chosenTerms = initConfigs.presist.chosenTerms || {}

	let searcher = app.searcher = await app.initTextSearcher(router, appEl)

	let managaList = app.mangaList = await app.initMangaList(router, initConfigs.mangaList)

	let namePicker = app.namePicker = await app.initNamePicker(router, appEl, globalTermchoices)

	Object.keys(initConfigs.terms).forEach(term => globalTermchoices[term] = globalTermchoices[term] || term)

	let termsChooser = app.termsChooser = await app.initChooseablesView(globalTermchoices, initConfigs.terms, router)

	let guide = app.guide = await app.initGuide(router)

	let reader = app.reader = await app.initReader(initConfigs.volumeList, router, namePicker, initConfigs.terms, globalTermchoices, initConfigs.presist)

	let footer = app.footer = await app.initFooter(initConfigs.presist)
	footer.appendTo(document.getElementById("footer"))

	let title = app.title = await app.initTitle(router)
	title.appendTo(document.head)

	// set up the router and stuff
	window.addEventListener("popstate", ev => {
		app.router.rout()
	})

	function updateNavHeight() {
		document.body.style.setProperty("--menu-height", navEl.offsetHeight + "px")
	}
	window.addEventListener("resize", updateNavHeight)
	proxymity.watch(nav.app, "menuOpen", updateNavHeight)
	updateNavHeight()

	app.router.rout()

}

// Init ========================================================

// app.init() is called in the index.html file
app.init = async function () {
	let url = path => (window.APP_BASE || "") + path

	let [volumeList, terms, mangaList] = await Promise.all([
		fetch(url("/ln/volumes.json")).then(owo => owo.json()),
		fetch(url("/ln/terms.json")).then(owo => owo.json()),
		fetch(url("/manga.json")).then(owo => owo.json())
	])

	let presist = app.getSettings()

	return app({ volumeList, terms: terms.terms, presist, mangaList })
}
