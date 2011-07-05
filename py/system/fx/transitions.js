//===========================================
//  ÔªËØ±ä»»º¯Êý   transitions.js      A
//===========================================

Py.namespace(".Fx.Transitions", {
	
	linear: function(zero){
		return zero;
	},
	
	pow: function(p, x){
		return Math.pow(p, x || 6);
	},

	expo: function(p){
		return Math.pow(2, 8 * (p - 1));
	},

	circ: function(p){
		return 1 - Math.sin(Math.acos(p));
	},

	sine: function(p){
		return 1 - Math.sin((1 - p) * Math.PI / 2);
	},

	back: function(p, x){
		x = x || 1.618;
		return Math.pow(p, 2) * ((x + 1) * p - x);
	},

	bounce: function(p){
		var value;
		for (var a = 0, b = 1; 1; a += b, b /= 2){
			if (p >= (7 - 4 * a) / 11){
				value = b * b - Math.pow((11 - 6 * a - 11 * p) / 4, 2);
				break;
			}
		}
		return value;
	},

	elastic: function(p, x){
		return Math.pow(2, 10 * --p) * Math.cos(20 * p * Math.PI * (x || 1) / 3);
	},
	
	easeIn: function(transition, x){
		return function(p){
			return transition(p, x);
		};
	},
	
	easeOut: function(transition, x){
		return function(p){
			return 1 - transition(1 - p, x);
		};
	},
	
	easeInOut:  function(transition, x){
		return function(p){
			return (p <= 0.5) ? transition(2 * p, x) / 2 : (2 - transition(2 * (1 - p), x)) / 2;
		};
	}
	
});
