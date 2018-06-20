export default class BusMessage {
  constructor(
    public channel: string,
    public payload: any
  ) { }
}
