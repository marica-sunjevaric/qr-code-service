QR Code Generator – Automated Testing & CI/CD

This project provides a web application for generating QR codes, with automated tests and a CI/CD workflow using Playwright and GitHub Actions.

* Demo

Try the live application here: https://qr-code-app-2021.netlify.app/

* Technologies

Frontend: HTML, CSS, JavaScript

Testing: Playwright

CI/CD: GitHub Actions

* Features

Generate QR codes with customizable parameters (URL, size, margin, colors)

Download QR codes in multiple formats (PNG, JPG, BMP, SVG)

Automated tests for core application functionality

* Automated Tests

The test suite is written in Playwright and integrated with GitHub Actions.

Tests cover:

Entering a URL into the input field

Changing the QR code size

Selecting options from dropdown menus

Verifying minimum version and margin settings

* CI/CD Workflow

The GitHub Actions workflow is located at .github/workflows/playwright.yaml and includes:

Installing Node.js and dependencies

Installing Playwright browsers

Running tests on multiple browsers (Chromium, Firefox, WebKit)

Generating an HTML test report

Uploading the HTML report as an artifact
