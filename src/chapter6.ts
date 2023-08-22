// # 高度な型
namespace Chapter6 {
  // ## ユニオン型(合併型)
  // 「TまたはU」を表現できる型
  // ユニオン型は直和型ではない、直和型を表現するには代数的データ型、タグ付きユニオンを用いる
  namespace Chapter6_1_1 {
    type Animal = {
      species: string;
      age: string;
    };
    type Human = {
      name: string;
      age: number;
    };
    type User = Animal | Human;

    const user1: User = {
      species: 'cat',
      age: '5 years old',
    };
    const user2: User = {
      name: 'taro',
      age: 26,
    };

    // 全ての型に存在しないプロパティへのアクセスはエラーとなる
    // function showName(user: User) {
    //   console.log(`name is ${user.name}`);
    // }

    // 全ての型に存在するプロパティの型は全ての型の和の型となる
    function showAge(user: User) {
      console.log(`age is ${user.age}`); // age は string | number 型
    }
    showAge(user1);
    showAge(user2);

    // 構造的部分型によって Animal でも Human でもない型のものもエラーにならない
    type Alien = {
      species: string;
      name: string;
      age: any;
    };
    const alien: Alien = {
      species: 'unknown',
      name: 'unknown',
      age: 'unknown',
    };
    showAge(alien);

    // エラーを発生させたい場合はタグ付きユニオンを用いて判別可能なユニオン型(直和型)となるようにする
    namespace DiscriminatedUnionType {
      type Animal = {
        type: 'Animal';
        species: string;
        age: number;
      };
      type Human = {
        type: 'Human';
        name: string;
        age: number;
      };
      type Alien = {
        type: 'Alien';
        species: string;
        name: string;
        age: number;
      };
      function showAge(user: Animal | Human) {
        console.log(`type is ${user.type}`); // type プロパティが実際の値のユニオン型であることでそれ以外の場合は検知できる
        console.log(`age is ${user.age}`);
      }

      const alien: Alien = {
        type: 'Alien',
        species: 'unknown',
        name: 'unknown',
        age: 0,
      };
      // showAge(alien); エラーとなる
    }
  }

  // ## インテーセクション型(交差型)
  // 「TかつU」を表現できる型
  // オブジェクト型を拡張した新しい型を作る用途で使われる
  namespace Chapter6_1_3 {
    type Animal = {
      species: string;
      age: number;
    };
    type Human = Animal & {
      name: string;
    };
    // ↑ は ↓ と同様
    // type Human = {
    //   species: string;
    //   age: number;
    //   name: string;
    // };

    const user1: Animal = {
      species: 'cat',
      age: 5,
    };
    const user2: Human = {
      species: 'Homo sapiens',
      age: 26,
      name: 'taro',
    };

    // プリミティブ型同士の場合は never 型となる
    type StringAndNumber = string & number;

    // オブジェクト型とプリミティブ型の場合はプリミティブ型にも特定のプロパティは存在するので即座に never 型にはならない
    type HasLength = {
      length: number;
    };
    const str1: HasLength & string = 'abc';
    // const str2: HasLength & string = { length: 5 }; これは string 型ではないのでエラー
    console.log(`str.length: ${str1.length}`);
  }

  namespace Chapter6_1_4 {
    type Human = { name: string };
    type Animal = { species: string };
    function getName(human: Human) {
      return human.name;
    }
    function getSpecies(animal: Animal) {
      return animal.species;
    }

    // 2つの関数型とユニオン型となる
    const mysteryFunc = Math.random() < 0.5 ? getName : getSpecies;

    const human: Human = { name: 'taro' };
    const animal: Animal = { species: 'cat' };
    // mysteryFunc(human); エラー
    // mysteryFunc(animal); エラー
    const humanAnimal: Human & Animal = {
      name: 'jiro',
      species: 'Homo sapiens',
    };
    // 関数呼び出しに当たって型の再解釈が起こり、1つに関数型に合成される
    mysteryFunc(humanAnimal);

