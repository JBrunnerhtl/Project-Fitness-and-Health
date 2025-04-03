
const apiKey = "824f5b8c655b400a99d93a9f4e841ed0"; // Ersetze dies mit deinem echten API-Schlüssel
let proteins = document.getElementById('weight') *1.6; // Suchbegriff für das Rezept
const header = "recipes";

async function getRecipesForProtein() {
    const url = `https://api.spoonacular.com/${header}/complexSearch?maxProtein=${proteins}&apiKey=${apiKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Fehler: ${response.status}`);
        }
        const data = await response.json();
        console.log(data); // Rezepte ausgeben

    } catch (error) {
        console.error("API-Fehler:", error);
    }
}

getRecipesForProtein().then();


async function getRecipesForCarbs() {

}
async function getRecipesForFat() {

}



