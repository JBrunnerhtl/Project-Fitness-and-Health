function loadTable() {


    const calories = calculateCalories(); // Falls diese Funktion benötigt wird

    let container = document.createElement("div");
    container.className = "container my-5";
    container.style.width = "100%";
    // Setze den HTML-Inhalt dynamisch
    container.innerHTML = `
    <!-- Diabetes -->
    <div class="row mb-5 gy-4" >
       
       
        <div class="col-lg-8 col-md-6 col-12">
            <div class="card shadow">
                <div class="card-body bg-dark text-light">
                    <h5 class="card-title" style="margin-right: 2%">Dein Ehrnährungsplan</h5>
                    <div class="table-responsive" style="overflow-x: auto;">
                        <table class="table table-dark table-striped m-0" style="table-layout: auto; width: 100%;">
                            <thead>
                                <tr>
                                    <th style="white-space: nowrap;">Mahlzeit</th>
                                    <th style="white-space: nowrap;">Beispiel</th>
                                    <th style="white-space: nowrap;">Hinweis</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style="white-space: nowrap;">Frühstück</td>
                                    <td>Haferbrei mit Mandeln und Beeren</td>
                                    <td>Haferflocken haben einen niedrigen GI und bieten langanhaltende Energie.</td>
                                </tr>
                                <tr>
                                    <td style="white-space: nowrap;">Mittagessen</td>
                                    <td>Gegrilltes Hähnchen mit Quinoa und Gemüse</td>
                                    <td>Quinoa ist eine ausgezeichnete Quelle für komplexe Kohlenhydrate und Ballaststoffe.</td>
                                </tr>
                                <tr>
                                    <td style="white-space: nowrap;">Abendessen</td>
                                    <td>Gebratener Lachs mit Zucchini-Nudeln</td>
                                    <td>Omega-3-Fettsäuren im Lachs unterstützen die Herzgesundheit.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;

    // Finde das Element mit der ID "firstTable"
    let firstTable = document.getElementById("firstTable");

    // Falls das Element existiert, füge den neuen Container davor ein
    if (firstTable) {
        console.log('yes')
        firstTable.parentNode.insertBefore(container, firstTable);
    }
}