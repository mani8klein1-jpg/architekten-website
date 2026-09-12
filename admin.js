/* =========================
   ADMIN-BEREICH
   ========================= */

const API_URL = 'https://architekten-api-kj6k.onrender.com';

// ===== LOGIN =====
let authHeader = '';

document.addEventListener('DOMContentLoaded', function() {

    // Prüfen, ob bereits eingeloggt (Session Storage)
    const savedAuth = sessionStorage.getItem('adminAuth');
    if (savedAuth) {
        authHeader = savedAuth;
        showAdminPanel();
        loadFoerderungen();
    }

    // Login-Formular
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        authHeader = 'Basic ' + btoa(username + ':' + password);

        try {
            const response = await fetch(`${API_URL}/admin/foerderungen`, {
                headers: { 'Authorization': authHeader }
            });

            if (!response.ok) {
                throw new Error('Falscher Benutzername oder Passwort');
            }

            // Login erfolgreich
            sessionStorage.setItem('adminAuth', authHeader);
            document.getElementById('loginError').style.display = 'none';
            showAdminPanel();
            loadFoerderungen();

        } catch (error) {
            document.getElementById('loginError').textContent = error.message;
            document.getElementById('loginError').style.display = 'block';
        }
    });

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', function() {
        sessionStorage.removeItem('adminAuth');
        authHeader = '';
        document.getElementById('adminSection').style.display = 'none';
        document.getElementById('loginSection').style.display = 'flex';
        document.getElementById('loginForm').reset();
    });

    // Neue Förderung
    document.getElementById('newFoerderungBtn').addEventListener('click', function() {
        openModal();
    });

    // Modal schließen
    document.getElementById('modalClose').addEventListener('click', closeModal);
    document.getElementById('modalOverlay').addEventListener('click', function(e) {
        if (e.target === this) closeModal();
    });

    // Formular speichern
    document.getElementById('foerderungForm').addEventListener('submit', saveFoerderung);
});

function showAdminPanel() {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('adminSection').style.display = 'block';
}

// ===== FÖRDERUNGEN LADEN =====
async function loadFoerderungen() {
    try {
        const response = await fetch(`${API_URL}/admin/foerderungen`, {
            headers: { 'Authorization': authHeader }
        });

        if (!response.ok) throw new Error('Fehler beim Laden');

        const data = await response.json();
        renderTable(data);

    } catch (error) {
        alert('Fehler beim Laden der Förderungen: ' + error.message);
    }
}

function renderTable(data) {
    const tbody = document.getElementById('foerderungenTable');
    tbody.innerHTML = '';

    data.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.massnahme}</td>
            <td>${item.gebaeudetyp}</td>
            <td>${item.zuschuss}</td>
            <td>${item.max_foerderung ? item.max_foerderung.toLocaleString('de-DE') + ' €' : '-'}</td>
            <td>
                <button class="btn-edit" onclick="editFoerderung(${item.id})">Bearbeiten</button>
                <button class="btn-delete" onclick="deleteFoerderung(${item.id})">Löschen</button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    // Förderungen global speichern für Bearbeitung
    window.allFoerderungen = data;
}

// ===== MODAL =====
function openModal(foerderung = null) {
    document.getElementById('modalOverlay').style.display = 'flex';
    
    if (foerderung) {
        document.getElementById('modalTitle').textContent = 'Förderung bearbeiten';
        document.getElementById('foerderungId').value = foerderung.id;
        document.getElementById('name').value = foerderung.name;
        document.getElementById('massnahme').value = foerderung.massnahme;
        document.getElementById('gebaeudetyp').value = foerderung.gebaeudetyp;
        document.getElementById('zuschuss').value = foerderung.zuschuss;
        document.getElementById('details').value = foerderung.details;
        document.getElementById('max_foerderung').value = foerderung.max_foerderung || '';
    } else {
        document.getElementById('modalTitle').textContent = 'Neue Förderung';
        document.getElementById('foerderungForm').reset();
        document.getElementById('foerderungId').value = '';
    }
}

function closeModal() {
    document.getElementById('modalOverlay').style.display = 'none';
}

// ===== BEARBEITEN =====
function editFoerderung(id) {
    const foerderung = window.allFoerderungen.find(f => f.id === id);
    if (foerderung) openModal(foerderung);
}

// ===== SPEICHERN =====
async function saveFoerderung(e) {
    e.preventDefault();

    const id = document.getElementById('foerderungId').value;
    const data = {
        name: document.getElementById('name').value,
        massnahme: document.getElementById('massnahme').value,
        gebaeudetyp: document.getElementById('gebaeudetyp').value,
        zuschuss: document.getElementById('zuschuss').value,
        details: document.getElementById('details').value,
        max_foerderung: parseFloat(document.getElementById('max_foerderung').value) || null
    };

    const url = id ? `${API_URL}/admin/foerderungen/${id}` : `${API_URL}/admin/foerderungen`;
    const method = id ? 'PUT' : 'POST';

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) throw new Error('Fehler beim Speichern');

        closeModal();
        loadFoerderungen();

    } catch (error) {
        alert('Fehler beim Speichern: ' + error.message);
    }
}

// ===== LÖSCHEN =====
async function deleteFoerderung(id) {
    if (!confirm('Möchten Sie diese Förderung wirklich löschen?')) return;

    try {
        const response = await fetch(`${API_URL}/admin/foerderungen/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': authHeader }
        });

        if (!response.ok) throw new Error('Fehler beim Löschen');

        loadFoerderungen();

    } catch (error) {
        alert('Fehler beim Löschen: ' + error.message);
    }
}