    // 関数型のユニオン型において、引数は反変の位置にあり、返り値は今日変の位置にある
    // よって関数実行時の再解釈によって引数はインターセクション型、返り値はそのままユニオン型となる
    // 再解釈のタイミングが関数実行時であるのは後述されるがユニオン型であることの恩恵を得るために敢えてそうなっている
  }

  // ## オプショナルプロパティ
  namespace Chapter6_1_5 {
    type Human1 = {
      name: string;
      age?: number; // number | undefined となる
    };
    const human1_1: Human1 = { name: 'taro' }; // age 省略可能
    const human1_2: Human1 = { name: 'taro', age: 2 };
    const human1_3: Human1 = { name: 'taro', age: undefined }; // 明示的に undefined も指定できる

    type Human2 = {
      name: string;
      age: number | undefined;
    };
    // const human2_1: Human2 = { name: 'taro' }; // age 省略不可
    const human2_2: Human2 = { name: 'taro', age: 2 };
    const human2_3: Human2 = { name: 'taro', age: undefined };

    // オプショナルプロパティはプロパティの省略を可能にする一方で、
    // 「そのプロパティを省略した」のか「そのプロパティを書き忘れた」のかを区別できない
    // よって、書き忘れを防止したいとか、単にデータが存在しないプロパティとして扱いたいだけで省略したい強い動機がないならば、
    // Human2 の書き方をする方が堅牢なコードにできる

    // ts4.4からは tsconfig で exactOptionalPropertyTypes を有効化するとオプショナルプロパティ指定時に undefined のセットはエラーとなる
    // が「age?: number | undefined」と書けばエラーにはならない
  }

  // ## オプショナルチェイ二ング
  // ruby でいう obj&.method の「&.」のこと。js の場合は「?.」。
  // ruby と違う点としては一度使うと以降のメソッドチェインに対して「?.」を書く必要がない
  // obj が null や undefined でメソッドが呼べない場合は undefined が返る
  namespace Chapter6_1_6 {
    type Human = {
      name: string;
      age: number;
      isAdult(): boolean;
    };
    // プロパティアクセス
    function useMaybeHuman(human: Human | undefined) {
      // age の型は number | undefined になる
      const age = human?.age; // あるいは human?.['age']
      console.log(age);
    }
    // メソッド呼び出し
    function checkForAdult(human: Human | undefined) {
      if (human?.isAdult()) {
        console.log(`${human.name} is adult.`);
      }
    }
    const user: Human = {
      name: 'taro',
      age: 26,
      isAdult() {
        return this.age >= 20;
      },
    };
    useMaybeHuman(user);
    useMaybeHuman(undefined);
    checkForAdult(user);
    checkForAdult(undefined);

    // 関数呼び出し
    type GetTimeFunc = () => Date;
    function useTime(getTimeFunc: GetTimeFunc | undefined) {
      const timeOrUndefined = getTimeFunc?.();
    }
  }

  // ## リテラル型
  namespace Chapter6_2_1 {
    const foo: 'foo' = 'foo';
    // const bar: "foo" = "bar"; エラー

    const one: 1 = 1;
    const t: true = true;
    const three: 3n = 3n;
    const func1: () => 'hoge' = () => 'hoge';

    // 型推論でもリテラル型になる
    const fizz = 'fizz';
  }

  // ## テンプレートリテラル型
  // テンプレート文字列リテラルの一部を任意の値とする型
  namespace Chapter6_2_2 {
    // 基本形
    function getHelloStr(): `Hello, ${string}!` {
      const rand = Math.random();
      if (rand < 0.3) {
        return 'Hello, world!';
      } else if (rand < 0.6) {
        return 'Hello, new world!';
      } else if (rand < 0.9) {
        // return 'Hello, my world.'; エラー
        return 'Hello, my world!';
      } else {
        // return 'Hell, world!'; エラー
        return 'Hello, world!';
      }
    }

    // as const をつけることで string 型ではなくテンプレートリテラル型に型推論してもらうこともできる
    // 以下は makeKey の返り値は string となり、 makeKey2は `user:${string}` となる
    function makeKey<T extends string>(userName: T) {
      return `user:${userName}`;
    }
    function makeKey2<T extends string>(userName: T) {
      return `user:${userName}` as const;
    }
    const key1 = makeKey('taro'); // string 型
    const key2 = makeKey2('taro'); // 'user:taro' 型
  }

