(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.nP = global.nP || {})));
}(this, (function (exports) { 'use strict';

	// A quick and easy complex arithmetic object
	function Complex() {}

	Complex.prototype = complex.prototype = {
		constructor: Complex,
		set: function(real, imaginary) { this.x = real; this.y = imaginary; return this },
		getR: function () {return this.x;},	  
		getI: function () {return this.y;}, 
		setR: function (R) {this.x = R;},
		setI: function (I) {this.y = I;},	
		print: function() {console.log(this.x + " " + this.y);},
		add: function (c2) {return complex(this.x + c2.x, this.y + c2.y);}, // returning complex allows method chaining :)
		sub: function (c2) {return complex(this.x - c2.this.x, this.y - c2.this.y);},
		mul: function (c2) {return complex(this.x * c2.this.x - this.y * c2.this.y, this.x * c2.this.y + this.y * c2.this.x);},
		div: function (c2) {return complex((this.x * c2.this.x + this.y * c2.this.y)/(c2.this.x * c2.this.x + c2.this.y * c2.this.y), (c2.this.x * this.y - this.x * c2.this.y)/(c2.this.x * c2.this.x + c2.this.y * c2.this.y));},
		inv: function () {return complex((1 * this.x + 0 * this.y)/(this.x * this.x + this.y * this.y), (this.x * 0 - 1 * this.y)/(this.x * this.x + this.y * this.y));},
		neg: function () {return complex(-this.x, -this.y);},
		mag: function () {return Math.sqrt(this.x * this.x + this.y * this.y);},
		ang: function () {return Math.atan2(this.y, this.x) * (180/Math.PI);},
		magDB10: function () {return 10 * Math.log(   Math.sqrt(this.x * this.x + this.y * this.y) )/2.302585092994046   },
		magDB20: function () {return 20 * Math.log(   Math.sqrt(this.x * this.x + this.y * this.y) )/2.302585092994046   },
	};

	function complex(real, imaginary) {
	  var complex = new Complex ;
	  
	  if (typeof real === 'number' && typeof imaginary === 'number') complex.set(real, imaginary);

	  return complex;
	}

	// Computes the number sections in a chebyshev filter
	function chebySections (maxPass = .2, minRej = 1.5, ripple = 0.1, rejection = 30) {
		/*
		ak	    bk	    gk	    R,C,L      Fc= 0.2 GHz, Frej=1.5GHz, Ripple=0.1, Rej=30, n=3
		UNDEF	UNDEF	1.00e+0	5.00e+1    resistor
		5.00e-1	1.69e+0	1.03e+0	1.64e-11   par capacitor
		1.00e+0	1.69e+0	1.15e+0	4.57e-8    series inductor
		5.00e-1	9.40e-1	1.03e+0	1.64e-11   par capacitor
		UNDEF	UNDEF	1.00e+0	5.00e+1    resistor
		*/
		var	maxPassFreq = maxPass,
			minRejFreq = minRej,
			passbandRipple = ripple,
			rejLevel = rejection;

		function normalizedBandwidth() { // Computes the w/w1 in MYJ on page 86 of MYJ
			return minRejFreq/maxPassFreq;
		}
		function numberSections() { // Formula 4.03-4 for n on page 86 of MYJ
			var n = 0;
			function epsilon() { return Math.pow(10,(passbandRipple/10))-1;} // Formula 4.03-5 on page 87 on MYJ
			function arcCosh(x) {return Math.log(x + Math.sqrt((x * x)-1));}
			n = Math.ceil(arcCosh(Math.sqrt((Math.pow(10,(rejLevel/10))-1)/epsilon(passbandRipple)))/arcCosh(normalizedBandwidth(maxPassFreq, minRejFreq)));
			return n;
		}
		return numberSections()
	}

	// Generates an array of chebyshev values based on number of section and ripple
	function chebyGen (n = 3, ripple = 0.1) { // Returns gk's shown in formula 4.05-2 on page 99 of MYJ
		var	numberSections = n,
			passbandRipple = ripple,
			lowPassTable = Array(  2 + numberSections + 1),  // Corresponds with g0 + gk + g(k+1)
			outputArray = [];
		
		var	i = 0, row = 0;
				
			// The function, gk() Fills in the variable table above called lowPassTable to hold ak, bk, gk, and R,C,L values based on the numberSections
			for(i = 0; i < lowPassTable.length; i++) {
			lowPassTable[i] = Array(4); // Each row has 4 columns: ak, bk, gk, and R,C,L's
			}		
			// Table for complete display of values
			lowPassTable[0][0] = 'ak'; lowPassTable[0][1] = 'bk'; lowPassTable[0][2] = 'gk'; lowPassTable[0][3] = 'R,C,L';

			function coth(x) {return (Math.exp(x) + Math.exp(-x))/(Math.exp(x) - Math.exp(-x));}		function B() {return Math.log(coth(passbandRipple/17.37));}		function sinh(x) {return (Math.exp(x) - Math.exp(-x))/2;}		function G() {return sinh(B()/(2 * numberSections));} // Compute G() on page 99 of MYJ
	  
			// Initialize the lowPassFilter array
			lowPassTable[1][2] = 1; // for g0=1;
	  
			// Populate the ak column on page 99 of MYJ
			for(row = 2; row < lowPassTable.length -1; row++) {
				lowPassTable[row][0] = Math.sin(((2*(row -1) -1) * Math.PI)/(2 * numberSections));    
			}  
			// Populate the bk column on page 99 of MYJ
			for(row = 2; row < lowPassTable.length -1; row++) {
				lowPassTable[row][1] = Math.pow(G(),2) + Math.pow(Math.sin(  (row-1) * Math.PI/numberSections),2);    
			}  
			// Populate the first q1 in the cell
			lowPassTable[2][2] = 2*lowPassTable[2][0]/G();
	  
			// Populate the gk column from g2 onward to gk
			for(row = 3; row < lowPassTable.length -1; row++) {
				lowPassTable[row][2] = (4 * lowPassTable[row-1][0] * lowPassTable[row][0])/(lowPassTable[row-1][1] * lowPassTable[row-1][2]);    
			}  
			// Populate the last g(k+1) in the cell
			lowPassTable[ numberSections+2][2] = (numberSections % 2 === 0 ) ? Math.pow(coth(B()/4),2) : 1 ;
			
			// Populate outputArray
			for(row = 1; row < lowPassTable.length; row++) {
				outputArray[row - 1] = lowPassTable[row][2];   
			}		
			return outputArray;
		}	/*
		ak	    bk	    gk	    R,C,L      Fc= 0.2 GHz, Frej=1.5GHz, Ripple=0.1, Rej=30, n=3
		UNDEF	UNDEF	1.00e+0	5.00e+1    resistor
		5.00e-1	1.69e+0	1.03e+0	1.64e-11   par capacitor
		1.00e+0	1.69e+0	1.15e+0	4.57e-8    series inductor
		5.00e-1	9.40e-1	1.03e+0	1.64e-11   par capacitor
		UNDEF	UNDEF	1.00e+0	5.00e+1    resistor
		*/

	exports.complex = complex;
	exports.chebySections = chebySections;
	exports.chebyGen = chebyGen;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
