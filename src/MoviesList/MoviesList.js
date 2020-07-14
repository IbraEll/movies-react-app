import React from 'react';
import Card from './Card/Card';
import Sorting from './Sorting/Sorting';
import './MovieList.css';
import { withRouter } from 'react-router-dom';


class MoviesList extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            movieList: [],
            sorting: "popularity.desc",
            currentPage: 1,
            totalPage: 0,
        }
    }
    componentDidMount(){
        const { id: genreId, page } = this.props.match.params;
        this.setState({genreId : genreId, currentPage : page || 1},
            () => {this.getMovies()});
    }
    componentDidUpdate(){
            window.scrollTo({
              top: 0,
              behavior: "smooth"
            });
    }
    componentWillReceiveProps(newProps){
        const { id: genreId, page } = newProps.match.params;
        this.setState({genreId : genreId, currentPage : page || 1},
            () => {this.getMovies()});
    }

    // Генерация ссылки для запроса фильмов
    getPath = (genre, currentPage, sorting) =>{
        let path = `https://api.themoviedb.org/3/discover/movie?api_key=4237669ebd35e8010beee2f55fd45546&language=ru&sort_by=${sorting}&page=${currentPage}`;
        if (genre > 0) path += `&with_genres=${genre}`;
        return path;
    }

    // Получение списка фильмов 
    getMovies = () =>{
        const {genreId, currentPage, sorting} = this.state;        
        const path = this.getPath(genreId, currentPage, sorting);
        fetch(path)
        .then(data => {
            return data.json();
        })
        .then(data =>{
            this.setState({movieList : data.results,
                            totalPage : data.total_pages})
        })
    }

    // Переход на указанную страницу 
    handleKeyDown = (e) => {
        if(e.key === 'Enter' && e.target.value !== "" && e.target.value > 0){
            let {name, value} = e.target;
            value = value > this.state.totalPage ? this.state.totalPage : value;
            e.target.value = "";
            this.setState({[name] : value});
            const newPath = `/genre=${this.state.genreId}/${value}`;
            this.props.history.push(newPath);
        }
    }
    
    // Изменение сортировки фильмов
    changeSorting = (e) =>{
        this.setState({sorting :  e.target.dataset.sorting},
            () => {this.getMovies()});
    }

    // Переход на следующую/предыдущую страницу
    handleClick = (e) => {
        let nextPage = 0;
        switch(e.target.dataset.direction){
            case "forward":
                nextPage = this.state.currentPage + 1;
                break;
            case "back":
                nextPage = this.state.currentPage - 1;
                break;
            default: break;
        }
        this.setState({currentPage : nextPage});
        const newPath = `/genre=${this.state.genreId}/${nextPage}`;
        this.props.history.push(newPath);
    }

    render(){
        return(
            <section className="list">
                <Sorting active={this.state.sorting} handleClick={this.changeSorting}/>
                <div className="list__cards uk-child-width-1-2@s uk-child-width-1-3@m uk-child-width-1-4@l" uk-grid="true">
                     {this.state.movieList.map((movie) => {
                        const isFavorite = this.props.favoriteList.indexOf(movie.id) !== -1 ? true : false;
                        return(
                            <Card key={movie.id} movie={movie} isFavorite={isFavorite}/>
                         )
                    })}                
                </div>
                <div className="list__btns">
                    <button className="uk-button uk-button-primary" 
                            data-direction="back"
                            onClick={this.handleClick}
                            disabled={this.state.currentPage==1}>Назад</button>
                    <input className="uk-input" type="number" placeholder={this.state.currentPage} name="currentPage" onKeyDown={this.handleKeyDown}/>
                    <button className="uk-button uk-button-primary"
                            data-direction="forward"
                            onClick={this.handleClick}
                            disabled={this.state.currentPage==this.state.totalPage}>Вперёд</button>
                </div>
            </section>
        )
    }
}

export default withRouter (MoviesList);