  // ## リテラル型のユニオン型
  namespace Chapter6_2_3 {
    function signNumber(type: 'plus' | 'minus') {
      return type === 'plus' ? 1 : -1;
    }
    console.log(`signNumber('plus'): ${signNumber('plus')}`);
    console.log(`signNumber('minus'): ${signNumber('minus')}`);
    // console.log(`signNumber('taro'): ${signNumber('taro')}`); エラー
  }

  // ## リテラル型の widening
  namespace Chapter6_2_4 {
    // ### let による変数宣言
    // let で変数宣言した値はリテラル型ではなくその値を内包するプリミティブ型となる
    let plusStr = 'plus'; // string 型

    // よって以下のような場合はエラーとなる
    function signNumber(type: 'plus' | 'minus') {
      return type === 'plus' ? 1 : -1;
    }
    // console.log(`signNumber(plusStr): ${signNumber(plusStr)}`); エラー

    // 以下のような場合は let でも再代入できないので、明示的に型を指定する必要がある
    let value = 'foo';
    // value = 3n; エラー
    let value2: string | BigInt = 'foo';
    value2 = 3n;

    // ### オブジェクトリテラルのプロパティ
    const user1 = { name: 'taro', age: 25 }; // { name: string; age: number; } 型

    // 以下の場合は contextual typing により user2.name が string 型とならない
    type Taro = { name: 'taro'; age: number };
    const user2: Taro = { name: 'taro', age: 25 };
  }

  // ## 型の絞り込み(コントロールフロー解析)
  // 条件文などの中でその対象となる値の型がより詳細に限定される機能
  namespace Chapter6_3_1 {
    type SignType = 'plus' | 'minus';
    function signNumber(type: 'plus' | 'minus') {
      return type === 'plus' ? 1 : -1;
    }
    function numberWithSign(num: number, type: SignType | 'none'): number {
      if (type === 'none') {
        // このブロック内では type の型は 'none' となる
        return 0;
      } else {
        return num * signNumber(type); // type の型が SignType となる
      }
    }
    function numberWithSign2(num: number, type: SignType | 'none'): number {
      switch (type) {
        case 'none':
          return 0;
        case 'plus':
        case 'minus':
          return num * signNumber(type);
      }
    }
  }

  // ## (擬似的な)代数的データ型の再現(algebraic data types, ADT)
  // ts には存在しないデータ型だが、擬似的に再現可能
  // 別名「タグ付きユニオン」や「直和型」と言われる
  namespace Chapter6_3_3 {
    // namespace DiscriminatedUnionType で言及しているので割愛
  }

  namespace Chapter6_3_4 {
    // type の値が増えることが想定され、その値用の分岐を発生させたいなどの場合、
    // 返り値の型注釈を指定しておく && default を使わずに type ごとの分岐を網羅的に指定しておくと
    // type が増えた時にエラーで示してくれるようにできる
    type SignType = 'plus' | 'minus' | 'foo'; // 'foo' を追加
    function signNumber(type: 'plus' | 'minus') {
      return type === 'plus' ? 1 : -1;
    }
    // 以下は type が `foo` の時の分岐がなく返り値が undefined になりうるのでエラーとなる
    // function numberWithSign(num: number, type: SignType | 'none'): number {
    //   switch (type) {
    //     case 'none':
    //       return 0;
    //     case 'plus':
    //     case 'minus':
    //       return num * signNumber(type);
    //   }
    // }
  }

  // ## lookup 型
  // T[K] で表せる型
  // T はオブジェクト型、Kはプロパティ名(リテラル型)
  // オブジェクト型の定義元のプロパティの型を変更した際に自動的に反映できる
  namespace Chapter6_4_1 {
    type Human = {
      name: string;
      age: number;
    };

    function ageAfterTenYears(age: Human['age']) {
      return age + 10;
    }
  }

  // ## keyof 型
  namespace Chapter6_4_2 {
    type Human = {
      name: string;
      age: number;
    };

