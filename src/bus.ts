import { IBusMessage } from './bus-message';
import { BusSubscriber } from './bus-subscriber';


export class Bus {
  private subscribers: Array<BusSubscriber> = [];

  constructor(
    private channel?: string
  ) { }

  public getChannel(): string | undefined {
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
}
