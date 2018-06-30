# Bus-JS
---
Bus-JS is a simple library which offers a simple implementation of an event bus to structure your code around the publish-subscribe pattern.
The following code snippets show, what functionality the library offers, and how it should be used.

### Bus
A `Bus` is an object to which a function may subscribe, unsubscribe, and which can publish data to its subscribers. So, the usage of a `Bus` may look as follows:
```javascript
const { Bus } = require('@opdime/bus');

const bus = new Bus();

function someSubscriber(message) {
  console.log('bus-message payload:', message.payload);
}

bus.subscribe(someSubscriber);

bus.publish({
  payload: 'a bus message!'
});
```

A `Bus` subscriber will receive an `IBusMessage` as its first argument. Such a message consists of a `payload` and an optional `channel`. The exact TypeScript definition of an `IBusMessage` object looks as follows:

```typescript
export interface IBusMessage {
  readonly channel?: string;
  readonly payload: any;
}
```

The `publish` method of the `Bus` expects an `IBusMessage` to be passed as its only argument. That exact message is then going to be passed to each of the subscribers of the `Bus`. Note that you should not modify the message, because it is going to be the same referenced object for each subscriber!

Each of the methods of a `Bus` returns the instance on which the method has been called. This enables you to set up a multitude of subscribers for a `Bus` in one chained call.

### BusManager
The `BusManager` makes it easy to use multiple `Bus`es in your application which are bound to specific channels.

##### `BusManager.getChannelBus(channel)`
With this method, the `BusManager` will may the `Bus` which has been created for this channel. Note that this function potentially return undefined if no bus is registered on the given channel!

##### `BusManager.channel(channel)`
This method guarantees to return a `Bus`. In case you want to get the `Bus` of a channel which has not been registered, it will be created.

##### `BusManager.publish(message)`
This method accepts an object which implements the interface `IBusMessage`. The provided message is going to be sent to each of the global subscribers. In case a channel has been defined in the message, that provided channel bus will then send the message on to its subscribers.