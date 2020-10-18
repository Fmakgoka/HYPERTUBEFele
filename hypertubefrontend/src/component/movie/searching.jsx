import React, { useState } from 'react';
import axios from 'axios';
import './homepage.css';
import Popup from './popup';
import InfiniteScroll from 'react-infinite-scroller'
import AuthService from "../../services/auth.service";
import Movies from './movies';


const Searching = () => {
  const currentUser = AuthService.getCurrentUser();
  const [movies, setMovies] = useState({
    results: [],
    selected: {}
  });
  const [errorMessage, setErrorMessage] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [hasMoreItems, setHasMoreItems] = useState(true);

  const handleSearchInputChanges = (e) => {
    setSearchValue(e.target.value);
  }
  const getviews = async () => {
    const res = await axios.get(`http://localhost:9000/movieDetails/views`, {
      headers: {
        'content-Type': 'application/json',
        'x-access-token': `${currentUser.accessToken}`
      }
    });
    return await res.data; // (Or whatever)

  }

  const getComment = async () => {
    const res = await axios.get(`http://localhost:9000/movieDetails/comment`, {
      headers: {
        'content-Type': 'application/json',
        'x-access-token': `${currentUser.accessToken}`
      }
    });
    return await res.data; // (Or whatever)

  }

  const searching = (page) => {
    axios.get(`http://localhost:9000/search/?q=${searchValue}&page=${page}`, {
      headers: {
        'content-Type': 'application/json',
        'x-access-token': `${currentUser.accessToken}`
      }
    })
      .then(res => {
        let result = JSON.parse(res.data.data)
        const newList = movies.results.concat(result['data'].movies);
        console.log('newlist', newList);
        if (result.status === "ok") {
          if (result['data'].movie_count !== 0) {
            setMovies(prevState => {
              return { ...prevState, results: newList }
            })
            if ((result['data'].movie_count / result['data'].limit) === page) {
              setHasMoreItems(false);
            } else {
              setHasMoreItems(true);
            }
          } else {
            setHasMoreItems(false);
            setErrorMessage('movies not found');
          }
        }
      }).catch(e => {
        setErrorMessage('movies not found');
        console.log(e);
        console.log(errorMessage);
        setHasMoreItems(false);
      })
  }

  const openPopup = (id) => {
    axios.get(`http://localhost:9000/movieDetails?id=${id}`, {
      headers: {
        'content-Type': 'application/json',
        'x-access-token': `${currentUser.accessToken}`
      }
    }).then(res => {
      let detail = JSON.parse(res.data.data)

      let { data } = detail

      getviews().then((res) => {
        data.movie.views = res.views
        setMovies(prevState => {
          return { ...prevState, selected: data.movie }
        });


        // console.log(res.views)
      }).catch((err) => {
        console.log(err)
      })
      getComment().then((res) => {
        console.log('something', res.comment[0].comment);
        data.movie.comment = res.comment[0].comment
        console.log('res',data.movie.comment);
        setMovies(prevState => {
          return { ...prevState, selected: data.movie }
        });
      }).catch((err) => {
        console.log(err)
      })
      // setMovies(prevState => {
      //   return { ...prevState, selected: data.movie }
      // });

    }).catch(error => console.log(error))
  }

  const closePopup = () => {
    setMovies(prevState => {
      return { ...prevState, selected: {} }
    });
  }
  // console.log('result after search', Object.keys(movies.results));

  return (
    <div className="Home">
      <input
        value={searchValue}
        onChange={handleSearchInputChanges}
        type="text"
      />
      <input onClick={searching} type="submit" value="SEARCH" />

      <InfiniteScroll
        initialLoad={false}
        className="movies"
        threshold={250}
        pageStart={1}
        loadMore={searching}
        hasMore={hasMoreItems}
        loader={<div key={0} className="text-center">loading data...</div>}
      >
        <div className="movies">
          {errorMessage ? (
            <div className="errorMessage">{errorMessage}</div>
          ) : <Movies movies={movies.results} openPopup={openPopup} />
          }
          {(typeof movies.selected.title != "undefined") ? <Popup selected={movies.selected} closePopup={closePopup} /> : false}

        </div>
      </InfiniteScroll>
    </div>
  )
}

export default Searching