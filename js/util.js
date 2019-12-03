var world_width_line = 800,
	 world_height_line = 200,
   world_width_circle = 400,
   world_height_circle = 400;

var bump1loc = 0.3,
		bump2loc = 0.7,
		bump3loc = 0.5;

var dt = 0.0035,
  	delta_line = 0.04,
    delta_circle = 0.015,
    def_gamma=0.5,
    def_vvar=0.0;   


function ad(x2,x1){
	if (x2-x1 >= 0 && x2-x1 < 0.5) {return x2-x1};
	if (x2-x1 < 0 && x2-x1 < -0.5) {return 1 - x1  + x2};
	if (x2-x1 < 0 && x2-x1 > -0.5) {return x2-x1};
	if (x2-x1 > 0 && x2-x1 > 0.5) {return x2-x1-1};
}


// Line

function x_line(t){
		return (3*t)
}

function y_line(t){
		return (0)
}

function makeS_line(){
	let N = 2000;
	let t=d3.range(0,1,1/N);
	var S = [0];
	for(i=0;i<N-1;i++){
		S.push(S[i]+Math.sqrt( (x_line(t[i+1])-x_line(t[i]))*(x_line(t[i+1])-x_line(t[i])) + 		(y_line(t[i+1])-y_line(t[i]))*(y_line(t[i+1])-y_line(t[i])) ))
	}
	S = S.map(function(x){return x/S[S.length-1]});

	return S;
}

var rumps_line = makeS_line();

function S_to_T_line(s){
	let Tl = rumps_line.filter(function(d){return d <= s % 1 })

	let dd = (s-Tl[Tl.length-1])/(rumps_line[Tl.length]-rumps_line[Tl.length-1]);
	if (s > 1) {dd=0}
	return (Tl.length+dd)/(rumps_line.length-1);
}

function xc_line(t){
	return x_line(S_to_T_line(t));
}

function yc_line(t){
		return y_line(S_to_T_line(t));
}

var X_line = d3.scaleLinear().domain([0.0,3.0]).range([-world_width_line/2, world_width_line/2]);
var Y_line = d3.scaleLinear().domain([-3.4,3.4]).range([-world_height_line/2, world_height_line/2]);


var street_line = d3.line()
	.x(function(t) {
		return X_line( x_line(t) )
	})
	.y(function(t) {
		return Y_line( y_line(t) )
	})


// Circle

function x_circle(t){
		return (3.0*Math.cos(2*Math.PI*t))
}

function y_circle(t){
		return (3.0*Math.sin(2*Math.PI*t))
}

function makeS_circle(){
	let N = 2000;
	let t=d3.range(0,1,1/N);
	var S = [0];
	for(i=0;i<N-1;i++){
		S.push(S[i]+Math.sqrt( (x_circle(t[i+1])-x_circle(t[i]))*(x_circle(t[i+1])-x_circle(t[i])) + 		(y_circle(t[i+1])-y_circle(t[i]))*(y_circle(t[i+1])-y_circle(t[i])) ))
	}
	S = S.map(function(x){return x/S[S.length-1]});

	return S;
}


var rumps_circle = makeS_circle();

function S_to_T_circle(s){
	let Tl = rumps_circle.filter(function(d){return d <= s % 1 })

	let dd = (s-Tl[Tl.length-1])/(rumps_circle[Tl.length]-rumps_circle[Tl.length-1]);
	if (s > 1) {dd=0}
	return (Tl.length+dd)/(rumps_circle.length-1);
}

function xc_circle(t){
	return x_circle(S_to_T_circle(t));
}

function yc_circle(t){
		return y_circle(S_to_T_circle(t));
}


var X_circle = d3.scaleLinear().domain([-3.4,3.4]).range([-world_width_circle/2, world_width_circle/2]);
var Y_circle = d3.scaleLinear().domain([-3.4,3.4]).range([-world_height_circle/2, world_height_circle/2]);

var street_circle = d3.line()
	.x(function(t) {
		return X_circle( x_circle(t) )
	})
	.y(function(t) {
		return Y_circle( y_circle(t) )
	})
