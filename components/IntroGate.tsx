'use client';

import { useState, useSyncExternalStore } from 'react';
import IntroLoader from './IntroLoader';

// sessionStorage = once per tab/session, which is friendlier for testing
// and for recruiters who close + reopen the tab.
const KEY = 'portfolio_intro_seen';

const seenThisSession = () => {
  try {
    return window.sessionStorage.getItem(KEY) === '1';
  } catch {
    return false;
  }
};
const noSubscription = () => () => {};

export default function IntroGate() {
  // The server render shows the loader, so the page never flashes before it.
  // On the client, returning visitors skip it straight away.
  const seen = useSyncExternalStore(noSubscription, seenThisSession, () => false);
  const [done, setDone] = useState(false);

  if (seen || done) return null;

  return (
    <IntroLoader
      onComplete={() => {
        try {
          window.sessionStorage.setItem(KEY, '1');
        } catch {}
        setDone(true);
      }}
    />
  );
}
