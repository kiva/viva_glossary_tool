$(function() {
	let glossary = {}

	chrome.storage.sync.get('english-glossary', (data) => {
		fetch(data['english-glossary'])
			.then((resp) => resp.json())
			.then((json) => {
				glossary = {...json[''], ...json[getCountry()]}
				console.log('Finished loading translation glossary')
				highlightTerms()
			})
	})

	chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
		    if (request.enabled)
		      	console.log(glossary)
	});

	function getCountry() {
		let location = $('a[href="#country-section"]').text()
		return location.slice(location.indexOf(',') + 2)
	}

	function highlightTerms() {
		let descr = $('.loan-description')
		if (descr.length) {
			for (let word in glossary) {
				let re = new RegExp('\\b' + word + '\\b', 'ig')
				descr.html(descr.html()
					.replace(re, '<span class="highlight">$&</span>'))
			}
		}
	}
})