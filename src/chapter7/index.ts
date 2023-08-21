import {
  name as userName, // import 先で別名をつけることも可能
  userAge,
  language,
  // privateData, export されていない変数は読み込めない = モジュール(ファイル)ごとに特有のスコープを持つ
} from './chapter7_1_1.js'; // バンドラを使わない場合は拡張子は js にする
import { getFoo, someFunc, User } from './chapter7_1_2.js';
// default export されたものに命名を付けて import 可能
import counter, { count } from './chapter7_1_3.js';

// このファイルを実行すると import 先が上から順に読み込まれたのち、このファイルが読み込まれる(実行される)
console.log('file index has been loaded.');

// language = 'en'; import 先の値が let でも import した側での直接の再代入は不可(定義もとのモジュール内でのみ可能)
console.log(`name: ${userName}, age: ${userAge}, language: ${language}`);
console.log(`getFoo(): ${getFoo()}`);
console.log(`someFunc(123): ${someFunc(123)}`);

const user = new User('jiro', 31);
console.log(`The user name is ${user.name} (${user.age})`);

console.log(`count is ${count}`);
counter();
console.log(`count is ${count}`);