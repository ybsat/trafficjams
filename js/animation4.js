// Parameters

var N4 = 40,
	v04 = 0.3,
	def_S4=0.5*1/N4,
	run4 = false,
	passing4 = false;

// Buttons
function default4(){
	$("#acc-4").slider( "option", "value",def_gamma);
	$("#inert-4").slider( "option", "value",def_S4);
	$("#vvar-4").slider( "option", "value",def_vvar);
	cars4.forEach(function(a){
		a.v0=v04+def_vvar*a.vdiff;
	});
	origin4.selectAll(".car").selectAll("rect").style("fill",function(d){return d.passing ? "magenta" : C4(d.v0)});
}

function laneChange4(){
	var elem = document.getElementById("lanechange4");
	if (passing4 == false) {
		passing4 = true;
		elem.innerHTML = "Don't allow lane change";
	} else {
		passing4 = false;
		elem.innerHTML = "Allow lane change";
	}
}

function runpause4(){
	var elem = document.getElementById("run4");
	if (run4 == false) {
		run4=true;
		t4 = d3.interval(runsim4,0);
		elem.innerHTML = "Stop";
	} else {
		run4 = false;
		t4.stop();
		elem.innerHTML = "Start";
	}
 }


function reset4(){
	cars4 = d3.range(2*N4).map(function(i){
		let vdiff=Math.random();
				return {
						id:i,
						x:i<N4 ? i/N4 % 1: (i/N4+0.5/N4) % 1 ,
						v:0,
						v0:v04+$("#vvar-4").slider( "option", "value")*vdiff,
						vdiff:vdiff,
						lane: i<N4 ? "left" : "right",
						passing: false,
						passing_tau:0,
						v_hist:d3.range(50).map(function(d){return 0}),
						v_avg:0,
						tick: 0
				}
			})

	cars4.forEach(function(a,i){
			if(i<N4) {a.next=cars4[(i + 1) % N4]}
			else {a.next=cars4[N4+(i + 1) % N4]};
	})
	origin4.selectAll(".car").data(cars4);
	draw4();
}

// sliders

$( function() {
		$("#acc-4" ).slider({
				range: false,
				min: 0.15,
				max: 0.75,
				step: 0.05,
				value: def_gamma
		});
});

$( function() {
		$("#inert-4" ).slider({
				range: false,
				min: 0.1*1./N4,
				max: 1./N4,
				step: 0.1*1./N4,
				value: def_S4
		});
});

$( function() {
		$("#vvar-4" ).slider({
				range: false,
				min: 0.0,
				max: 0.25*v04,
				step: 0.25*v04/8,
				value: def_vvar,
				slide: function( event, ui ) {
					cars4.forEach(function(a){
						a.v0=v04+ui.value*a.vdiff;
					});
					origin4.selectAll(".car").selectAll("rect").style("fill",function(d){return d.passing ? "magenta" : C4(d.v0)});
				}
		});
});



// Drawing

var display4 = d3.selectAll("#cxpbox_display_4").append("svg")
	.attr("width",world_width_circle)
	.attr("height",world_height_circle)
	.attr("class","explorable_display")

display4.append("rect").attr("width","100%").attr("height","100%").attr("fill","#85B24C");

var C4 = d3.scaleLinear().domain([v04,1.25*v04]).range(["white","blue"])

var origin4 = display4.append("g")
	.attr("transform","translate("+world_width_circle/2+","+world_height_circle/2+")");

var st14 =  origin4.append("path").datum(d3.range(0,1+1/1000,1/1000)).attr("d",street_circle)
	.style("stroke","black").style("stroke-width",32).style("fill","none").style("stroke-linecap","round")

var st24 = origin4.append("path").datum(d3.range(0,1+1/1000,1/1000)).attr("d",street_circle)
	.style("stroke","rgb(120,120,120)").style("stroke-width",29).style("fill","none").style("stroke-linecap","round")

var st34 = origin4.append("path").datum(d3.range(0,1+1/1000,1/1000)).attr("d",street_circle)
	.style("stroke","white").style("stroke-width",1).style("fill","none")
	.style("stroke-dasharray",4)


// Cars

var cars4 = d3.range(2*N4).map(function(i){
	let vdiff=Math.random();
			return {
					id:i,
					x:i<N4 ? i/N4 % 1: (i/N4+0.5/N4) % 1 ,
					v:0,
					v0:v04+def_vvar*vdiff,
					vdiff:vdiff,
					lane: i<N4 ? "left" : "right",
					passing: false,
					passing_tau:0,
					v_hist:d3.range(50).map(function(d){return 0}),
					v_avg:0,
					tick:0
			}
		})


cars4.forEach(function(a,i){
		if(i<N4) {a.next=cars4[(i + 1) % N4]}
		else {a.next=cars4[N4+(i + 1) % N4]};
})


