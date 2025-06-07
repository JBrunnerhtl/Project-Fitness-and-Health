
async function saveTrackerData(userId, data) {
    try {
        const response = await fetch('/api/tracker/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: userId,
                data: data
            })
        });

        if (!response.ok) {
            throw new Error('Fehler beim Speichern');
        }

        return await response.json();
    } catch (error) {
        console.error('Fehler beim Speichern:', error);
        alert('Fehler beim Speichern der Daten');
    }
}

async function loadTrackerData(userId) {
    try {
        const response = await fetch(`/api/tracker/load?userId=${userId}`);

        if (!response.ok) {
            throw new Error('Fehler beim Laden');
        }

        return await response.json();
    } catch (error) {
        console.error('Fehler beim Laden:', error);
        alert('Fehler beim Laden der Daten');
        return null;
    }
}