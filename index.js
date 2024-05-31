// require('dotenv').config();
// const apiKey = process.env.OMDB_API_KEY;
// const apiKey = '46e23df';


// Avoiding Duplication of Config
const autoCompleteConfig = {
    // How to show an individual item...
    renderOption(movie) {
        // deciding whether to show the Poster Images (or) not
        const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;

        return `
                <img src="${imgSrc}" />
                ${movie.Title} (${movie.Year})
            `;
    },
    // What to backfill inside of input field after a user clicks on one...
    inputValue(movie) {
        return movie.Title;
    },
    // How to actually fetch the data...
    async fetchData(searchTerm) {
        // Defining a helper function inorder to make a request
        const response = await axios.get('https://www.omdbapi.com/', {
            params: {
                apikey: '46e23df' || process.env.OMDB_API_KEY,
                s: searchTerm
            }
        });
    
        if(response.data.Error)
        {
            return [];
            // It means we didn't get any movies to show to the user
        }
    
        return response.data.Search;
    }
};


createAutoComplete({
    // "Configuration Object"

    // Creating a new object, take all the properties inside of
    // "autoCompleteConfig" object defined above AND add in the
    // below property of "root" AND then take that whole object and
    // pass it off to "createAutoComplete"
    ...autoCompleteConfig,

    // Where to render the 1st autoComplete to...
    root: document.querySelector('#left-autocomplete'),

    // What to do when someone clicks on one...
    onOptionSelect(movie) {
        // Hiding the message once the user selects any movie!!
        document.querySelector('.tutorial').classList.add('is-hidden');

        onMovieSelect(movie, document.querySelector('#left-summary'), 'left');
    }
});
createAutoComplete({
    ...autoCompleteConfig,

    // Where to render the 2nd autoComplete to...
    root: document.querySelector('#right-autocomplete'),

    // What to do when someone clicks on one...
    onOptionSelect(movie) {
        // Hiding the message once the user selects any movie!!
        document.querySelector('.tutorial').classList.add('is-hidden');

        onMovieSelect(movie, document.querySelector('#right-summary'), 'right');
    }
});


// Storing the references of different stats to compare later...
let leftMovie;
let rightMovie;

// Making a Follow-up request
const onMovieSelect = async (movie, summaryElement, side) => {
    const response = await axios.get('https://www.omdbapi.com/', {
        params: {
            apikey: '46e23df' || process.env.OMDB_API_KEY,
            i: movie.imdbID
        }
    });

    // rendering the summary into the appropriate element
    summaryElement.innerHTML = movieTemplate(response.data);

    // checking which side's follow-up response we are receiving...
    if(side === 'left')
    {
        leftMovie = response.data;
    }
    else
    {
        rightMovie = response.data;
    }

    // if both side's responses are received, only then we'll Compare
    if(leftMovie && rightMovie)
    {
        runComparison();
    }
};


// Perform the comparisons and update the appropriate stats...
const runComparison = () => {
    const leftSideStats = document.querySelectorAll('#left-summary .notification');
    const rightSideStats = document.querySelectorAll('#right-summary .notification');

    // "leftStat" represents an <article> element that is going to
    // have the 'data-value'...
    leftSideStats.forEach((leftStat, index) => {
        const rightStat = rightSideStats[index];


        // To get a dataset property, rememver we referred to dataset
        // and then the name of the data property on that element.
        const leftSideValue = parseInt(leftStat.dataset.value);
        const rightSideValue = parseInt(rightStat.dataset.value);

        if(rightSideValue > leftSideValue)
        {
            leftStat.classList.remove('is-primary');    // green color removed
            leftStat.classList.add('is-warning');       // yellow color added
        }
        else if(rightSideValue < leftSideValue)
        {
            rightStat.classList.remove('is-primary');
            rightStat.classList.add('is-warning');
        }
    });
};


// The movie summary content that we want to show...
const movieTemplate = (movieDetail) => {
    // Turning some of the properties of "movieDetail" into an easy
    // to compare number format!!

    // number representation of property values (parsing)...
    const dollars = parseInt(movieDetail.BoxOffice.replace(/\$/g, '').replace(/,/g, ''));
    const metascore = parseInt(movieDetail.Metascore);
    const imdbRating = parseFloat(movieDetail.imdbRating);
    const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ''));

    // parsing number of Awards
    const awards = movieDetail.Awards.split(' ').reduce((prev, word) => {
        const value = parseInt(word);

        // Way to check if a value is "NaN" is JS: built-in function!!
        if(isNaN(value))
        {
            return prev;
        }
        else
        {
            // we are assuming that the movie having bigger summation
            // of the numbers inside the "Awards" string is Better.
            return (prev + value);
        }
    }, 0);


    return `
        <article class="media">
            <figure class="media-left">
                <p class="image">
                    <img src="${movieDetail.Poster}" />
                </p>
            </figure>

            <div class="media-content">
                <div class="content">
                    <h1>${movieDetail.Title}</h1>
                    <h4>${movieDetail.Genre}</h4>
                    <p>${movieDetail.Plot}</p>
                </div>
            </div>
        </article>

        <article data-value="${awards}" class="notification is-primary">
            <p class="title">${movieDetail.Awards}</p>
            <p class="subtitle">Awards</p>
        </article>

        <article data-value="${dollars}" class="notification is-primary">
            <p class="title">${movieDetail.BoxOffice}</p>
            <p class="subtitle">Box Office</p>
        </article>

        <article data-value="${metascore}" class="notification is-primary">
            <p class="title">${movieDetail.Metascore}</p>
            <p class="subtitle">Metascore</p>
        </article>

        <article data-value="${imdbRating}" class="notification is-primary">
            <p class="title">${movieDetail.imdbRating}</p>
            <p class="subtitle">IMDB Rating</p>
        </article>

        <article data-value="${imdbVotes}" class="notification is-primary">
            <p class="title">${movieDetail.imdbVotes}</p>
            <p class="subtitle">IMDB</p>
        </article>
    `;
};