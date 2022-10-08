import { track, trigger } from "./effect";

const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);

export function createGetter(isReadonly = false) {
  return function get(target, key) {
      const res = Reflect.get(target, key);
      
      if (!isReadonly) {
        // 依赖收集
        track(target, key);
      }
      return res;
  }
}

export function createSetter() {
  return function set(target, key, value) {
    const res = Reflect.set(target, key, value);
    // 依赖触发
    trigger(target, key);
    return res;
  }
}

export const mutableHandlers = {
  get,
  set,
}

export const readonlyHandlers = {
  get: readonlyGet,
  set(target, key, vlaue) {
    return true;
  }
}
