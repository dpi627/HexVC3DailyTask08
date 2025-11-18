# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## CLAUDE Code Response

- Always respond in zh-TW (Traditional Chinese)

## Project Overview

This is a modern dog age calculator web application that converts dog years to human years using a scientifically-validated logarithmic formula based on DNA methylation research published in Cell Systems (Wang et al., 2019/2020).

**Formula**: `HumanAge = 16 × ln(DogAge) + 31`

The application is a pure client-side web app with zero dependencies - built with vanilla HTML5, CSS3, and JavaScript.

### Key Features (Task 12 Implementation)
- **Dynamic Background System**: 5 Unsplash dog images rotating every 10 seconds
- **Hero Section Carousel**: Auto-playing image carousel synchronized with background
- **Calculation History**: LocalStorage-based persistence (max 10 records, FIFO)
- **Responsive Design**: Mobile-first approach with breakpoints for tablet and desktop
- **History Panel**: Collapsible sidebar with click-to-restore functionality

## File Architecture

- **index.html**: Main HTML structure with semantic markup and accessibility features (ARIA labels)
  - Background container (`#bgContainer`)
  - Hero section with image carousel
  - Main wrapper with flex layout (calculator + history panel)
  - History panel sidebar (collapsible)

- **style.css**: CSS architecture using CSS custom properties (variables) for theming, grid layout, and gradient design system
  - CSS variables for consistent theming (colors, shadows, transitions)
  - Responsive breakpoints: 1024px (tablet), 768px (mobile), 480px (small mobile)
  - Flexbox layout for main-wrapper (desktop: side-by-side, mobile: stacked)
  - Smooth animations and transitions (fade, slide, hover effects)

- **lib.js**: Core calculation engine and feature modules
  - **Calculation Functions**:
    - `calcDogAgeYears(birthISODate)`: Calculates dog age in years from birth date (uses 365.25 days/year for leap year correction)
    - `calcHumanAgeFromDog(dogAge)`: Applies the logarithmic conversion formula with boundary protection
  - **Image Rotation Module** (`lib.js:65-104`):
    - `DOG_IMAGES[]`: Array of 5 Unsplash URLs
    - `startImageRotation()`: Initializes 10-second auto-rotation
    - `updateImages(index)`: Updates both background and hero image simultaneously
  - **LocalStorage Module** (`lib.js:106-161`):
    - `loadHistory()`: Retrieves calculation history from localStorage
    - `saveHistory(history)`: Persists history with error handling
    - `addHistoryItem()`: FIFO queue management (max 10 items)
  - **History Panel UI** (`lib.js:163-219`):
    - `renderHistory()`: Dynamically renders history items with click-to-restore
    - `formatTimestamp()`: Formats ISO timestamps to readable format (YYYY/MM/DD HH:MM)

## Development Commands

**Constitution Rule**: Only develop in index.html, style.css, and lib.js. Must use native HTML/CSS/JavaScript without any third-party libraries or frontend frameworks.

**Testing**: Open index.html directly in browser (no build process required).

## Core Algorithm Details

### Age Calculation (`calcDogAgeYears`)
- Uses millisecond difference between birth date and current date
- Divides by `365.25 * 24 * 60 * 60 * 1000` for leap year accuracy
- Returns `Math.max(0, years)` to prevent negative ages from future dates

### Human Age Conversion (`calcHumanAgeFromDog`)
- Implements `16 * Math.log(dogAge) + 31` (Math.log = natural logarithm)
- **Critical boundary handling**:
  - Returns 0 if `dogAge <= 0`
  - Uses `Math.max(dogAge, 0.05)` as safe lower bound (0.05 years ≈ 18 days) to prevent extreme negative values from `ln(very small number)`
  - Final `Math.max(0, humanAge)` ensures non-negative output
- Special UI note displayed for puppies under 1 year old

## CSS Design System

**CSS Variables** (`style.css:1-13`):
- `--bg`: Background color (#f5f7fb)
- `--card`: Card background (#fff)
- `--accent`: Primary accent color (#2b6ef6)
- `--accent-dark`: Darker accent for gradients (#1e56d6)
- `--muted`: Secondary text color (#6b7280)
- `--text`: Main text color (#111827)
- `--radius`: Border radius (12px)
- `--shadow-sm/md/lg`: Three-tier shadow system for depth
- `--transition`: Cubic bezier easing for smooth animations

**Layout Architecture**:
- **Desktop (1024px+)**: Flexbox layout with calculator (flex: 1) + history panel (360px fixed width, sticky positioning)
- **Tablet (768-1024px)**: Stacked layout, history panel becomes full-width with 400px max-height
- **Mobile (<768px)**: Single column, collapsible history panel

**Visual Effects**:
- Background container with gradient overlay and backdrop-filter blur
- Hero section with image overlay (gradient from rgba(0,0,0,0.3) to 0.6)
- Card hover effects (translateY, shadow transitions)
- History item hover with translateX slide effect
- Smooth 1s fade transitions for image rotation
- CSS animations: slideIn keyframe for result section

## Language and Localization

- All UI text and comments are in Traditional Chinese (繁體中文)
- Character encoding: UTF-8
- Font stack: "Noto Sans TC", "Segoe UI", system-ui, "Microsoft JhengHei"

## Browser Compatibility

Targets modern browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+) with native JavaScript features:
- `Math.log()` for natural logarithm
- `Date` object for date calculations
- `classList` API for DOM manipulation
- CSS Grid and Custom Properties

## Code Modification Guidelines

### When modifying calculations:
- **Never remove boundary checks** in `calcHumanAgeFromDog` - the 0.05 lower bound prevents mathematical errors
- Maintain the exact formula: `16 × ln(dogAge) + 31` (scientifically validated)
- Keep leap year correction (365.25 days/year) in age calculations

### When modifying UI:
- Preserve accessibility attributes (`aria-live="polite"` on result section)
- Maintain semantic HTML structure
- Keep CSS variable system for consistent theming
- Respect responsive breakpoints (1024px, 768px, 480px)

### When modifying image rotation:
- Update `DOG_IMAGES[]` array if changing image sources (`lib.js:6-12`)
- Modify `ROTATION_INTERVAL` constant to change rotation speed (`lib.js:14`)
- Both background and hero image must update synchronously via `updateImages()`

### When modifying history features:
- Change `MAX_HISTORY_ITEMS` to adjust storage limit (`lib.js:15`)
- LocalStorage key is `dogAgeHistory` - update `STORAGE_KEY` if changing
- History data structure: `{ id, timestamp, birthday, dogAge, humanAge }`
- FIFO queue logic in `addHistoryItem()` maintains size limit (`lib.js:132-153`)

### Important constraints (from constitution.md):
- **Only modify**: index.html, style.css, lib.js
- **Must use**: Native HTML5, CSS3, JavaScript (ES6+)
- **Cannot use**: Any third-party libraries, frontend frameworks, or external dependencies

## Scientific Context

The logarithmic formula reflects biological reality:
- Puppies mature rapidly → steep curve at young ages
- Adult dogs age more slowly → curve flattens
- Based on 104 Labrador Retrievers (ages 0-16) DNA methylation analysis
- Research limitation: primarily validated on Labradors, may vary by breed/size
