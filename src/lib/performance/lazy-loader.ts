export const lazyLoad = (importFn: () => Promise<any>) => {
  return React.lazy(importFn);
};
