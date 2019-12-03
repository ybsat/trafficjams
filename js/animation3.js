// Parameters

var N3 = 10,
	v03 = 0.3,
	def_S3=0.5*1/N3,
	run3 = false,
	passing3 = false;

var stop3on3 = false;


// Buttons

function default3(){
	$("#acc-3").slider( "option", "value",def_gamma);
	$("#inert-3").slider( "option", "value",def_S3);
	$("#vvar-3").slider( "option", "value",def_vvar);
	cars3.forEach(function(a){
		a.v0=v03+def_vvar*a.vdiff;
	});
	origin3.selectAll(".car").selectAll("rect").style("fill",function(d){return d.passing ? "magenta" : C3(d.v0)});
}

function laneChange3(){
	var elem = document.getElementById("lanechange3");
	if (passing3 == false) {
		passing3 = true;
		elem.innerHTML = "Don't allow lane change";
	} else {
		passing3 = false;
		elem.innerHTML = "Allow lane change";
	}
}

function runpause3(){
	var elem = document.getElementById("run3");
	if (run3 == false) {
		run3=true;
		t3 = d3.interval(runsim3,0);
		elem.innerHTML = "Stop";
	} else {
		run3 = false;
		t3.stop();
		elem.innerHTML = "Start";
	}
 }


function reset3(){
	cars3 = d3.range(2*N3).map(function(i){
		let vdiff=Math.random();
				return {
						id:i,
						x:i<N3 ? i/N3 % 1: (i/N3+0.5/N3) % 1 ,
						v:0,
						v0:v03+$("#vvar-3").slider( "option", "value")*vdiff,
						vdiff:vdiff,
						lane: i<N3 ? "left" : "right",
						passing: false,
						passing_tau:0,
						v_hist:d3.range(50).map(function(d){return 0}),
						v_avg:0,
						tick: 0
				}
			})

	cars3.forEach(function(a,i){
			if(i<N3) {a.next=cars3[(i + 1) % N3]}
			else {a.next=cars3[N3+(i + 1) % N3]};
	})
	origin3.selectAll(".car").data(cars3);
	draw3();
}

// sliders

$( function() {
		$("#acc-3" ).slider({
				range: false,
				min: 0.15,
				max: 0.75,
				step: 0.05,
				value: def_gamma
		});
});

$( function() {
		$("#inert-3" ).slider({
				range: false,
				min: 0.1*1./N3,
				max: 1./N3,
				step: 0.1*1./N3,
				value: def_S3
		});
});

$( function() {
		$("#vvar-3" ).slider({
				range: false,
				min: 0.0,
				max: 0.25*v03,
				step: 0.25*v03/8,
				value: def_vvar,
				slide: function( event, ui ) {
					cars3.forEach(function(a){
						a.v0=v03+ui.value*a.vdiff;
					});
					origin3.selectAll(".car").selectAll("rect").style("fill",function(d){return d.passing ? "magenta" : C3(d.v0)});
				}
		});
});


// Drawing

var display3 = d3.selectAll("#cxpbox_display_3").append("svg")
	.attr("width",world_width_line)
	.attr("height",world_height_line)
	.attr("class","explorable_display")

display3.append("rect").attr("width","100%").attr("height","100%").attr("fill","#85B24C");


var C3 = d3.scaleLinear().domain([v03,1.25*v03]).range(["white","blue"])

var origin3 = display3.append("g")
	.attr("transform","translate("+world_width_line/2+","+world_height_line/2+")");

var st13 =  origin3.append("path").datum(d3.range(0,1+1/1000,1/1000)).attr("d",street_line)
	.style("stroke","black").style("stroke-width",80).style("fill","none").style("stroke-linecap","round")

var st23 = origin3.append("path").datum(d3.range(0,1+1/1000,1/1000)).attr("d",street_line)
	.style("stroke","rgb(120,120,120)").style("stroke-width",72).style("fill","none").style("stroke-linecap","round")

var st33 = origin3.append("path").datum(d3.range(0,1+1/1000,1/1000)).attr("d",street_line)
	.style("stroke","white").style("stroke-width",2).style("fill","none")
	.style("stroke-dasharray",4)

// slow down buttons

var bump33 = origin3.append("rect").attr("width",2).attr("height",30).style("fill","none").style("stroke","none")
							.attr("transform","translate("+X_line(xc_line(bump3loc))+","+Y_line(0.20)+")")


var stop33 = origin3.append("circle").attr("r","16").style("fill","white").style("stroke","red")
									.attr("transform","translate("+X_line(xc_line(bump3loc))+","+Y_line(2.4)+")")
									.on("click",function(d) {
											if (stop3on3) {
												stop3on3 = false;
												d3.select(this).style("fill","white");
												bump33.style("fill","none").style("stroke","none");
											} else {
												stop3on3 = true;
												d3.select(this).style("fill","red");
												bump33.style("fill","red").style("stroke","red");
											}
										;});

// Cars

