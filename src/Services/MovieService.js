export default class MovieService{
    constructor(){
        this._apiBase = 'https://api.themoviedb.org/3';
        this._apiKeyLang = 'api_key=4237669ebd35e8010beee2f55fd45546&language=ru';
    }

    async getRresource(url){
        const result = await fetch(`${this._apiBase}${url}${this._apiKeyLang}`);

        if(!result.ok){
            throw new Error (`Couldn't fetch data from ${url}. Status: ${result.status}`);
        }

        return await result.json();
    }
    getGenres(){
        return this.getRresource('/genre/movie/list?');
    }
    getMovies(sorting = "popularity.desc",
                currentPage = 1,
                genre = 0){
        let url  = `/discover/movie?sort_by=${sorting}&page=${currentPage}`;
        if (genre > 0) url += `&with_genres=${genre}`;
        url += "&"
        return this.getRresource(url);
    }
    getMovie(id){
        return this.getRresource(`/movie/${id}?`);
    }    
}