var car4 = origin4.selectAll(".car").data(cars4).enter().append("g")
		.attr("class","car")
		.attr("transform",function(d){
			let dx = x_circle(d.x+dt)-x_circle(d.x);
			let dy = y_circle(d.x+dt)-y_circle(d.x);
			let rotz = Math.atan2(dy,dx);
			if(d.x>1) {console.log(d.x)}
			return "translate("+X_circle(xc_circle(d.x))+","+Y_circle(yc_circle(d.x))+")rotate("+(90+rotz/Math.PI*180)+")translate("+(d.lane=="left" ? 8 : -8)+",0)scale(0.8)"
		})


car4.append("circle").attr("r","2").style("fill","black").style("stroke","none")
	.attr("cx",4)
	.attr("cy",4)
car4.append("circle").attr("r","2").style("fill","black").style("stroke","none")
	.attr("cx",-4)
	.attr("cy",4)
car4.append("circle").attr("r","2").style("fill","black").style("stroke","none")
	.attr("cx",4)
	.attr("cy",-4)
car4.append("circle").attr("r","2").style("fill","black").style("stroke","none")
	.attr("cx",-4)
	.attr("cy",-4)



car4.append("rect").attr("width",8).attr("height",16).attr("rx",1).attr("ry",3)
		.attr("x","-4").attr("y","-8")
		.style("fill",function(d){return C4(d.v0)}).style("stroke","black").style("stroke-width",1)

car4.append("rect").attr("width",6).attr("height",6).attr("rx",1).attr("ry",1)
		.attr("x","-3").attr("y","-2")
		.style("fill",function(d){return C4(d.v0)}).style("stroke","black").style("stroke-width",1)

function draw4(){

	origin4.selectAll(".car").attr("transform",function(d){
			let dx = xc_circle(d.x+0.001)-xc_circle(d.x);
			let dy = yc_circle(d.x+0.001)-yc_circle(d.x);
			let rotz = Math.atan2(dy,dx);

			if(d.passing==true){
				dh = d.lane == "left" ? (d.passing_tau * (-8)
				+ (1-d.passing_tau)*8) : (d.passing_tau * (8) + (1-d.passing_tau)*(-8))
			} else {
				dh = d.lane == "left" ? 8 : -8;
			}

			return "translate("+X_circle(xc_circle(d.x))+","+Y_circle(yc_circle(d.x))+")rotate("+(90+rotz/Math.PI*180)+")translate("+dh+",0)scale(0.8)"
		})

	origin4.selectAll(".car").selectAll("rect").style("fill",function(d){return d.passing ? "magenta" : C4(d.v0)})
}


function runsim4(){

	cars4.forEach(function(a,i){

		if (Math.random()<0.5 && ad(a.next.x,a.x)< 0.04 && a.passing==false && passing4){

			  var behind = cars4.filter(function(o){return o.lane!=a.lane && ad(o.x,a.x) < 0 });
				var infront = cars4.filter(function(o){return o.lane!=a.lane && ad(o.x,a.x) >  0 });
				var d_behind = d3.max(behind,function(o){return ad(o.x,a.x)});
				var d_infront = d3.min(infront,function(o){return ad(o.x,a.x)});

				if(d_behind < -0.015 && d_infront > 0.015 && d_infront > ad(a.next.x,a.x)) {

					var thislane_behind = cars4.filter(function(d){return d.next==a})[0];

					thislane_behind.next=a.next;
					back_car = behind.filter(function(o){return ad(o.x,a.x) == d_behind })[0]
					front_car = infront.filter(function(o){return ad(o.x,a.x) == d_infront })[0]
					back_car.next = a;
					a.next = front_car;
					if (a.lane=="left") {a.lane="right"} else {a.lane="left"}
					a.passing=true;
					a.passing_tau=1.0;
				}
		}



		let me = a.x;
		let you = a.next.x;

		if (ad(you,me) > $("#inert-4").slider( "option", "value")) {
			if(a.v<a.v0) {
				a.dv=$("#acc-4").slider( "option", "value")*dt;
			} else {
				a.dv=0;
			}
		}

		if (ad(you,me) < delta_circle) { a.dv=(0.5*a.next.v-a.v); }

		if (ad(you,me) >= delta_circle && ad(you,me) < $("#inert-4").slider( "option", "value")) { a.dv = 0; }


		if(a.passing==true) {a.passing_tau-=0.025}
		if(a.passing_tau<=0) {a.passing=false ; a.passing_tau=0}

		a.dx=a.v*dt;
	})

	cars4.forEach(function(a){
		a.x+=a.dx;
		a.v+=a.dv;
		if(a.v<0) {a.v=0};
		a.x = a.x % 1.0;
		a.v_hist.push(a.v);
		a.v_hist.shift();
		a.v_avg=d3.mean(a.v_hist);
	})

	draw4()

}
