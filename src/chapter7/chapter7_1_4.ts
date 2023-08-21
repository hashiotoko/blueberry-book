// # 型の export, import
type Animal = {
  species: string;
  age: number;
};
const tama: Animal = { species: 'cat', age: 1 };
const pochi: Animal = { species: 'dog', age: 2 };

export { Animal, tama };
// 型に限定して以下のように export することも可能
// その場合、変数としては利用できない
export type { pochi };

type Human = {
  name: string;
  age: number;
};
const user1: Human = { name: 'saburo', age: 10 };

export { Human, user1 };

// tsc 以外のコンパイラ(ex: babel, esbuild...)で ts を js にコンパイルする際に
// export type, import type を用いると不要な値を js では取り除ける
