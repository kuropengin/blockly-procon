# U15長野プロコンサーバー
Combine Google Blockly and Procon Game Server.

U15長野プロコンサーバーは[U-15長野プログラミングコンテスト](https://www.nagano-cci.or.jp/u15procon/)での使用を想定したサーバです。
ビジュアルプログラミングの一つである[blockly](https://github.com/google/blockly)を用いてプログラミング初学者が気軽にプログラミングコンテストに参加できる環境づくりを目指しています。
ゲーム仕様は[AsahikawaProcon-Server](https://github.com/hal1437/AsahikawaProcon-Server)を参考にブラウザ上でゲームの実行が可能です。

<img width="960" alt="procon_git_img01" src="https://user-images.githubusercontent.com/51484579/73644558-f6659280-46b8-11ea-956d-44511b02e9e1.png">

## 機能
- プログラミング
	- プログラムの実行・停止
	- ゲーム用ブロックの追加
	- エラー表示
	- プログラムの保存
		- 保存ボタンによる手動保存
		- プログラム実行時の自動保存
	- プログラムのロード
		- 開くボタンによる任意プログラムのロード
		- 前回実行したプログラムのロード
	- JavaScriptコードの表示
- チュートリアル
	- 操作方法等のチュートリアルページ
- ゲーム
    - ゲームの開始・終了
    - マップ自動生成
    - CPU対戦
    - 他プレイヤー同士のゲーム観戦

## 動作環境
### 動作確認済み環境
- Linux / macOS / Windows
- Node.js 10.x,12.x

### 推奨環境
- 《Dockerfile掲載予定》
- 《＊windows用exeファイル掲載予定》

## セットアップ
- Step.0:Node.js,npm インストール
- Step.1:任意の場所でGitのリポジトリをクローン
```bash
git clone https://github.com/kuropengin/blockly-procon.git 
```
- Step.2:ダウンロードしたフォルダに移動後、手動で起動
```bash
npm start
```


## 動作確認
- ブラウザから `http://<IPaddress>:<Port(default:3000)>/` にアクセス

## 利用方法
- 《＊利用方法ドキュメント掲載予定》

## 実装予定

### チュートリアルページ作成用ツールの作成
チュートリアルページの追加用のページ作成ツールの作成。


## Contributing
[CONTRIBUTING.md](.github/CONTRIBUTING.md)

## Licence
[LICENSE](.github/LICENSE)

本製作物には一部[Apache License 2.0](.github/ApacheLicense)で配布されている製作物が含まれています。