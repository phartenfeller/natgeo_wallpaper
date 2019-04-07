export interface Sizes {
  320: string;
  1600: string;
  640: string;
  2048: string;
  500: string;
  1024: string;
  800: string;
  240: string;
}

export interface Social {
  'og:title': string;
  'og:description': string;
  'twitter:site': string;
}

export interface Item {
  title: string;
  caption: string;
  credit: string;
  profileUrl: string;
  altText: string;
  'full-path-url': string;
  url: string;
  originalUrl: string;
  aspectRatio: number;
  sizes: Sizes;
  internal: boolean;
  pageUrl: string;
  publishDate: string;
  yourShot: boolean;
  social: Social;
}

export interface NatGeoResponse {
  galleryTitle: string;
  previousEndpoint: string;
  items: Item[];
}
