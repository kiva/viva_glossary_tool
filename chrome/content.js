$(function() {
	let glossary = {}

	$( document ).tooltip();

	chrome.storage.sync.get('english-glossary', (data) => {
		fetch(data['english-glossary'])
			.then((resp) => resp.json())
			.then((json) => {
				glossary = {...json[''], ...json[getCountry()]}
				console.log('Finished loading translation glossary')
				highlightTerms()
			})
	})

	// just an example of communication between content script and popup script
	chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
		    if (request.enabled)
		      	console.log(glossary)
	});

	function getCountry() {
		let location = $('a[href="#country-section"]').text()
		return location.slice(location.indexOf(',') + 2)
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
			$(this).append(`<span class="viva-tooltip">${glossary[$(this).text()].meaning}</span>`)
		})
	}

})