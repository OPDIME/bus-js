import { IBusMessage } from './bus-message';

export type BusSubscriber = (message: IBusMessage) => void;
