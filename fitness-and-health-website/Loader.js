function loadTable() {
    // Überprüfe, ob calculateCalories existiert
    if (typeof calculateCalories !== "function") {
        console.error("Fehler: Die Funktion calculateCalories() existiert nicht!");
        return;
    }

    const totalCalories = calculateCalories();

    // Check if the totalCalories is valid
    if (isNaN(totalCalories) || totalCalories <= 0) {
        console.error("Fehler: Ungültige Kalorienanzahl:", totalCalories);
        return;
    }

    console.log("Berechnete Kalorien:", totalCalories);

    const proteinPercentage = 0.30;
    const fatPercentage = 0.25;
    const carbPercentage = 0.40;
    const fiberPercentage = 0.05;

    const proteinCalories = totalCalories * proteinPercentage;
    const fatCalories = totalCalories * fatPercentage;
    const carbCalories = totalCalories * carbPercentage;
    const fiberCalories = totalCalories * fiberPercentage;

    let container = document.getElementById('writeTable');

    // Überprüfe, ob das Element existiert
    if (!container) {
        console.error("Fehler: Element mit ID 'writeTable' nicht gefunden!");
        return;
    }

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
                                        <th style="white-space: nowrap;">Nährstoff</th>
                                        <th style="white-space: nowrap;">Kalorien</th>
                                        <th style="white-space: nowrap;">Prozent</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td style="white-space: nowrap;">Gesamtkalorien</td>
                                        <td>${totalCalories.toFixed(0)} kcal</td>
                                        <td>100%</td>
                                    </tr>
                                    <tr>
                                        <td style="white-space: nowrap;">Protein</td>
                                        <td>${proteinCalories.toFixed(0)} kcal</td>
                                        <td>30%</td>
                                    </tr>
                                    <tr>
                                        <td style="white-space: nowrap;">Fett</td>
                                        <td>${fatCalories.toFixed(0)} kcal</td>
                                        <td>25%</td>
                                    </tr>
                                    <tr>
                                        <td style="white-space: nowrap;">Kohlenhydrate</td>
                                        <td>${carbCalories.toFixed(0)} kcal</td>
                                        <td>40%</td>
                                    </tr>
                                    <tr>
                                        <td style="white-space: nowrap;">Ballaststoffe</td>
                                        <td>${fiberCalories.toFixed(0)} kcal</td>
                                        <td>5%</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    console.log("Tabelle erfolgreich generiert.");
}
