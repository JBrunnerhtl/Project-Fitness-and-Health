

async function getRecipesForProtein() {

    const apiKey = "824f5b8c655b400a99d93a9f4e841ed0";
    let proteins = document.getElementById('weight').value ;
    const activityLevel = document.getElementById('activity-level').value;
    if(activityLevel === "moderate") {
        proteins *= 1.6;
    }
    else if(activityLevel === "high") {
        proteins *= 2.2;
    }
    console.log(proteins);
    const header = "recipes";
    const url = `https://api.spoonacular.com/${header}/complexSearch?maxProtein=${proteins}&apiKey=${apiKey}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Fehler: ${response.status}`);
        }
        const data = await response.json();
        console.log(data); // Rezepte ausgeben
        const container = document.getElementById('foodTable');
        data.results.forEach(recipe => { // Result is the array of recipes

        })
    } catch (error) {
        console.error("API-Fehler:", error);
    }
}




async function getRecipesForCarbs() {

}
async function getRecipesForFat() {

}



