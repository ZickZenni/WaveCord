export default interface GatewayEvent {
  op: number;
  data: any;
  sequence?: number;
  event?: string;
}
