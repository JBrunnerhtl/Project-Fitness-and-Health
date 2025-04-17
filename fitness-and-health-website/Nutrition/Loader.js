function loadTable(nutritionData) {
    // Input data is passed as an argument 'nutritionData'
    // Example: { calories: 1800, proteinCalories: 540, fatCalories: 450, carbCalories: 720, fiberCalories: 90 }

    const container = document.getElementById('writeTable');
    const statusMessage = document.getElementById('statusMessage'); // To display errors if needed

    // --- Error Handling: Check if container exists ---
    if (!container) {
        console.error("Fehler: Element mit ID 'writeTable' nicht gefunden!");
        if (statusMessage) { // Display error to user if status element exists
            statusMessage.textContent = "Fehler: Tabellen-Container (writeTable) nicht gefunden.";
            statusMessage.style.color = 'red';
        }
        return; // Stop execution if container is missing
    }

    // --- Error Handling: Check if valid data was received ---
    if (!nutritionData || typeof nutritionData.calories !== 'number' || isNaN(nutritionData.calories) || nutritionData.calories <= 0) {
        console.error("Fehler: Ungültige oder fehlende Nährwertdaten empfangen:", nutritionData);
        if (statusMessage) { // Display error to user
            statusMessage.textContent = "Fehler beim Abrufen der Nährwertdaten.";
            statusMessage.style.color = 'red';
        }
        // Clear previous table content if any, and remove styling class
        container.innerHTML = '';
        container.className = "";
        return; // Stop execution if data is invalid
    }

    console.log("Nährwertdaten zum Anzeigen:", nutritionData);

    // --- Prepare data for display ---
    // Use received values, provide 0 as fallback just in case (though AI should return them)
    const totalCalories = nutritionData.calories || 0;
    const proteinCalories = nutritionData.proteinCalories || 0;
    const fatCalories = nutritionData.fatCalories || 0;
    const carbCalories = nutritionData.carbCalories || 0;
    const fiberCalories = nutritionData.fiberCalories || 0;

    // Calculate percentages based on received calories for display consistency
    // Avoid division by zero if totalCalories is 0
    const proteinPercentage = totalCalories > 0 ? ((proteinCalories / totalCalories) * 100).toFixed(0) : 0;
    const fatPercentage = totalCalories > 0 ? ((fatCalories / totalCalories) * 100).toFixed(0) : 0;
    const carbPercentage = totalCalories > 0 ? ((carbCalories / totalCalories) * 100).toFixed(0) : 0;
    const fiberPercentage = totalCalories > 0 ? ((fiberCalories / totalCalories) * 100).toFixed(0) : 0;

    // --- Generate Table HTML ---
    // Apply container styling
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
                                        <th style="white-space: nowrap;">Kalorien (kcal)</th>
                                        <th style="white-space: nowrap;">Prozent (%)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td style="white-space: nowrap;">Gesamtkalorien</td>
                                        <td>${totalCalories.toFixed(0)}</td>
                                        <td>100%</td>
                                    </tr>
                                    <tr>
                                        <td style="white-space: nowrap;">Protein</td>
                                        <td>${proteinCalories.toFixed(0)}</td>
                                        <td>${proteinPercentage}%</td>
                                    </tr>
                                    <tr>
                                        <td style="white-space: nowrap;">Fett</td>
                                        <td>${fatCalories.toFixed(0)}</td>
                                        <td>${fatPercentage}%</td>
                                    </tr>
                                    <tr>
                                        <td style="white-space: nowrap;">Kohlenhydrate</td>
                                        <td>${carbCalories.toFixed(0)}</td>
                                        <td>${carbPercentage}%</td>
                                    </tr>
                                    <tr>
                                        <td style="white-space: nowrap;">Ballaststoffe</td>
                                        <td>${fiberCalories.toFixed(0)}</td>
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

    // --- Scroll to the generated table ---
    // Use 'start' to align the top of the container with the top of the visible area
    container.scrollIntoView({ behavior: 'smooth', block: 'start' });

    console.log("Tabelle erfolgreich generiert.");
}