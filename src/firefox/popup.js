$(function() {
	let pageLang = 'english'
	let pageCountry = 'All Countries'
	let glossary = {}

	// request language and country from the content script
	browser.tabs.query({active: true, currentWindow: true}, function(tabs) {
		browser.tabs.sendMessage(tabs[0].id, {type: 'VIVA_PAGE_INFO'}, function(resp) {
			if (resp) {
				pageCountry = resp.country
				pageLang = resp.language
			}

			$('#languages').val(pageLang)

			getGlossary(pageLang, function () {
				$('#countries').val(pageCountry)
				updateAutocomplete()
			})
		});
	});

	// when the user types into the search input, display the definition if there is one
	// and show autocomplete suggestions if the input is more than 2 characters long
	$('#search-input').on('input', () => {
		displayTerm()
		showDatalistOnLength(2)
	})

	// when the user selects a different country, automatically search for definition again
	// and update the autocomplete to show words from that country
	$('#countries').on('change', () => {
		displayTerm()
		updateAutocomplete()
	})

	// update glossary and change country selections when the user's language choice changes
	$('#languages').on('change', function () {
		$('#countries').empty()
		getGlossary($(this).val(), () => {
			if (pageLang === $(this).val()) {
				$('#countries').val(pageCountry)
			}
			updateAutocomplete()
		})
	})

	// only shows the autocomplete suggestions when the length of input is long enough
	function showDatalistOnLength(l) {
		if ($('#search-input').val().length < l) {
			$('#search-input').removeAttr('list')
		} else {
			$('#search-input').attr('list', 'glossary-terms')
		}
	}

	// shows the definition of the search if applicable
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

	// attempts to find the term in both the country glossary and the uncategorized glossary
	function getTerm(term) {
		let country = $('#countries').val()
		if (country === 'All Countries') {
			for (let c in glossary) {
				if (glossary[c][term]) {
					return glossary[c][term]
				}
			}
		} else {
			if (country && glossary[country][term]) {
				return glossary[country][term]
			} else {
				return glossary[''][term]
			}
		}
	}

	// gets the glossary from storage, set by the background script
	function getGlossary(name, callback) {
		let glossaryName = name + '-glossary'
		browser.storage.local.get(glossaryName, (data) => {
			glossary = data[glossaryName]
			$('#countries').append(`<option value="All Countries">All Countries</option>`)
			for (let country of Object.keys(glossary).sort()) {
				if (country !== '')
					$('#countries').append(`<option value="${country}">${country}</option>`)
			}
			callback()
		})
	}

	// clears the autocomplete suggestions and loads in ones from the current country
	function updateAutocomplete() {
		console.log('updating')
		$('#glossary-terms').empty()
		if ($('#countries').val() === 'All Countries') {
			for (let key in glossary) {
				for (let term in glossary[key]) {
					$('#glossary-terms').append(`<option value="${term}">`)
				}
			}
		} else {
			let keys = ['', $('#countries').val()]

			for (let key of keys) {
				for (let term in glossary[key]) {
					$('#glossary-terms').append(`<option value="${term}">`)
				}
			}
		}
	}

	// reload extension button
	$('#reload').click(function() {
		browser.runtime.reload()
	})
})

