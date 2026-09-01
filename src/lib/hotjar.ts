// Hotjar heatmaps & session recordings
export function initHotjar() {
  const id = (import.meta as unknown as { env: Record<string, string> }).env?.VITE_HOTJAR_ID;
  if (!id || typeof window === 'undefined') return;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (function (h: any, o: any, t: any, j: any, a?: any, r?: any) {
    h.hj =
      h.hj ||
      function () {
        // eslint-disable-next-line prefer-rest-params
        (h.hj.q = h.hj.q || []).push(arguments);
      };
    h._hjSettings = { hjid: Number(id), hjsv: 6 };
    a = o.getElementsByTagName('head')[0];
    r = o.createElement('script');
    r.async = 1;
    r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
    a.appendChild(r);
  })(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=');
}
