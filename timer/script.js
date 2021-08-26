console.log("script.js Loaded")

const convert = (mode, num) => {
	let tmp = ""
	switch (mode) {
		case "list":
			num = Math.floor(num *10) /10 // 切り捨て
			tmp =  { // 見づらいから縦に統一させた
				day        : Math.floor(Math.floor(num) / (24 * 60 * 60)),
				hour       : Math.floor(Math.floor(num) % (24 * 60 * 60) / (60 * 60)),
				minute     : Math.floor(Math.floor(num) % (24 * 60 * 60) % (60 * 60) / 60),
				second     : Math.floor(Math.floor(num) % (24 * 60 * 60) % (60 * 60) % 60),
				millisecond: parseInt(`${num}`.replace(/(.*)\./, "").slice(-2)) /100
			};
			Object.keys(tmp).forEach(val => tmp[val] = (`${tmp[val]}`.length >= 10) ? parseInt(`${tmp[val]}`.slice(-10)) : tmp[val] );
			return tmp;
			break;
		case "sec":
			Object.keys(num).forEach(val => num[val] = (`${num[val]}`.length >= 10) ? parseInt(`${num[val]}`.slice(-10)) : num[val] );
			tmp = Math.floor( parseFloat(
				((num.day) ? num.day : 0)       * 24 * 60 * 60 +
				((num.hour) ? num.hour : 0)     * 60 * 60 +
				((num.minute) ? num.minute : 0) * 60 +
				((num.second) ? num.second : 0) +
				((num.millisecond) ? num.millisecond : 0) / 10
			) *10) /10;
			if (tmp <= 0) tmp = 0;
			return tmp;
			break;
	}
};
const sound = (type, sec) => {
	const ctx = new AudioContext();
	const osc = ctx.createOscillator();
	osc.type = type;
	osc.connect(ctx.destination);
	osc.start();
	osc.stop(sec);
};
const counter = () => setTimeout(() => {
	if (!paused) {
		time = Math.floor(time *10 -1) /10;
		if (Number.isInteger(time) && soundable) sound("square", 0.1);
	}
	$("span#time").text("");
	let tmp = convert("list", time);
	Object.keys(tmp).forEach(val => $("span#time").append(`<span>${tmp[val]}${$(`span#c_${val}`).text()}</span>`) );
	if (time <= 0) {
		clearTimeout(counter);
		(soundable && started) ?  sound("square", 10) : "";
		$("span#time").text(0);
		$("button#stop").click();
		console.log("END");
	} else {
		counter();
	}
}, 1000);

let time = 0;
let started = false;
let paused = false;
let soundable = false;

$(() => {
	$("input.input").change((e) => {
		if (started) return;
		if ($(e.traget).val()) $(e.target).val(0);
		time = convert("sec", {
			day:         parseFloat($("input#day").val()),
			hour:        parseFloat($("input#hour").val()),
			minute:      parseFloat($("input#minute").val()),
			second:      parseFloat($("input#second").val()),
			millisecond: parseFloat($("input#millisecond").val())
		});
		let time_list = convert("list", time);
		$("input#day").val(time_list.day);
		$("input#hour").val(time_list.hour);
		$("input#minute").val(time_list.minute);
		$("input#second").val(time_list.second);
		$("input#millisecond").val(parseInt(time_list.millisecond *10));
	})
	$("button#reset").click((e) => (started) ? "" : $("input.input").val(0).change());
	$("button#start").click((e) => {
		if (time <= 0) {
			console.log("Nothing");
			return;
		}
		if (started) return;
		started = true;
		$("section#setting button.hide").hide();
		$("input.input").prop("disabled", true).css("cursor", "not-allowed");
		$("section#timer").show();
		counter();
	});
	$("button#stop").click((e) => {
		if (!started) return;
		started = false;
		$("section#setting button.hide").show();
		$("input.input").val(0).change().prop("disabled", false).css("cursor", "auto");
		$(e.target).parent().hide();
		$("button.on_off").removeClass("btn_on");
		paused = soundable = false;
	});
	$("button.on_off").click((e) => {
		let tmp = $(e.target).toggleClass("btn_on").hasClass("btn_on");
		switch (e.target.id) {
			case "pause":
				paused = tmp;
				break;
			case "sound":
				soundable = tmp;
				break;
		}
	});
})