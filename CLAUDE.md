# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## CLAUDE Code reponse

- Alway response in zh-TW

## Project Overview

This is a dog age calculator web application that converts dog years to human years using a scientifically-validated logarithmic formula based on DNA methylation research published in Cell Systems (Wang et al., 2019/2020).

**Formula**: `HumanAge = 16 × ln(DogAge) + 31`

The application is a pure client-side web app with zero dependencies - built with vanilla HTML5, CSS3, and JavaScript.

## File Architecture

- **index.html**: Main HTML structure with semantic markup and accessibility features (ARIA labels)
- **style.css**: CSS architecture using CSS custom properties (variables) for theming, grid layout, and gradient design system
- **lib.js**: Core calculation engine with two main functions:
  - `calcDogAgeYears(birthISODate)`: Calculates dog age in years from birth date (uses 365.25 days/year for leap year correction)
  - `calcHumanAgeFromDog(dogAge)`: Applies the logarithmic conversion formula with boundary protection

## Development Commands

**Testing**: No need, I'll open in browser for testing.

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

**CSS Variables** (`style.css:1-7`):
- `--bg`: Background color (#f5f7fb)
- `--card`: Card background (#fff)
- `--accent`: Primary accent color (#2b6ef6)
- `--muted`: Secondary text color (#6b7280)
- `--radius`: Border radius (12px)

**Layout**: Grid-based responsive container (max-width: 560px) with 18px gap spacing

**Visual Effects**:
- Gradient backgrounds on buttons and result cards
- Multi-layer box shadows for depth
- Smooth transitions on interactive elements

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

When modifying calculations:
- **Never remove boundary checks** in `calcHumanAgeFromDog` - the 0.05 lower bound prevents mathematical errors
- Maintain the exact formula: `16 × ln(dogAge) + 31` (scientifically validated)
- Keep leap year correction (365.25 days/year) in age calculations

When modifying UI:
- Preserve accessibility attributes (`aria-live="polite"` on result section)
- Maintain semantic HTML structure
- Keep CSS variable system for consistent theming

## Scientific Context

The logarithmic formula reflects biological reality:
- Puppies mature rapidly → steep curve at young ages
- Adult dogs age more slowly → curve flattens
- Based on 104 Labrador Retrievers (ages 0-16) DNA methylation analysis
- Research limitation: primarily validated on Labradors, may vary by breed/size
