/* =========================
   FÖRDERUNGS-CHECK
   ========================= */

document.addEventListener('DOMContentLoaded', function() {

    const form = document.getElementById('foerderForm');
    const ergebnisBox = document.getElementById('ergebnis');
    const ergebnisInhalt = document.getElementById('ergebnisInhalt');
    const zurueckBtn = document.getElementById('zurueckBtn');

    const foerderdaten = {
        'dach': {
            name: 'Dachdämmung',
            foerderung: 'BAFA - 20% Zuschuss',
            details: 'Förderung für Dämmung von Dach und oberster Geschossdecke. Voraussetzung: Fachbetrieb.'
        },
        'heizung': {
            name: 'Heizungstausch',
            foerderung: 'KfW - bis zu 35% Zuschuss',
            details: 'Förderung für den Austausch alter Heizungen gegen klimafreundliche Alternativen (Wärmepumpe, Biomasse).'
        },
        'fenster': {
            name: 'Fenster austauschen',
            foerderung: 'BAFA - 15% Zuschuss',
            details: 'Förderung für den Austausch gegen energieeffiziente Fenster mit U-Wert < 1,0.'
        },
        'gebaeudehuelle': {
            name: 'Gebäudehülle dämmen',
            foerderung: 'BAFA - 20% Zuschuss + KfW-Darlehen',
            details: 'Förderung für Außenwand-, Dach- und Kellerdeckendämmung. Kombinierbar mit KfW-Darlehen.'
        },
        'neubau': {
            name: 'Energieeffizienter Neubau',
            foerderung: 'KfW - bis zu 150.000 € Darlehen',
            details: 'KfW-Förderung für Neubauten mit hohem Energieeffizienz-Standard (KfW 40, 40 Plus).'
        }
    };

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const bauvorhaben = document.getElementById('bauvorhaben').value;
        const gebaeudetyp = document.getElementById('gebaeudetyp').value;
        const baujahr = parseInt(document.getElementById('baujahr').value);

        if (!bauvorhaben || !gebaeudetyp || !baujahr) {
            alert('Bitte füllen Sie alle Felder aus.');
            return;
        }

        if (baujahr < 1900 || baujahr > 2026) {
            alert('Bitte geben Sie ein gültiges Baujahr ein (1900-2026).');
            return;
        }

        // Ergebnis generieren
        const daten = foerderdaten[bauvorhaben];
        if (!daten) {
            ergebnisInhalt.innerHTML = '<p>Zu diesem Vorhaben haben wir noch keine Förderdaten. Kontaktieren Sie uns für eine individuelle Beratung.</p>';
        } else {
           let html = `<ul>`;

    // Maßnahme
    html += `<li>
                <span class="label">📋 Maßnahme</span>
                <span class="value">${daten.name}</span>
             </li>`;

    // Förderung
    html += `<li>
                <span class="label">💰 Förderung</span>
                <span class="value">${daten.foerderung} <span class="badge">möglich</span></span>
             </li>`;

    // Details
    html += `<li>
                <span class="label">📄 Details</span>
                <span class="value">${daten.details}</span>
             </li>`;

    // Hinweis je nach Gebäudetyp
    if (gebaeudetyp === 'mehrfamilienhaus') {
        html += `<li>
                    <span class="label">🏢 Hinweis (Mehrfamilienhaus)</span>
                    <span class="hinweis">Bei Mehrfamilienhäusern sind oft höhere Fördersummen möglich. Fragen Sie uns nach den genauen Konditionen.</span>
                 </li>`;
    } else if (gebaeudetyp === 'gewerbe') {
        html += `<li>
                    <span class="label">🏢 Hinweis (Gewerbe)</span>
                    <span class="hinweis">Für Gewerbeimmobilien gelten spezielle Förderprogramme. Wir beraten Sie gerne individuell.</span>
                 </li>`;
    }

    // Hinweis je nach Baujahr
    if (baujahr < 1990) {
        html += `<li>
                    <span class="label">📅 Hinweis (Baujahr)</span>
                    <span class="hinweis">Bei Baujahren vor 1990 sind oft hohe Einsparpotenziale möglich. Eine Sanierung lohnt sich besonders.</span>
                 </li>`;
    }

    html += `</ul>`;

    html += `<div class="hinweis-text">📌 Dies ist eine erste Einschätzung. Für eine verbindliche Beratung kontaktieren Sie uns bitte.</div>`;

    ergebnisInhalt.innerHTML = html;
        }

        form.style.display = 'none';
        ergebnisBox.style.display = 'block';
        window.scrollTo({ top: ergebnisBox.offsetTop - 100, behavior: 'smooth' });
    });

    zurueckBtn.addEventListener('click', function() {
        ergebnisBox.style.display = 'none';
        form.style.display = 'block';
        window.scrollTo({ top: form.offsetTop - 100, behavior: 'smooth' });
    });

});