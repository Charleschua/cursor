declare module '@vercel/analytics/next' {
  interface PageViewEvent {
    type: 'pageview';
    url: string;
  }

  interface CustomEvent {
    type: 'event';
    url: string;
  }

  type BeforeSendEvent = PageViewEvent | CustomEvent;
  type Mode = 'auto' | 'development' | 'production';
  type BeforeSend = (event: BeforeSendEvent) => BeforeSendEvent | null;

  export interface AnalyticsProps {
    beforeSend?: BeforeSend;
    debug?: boolean;
    mode?: Mode;
    scriptSrc?: string;
    endpoint?: string;
    dsn?: string;
  }

  type Props = Omit<AnalyticsProps, 'route' | 'disableAutoTrack'>;
  export function Analytics(props?: Props): null;

  export type { BeforeSend, BeforeSendEvent };
}

