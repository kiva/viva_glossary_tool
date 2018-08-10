var fs = require('fs');
var chrome = require('sinon-chrome');
var sinon = require('sinon');
var assert = require('chai').assert;
var fetchMock = require('fetch-mock')
var jsdom = require('jsdom');

var { JSDOM } = jsdom

sinon.assert.expose(assert, {prefix: ''});

describe('popup page', function() {

    var window

    beforeEach(function (done) {
        fetchMock.get('*', {foo: 'bar'})

        let virtualConsole = new jsdom.VirtualConsole()
        virtualConsole.sendTo(console)
        window = new JSDOM(fs.readFileSync('src/chrome/popup.html', 'utf-8'), {virtualConsole, runScripts: "dangerously"}).window
        window.chrome = chrome
        window.fetch = fetch

        done()
    })
    afterEach(function() {
        chrome.reset()
        window.close()
        fetchMock.restore()
    })

    it('should load the page and the script without errors', function () {

    })

})



