'use strict';

function NPackage() {
  this.json = null;
  this.root = null;
  this.flag = {
    global: true
  };
  this.envs = {};
}

NPackage.prototype.makeTask = function () {
  var start = this.$.cmd(this.json.scripts.start);

  start.cwd = this.root;

  return start;
};

NPackage.NewEmpty = function () {
  return Object.defineProperty(new NPackage(), '$', {value: this});
};

NPackage.NewFromPath = function (path) {
  var file = this.readFileSync(path + '/package.json');

  var npkg = this.NewEmpty();

  npkg.root = path;
  npkg.json = JSON.parse(file);

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
    }
  };
}

module.exports = function(deps) {
  return inject(deps || defaults());
};
