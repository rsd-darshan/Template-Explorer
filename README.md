# Website Template Selector

This project is a web-based application for searching, previewing, and selecting website templates from GitHub. It provides users with the ability to search for different types of templates, filter based on categories, and bookmark their favorite templates. The application is built using Express.js on the backend, and HTML, CSS, and JavaScript on the frontend.

## Features

- Search website templates by keyword or type (e.g., ecommerce, portfolio, blog, etc.)
- Filter templates by stars, forks, or recent updates
- Preview website templates directly from GitHub
- Bookmark favorite templates for easy access
- Responsive design for different screen sizes

## Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   ```
   
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following content:
   ```bash
   GITHUB_TOKEN=<your_github_token>
   PORT=3000
   ```

4. Start the server:
   ```bash
   npm start
   ```

5. Open the application by visiting `http://localhost:3000` in your browser.

## File Structure

- `server.js`: Contains the backend logic using Express.js, fetching templates from GitHub and serving static files.
- `public/index.html`: The main HTML page with the UI for searching and displaying templates.
- `public/styles.css`: Styles for the UI, including the layout of the sidebar, main content, and template cards.
- `public/script.js`: Client-side JavaScript for handling template fetching, filtering, and bookmarking.

## API Endpoints

- `GET /api/templates`: Fetch templates from GitHub based on search query, template type, and sort order.
- `GET /api/preview`: Fetch the `index.html` of a GitHub repository for previewing templates.

## Usage

1. **Search Templates**: Enter a keyword or select a template type to search for templates.
2. **Filter Templates**: Use the dropdown menus to filter templates by stars, forks, or recent updates.
3. **Preview Templates**: Click the "View Demo" button (if available) to see a live preview of the template.
4. **Bookmark Templates**: Bookmark your favorite templates by clicking the "Bookmark" button, and view them later in the bookmarks section.

## Technologies Used

- **Backend**: Node.js, Express.js
- **Frontend**: HTML, CSS, JavaScript
- **API**: GitHub API for searching and retrieving templates
- **Environment Variables**: `.env` for GitHub token and port configuration

## Screenshots

<img width="1440" alt="webtemplate1" src="https://github.com/user-attachments/assets/b8ebdf79-46bb-406e-a923-c2f28f324580"><img width="1440" alt="webtemplate2" src="https://github.com/user-attachments/assets/142233ea-b02a-4613-8663-435e7eac884c">




## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
```

Now you can copy and paste the entire file at once!
