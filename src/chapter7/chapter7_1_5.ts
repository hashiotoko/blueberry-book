// # 一括インポート
// 単一のモジュールから export された複数の値を import 先で特定の「モジュール名前空間オブジェクト」としてこさえること
// import * as human from './chapter7_1_5.js';
export const name = 'shiro';
export const age = 29;
// default export されているものは obj.default で呼び出し可能

// # 再エクスポート
// 別のモジュールで export されている値をこのファイルからも export したい場合に使える
// export xxx from yyy;
export { language } from './chapter7_1_1.js';
// export * の場合に default は対象にならない(対象にしたければ as で命名する)
export * from './chapter7_1_3.js';
export * as something from './chapter7_1_3.js';
