const createAutoComplete = ({ root, renderOption, onOptionSelect, inputValue, fetchData }) => {
    root.innerHTML = `
    <label for=""><b>Search</b></label>

    <input class="input" type="text" placeholder="Explore the silver screen...">

    <div class="dropdown">
        <div class="dropdown-menu">
            <div class="dropdown-content results"></div>
        </div>
    </div>
    `;

    const input = root.querySelector('input');
    const dropdown = root.querySelector('.dropdown');
    const resultsWrapper = root.querySelector('.results');


    // Now, we just have a version of "onInput" that can only actually be
    // invoked once every 'delay' seconds.
    const onInput = async (event) => {
        const items = await fetchData(event.target.value);
        // That's going to be whatever the user just typed into that 
        // input field.


        // Handling Empty Responses
        if (!items.length) {
            dropdown.classList.remove('is-active');
            return;
        }


        // clearing the dropdown menu before showing new results
        resultsWrapper.innerHTML = '';


        dropdown.classList.add('is-active');

        // let's iterate over the 'list' of items and for every
        // item that we have fetched, we're going to try to create
        // a "div element" that kind of summarizes the item.
        for (let item of items) {
            const option = document.createElement('a');

            option.classList.add('dropdown-item');
            option.innerHTML = renderOption(item);

            // Handling Item Selection
            option.addEventListener('click', () => {
                dropdown.classList.remove('is-active');
                input.value = inputValue(item);

                // Making a follow-up request
                onOptionSelect(item);
            });

            resultsWrapper.appendChild(option);
        }
    };

    input.addEventListener('input', debounce(onInput, 1000));


    // Closing the dropdown menu if the user clicks anywhere else on the
    // screen   [We'll use the CONTAINS() method here....]
    document.addEventListener('click', (event) => {
        // As we start to click arount, this is going to print a variety
        // of different elements, essentially whatever element we click on!
        // console.log(event.target);


        // checking if the click happened inside the "root" container!!
        if (!root.contains(event.target)) {
            dropdown.classList.remove('is-active');
        }
    });
};


// We're going to call this function multiple number of times and
// eventually it's going to have a bunch of Reusable Code inside it.

// Whenever we call this function, we're going to pass in some kind
// of "configuration object" and that config object is going to have
// all kinds of custom functions that specify how the AutoComplete
// should work inside of our specific application.


// Here, we're going to have just the logic that is Reusable between
// different projects.