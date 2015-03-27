var test = require('tape').test,
    assert = require('assert'),
    glob = require('glob'),
    fs = require('fs'),
    geojsonhint = require('geojsonhint'),
    tj = require('../');

if (!process.browser) {
    var xmldom = require('xmldom');
}

test('GPX', function(t) {
    glob.sync('test/data/*.gpx').forEach(function(file) {
        gpxFixtureEqual(t, file);
    });
    t.end();
});

function kmlFixtureEqual(t, file) {
    if (process.env.UPDATE) {
        var output = tj.kml(toDOM(fs.readFileSync(file)));
        fs.writeFileSync(file + '.geojson', JSON.stringify(output, null, 4));
    }
    var gj = fs.readFileSync(file + '.geojson', 'utf8')
    var valid = geojsonhint.hint(gj)
    t.deepEqual(valid, [], 'valid geojson')
    t.equal(
        JSON.stringify(tj.kml(toDOM(fs.readFileSync(file))), null, 4),
        gj,
        file);
}

function gpxFixtureEqual(t, file) {
    if (process.env.UPDATE) {
        var output = tj.gpx(toDOM(fs.readFileSync(file)));
        fs.writeFileSync(file + '.geojson', JSON.stringify(output, null, 4));
    }

    var gj = JSON.parse(fs.readFileSync(file + '.geojson', 'utf8'))
    var valid = geojsonhint.hint(gj)
    t.deepEqual(valid, [], 'valid geojson')
    t.deepEqual(
        tj.gpx(toDOM(fs.readFileSync(file, 'utf8'))),
        gj,
        file);
}

test('KML', function(t) {
    glob.sync('test/data/*.kml').forEach(function(file) {
        kmlFixtureEqual(t, file);
    });
    t.end();
});

function toDOM(_) {
    if (typeof DOMParser === 'undefined') {
        return (new xmldom.DOMParser()).parseFromString(_.toString());
    } else {
        return (new DOMParser()).parseFromString(_, 'text/xml');
    }
}
