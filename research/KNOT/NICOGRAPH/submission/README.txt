=== 芸術科学会論文誌 LaTeX サンプルファイル ===

1. ファイル

README.txt		このファイル
journal_samp.tex	LaTeX サンプルファイル
journal_samp.pdf	journal_samp.tex から生成した PDF ファイル
bibtex_samp.bib		BibTeX サンプルファイル
artsci-jour-j.sty	論文誌用スタイルファイル
latexmkrc_samp		latexmk 設定サンプルファイル
fig/fig-sample.eps	図用 EPS ファイル
fig/fig-sample.png	図用 PNG ファイル
fig/photo-face.png	著者履歴用 PNG ファイル

2. コンパイル

latexmk コマンドを利用することができるのであれば、それを用いることが最も簡単です。
うまくいかない場合、同梱の latexmkrc_samp を .latexmkrc に変更して再度試みて下さい。

% latexmk journal_samp

BibTeX を利用する場合、以下のコマンドを入力して下さい。

% platex journal_samp
% pbibtex journal_samp
% platex journal_samp
% platex journal_samp
% dvipdfmx journal_samp

BibTeX を利用しない場合は、上記から pbibtex コマンドを抜いて下さい。

3. upLaTeX の利用

Ver.1.3 以降では、upLaTeX にも対応しています。
コンパイラに upLaTeX を利用したい場合は、以下の2点を変更してください。
・tex ファイルの最初の行をコメントアウトし、かわりに2行目の「%」を削除する。
・.latexmkrc ファイルの「$for_upLaTeX = 'true';」の行の文頭の「#」を外し、
「$for_upLaTeX = 'false';」の行の文頭に「#」を追加してコメントアウトする。

4. 問い合わせ

本サンプルで何か質問がありましたら、芸術科学会までお問い合わせ下さい。

5. 履歴

Ver.1.0: 2014/12/10
	作成: 渡辺大地@東京工科大
	初期バージョン

Ver.1.1: 2019/2/26
	作成: 渡辺大地@東京工科大
	TeXLiveの寸法に関する仕様が変更となったことを踏まえて修正。

Ver.1.2: 2019/4/27
	作成: 渡辺大地@東京工科大
	概要に用いていた quote 環境が不具合を生じる場合があることへの対応。
	その他若干の内容変更。

Ver.1.3: 2023/3/15
	ページ番号にスタイル変更および upLaTeX に対応。

Ver.1.4: 2024/9/4
	論文全体および表紙の各種間隔を調整できるように修正。
