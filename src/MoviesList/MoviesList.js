import React from 'react';
import Card from './Card/Card';
import Sorting from './Sorting/Sorting';
import './MovieList.css';
import { withRouter } from 'react-router-dom';
import MovieService from './../Services/MovieService';
import Spinner from './../Spinner/Spinner';


class MoviesList extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            movieList: [],
            sorting: "popularity.desc",
            currentPage: 1,
            totalPage: 0,
            genreId: 0,
            isLoading : true
        }
    }
    MovieService = new MovieService();

    componentDidMount(){
        const { id: genreId, page } = this.props.match.params;
        this.setState({genreId, currentPage : page || 1},
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
        this.setState({genreId, currentPage : page || 1},
            () => {this.getMovies()});
    }

    // Получение списка фильмов 
    getMovies = () =>{
        const {genreId, currentPage, sorting} = this.state;        
        this.MovieService.getMovies(sorting, currentPage, genreId)
        .then(data =>{
            this.setState({movieList : data.results,
                            totalPage : data.total_pages,
                            isLoading : false})
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
        const {sorting, movieList, isLoading, currentPage} = this.state;
        return(
            <section className="list">
                <Sorting active={sorting} handleClick={this.changeSorting}/>
                {isLoading ? <Spinner/> : null}
                <div className="list__cards uk-child-width-1-2@s uk-child-width-1-3@m uk-child-width-1-4@l" uk-grid="true">
                     {movieList.map((movie) => {
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
                            disabled={currentPage==1}>Назад</button>
                    <input className="uk-input" type="number" placeholder={currentPage} name="currentPage" onKeyDown={this.handleKeyDown}/>
                    <button className="uk-button uk-button-primary"
                            data-direction="forward"
                            onClick={this.handleClick}
                            disabled={currentPage==this.state.totalPage}>Вперёд</button>
                </div>
            </section>
        )
    }
}


export default withRouter (MoviesList);