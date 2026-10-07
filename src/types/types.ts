
export interface CustomerType{
    code: string;
    fullname: string;
    email: string;
    delivery_address: string;
    contact: string;
    region: string;
    city: string;
    createdAt: string;
    updatedAt: string;
}

export interface CustomerResponseType{
    message: string;
    status: number;
    data: CustomerType[]
}

interface DesignType{
    name: string;
    description: string;
    previewimg: string;
    createdAt: string;
    updatedAt: string;
}

interface OrderItemVariationType{
    color: string;
    size: string;
    quantity: number;
}
interface OrderItemsType{
    id: string;
    amount: number;
    product_name: string;
    product_description: string;
    quantity: number;
    product_previmg: string;
    total: number;
    design: DesignType;
    color: string;
    size: string;
    orderItemVariation: OrderItemVariationType;

}
export interface OrderType{
    trck_no: string;
    id: string;
    customer: CustomerType;
    customer_email: string;
    product_name: string;
    quantity: number;
    total_price: number;
    status: string;
    orderItems: OrderItemsType[];
    delivery_date: string;
    createdAt: string;
    updatedAt: string;
}

export interface DesignerType {
    id: string;
    brand_name: string;
    brand_email: string;
    brand_phone: string;
    brand_profile_img?: string;
    pitch: string;
    address: string;
    social_fb?: string;
    social_tw?: string;
    social_yt?: string;
    social_tk?: string;
    social_ig?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface DesignerResponseType {
    status: boolean;
    data: DesignerType;
}

export interface ProfileDesignType {
    id: string;
    name: string;
    description: string;
    previewimg: string;
    price: number;
    isSell: string;
    categories?: { id: string; name: string } | null;
    collection?: { id: string; name: string } | null;
    createdAt?: string;
}
