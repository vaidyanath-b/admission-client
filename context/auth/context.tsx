import { AxiosInstance } from "axios";
import { createContext } from "react";

interface IAuthContext {
    axiosPriv:AxiosInstance | null;
    user :{
        id: string;
        applicantId: string;
        email: string;
        name: string;
        role: string;
    } | null;
    authLoading: boolean;
    accessToken: string;
    setUser : (user: any) => void;
}
export const AuthContext = createContext<IAuthContext|null>(null);