    type HumanKeys = keyof Human; // 'name' | 'age' 型
    let key: HumanKeys = 'name';
    // key = 'foo'; エラー
    key = 'age';

    // 「keyof typeof 変数」とすることで変数のプロパティのユニオン型を生成でき、変数の変更に対して追随できる
    // mmConversionTable に cm などを追加すると自動的に convertUnits の引数 unit に反映される
    const mmConversionTable = {
      mm: 1,
      m: 1e3,
      km: 1e6,
    };
    function convertUnits(value: number, unit: keyof typeof mmConversionTable) {
      const mmValue = mmConversionTable[unit]; // unit が string 型だとエラーになる
      return { mm: mmValue, m: mmValue / 1e3, km: mmValue / 1e6 };
    }
  }

  // lookup & keyof & ジェネリクス
  namespace Chapter6_4_3 {
    function get<T, K extends keyof T>(obj: T, key: K): T[K] {
      return obj[key];
    }

    type Human = {
      name: string;
      age: number;
    };
    const user: Human = { name: 'taro', age: 25 };

    const userName = get(user, 'name');
    const userAge = get(user, 'age');
    // const userFoo = get(user, 'foo'); エラー
  }

  // # as による型アサーション
  // ts が手の届かない型推論や型の絞り込みに対して明示的に型を指定すること
  // 型安全性を破壊しうる機能なので基本的には使うべきでないが、手の届かない部分では許容できる
  // とはいえ、手の届くようなコードに変換することも視野に入れるべき
  namespace Chapter6_5_1 {
    type Animal = {
      type: 'Animal';
      species: string;
    };
    type Human = {
      type: 'Human';
      name: string;
    };
    type User = Animal | Human;

    // ## 基本形
    function getNameIfAllHuman(users: readonly User[]): string[] | undefined {
      if (users.every((user) => user.type === 'Human')) {
        return (users as Human[]).map((user) => user.name); // 型の絞り込みが完全ではないので as がないとエラーになる
      }
      return undefined;
    }

    // ## 「!」による型アサーション
    // null と undefined を無視する
    function getOneUserName(user1?: Human, user2?: Human): string | undefined {
      if (user1 === undefined && user2 === undefined) {
        return undefined;
      }
      if (user1 !== undefined) {
        return user1.name;
      }
      return user2!.name; // ! がないとエラーになる
      // return (user2 as Human).name; あるいはこっちでも
    }
    // とはいえ以下のように書くと型アサーションが不要にできて良い
    function getOneUserName2(user1?: Human, user2?: Human): string | undefined {
      return user1?.name ?? user2?.name;
    }
  }

  // # as const
  // ざっくり言うと型をより厳密に限定して変更できないようにする
  namespace Chapter6_5_2 {
    const arr1 = ['abc', 123, true]; // (string | number | boolean)[]
    const arr2 = ['abc', 123, true] as const; // readonly ["abc", 123, true]

    const obj1 = { foo: 'abc', bar: 123 }; // obj1: { foo: string; bar: number; }
    const obj2 = { foo: 'abc', bar: 123 } as const; // { readonly foo: "abc"; readonly bar: 123; }

    // 値から型を作る手段として有効
    const names = ['taro', 'jiro', 'saburo'] as const;
    type Name = (typeof names)[number]; // 'taro' | 'jiro' | 'saburo'
  }

  // # any, unknown
  namespace Chapter6_6 {
    // ## any 型
    // any 型となった値は扱う側含めて型チェックがほぼほぼスルーされる( = 型安全性を大きく破壊する)
    // ゆえに any は以下のような場合を除いて基本的に使うべきでない
    // ・素のjsからtsへの移行時の一時的なエラー回避
    // ・jsの柔軟なコード(ひいてはランタイム)を優先し、それをうまく表現するのが難しい型の場合のエラー回避
    function doWhatever(arg: any) {
      console.log(arg.name);
      arg();
      return arg * 10;
    }

