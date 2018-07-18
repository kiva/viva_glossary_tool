chrome.runtime.onInstalled.addListener(function() {

	const url = chrome.runtime.getURL('data/english-glossary.json');

	chrome.storage.sync.set({'english-glossary': url}, function() {
        console.log('glossary set!');
    });
});