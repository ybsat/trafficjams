// Parameters

var N2 = 15,
	v02 = 0.2,
  def_S2=0.5*1/N2,
	run2 = false,
	passing2 = false;

var stop1on2 = false,
		stop2on2 = false,
		stop3on2 = false;

// Buttons

function default2(){
	$("#acc-2").slider( "option", "value",def_gamma);
	$("#inert-2").slider( "option", "value",def_S2);
}

function laneChange2(){
	var elem = document.getElementById("lanechange2");
	if (passing2 == false) {
		passing2 = true;
		elem.innerHTML = "Don't allow lane change";
	} else {
		passing2 = false;
		elem.innerHTML = "Allow lane change";
	}
}

function runpause2(){
	var elem = document.getElementById("run2");
	if (run2 == false) {
		run2=true;
		t2 = d3.interval(runsim2,0);
		elem.innerHTML = "Stop";
	} else {
		run2 = false;
		t2.stop();
		elem.innerHTML = "Start";
	}
 }


function reset2(){
	cars2 = d3.range(2*N2).map(function(i){
		let vdiff=Math.random();
				return {
						id:i,
						x:i<N2 ? i/N2 % 1: (i/N2+0.5/N2) % 1 ,
						v:0,
						v0:v02,//+vvar.value*vdiff,
						vdiff:vdiff,
						lane: i<N2 ? "left" : "right",
						passing: false,
						passing_tau:0,
						v_hist:d3.range(50).map(function(d){return 0}),
						v_avg:0,
						tick: 0
				}
			})

	cars2.forEach(function(a,i){
			if(i<N2) {a.next=cars2[(i + 1) % N2]}
			else {a.next=cars2[N2+(i + 1) % N2]};
	})
	origin2.selectAll(".car").data(cars2);
	draw2();
}

 //sliders

 $( function() {
 		$("#acc-2" ).slider({
 				range: false,
 				min: 0.15,
 				max: 0.75,
 				step: 0.05,
 				value: def_gamma
 		});
 });

 $( function() {
 		$("#inert-2" ).slider({
 				range: false,
 				min: 0.1*1./N2,
 				max: 1./N2,
 				step: 0.1*1./N2,
 				value: def_S2
 		});
 });


// Drawing

var display2 = d3.selectAll("#cxpbox_display_2").append("svg")
	.attr("width",world_width_line)
	.attr("height",world_height_line)
	.attr("class","explorable_display")

display2.append("rect").attr("width","100%").attr("height","100%").attr("fill","#85B24C");


var origin2 = display2.append("g")
	.attr("transform","translate("+world_width_line/2+","+world_height_line/2+")");

var st12 =  origin2.append("path").datum(d3.range(0,1+1/1000,1/1000)).attr("d",street_line)
	.style("stroke","black").style("stroke-width",80).style("fill","none").style("stroke-linecap","round")

var st22 = origin2.append("path").datum(d3.range(0,1+1/1000,1/1000)).attr("d",street_line)
	.style("stroke","rgb(120,120,120)").style("stroke-width",72).style("fill","none").style("stroke-linecap","round")

var st32 = origin2.append("path").datum(d3.range(0,1+1/1000,1/1000)).attr("d",street_line)
	.style("stroke","white").style("stroke-width",2).style("fill","none")
	.style("stroke-dasharray",4)

// slow down buttons

var bump12 = origin2.append("rect").attr("width",2).attr("height",30).style("fill","none").style("stroke","none")
							.attr("transform","translate("+X_line(xc_line(bump1loc))+","+Y_line(-1.15)+")")


var stop12 = origin2.append("circle").attr("r","16").style("fill","white").style("stroke","red")
									.attr("transform","translate("+X_line(xc_line(bump1loc))+","+Y_line(-2.4)+")")
									.on("click",function(d) {
											if (stop1on2) {
												stop1on2 = false;
												d3.select(this).style("fill","white");
												bump12.style("fill","none").style("stroke","none");
											} else {
												stop1on2 = true;
												d3.select(this).style("fill","red");
												bump12.style("fill","red").style("stroke","red");
											}
										;});


var bump22 = origin2.append("rect").attr("width",2).attr("height",30).style("fill","none").style("stroke","none")
							.attr("transform","translate("+X_line(xc_line(bump2loc))+","+Y_line(-1.15)+")")


var stop22 = origin2.append("circle").attr("r","16").style("fill","white").style("stroke","red")
									.attr("transform","translate("+X_line(xc_line(bump2loc))+","+Y_line(-2.4)+")")
									.on("click",function(d) {
											if (stop2on2) {
												stop2on2 = false;
												d3.select(this).style("fill","white");
												bump22.style("fill","none").style("stroke","none");
											} else {
												stop2on2 = true;
												d3.select(this).style("fill","red");
												bump22.style("fill","red").style("stroke","red");
											}
										;});


var bump32 = origin2.append("rect").attr("width",2).attr("height",30).style("fill","none").style("stroke","none")
							.attr("transform","translate("+X_line(xc_line(bump3loc))+","+Y_line(0.20)+")")


var stop32 = origin2.append("circle").attr("r","16").style("fill","white").style("stroke","red")
									.attr("transform","translate("+X_line(xc_line(bump3loc))+","+Y_line(2.4)+")")
									.on("click",function(d) {
											if (stop3on2) {
												stop3on2 = false;
												d3.select(this).style("fill","white");
												bump32.style("fill","none").style("stroke","none");
											} else {
												stop3on2 = true;
												d3.select(this).style("fill","red");
												bump32.style("fill","red").style("stroke","red");
											}
										;});

