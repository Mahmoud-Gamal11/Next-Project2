

        // --- Data Storage ---
        let attendanceRecords = JSON.parse(localStorage.getItem('attendanceRecords') || '[]');
        let checkedInEmployee = null;

        // --- Utility Functions ---
        function formatTime(date) {
            if (!date) return '';
            const d = new Date(date);
            return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
        }
        function formatDate(date) {
            if (!date) return '';
            const d = new Date(date);
            return d.toLocaleDateString();
        }
        function getStatus(checkInDate) {
            const d = new Date(checkInDate);
            const hour = d.getHours();
            // const min = d.getMinutes();
            if (hour <= 20) return 'Present';
            if (hour > 8 && hour <= 9) return 'Present';
            if (hour > 9 && hour <= 10) return 'Late';
            return 'Absent';
        }
        window.addEventListener('storage', function(e) {
    if (e.key === 'attendanceRecords') {
        renderTable();
        renderAnalytics();
    }
});
        function getStatusClass(status) {
            if (status === 'Present') return 'status-present';
            if (status === 'Late') return 'status-late';
            return 'status-absent';
        }
        function calcWorkHours(inTime, outTime) {
            if (!inTime || !outTime) return '';
            const diffMs = new Date(outTime) - new Date(inTime);
            if (diffMs < 0) return '';
            const hours = Math.floor(diffMs / 3600000);
            const mins = Math.floor((diffMs % 3600000) / 60000);
            return `${hours}h ${mins}m`;
        }
        function getLocation(callback) {
            if (!navigator.geolocation) {
                callback('Not Supported');
                return;
            }
            navigator.geolocation.getCurrentPosition(
                pos => {
                    const { latitude, longitude } = pos.coords;
                    callback(`Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`);
                },
                () => callback('Unavailable'),
                { enableHighAccuracy: true, timeout: 7000 }
            );
        }
        function saveRecords() {
            localStorage.setItem('attendanceRecords', JSON.stringify(attendanceRecords));
        }
        

        // --- Render Functions ---
        function renderTable() {
            const tbody = document.querySelector('#attendanceTable tbody');
            tbody.innerHTML = '';
            attendanceRecords.forEach((rec, idx) => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${idx + 1}</td>
                    <td>${rec.name}</td>
                    <td>${rec.location || ''}</td>
                    <td>${formatDate(rec.checkIn)} ${formatTime(rec.checkIn)}</td>
                    <td class="${getStatusClass(rec.status)}">${rec.status}</td>
                    <td>${rec.checkOut ? formatDate(rec.checkOut) + ' ' + formatTime(rec.checkOut) : ''}</td>
                    <td>${rec.workHours || ''}</td>
                `;
                tbody.appendChild(tr);
            });
        }
        function renderAnalytics() {
            const total = attendanceRecords.length;
            const present = attendanceRecords.filter(r => r.status === 'Present').length;
            const late = attendanceRecords.filter(r => r.status === 'Late').length;
            const absent = attendanceRecords.filter(r => r.status === 'Absent').length;
            const analytics = [
                { label: 'Total Employees', value: total },
                { label: 'Present', value: present },
                { label: 'Late', value: late },
                { label: 'Absent', value: absent },
                { label: 'Present %', value: total ? ((present / total) * 100).toFixed(1) + '%' : '0%' },
                { label: 'Late %', value: total ? ((late / total) * 100).toFixed(1) + '%' : '0%' },
                { label: 'Absent %', value: total ? ((absent / total) * 100).toFixed(1) + '%' : '0%' },
            ];
            const analyticsDiv = document.getElementById('analytics');
            analyticsDiv.innerHTML = '';
            analytics.forEach(a => {
                const card = document.createElement('div');
                card.className = 'analytic-card';
                card.innerHTML = `<h2>${a.value}</h2><p>${a.label}</p>`;
                analyticsDiv.appendChild(card);
            });
        }

        // --- Main Logic ---
        function resetCheckInState() {
            checkedInEmployee = null;
            document.getElementById('employeeName').value = '';
            document.getElementById('employeeName').disabled = false;
            document.getElementById('checkInBtn').disabled = false;
            document.getElementById('checkOutBtn').disabled = true;
        }
        function setCheckInState(name) {
            checkedInEmployee = name;
            document.getElementById('employeeName').value = name;
            document.getElementById('employeeName').disabled = true;
            document.getElementById('checkInBtn').disabled = true;
            document.getElementById('checkOutBtn').disabled = false;
        }
        document.getElementById('checkInBtn').onclick = function() {
            const name = document.getElementById('employeeName').value.trim();
            if (!name) {
                alert('Please enter your name.');
                return;
            }
            // Prevent double check-in
            if (attendanceRecords.some(r => r.name === name && !r.checkOut)) {
                alert('You have already checked in. Please check out first.');
                return;
            }
            getLocation(location => {
                const now = new Date();
                const status = getStatus(now);
                const record = {
                    name,
                    location,
                    checkIn: now,
                    status,
                    checkOut: null,
                    workHours: ''
                };
                attendanceRecords.push(record);
                saveRecords();
                renderTable();
                renderAnalytics();
                setCheckInState(name);
            });
        };
        document.getElementById('checkOutBtn').onclick = function() {
            const name = checkedInEmployee;
            if (!name) return;
            const idx = attendanceRecords.findIndex(r => r.name === name && !r.checkOut);
            if (idx === -1) {
                alert('No active check-in found.');
                return;
            }
            const now = new Date();
            attendanceRecords[idx].checkOut = now;
            attendanceRecords[idx].workHours = calcWorkHours(attendanceRecords[idx].checkIn, now);
            saveRecords();
            renderTable();
            renderAnalytics();
            resetCheckInState();
        };

        // --- Restore State on Load ---
        function restoreCheckInState() {
            const name = document.getElementById('employeeName').value.trim();
            const active = attendanceRecords.find(r => !r.checkOut && r.name === name);
            if (active) setCheckInState(active.name);
            // else resetCheckInState();
        }
        // --- Initial Render ---
        renderTable();
        renderAnalytics();
        resetCheckInState();

        // --- Optional: Restore check-in state if page reloads ---
        document.getElementById('employeeName').addEventListener('input', restoreCheckInState);
        document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('nav ul li a');
    const currentPath = window.location.pathname.split('/').pop() || 'User Management.html';
    links.forEach(link => {
        const linkPath = link.getAttribute('href').split('/').pop();
        if (linkPath === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    const menuToggle = document.querySelector('.menu-toggle');
    const navUl = document.querySelector('nav ul');
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navUl.classList.toggle('active');
    });
});
       
    