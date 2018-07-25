$(function() {
	let glossary = {}

	$( document ).tooltip();

	// get language
	let language = 'english'
	let langElement = $('.editorLoanLanguage')
	if (langElement.length) {
		let content = langElement.html()
		language = content.substring(content.indexOf('<span>') + '<span>'.length, content.indexOf('<br>')).toLowerCase()
	}

	let glossaryName = language + '-glossary'

	// get glossary
	browser.storage.sync.get(glossaryName, (data) => {
		fetch(data[glossaryName])
			.then((resp) => resp.json())
			.then((json) => {
				glossary = {...json[''], ...json[getCountry()]}
				console.log(`Finished loading ${language} glossary`)
				highlightTerms()
			})
			.catch((err) => {
				console.log(`Could not load ${language} glossary`)
				console.log(err)
			})
	})

	// gives the popup info about this page
	browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
		    if (request.type == 'VIVA_PAGE_INFO') {
		    	sendResponse({country: getCountry(), language: language})
		    }
	});

	function getCountry() {
		let location = $('a[href="#country-section"]').text()
		return location.slice(location.lastIndexOf(',') + 2)
	}

	function highlightTerms() {
		// find all words that appear in glossary and wrap them with spans
		let highlightSections = ['.editorOriginalText', '.loan-description']
		for (section of highlightSections) {
			let descr = $(section)
			if (descr.length) {
				for (let word in glossary) {
					let re = new RegExp('\\b' + word + '\\b', 'ig')
					descr.html(descr.html()
						.replace(re, '<span class="highlight"><a target="_blank">$&</a></span>'))
				}
			}
		}
		// add links and tooltip
		$('.highlight').each(function() {
			$(this).find('a').attr('href', 'https://kiva.forumbee.com' + glossary[$(this).text()].url)
			$(this).append(`<span class="viva-tooltip"><span style="text-decoration:underline">${language.charAt(0).toUpperCase() + language.slice(1)}</span>: ${glossary[$(this).text()].meaning}</span>`)
		})
	}

})