"use client";
import { createContext } from "react";

export interface IActiveApplication {
  applicantId: number;
  course: string;
  quota: string;
  allotment: number;
}

export interface IAllotmentCount {
  course: string;
  quota: string;
  count: number;
}
interface IAdminContext {
  activeApplications: IActiveApplication[];
  allotmentCount: IAllotmentCount[];
  setAllotmentCount: (allotmentCount: IAllotmentCount[]) => void;
  setActiveApplications: (activeApplications: IActiveApplication[]) => void;
}

export const AdminContext = createContext<IAdminContext | null>(null);
export default AdminContext;
