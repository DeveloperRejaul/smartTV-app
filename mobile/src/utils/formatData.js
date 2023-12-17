const Format = () => ({
  slideData: (d) => ({ id: d?._id, layout: d?.layout || '', src: d?.src || '', type: d?.type || '', dateRange: d?.dateRange || '', days: d?.days || '', audio: d?.audioSrc || '', startTime: d?.startTime || '', slideType: d?.slideType || '', eventName: d?.eventName || '' }),
});

export const format = Format();
