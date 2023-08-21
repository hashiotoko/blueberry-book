// # 関数やクラスの export
console.log('file chapter7_1_2 has been loaded.');

export const getFoo = () => 'foo';
function getBar(arg: number) {
  return `bar ${arg}`;
}

class User {
  constructor(public name: string, public age: number) {}

  isAdult(): boolean {
    return this.age >= 20;
  }
}

export { getBar as someFunc, User };
