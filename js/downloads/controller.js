app.initDownloads = async function (routerInstance) {
	let template = await fetch(APP_BASE + "/js/downloads/view.html").then(owo => owo.text())

	let files = [
		"PDF_Slimes/That Time I Got Reincarnated as a Slime, Vol. 1.pdf",
		"PDF_Slimes/That Time I Got Reincarnated as a Slime, Vol. 2.pdf",
		"PDF_Slimes/That Time I Got Reincarnated as a Slime, Vol. 3.pdf",
		"PDF_Slimes/That Time I Got Reincarnated as a Slime, Vol. 4.pdf",
		"PDF_Slimes/That Time I Got Reincarnated as a Slime, Vol. 5.pdf",
		"PDF_Slimes/That Time I Got Reincarnated as a Slime, Vol. 6.pdf",
		"PDF_Slimes/That Time I Got Reincarnated as a Slime, Vol. 7.pdf",
		"PDF_Slimes/That Time I Got Reincarnated as a Slime, Vol. 8.pdf",
		"PDF_Slimes/That Time I Got Reincarnated as a Slime, Vol. 9.pdf",
		"PDF_Slimes/That Time I Got Reincarnated as a Slime, Vol. 10.pdf",
		"PDF_Slimes/That Time I Got Reincarnated as a Slime, Vol. 11.pdf",
		"PDF_Slimes/That Time I Got Reincarnated as a Slime, Vol. 12.pdf",
		"PDF_Slimes/That Time I Got Reincarnated as a Slime, Vol. 14.pdf",
		"PDF_Slimes/That Time I Got Reincarnated as a Slime, Vol. 15.pdf",
		"PDF_Slimes/That Time I Got Reincarnated as a Slime, Vol. 16.pdf",
		"PDF_Slimes/That Time I Got Reincarnated as a Slime, Vol. 17.pdf"
	]

	let pdfs = files.map(file => {
		let match = file.match(/Vol\. (\d+)\.pdf$/)
		let vol = match ? Number(match[1]) : 0
		return {
			vol,
			name: match ? "Volume " + match[1] : file,
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
