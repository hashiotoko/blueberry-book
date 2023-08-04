namespace Chapter3 {
  // === type 分
  // 基本的にあらゆる型を定義できる(というか別名をつけられるという表現が適切)
  type TypeExample = {
    aaa: string;
    bbb: number;
  };
  const typeExample: TypeExample = {
    aaa: 'aaa',
    bbb: 123,
  };

  // === interface 宣言
  // オブジェクト型に対してのみ扱える
  // 基本的には type をつかっておけばOK(Declaration Merging を行う場合を除く)
  // そもそも interface が存在するのは昔は type が存在せず interface だけだったため
  interface InterfaceExample {
    aaa: string;
    bbb: number;
  }
  const interfaceExample: InterfaceExample = {
    aaa: 'aaa',
    bbb: 123,
  };

  // === インデックスシグネチャ(任意のプロパティ名を許容する型)
  type PriceData = {
    [key: string]: number;
  };
  const priceData: PriceData = {
    apple: 110,
    cake: 550,
    coffee: 365,
  };

  // インデックスシグネチャは型安全性を破壊する場合があるので基本的に避けて Map オブジェクトを使用するべき(Chapter3で後述)
  // 普通なら存在しないプロパティアクセスはエラーになるが、以下のようにエラーにならない( = 型安全性を破壊する)ため
  console.log(priceData.banana); // undefined が返る

  // === typeof キーワード
  const typeofEx1 = {
    foo: 'abc',
    bar: 123,
  };
  type TypeofExType = typeof typeofEx1;
  const typeofEx2: TypeofExType = {
    foo: 'abcd',
    bar: 1234,
  };

  // 基本的には型宣言したものを使うのが良く乱用すべきではない
  // 理由としては「何が最上位に事実か」を考えた際に型(≒ 設計)が来ることが多いため。
  // (事実、ある型にプロパティが追加された時はまず(最上位たる)型を修正してそこから式などを修正していくことのが自然な流れ)

  // ただし、値が最上に来る場合は typeof の出番となる
  const commandList = ['attack', 'defend', 'run'] as const;
  type Command = (typeof commandList)[number]; // 'attack' | 'defend' | 'run'
  // 上記を type から書くと commandList が増えた際に同じ文字列を２回書くことになる。
  // のでこの場合は command が増えたという事実を元に type を構成していくほうが開発的に利点が多い
  // type Command = 'attack' | 'defend' | 'run' | 'jump';
  // const commandList: Command[] = ['attack', 'defend', 'run', 'jump'];

  // 雑に解釈すると「概念」の追加は型を最上位に置き、「(個別具体な)値」の追加は値を最上位と置くと良さそう的な感じか？

  // === 部分型
  // ts は構造的部分型。つまり、型の構造に着目してそれが部分型であるかを判断する
  // 一般的によく使われるのは名前的部分型。つまり、明示的に「これはこれの部分型である」とした際に部分型となる
  type Animal = {
    name: string;
    age: number;
  };
  type Human = {
    name: string;
    age: number;
    isJapanese: boolean;
  };

  const human1: Human = {
    name: 'taro',
    age: 23,
    isJapanese: true,
  };
  const animal1: Animal = { ...human1 };

  // 実際に存在する値でも Animal 型には含まれないプロパティなのでエラーになる
  // console.log(animal1.isJapanese);

  // 実態としては部分型にあたる値を宣言する場合でもエラーになることがある
  // それは型注釈がある変数に直接オブジェクトリテラルを代入する場合に、その値が型と外れている場合
  // 以下の場合は明らかに buz は使用できないので、型チェックが走りエラーとなる
  // const animal2: Animal = {
  // name: 'jiro',
  // age: 20,
  // isJapanese: true,
  // };

  // 一度宣言された後に代入される場合は型チェックが走らない
  // 理由は一概に使われないプロパティが無駄であると言い切れないからである
  // 以下の場合は obj3_0 の buz がどこかで使われてから obj3 に渡ってくることもあるためエラーとならない。
  const human2 = {
    name: 'jiro',
    age: 20,
    isJapanese: true,
  };
  const animal3: Animal = { ...human2 };

  // === ジェネリック型(型引数を持つ型)
  type Family1<Parent, Child> = {
    father: Parent;
    mother: Parent;
    child: Child;
  };
  const family1: Family1<number, string> = {
    father: 1,
    mother: 2,
    child: 'abc',
  };
  const family2: Family1<number, number> = {
    father: 1,
    mother: 2,
    child: 3,
  };

  // extends によって型引数に部分型(HasName)を満たすように制約を課すことができる
  // また型引数にデフォルトの型を設定することで引数指定を不要にできる
  type Family2<Parent extends HasName, Child extends HasName = Animal> = {
    father: Parent;
    mother: Parent;
    child: Child;
  };
  type HasName = {
    name: string;
  };
  const family3: Family2<Human> = {
    father: human1,
    mother: human2,
    child: animal1,
  };

  // 型引数を別の型引数の extends に指定することも可能
  type Family3<Parent extends HasName, Child extends Parent> = {
    father: Parent;
    mother: Parent;
    child: Child;
  };
  type Family3_0 = Family3<Animal, Human>;
  // type Family3_1 = Family3<Human, Animal>; // Animal は Human の部分型ではないのでエラーになる

  // === 配列
  // ２種類の定義の仕方がある
  const arr1: number[] = [1, 2, 3];
  const arr2: Array<number> = [1, 2, 3];

  // 使い分けは組織等に依る
  // 要素が単純な時は前者を複雑な時は後者(ジェネリック型)を使うところもある
  const arr3: Array<{ name: string }> = [{ name: 'taro' }, { name: 'jiro' }];

  // readonly も使える
  const arr4: readonly number[] = [1, 2, 3];
  // arr4[3] = 4; コンパイルエラー

  // 配列もインデックスシグネチャと同様に、存在しないインデックスアクセスによって型安全性を破壊ことにつながる
  // よって、基本的にはインデックスアクセスを個別に行わず、for-of 文などを用いるのが良い
  // あるいは要素数が決まっているなら後述のタプルを使うのが良い

  // タプル型(要素数が固定された配列型)
  const tuple1: [string, number] = ['abc', 123];
  // tuple1[2] 存在しないのでエラーなる <= これにより型安全性が守られる
  // tuple1[2] = 456; もちろん代入も不可

  // 以下のように要素に対してラベルを貼ることも可能(ラベル付きタプル型)
  const tuple2: [name: string, age: number] = ['taro', 26];
  // あくまでラベリングの役割しかないので呼び出し等には使えない
  // console.log(tuple2.name);
  console.log(tuple2[0]);

  // オプショナルにもできる
  type Tuple3 = [string, number, boolean?];
  const tuple3_1: Tuple3 = ['taro', 26];
  const tuple3_2: Tuple3 = ['taro', 26, true];

  // === 分割代入
  // オブジェクト
  const { aaa, bbb } = typeExample;

  // 変数を別名にすることも可能
  const { foo, bar: bar2 } = typeofEx1;
  // ↑ この書き方があるので分割代入先の変数に型を定義することはできないと思われる

  // ネストにも対応可能
  const nestedObj1 = { a: 123, b: { c: 'abc' } };
  const {
    a,
    b: { c },
  } = nestedObj1; // c = 'abc'
  // 配列
  const [first, second] = arr1;
  // タプル
  const [name1, age] = tuple1;
  // 配列とオブジェクトの組み合わせもできる
  const [{ name }] = arr3;

  const obj1 = { a: [1, 2, 3] };
  const {
    a: [aa, bb],
  } = obj1; // aa = 1, bb = 2

  // 配列は空白を用いて要素をスキップすることもできる
  const [, , third] = arr1; // third = 3
  const {
    a: [, bbbb, cccc],
  } = obj1; // bbbb = 2, cccc = 3

  // 分割代入はデフォルト値の指定もできる
  // 主にオプショナルなプロパティに対して、値が undefined(= プロパティ、インデックスが存在しない)な時にデフォルト値を代入する
  // 値が null の場合はデフォルト値ではなく null になるので注意
  type Obj1 = { piyo?: number };
  const obj2_1: Obj1 = {};
  const obj2_2: Obj1 = { piyo: 123 };

  const { piyo = 456 } = obj2_1; // piyo =  456
  const { piyo: piyo2 = 456 } = obj2_2; // piyo2 = obj2_2.piyo = 123

  // ネストされたオブジェクトの場合
  type Obj2 = { x?: { y: number } };
  const obj2_3: Obj2 = {};
  const obj2_4: Obj2 = { x: { y: 123 } };

  const { x: { y } = { y: 456 } } = obj2_3; // y =  456
  const { x: { y: y2 } = { y: 456 } } = obj2_4; // y2 = 123

  // rest パターン
  // 最後の残りの要素に１度だけ使用できる
  const { name: humanName, ...rest } = human1;
  const [num1, ...restNums] = arr4;

  // 正規表現
  // キャプチャリンググループ
  // マッチした中の特定の部分を抜き出すことができる
  // 返り値は全体が0番目、キャプチャリンググループによる特定の部分が1番目に格納される
  const reg1 = 'Hello, abbbc world!'.match(/a(b+)c/);
  if (reg1 !== null) {
    console.log(`reg1: ${reg1}`); // ['abbbc', 'bbb']
    console.log(`reg1[0]: ${reg1[0]}`);
    console.log(`reg1[1]: ${reg1[1]}`);
  }

  // 名前付きキャプチャグループ[ES2018]
  // 配列ではなくオブジェクトとなり、プロパティアクセスが可能になる
  const reg2 = 'Hello, abbbc world!'.match(/a(?<word1>b+)c/);
  if (reg2 !== null) {
    console.log(`reg2: ${reg2}`); // ['abbbc', 'bbb']
    console.log('reg2.groups: %o', reg2.groups); // { word1: 'bbb' }
    console.log(`reg2.groups.word1: ${reg2.groups!.word1}`);
  }

  // 複数マッチ可能( = g 指定)にするとキャプチャリンググループは無効となる
  const reg3 = 'Hello, abbbc world! abc'.match(/a(b+)c/g);
  if (reg3 !== null) {
    console.log(`reg3: ${reg3}`); // ['abbbc', 'bbb']
    console.log(`reg3[0]: ${reg3[0]}`);
    console.log(`reg3[1]: ${reg3[1]}`);
  }

  // Map
  const map1: Map<string, number> = new Map();
  map1.set('foo', 123);
  console.log(`map1.get("foo"): ${map1.get('foo')}`);
  // インデックスシグネチャと違い、get の返り値の型は「第２型引数 | undefined」なのでエラーとなる(= 型安全)
  // const str1: number = map1.get("foo");

  // Set
  // キーだけで値の無いMap
  const set1: Set<string> = new Set();
  console.log(`set1: %o`, set1); // { 'foo' }

  // ほんの短時間だけ値を Map ot Set を用いて保持したい場合、WeakMap や WeakSet を使うと良いらしい
  // Weak 系はキーにはオブジェクトしか使えないがキーの値などがガベージコレクタされることを妨げない

  // プリミティブでもプロパティが存在するように見えるのは、一時的にオブジェクトを作ってそれが処理をするから
  type HasLength = { length: number };
  const obj4: HasLength = 'foo';
  // 本当にオブジェクトであることをチェックしたいなら object を使うべき

  // 構造的部分型を採用していることで {} 型は undefined, null 以外のあらゆる値を許容する
  let val: {} = 123;
  val = true;
  val = 'foobar';
  val = { foo: 'abc' };
  // undefined, null がNGなのはプロパティアクセス時にランタイムエラーが発生する値だから
  // val = undefined;
  // val = null;
  // undefined, null を含めた任意の値を許容したい場合は unknown を使う
  let val2: unknown = 123;
  val2 = undefined;
  val2 = null;

  // 力試し
  type User = {
    name: string;
    age: number;
    premiumUser: boolean;
  };

  const data: string = `
uhyo,26,1
John,17,0
Mary Sue,14,1
`;

  const users: Array<User> = data
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      const [name, ageStr, premiumUserStr]: string[] = line.split(',');

      return {
        name,
        age: Number(ageStr),
        premiumUser: Boolean(Number(premiumUserStr)),
      };
    });

  for (const user of users) {
    if (user.premiumUser) {
      console.log(`${user.name} (${user.age}) is premium user!`);
    } else {
      console.log(`${user.name} (${user.age}) is not premium user.`);
    }
  }
}
