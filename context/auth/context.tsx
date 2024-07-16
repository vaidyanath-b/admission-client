import { AxiosInstance } from "axios";
import { createContext, SetStateAction } from "react";

interface IAuthContext {
    user :any;
    authLoading: boolean;
    setUser : (user: any) => void;
    role:string;
    setAuthStateChanged:React.Dispatch<SetStateAction<boolean>>;
}
export const AuthContext = createContext<IAuthContext|null>(null);