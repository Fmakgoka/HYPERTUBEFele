import React, { useState } from 'react'
import './homepage.css';
import axios from 'axios';
import AuthService from "../../services/auth.service";
import ModalVideo from 'react-modal-video';
import { useHistory } from 'react-router-dom';
import 'react-modal-video/scss/modal-video.scss';


function Popup({ selected, closePopup }) {
	console.log('selected views',selected)
	const currentUser = AuthService.getCurrentUser();
	const [video, setVideo] = useState()
	const [isOpen, setOpen] = useState(false)
	const [comment, setComment] = useState({comment:"",video_id:0});
	const [moviename, setMoviename] = useState("")
	const history = useHistory();


	const onChangeComment = (e) => {
		e.persist();
        // debugger
        setComment({
            ...comment,
			[e.target.name]: e.target.value,
			'video_id':selected.id
        })
	};
	const updateviews = async () => {
		const res = await axios.get(`http://localhost:9000/movieDetails/updateviews`, {
			headers: {
				'content-Type': 'application/json',
				'x-access-token': `${currentUser.accessToken}`
			}
		});
		return await res.data; // (Or whatever)

	}
	// const updateViews()

	let url = selected.torrents[0].url
	var id = selected.id
	const checkready = () => {
		if (video) {
			updateviews().then((res) => {
				console.log("updated");
				// data.movie.views = res.views
				// setMovies(prevState => {
				// 	return { ...prevState, selected: data.movie }
				// });

				// console.log(res.views)
			}).catch((err) => {
				console.log(err)
			})
			setOpen(true)
		}
	}

	const Commentsubmit = e => {
		e.preventDefault()
		console.log(currentUser)

		fetch('http://localhost:9000/comment', {
			method: 'POST',
			body: JSON.stringify(comment),
			headers: {
				'content-Type': 'application/json',
				'x-access-token': `${currentUser.accessToken}`
			}
		})
			.then(res => {
				console.log(`req successful ${res.status}`);
				if (res.status === 200)
					history.push('/popup')
			})
			.catch(error => console.log(error))
	}

	const submit = async e => {
		await axios.get(`http://localhost:9000/torrent?url=${url}&id=${id}&title=${selected.title}`, {
			headers: {
				'content-Type': 'application/json',
				'x-access-token': `${currentUser.accessToken}`
			}
		}).then(res => {
			console.log('res.data', res.data);
			if (res.data.message) {
				let videoplay = `http://localhost:9000/torrent/video?movie=${res.data.message}`
				setVideo(videoplay)
				let nameonly = res.data.message
				setMoviename(nameonly.substring(0, nameonly.length - 4) + '.srt')
				console.log('moviename', videoplay);
				console.log('videonnn', nameonly.substring(0, nameonly.length - 4) + '.srt');
			}
			// window.location.reload();

		})
			.catch(error => console.log(error))
	}

	return (
		<section className="popup">
			<div className="content">
				<h2>{selected.title} <span>({selected.year})</span></h2>
				<p className="rating">Rating: {selected.rating}</p>
				<div className="plot">
					<div className="playvideo">
						<React.Fragment>
							<ModalVideo channel='custom' url={video} autoplay isOpen={isOpen} onClose={() => setOpen(false)} />
							<track label="English" kind="subtitles" srcLang="en" src={`http://localhost:9000/videos/${moviename}`} default />
							<button className="btn-primary" onClick={checkready
							}>Play</button>
						</React.Fragment>
						<input onClick={submit} type="submit" value={'download'} />
					</div>
					<div className="videoinfro">
						<img
							alt={`The movie titled: ${selected.title}`}
							src={selected.large_cover_image} />
						<p>Description: {selected.description_full}</p>
						<p>Views: {selected.views}</p>
						<p>Likes: {selected.like_count}</p>
						<p>comments: {selected.comment}</p>
						<input type='text' name="comment" value={comment.comment}
							onChange={onChangeComment} />
						<button type='submit' onClick={Commentsubmit}>comment</button>
					</div>
				</div>
				<button className="close" onClick={closePopup}>Close</button>
			</div>
		</section>
	)
}

export default Popup