#!/usr/bin/env node

/**
 * Google Maps Scraper CSV Converter
 * 
 * Converts CSV output from google-maps-scraper to CRM import format
 * Filters out leads that already have a website
 */

const fs = require('fs');
const path = require('path');

// Configuration
const INPUT_CSV = process.argv[2] || path.join(__dirname, 'backend/Example/758f2215-b85d-4222-8a70-0be2b5969d1d.csv');
const OUTPUT_CSV = process.argv[3] || path.join(__dirname, 'no_website_leads.csv');

/**
 * Parse CSV line by line (handles quoted fields with commas)
 */
function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        const nextChar = line[i + 1];

        if (char === '"') {
            if (inQuotes && nextChar === '"') {
                // Escaped quote
                current += '"';
                i++; // Skip next quote
            } else {
                // Toggle quote state
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            // End of field
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }

    // Add last field
    result.push(current.trim());

    return result;
}

/**
 * Check if a lead has a website
 */
function hasWebsite(websiteField) {
    if (!websiteField) return false;

    const normalized = websiteField.toLowerCase().trim();

    // Check for actual URLs
    if (normalized.startsWith('http://') ||
        normalized.startsWith('https://') ||
        normalized.startsWith('www.')) {
        return true;
    }

    // Check for domain patterns
    if (normalized.includes('.com') ||
        normalized.includes('.net') ||
        normalized.includes('.org') ||
        normalized.includes('.co') ||
        normalized.includes('.us')) {
        return true;
    }

    return false;
}

/**
 * Convert scraper CSV to CRM format
 */
function convertCSV() {
    console.log(`Reading CSV from: ${INPUT_CSV}`);

    if (!fs.existsSync(INPUT_CSV)) {
        console.error(`Error: File not found: ${INPUT_CSV}`);
        console.error('\nUsage: node convert_scraper_csv.js [input.csv] [output.csv]');
        process.exit(1);
    }

    const content = fs.readFileSync(INPUT_CSV, 'utf-8');
    const lines = content.split('\n').filter(line => line.trim());

    if (lines.length === 0) {
        console.error('Error: CSV file is empty');
        process.exit(1);
    }

    // Parse header
    const headerLine = lines[0];
    const headers = parseCSVLine(headerLine);

    console.log(`\nCSV Headers found: ${headers.length}`);
    console.log(headers.join(', '));

    // Find column indices
    const nameIdx = headers.findIndex(h => h.toLowerCase().includes('name') || h.toLowerCase().includes('title'));
    const emailIdx = headers.findIndex(h => h.toLowerCase().includes('email'));
    const phoneIdx = headers.findIndex(h => h.toLowerCase().includes('phone') || h.toLowerCase().includes('tel'));
    const websiteIdx = headers.findIndex(h => h.toLowerCase().includes('website') || h.toLowerCase().includes('url') || h.toLowerCase().includes('site'));
    const addressIdx = headers.findIndex(h => h.toLowerCase().includes('address') || h.toLowerCase().includes('location'));
    const ratingIdx = headers.findIndex(h => h.toLowerCase().includes('rating'));
    const reviewsIdx = headers.findIndex(h => h.toLowerCase().includes('review'));

    console.log(`\nColumn mapping:`);
    console.log(`  Name: ${nameIdx >= 0 ? headers[nameIdx] : 'NOT FOUND'}`);
    console.log(`  Email: ${emailIdx >= 0 ? headers[emailIdx] : 'NOT FOUND'}`);
    console.log(`  Phone: ${phoneIdx >= 0 ? headers[phoneIdx] : 'NOT FOUND'}`);
    console.log(`  Website: ${websiteIdx >= 0 ? headers[websiteIdx] : 'NOT FOUND'}`);
    console.log(`  Address: ${addressIdx >= 0 ? headers[addressIdx] : 'NOT FOUND'}`);

    // Process data rows
    const outputRows = [];
    let totalCount = 0;
    let noWebsiteCount = 0;
    let skippedCount = 0;

    for (let i = 1; i < lines.length; i++) {
        const fields = parseCSVLine(lines[i]);
        totalCount++;

        const website = websiteIdx >= 0 ? fields[websiteIdx] : '';

        // Skip leads with websites
        if (hasWebsite(website)) {
            skippedCount++;
            continue;
        }

        // Extract data
        const name = nameIdx >= 0 ? fields[nameIdx] : '';
        const email = emailIdx >= 0 ? fields[emailIdx] : '';
        const phone = phoneIdx >= 0 ? fields[phoneIdx] : '';
        const address = addressIdx >= 0 ? fields[addressIdx] : '';
        const rating = ratingIdx >= 0 ? fields[ratingIdx] : '';
        const reviews = reviewsIdx >= 0 ? fields[reviewsIdx] : '';

        // Create CRM-compatible row
        const crmRow = {
            name: name || 'Unknown',
            email: email || '',
            phone: phone || '',
            address: address || '',
            rating: rating || '',
            reviews: reviews || '',
            notes: `No website found. Potential lead for website development services.`
        };

        outputRows.push(crmRow);
        noWebsiteCount++;
    }

    // Write output CSV
    const outputHeaders = ['name', 'email', 'phone', 'address', 'rating', 'reviews', 'notes'];
    const outputLines = [outputHeaders.join(',')];

    for (const row of outputRows) {
        const line = outputHeaders.map(header => {
            const value = row[header] || '';
            // Escape quotes and wrap in quotes if contains comma or quote
            if (value.includes(',') || value.includes('"') || value.includes('\n')) {
                return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
        }).join(',');
        outputLines.push(line);
    }

    fs.writeFileSync(OUTPUT_CSV, outputLines.join('\n'), 'utf-8');

    // Print summary
    console.log(`\n✅ Conversion complete!`);
    console.log(`\nStatistics:`);
    console.log(`  Total leads processed: ${totalCount}`);
    console.log(`  Leads WITH websites (skipped): ${skippedCount}`);
    console.log(`  Leads WITHOUT websites (exported): ${noWebsiteCount}`);
    console.log(`\nOutput saved to: ${OUTPUT_CSV}`);
    console.log(`\nYou can now import this CSV into the CRM via the Contacts page.`);
}

// Run conversion
convertCSV();
