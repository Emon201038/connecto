import { UAParser } from "ua-parser-js";

export const parseUserAgent = (ua: string) => {
  const parser = UAParser(ua);
  const res = parser;

  return {
    os: res.os.name ? `${res.os.name} ${res.os.version || ""}` : "Unknown",
    browser: res.browser.name
      ? `${res.browser.name} ${res.browser.version || ""}`
      : "Unknown",
    deviceType: res.device.type || "Desktop",
    userAgent: ua,
  };
};
