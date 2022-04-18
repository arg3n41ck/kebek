export interface IProductV2 {
  id: number;
  type: {
    id: number;
    title_ru: string;
    title_kk: string;
  };
  price: number;
  min_limit: number;
  max_limit: number;
  residue: number;
  image: string;
  elevator: IProductProviderV2;
  quantity: number;
  checked: boolean
}

export interface FetchFiltersDto {
  elevatorRegionId?: string;
  typeId?: number;
  elevatorCityId?: number;
}

export interface DeleteSelected {
  id: number;
  checked: boolean;
}

export interface CartItem extends IProductV2 {
  count: number;
}

export interface IProductProviderV2 {
  id: string;
  title_ru: string;
  title_kk: string;
  description_kk: string;
  description_ru: string;
  owner: IOwner;
  address_ru: string;
  address_kk: string;
  phone_number: string;
  logo: string;
  email: string;
  website: string;
  bin: string;
  checking_account: string;
  railway_station: IRailwayStation;
  cities: ICity[];
  slug?: string;
}

export interface IRailwayStation {
  code: string;
  description_kk: string;
  description_ru: string;
  title_kk: string;
  title_ru: string;
}

export interface ICity {
  id: number;
  title_kk: string;
  title_ru: string;
  district: IDistrict;
}

export interface IDistrict {
  id: number;
  title_kk: string;
  title_ru: string;
}

export interface IOwner {
  id: string;
  username: string;
  first_name: string;
}

export interface IProductPagination {
  value?: number;
}

export interface IProductPolicy {
  id: number;
  title: string;
  content: string;
}
