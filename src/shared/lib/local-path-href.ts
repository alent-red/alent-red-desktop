const LOCAL_PATH_SCHEME = 'local-path:';

// Local paths travel through markdown links under a private scheme so the
// link renderer can tell them apart from web URLs.
export const localPathHref = {
  encode: (path: string): string => `${LOCAL_PATH_SCHEME}${encodeURIComponent(path)}`,
  decode: (href: string): string | null =>
    href.startsWith(LOCAL_PATH_SCHEME)
      ? decodeURIComponent(href.slice(LOCAL_PATH_SCHEME.length))
      : null,
};
