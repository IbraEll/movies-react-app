import React from 'react';
import {NavLink, Link} from 'react-router-dom';
import './Menu.css'

class Menu extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            'genresList' : [],
            'menuIsOpen': false
        }
    }

    componentDidMount(){
        this.getGenres();
    }    
    
    // Получение списка жанров
    getGenres = () =>{
        fetch('https://api.themoviedb.org/3/genre/movie/list?api_key=4237669ebd35e8010beee2f55fd45546&language=ru')
        .then(data => {
            return data.json();
        })
        .then(data =>{
            this.setState({genresList : data.genres})
        })
    }

    // Переключение состояния меню на мобилке
    toggleMenu = () => {
        this.setState({menuIsOpen : !this.state.menuIsOpen})
    }
    closeMenu = () => {
        this.setState({menuIsOpen : false})
    }

    render(){
        let menuClassList = "uk-navbar-nav menu__genres";
        if(this.state.menuIsOpen){
            menuClassList += " menu__genres--opened";
        }
        return(
            <header className="menu" >
                <Link to="/" className="menu__logo">Movies</Link>
                <button className="menu__toggle" aria-label="Меню" onClick={this.toggleMenu}></button>
                <div className={menuClassList}>
                        {this.state.genresList.map((genre) => {
                            return(
                                <NavLink  to={`/genre=${genre.id}`} 
                                    className={"menu__link "}
                                    activeClassName={"menu__link--active"}
                                    key={genre.id}                                        
                                    onClick={this.closeMenu}>
                                    {genre.name}
                                    </NavLink>
                            )
                        })}
                </div>
            </header>

        )
    }
}

export default Menu;