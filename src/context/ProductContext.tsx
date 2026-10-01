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
  quantity: number;
  bust: string;
  hip: string;
  neck: string;
  sleeve: string;
  waist: string;
  gender: string;
  sizetype: string;
}

export interface OtherImage {
  url: string | File;
  pid?: string;
}
interface CategoryType{
  id: string,
  name: string;
}
export interface DesignType {
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
  sell: "0" | "1";
}

interface DesignContextType {
  design: DesignType;
  addToDesign: (data: Partial<DesignType>) => void;
  removeVariant: (index: number) => void;
}

const DesignContext = createContext<DesignContextType | undefined>(undefined);

interface DesignProviderProps {
  children: ReactNode;
}

export function DesignProvider({ children }: DesignProviderProps) {
  const [design, setDesign] = useState<DesignType>({
    name: "",
    description: "",
    price: 0,
    variations: [],
    previewimg: "",
    otherimages: [],
    category: {id:"", name:""},
    designer_code: "",
    cat_code:"",
    sell: "0",
    code:""

  });

  // Add / update design fields
  const addToDesign = useCallback((data: Partial<DesignType>) => {
    setDesign((prev) => ({
      ...prev,
      ...data,
    }));

  }, []);

  useEffect(()=> {
    console.log(design);
  }, [design]);

  // Remove variant by index
  const removeVariant = useCallback((index: number) => {
    setDesign((prev) => ({
      ...prev,
      variations: prev.variations.filter((_, i) => i !== index),
    }));
  }, []);

  const contextValue = useMemo(
    () => ({ design, addToDesign, removeVariant }),
    [design, addToDesign, removeVariant]
  );

  return (
    <DesignContext.Provider value={contextValue}>
      {children}
    </DesignContext.Provider>
  );
}

// Custom hook
export function useDesignContext(): DesignContextType {
  const ctx = useContext(DesignContext);
  if (!ctx)
    throw new Error(
      "useDesignContext must be used inside DesignProvider"
    );
  return ctx;
}
