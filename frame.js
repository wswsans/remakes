console.log("frame script Loaded!");
console.log("Online?", window.navigator.onLine);

const gets = {};
const cookie = {};
const keyShort_code = {};

const setSearch = tag => {
	if (typeof tag != "object") return;
	tmp = "?"
	Object.keys(tag).forEach( key => tmp += `${key}=${tag[key]}&` );
	window.location.search = tmp.slice(0, -1);
	return true;
}

$(() => {
	/* フレーム操作 */
	if (!window.location.search) {
		window.location.search = `?link=${webdata.default_url}`;
		window.loadtion.reload(0);
	}
	// window.location.search と Cookie
	window.location.search.slice(1).split("&").forEach(val => gets[val.split("=")[0]] = val.replace(/(.*)=/, "") );
	document.cookie.split("; ").forEach(val => cookie[val.replace(/=(.*)/, "")] = val.replace(/(.*)=/, "") );
	// 未指定
	if (!gets.link) { gets.link = webdata.default_url; setSearch(gets) };
	// HTML貼り付け
	$.ajax("./frames/Frame_" + gets.link + ".html", "get")
	.done(FrameData => {
		data = String(FrameData);
		console.log(`${gets.link} loaded`);
		// 内容, タイトル
		$("section#frame").html(data);
		document.title = `${($("input#title").val()) ? $("input#title").val() : gets.link} - ${webdata.name}`;
		// スクリプト
		eval($("script#frame_script").text());
		// キーボードショートカット
		if ($("div#keyGroup").children().length > 0) $("div#dialog table").append(`<tr><th>${($("input#title").val()) ? $("input#title").val() : gets.link}</th></tr>`);
		$.each($("div#keyGroup").children(), (ind, val) => $("div#dialog table").append(`<tr><th>${ $(val).attr("key") }</th><td>${ $(val).text() }</td></tr>`) );
		$("div#keyGroup").html("");
		let tmp = ""
		$.each($("div#keyShort").children(), (ind, val) => {
			tmp = (($(val).attr("shiftKey") != undefined) ? "shift_" : "") +
					(($(val).attr("ctrlKey") != undefined) ? "ctrl_" : "") +
					(($(val).attr("altKey") != undefined) ? "alt_" : "") +
					(($(val).attr("metaKey") != undefined) ? "meta_" : "");
			keyShort_code[tmp+$(val).attr("code")] = $(val).text()
		});
		$("div#keyShort").html("");
	})
	.fail(data => {
		console.log("404 Not Found.");
		document.title = "404 Not Found";
		gets.link = webdata.default_url;
		setSearch(gets);
	})
	// ナビの動作
	let tmp = 0
	webdata.urls.forEach(url =>{
		$(`<li>`).appendTo("div#navi ul")
				.text( url.replace(/^[a-z]/g, val => { return val.toUpperCase(); }) )
				.click(e => { gets.link = url; setSearch(gets) });
		tmp = (url.length > tmp) ? url.length : tmp;
	})
	$(`<li id="shortcut">`).appendTo("div#navi ul").text("⌘").click(e => {$("div#shadow").click(); $("div#navi ul").fadeOut(300); });
	// CSSなど
	$("div#navi ul").height((webdata.urls.length +1) *33).width(tmp *10 +30);
	// ナビゲーター
	// $("*").not("div#navi *").click(e => $("div#navi ul").stop().fadeOut(300));
	$("div#navi button").click(e => $("div#navi ul").stop().fadeToggle(300));
	$("div#shadow").click(e => {$("div#shadow").stop().fadeToggle(100); $("div#dialog").stop().fadeToggle(100)});
	$("html").on("keydown", (event) => {
		// 本職
		switch (event.code) {
			case "Slash":
				if (!(event.metaKey || event.ctrlKey)) return;
				$("div#shadow").click();
				break;
			case "Escape":
				$("div#shadow").stop().fadeOut(100); $("div#dialog").stop().fadeOut(100);
				break;
		}
		tmp = ((event.shiftKey) ? "shift_" : "") +
				((event.ctrlKey) ? "ctrl_" : "") +
				((event.altKey) ? "alt_" : "") +
				((event.metaKey) ? "meta_" : "") +
				event.code;
		if (Object.keys(keyShort_code).indexOf(tmp) != -1) {
			eval(keyShort_code[tmp]);
		}
	})
})