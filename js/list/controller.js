app.initIndexView = async function(volumes, routerInstance){
	var template = await fetch(APP_BASE + "/js/list/view.html").then(owo=>owo.text())

	let view = proxymity(template, {volumes})

	view.app.read = function(id, progress){
		if (progress < 100){
			return
		}
		routerInstance.rout("/read/" + id)
	}

	view.app.routSelectables = function(){
		routerInstance.rout("/chooseables")
	}

	view.app.routManga = function(){
		routerInstance.rout("/manga")
	}

	view.app.routGuide = function(){
		routerInstance.rout("/guide")
	}

	routerInstance.add("/", view)

	return view
}
