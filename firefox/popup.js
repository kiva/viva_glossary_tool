$(function() {
	let pageLang = 'english'
	let pageCountry = 'Afghanistan'
	let glossary = {}

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

	$('#search-input').on('input', () => {
		displayTerm()
		showDatalistOnLength(2)
	})
	$('#countries').on('change', () => {
		displayTerm()
		updateAutocomplete()
	})

	function showDatalistOnLength(l) {
		if ($('#search-input').val().length < l) {
			$('#search-input').removeAttr('list')
		} else {
			$('#search-input').attr('list', 'glossary-terms')
		}
	}

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
			updateAutocomplete()
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
		browser.storage.local.get(glossaryName, (data) => {
			glossary = data[glossaryName]
			for (let country of Object.keys(glossary).sort()) {
				if (country !== '')
					$('#countries').append(`<option value="${country}">${country}</option>`)
			}
			callback()
		})
	}

	function updateAutocomplete() {
		console.log('updating')
		$('#glossary-terms').empty()
		let keys = ['', $('#countries').val()]

		for (let key of keys) {
			for (let term in glossary[key]) {
				console.log(term)
				$('#glossary-terms').append(`<option value="${term}">`)
			}
		}
	}

	$('#reload').click(function() {
		browser.runtime.reload()
	})
})

