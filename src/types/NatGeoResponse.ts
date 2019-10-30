export interface SourceSystem {
  id: string;
  asset_id: string;
  account?: any;
  asset_external_field_name: string;
}

export interface AssetProvider {
  id: string;
  asset_id: string;
  uri?: any;
}

export interface Rendition {
  width: string;
  uri: string;
  density: string;
  'media-selector': string;
}

export interface Image {
  id: string;
  uri: string;
  title: string;
  caption: string;
  credit: string;
  asset_source?: any;
  alt_text: string;
  aspect_ratio: number;
  height: number;
  width: number;
  source_system: SourceSystem;
  rights_system?: any;
  asset_provider: AssetProvider;
  renditions: Rendition[];
  croppings: any[];
}

export interface Social {
  'og:title': string;
  'og:description': string;
  'twitter:site': string;
}

export interface Item {
  image: Image;
  internal: boolean;
  pageUrl: string;
  publishDate: string;
  social: Social;
}

export interface NatGeoResponse {
  galleryTitle: string;
  previousEndpoint: string;
  items: Item[];
}
