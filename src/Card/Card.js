import React from 'react';
import {Link} from 'react-router-dom';
import './Card.css';
import noPic from './noimage.png';

class Card extends React.Component{
    render(){
        const {id, title, backdrop_path, poster_path } = this.props.movie;
        const moviePath = `/movie/${id}`
        let imagePath = noPic;
        if(backdrop_path) imagePath =  `http://image.tmdb.org/t/p/w300${backdrop_path}`;
        else if(poster_path)  imagePath = `http://image.tmdb.org/t/p/w500${poster_path}`;

        return(
            <div className=" card">
                <Link to={moviePath} className="uk-card uk-card-default">
                    <img src={imagePath} alt={title} className="card__poster"/>
                    <div className="card__body">

                    <h2 className="card__title">{title}</h2>
                    
                    {this.props.isFavorite ? <div className="uk-card-badge uk-label card__badge">В избранном</div> : ""}
                    </div>
                </Link>
            </div>
        )
    }
}

export default Card;