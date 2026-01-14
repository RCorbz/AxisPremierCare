# AXIS Performance Care - Blueprint

## Overview

This document outlines the design and implementation of the AXIS Performance Care website, a single-page application built with React and styled with Tailwind CSS. The application showcases the services of a mobile chiropractic business, emphasizing a "black card" aesthetic that is both modern and exclusive.

## Project Details

*   **Framework:** React
*   **Styling:** Tailwind CSS
*   **Key Packages:** `lucide-react`

### Design and Style

The website's design is guided by a "black card" aesthetic, characterized by a dark color palette and a clean, minimalist layout. The following styles have been implemented:

*   **Color Palette:**
    *   `rich-black`: `#0a0a0a`
    *   `charcoal-grey`: `#171717`
    *   `electric-volt`: `#DFFF00`
    *   `cyan-accent`: `#00E5FF`
    *   `silver-text`: `#A3A3A3`
*   **Typography:** The `Inter` font is used throughout the site to ensure a clean and readable experience.
*   **Layout:** The application is structured as a single-page layout with multiple sections, each designed to be visually distinct and informative.

### Implemented Features

*   **Hero Section:** A full-screen hero section with a background image and a prominent call-to-action button.
*   **Friction vs. Flow:** A section that contrasts the traditional chiropractic experience with the convenience of AXIS Performance Care.
*   **How It Works:** A step-by-step guide to the service, presented in a clear and concise manner.
*   **Membership Privileges:** A section that highlights the exclusive benefits of membership, including a visual representation of the "black card."
*   **Footer:** A footer with contact information and links to additional resources.

## Development Plan

The following steps were taken to build and refine the application:

1.  **Initial Setup:** The project was initialized as a React application with Tailwind CSS.
2.  **Component Development:** The application was built out with a series of components, each corresponding to a specific section of the website.
3.  **Styling and Theming:** The "black card" aesthetic was implemented using a custom color palette and Tailwind CSS utility classes.
4.  **Troubleshooting and Refinement:** A series of issues were identified and resolved, including:
    *   Incorrect file references and conflicting `jsx`/`tsx` files.
    *   An outdated Node.js version, which was resolved by updating the `.idx/dev.nix` file.
    *   A blank white screen caused by an incorrect script reference in `index.html`.

After resolving these issues, the application now renders correctly with the intended design and functionality.