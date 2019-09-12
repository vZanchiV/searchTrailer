import React  from 'react';
const IMAGE_BASE_URL = "http://image.tmdb.org/t/p/w500/"
const VideoListItem = (props) => {
    const {movie} = props;
    return <li className="list-group-item"  onClick={handOnClick}> 
            <div className="media">
                <div className="media-left">
                    <img  height="100px" className="media-object img-rounded" src={`${IMAGE_BASE_URL}${movie.poster_path}`}/> 
                </div>   
                <div className="media-body">
                    <h5 className="title-list-item">{movie.title}</h5>
                </div> 
             </div>
            </li>

            function handOnClick() {
                props.callback(movie);
            }


}

export default VideoListItem;