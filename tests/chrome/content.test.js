var fs = require('fs');
var chrome = require('sinon-chrome');
var sinon = require('sinon');
var assert = require('chai').assert;
var fetchMock = require('fetch-mock')
var jsdom = require('jsdom');

var { JSDOM } = jsdom

sinon.assert.expose(assert, {prefix: ''});

describe('background page', function() {

    var window

    beforeEach(function (done) {
        fetchMock.get('*', {foo: 'bar'})

        let virtualConsole = new jsdom.VirtualConsole()
        virtualConsole.sendTo(console)
        window = new JSDOM('<html></html>', {virtualConsole, runScripts: "dangerously"}).window
        window.chrome = chrome
        window.fetch = fetch
        window.$ = sinon.stub()

        const script = window.document.createElement("script")
        script.type = "text/javascript";
        script.innerHTML = fs.readFileSync('src/chrome/content.js', 'utf-8')
        window.document.body.appendChild(script)

        done()
    })
    afterEach(function() {
        chrome.reset()
        window.close()
        fetchMock.restore()
    })

    it('should do nothing yet', function () {

    })

})



