import React from 'react';
import './Movie.css';
import noImg from './noimage.png';
import MovieService from './../Services/MovieService'

class Card extends React.Component{
    constructor(props){
        super(props);
        this.state = {
          movie : [],
          isFavorite: false
        }
    }
    MovieService = new MovieService();
    
    componentDidMount(){
        this.getMovie();
    }    

    // Получение информации о фильме
    getMovie = () => {        
        const { id } = this.props.match.params;
        this.MovieService.getMovie(id)
        .then(data =>{
            const isFavorite = this.props.favoriteList.indexOf(data.id) !== -1 ? true : false;
            this.setState({movie : data, isFavorite: isFavorite})
        })
    }

    // Преобразование длительности фильма из минут к виду "Х ч. Х мин."
    getRuntime = (minutes) =>{
        if(!minutes) return ""
        const hour = Math.floor(minutes/60);
        const min = minutes % 60;
        if (hour) return `${hour} ч. ${min} мин.`;
        else return `${min} мин.`;
    }

    // Вывод жанров фильма через запятую
    getGenres = (genres) =>{
        if(!genres || genres.length === 0) {return "";}
        let result = "";
        for(let i = 0; i < genres.length; i++){
            if(i === genres.length - 1){
                result += `${genres[i].name}`
            }
            else{
                result += `${genres[i].name}, `
            }
        }
        return result;
    }

    // Переход на предыдущую страницу
    goBack = () =>{
        this.props.history.goBack();
    }
    
  // Добавление или извлечение фильма из списка избранного 
    handleClick = () => {
        const id = this.state.movie.id;
        const isFavorite = this.props.favoriteList.indexOf(id) !== -1 ? true : false;
        this.setState({isFavorite: !isFavorite})
        this.props.toggleFavorite(id);
    }

    render(){        
        const {title, poster_path, overview, release_date, runtime, genres, id} = this.state.movie;
        const imagePath = `http://image.tmdb.org/t/p/w500${poster_path}`
        return(
            <section className="movie">
                <button onClick={this.goBack} className="uk-button uk-button-text movie__back">Назад</button>
                <div className="uk-card uk-card-default movie__card">
                    <div className="movie__left">
                        <img src={poster_path ? imagePath : noImg} alt={title} className="movie__poster"/>
                        <button className="uk-button uk-button-danger movie__fav" onClick={this.handleClick}>
                            {this.state.isFavorite ? "Убрать из избранного" : "Добавить в избранное"}
                        </button>
                    </div>
                    <div className="uk-card-body">

                        <h1 className="uk-heading-small movie__title">{title || "----"}</h1>
                        <div className="movie__field">
                            <h3>Описание:</h3>
                            <p>{overview || "----"}</p>
                        </div>
                        <div className="movie__field">
                            <h3>Год:</h3>
                            <p>{parseInt(release_date) || "----"}</p>
                        </div>
                        <div className="movie__field">
                            <h3>Время:</h3>
                            <p>{this.getRuntime(runtime) || "----"}</p> 
                        </div>
                        <div className="movie__field">
                            <h3>Жанры:</h3>
                            <p>{this.getGenres(genres) ||  "----"}</p> 
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}

export default Card;