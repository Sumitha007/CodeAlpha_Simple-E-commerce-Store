import { getUser } from "@/lib/authStore";

const TRACK_URL = "http://localhost:5000/api/analytics/track";
const FLUSH_INTERVAL_MS = 30_000;

let started = false;
let sessionStart = Date.now();
let activeSecondsBuffer = 0;
let intervalId: number | null = null;

function getLeadSourceFromStorage(): string {
  const existing = localStorage.getItem("lead_source");
  if (existing) return existing;

  const source = document.referrer ? "referral" : "direct";
  localStorage.setItem("lead_source", source);
  return source;
}

async function flushActivity() {
  const user = getUser();
  if (!user || activeSecondsBuffer <= 0) return;

  const payload = {
    email: user.email,
    sessionSeconds: Math.round(activeSecondsBuffer),
    leadSource: getLeadSourceFromStorage()
  };

  activeSecondsBuffer = 0;

  try {
    await fetch(TRACK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true
    });
  } catch {
    // Swallow tracking failures so UX is never blocked.
  }
}

function updateActiveTime() {
  const now = Date.now();
  const deltaSeconds = (now - sessionStart) / 1000;
  sessionStart = now;

  if (document.visibilityState === "visible") {
    activeSecondsBuffer += deltaSeconds;
  }
}

export function startUserActivityTracking() {
  if (started) return;
  started = true;
  sessionStart = Date.now();

  const onVisibilityChange = () => {
    updateActiveTime();
    if (document.visibilityState === "hidden") {
      void flushActivity();
    }
  };

  const onBeforeUnload = () => {
    updateActiveTime();

    const user = getUser();
    if (!user || activeSecondsBuffer <= 0) return;

    const payload = JSON.stringify({
      email: user.email,
      sessionSeconds: Math.round(activeSecondsBuffer),
      leadSource: getLeadSourceFromStorage()
    });

    if (navigator.sendBeacon) {
      const blob = new Blob([payload], { type: "application/json" });
      navigator.sendBeacon(TRACK_URL, blob);
      activeSecondsBuffer = 0;
      return;
    }

    void flushActivity();
  };

  document.addEventListener("visibilitychange", onVisibilityChange);
  window.addEventListener("beforeunload", onBeforeUnload);

  intervalId = window.setInterval(() => {
    updateActiveTime();
    void flushActivity();
  }, FLUSH_INTERVAL_MS);
}

export function stopUserActivityTracking() {
  if (!started) return;
  started = false;

  if (intervalId !== null) {
    window.clearInterval(intervalId);
    intervalId = null;
  }

  updateActiveTime();
  void flushActivity();
}
