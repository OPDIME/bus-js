import { IBusMessage } from '../bus-message';
import { BusSubscriber } from '../bus-subscriber';

export class Bus {
  private static busses: { [k: string]: (Bus | undefined) } = { };
  private subscribers: Array<BusSubscriber> = [];

  constructor(
    private channel: string
  ) { }

  public getChannel(): string {
    return this.channel;
  }

  public subscribe(subscriber: BusSubscriber): Bus {
    if (!this.subscribers.includes(subscriber)) {
      this.subscribers.push(subscriber);
    }

    return this;
  }

  public unsubscribe(subscriber: BusSubscriber): Bus {
    const subIndex = this.subscribers.indexOf(subscriber);
    this.subscribers.splice(subIndex, 1);

    return this;
  }

  public publish(message: IBusMessage): Bus {
    for (const subscriber of this.subscribers) {
      subscriber(message);
    }

    return this;
  }

  private static registerBus(channel: string): Bus {
    const bus = new Bus(channel);
    Bus.busses[channel] = bus;

    return bus;
  }

  public static getChannelBus(channel: string): (Bus | undefined) {
    return Bus.busses[channel];
  }

  public static getChannelBusOrCreate(channel: string): Bus {
    const bus = Bus.busses[channel];
    if (bus === undefined) {
      return Bus.registerBus(channel);
    }

    return bus;
  }

  public static channel(channel: string): Bus {
    return Bus.getChannelBusOrCreate(channel);
  }

  public static subscribe(subscriber: BusSubscriber, channel: string = '*') {
    const bus = Bus.getChannelBusOrCreate(channel);
    if (subscriber) {
      bus.subscribe(subscriber);
    }
  }

  public static unsubscribe(subscriber: BusSubscriber, channel: string = '*') {
    const bus = Bus.getChannelBusOrCreate(channel);
    if (subscriber) {
      bus.unsubscribe(subscriber);
    }
  }

  public static publish(message: IBusMessage) {
    const bus = Bus.getChannelBusOrCreate(message.channel);
    bus.publish(message);
  }
}
