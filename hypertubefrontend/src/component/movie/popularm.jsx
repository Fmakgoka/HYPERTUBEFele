import React, { useState } from 'react';
import axios from 'axios';
import './homepage.css';
import AuthService from "../../services/auth.service";
import InfiniteScroll from 'react-infinite-scroller'
import Popup from './popup';
import Movies from './movies';

const Popular = () => {
    console.log('am in popular  ')
    const currentUser = AuthService.getCurrentUser();
    const [movies, setMovies] = useState({
        results: [],
        selected: {}
    });
    const [errorMessage, setErrorMessage] = useState(null);
    const [hasMoreItems, setHasMoreItems] = useState(true);

    const loadMovies = (page) => {
        console.log(page);
        axios.get(`http://localhost:9000/homepage?page=${page}`, {
            headers: {
                'content-Type': 'application/json',
                'x-access-token': `${currentUser.accessToken}`
            }
        })
            .then(res => {
                let result = JSON.parse(res.data.data)
                console.log(`res ${result}`);
                const newList = movies.results.concat(result['data'].movies);
                setMovies(prevState => {
                    return { ...prevState, results: newList }
                }
                );
                console.log(`resDATA`, result['data'])
                if ((result['data'].movie_count / result['data'].limit) === page) {
                    setHasMoreItems(false);
                } else {
                    setHasMoreItems(true);
                }
            })
            .catch(error => console.log(error))
    };

    const openPopup = (id) => {
        axios.get(`http://localhost:9000/movieDetails?id=${id}`, {
            headers: {
                'content-Type': 'application/json',
                'x-access-token': `${currentUser.accessToken}`
            }
        }).then(res => {
            let detail = JSON.parse(res.data.data)

            let { data } = detail
            console.log(data);
            setMovies(prevState => {
                return { ...prevState, selected: data.movie }
            });

        }).catch(error => console.log(error))
    }
    console.log('in here');
    const closePopup = () => {
        setMovies(prevState => {
            return { ...prevState, selected: {} }
        });
    }
    return (
        <div className="Home">
            <div>
                <InfiniteScroll
                    initialLoad={true}
                    className="movies"
                    threshold={250}
                    pageStart={1}
                    loadMore={loadMovies}
                    hasMore={hasMoreItems}
                    loader={<div key={0} className="text-center">loading data ...</div>}
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
        </div>
    );
}

export default Popular;
