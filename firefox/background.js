let glossaries = {
	'english': 'english-terminology-for-editors',
	'spanish': 'spanish-glossary',
	'french': 'french-glossary',
	'portuguese': 'portuguese-glossary',
	'russian': 'russian-glossary'
}

browser.runtime.onInstalled.addListener(init)
browser.runtime.onStartup.addListener(init)


function init() {
	getGlossaries().catch(() => {
		console.log('Could not get ForumBee. Using local glossary instead.')
		for (let lang in glossaries) {
			let glossaryName = lang + '-glossary'
			const url = browser.runtime.getURL('data/' + glossaryName + '.json');

			fetch(url).then((resp) => {
				return resp.json()
			}).then((data) => {
				let obj = {}
				obj[glossaryName] = data
				browser.storage.local.set(obj, function() {
			        console.log(lang + ' glossary set!');
			    });
			})
		}
	})
}

async function getGlossaries() {
	for (let lang in glossaries) {
		console.log('starting ' + lang)
		let g = glossaries[lang]
		let data = []
		let i = 0
		let isLast = false
		while (!isLast) {
			let url = `https://kiva.forumbee.com/api/2/posts?fields=postKey,title,text&categoryLink=${g}&postType=topics&textFormat=plain&limit=1000&offset=${i*1000}`
			let site = await fetch(url, { credentials: 'include' })
			let page = await site.json()

			if (page.data.length < 1000) {
				isLast = true
			}

			if (haveCommonEntries(data, page.data)) {
				break;
			}

			data = data.concat(page.data)

			i++
		}

		let glossary = await parseGlossary(data)

		let obj = {}
		obj[lang + '-glossary'] = glossary
		browser.storage.local.set(obj, function() {
	        console.log(lang + ' glossary set!');
	    });
	}
}

let re = /( [^ a-zA-Z0-9\-]| or|\/)/
let countryUrl = 'https://gist.githubusercontent.com/kalinchernev/486393efcca01623b18d/raw/daa24c9fea66afb7d68f8d69f0c4b8eeb9406e83/countries'
let variousCountries = [
    'other',
    'etc',
    'various',
    'many',
]

async function parseGlossary (data) {
	let glossary = {}
	for (let entry of data) {
		let title = entry.title.toLowerCase()
		let titleEnd = title.search(re)
		if (titleEnd !== -1) {
			title = title.substring(0, titleEnd)
		}

		let url = '/t/' + entry.postKey

		let meaningStart = entry.text.indexOf('Meaning: ') + 'Meaning: '.length
		let meaningEnd = entry.text.indexOf(' Country: ')
		let countryStart = meaningEnd + ' Country: '.length
		let countryEnd = entry.text.indexOf(' Field Partner:')

		let meaning = entry.text.substring(meaningStart, meaningEnd)
		let countries = entry.text.substring(countryStart, countryEnd)

		let countryFile = await fetch(countryUrl)
		let countryText = await countryFile.text()
		let allCountries = countryText.split('\n')

		let countryList = []
		if (new RegExp(variousCountries.join("|")).test(countries)) {
			countryList.push('')
		} else {
			for (let c of allCountries) {
				if (countries.includes(c)) {
					countryList.push(c)
				}
			}
			if (countryList.length === 0) {
				countryList.push('')
			}
		}

		for (let c of countryList) {
			if (!(c in glossary)) {
				glossary[c] = {}
			}

			glossary[c][title] = {meaning: meaning, url: url}
		}
	}
	return glossary
}

function haveCommonEntries(d1, d2) {
	for (let e1 of d1) {
		for (let e2 of d2) {
			if (e1.title === e2.title) {
				return true
			}
		}
	}
	return false
}