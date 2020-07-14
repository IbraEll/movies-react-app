import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';

import Menu from './Menu/Menu'
import MoviesList from './MoviesList/MoviesList'
import Movie from './Movie/Movie'

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      favoriteList : [],
      genreId : 0
    }
  }

  componentDidMount(){
    const list = localStorage.getItem('favList') ? JSON.parse(localStorage.getItem('favList')) : [];
    this.setState({favoriteList : list})
  }

  // Добавление или извлечение фильма из списка избранного с сохранением списка в локальном хранилище
  toggleFavorite = (id) =>{
    const index = this.state.favoriteList.indexOf(id) ;
    const isFavorite = index !== -1 ? true : false;
    let newList = [];
    if(!isFavorite){
      newList = this.state.favoriteList.concat([id])
    } else {
      newList = this.state.favoriteList;
      newList.splice(index, 1)
    }
    this.setState({favoriteList : newList});
    localStorage.setItem('favList', JSON.stringify(newList));
  }
  

  render(){
    return (
      <div className="App">
        <Router>
          <Menu genreId={this.state.genreId}/>
          <div className="uk-container">

            <Switch>
              <Route path="/movie/:id"  render={(props) => (
                <Movie {...props} favoriteList = {this.state.favoriteList} toggleFavorite={this.toggleFavorite}/>
                )}/>
              <Route path="/genre=:id/:page?" render={(props) => (
                <MoviesList {...props} favoriteList = {this.state.favoriteList} genreId={this.state.genreId}/>
                )}/>
              <Route path="/" >
                <Redirect to="/genre=0" />
              </Route>
            </Switch>
          </div>
   
        </Router>
      </div>
    );
  }

}

export default App;
