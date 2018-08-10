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


        const script = window.document.createElement("script")
        script.type = "text/javascript";
        script.innerHTML = fs.readFileSync('src/chrome/background.js', 'utf-8')
        window.document.body.appendChild(script)

        done()
    })
    afterEach(function() {
        chrome.reset()
        window.close()
        fetchMock.restore()
    })

    it('should add listeners', function() {
        assert(chrome.runtime.onInstalled.addListener.calledWith(window.init), 'function init not added as listener to onInstalled')
        assert(chrome.runtime.onStartup.addListener.calledWith(window.init), 'function init not added as listener to onStartup')
    })

    it('should get glossaries on initialize', function() {
        // console.log(window.init.toString())
        let getGlossaries = sinon.spy(window, 'getGlossaries')

        window.init()        

        assert.called(getGlossaries)
        getGlossaries.restore()
    })

    it('should make sure two glossaries don\'t have the same terms', function() {
        let g1 = [
            {
                "postKey": "1234",
                "title": "foo",
                "text": "An term used for unimportant variables in programming when the programmer is too lazy to think of an actual name. The origin of such word is described in detail in RFC 3092."
            },
            {
                "postKey": "4567",
                "title": "bar",
                "text": "sentences in lyrical hiphop songs"
            },
            {
                "postKey": "8910",
                "title": "baz",
                "text": " ¯\\_(ツ)_/¯"
            }
        ]

        let g2 = [
            {
                "postKey": "8910",
                "title": "baz",
                "text": " ¯\\_(ツ)_/¯"
            },
            {
                "postKey": "asdf",
                "title": "a",
                "text": "a"
            },
            {
                "postKey": "qwer",
                "title": "b",
                "text": "b"
            },
        ]

        let g3 = [
            {
                "postKey": "asdf",
                "title": "a",
                "text": "a"
            },
            {
                "postKey": "qwer",
                "title": "b",
                "text": "b"
            },
            {
                "postKey": "zxcv",
                "title": "c",
                "text": "c"
            },
        ]

        assert(window.haveCommonEntries(g1, g2), 'glossaries with common entries')
        assert(!window.haveCommonEntries(g1, g3), 'glossaries without common entries')
    })

})



