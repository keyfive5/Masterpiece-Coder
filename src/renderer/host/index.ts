import { DesktopBridge } from '../../shared/types';
import { createBrowserHost } from './browser';
import { createDesktopHost } from './desktop';
import { Host } from './types';

declare global {
  interface Window {
    mc?: DesktopBridge;
  }
}

/** One app, two hosts: Electron when the bridge is present, OPFS in a browser. */
export const host: Host = window.mc ? createDesktopHost(window.mc) : createBrowserHost();

export const isWeb = host.kind === 'web';
export type { Host };
