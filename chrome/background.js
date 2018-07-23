let languages = ['english', 'spanish', 'french', 'portuguese', 'russian']

chrome.runtime.onInstalled.addListener(function() {

	for (let i in languages) {
		let lang = languages[i]
		let glossaryName = lang + '-glossary'
		const url = chrome.runtime.getURL('data/' + glossaryName + '.json');

		let obj = {}
		obj[glossaryName] = url
		chrome.storage.sync.set(obj, function() {
	        console.log(lang + ' glossary set!');
	    });
	}
});