let Browser = require('zombie'),
    assert = require('chai').assert;

let browser;

suite('Cross-Page Tests', () => {
    setup(() => {
        browser = new Browser();
    });

    test('requesting a group rate quote from to hood river tour page should ' +
        'populate the hidden referrer field correctly', () => {
        let referrer = 'http://jujin.com:3000/tours/hood-river';
        browser.visit(referrer, () => {
            browser.clickLink('.requestGroupRate', () => {
                assert(browser.field('referrer').value === referrer);
            });
        });
    });

    test('requesting a group rate from the oregon coast tour page should ' +
        'populate the hidden referrer field correctly', () => {
        let referrer = 'http://jujin.com:3000/tours/oregon-coast';
        browser.visit(referrer, () => {
            browser.clickLink('.requestGroupRate', () => {
                assert(browser.field('referrer').value === referrer);
            });
        });
    });

    test('visiting the "request group rate" page directly should result ' +
        'in an empty value for the referrer field', () => {
        browser.visit('http://jujin.com:3000/tours/request-group-rate', () => {
            assert(browser.field('referrer').value === '');
        });
    });
});
