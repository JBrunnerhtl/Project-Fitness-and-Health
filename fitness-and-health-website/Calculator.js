function calculateCalories() {
    // Eingabewerte holen
    const weight = parseFloat(document.getElementById('weight').value); // Gewicht (kg)
    const height = parseFloat(document.getElementById('height').value); // Größe (cm)
    const age = parseInt(document.getElementById('age').value); // Alter (Jahre)
    const gender = document.getElementById('gender').value; // Geschlecht
    const activityLevel = document.getElementById('activity-level').value; // Aktivitätslevel
    const resultField = document.getElementById('result'); // Das Feld für das Ergebnis

    let calories;

    // Überprüfen, ob alle erforderlichen Felder gültige Werte enthalten
    if (isNaN(weight) || isNaN(height) || isNaN(age) || gender === "" || activityLevel === "") {
        resultField.value = "Bitte gib gültige Werte ein!"; // Fehlermeldung, falls Werte fehlen oder ungültig sind
        return; // Verhindert die Berechnung, falls Eingabefelder ungültige Werte enthalten
    }

    // Berechnung der Kalorien basierend auf dem Geschlecht
    if (gender === 'Männlich') {
        calories = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
        calories = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    // Aktivitätslevel berücksichtigen
    switch (activityLevel) {
        case 'low':
            calories *= 1.2; // Wenig aktiv
            break;
        case 'moderate':
            calories *= 1.55; // Mittel aktiv
            break;
        case 'high':
            calories *= 1.725; // Sehr aktiv
            break;
    }

    // Den berechneten Kalorienbedarf in das "result"-Feld setzen
    resultField.value = calories.toFixed(2) + " Kalorien"; // Ausgabe mit zwei Dezimalstellen
    console.log(calories)
}