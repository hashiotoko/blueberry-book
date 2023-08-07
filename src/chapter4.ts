namespace Chapter4 {
  // # 関数
  // 関数型と実際の関数の引数名は一致していなくても問題ない(チェック対象にならない)
  // とはいえドキュメントとしての役割を持っているので適切なものを設定しておくのが良い
  type Func1 = (repeatNum: number) => string;
  const xRepeat: Func1 = (num: number): string => 'x'.repeat(num);

  // 関数型の返り値は省略可能であり、その場合は型推論が起こる
  // 関数型を実装する関数自体の引数の型は、関数型から推論可能なので省略可能(contextual typing)
  const xRepeat2: Func1 = (num) => 'x'.repeat(num);

  // アロー関数で引数の型が省略可能である(ex: コールバック関数)場合、()は省略できる
  const a1 = [1, 2, 3].filter((x) => x * 3);

  // # コールシグネチャ
  // オブジェクト型の値でかつ関数としても使えるようにできる
  // 最近はそこまで使用されていないっぽいが jquery を扱う $ とかが典型( $.ajax としてプロパティアクセスできつつ、$('xxxx') としてDOMを取得する関数にもなる )
  type Func2 = {
    aaa?: number;
    (arg: number): void;
  };
  const double: Func2 = (arg: number) => console.log(arg * 2);
  double.aaa = 123;
  console.log(double.aaa);
  double(10);

  // # 関数型と部分型
  // ## 返り値の型による部分型関係
  // 引数の構成が同じで返り値が部分型関係にある場合は代替可能
  // fromAge は返り値が多様なプロパティを持つオブジェクトである必要がある
  // よって、それよりも少ないプロパティを持つオブジェクトを返す関数に代替可能だけど逆は成り立たない
  // すなわち、 fromAge は f1 の部分型と言える
  type Animal = { name: string; age: number };
  type Human = { name: string; age: number; language: string };

  const fromAge = (age: number): Human => ({
    name: 'taro',
    age,
    language: 'ja',
  });

  const f1: (age: number) => Animal = fromAge;
  const obj1: Animal = f1(20);

  // 返り値の型が void である場合はあらゆる返り値の型を部分型とできる
  const f2 = (name: string) => ({ name });
  const g2: (name: string) => void = f2;

  // ## 引数の型による部分型関係
  // ある関数の引数の型が部分型関係にあり、その他の引数の型や返り値が同じであれば代替可能
  // showName は name, age をプロパティとするオブジェクトを引数にとればいい
  // よって、それ以外にもプロパティを持つオブジェクトを引数とする関数型の値に代替可能だけど逆は成り立たない
  // すなわち showName は f3 の部分型と言える
  const showName = (target: Animal) => {
    console.log(target.name);
  };

  const f3: (target: Human) => void = showName;
  f3({
    name: 'jiro',
    age: 16,
    language: 'en',
  });

  // 関数型と返り値の型は関数型の共変の位置ある( = 順方向の部分型関係が成立する)
  //  => 「S」が「T」の部分型なら「返り値の型Sの関数」が「返り値の型Tの関数」の部分型となる
  // 関数型と引数の型は関数型の反変の位置ある( = 逆方向の部分型関係が成立する)
  //  => 「S」が「T」の部分型なら「引数の型Tの関数」が「引数の型Sの関数」の部分型となる
  // f4 は g4 の部分型と言える
  const f4 = ({ name, age }: Animal): Human => ({
    name,
    age,
    language: 'ja',
  });
  const g4: ({ name, age, language }: Human) => Animal = f4;

  // 簡単な話、ある値(代入元)を別の値(代入先)に代入できて、それらの引数や返り値が部分型関係のある際は、代入元の値が代入先の値の部分型と言って良さそう
  // 代入できる = 大きな受け皿を持っていて、その内側に収まる内容だから

  // ## 引数の数による部分型関係
  // 同様の関数では引数が少ない関数が引数が多い関数の部分型となる
  type UnaryFunc = (arg: number) => number;
  type BinaryFunc = (left: number, right: number) => number;
  const double2: UnaryFunc = (arg: number) => arg * 2;
  const add: BinaryFunc = (left, right) => left + right;
  const bin: BinaryFunc = double2;
  console.log(bin(10, 100));

  // # ジェネリクス(型引数を受け取る関数を作る機能)
  function repeat<T>(element: T, length: number): T[] {
    const result: T[] = [];
    for (let num = 0; num < length; num++) {
      result.push(element);
    }
    return result;
  }

  console.log(repeat<string>('abc', 5));
  console.log(repeat<number>(123, 3));
  // 使う側で省略して型推論に任せることも可能(型引数を持つ型では不可)
  console.log(repeat(true, 4));

  // 型引数を持つ型と同様に型引数は複数設定したり、extends も使える

  // 型を別で用意してそれを当てはめる場合は以下の通り(90行目をマウスオーバーした時のように定義すれば良い)
  type Func3 = <T>(arg: T, num: number) => T[];
  const repeat2: Func3 = (element, length) => {
    const result = [];
    for (let i = 0; i < length; i++) {
      result.push(element);
    }
    return result;
  };

  // 力試し
  namespace Chapter4_6_1 {
    for (const i of sequence(1, 15)) {
      const message = getFizzBuzzString(i);
      console.log(message);
    }

    function sequence(startNum: number, endNum: number): number[] {
      const result: number[] = [];
      for (let i = startNum; i <= endNum; i++) {
        result.push(i);
      }
      return result;
    }

    function getFizzBuzzString(num: number): string | number {
      if (num % 3 === 0 && num % 5 === 0) {
        return 'FizzBuzz';
      } else if (num % 3 === 0) {
        return 'Fizz';
      } else if (num % 5 === 0) {
        return 'Buzz';
      } else {
        return num;
      }
    }
  }

  namespace Chapter4_6_3 {
    function map<T, U>(array: T[], callback: (x: T) => U): U[] {
      const result: U[] = [];
      for (const element of array) {
        result.push(callback(element));
      }
      return result;
    }

    const data = [1, 1, 2, 3, 5, 8, 13];
    const result = map(data, (x) => x * 10);
    console.log(result);
  }
}
