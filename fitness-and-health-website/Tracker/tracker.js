document.addEventListener('DOMContentLoaded', createWeeklyTracker);

function initializeActivityManager() {
    const addActivityBtn = document.getElementById('addActivityBtn');
    const newActivityInput = document.getElementById('newActivityInput');

    addActivityBtn.addEventListener('click', () => {
        if (newActivityInput.value.trim()) {
            addNewActivity(newActivityInput.value.trim());
            newActivityInput.value = '';
        }
    });
}

function addNewActivity(activityName) {
    const table = document.querySelector('table');
    const headerRow = table.querySelector('thead tr');


    const newHeader = document.createElement('th');
    newHeader.scope = 'col';
    newHeader.textContent = activityName;
    headerRow.insertBefore(newHeader, headerRow.lastElementChild); // Vor "Punkte" einfügen


    const rows = table.querySelectorAll('tbody tr');
    rows.forEach(row => {
        const activityCell = document.createElement('td');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'form-check-input';
        activityCell.appendChild(checkbox);
        row.insertBefore(activityCell, row.lastElementChild); // Vor Punkte-Zelle einfügen
    });


    saveActivities();
}

function createWeeklyTracker() {
    const saveContainer = document.getElementById('tableForWeeks');
    saveContainer.innerHTML = ''; // Vorherigen Inhalt entfernen

    // Bootstrap Table mit voller Breite
    const table = document.createElement('table');
    table.className = 'table table-bordered text-center align-middle w-100';

    // Tabellenkopf
    const thead = document.createElement('thead');
    const headRow = document.createElement('tr');
    const days = ['Tag', 'Training', 'Lesen', 'Wasser', 'Punkte'];
    days.forEach(day => {
        const th = document.createElement('th');
        th.scope = 'col';
        th.textContent = day;
        headRow.appendChild(th);
    });
    thead.appendChild(headRow);
    table.appendChild(thead);

    // Tabellenkörper
    const tbody = document.createElement('tbody');
    const weekDays = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];
    weekDays.forEach(weekDay => {
        const row = document.createElement('tr');

        // Tag
        const dayCell = document.createElement('td');
        dayCell.textContent = weekDay;
        dayCell.className = 'fw-bold text-success';
        row.appendChild(dayCell);

        // Aktivitäten
        for (let i = 0; i < 3; i++) {
            const activityCell = document.createElement('td');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'form-check-input';
            activityCell.appendChild(checkbox);
            row.appendChild(activityCell);
        }

        // Punkte
        const scoreCell = document.createElement('td');
        const scoreInput = document.createElement('input');
        scoreInput.type = 'text';
        scoreInput.className = 'form-control text-center';
        scoreInput.placeholder = '0/10';
        scoreCell.appendChild(scoreInput);
        row.appendChild(scoreCell);

        tbody.appendChild(row);
    });
    table.appendChild(tbody);

    // Speichern-Button
    const saveButton = document.createElement('button');
    saveButton.className = 'btn btn-success mt-3';
    saveButton.textContent = 'Fortschritt speichern';
    saveButton.addEventListener('click', () => {
        alert('Fortschritt wurde gespeichert!');
    });

    saveContainer.appendChild(table);
    saveContainer.appendChild(saveButton);
}