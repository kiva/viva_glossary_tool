let languages = ['english', 'spanish', 'french', 'portuguese', 'russian']

browser.runtime.onInstalled.addListener(function() {

	for (let i in languages) {
		let lang = languages[i]
		let glossaryName = lang + '-glossary'
		const url = browser.runtime.getURL('data/' + glossaryName + '.json');

		let obj = {}
		obj[glossaryName] = url
		browser.storage.sync.set(obj, function() {
	        console.log(lang + ' glossary set!');
	    });
	}
});