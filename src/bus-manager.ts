import { Bus } from './bus';
import { IBusMessage } from './bus-message';
import { BusSubscriber } from './bus-subscriber';

// tslint:disable:no-unnecessary-class
export class BusManager {
  // the channel, which receives all messages
  public static readonly ALL_CHANNEL = '*';
  private static busses: { [k: string]: (Bus | undefined) } = { };

  private static registerBus(channel: string): Bus {
    const bus = new Bus(channel);
    BusManager.busses[channel] = bus;

    return bus;
  }

  public static getChannelBus(channel: string): (Bus | undefined) {
    return BusManager.busses[channel];
  }

  public static getChannelBusOrCreate(channel: string): Bus {
    const bus = BusManager.busses[channel];
    if (bus === undefined) {
      return BusManager.registerBus(channel);
    }

    return bus;
  }

  public static channel(channel: string): Bus {
    return BusManager.getChannelBusOrCreate(channel);
  }

  public static channelAll(): Bus {
    return BusManager.channel(BusManager.ALL_CHANNEL);
  }

  public static subscribe(
    subscriber: BusSubscriber,
    channel: string = BusManager.ALL_CHANNEL
  ) {
    const bus = BusManager.channel(channel);
    if (subscriber) {
      bus.subscribe(subscriber);
    }
  }

  public static unsubscribe(
    subscriber: BusSubscriber,
    channel: string = BusManager.ALL_CHANNEL
  ) {
    const bus = BusManager.channel(channel);
    if (subscriber) {
      bus.unsubscribe(subscriber);
    }
  }

  public static publish(message: IBusMessage) {
    if (message.channel) {
      BusManager
        .channel(message.channel)
        .publish(message);
    }
    BusManager
      .channel(BusManager.ALL_CHANNEL)
      .publish(message);
  }
}