var cars3 = d3.range(2*N3).map(function(i){
	let vdiff=Math.random();
			return {
					id:i,
					x:i<N3 ? i/N3 % 1: (i/N3+0.5/N3) % 1 ,
					v:0,
					v0:v03+def_vvar*vdiff,
					vdiff:vdiff,
					lane: i<N3 ? "left" : "right",
					passing: false,
					passing_tau:0,
					v_hist:d3.range(50).map(function(d){return 0}),
					v_avg:0,
					tick:0
			}
		})



cars3.forEach(function(a,i){
		if(i<N3) {a.next=cars3[(i + 1) % N3]}
		else {a.next=cars3[N3+(i + 1) % N3]};
})


var car3 = origin3.selectAll(".car").data(cars3).enter().append("g")
		.attr("class","car")
		.attr("transform",function(d){
			let dx = x_line(d.x+dt)-x_line(d.x);
			let dy = y_line(d.x+dt)-y_line(d.x);
			let rotz = Math.atan2(dy,dx);
			if(d.x>1) {console.log(d.x)}
			return "translate("+X_line(xc_line(d.x))+","+Y_line(yc_line(d.x))+")rotate("+(90+rotz/Math.PI*180)+")translate("+(d.lane=="left" ? 20 : -20)+",0)scale(1.5)"
		})


car3.append("circle").attr("r","2").style("fill","black").style("stroke","none")
	.attr("cx",4)
	.attr("cy",4)
car3.append("circle").attr("r","2").style("fill","black").style("stroke","none")
	.attr("cx",-4)
	.attr("cy",4)
car3.append("circle").attr("r","2").style("fill","black").style("stroke","none")
	.attr("cx",4)
	.attr("cy",-4)
car3.append("circle").attr("r","2").style("fill","black").style("stroke","none")
	.attr("cx",-4)
	.attr("cy",-4)



car3.append("rect").attr("width",8).attr("height",16).attr("rx",1).attr("ry",3)
		.attr("x","-4").attr("y","-8")
		.style("fill",function(d){return C3(d.v0)}).style("stroke","black").style("stroke-width",1)

car3.append("rect").attr("width",6).attr("height",6).attr("rx",1).attr("ry",1)
		.attr("x","-3").attr("y","-2")
		.style("fill",function(d){return C3(d.v0)}).style("stroke","black").style("stroke-width",1)



function draw3(){

	origin3.selectAll(".car").attr("transform",function(d){
			let dx = xc_line(d.x+0.001)-xc_line(d.x);
			let dy = yc_line(d.x+0.001)-yc_line(d.x);
			let rotz = Math.atan2(dy,dx);

			if(d.passing==true){
				dh = d.lane == "left" ? (d.passing_tau * (-20)
				+ (1-d.passing_tau)*20) : (d.passing_tau * (20) + (1-d.passing_tau)*(-20))
			} else {
				dh = d.lane == "left" ? 20 : -20;
			}

			return "translate("+X_line(xc_line(d.x))+","+Y_line(yc_line(d.x))+")rotate("+(90+rotz/Math.PI*180)+")translate("+dh+",0)scale(1.5)"
		})

	origin3.selectAll(".car").selectAll("rect").style("fill",function(d){return d.passing ? "magenta" : C3(d.v0)})

}


function runsim3(){


	cars3.forEach(function(a,i){

		if (Math.random()<0.5 && ad(a.next.x,a.x)< 0.04 && a.passing==false && passing3){

			  var behind = cars3.filter(function(o){return o.lane!=a.lane && ad(o.x,a.x) < 0 });
				var infront = cars3.filter(function(o){return o.lane!=a.lane && ad(o.x,a.x) >  0 });
				var d_behind = d3.max(behind,function(o){return ad(o.x,a.x)});
				var d_infront = d3.min(infront,function(o){return ad(o.x,a.x)});

				if(d_behind < -0.015 && d_infront > 0.015 && d_infront > ad(a.next.x,a.x)) {

					var thislane_behind = cars3.filter(function(d){return d.next==a})[0];

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

		if (ad(you,me) > $("#inert-3").slider( "option", "value")) {
			if(a.v<a.v0) {
				a.dv=$("#acc-3").slider( "option", "value")*dt;
			} else {
				a.dv=0;
			}
		}

		if (ad(you,me) < delta_line) { a.dv=(0.5*a.next.v-a.v); }

		if (ad(you,me) >= delta_line && ad(you,me) < $("#inert-3").slider( "option", "value")) { a.dv = 0; }


		if(a.passing==true) {a.passing_tau-=0.025}
		if(a.passing_tau<=0) {a.passing=false ; a.passing_tau=0}


		if (a.lane == "left" && bump3loc-me < 0.5*delta_line && bump3loc-me > 0 && stop3on3) {
			if (a.tick < 100) {
				a.dv = -0.02*a.tick;
			}
			a.tick += 1;
		}
		if (a.lane == "left" && bump3loc-me < 0) {
			a.tick = 0;
		}

		a.dx=a.v*dt;
	})

	cars3.forEach(function(a){
		a.x+=a.dx;
		a.v+=a.dv;
		if(a.v<0) {a.v=0};
		a.x = a.x % 1.0;
		a.v_hist.push(a.v);
		a.v_hist.shift();
		a.v_avg=d3.mean(a.v_hist);
	})

	draw3()

}
