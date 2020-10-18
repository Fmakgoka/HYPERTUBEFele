import React, { useEffect, useState, useReducer, useRef } from 'react';
import axios from 'axios';
import './homepage.css';
import AuthService from "../../services/auth.service";
import Movie from './movie';
import Search from './search';
import InfiniteScroll from 'react-infinite-scroller';


const initialState = {
  loading: true,
  movies: [],
  errorMessage: null
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SEARCH_MOVIES_REQUEST":
      return {
        ...state,
        loading: true,
        errorMessage: null
      };
    case "SEARCH_MOVIES_SUCCESS":
      return {
        ...state,
        loading: false,
        movies: action.payload
      };
    case "SEARCH_MOVIES_FAILURE":
      return {
        ...state,
        loading: false,
        errorMessage: action.error
      };
    default:
      return state;
  }
};

const He = () => {
  const currentUser = AuthService.getCurrentUser();
  const [state, dispatch] = useReducer(reducer, initialState);
  //  const loader=  useRef(null);
  const [hasMoreItems, setHasMoreItems] = useState(true);


  const loadMovies = (page) => {
    let url;
    if (page != null && page >= 2) {
      console.log('pagenum',page);
      url = `http://localhost:9000/homepage?page=${page}`
    } else {

      url = `http://localhost:9000/homepage`
    }
    axios.get(url, {
      headers: {
        'content-Type': 'application/json',
        'x-access-token': `${currentUser.accessToken}`
      }
    })
      .then(res => {
        let movie = JSON.parse(res.data.data)
        let movies = state.movies.concat(movie['data'].movies)
       // console.log('yesyes', movies);
        dispatch({
          type: "SEARCH_MOVIES_SUCCESS",
          payload: movies
        })
        if (movies.length === 0) {
          setHasMoreItems(false);
        } else {
          setHasMoreItems(true);
        }
        // console.log('okay ', state.movies)

      })
      .catch(error => console.log(error))

  };
  const search = searchValue => {
    // console.log(searchValue);
    dispatch({
      type: "SEARCH_MOVIES_REQUEST"
    });
    axios.get(`http://localhost:9000/search/?q=${searchValue}`, {
      headers: {
        'content-Type': 'application/json',
        'x-access-token': `${currentUser.accessToken}`
      }
    })
      .then(res => {
        let movies = JSON.parse(res.data.data)
        // console.log( movies['data'].movies)
        dispatch({
          type: "SEARCH_MOVIES_SUCCESS",
          payload: movies['data'].movies
        })
      })
    
  }

  const { movies, errorMessage, loading } = state;
   console.log(state)
  return (
    <div>
      <div className="Home">
        <Search search={search} />
        <div className="movies">
          <InfiniteScroll
            threshold={0}
            pageStart={0}
            loadMore={loadMovies}
            hasMore={hasMoreItems}
            loader={<div className="text-center">loading data ...</div>}>
              {movies.map((movie, i) =>
              (
                <div className="box m-3 movies" key={`${i}-${movie.Title}`}>

                <Movie key={`${i}-${movie.Title}`} movie={movie} />
                </div>
              ))}
          </InfiniteScroll>
          {hasMoreItems ? "" : <div className="text-center">no data anymore ...</div>}

        </div>
      </div>
    </div>
  )
}

export default He;