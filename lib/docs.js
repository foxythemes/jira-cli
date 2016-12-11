'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Docs = function () {
	function Docs() {
		(0, _classCallCheck3.default)(this, Docs);
	}

	(0, _createClass3.default)(Docs, [{
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