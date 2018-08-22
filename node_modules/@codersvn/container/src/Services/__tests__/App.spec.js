import { App } from '../App';
import _ from 'lodash';
import crypto from 'crypto';
import Container from '../Contracts/Container';
class Test {
  test() {
    return true;
  }
}

class Singleton {
  constructor() {
    this.data = [];
  }
  add(d) {
    this.data.push(d);
  }
  get() {
    return this.data;
  }
}

describe('Container', () => {
  it('can hash an class to a string', () => {
    const container = Container.getInstance();
    const data = 'mixed';
    const resolved = container.resolveAbstract(data);
    expect(resolved).toEqual(
      crypto
        .createHash('md5')
        .update(data)
        .digest('hex')
    );
  });

  it('resolveAbstract function should return same result every time', () => {
    const container = Container.getInstance();
    const data = 'mixed';
    const resolved = container.resolveAbstract(data);

    expect(resolved).toEqual(container.resolveAbstract(data));
  });
});

describe('App', () => {
  it('bind function should return an instance of container', () => {
    App.bind('test', Test);
    const container = Container.getInstance();
    expect(_.isArray(container.bindings)).toBeTruthy();
  });

  it('make function should return an correct instance', () => {
    const t = App.make('test');
    expect(t).toBeInstanceOf(Test);
  });

  it('can make a singleton', () => {
    App.singleton(Singleton, Singleton);

    const s1 = App.make(Singleton);
    s1.add('x');
    const s2 = App.make(Singleton);
    s2.add('y');
    expect(s2.get()).toHaveLength(2);
  });
});
