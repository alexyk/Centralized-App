export var isMobileWebView = false;
export function setIsMobileWebView(origin, value) {
  const summary = `${isMobileWebView} -> ${value}`;
  if (isMobileWebView != value) {
    console.info(`[Mobile-Web-View] [${origin}] Setting isMobileWebView: ${summary}`);
    isMobileWebView = value;
  } else {
    console.warn(`[Mobile-Web-View] [${origin}] Trying to set isMobileWebView: ${summary} - resulting in no change of value`);
  }
}
