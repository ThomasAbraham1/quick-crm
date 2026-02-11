/**
 * Data Parser Utility
 * Converts CSV and JSON data from Google Maps scraper to CRM-compatible format
 * Automatically filters out businesses that already have websites
 */

export interface ParsedContact {
    email?: string;
    name: string;
    phone?: string;
    address?: string;
    rating?: string;
    reviews?: string;
    notes?: string;
}

/**
 * Check if a value indicates a website exists
 */
function hasWebsite(websiteField?: string): boolean {
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
 * Parse CSV line (handles quoted fields with commas)
 */
function parseCSVLine(line: string): string[] {
    const result: string[] = [];
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
 * Parse CSV data to contacts
 */
function parseCSV(csvText: string): ParsedContact[] {
    const lines = csvText.split('\n').filter(line => line.trim());

    if (lines.length === 0) {
        throw new Error('CSV file is empty');
    }

    // Parse header
    const headers = parseCSVLine(lines[0]);

    // Find column indices (case insensitive)
    const nameIdx = headers.findIndex(h => h.toLowerCase().includes('name') || h.toLowerCase().includes('title'));
    const emailIdx = headers.findIndex(h => h.toLowerCase().includes('email'));
    const phoneIdx = headers.findIndex(h => h.toLowerCase().includes('phone') || h.toLowerCase().includes('tel'));

    // Be specific about website column - prioritize exact match, avoid "link" which could be Google Maps link
    const websiteIdx = headers.findIndex(h => {
        const lower = h.toLowerCase().trim();
        return lower === 'website' || lower === 'site' || lower === 'url' || lower === 'web';
    });

    const addressIdx = headers.findIndex(h => h.toLowerCase().includes('address') || h.toLowerCase().includes('location'));
    const ratingIdx = headers.findIndex(h => h.toLowerCase().includes('rating') || h.toLowerCase().includes('review_rating'));
    const reviewsIdx = headers.findIndex(h => h.toLowerCase().includes('review') && h.toLowerCase().includes('count'));

    const contacts: ParsedContact[] = [];
    let skipped = 0;

    // Process data rows
    for (let i = 1; i < lines.length; i++) {
        const fields = parseCSVLine(lines[i]);

        // Skip if no data
        if (fields.every(f => !f)) continue;

        // Check for website
        const website = websiteIdx >= 0 ? fields[websiteIdx] : '';
        if (hasWebsite(website)) {
            skipped++;
            continue;
        }

        // Extract data
        const name = nameIdx >= 0 ? fields[nameIdx] : '';
        const email = emailIdx >= 0 ? fields[emailIdx] : '';
        const phone = phoneIdx >= 0 ? fields[phoneIdx] : '';
        const address = addressIdx >= 0 ? fields[addressIdx] : '';
        const rating = ratingIdx >= 0 ? fields[ratingIdx] : '';
        const reviews = reviewsIdx >= 0 ? fields[reviewsIdx] : '';

        if (!name) continue;  // Skip if no name

        contacts.push({
            name,
            email: email || undefined,
            phone: phone || undefined,
            address: address || undefined,
            rating: rating || undefined,
            reviews: reviews || undefined,
            notes: 'No website found. Potential lead for website development services.'
        });
    }

    console.log(`CSV parsed: ${contacts.length} leads without websites, ${skipped} skipped (have websites)`);
    return contacts;
}

/**
 * Parse JSON data to contacts
 */
function parseJSON(jsonText: string): ParsedContact[] {
    const parsed = JSON.parse(jsonText);

    if (!Array.isArray(parsed)) {
        throw new Error('JSON must be an array');
    }

    const contacts: ParsedContact[] = [];
    let skipped = 0;

    for (const item of parsed) {
        // Check for website
        if (hasWebsite(item.website)) {
            skipped++;
            continue;
        }

        // Extract data (handle various field names)
        const name = item.name || item.title || item.businessName || '';
        const email = item.email || item.emails || '';
        const phone = item.phone || item.phoneNumber || item.tel || '';
        const address = item.address || item.location || item.complete_address?.street || '';
        const rating = item.rating || item.review_rating || '';
        const reviews = item.reviews || item.review_count || '';

        if (!name) continue;  // Skip if no name

        contacts.push({
            name,
            email: email || undefined,
            phone: phone || undefined,
            address: address || undefined,
            rating: rating ? String(rating) : undefined,
            reviews: reviews ? String(reviews) : undefined,
            notes: item.notes || 'No website found. Potential lead for website development services.'
        });
    }

    console.log(`JSON parsed: ${contacts.length} leads without websites, ${skipped} skipped (have websites)`);
    return contacts;
}

/**
 * Main parser function - detects format and parses accordingly
 */
export function parseContactData(input: string): ParsedContact[] {
    const trimmed = input.trim();

    if (!trimmed) {
        throw new Error('Input is empty');
    }

    // Try JSON first
    if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
        try {
            return parseJSON(trimmed);
        } catch (e) {
            throw new Error('Invalid JSON format: ' + (e as Error).message);
        }
    }

    // Try CSV
    try {
        return parseCSV(trimmed);
    } catch (e) {
        throw new Error('Invalid CSV format: ' + (e as Error).message);
    }
}
