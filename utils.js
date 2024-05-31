// The idea behind this file is that we are going to place any Utility
// Functions that we create inside of here just so we can better
// organize the code inside our Project.


// Debounce Helper Function
const debounce = (func, delay = 1000) => {
    let timeoutID;

    // Wrapper Function (shields and guards the 'func' function from 
    // frequent calls and decides how often 'func' can be invoked)
    return (...args) => {
        if(timeoutID)
        {
            clearTimeout(timeoutID);
        }

        timeoutID = setTimeout(() => {
            func.apply(null, args);
        }, delay);
    };
};