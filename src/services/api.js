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


export const fetchCredits = async (type, id) => {
    const res = await axios.get(
        `${baseURL}/${type}/${id}/credits?api_key=${apiKey}&language=pt-BR`
    );
    return res?.data;
}

export const fetchVideos = async (type, id) => {
    const res = await axios.get(
        `${baseURL}/${type}/${id}/videos?api_key=${apiKey}&language=pt-BR`
    );
    return res?.data;
};


export const fetchMovies = async (page = 1, sortBy = "popularity.desc", minVoteCount = null) => {
  const params = {
    api_key: apiKey,
    language: "pt-BR",
    page: page.toString(),
    sort_by: sortBy,
  };

  if (minVoteCount) {
    params['vote_count.gte'] = minVoteCount.toString();
  }

  try {
    const response = await axios.get(`${baseURL}/discover/movie`, { params });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar filmes:', error);
    throw error;
  }
};

export const fetchShows = async (page = 1, sortBy = "popularity.desc", minVoteCount = null) => {
    const params = {
      api_key: apiKey,
      language: "pt-BR",
      page: page.toString(),
      sort_by: sortBy,
    };
  
    if (minVoteCount) {
      params['vote_count.gte'] = minVoteCount.toString();
    }
  
    try {
      const response = await axios.get('https://api.themoviedb.org/3/discover/tv', { params });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar séries:', error);
      throw error;
    }
  }