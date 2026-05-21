// Mobile Hamburger Trigger Rule
function toggleMenu() {
    document.getElementById('navMenu').classList.toggle('active');
}

// 5 Times Logo Click Automation to open Admin Panel Trigger
let clickCounts = 0;
document.querySelector('.logo').addEventListener('click', () => {
    clickCounts++;
    if (clickCounts >= 5) {
        openAdminGate();
        clickCounts = 0;
    }
});

// Admin Button top trigger option
document.querySelector('.admin-trigger').addEventListener('click', openAdminGate);

function openAdminGate() {
    document.getElementById('adminGate').style.display = 'flex';
    document.getElementById('adminPasswordInput').focus();
}

function closeAdminGate() {
    document.getElementById('adminGate').style.display = 'none';
    document.getElementById('adminPasswordInput').value = '';
}

// Security core check verification as requested
function validateAdminLogin() {
    const inputToken = document.getElementById('adminPasswordInput').value;
    if (inputToken === 'adminlegend12345') {
        closeAdminGate();
        document.getElementById('adminDashboard').style.display = 'flex';
        syncDatabaseEngine();
    } else {
        alert('SECURITY ERROR: Unauthorized Authentication Token.');
    }
}

function logoutAdmin() {
    document.getElementById('adminDashboard').style.display = 'none';
}

// Tabs Router Switcher System
function switchAdminTab(index) {
    const links = document.querySelectorAll('.tab-link');
    const panes = document.querySelectorAll('.admin-content-pane');
    
    links.forEach(l => l.classList.remove('active'));
    panes.forEach(p => p.classList.remove('active'));
    
    links[index].classList.add('active');
    panes[index].classList.add('active');
}

// Local Database Storage logic for zero-server environment (Vercel Ready)
function fetchLocalDB() {
    return JSON.parse(localStorage.getItem('legend_cyber_projects')) || [];
}

function saveLocalDB(arrayData) {
    localStorage.setItem('legend_cyber_projects', JSON.stringify(arrayData));
    syncDatabaseEngine();
}

// Sync values to view interface cards instantly
function syncDatabaseEngine() {
    const dataStack = fetchLocalDB();
    document.getElementById('totalProjCount').innerText = dataStack.length;

    // Admin Manage List setup Render
    const manageContainer = document.getElementById('adminManageList');
    if (dataStack.length === 0) {
        manageContainer.innerHTML = `<p style="font-size:12px; color:var(--text-muted)">No projects in stack database.</p>`;
    } else {
        manageContainer.innerHTML = '';
        dataStack.forEach((item, idx) => {
            manageContainer.innerHTML += `
                <div class="manage-item">
                    <div>
                        <strong>${item.title}</strong>
                    </div>
                    <button class="btn-del" onclick="removeProjectRecord(${idx})">Delete</button>
                </div>
            `;
        });
    }

    // Public Display Render
    const publicContainer = document.getElementById('publicProjectsDisplay');
    if (dataStack.length === 0) {
        publicContainer.innerHTML = `<div class="empty-state">No projects yet. Add some from the admin panel!</div>`;
    } else {
        publicContainer.innerHTML = '';
        dataStack.forEach(item => {
            publicContainer.innerHTML += `
                <div class="dynamic-project-card">
                    <img src="${item.imgUrl}" alt="${item.title}">
                    <div class="project-details">
                        <h4>${item.title}</h4>
                        <p>${item.desc}</p>
                    </div>
                </div>
            `;
        });
    }
}

// Insert Add Item Command logic
function addNewProjectData() {
    const title = document.getElementById('newProjTitle').value.trim();
    const imgUrl = document.getElementById('newProjImgUrl').value.trim();
    const desc = document.getElementById('newProjDesc').value.trim();

    if (!title || !imgUrl || !desc) {
        alert('Error: Please complete all parameter fields.');
        return;
    }

    const currentDB = fetchLocalDB();
    currentDB.push({ title, imgUrl, desc });
    saveLocalDB(currentDB);

    // Form inputs Reset
    document.getElementById('newProjTitle').value = '';
    document.getElementById('newProjImgUrl').value = '';
    document.getElementById('newProjDesc').value = '';

    alert('Successfully added!');
    switchAdminTab(2); // Redirect back to check manage view tab list
}

// Remove rule block item command
function removeProjectRecord(index) {
    if (confirm('Delete this project item?')) {
        const currentDB = fetchLocalDB();
        currentDB.splice(index, 1);
        saveLocalDB(currentDB);
    }
}

// Init system check loop on setup load
window.addEventListener('DOMContentLoaded', syncDatabaseEngine);
