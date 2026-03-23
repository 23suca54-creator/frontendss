const express = require('express');
const path = require('path');
const app = express();
// Default to 3000 for the frontend so it doesn't conflict with the backend on 8080.
// In production (Azure) App Service will set PORT in the environment and that will be used.
const port = process.env.PORT || 3000;

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// The "catchall" handler: for any request that doesn't match a static file,
// send back React's index.html so client-side routing works.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
