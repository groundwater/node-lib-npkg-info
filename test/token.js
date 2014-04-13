var test   = require('tap').test
var join   = require('path').join
var normal = require('path').normalize

var NPackage = require('../index.js')()

test('load from absolute token', function(t){
  var np = NPackage.NewFromToken(__dirname + '/module')

  t.equals(np.json.name, 'DEMO', 'loads package.json')
  t.equals(np.root, normal(join(__dirname, 'module')))

  t.end()
})

test('load from token with custom root', function(t){
  var np = NPackage.NewFromToken('custom', __dirname)

  t.equals(np.json.name, 'CUSTOM', 'loads package.json')
  t.equals(np.root, normal(join(__dirname, 'lib/node_modules/custom')))

  t.end()
})
