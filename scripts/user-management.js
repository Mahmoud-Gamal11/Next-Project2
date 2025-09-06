let currentUser = { id: 1, role: 'super_admin', company: 'TestCorp', email: 'admin@test.com' };
        let users = JSON.parse(localStorage.getItem('users')) || [
            { id: 1, email: 'admin@test.com', password: 'password123', role: 'super_admin', company: 'TestCorp', department: '' }
        ];

        function showNotification(message, type = 'success') {
            const notification = document.getElementById('notification');
            notification.textContent = message;
            notification.className = `notification ${type}`;
            const scrollY = window.scrollY;
            const offset = 20;
            notification.style.top = `${scrollY + offset}px`;
            notification.classList.remove('hidden');
            setTimeout(() => {
                notification.classList.add('hidden');
            }, 3000);
        }

        document.getElementById('add-user-form').addEventListener('submit', async e => {
            e.preventDefault();
            if (!['admin', 'super_admin'].includes(currentUser.role)) {
                showNotification('You are not authorized to add users.', 'error');
                return;
            }
            const email = document.getElementById('add-email').value.trim();
            const password = document.getElementById('add-password').value;
            const role = document.getElementById('add-role').value;
            const dept = document.getElementById('add-dept').value.trim();
            if (!email || !password || !role) {
                showNotification('Please fill all required fields.', 'error');
                return;
            }
            if (password.length < 6) {
                showNotification('Password must be at least 6 characters.', 'error');
                return;
            }
            if (users.find(u => u.email === email)) {
                showNotification('Email already exists. Please use another.', 'error');
                return;
            }
            users.push({ id: users.length + 1, email, password, role, company: currentUser.company, department: dept });
            localStorage.setItem('users', JSON.stringify(users));
            loadUsers();
            showNotification('New user added successfully.', 'success');
            document.getElementById('add-user-form').reset();
        });

        function loadUsers() {
            if (!['admin', 'super_admin'].includes(currentUser.role)) {
                showNotification('You are not authorized to view users.', 'error');
                return;
            }
            const tbody = document.getElementById('users-table');
            tbody.innerHTML = '';
            const companyUsers = users.filter(u => u.company === currentUser.company);
            if (companyUsers.length === 0) {
                tbody.innerHTML = '<tr><td colspan="4" class="p-3 text-center">No users available.</td></tr>';
            } else {
                companyUsers.forEach(user => {
                    const tr = document.createElement('tr');
                    const encodedEmail = encodeURIComponent(user.email).replace(/'/g, "\\'");
                    tr.innerHTML = `
                        <td class="p-3">${user.email}</td>
                        <td class="p-3">${user.role}</td>
                        <td class="p-3">${user.department || 'N/A'}</td>
                        <td class="p-3">
                            <button class="btn-warning" onclick="editUser('${encodedEmail}')">Edit User</button>
                            <button class="btn-danger" onclick="deleteUser('${encodedEmail}')">Delete User</button>
                        </td>`;
                    tr.style.cursor = 'pointer';
                    tr.addEventListener('click', (e) => {
                        if (!e.target.closest('button')) {
                            editUser(encodedEmail);
                        }
                    });
                    tbody.appendChild(tr);
                });
            }
        }

        function editUser(email) {
            try {
                if (!['admin', 'super_admin'].includes(currentUser.role)) {
                    showNotification('You are not authorized to edit users.', 'error');
                    return;
                }
                const decodedEmail = decodeURIComponent(email);
                const user = users.find(u => u.email === decodedEmail);
                if (!user) {
                    showNotification('User not found.', 'error');
                    console.error('User not found for email:', decodedEmail);
                    return;
                }
                document.getElementById('edit-email').value = user.email;
                document.getElementById('edit-role').value = user.role;
                document.getElementById('edit-dept').value = user.department || '';
                document.getElementById('edit-user-modal').style.display = 'flex';
            } catch (error) {
                console.error('Error in editUser:', error);
                showNotification('An error occurred while editing the user.', 'error');
            }
        }

        function closeEditModal() {
            document.getElementById('edit-user-modal').style.display = 'none';
            document.getElementById('edit-user-form').reset();
        }

        document.getElementById('edit-user-form').addEventListener('submit', e => {
            e.preventDefault();
            const email = document.getElementById('edit-email').value;
            const role = document.getElementById('edit-role').value;
            const dept = document.getElementById('edit-dept').value.trim();
            if (!['employee', 'manager', 'admin', 'super_admin'].includes(role)) {
                showNotification('Invalid role selected.', 'error');
                return;
            }
            const userIndex = users.findIndex(u => u.email === email);
            if (userIndex === -1) {
                showNotification('User not found.', 'error');
                return;
            }
            users[userIndex] = { ...users[userIndex], role, department: dept };
            localStorage.setItem('users', JSON.stringify(users));
            loadUsers();
            showNotification('User updated successfully.', 'success');
            closeEditModal();
        });

        function deleteUser(email) {
            try {
                if (!['admin', 'super_admin'].includes(currentUser.role)) {
                    showNotification('You are not authorized to delete users.', 'error');
                    return;
                }
                const decodedEmail = decodeURIComponent(email);
                if (decodedEmail === currentUser.email) {
                    showNotification('You cannot delete your own account.', 'error');
                    return;
                }
                const admins = users.filter(u => u.role === 'admin' || u.role === 'super_admin');
                if (admins.length === 1 && admins[0].email === decodedEmail) {
                    showNotification('Cannot delete the last admin user.', 'error');
                    return;
                }
                if (confirm(`Are you sure you want to delete user ${decodedEmail}?`)) {
                    users = users.filter(u => u.email !== decodedEmail);
                    localStorage.setItem('users', JSON.stringify(users));
                    loadUsers();
                    showNotification('User deleted successfully.', 'success');
                }
            } catch (error) {
                console.error('Error in deleteUser:', error);
                showNotification('An error occurred while deleting the user.', 'error');
            }
        }

        function bulkImport() {
            const fileInput = document.getElementById('csv-file-input');
            if (!fileInput.files.length) {
                showNotification('Please select a CSV file.', 'error');
                return;
            }
            const file = fileInput.files[0];
            const reader = new FileReader();
            reader.onload = function(e) {
                const text = e.target.result;
                const rows = text.split('\n').map(row => row.split(',').map(cell => cell.trim()));
                if (rows.length < 1 || !rows[0].includes('email') || !rows[0].includes('password') || !rows[0].includes('role')) {
                    showNotification('Invalid CSV format. Expected headers: email,password,role,department', 'error');
                    return;
                }
                const validRoles = ['employee', 'manager', 'admin', 'super_admin'];
                let addedUsers = 0;
                for (let i = 1; i < rows.length; i++) {
                    const [email, password, role, department = ''] = rows[i];
                    if (!email || !password || !role) {
                        showNotification(`Skipping row ${i}: Missing required fields.`, 'error');
                        continue;
                    }
                    if (users.find(u => u.email === email)) {
                        showNotification(`Skipping row ${i}: Email ${email} already exists.`, 'error');
                        continue;
                    }
                    if (password.length < 6) {
                        showNotification(`Skipping row ${i}: Password must be at least 6 characters.`, 'error');
                        continue;
                    }
                    if (!validRoles.includes(role)) {
                        showNotification(`Skipping row ${i}: Invalid role ${role}.`, 'error');
                        continue;
                    }
                    users.push({
                        id: users.length + 1,
                        email,
                        password,
                        role,
                        company: currentUser.company,
                        department
                    });
                    addedUsers++;
                }
                if (addedUsers > 0) {
                    localStorage.setItem('users', JSON.stringify(users));
                    loadUsers();
                    showNotification(`Successfully imported ${addedUsers} user(s).`, 'success');
                } else {
                    showNotification('No valid users were imported.', 'error');
                }
                fileInput.value = '';
            };
            reader.readAsText(file);
        }

        loadUsers();

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

            const sections = document.querySelectorAll('section');
            const observerOptions = {
                root: null,
                threshold: 0.1,
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

            const menuToggle = document.querySelector('.menu-toggle');
            const navUl = document.querySelector('nav ul');
            menuToggle.addEventListener('click', () => {
                menuToggle.classList.toggle('active');
                navUl.classList.toggle('active');
            });

            document.getElementById('csv-file-input').addEventListener('change', bulkImport);
        });