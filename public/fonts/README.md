# Fonts Directory

This directory contains custom fonts for the project.

## Required Fonts

To use the Gilroy font, please add the following font files:

- `Gilroy-Medium.woff2` - Web Open Font Format 2.0 (recommended)
- `Gilroy-Medium.woff` - Web Open Font Format (fallback)

## Font Sources

You can obtain Gilroy fonts from:
- Official Gilroy font website
- Font marketplaces
- Design resources

## Fallback

If Gilroy fonts are not available, the system will fall back to:
1. Inter (if available)
2. System UI fonts
3. Default sans-serif fonts

## Usage

The fonts are configured in:
- `tailwind.config.js` - Font family definitions
- `src/app/globals.css` - Font face declarations
- Components use `font-gilroy` class for Gilroy font