    // ## unknown 型
    // 一方で unknown 型は any がと違い、あらゆる型が入ることを想定してエラーを吐いてくれる
    function doWhatever2(arg: unknown) {
      // console.log(arg.name); エラー
      // arg(); エラー
      // return arg * 10; エラー
      console.log(arg); // どの型でも問題ないのでエラーにならない
    }
    // よって、ある値の型が不明な時にはむしろ使うべき
    // 受け取ったある型の値を switch 分なので型ごとの処理をするなどするイメージ
    function doWhatever3(arg: unknown) {
      switch (typeof arg) {
        case 'function':
          arg();
          return;
        case 'number':
          return arg * 10;
        case 'string':
          return arg + ' is good.';
        default:
          console.log(arg);
      }
    }
  }

  // # object, never
  namespace Chapter6_7_1 {
    // ## object 型
    // プリミティブ型以外の全てを表す型
    // 単体で使うとプロパティやメソッドが不明なのでアクセスできない
    // よって特定のプロパティやメソッドの指定する型でかつプリミティブ型は省きたい場合に使うと良いとのこと
    type HasToString = {
      toString: () => string;
    };
    // 以下で & object とすることで string 型を排除できる
    function useToString(value: HasToString & object) {
      console.log(`value is ${value.toString()}`);
    }
    useToString({
      toString() {
        return 'foo!';
      },
    });
    // useToString('bar!'); エラー

    // ## never 型
    // 当てはまる値が存在しない型
    // ゆえに関数の引数にこの型を設定して場合はその関数は as や any を使わない限りエラーになる
    // 逆に never 型は全ての型の部分型でもあるのでいかなる型の変数にも代入できる
    function useNever(value: never) {
      const num: number = value;
      const str: string = value;
      const obj: object = value;
    }
    // useNever({}); エラー

    // 必ずエラーが発生する関数の返り値の代入先の変数にも代入されない値として never 型は使える
    function thrower(): never {
      throw new Error('error');
    }
    const result: never = thrower();
  }

  // # 型述語(ユーザー定義型ガード)
  // ts では判別できない型の絞り込みを開発者が操作する手法
  // 使い方を間違えると型安全性を破壊しうるので注意しつつも、
  // 取り回しが効くので any や as よりは優先して導入を検討するのが良いとのこと
  namespace Chapter6_7_2 {
    // ## is(条件分岐用 = 返り値が boolean)
    type Human = {
      type: 'Human';
      name: string;
      age: number;
    };
    function isHuman(value: any): value is Human {
      if (value == null) return false;
      return (
        value.type === 'Human' &&
        typeof value.name === 'string' &&
        typeof value.age === 'number'
      );
    }

    const someValue: any = { type: 'Human', name: 'taro', age: 25 };
    if (isHuman(someValue)) {
      // someValue は Human 型として絞り込まれる
      console.log(someValue.name);
    } else {
      // someValue は any 型のまま
      console.log(someValue);
    }

    // ## asserts is(アサーション用 = 返り値が void)
    function assertHuman(value: any): asserts value is Human {
      if (value == null) {
        throw new Error('Given value is null or undefined!');
      }
      if (
        value.type !== 'Human' ||
        typeof value.name !== 'string' ||
        typeof value.age !== 'number'
      ) {
        throw new Error('Given value is not a Human!');
      }
    }
    function checkAndUseHuman(value: unknown) {
      assertHuman(value);
      // 以降、value は Human 型として絞り込まれる
      const name = value.name;
      // ...
    }
  }

  // # 可変長タプル型
  namespace Chapter6_7_3 {
    type NumberStrings = [number, ...string[]];
    const arr1: NumberStrings = [1];
    const arr2: NumberStrings = [1, 'abc', 'def'];
    // const arr: NumberStrings = ['abc']; エラー

    type NumberStringsNumber = [number, ...string[], number];
    const arr3: NumberStringsNumber = [1, 2];
    const arr4: NumberStringsNumber = [1, 'abc', 'def', 'ghi', 2];

    // 1つの型に2回は使用不可
    // type T = [number, ...string[], number, ...string[]];

    // rest要素の後にオプショナル要素は使用不可
    // type T = [number, ...string[], number?];

