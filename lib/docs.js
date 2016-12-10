'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Docs = function () {
	function Docs() {
		_classCallCheck(this, Docs);
	}

	_createClass(Docs, [{
		key: 'config',
		value: function config() {
			console.log('');
			console.log('  Usage:  config <command>');
			console.log('');
			console.log('');
			console.log('  Commands:');
			console.log('');
			console.log('    remove 		Remove the config file');
			console.log('');
		}
	}]);

	return Docs;
}();

exports.default = Docs;
module.exports = exports['default'];