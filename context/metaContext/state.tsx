"use client"
import { useContext, useEffect, useState } from "react";
import { MetaContext } from "./context";
import { IMetaContext } from "./context";
import { AuthContext } from "../auth/context";
import getUserSession from "@/lib/actions";
import axios from "axios";

export default function MetaState({ children }: { children: any }) {
    const [phases, setPhases] = useState<IMetaContext["phases"]>([]);
    const [documents, setDocuments] = useState<IMetaContext["documents"]>([]);
    const [phaseDocuments, setPhaseDocuments] = useState<IMetaContext["phaseDocuments"]>([]);
    const [metaLoading, setMetaLoading] = useState(true);

    useEffect(() => {
        async function getMetaData() {
            setMetaLoading(true);
            try{
            const {accessToken} = await getUserSession();
            if (!accessToken) {
                return;
            }
            const response = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/meta`, {
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
        <MetaContext.Provider value={{ loading:metaLoading,phases, documents, phaseDocuments , setPhases , setDocuments , setPhaseDocuments }}>
            {children}
        </MetaContext.Provider>
    );
}