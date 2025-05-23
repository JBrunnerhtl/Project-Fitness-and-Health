function createWeeklyTracker() {
    const container = document.createElement('div');
    container.className = 'tracker-container';


    const header = document.createElement('h2');
    header.className = 'tracker-header';
    header.textContent = 'Wochen-Tracker';
    container.appendChild(header);


    const grid = document.createElement('div');
    grid.className = 'tracker-grid';


    const days = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];
    const activities = ['Training', 'Lesen', 'Wasser'];


    const dayLabel = document.createElement('div');
    dayLabel.className = 'tracker-label';
    dayLabel.textContent = 'Tag';
    grid.appendChild(dayLabel);

    activities.forEach(activity => {
        const activityLabel = document.createElement('div');
        activityLabel.className = 'tracker-label';
        activityLabel.textContent = activity;
        grid.appendChild(activityLabel);
    });

    const scoreLabel = document.createElement('div');
    scoreLabel.className = 'tracker-label';
    scoreLabel.textContent = 'Punkte';
    grid.appendChild(scoreLabel);


    days.forEach(day => {

        const dayCell = document.createElement('div');
        dayCell.className = 'tracker-day';
        dayCell.textContent = day;
        grid.appendChild(dayCell);


        activities.forEach(() => {
            const checkboxCell = document.createElement('div');
            checkboxCell.className = 'tracker-checkbox';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';

            checkboxCell.appendChild(checkbox);
            grid.appendChild(checkboxCell);
        });


        const scoreCell = document.createElement('div');
        scoreCell.className = 'tracker-score';

        const scoreInput = document.createElement('input');
        scoreInput.type = 'text';
        scoreInput.className = 'form-control';
        scoreInput.placeholder = '0/10';

        scoreCell.appendChild(scoreInput);
        grid.appendChild(scoreCell);
    });


    const saveButton = document.createElement('button');
    saveButton.className = 'btn-tracker';
    saveButton.textContent = 'Fortschritt speichern';


    saveButton.addEventListener('click', () => {
        alert('Fortschritt wurde gespeichert!');
    });

    container.appendChild(grid);
    container.appendChild(saveButton);


    document.body.appendChild(container);
}


document.addEventListener('DOMContentLoaded', createWeeklyTracker);