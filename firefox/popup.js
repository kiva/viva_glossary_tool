$(function() {
	let pageLang = 'english'
	let pageCountry = 'Afghanistan'
	let glossary = {}

	browser.tabs.query({active: true, currentWindow: true}, function(tabs) {
		browser.tabs.sendMessage(tabs[0].id, {type: 'VIVA_PAGE_INFO'}, function(resp) {
			if (resp) {
				pageCountry = resp.country
				pageLang = resp.language
				console.log(resp)
			}

			$('#languages').val(pageLang)
			console.log(pageCountry)
		});
	});
	
	getGlossary(pageLang, function () {
		$('#countries').val(pageCountry)
	})
	

	$('#search-input').on('input', displayTerm)
	$('#countries').on('change', displayTerm)

	function displayTerm() {
		let term = $('#search-input').val().toLowerCase()
		let data = getTerm(term)
		if (data) {
			$('#results').html(`${data.meaning}<br><a target="_blank" class="forumbee-link" href="https://kiva.forumbee.com${data.url}">Read more</a>`)
			$('#results').addClass('definition')
		} else {
			$('#results').text('The definition will appear here.')
			$('#results').removeClass('definition')
		}
	}

	// update glossary and change country selections when language changes
	$('#languages').on('change', function () {
		$('#countries').empty()
		getGlossary($(this).val(), () => {
			if (pageLang === $(this).val()) {
				$('#countries').val(pageCountry)
			}
		})
	})

	function getTerm(term) {
		let country = $('#countries').val()
		if (country && glossary[country][term]) {
			return glossary[country][term]
		} else {
			return glossary[''][term]
		}
	}

	function getGlossary(name, callback) {
		let glossaryName = name + '-glossary'
		browser.storage.sync.get(glossaryName, (data) => {
			fetch(data[glossaryName])
				.then((resp) => resp.json())
				.then((json) => {
					glossary = json
					for (let country in glossary) {
						if (country !== '')
							$('#countries').append(`<option value="${country}">${country}</option>`)
					}
				}).then(callback)
		})
	}
})

