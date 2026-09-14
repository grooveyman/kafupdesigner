import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export interface Variation {
  size: string;
  color: string;
  price: number;
  quantity: number;
  bust: string;
  hip: string;
  neck: string;
  sleeve: string;
  waist: string;
  gender: string;
}

export interface OtherImage {
  url: string | File;
  pid?: string;
}
interface CategoryType{
  id: string,
  name: string;
}
export interface ProductType {
  code?: string; 
  name: string;
  description: string;
  price: number;
  variations: Variation[];
  previewimg: string | File;
  otherimages: OtherImage[];
  category: CategoryType;
  designer_code: string;
  cat_code: string;
}

interface ProductContextType {
  product: ProductType;
  addToProduct: (data: Partial<ProductType>) => void;
  removeVariant: (index: number) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

interface ProductProviderProps {
  children: ReactNode;
}

export function ProductProvider({ children }: ProductProviderProps) {
  const [product, setProduct] = useState<ProductType>({
    name: "",
    description: "",
    price: 0,
    variations: [],
    previewimg: "",
    otherimages: [],
    category: {id:"", name:""},
    designer_code: "",
    cat_code:"",
    code:""
    
  });

  // Add / update product fields
  const addToProduct = useCallback((data: Partial<ProductType>) => {
    setProduct((prev) => ({
      ...prev,
      ...data,
    }));
    
  }, []);

  useEffect(()=> {
    console.log(product);
  }, [product]);

  // Remove variant by index
  const removeVariant = useCallback((index: number) => {
    setProduct((prev) => ({
      ...prev,
      variations: prev.variations.filter((_, i) => i !== index),
    }));
  }, []);

  const contextValue = useMemo(
    () => ({ product, addToProduct, removeVariant }),
    [product, addToProduct, removeVariant]
  );

  return (
    <ProductContext.Provider value={contextValue}>
      {children}
    </ProductContext.Provider>
  );
}

// Custom hook
export function useProductContext(): ProductContextType {
  const ctx = useContext(ProductContext);
  if (!ctx)
    throw new Error(
      "useProductContext must be used inside ProductProvider"
    );
  return ctx;
}
