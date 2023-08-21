// # スクリプトとモジュール
// モジュール ... import, export が存在するファイルでモジュール内で定義された値などはそのモジュール内に閉じる
// スクリプト ... import, export が存在しないファイルでスコープはグローバルになる

// とはいえ、スクリプトは CommonJS のモジュールシステムにのっとった方式であり、
// package.json で type: 'module' と指定しており、このディレクトリの全ての js ファイルは es modules として扱われるので、
// ここではスクリプトとしてグローバルに値を使用できない(コンパイルエラーにはならないがランタイムエラーになる)
const globalWord = 'abc';
// ts では一般的にはグローバルに変数をエクスポートをする方法を使う

// どの値も import, export しないけどモジュール化したい場合は以下のようにしておく
export {};
