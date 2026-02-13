import geoip from "geoip-lite";

export const parseGeoIP = (ip: string) => {
  const geo = geoip.lookup(ip);
  return {
    country: geo?.country || "Unknown",
    city: geo?.city || "Unknown",
    lat: geo?.ll ? geo.ll[0] : null,
    lon: geo?.ll ? geo.ll[1] : null,
  };
};
