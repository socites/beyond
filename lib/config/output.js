(function() {
	'use strict';
	var chalk = require('chalk');
	
	/**
	 * Helper function for console outputs, nothing special
	*/
	function Output() {
		let op = this;		
		let beyond = chalk.white.bgBlack.dim('BeyondJS') +' ';
		let err = beyond+' '+chalk.red.bgBlack('ERR!') +' ';
		let war = beyond+' '+chalk.black.bgYellow('WARN') +' ';
		let inf = beyond+' '+chalk.white.bgBlue('Info') +' ';
		let message = chalk.white.dim;
		
		/**
		 * display a message in error format
		 * @param {String} msg message to display
		*/
		op.error = function(msg) {
			console.error(err + message(msg));
		};
		/**
		 * display a message in warning format
		 * @param {String} msg message to display
		*/
		op.warning = function(msg) {
			console.warn(war + message(msg));
		};
		/**
		 * display a message in info format
		 * @param {String} msg message to display
		*/
		op.info = function(msg) {
			console.info(inf + message(msg));
		};		
	};
	
	/**
	 * expose Output
	*/
	module.exports = new Output();
	
})();