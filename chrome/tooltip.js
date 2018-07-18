$(function() {
	let glossary = {}

	chrome.storage.sync.get('english-glossary', (data) => {
		fetch(data['english-glossary'])
			.then((resp) => resp.json())
			.then((json) => {
				glossary = json
				console.log('Finished loading translation glossary')
			})
	})

	chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
		    if (request.enabled)
		      	console.log(glossary)
	 });
})