import { AxiosInstance } from "axios";
import { createContext } from "react";

interface IAuthContext {
    user :any;
    authLoading: boolean;
    setUser : (user: any) => void;
    role:string
}
export const AuthContext = createContext<IAuthContext|null>(null);