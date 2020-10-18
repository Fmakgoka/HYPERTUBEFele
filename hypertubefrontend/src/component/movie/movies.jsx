import React from 'react'
import Movie from './movie'


const Movies = ({ movies, openPopup })=> {
	console.log('movies id',movies[0])
	return (
		<section className="movies">
			{movies.map(movie => (
				<Movie key={movie.id} movie={movie} openPopup={openPopup} />
			))}
		</section>
	)
}

export default Movies