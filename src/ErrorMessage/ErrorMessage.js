import React from 'react';
import './ErrorMessage.css';

export default function ErrorMessage({item = "элемент"}){
    return(
        <div className="error">
            <b>Упс! Что-то пошло не так...</b>
            <p>Не удалось загрузить {item}.</p>
        </div>
    )
}