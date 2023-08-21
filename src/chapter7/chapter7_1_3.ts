// # default export
// そのモジュールの代表的な値を表すための機能(≒ 通常の export のシンタックスシュガー的なもの)

export let count = 0;

export default function increment() {
  return ++count;
}

// １つのモジュールで複数の default export を行うことはできない
// export default getFizz() {
//   return 'fizz';
// }

// default export されたものは default と言う変数で export されることと一緒
// つまり以下のように書くことと一緒
// function increment() {
//   return ++count;
// }
// export { increment as default };
// import 側でも以下のように書く事で同じことができる
// import { default as counter } from 'xxx.js';

// default export を使うと命名が定まっていないことからエディタでの補完が効かないことがあるため、使わない人もいるとか