    // スプレッド構文のような形でタプル型を他のタプル型に埋め込みことも可能
    type NSN = [number, string, number];
    type SNSNS = [string, ...NSN, string];
    type NNSsN = [number, ...NumberStrings, number];
  }

  // # mapped types( { [P in K]: T } )
  // Kはプロパティ名になれる型でリテラル型のユニオン型などが多い
  // Kそれぞれをプロパティにもち、その値がT型であるオブジェクト型を作成する
  namespace Chapter6_7_4 {
    type Fruit = 'apple' | 'orange' | 'banana';
    type FruitNumbers = { [P in Fruit]: number };
    const numbers: FruitNumbers = { apple: 1, orange: 2, banana: 3 };

    type tuple = [string, number, boolean];
    type a = keyof tuple;

    // ## [応用]homomorphic mapped type( { [P in keyof T]: U }、準同型な mapped type 的なやつ)
    // 元のオブジェクト型や配列型などに対して一部を変更した型を作成できる機能
    type Flags = { x: boolean; y: boolean };
    type Flags2 = { [P in keyof Flags]: Flags[P] }; // 単なる複製
    type PartialFlags = { [P in keyof Flags]?: Flags[P] }; // 一部変更(オプショナルプロパティ化)

    type HMT<T> = { [P in keyof T]: T[P] };
    type Tuple = readonly [number, string, boolean];
    type Tuple2 = HMT<Tuple>; // 単なる複製
    type Tuple3 = { [P in keyof Tuple]: Tuple[P] }; // 直書きするとタプル型の他のプロパティ等も含まれてしまう
    type HMT2<T> = { [P in keyof T]: T[P][] };
    type Tuple4 = HMT2<Tuple>; // 一部変更(行列化)
  }

  // # conditional types( X extends Y ? S : T )
  // XがYの部分型ならばS、そうでないならばTとする型
  namespace Chapter6_7_5 {
    type RestArgs<M> = M extends 'string'
      ? [string, string]
      : [number, number, number];

    function someFunc<M extends 'string' | 'number'>(
      mode: M,
      ...args: RestArgs<M>
    ) {
      console.log(mode, ...args);
    }

    someFunc('number', 1, 2, 3);
    // someFunc('number', 1, 2); エラー
    someFunc('string', 'abc', 'def');
    // someFunc('string', 1, 2, 3); エラー

    // ## [応用]ユニオン型の分配(union distribution)
    // X が型引数かつユニオン型の場合に「ユニオン型のconditional types」が「conditional typesのユニオン型」になる
    // つまり、「(X1 | X2) extends Y ? S : T」が「(X1 extends Y ? S1 : T1) | (X2 extends Y ? S2 : T2)」になる
    // その際にSかTがXとなる時にはそこも分配されてX1ならX1となる(X1 | X2とはならない)
    type None = { type: 'None' };
    type Some<T> = { type: 'Some'; value: T };
    type Option<T> = None | Some<T>;
    type ValueOption<V extends Option<unknown>> = V extends Some<infer R>
      ? R
      : undefined;

    // ユニオン型の分配が発生し、ValueOption<None> | ValueOption<Some<number>> = undefined | number となる
    type T1 = ValueOption<Option<number>>;

    // mapped types もユニオン型の分配が発生する
    // { [P in keyof T]: X } におけるTが型引数の時にそこにユニオン型が渡されると
    // { [P in keyof (T1 | T2)]: X } => { [P in T1]: X1 } | { [P in T2]: X2 } となる
    type Arrayify<T> = { [P in keyof T]: Array<T[P]> };
    type Foo = { foo: string };
    type Bar = { bar: number };
    type FooBar = Foo | Bar;

    // 分配が発生し、Arrayify<Foo> | Arrayify<Bar> となる
    type FooBarArr = Arrayify<FooBar>;

    const arr1: FooBarArr = { foo: ['abc', 'def'] };
    const arr2: FooBarArr = { bar: [1, 2, 3] };
  }

  // # 組み込み型
  // mapped types や conditional types のよく使う組み合わせを標準ライブラリとして用意したもの
  namespace Chapter6_7_6 {
    type Human = { name: string; age?: number };

