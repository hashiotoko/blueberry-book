// # export の基本形
console.log('file chapter7_1_1 has been loaded.');

// 直接 export 可能
export const name = 'taro';
const age = 26;
let language = 'ja';
const privateData = 'foo';

// 定義済みの変数を export することも可能
export {
  age as userAge, // 別名をつけて export することも可能
  language,
};
