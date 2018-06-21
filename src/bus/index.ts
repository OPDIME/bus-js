import IBusMessage from '../bus-message';
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
    this.subscribers.push(subscriber);

    return this;
  }

  public unsubscribe(subscriber: BusSubscriber): Bus {
    const subIndex = this.subscribers.indexOf(subscriber);
    this.subscribers.splice(subIndex, 1);

    return this;
  }

  public publish(message: IBusMessage) {
    for (const subscriber of this.subscribers) {
      subscriber(message);
    }
  }

  private static registerBus(channel: string): Bus {
    const bus = new Bus(channel);
    Bus.busses[channel] = bus;

    return bus;
  }

  public static getChannelBus(channel: string): (Bus | undefined) {
    return Bus.busses[channel];
  }

  public static subscribe(channel: string, subscriber: BusSubscriber) {
    let bus = Bus.getChannelBus(channel);
    if (bus === undefined) {
      bus = Bus.registerBus(channel);
    }
    bus.subscribe(subscriber);
  }

  public static unsubscribe(channel: string, subscriber: BusSubscriber) {
    const bus = Bus.getChannelBus(channel);
    if (bus !== undefined) {
      bus.unsubscribe(subscriber);
    }
  }

  public static publish(message: IBusMessage) {
    const bus = Bus.getChannelBus(message.channel);
    if (bus) {
      bus.publish(message);
    }
  }
}
