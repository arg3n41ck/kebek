import {IProduct, IProductImage} from "../types/ProductDetails"
import faker from "faker"


const generateMockProducts = (n:number):IProduct[] => {
    const mockProducts: IProduct[] = [];
    for (let i = 0; i < n; i++) {

        const images: IProductImage[] = [];

        for (let k = 0; k < faker.datatype.number({min: 2, max: 5}); k++) {
            images.push({
                id: k,
                image: faker.image.food()
            })            
        }

        mockProducts.push({
            id: i,
            title: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
            price: faker.datatype.number({min: 1000, max: 100000}),
            countInStock: faker.datatype.number({min: 0, max: 999}),
            productProvider: {
                id: i,
                title: faker.company.companyName(),
                site: faker.internet.url(),
                address: faker.address.streetAddress(),
                phoneNumber: faker.phone.phoneNumber()
            },
            images,
        })
        
    }

    return mockProducts
}


export const mockProducts = generateMockProducts(100)

