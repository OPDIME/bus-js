import { Bus } from './bus';
import { IBusMessage } from './bus-message';
import { BusSubscriber } from './bus-subscriber';

// tslint:disable:no-unnecessary-class
export class BusManager {
  // the channel, which receives all messages
  public static readonly ALL_CHANNEL = '*';
  private static busses: { [k: string]: (Bus | undefined) } = { };

  /**
   * Register a bus for a channel.
   * This may overwrite an existing channel bus!
   */
  private static registerBus(channel: string): Bus {
    const bus = new Bus(channel);
    BusManager.busses[channel] = bus;

    return bus;
  }

  /**
   * Returns the bus which belongs to the given channel.
   * May return undefined if the channel has no bus!
   */
  public static getChannelBus(channel: string): (Bus | undefined) {
    return BusManager.busses[channel];
  }

  /**
   * Returns the bus which belongs to the given channel.
   * May create the channel bus if it does not exist.
   */
  public static getChannelBusOrCreate(channel: string): Bus {
    const bus = BusManager.busses[channel];
    if (bus === undefined) {
      return BusManager.registerBus(channel);
    }

    return bus;
  }

  /**
   * Returns the bus which belongs to the given channel.
   * May create the channel bus if it does not exist.
   *
   * Alias for getChannelBusOrCreate.
   */
  public static channel(channel: string): Bus {
    return BusManager.getChannelBusOrCreate(channel);
  }

  /**
   * Returns the all channel.
   */
  public static channelAll(): Bus {
    return BusManager.channel(BusManager.ALL_CHANNEL);
  }

  /**
   * Subscribe to the global channel or a specified channel.
   */
  public static subscribe(
    subscriber: BusSubscriber,
    channel: string = BusManager.ALL_CHANNEL
  ) {
    const bus = BusManager.channel(channel);
    if (subscriber) {
      bus.subscribe(subscriber);
    }
  }

  /**
   * Unsubscribe to the global channel or a specified channel.
   */
  public static unsubscribe(
    subscriber: BusSubscriber,
    channel: string = BusManager.ALL_CHANNEL
  ) {
    const bus = BusManager.channel(channel);
    if (subscriber) {
      bus.unsubscribe(subscriber);
    }
  }

  /**
   * Publish a message to the global bus and the specified bus.
   */
  public static publish(message: IBusMessage) {
    if (message.channel) {
      BusManager
        .channel(message.channel)
        .publish(message);
    }
    BusManager
      .channelAll()
      .publish(message);
  }
}
