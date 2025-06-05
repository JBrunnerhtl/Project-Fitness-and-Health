document.addEventListener('DOMContentLoaded', () => {
    initializeTracker();
});

function initializeTracker() {
    createWeeklyTable();
    setupEventListeners();
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
}

function handleNewGoal(inputField) {
    const goalName = inputField.value.trim();
    if (goalName) {
        addNewGoal(goalName);
        inputField.value = '';
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

    saveGoals();
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

function saveGoals() {
    const table = document.querySelector('table');
    if (!table) return;

    const headers = Array.from(table.querySelectorAll('thead th'))
        .map(th => th.textContent)
        .filter(text => text !== 'Tag' && text !== 'Punkte');

    localStorage.setItem('trackerGoals', JSON.stringify(headers));
}

function loadGoals() {
    const savedGoals = localStorage.getItem('trackerGoals');
    if (savedGoals) {
        JSON.parse(savedGoals).forEach(goal => {
            if (goal !== 'Training' && goal !== 'Lesen' && goal !== 'Wasser') {
                addNewGoal(goal);
            }
        });
    }
}