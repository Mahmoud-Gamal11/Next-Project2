# Enoloyee Attendance 



**Enoloyee Attendance** is a modern, web-based employee attendance tracking system designed to streamline workforce management with real-time monitoring, advanced analytics, and seamless HR integrations. Built with a responsive and user-friendly interface, it supports businesses of all sizes with features like geolocation-based check-ins, vacation and complaint management, and customizable reporting.

## Table of Contents
- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Features
- **Geolocation-based Check-in/Check-out**: Track employee attendance with precise location data.
- **Real-time Analytics**: Generate detailed reports and visualize work hours with interactive charts powered by Chart.js.
- **Vacation Management**: Employees can submit vacation requests, and admins can approve or reject them.
- **Complaint System**: Allows employees to submit complaints and admins to resolve them efficiently.
- **User Management**: Admins can add, edit, or delete users with role-based access control (Employee, Manager, Admin, Super Admin).
- **Dark Mode**: Toggle between light and dark themes for better user experience.
- **Responsive Design**: Built with Tailwind CSS to ensure compatibility across devices.
- **PWA Support**: Progressive Web App functionality for offline access (mock service worker included).
- **HR Integrations**: Mock integration with systems like BambooHR and SAP (extendable in production).
- **Subscription Plans**: Basic ($50/month) and Premium ($200/month) plans with mock payment processing via Stripe.
- **GDPR Compliance**: Encrypted location data and user consent for geolocation tracking.

## Technologies
- **Frontend**: HTML5, CSS3 (Tailwind CSS), JavaScript (ES6+)
- **Libraries**:
  - [Bootstrap](https://tailwindcss.com/) for styling
  - [Chart.js](https://www.chartjs.org/) for data visualization
  - [GSAP](https://greensock.com/gsap/) for animations
  - [Google Fonts](https://fonts.google.com/) (Inter font)
- **Storage**: LocalStorage for mock data persistence
- **PWA**: Service Worker for offline capabilities
- **Browser APIs**: Geolocation API for location tracking
- **Version Control**: Git

## Installation
To run Attendance Pro locally, follow these steps:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/attendance-pro.git
   cd attendance-pro
   ```

2. **Serve the Application**:
   Since this is a static web application, you can serve it using a local server. Use one of the following methods:
   - **Using VS Code Live Server**: Install the Live Server extension and open `index.html`.
   - **Using Python**: Run the following command in the project directory:
     ```bash
     python -m http.server 8000
     ```
   - **Using Node.js**: Install `http-server` globally and run:
     ```bash
     npm install -g http-server
     http-server
     ```

3. **Access the Application**:
   Open your browser and navigate to `http://localhost:8000` (or the port specified by your server).

4. **Optional**: For PWA testing, ensure the app is served over HTTPS in production or use a local tunneling tool like `ngrok`.

## Usage
1. **Home Page**: Explore features, pricing, and links to Privacy Policy and Terms of Service.
2. **Sign Up**:
   - Navigate to the Sign Up section.
   - Enter email, password, role (Employee, Manager, Admin, Super Admin), and company name.
   - After signing up, log in with the same credentials.
3. **Login**:
   - Use the default admin account (`admin@test.com`, `password123`) or create a new user.
   - Access the dashboard based on your role.
4. **Dashboard**:
   - Check in/out with geolocation (falls back to mock coordinates if unavailable).
   - View personal attendance logs and weekly hours.
5. **Reports** (Manager/Admin/Super Admin):
   - Filter and sort attendance logs by date, department, or user.
   - Export reports as CSV or PDF (PDF export is a mock).
   - Visualize data with a bar chart.
6. **Vacation & Complaints**:
   - Employees can submit vacation requests or complaints.
   - Admins can approve/reject vacations or resolve complaints.
7. **User Management** (Admin/Super Admin):
   - Add, edit, or delete users.
   - Bulk import users via CSV (mock).
8. **Settings**:
   - Update personal password or company settings like geofence, timezone, or alert thresholds.
9. **Integrations** (Admin/Super Admin):
   - Connect to HR systems using an API key (mock).
10. **Subscription** (Super Admin):
    - Upgrade to the Premium plan (mock).
    - Process payments via Stripe (mock).

## Project Structure
```plaintext
attendance-pro/
├── index.html         # Main HTML file with all UI components
├── README.md          # Project documentation
├── sw.js              # Mock service worker for PWA (not implemented)
└── assets/            # (Optional) Placeholder for images, icons, etc.
```

## Screenshots
| Home Page (Light Mode) | Dashboard (Dark Mode) |
|------------------------|-----------------------|
| ![Home Page](https://placehold.it/600x400?text=Home+Page) | ![Dashboard](https://placehold.it/600x400?text=Dashboard) |

| Reports Section | Vacation Management |
|-----------------|---------------------|
| ![Reports](https://placehold.it/600x400?text=Reports) | ![Vacations](https://placehold.it/600x400?text=Vacations) |

## Contributing
Contributions are welcome! To contribute:
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/YourFeature`).
3. Commit your changes (`git commit -m "Add YourFeature"`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a Pull Request.

Please ensure your code follows:
- Consistent formatting with Prettier.
- Semantic HTML and modular JavaScript.
- Clear commit messages.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact
For questions or feedback, reach out via:
- **GitHub Issues**: [Create an Issue](https://github.com/your-username/attendance-pro/issues)
- **Email**: your-email@example.com
- **X Profile**: [@YourProfile](https://x.com/YourProfile)

---

*Built with ❤️ by [Your Name](https://github.com/your-username) for efficient workforce management.*
