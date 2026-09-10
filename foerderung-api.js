/* =========================
   FÖRDERUNGS-CHECK – MIT API
   ========================= */

document.addEventListener('DOMContentLoaded', function() {

    const form = document.getElementById('foerderForm');
    const ergebnisBox = document.getElementById('ergebnis');
    const ergebnisInhalt = document.getElementById('ergebnisInhalt');
    const zurueckBtn = document.getElementById('zurueckBtn');

    // API-URL (wenn Backend läuft)
    const API_URL = 'https://architekten-api-kj6k.onrender.com';

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const massnahme = document.getElementById('bauvorhaben').value;
        const gebaeudetyp = document.getElementById('gebaeudetyp').value;
        const baujahr = parseInt(document.getElementById('baujahr').value);

        if (!massnahme || !gebaeudetyp || !baujahr) {
            alert('Bitte füllen Sie alle Felder aus.');
            return;
        }

        if (baujahr < 1900 || baujahr > 2026) {
            alert('Bitte geben Sie ein gültiges Baujahr ein (1900-2026).');
            return;
        }

        try {
            // API aufrufen
            const response = await fetch(`${API_URL}/foerderungen/check`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    massnahme: massnahme,
                    gebaeudetyp: gebaeudetyp
                })
            });

            if (!response.ok) {
                throw new Error('Keine Förderungen gefunden.');
            }

            const data = await response.json();

            // Ergebnis anzeigen
            showResult(data, gebaeudetyp, baujahr);

        } catch (error) {
            ergebnisInhalt.innerHTML = `<p style="color:#d32f2f;">❌ ${error.message}</p>`;
            form.style.display = 'none';
            ergebnisBox.style.display = 'block';
            window.scrollTo({ top: ergebnisBox.offsetTop - 100, behavior: 'smooth' });
        }
    });

    function showResult(data, gebaeudetyp, baujahr) {
        let html = `<ul>`;

        data.forEach(item => {
            html += `<li>
                        <span class="label">📋 Maßnahme</span>
                        <span class="value">${item.name}</span>
                     </li>`;
            html += `<li>
                        <span class="label">💰 Förderung</span>
                        <span class="value">${item.zuschuss} <span class="badge">möglich</span></span>
                     </li>`;
            html += `<li>
                        <span class="label">📄 Details</span>
                        <span class="value">${item.details}</span>
                     </li>`;
        });

        // Hinweis je nach Gebäudetyp
        if (gebaeudetyp === 'mehrfamilienhaus') {
            html += `<li>
                        <span class="label">🏢 Hinweis (Mehrfamilienhaus)</span>
                        <span class="hinweis">Bei Mehrfamilienhäusern sind oft höhere Fördersummen möglich.</span>
                     </li>`;
        } else if (gebaeudetyp === 'gewerbe') {
            html += `<li>
                        <span class="label">🏢 Hinweis (Gewerbe)</span>
                        <span class="hinweis">Für Gewerbeimmobilien gelten spezielle Förderprogramme.</span>
                     </li>`;
        }

        if (baujahr < 1990) {
            html += `<li>
                        <span class="label">📅 Hinweis (Baujahr)</span>
                        <span class="hinweis">Bei Baujahren vor 1990 sind oft hohe Einsparpotenziale möglich.</span>
                     </li>`;
        }

        html += `</ul>`;
        html += `<div class="hinweis-text">📌 Dies ist eine erste Einschätzung. Für eine verbindliche Beratung kontaktieren Sie uns bitte.</div>`;

        ergebnisInhalt.innerHTML = html;
        form.style.display = 'none';
        ergebnisBox.style.display = 'block';
        window.scrollTo({ top: ergebnisBox.offsetTop - 100, behavior: 'smooth' });
    }

    zurueckBtn.addEventListener('click', function() {
        ergebnisBox.style.display = 'none';
        form.style.display = 'block';
        window.scrollTo({ top: form.offsetTop - 100, behavior: 'smooth' });
    });

});