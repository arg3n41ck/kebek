export interface ProductDetails {
    id: number;
    productImage: string;
    priceForTon: number | string;
    priceForKilo: number;
    title: string;
}



export interface IProduct {
    id: number;
    images: IProductImage[];
    title: string;
    description: string;
    price: number;
    countInStock: number;
    productProvider: IProductProvider;
}

export interface IProductProvider {
    id: number;
    title: string;
    site: string;
    address: string;
    phoneNumber: string;
    //Todo city: 
}

export interface IProductImage {
    id: number;
    image: string;
}
