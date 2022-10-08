import { effect, stop } from "../effect";
import { reactive } from "../reactive";

describe("effect", () => {
  it("happy path", () => {
    const user = reactive({
      age: 10
    })
    let nextAge;
    effect(() => {
      nextAge = user.age + 1
    })
    expect(nextAge).toBe(11)

    // update
    user.age++;
    expect(nextAge).toBe(12)
  })

  it("should return runner when call effect", () => {
    let foo = 10;
    const runner = effect(() => {
      foo++;
      return "foo";
    })

    expect(foo).toBe(11)
    const r = runner();
    expect(foo).toBe(12);
    expect(r).toBe("foo");
  })

  it("scheduler", () => {
    // 1. 初始化时，effect执行run
    // 2. 触发trigger的依赖回调时，有scheduler参数的运行scheduler，否则运行run
    let dummy;
    let run: any;
    const scheduler = jest.fn(() => {
      run = runner;
    })
    const obj = reactive({ foo: 1 });
    const runner = effect(
      () => {
        dummy = obj.foo;
      },
      { scheduler }
    )

    expect(scheduler).not.toHaveBeenCalled();
    expect(dummy).toBe(1);
    // should to called on first trigger
    obj.foo++;
    expect(scheduler).toBeCalledTimes(1);
    // should not run yet
    expect(dummy).toBe(1);
    // manually run
    run();
    // should have run
    expect(dummy).toBe(2);
  })

  it("stop", () => {
    let dummy;
    const obj = reactive({ prop: 1 });
    const runner = effect(() => {
      dummy = obj.prop;
    });
    obj.prop = 2;
    expect(dummy).toBe(2);
    stop(runner);
    obj.prop = 3;
    expect(dummy).toBe(2);

    // stopped effect should still be manually called
    runner();
    expect(dummy).toBe(3);
  })
})
