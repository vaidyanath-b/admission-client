import { createContext } from "react";
export interface IPhase {
  order: number;
  name: string;
  description: string;
}

export interface IPhaseDocuments {
  phaseId: number;
  documentTypeCode: string;
}

export interface IDocument {
  code: string;
  name: string;
}
export interface IMetaContext {
  phases: IPhase[];
  documents: IDocument[];
  phaseDocuments: IPhaseDocuments[];
  setPhases : (phases: IPhase[]) => void;
  setDocuments : (documents: IDocument[]) => void;
  setPhaseDocuments : (phaseDocuments: IPhaseDocuments[]) => void;
  loading: boolean;
}

export const MetaContext = createContext<IMetaContext | null>(null);
