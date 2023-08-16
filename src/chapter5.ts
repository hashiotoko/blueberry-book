namespace Chapter5 {
  namespace Chapter5_1 {
    // # クラス宣言
    class User {
      // ruby でいう クラスメソッドの定義的な感じでクラス自体にプロパティとメソッドを定義できる
      static adminName: string = 'admin';
      static buildAdminUser() {
        return new User(User.adminName, 26);
      }

      static adminUser: User;
      // 静的初期化ブロック(static ブロック)
      // クラス宣言時に実行できる処理を記述する場所
      // クラス内での処理なのでもちろんプライベートなプロパティも読み込める
      static {
        this.adminUser = this.buildAdminUser();
      }

      // プロパティの宣言
      name: string;
      // プライペート化に関して「private」は ts のみで「#」は js(ランタイム)の機能
      // よって「#」の方がランタイム実行時にエラーが飛ぶのでより厳密である
      // とはいえ「private」でもコンパイルエラー時点で引っかかるはずなのでどちらでも良いという意見もある
      // 迷ったら「#」が良さそう
      private readonly age: number;
      readonly #age: number; // 要ES2015以上

      // 初期化
      constructor(name: string, age: number) {
        this.name = name;
        this.age = age;
        this.#age = age;
      }

      public isAdult(): boolean {
        return this.age >= 20;
      }

      public isChild(): boolean {
        return this.#age < 20;
      }

      // プロパティ宣言で readonly 修飾子を付けているので再設定不可
      // public setAge(newAge: number): void {
      //   this.age = newAge;
      // }
    }

    const user1 = new User('taro', 30);
    console.log(user1.name);
    // プロパティ宣言で private 修飾子を付けているのでクラス外で読み込み不可
    // console.log(user1.age);
    // プロパティ宣言で #識別子( = プライベート宣言)が付けているのでクラス外で読み込み不可
    // console.log(user1.#age);

    class SimpleUser {
      language: string = '';
      // プロパティ宣言とコンストラクをまとめて定義できる
      // ts 特有の書き方で js には存在しないシンタックスシュガー
      // 定義がスッキリする一方で、他にコンストラクタでは保持しないプロパティを持っているときにプロパティ宣言が二分してしまう
      // 以上から使いどころは考えるべき
      // 初期化以外に何かしたい場合は普通に{}内で定義すれば良い
      constructor(public name: string, private readonly age: number) {}

      public isAdult(): boolean {
        return this.age >= 20;
      }

      public setLanguage(newLanguage: string): void {
        this.language = newLanguage;
      }
    }

    const simpleUser = new SimpleUser('jiro', 20);
    simpleUser.setLanguage('ja');
    console.log(simpleUser.name);
    console.log(simpleUser.language);

    // クラス式でクラスを作成することも可能
    // とはいえクラス宣言よりできないことがある(protected 使えないとか？)
    // よって動的にクラスを作成したい場合などを除いて基本はクラス宣言を用いるのが良い
    const ClassExpressionUser = class {
      name: string;
      private readonly age: number;

      constructor(name: string, age: number) {
        this.name = name;
        this.age = age;
      }

      public isAdult(): boolean {
        return this.age >= 20;
      }
    };

    const exUser = new ClassExpressionUser('saburo', 21);
    console.log(exUser.name);

    // クラスの型引数
    class TypeArgumentUser<T> {
      name: string;
      #age: number;
      readonly data: T;

      constructor(name: string, age: number, data: T) {
        this.name = name;
        this.#age = age;
        this.data = data;
      }
    }

    const typeArgumentUser1 = new TypeArgumentUser<string>('taro', 26, 'data');
    // 関数とかと同様に省略もできる
    const typeArgumentUser2 = new TypeArgumentUser('taro', 26, { num: 123 });
  }

  // # クラスの型
  namespace Chapter5_2 {
    class User {
      name: string = '';
      age: number = 0;

      isAdult(): Boolean {
        return this.age >= 20;
      }
    }

    // クラスの宣言時にクラスのインスタンスの型も同時に作成される
    const user1: User = new User();

    // ここでも部分的構造型によって、同じプロパティやメソッドを持っていれば型は通る
    // このことから new User とかは同様の型を持つオブジェクトを作るシンタックスシュガー的な立ち位置でしかない
    const user2: User = {
      name: 'taro',
      age: 25,
      isAdult: () => true,
    };

    // クラス式の場合はインスタンスの型は作成されない
    const SimpleUser = class {
      name: string = '';
      age: number = 0;

      isAdult(): Boolean {
        return this.age >= 20;
      }
    };

    // SimpleUser の型は存在しないのでエラーになる
    // const user3: SimpleUser = new SimpleUser();

    // 「クラス」=「クラスオブジェクトが入った変数」
    // 「クラスオブジェクトの型」=「new で呼び出した際にそのクラスのインスタンス型を返す型」
    // すなわちクラスオブジェクトの型は以下のように表せる
    type MyUserConstructor = new () => User;
    const MyUser: MyUserConstructor = User;
    const user4 = new MyUser();

    // # instanceof 演算子
    console.log(`user1 instanceof User: ${user1 instanceof User}`); // true
    // User のインスタンスは new によって作られたものであるため、型が一緒でも false になる
    console.log(`user2 instanceof User: ${user2 instanceof User}`); // false

    // ## 型の絞り込み
    type HasAge = { age: number };
    function getPrice(customer: HasAge) {
      // instaceof によって User インスタンスであることが確認できているので name プロパティを呼び出せる
      if (customer instanceof User && customer.name === '') {
        return 0;
      }

      return customer.age < 18 ? 1000 : 1800;
    }

    const customer1: HasAge = { age: 20 };
    const customer2: HasAge = { age: 10 };
    console.log(getPrice(user1)); // 0
    console.log(getPrice(customer1)); // 1800
    console.log(getPrice(customer2)); // 1000
  }

  // 継承
  namespace Chapter5_3 {
    class User {
      name: string;
      #age: number;

      constructor(name: string, age: number) {
        this.name = name;
        this.#age = age;
      }

      public isAdult(): boolean {
        return this.#age >= 20;
      }
    }

    class PremiumUser extends User {
      rank: number;

      constructor(name: string, age: number, rank: number) {
        // super の前に this を呼ぶのはNG
        // this.rank = rank;
        super(name, age);
        this.rank = rank;
      }

      // 子クラスのメソッドを上書きできる(返り値の型は一致している必要がある)
      // override 修飾子は必須ではないが、tsconfig の noImplicitOverride で必須化でき、適切なオーバーライド以外はエラーになるようにできる
      public override isAdult(): boolean {
        // private なプロパティは子クラスで参照できない(子クラスでの参照を許す場合は protected を使う)
        // return this.#age >= 10;
        return true;
      }
    }

    const user1 = new User('taro', 26);
    const user2 = new PremiumUser('jiro', 18, 3);

    function getName(user: User) {
      return user.name;
    }

    // 子クラスは親クラスの部分型
    console.log(getName(user1));
    console.log(getName(user2));

    // ## private と # の違い
    // private は ts の機能でありあくまでコンパイル時のチェックのみ
    // ゆえにコンパイル後には通常のプロパティとなるので親子で同じプロパティを定義することはできない
    class User1 {
      private age = 0;
    }
    // エラーになる
    // class SuperUser1 extends User1 {
    //   private age = 1;
    // }

    // # は jsの機能でありプロパティ名の名前空間は親子関係なくそのクラスに閉じる
    // ゆえに親子で別のプロパティとして定義できる
    class User2 {
      #age = 0;

      public isAdult(): boolean {
        return this.#age >= 20;
      }
    }

    class SuperUser2 extends User2 {
      #age = 1;

      // protected を使わずともプライベートプロパティを参照できる
      public override isAdult(): boolean {
        return this.#age >= 10;
      }
    }

    // ## implements キーワード(部分型の宣言)
    type HasName = { name: string };
    class User3 implements HasName {
      name: string; // これがないと HasName を満たさないのでエラーになる
      #age: number;

      constructor(name: string, age: number) {
        this.name = name;
        this.#age = age;
      }
    }
  }

  // # this
  namespace Chapter5_4 {
    class User {
      constructor(public name: string, private age: number) {}

      public isAdult(): boolean {
        return this.age >= 20;
      }

      // アロー関数
      // 関数の外側の this の関数内部で受け継いで処理できる(言い換えると自分自身の this を持たない)
      public filterOrder(users: readonly User[]): User[] {
        return users.filter((u) => u.age > this.age);
      }
    }

    // 関数の中の this は呼び出し方によって変わる
    // object.method() で呼ぶ場合、method 内の this は object となる
    // 一時的に関数オブジェクトを変数に代入して呼ぶと this は undefined となる
    const user = new User('ichiro', 22);
    const isAdult = user.isAdult;
    // console.log(isAdult()); // this が undefined になってエラーになる

    // ちなみに同じクラスの持つインスタンスメソッドは同じ関数オブジェクトとなる
    // これによりメモリが節約できる。これは prototype のしくみで実現されている
    const user1 = new User('taro', 15);
    const user2 = new User('jiro', 25);
    console.log(
      `user1.isAdult === user2.isAdult: ${user1.isAdult === user2.isAdult}`
    );

    // ## 関数の中の this を操作する方法
    // ### apply
    // funcObject.apply(obj, args)
    console.log(`isAdult.apply(user1): ${isAdult.apply(user1, [])}`); // 元々の user.age ではなく user1.age を参照した結果が返る
    // Reflect.apply(funcObject, obj, args)
    console.log(
      `Reflect.apply(isAdult, user2, []): ${Reflect.apply(isAdult, user2, [])}`
    );
    // ### call
    // funcObject.call(obj, arg1, arg2, ...)
    console.log(`isAdult.call(user1): ${isAdult.call(user1)}`);
    // ### bind
    const boundIsAdult = isAdult.bind(user1);
    console.log(`boundIsAdult: ${boundIsAdult()}`);
    console.log(`boundIsAdult.call(user2): ${boundIsAdult.call(user2)}`); // this が固定されているので user2.age を参照しない
  }

  // # 例外処理
  namespace Chapter5_5 {
    // ## try-catch 文
    function someFunction() {
      try {
        console.log('エラーを発生させます');
        throwError();
        console.log('エラー発生後の処理２です');
      } catch (error) {
        console.log(error);
      }
    }

    function throwError() {
      const error = new Error('エラーが発生しました');
      throw error; // ここで以降の処理を全てスキップして catch ブロックに処理を移動する = 大域脱出
      console.log('エラー発生後の処理１です');
    }
    someFunction();

    // 各所で発生したエラーを一箇所でまとめて例外処理をしたい場合には「大域脱出」を用いると良い
    // 各所で個別で例外処理を行いたい場合にはある関数では例外処理を行わずに例外としての値(ex: undefined)を返し、
    // しかるべき場所で値のチェックをして例外処理を行うなどをすると良い
    // 筆者曰く、typescript 的には例外で保続したエラー(catch のブロック変数)は unknown 型になり、そこからの処理が面倒になるので基本的には例外としての値を返す側が推奨されるとのこと

    // ## finally
    // try 内での処理が成功しても失敗しても実行する処理
    // try しても catch を指定しない場合はさらに上位レイヤーの catch 分まで脱出をはかる
    // この際の脱出の途中で何か処理を発生させたい場合に finally は有用
    // 例外処理は上位レイヤーに任せて、あるレイヤーで独立的に try の中の処理をロールバックしたいときなどに使えそう
    function someFunction2() {
      try {
        console.log('someFunction2 before error');
        someFunction3();
        console.log('someFunction2 after error');
      } catch (error) {
        console.log(error);
      } finally {
        console.log('someFunction2 after error on finally block');
      }
    }

    function someFunction3() {
      try {
        console.log('someFunction3 before error');
        throwError();
        console.log('someFunction3 after error');
      } finally {
        // catch しないのでここの処理を実行して上位レイヤーに脱出する
        console.log('someFunction3 after error on finally block');
      }
    }
    someFunction2();

    // finally は return に対しても同様の処理となる
    function someFunction4() {
      try {
        return 'some value';
      } finally {
        console.log('some process after returning some value');
      }
    }
    console.log(someFunction4());

    // throw はErrorオブジェクト以外にも投げることが可能
    // とはいえ基本的には Error オブジェクトのみを投げる方が例外の例外が発生したりというのを防げたりと何かと良さそう
    // ちなみに react で Promise オブジェクトを throw することで大域脱出をはかるということが行われているらしい
  }

  // # 力試し
  namespace Chapter5_6 {
    // 5.6.1
    class User {
      readonly name: string;
      readonly age: number;

      constructor(name: string, age: number) {
        if (name === '') {
          throw new Error('名前に空欄は使用できません！');
        }
        this.name = name;
        this.age = age;
      }

      public getMessage(message: string): string {
        return `${this.name} (${this.age}) 「${message}」`;
      }
    }

    try {
      const user1 = new User('', 26);
    } catch (error) {
      console.log(error);
    }
    const user2 = new User('taro', 26);
    console.log(user2.getMessage('こんにちは'));

    // 5.6.3
    function createUser(name: string, age: number) {
      return (message: string) => `${name} (${age}) 「${message}」`;
    }
    const getMessage2 = createUser('jiro', 32);
    console.log(getMessage2('おはよう'));
  }
}
