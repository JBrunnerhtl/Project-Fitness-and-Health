let currentUserId = null;

document.addEventListener('DOMContentLoaded', () => {
    initializeTracker();
});

function initializeTracker() {
    createWeeklyTable();
    setupEventListeners();
    loadGoals(); // Lade gespeicherte Ziele aus dem localStorage
}

function createWeeklyTable() {
    const tableContainer = document.getElementById('tableForWeeks');
    if (!tableContainer) return;

    const table = createElement('table', {
        className: 'table table-bordered'
    });

    const thead = createElement('thead');
    const headerRow = createTableHeader();
    thead.appendChild(headerRow);

    const tbody = createElement('tbody');
    createTableBody(tbody);

    table.append(thead, tbody);
    tableContainer.appendChild(table);
}

function createTableHeader() {
    const headerRow = createElement('tr');

    // Standard-Spalten
    const headers = ['Tag', 'Training', 'Lesen', 'Wasser', 'Punkte'];
    headers.forEach(text => {
        const th = createElement('th', {
            scope: 'col',
            textContent: text,
            className: 'text-center'
        });
        headerRow.appendChild(th);
    });

    return headerRow;
}

function createTableBody(tbody) {
    const weekdays = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];

    weekdays.forEach(day => {
        const row = createElement('tr');

        // Tag
        const dayCell = createElement('td', {
            textContent: day,
            className: 'text-center'
        });
        row.appendChild(dayCell);

        // Standard-Aktivitäten (Training, Lesen, Wasser)
        for (let i = 0; i < 3; i++) {
            const cell = createElement('td', {
                className: 'text-center'
            });
            const checkbox = createElement('input', {
                type: 'checkbox',
                className: 'form-check-input'
            });
            cell.appendChild(checkbox);
            row.appendChild(cell);
        }

        const pointsCell = createElement('td', {
            className: 'text-center'
        });
        const pointsInput = createElement('input', {
            type: 'text',
            className: 'form-control mx-auto',
            value: '0',
            style: 'width: 60px;'
        });
        pointsCell.appendChild(pointsInput);
        row.appendChild(pointsCell);

        tbody.appendChild(row);
    });
}

function setupEventListeners() {
    const addButton = document.getElementById('addGoalBtn');
    const inputField = document.getElementById('newGoalInput');

    if (addButton && inputField) {
        addButton.addEventListener('click', () => {
            handleNewGoal(inputField);
        });

        inputField.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                handleNewGoal(inputField);
            }
        });
    }

    // Füge Event-Listener für Änderungen hinzu
    document.addEventListener('change', (event) => {
        if (event.target.matches('input[type="checkbox"]') ||
            event.target.matches('input[type="text"]')) {
            saveTableState();
        }
    });
}

function handleNewGoal(inputField) {
    const goalName = inputField.value.trim();
    if (goalName) {
        addNewGoal(goalName);
        inputField.value = '';
        saveTableState();
    }
}

function addNewGoal(goalName) {
    const table = document.querySelector('table');
    if (!table) return;

    const headerRow = table.querySelector('thead tr');
    const pointsHeader = headerRow.lastElementChild;
    const newHeader = createElement('th', {
        scope: 'col',
        textContent: goalName,
        className: 'text-center'
    });
    headerRow.insertBefore(newHeader, pointsHeader);

    const rows = table.querySelectorAll('tbody tr');
    rows.forEach(row => {
        const pointsCell = row.lastElementChild;
        const newCell = createElement('td', {
            className: 'text-center'
        });
        const checkbox = createElement('input', {
            type: 'checkbox',
            className: 'form-check-input'
        });
        newCell.appendChild(checkbox);
        row.insertBefore(newCell, pointsCell);
    });
}

function createElement(tag, options = {}) {
    const element = document.createElement(tag);
    Object.entries(options).forEach(([key, value]) => {
        if (key === 'style') {
            element.style.cssText = value;
        } else {
            element[key] = value;
        }
    });
    return element;
}

function saveTableState() {
    const table = document.querySelector('table');
    if (!table) return;

    const data = {
        goals: getGoalsFromTable(),
        entries: getTableEntries()
    };

    localStorage.setItem('trackerData', JSON.stringify(data));
}

function getGoalsFromTable() {
    const headers = Array.from(document.querySelectorAll('thead th'));
    return headers
        .map(th => th.textContent)
        .filter(text => text !== 'Tag' && text !== 'Punkte');
}

function getTableEntries() {
    const rows = Array.from(document.querySelectorAll('tbody tr'));
    return rows.map(row => {
        const cells = Array.from(row.children);
        return {
            day: cells[0].textContent,
            checkboxes: Array.from(row.querySelectorAll('input[type="checkbox"]'))
                .map(cb => cb.checked),
            points: cells[cells.length - 1].querySelector('input').value
        };
    });
}

function loadGoals() {
    const savedData = localStorage.getItem('trackerData');
    if (savedData) {
        const data = JSON.parse(savedData);

        // Füge gespeicherte Ziele hinzu
        data.goals.forEach(goal => {
            if (!['Training', 'Lesen', 'Wasser'].includes(goal)) {
                addNewGoal(goal);
            }
        });


        const rows = document.querySelectorAll('tbody tr');
        data.entries.forEach((entry, rowIndex) => {
            const row = rows[rowIndex];
            if (row) {
                const checkboxes = row.querySelectorAll('input[type="checkbox"]');
                entry.checkboxes.forEach((checked, cbIndex) => {
                    if (checkboxes[cbIndex]) {
                        checkboxes[cbIndex].checked = checked;
                    }
                });

                const pointsInput = row.querySelector('input[type="text"]');
                if (pointsInput) {
                    pointsInput.value = entry.points;
                }
            }
        });
    }
}