// Cars

var cars2 = d3.range(2*N2).map(function(i){
	let vdiff=Math.random();
			return {
					id:i,
					x:i<N2 ? i/N2 % 1: (i/N2+0.5/N2) % 1 ,
					v:0,
					v0:v02,
					vdiff:vdiff,
					lane: i<N2 ? "left" : "right",
					passing: false,
					passing_tau:0,
					v_hist:d3.range(50).map(function(d){return 0}),
					v_avg:0,
					tick:0
			}
		})



cars2.forEach(function(a,i){
		if(i<N2) {a.next=cars2[(i + 1) % N2]}
		else {a.next=cars2[N2+(i + 1) % N2]};
})


var car2 = origin2.selectAll(".car").data(cars2).enter().append("g")
		.attr("class","car")
		.attr("transform",function(d){
			let dx = x_line(d.x+dt)-x_line(d.x);
			let dy = y_line(d.x+dt)-y_line(d.x);
			let rotz = Math.atan2(dy,dx);
			if(d.x>1) {console.log(d.x)}
			return "translate("+X_line(xc_line(d.x))+","+Y_line(yc_line(d.x))+")rotate("+(90+rotz/Math.PI*180)+")translate("+(d.lane=="left" ? 20 : -20)+",0)scale(1.5)"
		})


car2.append("circle").attr("r","2").style("fill","black").style("stroke","none")
	.attr("cx",4)
	.attr("cy",4)
car2.append("circle").attr("r","2").style("fill","black").style("stroke","none")
	.attr("cx",-4)
	.attr("cy",4)
car2.append("circle").attr("r","2").style("fill","black").style("stroke","none")
	.attr("cx",4)
	.attr("cy",-4)
car2.append("circle").attr("r","2").style("fill","black").style("stroke","none")
	.attr("cx",-4)
	.attr("cy",-4)


car2.append("rect").attr("width",8).attr("height",16).attr("rx",1).attr("ry",3)
		.attr("x","-4").attr("y","-8")
		.style("fill",function(d){return "blue"}).style("stroke","black").style("stroke-width",1)

car2.append("rect").attr("width",6).attr("height",6).attr("rx",1).attr("ry",1)
		.attr("x","-3").attr("y","-2")
		.style("fill",function(d){return "blue"}).style("stroke","black").style("stroke-width",1)


function draw2(){

	origin2.selectAll(".car").attr("transform",function(d){
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

	origin2.selectAll(".car").selectAll("rect").style("fill",function(d){return d.passing ? "magenta" : "blue"})
}


function runsim2(){

	cars2.forEach(function(a,i){

		if (Math.random()<0.05 && ad(a.next.x,a.x)< 0.04 && a.passing==false && passing2){

			  var behind = cars2.filter(function(o){return o.lane!=a.lane && ad(o.x,a.x) < 0 });
				var infront = cars2.filter(function(o){return o.lane!=a.lane && ad(o.x,a.x) >  0 });
				var d_behind = d3.max(behind,function(o){return ad(o.x,a.x)});
				var d_infront = d3.min(infront,function(o){return ad(o.x,a.x)});

				if(d_behind < -0.015 && d_infront > 0.015 && d_infront > ad(a.next.x,a.x)) {

					var thislane_behind = cars2.filter(function(d){return d.next==a})[0];

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

		if (ad(you,me) > $("#inert-2").slider( "option", "value")) {
			if(a.v<a.v0) {
				a.dv=$("#acc-2").slider( "option", "value" )*dt;
			} else {
				a.dv=0;
			}
		}

		if (ad(you,me) < delta_line) { a.dv=(0.5*a.next.v-a.v); }

		if (ad(you,me) >= delta_line && ad(you,me) < $("#inert-2").slider( "option", "value" )) { a.dv = 0; }


		if(a.passing==true) {a.passing_tau-=0.025}
		if(a.passing_tau<=0) {a.passing=false ; a.passing_tau=0}


		if (a.lane == "left" && bump3loc-me < 0.5*delta_line && bump3loc-me > 0 && stop3on2) {
			if (a.tick < 100) {
				a.dv = -0.02*a.tick;
			}
			a.tick += 1;
		}
		if (a.lane == "left" && bump3loc-me < 0) {
			a.tick = 0;
		}

		if (a.lane == "right" && bump1loc-me < 0.5*delta_line && bump1loc-me > 0 && stop1on2) {
			if (a.tick < 100) {
				a.dv = -0.02*a.tick;
			}
			a.tick += 1;
		}
		if (a.lane == "right" && bump1loc-me < 0 && bump1loc-me > -0.1) {
			a.tick = 0;
		}

		if (a.lane == "right" && bump2loc - me < 0.5*delta_line && bump2loc - me > 0 && stop2on2) {
			if (a.tick < 100) {
				a.dv = -0.02*a.tick;
			}
			a.tick += 1;
		}
		if (a.lane == "right" && bump2loc - me < 0 && bump2loc-me > -0.1) {
			a.tick = 0;
		}


		a.dx=a.v*dt;
	})

	cars2.forEach(function(a){
		a.x+=a.dx;
		a.v+=a.dv;
		if(a.v<0) {a.v=0};
		a.x = a.x % 1.0;
		a.v_hist.push(a.v);
		a.v_hist.shift();
		a.v_avg=d3.mean(a.v_hist);
	})

	draw2()
}
