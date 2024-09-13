export const getDeviceFromUserAgent = (userAgent: string) => {
  const isMobile = /Mobi/i.test(userAgent);
  if (!isMobile) {
    return "desktop";
  }

  const UA = userAgent.toLowerCase();
  if (UA.indexOf("android") > -1) {
    return "android";
  }
  if (
    UA.indexOf("iphone") > -1 ||
    UA.indexOf("ipad") > -1 ||
    UA.indexOf("ipod") > -1
  ) {
    return "iOS";
  }
  return "";
};
