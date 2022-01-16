# Jest workshop

Hi, I created this repo to help developers to fully understand how Jest is working and give examples of common scenarios so it will become really straightforward to test easily.

Personally I use Jest because it is the most popular framework today over the JS/TS eco-system, developed and maintain by FB and also, I just love its interface.

On this repository I will discuss these topics:

- [How Jest Works](HOW-JEST-WORKS.md)
- [Jest setup for JS](./javascript/jest.config.js)
- [Jest setup for TS](./typescript/jest.config.js)
- Give common scenarios
  1. business-logic/pure-logic/helper-functions you name it, the bottom line is logic that is happening in your code internally, without calling any external component.
  2. Mock DB - I will give examples with MongoDB.
  3. Mock request to external service/API, I will use axios.
