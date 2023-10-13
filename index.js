// console.log('Hi there!');

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

        const response = await axios.get('http://www.omdbapi.com/', {
            params: {
                apikey: '46e23df',
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
    const response = await axios.get('http://www.omdbapi.com/', {
        params: {
            apikey: '46e23df',
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





// Fetching Movie Data :-
// -----------------------

// The 1st argument to the "axios.get()" function is going to be the 
// URL that we want to retrieve.

// Whenever we make a network request, that is an Asynchronous
// Operation and we have to wait before we get some kind of response
// to continue running the lines of code directly underneath that.
// That's why we have the "await" keyword here.

// We should be getting a "Response Object" with all the info. related
// to the request we just made.


// Then to specify all the different "parameters" here (like our API
// key (or) the Search string that we want use), we're going to use
// some 'Automated Functionalities inside of AXIOS'.
// We can do this neatly by putting in a 2nd parameter of an Object.

// Inside the 2nd Argument, we're going to put in a property called
// "Params" and inside this thing, we're going to list out all the 
// different "query string parameters" that we want to pass along
// with the request.
// So, we can imagine this Object (the 2nd argument) to be turned
// into a String and Appended to the end of the URL.


// Remember that whenever we make a request with AXIOS, this is an
// Object (response) that has a lot of different properties inside
// of it that describes the request in response we just issued.

// The only property that we usually care about is the DATA property,
// and that's the actual information that we just got back from that
// API.


// In our console, if we go to 'Network' Section, we'll see all the
// requests that our JS code has made and then if we go to the
// 'Headers' Section, there we'll see the full Request URL.

// Notice that Axios took that "params" object that we passes in to
// that configuration object.
// It took the 'apikey' and 's' properties and its value and it stuck
// them automatically into the URL as a "query string".

// So, this is a nice thing about AXIOS. If we were using FETCH, then
// we would have had to form that string by ourselves, by hand.



// Fetching a Single Movie :-
// ---------------------------

// Usually whenever we make use of an API like this one, we get one
// Endpoint for doing a Searching (or) INDEX operation and we see
// just a limited set of information about every search result that
// we just got.

// So, if we not want to get more information about a particular
// movie, then we'll have to do a follow up request. So, this would
// be referred to as a Show action (or) a Show Request.



// The 'input' event is triggered any time that a user changes the
// text inside that input.

// Remember, we can get access to the change text by referencing 
// "event.target.value" where 'event' is the Event Object.



// If we open up the "Network" tab inside of our chrome console, 
// we can then see all the different requests that we're making to
// the API.

// If we want to see ONLY the requests that our JavaScript Code is
// issuing, we can click of the XHR Button.



// Instead of making an API request for every key press, since we
// only get to make 1000 API Requests per day for this API that we're
// using, it'll be much better if we make a request ONLY IF the user
// stops typing for let's say 1/2 a second or something like that.

// This can be achived in 2 ways:
// 1) We add in a JS Library that will do this for us automatically.
// 2) We write out some code where we will just figure out how to do
//    it ourselves. So, we'll go with this only!!



// The important thing to keep in mind around "setTimeout()" is that
// anytime we call it, we get back an INTEGER VALUE.
// These numbers are essentially 'Identifiers' and they identify the
// timer that we just created.

// If we want to, we can call the "clearTimeout()" function to stop
// that pending timer and prevent that function from being called.



// Understanding Debounce :-
// --------------------------

// "Debouncing an Input" => Waiting for some time to pass after the
//  last event to actually do something.

// There's actually many different scenarios in which we might want
// to debounce some event inside of a web application.


// "...args" is going to take all the different arguments that are
// passed to the function.


// The "apply()" function says call the function as we normally would
// and take all the arguments or whatever is inside 'args' array and
// pass them in as separate arguments to the original function.



// Remember, "fetchData()" is an 'async' function. So, whenever we
// call fetchData(), it's going to take some amount of time to actually
// process this request and then eventually return the data that we
// get back.

// Right now, we are treating "fetchData()" as it was a Synchronous
// Function. So, if we want to somehow wait on "fetchData()" to
// get some data and get access to the response, we have to treat
// it as it were an 'async' function. 



// We can use `` (back-tics) for creating multi-line strings in JS.


// If we show an image element with an Empty String ('') as its "src"
// value, then it's just not going to show up on the screen.



// Remember how "events" work in JavaScript, EVENTS BUBBLE, which
// means that if some element contained inside the document and we
// click on that element, that's going to trigger a 'click' event
// ON THAT ELEMENT.

// If it doesn't get handled right there, then the event is going to
// essentially Bubble Up until it gets to the TOP LEVEL OF OUR HTML
// DOCUMENT (i.e. the 'document').



// Here in this project, we are not making up all of these Class
// names and everything on our own, instead it is all corresponding
// to styling sets that are included inside of BULMA CSS FRAMEWORK.