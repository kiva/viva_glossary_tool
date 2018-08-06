var fs = require('fs');
var chrome = require('sinon-chrome');
var sinon = require('sinon');
var chai = require('chai');
var jsdom = require('jsdom/lib/old-api');

sinon.assert.expose(chai.assert, {prefix: ''});

describe('background page', function() {

    var window

    beforeEach(function (done) {
        jsdom.env( {
            html: "<html></hmtl>",
            src: [fs.readFileSync('src/chrome/background.js', 'utf-8')],
            created: function(errors, wnd) {
                wnd.chrome = chrome
                wnd.console = console                
            },
            done: function(errors, wnd) {
                if (errors) {
                    console.log(errors)
                    done(true)
                }
                else {
                    window = wnd
                    done();
                }
            } 
        })
    })
    afterEach(function() {
        chrome.reset()
        window.close()
    })

    it('should call init function', function() {
        var init = sinon.spy(window.init)
        chrome.runtime.onInstalled.dispatch()
        sinon.assert.calledOnce(init)
    })
    it('should get glossaries from ForumBee', function() {
        var getGlossaries = sinon.spy(window.getGlossaries)
        sinon.assert.calledOnce(getGlossaries)
    })

})



