import axios from "axios";

export const imagePath = "https://image.tmdb.org/t/p/w500";
export const imagePathOriginal = "https://image.tmdb.org/t/p/original";

const baseURL = "https://api.themoviedb.org/3"

const apiKey = import.meta.env.VITE_API_KEY


export const fetchTrending = async (timeWindow = 'day') => {
    const { data } = await axios.get(`${baseURL}/trending/all/${timeWindow}?api_key=${apiKey}&language=pt-BR`)
    return data?.results
}

export const fetchDetails = async (type, id) => {
    const res = await axios.get(`${baseURL}/${type}/${id}?api_key=${apiKey}&language=pt-BR`);
    return res?.data;
};
