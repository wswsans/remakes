# remakes
過去作のリメイク

## [Frame](https://wswsans.github.io/remakes/frame/)
* いつか作っていたオークションサイトで使っていたフレームを作り直した姿
* ダウンロードして利用可能
* JavaScript対応, キーボードショートカット対応

### 利用方法
* webdata.js

| 名前 | 説明 |
| - | - |
| name | ウェブページ全体の名前 |
| urls | フレームの名前<br>ここに入れたものは全て右上の<strong>≡</strong>でいけるようになる<br>リストタイプ |
| default_url | linkが未入力, 存在しないページなどにきた時に強制的に飛ばす最初のページ |

* Frame_<strong>名前</strong>.html

| オリジナルタグ | 説明 |
| - | - |
| \<input type="hidden" id="title" value="タイトル"> | タブの名前に使われる<br>未入力の場合はファイルの名前が使われる |
| \<div id="keyGroup"><br>  \<span key="文字" shiftKey>説明</span><br>\</div> | key="文字" にダイアログに表示させたい文字を入れる(1文字のみ)<br>説明はダイアログに表示させたい説明 |
| \<div id="keyShort"><br>  \<span code="KeyA">JavaScript</span><br>\</div> | code: event.code<br>\<span>の中にJavaScriptのコードを入れる |
