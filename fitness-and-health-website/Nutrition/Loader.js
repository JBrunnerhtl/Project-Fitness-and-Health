function loadTable(nutritionData) {

    const container = document.getElementById('writeTable');
    const statusMessage = document.getElementById('statusMessage');


    if (!container) {
        console.error("Fehler: Element mit ID 'writeTable' nicht gefunden!");
        if (statusMessage) {
            statusMessage.textContent = "Fehler: Tabellen-Container (writeTable) nicht gefunden.";
            statusMessage.style.color = 'red';
        }
        return;
    }


    if (!nutritionData || typeof nutritionData.calories !== 'number' || isNaN(nutritionData.calories) || nutritionData.calories <= 0) {
        console.error("Fehler: Ungültige oder fehlende Nährwertdaten empfangen:", nutritionData);
        if (statusMessage) {
            statusMessage.textContent = "Fehler beim Abrufen der Nährwertdaten.";
            statusMessage.style.color = 'red';
        }

        container.innerHTML = '';
        container.className = "";
        return;
    }

    console.log("Nährwertdaten zum Anzeigen:", nutritionData);


    const totalCalories = nutritionData.calories || 0;
    const proteinCalories = nutritionData.proteinCalories || 0;
    const fatCalories = nutritionData.fatCalories || 0;
    const carbCalories = nutritionData.carbCalories || 0;
    const fiberCalories = nutritionData.fiberCalories || 0;


    const proteinPercentage = totalCalories > 0 ? ((proteinCalories / totalCalories) * 100).toFixed(0) : 0;
    const fatPercentage = totalCalories > 0 ? ((fatCalories / totalCalories) * 100).toFixed(0) : 0;
    const carbPercentage = totalCalories > 0 ? ((carbCalories / totalCalories) * 100).toFixed(0) : 0;
    const fiberPercentage = totalCalories > 0 ? ((fiberCalories / totalCalories) * 100).toFixed(0) : 0;


    container.className = "container my-5";

    container.innerHTML = `
        <div class="row mb-5 gy-4">
            <div class="col-12">
                <div class="card shadow">
                    <div class="card-body bg-dark text-light">
                        <h5 class="card-title text-center mb-4">Täglicher Kalorienbedarf und Nährstoffverteilung</h5>
                        <div class="table-responsive">
                            <table class="table table-dark table-striped m-0 w-100">
                                <thead>
                                    <tr>
                                        <th style="white-space: nowrap;" class = "translate-text">Nährstoff</th>
                                        <th style="white-space: nowrap;" class = "translate-text">Kalorien (kcal)</th>
                                        <th style="white-space: nowrap; class = "translate-text">Prozent (%)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td style="white-space: nowrap;" class = "translate-text">Gesamtkalorien</td>
                                        <td>${totalCalories.toFixed(0)} kcal</td>
                                        <td>100%</td>
                                    </tr>
                                    <tr>
                                        <td style="white-space: nowrap;" class = "translate-text">Protein</td>
                                        <td>${proteinCalories.toFixed(0)} kcal</td>
                                        <td>${proteinPercentage}%</td>
                                    </tr>
                                    <tr>
                                        <td style="white-space: nowrap;" class = "translate-text">Fett</td>
                                        <td>${fatCalories.toFixed(0)} kcal</td>
                                        <td>${fatPercentage}%</td>
                                    </tr>
                                    <tr>
                                        <td style="white-space: nowrap;" class = "translate-text">Kohlenhydrate</td>
                                        <td>${carbCalories.toFixed(0)} kcal</td>
                                        <td>${carbPercentage}%</td>
                                    </tr>
                                    <tr>
                                        <td style="white-space: nowrap;" class = "translate-text">Ballaststoffe</td>
                                        <td>${fiberCalories.toFixed(0)} kcal</td>
                                        <td>${fiberPercentage}%</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;


    container.scrollIntoView({ behavior: 'smooth', block: 'start' });

    console.log("Tabelle erfolgreich generiert.");
}