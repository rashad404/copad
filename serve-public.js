#!/usr/bin/env node

// Simple static file server for public_html folder during local development
// This mimics how cPanel serves files from public_html

const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8081;

// Enable CORS for all origins during development
app.use(cors());

// Serve static files from public_html directory
app.use(express.static(path.join(__dirname, 'public_html')));

// Serve uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'public_html/uploads')));

// Default route
app.get('/', (req, res) => {
  res.send('Public HTML server is running. Upload files are available at /uploads/');
});

// Start server
app.listen(PORT, () => {
  console.log(`Public HTML server is running on http://localhost:${PORT}`);
  console.log(`Serving files from: ${path.join(__dirname, 'public_html')}`);
});