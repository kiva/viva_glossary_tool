var fs = require('fs');
var browser = require('sinon-chrome/webextensions');
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
        window = new JSDOM(fs.readFileSync('src/firefox/popup.html', 'utf-8'), {virtualConsole, runScripts: "dangerously"}).window
        window.browser = browser
        window.fetch = fetch

        done()
    })
    afterEach(function() {
        browser.reset()
        window.close()
        fetchMock.restore()
    })

    it('should load the page and the script without errors', function () {

    })

})



