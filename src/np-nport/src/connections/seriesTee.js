import {complex} from '../../../np-math/src/complex';
import {nPort} from '../nPort'
import {global}  from '../../../np-global/src/global';

export function seriesTee() { // series resistor nPort object
	var seriesTee = new nPort;
	var e = 1e-7;
	var frequencyList = global.fList, Ro = global.Ro;
	var Zo = complex(Ro,0), Yo = Zo.inv(), two = complex(2,0), freqCount = 0, Z = [], Y = [], s11, s12, s13, s21, s22, s23, s31, s32, s33, sparsArray = [];
	for (freqCount = 0; freqCount < frequencyList.length; freqCount++) {
		s11 = complex(e + 1/3,0); s12 = complex(e + 2/3,0); s13 = complex(e +-2/3,0);
		s21 = complex(e + 2/3,0); s22 = complex(e + 1/3,0); s23 = complex(e + 2/3,0);
		s31 = complex(e +-2/3,0); s32 = complex(e + 2/3,0); s33 = complex(e + 1/3,0);

		sparsArray[freqCount] =	[frequencyList[freqCount],s11, s12, s13, s21, s22, s23, s31, s32, s33];
	}	
	seriesTee.setspars(sparsArray);
	seriesTee.setglobal(global);
	return seriesTee;
};
