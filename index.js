'use strict';

var check = require('lib-checked-domain')();
var join = require('path').join;

function NPackage() {
  this.json = null;
  this.root = null;
  this.envs = {};
}

NPackage.prototype.makeTask = function () {
  if (!this.json.scripts) throw check.Error('NoScript', 'no scripts defined');
  if (!this.json.scripts.start) throw check.Error('NoScript', 'no start script');

  var start = this.$.cmd(this.json.scripts.start);
  var out = { envs: {} };

  out.exec = start.exec;
  out.args = start.args;
  out.cwd  = this.root;

  Object.keys(this.envs).forEach(function (key) {
    out.envs[key] = this.envs[key];
  }, this);

  Object.keys(start.envs).forEach(function (key) {
    out.envs[key] = start.envs[key];
  }, this);

  return out;
};

NPackage.prototype.setEnv = function (key, val) {
  this.envs[key] = val;
};

NPackage.NewEmpty = function () {
  return Object.defineProperty(new NPackage(), '$', {value: this});
};

NPackage.NewFromToken = function (token, root) {
  var libs = root ? join(root, this.LIB_PREFIX) : root;
  return this.NewFromPath(this.resolve(token, libs));
};

NPackage.NewFromPath = function (path) {
  var file;
  var pack = join(path, 'package.json');

  try { file = this.readFileSync(pack); } catch (e) {
    throw check.Error('NoPackage', 'no package.json');
  }

  var npkg = this.NewEmpty();

  npkg.root = path;

  try { npkg.json = JSON.parse(file); } catch (e) {
    throw check.Error('JSONParse', 'bad package.json');
  }

  return npkg;
};

function inject(deps) {
  return Object.create(NPackage, deps);
}

function defaults() {
  return {
    readFileSync: {
      value: require('fs').readFileSync
    },
    cmd: {
      value: require('lib-cmdparse')
    },
    resolve: {
      value: require('lib-npkg-resolve')
    },
    LIB_PREFIX: {
      value: 'lib/node_modules'
    }
  };
}

module.exports = function(deps) {
  return inject(deps || defaults());
};
