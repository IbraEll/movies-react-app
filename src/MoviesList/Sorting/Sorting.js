import React from 'react';
import './Sorting.css'

class Sorting extends React.Component{
    render(){

        const sortingList = [
            {
                label: "По популярности",
                type: "popularity.desc",
            },
            {
                label: "По новизне",
                type: "release_date.desc",
            },
            {
                label: "По рейтингу",
                type: "vote_average.desc",
            }
        ]

        return(
            <div className="sorting">
                {sortingList.map( item => {
                    let classList = "uk-button uk-button-text sorting__item";
                    if(item.type === this.props.active) classList += " sorting__item--active"
                    return (
                        <button className={classList}
                                data-sorting={item.type}
                                key={item.type}
                                onClick={this.props.handleClick}>{item.label}</button>
                    )
                })}
                
       
            </div>
        )
    }
}

export default Sorting;