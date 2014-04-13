var test   = require('tap').test
var join   = require('path').join
var normal = require('path').normalize

var NPackage = require('../index.js')()

test('load from path', function(t){
  var np = NPackage.NewFromPath(join(__dirname, '..'))

  t.equals(np.json.name, 'lib-npkg-info', 'loads package.json')
  t.equals(np.root, normal(join(__dirname, '..')), 'path should be normalized')

  t.end()
})

test('make task', function(t){
  var np = NPackage.NewFromPath(join(__dirname, 'module'))
  var task = np.makeTask();

  t.equals(task.exec, 'node', 'has node exec')
  t.deepEquals(task.args, ['tests', 'allz', 'the', 'thingz'])
  t.deepEquals(task.envs, {A: 'B'})
  t.equals(task.cwd, join(__dirname, 'module'))

  t.end()
})

test('set environment', function(t){
  var np = NPackage.NewFromPath(join(__dirname, 'module'))

  np.setEnv('A', 'aaa')

  t.equals(np.envs.A, 'aaa');
  t.end()
})

test('merge environment', function(t){
  var np = NPackage.NewFromPath(join(__dirname, 'module'))

  np.setEnv('B', 'aaa')

  var task = np.makeTask();

  t.deepEquals(task.envs, {
    A: 'B',
    B: 'aaa'
  });
  t.end()
})

test('cli environment overrides module', function(t){
  var np = NPackage.NewFromPath(join(__dirname, 'module'))

  np.setEnv('A', 'aaa')

  var task = np.makeTask();

  t.deepEquals(task.envs, {
    A: 'B',
  });
  t.end()
})
