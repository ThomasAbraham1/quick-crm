
const fs = require('fs');
const data = [
    {
        "id": 1,
        "businessName": "DE Medlock Auto & Cycle LLC",
        "city": "Odessa",
        "state": "TX",
        "niche": "Auto Repair",
        "phone": "+1 432-582-2130",
        "reviews": 243,
        "rating": 4.7,
        "hasWebsite": false
    },
    {
        "id": 2,
        "businessName": "L Tune Auto Service",
        "city": "El Paso",
        "state": "TX",
        "niche": "Auto Repair",
        "phone": "+1 915-779-2322",
        "reviews": 128,
        "rating": 4.5,
        "hasWebsite": false
    },
    {
        "id": 3,
        "businessName": "JG Auto Services",
        "city": "McAllen",
        "state": "TX",
        "niche": "Auto Repair",
        "phone": "+1 956-928-1424",
        "reviews": 121,
        "rating": 4.4,
        "hasWebsite": false
    },
    {
        "id": 4,
        "businessName": "Limas Auto Repair",
        "city": "McAllen",
        "state": "TX",
        "niche": "Auto Repair",
        "phone": "+1 956-687-1489",
        "reviews": 105,
        "rating": 4.9,
        "hasWebsite": false
    },
    {
        "id": 5,
        "businessName": "University Auto Center",
        "city": "El Paso",
        "state": "TX",
        "niche": "Auto Repair",
        "phone": "+1 915-544-6333",
        "reviews": 96,
        "rating": 4.2,
        "hasWebsite": false
    },
    {
        "id": 6,
        "businessName": "APJ Construction Inc.",
        "city": "El Paso",
        "state": "TX",
        "niche": "Construction",
        "phone": "+1 915-226-3467",
        "reviews": 76,
        "rating": 4.7,
        "hasWebsite": false
    },
    {
        "id": 7,
        "businessName": "LoneStar Automotive",
        "city": "El Paso",
        "state": "TX",
        "niche": "Auto Repair",
        "phone": "+1 915-234-7989",
        "reviews": 62,
        "rating": 4.9,
        "hasWebsite": false
    },
    {
        "id": 8,
        "businessName": "P & P Auto Repair",
        "city": "El Paso",
        "state": "TX",
        "niche": "Auto Repair",
        "phone": "+1 915-240-2567",
        "reviews": 59,
        "rating": 4.2,
        "hasWebsite": false
    },
    {
        "id": 9,
        "businessName": "Al's Complete Auto Repair",
        "city": "Odessa",
        "state": "TX",
        "niche": "Auto Repair",
        "phone": "+1 432-332-3318",
        "reviews": 52,
        "rating": 4.1,
        "hasWebsite": false
    },
    {
        "id": 10,
        "businessName": "Auto Center Of McAllen",
        "city": "McAllen",
        "state": "TX",
        "niche": "Auto Repair",
        "phone": "+1 956-686-6362",
        "reviews": 50,
        "rating": 4.4,
        "hasWebsite": false
    },
    {
        "id": 11,
        "businessName": "Galvan's Automotive Repair",
        "city": "El Paso",
        "state": "TX",
        "niche": "Auto Repair",
        "phone": "+1 915-240-2487",
        "reviews": 45,
        "rating": 4.6,
        "hasWebsite": false
    },
    {
        "id": 12,
        "businessName": "Cesar Siqueiros Auto Repair",
        "city": "El Paso",
        "state": "TX",
        "niche": "Auto Repair",
        "phone": "+1 915-244-7157",
        "reviews": 44,
        "rating": 5.0,
        "hasWebsite": false
    },
    {
        "id": 13,
        "businessName": "Ernies Auto Service",
        "city": "McAllen",
        "state": "TX",
        "niche": "Auto Repair",
        "phone": "+1 956-325-0974",
        "reviews": 44,
        "rating": 4.8,
        "hasWebsite": false
    },
    {
        "id": 14,
        "businessName": "Elite Auto Care",
        "city": "El Paso",
        "state": "TX",
        "niche": "Auto Repair",
        "phone": "+1 915-757-3500",
        "reviews": 37,
        "rating": 4.6,
        "hasWebsite": false
    },
    {
        "id": 15,
        "businessName": "Rios Auto Repair",
        "city": "McAllen",
        "state": "TX",
        "niche": "Auto Repair",
        "phone": "+1 956-661-0961",
        "reviews": 60,
        "rating": 4.1,
        "hasWebsite": false
    },
    {
        "id": 16,
        "businessName": "Granados Auto Repair",
        "city": "El Paso",
        "state": "TX",
        "niche": "Auto Repair",
        "phone": "+1 915-771-7522",
        "reviews": 33,
        "rating": 4.8,
        "hasWebsite": false
    },
    {
        "id": 17,
        "businessName": "ESLI'S AUTOMOTIVE LLC",
        "city": "Midland",
        "state": "TX",
        "niche": "Auto Repair",
        "phone": "+1 432-210-5371",
        "reviews": 29,
        "rating": 4.9,
        "hasWebsite": false
    },
    {
        "id": 18,
        "businessName": "Linde Welding Gas & Equipment Center",
        "city": "El Paso",
        "state": "TX",
        "niche": "Welding",
        "phone": "(915) 598-7427",
        "reviews": 27,
        "rating": 4.3,
        "hasWebsite": false
    },
    {
        "id": 19,
        "businessName": "TektonSteel",
        "city": "El Paso",
        "state": "TX",
        "niche": "Welding",
        "phone": "+1 915-274-2948",
        "reviews": 9,
        "rating": 4.7,
        "hasWebsite": false
    },
    {
        "id": 20,
        "businessName": "Westside Welding, Inc.",
        "city": "El Paso",
        "state": "TX",
        "niche": "Welding",
        "phone": "+1 915-877-5345",
        "reviews": 23,
        "rating": 3.8,
        "hasWebsite": false
    }
];

const transformed = data.map(item => {
    const { id, businessName, ...rest } = item;
    const slug = businessName.replace(/[^a-z0-9]/gi, '').toLowerCase();
    return {
        name: businessName,
        email: `${slug}@example.com`,
        ...rest
    };
});

fs.writeFileSync('d:/Quick CRM/temp_output.json', JSON.stringify(transformed, null, 2));
