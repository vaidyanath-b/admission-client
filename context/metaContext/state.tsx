"use client"
import { useContext, useEffect, useState } from "react";
import { MetaContext } from "./context";
import { IMetaContext } from "./context";
import { AuthContext } from "../auth/context";
import getUserSession from "@/lib/actions";
import axios from "axios";
import { apiUrl } from "@/lib/env";
import { Spinner } from "@nextui-org/react";

export default function MetaState({ children }: { children: any }) {
    const [phases, setPhases] = useState<IMetaContext["phases"]>([]);
    const [documents, setDocuments] = useState<IMetaContext["documents"]>([]);
    const [phaseDocuments, setPhaseDocuments] = useState<IMetaContext["phaseDocuments"]>([]);
    const [metaLoading, setMetaLoading] = useState(true);

    useEffect(() => {
        console.log("metaState");
        async function getMetaData() {
            setMetaLoading(true);
            console.log("meta loading true")
            try{
            const {accessToken} = await getUserSession();
            if (!accessToken) {
                setMetaLoading(false)
                return;
            }
            const response = await axios.get(`${apiUrl}/api/meta`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "content-type": "application/json",
                },
            });
            console.log(response.data);
            setPhases(response.data.phases);
            setDocuments(response.data.documentTypes);
            setPhaseDocuments(response.data.phaseDocuments);
            setMetaLoading(false);
        }
        catch(err){
            console.log(err);
            setMetaLoading(false);
        }
    }
        getMetaData();
    } , []);
    return (
        metaLoading ? <Spinner className="h-screen w-full self-center m-auto" color="success" />:
        <MetaContext.Provider value={{ loading:metaLoading,phases, documents, phaseDocuments , setPhases , setDocuments , setPhaseDocuments }}>
            {children}
        </MetaContext.Provider>
    );
}