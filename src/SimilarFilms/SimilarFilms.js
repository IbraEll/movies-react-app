import React from 'react';

import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Autoplay, Pagination } from 'swiper';
import 'swiper/swiper.scss';
import 'swiper/components/pagination/pagination.scss';

import './SimilarFilms.css';
import MovieService from '../Services/MovieService';

import Card from '../Card/Card';
import Spinner from '../Spinner/Spinner';



export default class SimilarFilms extends React.Component{
    constructor(props){
        super(props);
        this.state = {
          movieList : [],
          isLoading: true,
          isError: false,
          id: null
        }
    }
    MovieService = new MovieService();
    componentDidMount(){
        const id =  this.props.id;
        
        this.setState({ id }, this.getMovies(id))
        
    }
    componentWillReceiveProps(newProps){
        const id =  newProps.id;
        if(id !== this.state.id) this.setState({ id }, this.getMovies(id))
    }

    // Получение похожих фильмов 
    getMovies = (id) =>{
        this.MovieService.getSimilarMovies(id)
        .then(data =>{
            if(data.results.length === 0) throw new Error ("Нет результатов по такому запросу");
            this.setState({movieList : data.results.slice(0, 5),
                            isLoading : false})
        })
        .catch(this.onError)
    }
    onError = () => {
        this.setState({isError: true, isLoading: false})
    }

    render(){
        SwiperCore.use([Autoplay, Pagination]);
        const {movieList, isLoading, isError} = this.state;
        return (
            <div className="similar-films">
             
                {isLoading ? <Spinner/> : null}
                {isError ? <p className = "similar-films__title">Похожих фильмов не найдено!</p>: null}
                {!isError && !isLoading  ? <View movieList={movieList} favoriteList = {this.props.favoriteList}/> : null}
            </div>

        );
    }  
  };
  
class View extends React.Component{
    render(){
        const {movieList, favoriteList} = this.props;

        return(
            <>
                <p className = "similar-films__title">Вас могут заинтересовать</p>
                <Swiper 
                    spaceBetween={50}
                    slidesPerView={1}
                    loop={true}
                    autoplay={true}
                    pagination={{ clickable: true }}
                    breakpoints = {{
                        640: {slidesPerView:2}, 
                        960: {slidesPerView:3}, 
                    }}
                    className="similar-films__slider"
                    > {movieList.map((movie) => {
                        const isFavorite = favoriteList.indexOf(movie.id) !== -1 ? true : false;
                        return(
                            <SwiperSlide key={movie.id}>
                                <Card movie={movie} isFavorite={isFavorite}/>
                            </SwiperSlide>
                        )
                    })}
                </Swiper>
               
            </>
        )
    }
}