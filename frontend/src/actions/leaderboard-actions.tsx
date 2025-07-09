import { GTSApiClient } from "./axios-instance";

export const getRecords = async (setRecords) => {
    const apiUrl = process.env.REACT_APP_BACKEND_URL + '/api/tracks/records/get';
    let response = await GTSApiClient.get(apiUrl)
    setRecords(response.data.records);

}

export const getTimeRecords = async (setTimeRecords) => {
    const apiUrl = process.env.REACT_APP_BACKEND_URL + '/api/tracks/records/time/get';
    let response = await GTSApiClient.get(apiUrl)
    setTimeRecords(response.data.records);
}