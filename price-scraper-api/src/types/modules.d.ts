declare module "puppeteer-extra-plugin-stealth" {
  const plugin: () => any;
  export default plugin;
}

declare module "puppeteer-extra" {
  export function addExtra(vanilla: any): any;
}

declare module "puppeteer-core" {
  export interface Browser {
    newPage(): Promise<any>;
    close(): Promise<void>;
    on(event: string, handler: (...args: any[]) => void): void;
    [key: string]: any;
  }
  const puppeteer: any;
  export default puppeteer;
}
