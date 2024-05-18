import "pinia";

declare module "pinia" {
  export interface PiniaCustomProperties {
    router: any;
  }
}
