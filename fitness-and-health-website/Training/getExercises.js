const url = 'https://exercises-by-api-ninjas.p.rapidapi.com/v1/exercises?muscle=biceps'; // Muskelname kann angepasst werden
const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': '97e4f4d119msh97f5a1b0b13597bp181c37jsn8dd0583bd943',  // <-- Hier deinen API-Key eintragen
        'X-RapidAPI-Host': 'exercises-by-api-ninjas.p.rapidapi.com'
    }
};
/*
fetch(url, options)
    .then(response => console.log(response.json()))*/