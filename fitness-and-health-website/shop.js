const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': '5df1f52fd4mshc8d2ad2b5cf104bp1de614jsn051b11ab2c0a', // Ersetze durch deinen Key
        'X-RapidAPI-Host': 'rapidapi.com' // Host deiner API
    }
};

fetch('https://rapidapi.com/ltdbilgisam/api/ai-workout-planner-exercise-fitness-nutrition-guide/playground/apiendpoint_ba5790d3-27ad-4bbc-8fa0-622267ac9316', options)
    .then(response => response.json())
   .then(data => {
        console.log(data);
    })
    .catch(err => console.log(err));
console.log(options)

console.log('warum geht keine commit');