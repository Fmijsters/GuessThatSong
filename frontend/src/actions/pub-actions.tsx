import { GTSApiClient } from "./axios-instance";

export const createPub = async (pub: {
  name: string;
  password: string;
  type: string;
  teams: boolean;
  maxMembers: number;
  trackList: any[];
  rounds: number;
}) => {
  const apiUrl = process.env.BACKEND_URL + "/api/pubs/createpub";
  let response = await GTSApiClient.post(apiUrl, pub);
  if (response.data.id) window.location.href = "/pub/" + response.data.id;
};
