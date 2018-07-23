$(function() {
	let glossary = {}
	
	chrome.storage.sync.get('english-glossary', (data) => {
	fetch(data['english-glossary'])
		.then((resp) => resp.json())
		.then((json) => {
			glossary = json
			for (let country in glossary) {
				if (country !== '')
					$('#countries').append(`<option value="${country}">${country}</option>`)
			}
		})
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

	function getTerm(term) {
		let country = $('#countries').val()
		if (glossary[country][term] !== undefined) {
			return glossary[country][term]
		} else {
			return glossary[''][term]
		}
	}
})

