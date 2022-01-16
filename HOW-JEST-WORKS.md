# How Jest is working behind the scenes

TBD: Table of content

I will do my best to explain these 3 topics:

- jest global object
- jest hoisting
- How mocking in Jest works - jest dependency tree

## Architecture

[architecture](https://jestjs.io/docs/architecture)

## How mocking in Jest works

Inspired a lot from [Rick Hanlon II](https://medium.com/@rickhanlonii/understanding-jest-mocks-f0046c68e53c) blog post.

Mocking is a technique to isolate test subjects by replacing dependencies with objects that you can control and inspect. A dependency can be anything your subject depends on, but it is typically a module that the subject imports.

### The Mock Function

The goal for mocking is to replace something we don’t control with something we do, so it’s important that what we replace it with has all the features we need.

#### The Mock Function provides features to

- Capture calls
- Set return values
- Change the implementation

The simplest way to create a Mock Function instance is with jest.fn().
With this and Jest Expect, it’s easy to test the captured calls:

```javascript
test("returns undefined by default", () => {
  const mock = jest.fn();

  let result = mock("foo");

  expect(result).toBeUndefined();
  expect(mock).toHaveBeenCalled();
  expect(mock).toHaveBeenCalledTimes(1);
  expect(mock).toHaveBeenCalledWith("foo");
});
```

and we can change the return value, implementation, or promise resolution:

```javascript
test("mock implementation", () => {
  const mock = jest.fn(() => "bar");

  expect(mock("foo")).toBe("bar");
  expect(mock).toHaveBeenCalledWith("foo");
});

test("also mock implementation", () => {
  const mock = jest.fn().mockImplementation(() => "bar");

  expect(mock("foo")).toBe("bar");
  expect(mock).toHaveBeenCalledWith("foo");
});

test("mock implementation one time", () => {
  const mock = jest.fn().mockImplementationOnce(() => "bar");

  expect(mock("foo")).toBe("bar");
  expect(mock).toHaveBeenCalledWith("foo");

  expect(mock("baz")).toBe(undefined);
  expect(mock).toHaveBeenCalledWith("baz");
});

test("mock return value", () => {
  const mock = jest.fn();
  mock.mockReturnValue("bar");

  expect(mock("foo")).toBe("bar");
  expect(mock).toHaveBeenCalledWith("foo");
});

test("mock promise resolution", () => {
  const mock = jest.fn();
  mock.mockResolvedValue("bar");

  expect(mock("foo")).resolves.toBe("bar");
  expect(mock).toHaveBeenCalledWith("foo");
});
```

Now that we covered what the Mock Function is, and what you can do with it, let’s go into ways to use it.

### Dependency Injection

One of the common ways to use the Mock Function is by passing it directly as an argument to the function you are testing. This allows you to run your test subject, then assert how the mock was called and with what arguments:

```javascript
const doAdd = (a, b, callback) => {
  callback(a + b);
};

test("calls callback with arguments added", () => {
  const mockCallback = jest.fn();
  doAdd(1, 2, mockCallback);
  expect(mockCallback).toHaveBeenCalledWith(3);
});
```

This strategy is solid, but it requires that your code supports dependency injection. Often that is not the case, so we will need tools to mock existing modules and functions instead.

### Mocking Modules and Functions

There are three main types of module and function mocking in Jest:

- jest.fn: Mock a function
- jest.mock: Mock a module
- jest.spyOn: Spy or mock a function

Each of these will, in some way, create the Mock Function. To explain how each of these does that, consider this project structure:

```folder
├ example/
| └── app.js
| └── app.test.js
| └── math.js
```

In this setup, it is common to test app.js and want to either not call the actual math.js functions, or spy them to make sure they’re called as expected. This example is trite, but imagine that math.js is a complex computation or requires some IO you want to avoid making:

```javascript
// math.js
export const add      = (a, b) => a + b;
export const subtract = (a, b) => b - a;
export const multiply = (a, b) => a * b;
export const divide   = (a, b) => b / a;
```

```javascript
// app.js
import * as math from './math.js';

export const doAdd      = (a, b) => math.add(a, b);
export const doSubtract = (a, b) => math.subtract(a, b);
export const doMultiply = (a, b) => math.multiply(a, b);
export const doDivide   = (a, b) => math.divide(a, b);
```

### Mock a function with jest.fn

The most basic strategy for mocking is to reassign a function to the Mock Function. Then, anywhere the reassigned functions are used, the mock will be called instead of the original function:

```javascript
import * as app from "./app";
import * as math from "./math";

math.add = jest.fn();
math.subtract = jest.fn();

test("calls math.add", () => {
  app.doAdd(1, 2);
  expect(math.add).toHaveBeenCalledWith(1, 2);
});

test("calls math.subtract", () => {
  app.doSubtract(1, 2);
  expect(math.subtract).toHaveBeenCalledWith(1, 2);
});
```

This type of mocking is less common for a couple reasons:

- jest.mock does this automatically for all functions in a module
- jest.spyOn does the same thing but allows restoring the original function

### Mock a module with `jest.mock`

A more common approach is to use jest.mock to automatically set all exports of a module to the Mock Function. So, calling `jest.mock('./math.js');` essentially sets math.js to:

```javascript
export const add      = jest.fn();
export const subtract = jest.fn();
export const multiply = jest.fn();
export const divide   = jest.fn();
```

From here, we can use any of the above features of the Mock Function for all of the exports of the module:

```javascript
// mock_jest_mock
import * as app from "./app";
import * as math from "./math";

// Set all module functions to jest.fn
jest.mock("./math.js");

test("calls math.add", () => {
  app.doAdd(1, 2);
  expect(math.add).toHaveBeenCalledWith(1, 2);
});

test("calls math.subtract", () => {
  app.doSubtract(1, 2);
  expect(math.subtract).toHaveBeenCalledWith(1, 2);
});
```

This is the easiest and most common form of mocking (and is the type of mocking Jest does for you with `automock: true`).

The only disadvantage of this strategy is that it’s difficult to access the original implementation of the module. For those use cases, you can use spyOn.

Spy or mock a function with `jest.spyOn`
Sometimes you only want to watch a method be called, but keep the original implementation. Other times you may want to mock the implementation, but restore the original later in the suite.

In these cases, you can use `jest.spyOn`.

Here we simply “spy” calls to the math function, but leave the original implementation in place:

```javascript
// mock_jest_spyOn
import * as app from "./app";
import * as math from "./math";

test("calls math.add", () => {
  const addMock = jest.spyOn(math, "add");

  // calls the original implementation
  expect(app.doAdd(1, 2)).toEqual(3);

  // and the spy stores the calls to add
  expect(addMock).toHaveBeenCalledWith(1, 2);
});
```

This is useful in a number of scenarios where you want to assert that certain side-effects happen without actually replacing them.

In other cases, you may want to mock a function, but then restore the original implementation:

```javascript
import * as app from "./app";
import * as math from "./math";

test("calls math.add", () => {
  const addMock = jest.spyOn(math, "add");

  // override the implementation
  addMock.mockImplementation(() => "mock");
  expect(app.doAdd(1, 2)).toEqual("mock");

  // restore the original implementation
  addMock.mockRestore();
  expect(app.doAdd(1, 2)).toEqual(3);
});
```

This is useful for tests within the same file, but unnecessary to do in an afterAll hook since each test file in Jest is sandboxed.

The key thing to remember about `jest.spyOn` is that it is just sugar for the basic `jest.fn()` usage. We can achieve the same goal by storing the original implementation, setting the mock implementation to to original, and re-assigning the original later:

```javascript
import * as app from "./app";
import * as math from "./math";

test("calls math.add", () => {
  // store the original implementation
  const originalAdd = math.add;

  // mock add with the original implementation
  math.add = jest.fn(originalAdd);

  // spy the calls to add
  expect(app.doAdd(1, 2)).toEqual(3);
  expect(math.add).toHaveBeenCalledWith(1, 2);

  // override the implementation
  math.add.mockImplementation(() => "mock");
  expect(app.doAdd(1, 2)).toEqual("mock");
  expect(math.add).toHaveBeenCalledWith(1, 2);

  // restore the original implementation
  math.add = originalAdd;
  expect(app.doAdd(1, 2)).toEqual(3);
});
```

In fact, this is exactly how jest.spyOn is [implemented](https://github.com/facebook/jest/blob/e9aa321e0587d0990bd2b5ca5065e84a1aecb2fa/packages/jest-mock/src/index.js#L674-L708).

## Jest globals

### [Globals](https://jestjs.io/docs/api#methods)

In your test files, Jest puts each of these methods and objects into the global environment. You don't have to require or import anything to use them. However, if you prefer explicit imports, you can do `import {describe, expect, test} from '@jest/globals'`.

## Jest hoisting

When using `babel-jest`, calls to mock will automatically be hoisted to the top of the code block. Use this method if you want to explicitly avoid this behavior.

### [Mock Modules](https://jestjs.io/docs/jest-object#jestmockmodulename-factory-options)

### [Hoisting](https://jestjs.io/docs/manual-mocks#using-with-es-module-imports)

---

### jest.mock(moduleName, factory, options)

Mocks a module with an auto-mocked version when it is being required. factory and options are optional. For example:

```javascript
// banana.js
module.exports = () => 'banana';
```

```javascript
__tests__/test.js
jest.mock('../banana');

const banana = require('../banana'); // banana will be explicitly mocked.

banana(); // will return 'undefined' because the function is auto-mocked.
```

The second argument can be used to specify an explicit module factory that is being run instead of using Jest's automocking feature:

```javascript
jest.mock('../moduleName', () => {
  return jest.fn(() => 42);
});

// This runs the function specified as second argument to `jest.mock`.
const moduleName = require('../moduleName');
moduleName(); // Will return '42';
```

When using the `factory` parameter for an ES6 module with a default export, the `__esModule: true` property needs to be specified. This property is normally generated by Babel / TypeScript, but here it needs to be set manually. When importing a default export, it's an instruction to import the property named `default` from the export object:

```javascript
import moduleName, {foo} from '../moduleName';

jest.mock('../moduleName', () => {
  return {
    __esModule: true,
    default: jest.fn(() => 42),
    foo: jest.fn(() => 43),
  };
});

moduleName(); // Will return 42
foo(); // Will return 43
```

The third argument can be used to create virtual mocks – mocks of modules that don't exist anywhere in the system:

```javascript
jest.mock(
  '../moduleName',
  () => {
    /*
     * Custom implementation of a module that doesn't exist in JS,
     * like a generated module or a native module in react-native.
     */
  },
  {virtual: true},
);
```

**Warning**: Importing a module in a setup file (as specified by `setupFilesAfterEnv`) will prevent mocking for the module in question, as well as all the modules that it imports.

Modules that are mocked with `jest.mock` are mocked only for the file that calls `jest.mock`. Another file that imports the module will get the original implementation even if it runs after the test file that mocks the module.

Returns the `jest` object for chaining.

### jest.unmock(moduleName)

Indicates that the module system should never return a mocked version of the specified module from `require()` (e.g. that it should always return the real module).

The most common use of this API is for specifying the module a given test intends to be testing (and thus doesn't want automatically mocked).

Returns the `jest` object for chaining.

### jest.doMock(moduleName, factory, options)

When using `babel-jest`, calls to mock will automatically be hoisted to the top of the code block. Use this method if you want to explicitly avoid this behavior.

One example when this is useful is when you want to mock a module differently within the same file:

```javascript
beforeEach(() => {
  jest.resetModules();
});

test('moduleName 1', () => {
  jest.doMock('../moduleName', () => {
    return jest.fn(() => 1);
  });
  const moduleName = require('../moduleName');
  expect(moduleName()).toEqual(1);
});

test('moduleName 2', () => {
  jest.doMock('../moduleName', () => {
    return jest.fn(() => 2);
  });
  const moduleName = require('../moduleName');
  expect(moduleName()).toEqual(2);
});
```

---

### jest.dontMock(moduleName)

When using babel-jest, calls to unmock will automatically be hoisted to the top of the code block. Use this method if you want to explicitly avoid this behavior.

Returns the jest object for chaining

---

### jest.requireActual(moduleName)

Returns the actual module instead of a mock, bypassing all checks on whether the module should receive a mock implementation or not.

Example:

```javascript
jest.mock('../myModule', () => {
  // Require the original module to not be mocked...
  const originalModule = jest.requireActual('../myModule');

  return {
    __esModule: true, // Use it when dealing with esModules
    ...originalModule,
    getRandom: jest.fn().mockReturnValue(10),
  };
});

const getRandom = require('../myModule').getRandom;

getRandom(); // Always returns 10
```

---

### jest.requireMock(moduleName)

Returns a mock module instead of the actual module, bypassing all checks on whether the module should be required normally or not

---

### jest.resetModules()

Resets the module registry - the cache of all required modules. This is useful to isolate modules where local state might conflict between tests.

Example:

```javascript
const sum1 = require('../sum');
jest.resetModules();
const sum2 = require('../sum');
sum1 === sum2;
// > false (Both sum modules are separate "instances" of the sum module.)
Example in a test:

beforeEach(() => {
  jest.resetModules();
});

test('works', () => {
  const sum = require('../sum');
});

test('works too', () => {
  const sum = require('../sum');
  // sum is a different copy of the sum module from the previous test.
});```

Returns the jest object for chaining.
