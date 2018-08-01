$(function() {
	let glossary = {}

	$( document ).tooltip();

	// scrapes language from the viva page
	let language = 'english'
	let langElement = $('.editorLoanLanguage')
	if (langElement.length) {
		let content = langElement.html()
		language = content.substring(content.indexOf('<span>') + '<span>'.length, content.indexOf('<br>')).toLowerCase()
	}

	let glossaryName = language + '-glossary'

	// get glossary from storage set by background.js
	browser.storage.local.get(glossaryName, (data) => {

		let g = data[glossaryName]
		glossary = {...g[''], ...g[getCountry()]}
		console.log(`Finished loading ${language} glossary`)
		highlightTerms()
	})

	// gives the popup the language and country of this page
	browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
		    if (request.type == 'VIVA_PAGE_INFO') {
		    	sendResponse({country: getCountry(), language: language})
		    }
	});

	// scrapes the name of the country from the current Viva page
	function getCountry() {
		let location = $('a[href="#country-section"]').text()
		return location.slice(location.lastIndexOf(',') + 2)
	}

	// highlight and add tooltip to words that match glossary terms
	function highlightTerms() {
		let highlightSections = ['.editorOriginalText', '.loan-description']

		// find all words that appear in glossary and wrap them with spans
		for (section of highlightSections) {
			let descr = $(section)
			if (descr.length) {
				for (let word in glossary) {
					// search for the word surrounded by non-letter characters 
					let re = new RegExp('\\b' + word + '\\b', 'ig') 
					descr.html(descr.html()
						.replace(re, '<span class="highlight"><a target="_blank">$&</a></span>'))
				}
			}
		}
		// add links and tooltips to highlighted words
		$('.highlight').each(function() {
			let entry = glossary[$(this).text().toLowerCase()]
			let meaning = entry.meaning

			// cut off definition by arbitrary length if too long
			if (language.length + meaning.length > 128) {
				meaning = meaning.substring(0, 128 - language.length - '...'.length) + '...'
			}
			
			$(this).find('a').attr('href', 'https://kiva.forumbee.com' + entry.url)
			$(this).append(`<span class="viva-tooltip"><span style="text-decoration:underline">${language.charAt(0).toUpperCase() + language.slice(1)}</span>: ${meaning}</span>`)
		})
	}

})