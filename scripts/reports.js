 let attendanceRecords = JSON.parse(localStorage.getItem('attendanceRecords')) || [];

        function showNotification(message, type = 'success') {
            const notification = document.getElementById('notification');
            notification.textContent = message;
            notification.className = `notification ${type}`;
            const scrollY = window.scrollY;
            const offset = 30;
            notification.style.top = `${scrollY + offset}px`;
            notification.classList.remove('hidden');
            setTimeout(() => {
                notification.classList.add('hidden');
            }, 3500);
        }

        document.addEventListener('DOMContentLoaded', function () {
            const links = document.querySelectorAll('nav ul li a');
            const currentPath = window.location.pathname.split('/').pop() || 'dashboard.html';
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

            const sections = document.querySelectorAll('.card, .table');
            const observerOptions = {
                root: null,
                threshold: 0.15,
                rootMargin: '0px'
            };
            const observer = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, observerOptions);
            sections.forEach(section => observer.observe(section));

            loadRecords();
            updateSummaryCards();
        });

        function addRecord() {
            const button = document.getElementById('addButton');
            button.textContent = 'Adding...';
            button.disabled = true;

            const user = document.getElementById('userName').value.trim();
            const action = document.getElementById('action').value;
            const location = document.getElementById('location').value.trim();
            const hours = document.getElementById('hours').value;
            const time = new Date().toLocaleString();

            if (user && location && hours) {
                const record = { user, action, time, location, hours: parseFloat(hours) };
                attendanceRecords.push(record);
                localStorage.setItem('attendanceRecords', JSON.stringify(attendanceRecords));
                loadRecords();
                updateSummaryCards();

                // Add user to filter dropdown if not exists
                const userSelect = document.getElementById('userSelect');
                if (![...userSelect.options].some(opt => opt.value === user)) {
                    const option = document.createElement('option');
                    option.value = user;
                    option.text = user;
                    userSelect.add(option);
                }

                // Reset form
                document.getElementById('userName').value = '';
                document.getElementById('location').value = '';
                document.getElementById('hours').value = '';
                showNotification('Record added successfully.', 'success');
            } else {
                showNotification('Please fill all fields.', 'error');
            }

            button.textContent = 'Add';
            button.disabled = false;
        }

        function loadRecords() {
            const tableBody = document.getElementById('dataTable');
            tableBody.innerHTML = '';
            attendanceRecords.forEach(record => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${record.user}</td>
                    <td>${record.action}</td>
                    <td>${record.time}</td>
                    <td>${record.location}</td>
                    <td>${record.hours}</td>
                `;
                tableBody.appendChild(row);
            });
        }

        function updateSummaryCards() {
            const totalHours = attendanceRecords.reduce((sum, record) => sum + (record.hours || 0), 0);
            const attendanceRate = attendanceRecords.length > 0 ? (attendanceRecords.filter(r => r.action === 'Check-in').length / attendanceRecords.length * 100).toFixed(1) : 0;
            const activeUsers = new Set(attendanceRecords.map(r => r.user)).size;

            document.getElementById('totalHours').textContent = totalHours.toFixed(1);
            document.getElementById('attendanceRate').textContent = `${attendanceRate}%`;
            document.getElementById('activeUsers').textContent = activeUsers;
        }

        function applySort() {
            const sortOption = document.getElementById('sortSelect').value;
            attendanceRecords.sort((a, b) => {
                const dateA = new Date(a.time);
                const dateB = new Date(b.time);
                return sortOption === 'newest' ? dateB - dateA : dateA - dateB;
            });
            loadRecords();
            showNotification('Records sorted successfully.', 'success');
        }

        function applyFilter() {
            const fromDate = document.getElementById('fromDate').value;
            const toDate = document.getElementById('toDate').value;
            const department = document.getElementById('department').value;
            const user = document.getElementById('userSelect').value;

            let filteredRecords = JSON.parse(localStorage.getItem('attendanceRecords')) || [];

            if (fromDate) {
                filteredRecords = filteredRecords.filter(record => new Date(record.time) >= new Date(fromDate));
            }
            if (toDate) {
                filteredRecords = filteredRecords.filter(record => new Date(record.time) <= new Date(toDate));
            }
            if (department !== 'All Departments') {
                filteredRecords = filteredRecords.filter(record => record.department === department);
            }
            if (user !== 'All Users') {
                filteredRecords = filteredRecords.filter(record => record.user === user);
            }

            attendanceRecords = filteredRecords;
            loadRecords();
            updateSummaryCards();
            showNotification('Filters applied successfully.', 'success');
        }

        function exportData(type) {
            showNotification(`Exporting data as ${type.toUpperCase()}`, 'success');
        }