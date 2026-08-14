app.initDownloads = async function (routerInstance) {
	let template = await fetch(APP_BASE + "/js/downloads/view.html").then(owo => owo.text())

	let volumeNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 16, 17, 18, 19, 20, 21, 22]

	let files = volumeNumbers.map(vol =>
		"PDF_Slimes/That Time I Got Reincarnated as a Slime, Vol. " + vol + ".pdf"
	)
	files.unshift("PDF_Slimes/Tensei Shitara Slime Datta Ken_ Complete.pdf")

	let pdfs = files.map(file => {
		let match = file.match(/Vol\. (\d+)\.pdf$/)
		let vol = match ? Number(match[1]) : 0
		return {
			vol,
			name: match ? "Volume " + match[1] : "Complete Collection (Volumes 1\u201322)",
			href: (window.APP_BASE || "") + "/" + file.split("/").map(encodeURIComponent).join("/")
		}
	}).sort((a, b) => a.vol - b.vol)

	let view = proxymity(template, {
		title: "PDF Downloads",
		description: "Downloadable PDF files of the light novels.",
		pdfs
	})

	routerInstance.add("/downloads", view)

	return view
}
