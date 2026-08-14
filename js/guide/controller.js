app.initGuide = async function (routerInstance) {
	let template = await fetch(APP_BASE + "/js/guide/view.html").then(owo => owo.text())

	let view = proxymity(template, {
		title: "Continuation Guide",
		description: "Where to continue reading the Tensura light novel and manga after the anime."
	})

	routerInstance.add("/guide", view)

	return view
}
