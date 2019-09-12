import React, { Component } from 'react';
import SearchBar from '../components/search-bar';
import VideoList from './video-list';
import axios from 'axios';
import VideoDetail from '../components/video-detail';
import Video from '../components/video'

const API_END_POINT = "https://api.themoviedb.org/3/";
const POPULAR_MOVIES_URL = "discover/movie?language=fr&sort_by=popularity.desc&include_adult=false&append_to_response=images"
const API_KEY = 'api_key=2a412c599ca182074bcccd25951e5ed2';
const SEARCH_URL = 'search/movie?language=fr&include_adult=false';

 
class App extends Component {
   constructor(props) {
      super(props)
      this.state = {moviesList:{}, currentMovie:{}};
   }

  componentWillMount() {
      this.initMovies();
  }

  initMovies() {
    axios.get(`${API_END_POINT}${POPULAR_MOVIES_URL}&${API_KEY}`).then( (res) => {      
      this.setState({moviesList:res.data.results.slice(1,6), currentMovie:res.data.results[0]}, function(){
        this.applyVideoToCurrentMovie();
      });
    });
  }

  applyVideoToCurrentMovie() {
    axios.get(`${API_END_POINT}movie/${this.state.currentMovie.id}?append_to_response=videos&include_adult=false&${API_KEY}`).then( (res) => {      
      const YoutubeKey = res.data.videos.results[0].key;
      let newCurrentMovieState = this.state.currentMovie;
      newCurrentMovieState.videoId = YoutubeKey;
      this.setState({currentMovie: newCurrentMovieState});
    });
    
  }

  onClickListItem(movie) {
    this.setState({currentMovie:movie}, function(){
      this.applyVideoToCurrentMovie();
      this.setRecommandation();
    });
  }

  onClickSerch(terms) {
    axios.get(`${API_END_POINT}${SEARCH_URL}&${API_KEY}&query=${terms}`).then ( (res) =>{
      if(res.data && res.data.results[0]) {
         if(res.data.results[0].id != this.state.currentMovie.id) {
           this.setState({currentMovie: res.data.results[0]}, () =>{
            this.applyVideoToCurrentMovie();
            this.setRecommandation();
           })
         }
      }
    })
    
  }

  setRecommandation () {
    axios.get(`${API_END_POINT}movie/${this.state.currentMovie.id}/recommendations?${API_KEY}&language=fr`).then( (res) => {      
      this.setState({moviesList:res.data.results.slice(0,5)})
    });
    
  }

  render() {
    const renderVideoList= () => {
      if(this.state.moviesList.length>=5){
          return  <VideoList moviesList={this.state.moviesList}  callback={this.onClickListItem.bind(this)}/>
      }
    }
    return (
      <div>
        <div className="searchBar">
          <SearchBar  callback={this.onClickSerch.bind(this)}/>
        </div>
        
        <div className="row">
          <div className="col-md-8">
            <Video videoId={this.state.currentMovie.videoId} />
            <VideoDetail title={this.state.currentMovie.title} description={this.state.currentMovie.overview}/>
          </div>
          <div className="col-md-4">
          {renderVideoList()}
          </div>
        </div>
      </div>
    );
  }
}

export default App;