    // ## Readonly<T>
    // プロパティを全て readonly にする
    type T1 = Readonly<Human>;

    // ## Partial<T>
    // プロパティを全てオプショナルにする
    type T2 = Partial<Human>;

    // ## Required<T>
    // プロパティを全て必須にする
    type T3 = Required<Human>;

    // ## Pick<T, K>
    // Tのオブジェクト型のうちKのプロパティ(複数の場合はユニオン型で指定)を残したオブジェクト型を作成する
    type T4 = Pick<Human, 'name'>;

    // ## Omit<T, K>
    // Tのオブジェクト型のうちKのプロパティ(複数の場合はユニオン型で指定)を除いたオブジェクト型を作成する
    type T5 = Omit<Human, 'name'>;

    type Foo = 'abc' | 'def' | 123 | true | undefined | null;
    // ## Extract<T, K>
    // T(基本はユニオン型)の構成要素のうちKの部分型のみを残した新たな型を作成する
    type T6 = Extract<Foo, string>; // 'abc' | 'def'

    // ## Exclude<T, K>
    // T(基本はユニオン型)の構成要素のうちKの部分型のみを除いた新たな型を作成する
    type T7 = Exclude<Foo, string>; // 123 | true | undefined | null

    // ## NonNullable<T, K>
    // Exclude<T, undefined | null> と同じ意味
    type T8 = NonNullable<Foo>; // 'abc' | 'def' | 123 | true

    // ## Record<K, T>
    // 型Tな値を持つプロパティKのオブジェクト型を作成する
    type T9 = Record<keyof Human, string>;

    // ## Parameters<T>
    // 「T extends (args: ...any[]) => any」つまり、Tは任意の引数を持つ関数型
    // 関数型Tから引数の型を抽出したタプル型を作成する
    function foo(arg1: number, arg2: string): void {}
    function bar(): void {}

    type T10_1 = Parameters<typeof foo>; // [arg1: number, arg2:string];
    type T10_2 = Parameters<typeof bar>; // [];

    const t10_1: T10_1 = [1, 'a'];
    const t10_2: T10_2 = [];

    // ## ConstructorParameters<T>
    // 「T extends new (...args: any[]) => any」つまり、Tは任意のクラス型
    // クラス型Tからコンストラクタの引数の型を抽出したタプル型を作成する
    class Fizz {
      constructor(public arg1: number, public arg2: string) {}
    }

    type T11 = ConstructorParameters<typeof Fizz>;

    const t11: T11 = [1, 'a'];

    // ## ReturnType<T>
    // 関数型Tの返り値の型を抽出した型を作成する
    type T12_1 = ReturnType<() => void>; // void
    type T12_2 = ReturnType<() => number[]>; // number[]

    // ## InstanceType<T>
    // クラス型Tのコンストラクタの返り値の型を抽出した型(= クラスオブジェクトの型)を作成する
    // クラス定義にアクセスできない場合やクラスが不確定(ジェネリクス使っているとかで)な場合に使う想定っぽい
    // ref. https://yinm.info/20200222/
    type T13 = InstanceType<typeof Fizz>; // Fizz

    // ## ThisType<T>
    // オブジェクトにおける this を型を指定できる特殊な型
    type Piyo = { piyo: number };
    type Fuga = { fuga(): string };

    const func1: ThisType<Piyo> = {
      myMethod() {
        return this.piyo;
      },
    };
    const func2: Fuga & ThisType<Piyo> = {
      fuga() {
        return this.piyo.toString();
      },
    };

    // ## 文字列リテラル型の文字列を操作する型
    type T14 = Uppercase<'abc'>;
    type T15 = Lowercase<'Abc'>;
    type T16 = Capitalize<'abcDef'>;
    type T17 = Uncapitalize<'AbcDef'>;

    // ## Awaited<T>
    // 非同期処理における Promise の中身の型を取得する
    type T18_1 = Awaited<Promise<number>>;
    // Promise の入れ子でも最終的な中身を取得できる
    type T18_2 = Awaited<Promise<Promise<number>>>;
    // 単純な型の場合はそのまま
    type T18_3 = Awaited<boolean | Promise<number>>;
  }
}
