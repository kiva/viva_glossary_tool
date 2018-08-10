var fs = require('fs');
var browser = require('sinon-chrome/webextensions');
var sinon = require('sinon');
var assert = require('chai').assert;
var fetchMock = require('fetch-mock')
var jsdom = require('jsdom');

var { JSDOM } = jsdom

sinon.assert.expose(assert, {prefix: ''});

describe('content script', function() {

    var window

    beforeEach(function (done) {
        fetchMock.get('*', {foo: 'bar'})

        let virtualConsole = new jsdom.VirtualConsole()
        virtualConsole.sendTo(console)
        window = new JSDOM('<html></html>', {virtualConsole, runScripts: "dangerously"}).window
        window.browser = browser
        window.fetch = fetch
        window.$ = sinon.stub()

        const script = window.document.createElement("script")
        script.type = "text/javascript";
        script.innerHTML = fs.readFileSync('src/firefox/content.js', 'utf-8')
        window.document.body.appendChild(script)

        done()
    })
    afterEach(function() {
        browser.reset()
        window.close()
        fetchMock.restore()
    })

    it('should load the script to the DOM without errors', function () {

    })

})



