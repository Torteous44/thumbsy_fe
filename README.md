### Thumbsy Frontend
<pre style="font-size: 14px; line-height: 1.2;">
....................................................................................................
...............................................:--:.................................................
..............................................:==+*+:...............................................
..............................................:===**:...............................................
...............................................===*+:...............................................
..............................................:==+*+:...............................................
.............................................:===+#-................................................
............................................:-===**---====+-:.......................................
...........................................:===================++:..................................
........................................::=====================++:..................................
....................................:--========================++:..................................
....................................:--========================+*=:.................................
....................................:--========================+=:..................................
....................................:---=======================*+:..................................
....................................:---==============-=======+#-:..................................
....................................:---======================+*:...................................
....................................::---====+++++++++++++++**+:....................................
.....................................:::::::::-=++*+++++---::::.....................................
....................................................................................................
</pre>


### **Steps to Set Up the Project**




1. **Clone the Repository**
   ```bash
   git clone https://github.com/Torteous44/thumbsy_fe.git
   cd thumbsy_fe
   ```

			

2. **Install Dependencies**
   - Ensure Node.js is installed (`node -v` and `npm -v` to verify).
   - Install the project dependencies:
     ```bash
     npm install
     ```

3. **Start the Development Server**
   - Run the following command to start the app:
     ```bash
     npm start
     ```
   - Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Create a Branch**
   - For new features or fixes:
     ```bash
     git checkout -b feature/your-branch-name
     ```

5. **Sync and Push Changes**
   - Pull the latest updates before starting:
     ```bash
     git pull origin main
     ```
   - After making changes:
     ```bash
     git add .
     git commit -m "Your commit message"
     git push origin feature/your-branch-name
     ```

6. **Submit a Pull Request**
   - Open a pull request on GitHub with your branch.


#### **Root Files**
- **App.js**: The main component that defines the application layout and routing structure using `react-router-dom`.
- **App.css**: Global styles specific to the `App` component.
- **index.js**: Entry point of the React app, initializes rendering and wraps the app with global providers (e.g., `BrowserRouter`).
- **index.css**: Base CSS file for global resets and styles applied throughout the app.
- **reportWebVitals.js**: Optional file for measuring app performance (can be ignored or customized).

---

#### **Directories**

1. **`api/`**:
   - Contains reusable functions for API calls (e.g., fetching products, user data).

2. **`components/`**:
   - **Navbar.js**: Header component with navigation links and logo.
   - **Footer.js**: Footer component with informational text.

3. **`constants/`**:
   - Stores static values such as API endpoints, default settings, or route names.

4. **`contexts/`**:
   - For global state management using React Context API (e.g., themes, authentication).

5. **`hooks/`**:
   - Custom React hooks for reusable logic (e.g., API fetching, form handling).

6. **`layouts/`**:
   - Shared layouts for wrapping pages with consistent structures (e.g., header + content + footer).

7. **`pages/`**:
   - **LandingPage.js**: The homepage of the app.
   - **SearchPage.js**: The search interface with a search bar, product carousels, and recommendations.

8. **`routes/`**:
   - **index.js**: Centralized route definitions for consistent usage across the app.

9. **`services/`**:
   - Contains utilities for managing specific functionality (e.g., authentication, logging).

10. **`styles/`**:
    - **components/**:
      - **LandingPage.css**: Styles specific to the `LandingPage` component.
      - **Navbar.css**: Styles for the `Navbar` component.
      - **SearchPage.css**: Styles for the `SearchPage` component.
    - **components.css**: Shared styles for multiple components.
    - **global.css**: Global resets and base styling.
    - **variables.css**: CSS variables for consistent theming (e.g., colors, fonts, spacing).

11. **`setupTests.js`**:
    - Configuration for testing utilities, if needed.





```bash
# For new features, create feature branch from main
git checkout main
git checkout -b feature/new-feature

# Do your work, then merge to main first
git checkout main
git merge feature/new-feature
git push

# When ready for production, merge main into production
git checkout production
git merge main
git push
```