var fs = require('fs');
var vtpbf = require('vt-pbf');
var VectorTile = require('@mapbox/vector-tile').VectorTile;
var Protobuf = require('pbf');

var data = fs.readFileSync(__dirname + '\\pbf\\1.pbf');
// console.log('data', data);

var tile = new VectorTile(new Protobuf(data));
console.log(tile.layers['World_Countries']);
// var orig = tile.layers['geojsonLayer'].feature(0).toGeoJSON(0, 0, 1);
// var buff = vtpbf(tile);
//fs.writeFileSync('my-tile.pbf', buff);
