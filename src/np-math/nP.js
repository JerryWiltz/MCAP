(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.nP = {})));
}(this, (function (exports) { 'use strict';

	function Complex() {}

	Complex.prototype = {
		constructor: Complex,
		set: function(real, imaginary) { this.x = real; this.y = imaginary; return this },
		getR: function () {return this.x;},	  
		getI: function () {return this.y;}, 
		setR: function (R) {this.x = R;},
		setI: function (I) {this.y = I;},	
		print: function() {console.log(this.x + " " + this.y);},

		add: function (c2) {return complex(this.x + c2.x, this.y + c2.y);},
		
		sub: function (c2) {return complex(this.x - c2.x, this.y - c2.y);},
		mul: function (c2) {return complex(this.x * c2.x -this.y * c2.y, this.x * c2.y + this.y * c2.x);},		
		div: function (c2) {return complex(
			(this.x * c2.x + this.y * c2.y)/(c2.x * c2.x + c2.y * c2.y),
			(c2.x * this.y - this.x * c2.y)/(c2.x * c2.x + c2.y * c2.y));},	
		inv: function () {return complex(
			(1 * this.x + 0 * this.y)/(this.x * this.x + this.y * this.y),
			(this.x * 0 - 1 * this.y)/(this.x * this.x + this.y * this.y));},	
		neg: function () {return complex(-this.x, -this.y);},
		mag: function () {return Math.sqrt(this.x * this.x + this.y * this.y);},
		ang: function () {return Math.atan2(this.y, this.x) * (180/Math.PI);},
		mag10dB: function () {return 10 * Math.log(   Math.sqrt(this.x * this.x + this.y * this.y) )/2.302585092994046   },
		mag20dB: function () {return 20 * Math.log(   Math.sqrt(this.x * this.x + this.y * this.y) )/2.302585092994046   },
		sinhCplx: function () {return complex(Math.sinh(this.x)*Math.cos(this.y), Math.cosh(this.x)*Math.sin(this.y));},
		coshCplx: function () {return complex(Math.cosh(this.x)*Math.cos(this.y), Math.sinh(this.x)*Math.sin(this.y));}
	};

	function complex(real, imaginary) {
		var complex = new Complex ;
		complex.set(real, imaginary);
		return complex;
	}

	function Matrix () {}

	function dim(rows, cols, initial) {
		var row = 0, col = 0, a = [], A = [];
		for (row = 0; row < rows; row++) {
			a = [];
			for (col = 0; col < cols; col++) {
				a[col] = initial;
			}		A[row] = a;
		}	return A;	
	}
	function dup(copied) {
		var row, col,
			B = dim(copied.length, copied[0].length, 0);
		for (row = 0; row < copied.length; row++) {
			for (col = 0; col < copied[0].length; col++) {
				B[row][col] = copied[row][col];
			}	}	return B;	
	}
	//pivotSort for maximizing the lower triangle pivot numbers
	function pivotSort(array, pivot) {

		function maxKey (array, pivot) {
			var key = 0, i = 0;
			var current = 0, maximum = 0;
			for (i = pivot; i < array.length; i++) {
				current = Math.abs(array[i][pivot]);
				if (current > maximum){
					maximum = current;
					key = i; // will be row
				}
			}
			return key;
		}

		function swapNumbers (array, key, pivot) {
			// if Key === 0 do nothing
			// if key does not === 0, swap it with key = 0

			var temp0 = array[pivot];
			var temp1 = array[key];

			if ( key === pivot ) ;
			else {
				array[pivot] = temp1;
				array[key] = temp0;  
			}

		}
		swapNumbers (array, maxKey(array, pivot), pivot);

	}
	//pivotSortCplx for maximizing the lower triangle pivot numbers
	function pivotSortCplx(array, pivot) {

		function maxKey (array, pivot) {
			var key = 0, i = 0;
			var current = 0, maximum = 0;
			for (i = pivot; i < array.length; i++) {
				current = array[i][pivot].mag();
				if (current > maximum){
					maximum = current;
					key = i; // will be row
				}
			}
			return key;
		}

		function swapNumbers (array, key, pivot) {
			// if Key === 0 do nothing
			// if key does not === 0, swap it with key = 0

			var temp0 = array[pivot];
			var temp1 = array[key];

			if ( key === pivot ) ;
			else {
				array[pivot] = temp1;
				array[key] = temp0;  
			}

		}
		swapNumbers (array, maxKey(array, pivot), pivot);

	}
	// showMatrix
	function showMatrix(myArray) {	

		var target = document.getElementsByTagName("body")[0],
			div = document.createElement("div");

		target.appendChild(div);

		function createTable () {
			var row = 0, col = 0, html = "";

			html = "<table><tbody>"; // fill in the table
			for (row = 0; row < myArray.length; row++) {
				html +="<tr>";
				for (col = 0; col < myArray[0].length; col++) {
					html += "<td style='border-style: solid; border-width: 1px' width='150px'>" + myArray[row][col];
					html += "</td>";
				}			html +="</tr>";
			}		html += "</tbody></table>"; // finish the table

			return html; // return the table

		}
		div.innerHTML = createTable();

	}
	// showMatrixCplx
	function showMatrixCplx(myArray) {	

		var target = document.getElementsByTagName("body")[0],
			div = document.createElement("div");

		target.appendChild(div);

		function CplxToCell(complexNumber) {
			return complexNumber.x.toExponential(2) + (complexNumber.y.toExponential(2)> 0 ? " + i" + complexNumber.y.toExponential(2) : " - i" + (-complexNumber.y).toExponential(2));
		}
		function createTable () {
			var row = 0, col = 0, html = "";

			html = "<table><tbody>"; // fill in the table
			for (row = 0; row < myArray.length; row++) {
				html +="<tr>";
				for (col = 0; col < myArray[0].length; col++) {
					html += "<td style='border-style: solid; border-width: 1px' width='150px'>" + CplxToCell(myArray[row][col]);
					html += "</td>";
				}			html +="</tr>";
			}		html += "</tbody></table>"; // finish the table

			return html; // return the table

		}
		div.innerHTML = createTable();

	}
	Matrix.prototype = {
		set : function (mat) {this.m = mat; return this;},
		dimension : function (tableRow, tableCol, initial) {
			return matrix(dim(tableRow, tableCol, initial));
		},

		duplicate : function duplicate(matrixA) {
			return matrix(dup(matrixA.m));	
		},

		add : function add (matrixB) {
			var A = this.m,
				B = matrixB.m,
				C = dim(A.length, A[0].length, 0),
				numRows = A.length,
				numCols = A[0].length,
				row = 0, col = 0;
			for(row = 0; row < numRows; row++) {
				for(col = 0; col < numCols; col++) {
					C[row][col] = A[row][col] + B[row][col];
				}		}		return matrix(C);
		},

		addCplx : function addCplx (matrixB) {
			var A = this.m,
				B = matrixB.m,
				C = dim(A.length, A[0].length, complex(0,0)),
				numRows = A.length,
				numCols = A[0].length,
				row = 0, col = 0;
			for(row = 0; row < numRows; row++) {
				for(col = 0; col < numCols; col++) {
					C[row][col] = A[row][col].add(B[row][col]);
				}		}		return matrix(C);
		},

		sub : function sub (matrixB) {
			var A = this.m,
				B = matrixB.m,
				matrixC = dim(A.length, A[0].length, 0),
				numRows = A.length,
				numCols = A[0].length,
				row = 0, col = 0;
			for(row = 0; row < numRows; row++) {
				for(col = 0; col < numCols; col++) {
					C[row][col] = A[row][col] - B[row][col];
				}		}		return matrix(C);
		},

		subCplx : function subCplx (matrixB) {
			var A = this.m,
				B = matrixB.m,
				C = dim(A.length, A[0].length, complex(0,0)),
				numRows = A.length,
				numCols = A[0].length,
				row = 0, col = 0;
			for(row = 0; row < numRows; row++) {
				for(col = 0; col < numCols; col++) {
					C[row][col] = A[row][col].sub(B[row][col]);
				}		}		return matrix(C);
		},

		mul : function mul (matrixB) {
			var A = this.m,
				B = matrixB.m,
				C = dim(A.length, B[0].length,0),
				numRows = A[0].length,
				numCols = B.length,
				row = 0, col = 0, n = 0;			
			for(row = 0; row < A.length; row++) {
				for(col = 0; col < B[0].length; col++) {
					for(n = 0; n < B.length; n++) {
						C[row][col] += A[row][n] * B[n][col];
					}			}		}		return matrix(C);
		},

		mulCplx : function mulCplx (matrixB) {
			var A = this.m,
				B = matrixB.m,
				C = dim(A.length, B[0].length, complex(0,0)),
				numRows = A[0].length,
				numCols = B.length,
				row = 0, col = 0, n = 0;			
			for(row = 0; row < A.length; row++) {
				for(col = 0; col < B[0].length; col++) {
					for(n = 0; n < B.length; n++) {
						C[row][col] = C[row][col].add(A[row][n].mul(B[n][col]));
					}			}		}		return matrix(C);
		},


		solveGaussFB : function solveGaussFB() { //this works
			var A = dup(this.m),
				a = 0, numRows = A.length, numCols = A[0].length, constRow = 0,
				row = 0, col = 0, accum = 0;

			for(constRow = 0; constRow < numRows; constRow++) { // FORWARD ELIMINAION - this row stays the same
				pivotSort(A, constRow);
				for(row = constRow+1; row < numRows; row++) { // this row moves down
					a = -A[row][constRow]/A[constRow][constRow]; // this computes "a"
					for(col = 0; col < numCols; col++) { // this sweeps across the columns
						A[row][col] = A[row][col] + a*A[constRow][col];
					}			}		}
			for(row = numRows -1; row > -1; row--) { // BACK SUBSTITUTION
				accum = 0;
				for(col = numRows -1; col > row; col--) {
					accum = accum + A[row][col]*A[col][numCols -1];
				}
				A[row][numCols -1] = (1/A[row][row]) * (A[row][numCols -1] - accum);
			}

			for(row = 0; row < numRows; row++) { // get to the right column of A				
				for ( col = 0; col < numCols -1; col++) {
					A[row].shift();
				}		}		return matrix(A);
		},


		solveGaussFBCplx : function solveGaussFBCplx() { // this works 12/9/16 and now on 6/24/17
			var A = dup(this.m),
				a = complex(0, 0), numRows = A.length, numCols = A[0].length, constRow = 0,
				row = 0, col = 0, accum = complex(0, 0);

			for(constRow = 0; constRow < numRows; constRow++) { // FORWARD ELIMINATION - this row stays the same
				pivotSortCplx(A, constRow);
				for(row = constRow+1; row < numRows; row++) { // this row moves down
					a = A[row][constRow].div(A[constRow][constRow]).neg();
					for(col = 0; col < numCols; col++) { // this sweeps across the columns
						A[row][col] = A[row][col].add(a.mul(A[constRow][col]));
					}			}		}
			for(row = numRows -1; row > -1; row--) { // BACK SUBSTITUTION
				accum = complex(0,0);
				for(col = numRows -1; col > row; col--) { 
					accum = accum.add(  A[row][col].mul( A[col][numCols -1]));
				}			A[row][numCols -1] =  (complex(1, 0)).div(A[row][row]).mul( A[row][numCols -1].sub(accum));          
			}
			for(row = 0; row < numRows; row++) { // get to the right column of A				
				for ( col = 0; col < numCols -1; col++) {
					A[row].shift();
				}		}		return matrix(A);
		},


		invert : function invert() { //this works
			var A = dup(this.m),
				a = 0, numRows = A.length, numCols = A[0].length, constRow = 0,
				row = 0, col = 0;
			//append a 0 Matrix to Matrix, A
			for(row = 0; row < numRows; row++) {
				for(col = numRows; col < 2*numRows; col++) {
					A[row][col] = 0;
				}		}		//update numCols since Matrix, A is now wider;
			numCols = A[0].length;
			//add diagonal 1's to append array, A
			for(row = 0; row < numRows; row++) {
				A[row][row + numRows] = 1;
			}		// Real variable forward lower Elimination routine  
			for(constRow = 0; constRow < numRows; constRow++) { // this row stays the same
				pivotSort(A, constRow);
				for(row = constRow+1; row < numRows; row++) { // this row moves down
					a = -A[row][constRow]/A[constRow][constRow]; // this computes "a"
					for(col = 0; col < numCols; col++) { // this sweeps across the columns
						A[row][col] = A[row][col] + a*A[constRow][col];
					}			}		}		// Real variable forward unity diagonal routine  
			for(constRow = 0; constRow < numRows; constRow++) { // this row stays the same
				a = 1/A[constRow][constRow];
				for(row = constRow; row < numRows; row++) { // this row moves down
					for(col = 0; col < numCols; col++) { // this sweeps across the columns
						A[row][col] = a*A[row][col];
					}			}		}		// Real variable forward upper Elimination routine
			for(constRow = numRows - 1; constRow > 0 ; constRow--) { // 2 , 1, 0 this row stays the same			
				for(row = 0; row < constRow; row++) { // 0, 1  this row moves down
					a = -A[row][constRow]/A[constRow][constRow];				
					for(col = 0; col < numCols; col++) { // this sweeps across the columns	
						A[row][col] = A[row][col] + a*A[constRow][col];
					}			}		}		for(row = 0; row < numRows; row++) { // get to the right column of A				
				for ( col = 0; col < numCols/2; col++) {
					A[row].shift();
				}		}		return matrix(A);
		},

		invertCplx : function invertCplx() { //this works
			var A = dup(this.m),
				a = complex(0, 0), numRows = A.length, numCols = A[0].length, constRow = 0,
				row = 0, col = 0;
			//append a 0 Matrix to Matrix, A
			for(row = 0; row < numRows; row++) {
				for(col = numRows; col < 2*numRows; col++) {
					A[row][col] = complex(0, 0);
				}		}
			//update numCols since Matrix, A is now wider;
			numCols = A[0].length;

			//add diagonal 1's to appened array, A
			for(row = 0; row < numRows; row++) {
				A[row][row + numRows] = complex(1, 0);
			}
			// Real variable forward lower Elimination routine  
			for(constRow = 0; constRow < numRows; constRow++) { // this row stays the same
				pivotSortCplx(A, constRow);
				for(row = constRow + 1; row < numRows; row++) { // this row moves down
					a = A[row][constRow].div(A[constRow][constRow]).neg();
					for(col = 0; col < numCols; col++) { // this sweeps across the columns
						A[row][col] = A[row][col].add(a.mul(A[constRow][col]));
					}			}		}
			// Real variable forward unity diagonal routine
			for(constRow = 0; constRow < numRows; constRow++) { // this row stays the same
				a = A[constRow][constRow].inv(); 
				for(row = constRow; row < numRows; row++) { // this row moves down
					for(col = 0; col < numCols; col++) { // this sweeps across the columns
						A[row][col] = a.mul(A[row][col]);
					}			}		}
			// Real variable forward upper Elimination routine
			for(constRow = numRows - 1; constRow > 0 ; constRow--) { // 2 , 1, 0 this row stays the same
				for(row = 0; row < constRow; row++) { // 0, 1  this row moves down
					a = A[row][constRow].div(A[constRow][constRow]).neg();
					for(col = 0; col < numCols; col++) { // this sweeps across the columns
						A[row][col] = A[row][col].add(a.mul(A[constRow][col]));						
					}			}		}
			for(row = 0; row < numRows; row++) { // get to the right column of A				
				for ( col = 0; col < numCols/2; col++) {
					A[row].shift();
				}		}		return matrix(A);
		},						
	};


	function matrix(mat) {
		var matrix = new Matrix;
		matrix.set(mat);
		return matrix;
	}

	exports.complex = complex;
	exports.dim = dim;
	exports.dup = dup;
	exports.showMatrix = showMatrix;
	exports.showMatrixCplx = showMatrixCplx;
	exports.matrix = matrix;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
