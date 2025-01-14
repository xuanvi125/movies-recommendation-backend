import { Injectable } from '@nestjs/common';
import { MovieService } from 'src/movie/movie.service';

const LLM_URL = process.env.LLM_URL;
const LLM_API_KEY = process.env.LLM_API_KEY;

@Injectable()
export class RecommendationService {
  constructor(private movieService: MovieService) {}

  async getRetriver(query: String) {
    try {
      const url = `${LLM_URL}/retriever?query=${query}&llm_api_key=${LLM_API_KEY}&collection_name=movies`;
      const response = await fetch(url);
      const { data } = await response.json();
      const movies = await this.movieService.getListMovies(data.result);
      
      return movies;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getNavigation(query: String) {
    const url = `${LLM_URL}/navigate/?query=${query}&llm_api_key=${LLM_API_KEY}`;
    const response = await fetch(url, 
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    }
    );
    const data = await response.json();
    return data;
  }
}
