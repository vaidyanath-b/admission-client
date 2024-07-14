import getUserSession from "@/lib/actions";
import { apiUrl } from "@/lib/env";
import axios from "axios";
export const deletePhaseDocument = async (
  phaseId: number,
  documentTypeCode: string
) => {
  try {
    const { accessToken } = await getUserSession();
    const response = await axios.delete(
      `${apiUrl}/api/phase/${phaseId}/document/${documentTypeCode}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "content-type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addPhaseDocument = async (
  phaseId: number,
  documentTypeCode: string
) => {
  try {
    const { accessToken } = await getUserSession();
    const response = await axios.post(
      `${apiUrl}/api/phase/${phaseId}/${documentTypeCode}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "content-type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createPhase = async (phase: {
  order: number;
  name: string;
  description: string;
}) => {
  try {
    const { accessToken } = await getUserSession();
    const response = await axios.post(`${apiUrl}/api/phase`, phase, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "content-type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createDocument = async (document: {
  code: string;
  name: string;
}) => {
  try {
    const { accessToken } = await getUserSession();
    const response = await axios.post(`${apiUrl}/api/document-type`, document, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "content-type": "application/json",
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteDocument = async (documentId: string) => {
  try {
    const { accessToken } = await getUserSession();
    const response = await axios.delete(
      `${apiUrl}/api/document-type/${documentId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "content-type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const editDocument = async (document: {
  code: string;
  name: string;
}) => {
  try {
    console.log(document);
    const { accessToken } = await getUserSession();
    const response = await axios.put(
      `${apiUrl}/api/document-type/${document.code}`,
      { name: document.name },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "content-type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
