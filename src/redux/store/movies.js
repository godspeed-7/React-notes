import axios from 'axios';
import _ from 'lodash';
// actions
export const ADD_MOVIE = 'ADD_MOVIE';
export const REMOVE_MOVIE = 'REMOVE_MOVIE';
export const GET_MOVIES = 'GET_MOVIES';
export const LOADING = 'LOADING';

// action creators

async function fetchMovies() {
  return new Promise(async (resolve, reject) => {
    const { data } = await axios.get('http://localhost:3006/movies');
    setTimeout(() => {
      resolve(data);
    }, 0);
  });
}
export const getMovies = () => {
  return async (dispatch) => {
    dispatch({ type: LOADING, payload: [] });
    const data = await fetchMovies();
    dispatch({ type: GET_MOVIES, payload: data });
  };
};

export const addMovie = (movie) => {
  return async (dispatch, getState) => {
    const state = getState();
    const movies = _.get(state, 'moviesReducer.movies');
    dispatch({ type: LOADING, payload: [] });
    const _data = {
      id: (movies.length + 1).toString(),
      ...movie
    };
    const { data } = await axios.post('http://localhost:3006/movies', _data);
    dispatch({ type: ADD_MOVIE, payload: data });
  };
};

export const removeMovie = (movie) => {
  return async (dispatch) => {
    dispatch({ type: LOADING, payload: [] });
    const { data } = await axios.delete(
      `http://localhost:3006/movies/${movie.id}`
    );
    console.log(data);
    dispatch({ type: REMOVE_MOVIE, payload: movie });
  };
};

// reducer

const initialState = {
  movies: [],
  error: {},
  isLoading: false,
};

export default function moviesReducer(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case ADD_MOVIE:
      return { ...state, movies: [...state.movies, payload], isLoading: false };
    case REMOVE_MOVIE:
      const updatedMovies = state.movies.filter((movie) => movie.id !== payload.id);
      console.log({updatedMovies});
      return { ...state, movies: updatedMovies, isLoading: false };
    case GET_MOVIES:
      return { ...state, movies: payload, isLoading: false };
    case LOADING:
      return { ...state, isLoading: true };
    default:
      return state;
  }
}