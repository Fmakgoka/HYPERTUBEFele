import React from "react";


const DEFAULT_PLACEHOLDER_IMAGE =
  "https://m.media-amazon.com/images/M/MV5BMTczNTI2ODUwOF5BMl5BanBnXkFtZTcwMTU0NTIzMw@@._V1_SX300.jpg";


const Movie = ({movie,openPopup}) => {
  const poster =
    movie.Poster === "N/A" ? DEFAULT_PLACEHOLDER_IMAGE : movie.large_cover_image;
  return (
    <div className="movie" onClick={(e) => {
      openPopup(movie.id)
    console.log('clicked');
    }
      }>
        <img
          // key={props.key}
          width="150"
          alt={`The movie titled: ${movie.title}`}
          src={poster}
        />
        {/* <video src='https://www.youtube.com/watch?v=Z8he5Fh65n4'>the</video> */}

         <p className='movietitle'>({movie.year})</p> 
      <h4 className='movietitle'>{movie.title}</h4>
      <h4 className='movietitle'>IMBd grade{movie.rating}</h4>

      </div>
  );
};


export default Movie;