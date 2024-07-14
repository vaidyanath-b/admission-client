"use client"
import { createContext } from "react";

// Define interfaces for each part of the context
// Define a single interface for the context state
import { ApplicantContextType } from "../applicantDetails/interface"
 // Combine state and actions into a single context type

// Define the default values for the context

// Create the context with the typed default values
export const  AdminApplicantContext =
  createContext<ApplicantContextType & {applicantId : number | null ; setApplicantId:(x:number) => void } | null>(null);
