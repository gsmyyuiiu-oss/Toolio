import fs from 'fs';

// Read existing CATEGORIES_DATA from script
import { execSync } from 'child_process';

const NEW_CATEGORIES_DATA = {
  // --- 9. Calculators — 40 ---
  'calculators': {
    name: 'Calculators',
    defaultIcon: 'Calculator',
    color: 'blue',
    hex: '#3b82f6',
    tools: [
      { name: 'Basic Calculator', slug: 'basic-calculator', icon: 'Calculator', desc: 'Standard arithmetic calculator with memory keys and calculation history.' },
      { name: 'Scientific Calculator', slug: 'scientific-calculator', icon: 'Divide', desc: 'Advanced scientific calculator with trigonometry, log, exponents, and factorial.' },
      { name: 'Percentage Calculator', slug: 'percentage-calculator', icon: 'Percent', desc: 'Calculate percentage values, fractions, and percentage proportions instantly.' },
      { name: 'Percentage Increase Calculator', slug: 'percentage-increase-calculator', icon: 'TrendingUp', desc: 'Calculate percentage growth, salary raise, and markup rate between numbers.' },
      { name: 'Percentage Decrease Calculator', slug: 'percentage-decrease-calculator', icon: 'TrendingDown', desc: 'Calculate price drops, discount percentages, and depreciation rate.' },
      { name: 'Discount Calculator', slug: 'discount-calculator', icon: 'Tag', desc: 'Calculate sale savings, promotional discounts, and final checkout price.' },
      { name: 'GST Calculator', slug: 'gst-calculator', icon: 'Receipt', desc: 'Calculate Goods and Services Tax (GST) inclusive and exclusive amounts.' },
      { name: 'VAT Calculator', slug: 'vat-calculator', icon: 'Receipt', desc: 'Calculate Value Added Tax (VAT) rate additions and net amounts.' },
      { name: 'Tip Calculator', slug: 'tip-calculator', icon: 'DollarSign', desc: 'Calculate restaurant bill tips and split totals evenly among dining friends.' },
      { name: 'EMI Calculator', slug: 'emi-calculator', icon: 'CreditCard', desc: 'Calculate equated monthly installments for loans with interest amortization.' },
      { name: 'Loan Calculator', slug: 'loan-calculator', icon: 'Coins', desc: 'Calculate total loan payoff, annual interest charges, and monthly payments.' },
      { name: 'Mortgage Calculator', slug: 'mortgage-calculator', icon: 'Home', desc: 'Calculate home mortgage payments including principal, interest, and schedule.' },
      { name: 'Simple Interest Calculator', slug: 'simple-interest-calculator', icon: 'TrendingUp', desc: 'Calculate simple interest earnings over time using P × R × T / 100.' },
      { name: 'Compound Interest Calculator', slug: 'compound-interest-calculator', icon: 'Activity', desc: 'Calculate exponential compound interest returns with monthly/yearly compounding.' },
      { name: 'Investment Calculator', slug: 'investment-calculator', icon: 'PiggyBank', desc: 'Project future investment wealth and capital growth over long horizons.' },
      { name: 'SIP Calculator', slug: 'sip-calculator', icon: 'Repeat', desc: 'Calculate Systematic Investment Plan (SIP) mutual fund compounding growth.' },
      { name: 'CAGR Calculator', slug: 'cagr-calculator', icon: 'BarChart', desc: 'Calculate Compound Annual Growth Rate over multi-year investment periods.' },
      { name: 'ROI Calculator', slug: 'roi-calculator', icon: 'Target', desc: 'Calculate Return on Investment percentage efficiency and net capital gains.' },
      { name: 'Profit Calculator', slug: 'profit-calculator', icon: 'TrendingUp', desc: 'Calculate gross and net revenue profits minus business expenditures.' },
      { name: 'Profit Margin Calculator', slug: 'profit-margin-calculator', icon: 'PieChart', desc: 'Calculate profit margin percentage and markup spread from cost to price.' },
      { name: 'Markup Calculator', slug: 'markup-calculator', icon: 'Tag', desc: 'Calculate retail markup percentage to hit target sales profit goals.' },
      { name: 'Break-Even Calculator', slug: 'break-even-calculator', icon: 'Sliders', desc: 'Determine the exact sales volume needed to cover fixed and variable costs.' },
      { name: 'Salary Calculator', slug: 'salary-calculator', icon: 'Wallet', desc: 'Convert annual salary to hourly, weekly, bi-weekly, and monthly wages.' },
      { name: 'Income Tax Calculator', slug: 'income-tax-calculator', icon: 'FileText', desc: 'Estimate income tax liabilities, standard deductions, and net take-home pay.' },
      { name: 'Age Calculator', slug: 'age-calculator', icon: 'Calendar', desc: 'Calculate exact chronological age in years, months, weeks, days, and hours.' },
      { name: 'Date Difference Calculator', slug: 'date-difference-calculator', icon: 'CalendarDays', desc: 'Calculate the exact number of days, weeks, and months between any two dates.' },
      { name: 'Time Duration Calculator', slug: 'time-duration-calculator', icon: 'Clock', desc: 'Add or subtract hours, minutes, and seconds between timestamps.' },
      { name: 'BMI Calculator', slug: 'bmi-calculator', icon: 'Heart', desc: 'Calculate Body Mass Index (BMI) and WHO body weight classification.' },
      { name: 'BMR Calculator', slug: 'bmr-calculator', icon: 'Flame', desc: 'Calculate Basal Metabolic Rate daily baseline caloric expenditure.' },
      { name: 'Calorie Calculator', slug: 'calorie-calculator', icon: 'Utensils', desc: 'Calculate daily maintenance calories and deficits for healthy weight goals.' },
      { name: 'Ideal Weight Calculator', slug: 'ideal-weight-calculator', icon: 'Scale', desc: 'Estimate healthy body weight ranges based on height and body frame.' },
      { name: 'Body Fat Calculator', slug: 'body-fat-calculator', icon: 'Activity', desc: 'Estimate body fat percentage using US Navy body circumference formulas.' },
      { name: 'Pace Calculator', slug: 'pace-calculator', icon: 'Gauge', desc: 'Calculate running and cycling pace (min/km and min/mile) for race goals.' },
      { name: 'Speed Calculator', slug: 'speed-calculator', icon: 'Zap', desc: 'Calculate average speed from total travel distance and elapsed trip time.' },
      { name: 'Fuel Cost Calculator', slug: 'fuel-cost-calculator', icon: 'Fuel', desc: 'Calculate road trip petrol/diesel gas costs based on mileage consumption.' },
      { name: 'Electricity Cost Calculator', slug: 'electricity-cost-calculator', icon: 'Zap', desc: 'Calculate household appliance kilowatt-hour power consumption and bill costs.' },
      { name: 'Construction Calculator', slug: 'construction-calculator', icon: 'Hammer', desc: 'Estimate concrete volume, brick counts, and paint coverage for projects.' },
      { name: 'Area Calculator', slug: 'area-calculator', icon: 'Square', desc: 'Calculate geometric areas of rectangles, triangles, circles, and polygons.' },
      { name: 'Volume Calculator', slug: 'volume-calculator', icon: 'Box', desc: 'Calculate 3D volumes of boxes, cylinders, spheres, cones, and prisms.' },
      { name: 'Probability Calculator', slug: 'probability-calculator', icon: 'Dice5', desc: 'Calculate single event, independent series, and odds probability ratios.' }
    ]
  },

  // --- 10. Date & Time — 20 ---
  'date-time-tools': {
    name: 'Date & Time',
    defaultIcon: 'Clock',
    color: 'orange',
    hex: '#f97316',
    tools: [
      { name: 'World Clock', slug: 'world-clock', icon: 'Globe', desc: 'View live accurate local times across major international time zones and cities.' },
      { name: 'Time Zone Converter', slug: 'time-zone-converter', icon: 'Clock', desc: 'Convert meeting times between UTC, GMT, EST, PST, CET, and IST time zones.' },
      { name: 'Date Calculator', slug: 'date-calculator', icon: 'Calendar', desc: 'Add or subtract days, months, and years from any calendar start date.' },
      { name: 'Date Difference', slug: 'date-difference', icon: 'CalendarDays', desc: 'Calculate days and weeks elapsed between two calendar dates.' },
      { name: 'Days Between Dates', slug: 'days-between-dates', icon: 'CalendarRange', desc: 'Count the total number of days elapsed between two milestone dates.' },
      { name: 'Working Days Calculator', slug: 'working-days-calculator', icon: 'Briefcase', desc: 'Calculate Monday-to-Friday business working days excluding weekends.' },
      { name: 'Business Days Calculator', slug: 'business-days-calculator', icon: 'Building', desc: 'Calculate project delivery dates accounting for weekends and public holidays.' },
      { name: 'Countdown Timer', slug: 'countdown-timer', icon: 'Hourglass', desc: 'Set live countdown timers with alarm audio alerts and full-screen view.' },
      { name: 'Stopwatch', slug: 'stopwatch', icon: 'Timer', desc: 'Online precision stopwatch with millisecond split lap time logging.' },
      { name: 'Online Clock', slug: 'online-clock', icon: 'Clock', desc: 'Full-screen digital and analog clock displaying local time and date.' },
      { name: 'Unix Timestamp Converter', slug: 'unix-timestamp-converter', icon: 'Binary', desc: 'Convert epoch Unix timestamps (seconds and milliseconds) to human date-time.' },
      { name: 'Unix Timestamp Generator', slug: 'unix-timestamp-generator', icon: 'Hash', desc: 'Generate current epoch timestamp in seconds, milliseconds, and ISO-8601.' },
      { name: 'Week Number Calculator', slug: 'week-number-calculator', icon: 'Calendar', desc: 'Determine ISO week number (1 to 52) for any given day of the year.' },
      { name: 'Leap Year Checker', slug: 'leap-year-checker', icon: 'Sparkles', desc: 'Check if any calendar year is a leap year with 366 days.' },
      { name: 'Age Calculator DateTime', slug: 'age-calculator-datetime', icon: 'Heart', desc: 'Calculate exact birthday age in years, months, days, minutes, and breaths.' },
      { name: 'Birthday Countdown', slug: 'birthday-countdown', icon: 'Gift', desc: 'Count down remaining days, hours, and minutes until your next birthday.' },
      { name: 'Time Duration Calculator DT', slug: 'time-duration-calculator-dt', icon: 'Clock3', desc: 'Calculate total duration between work shift start and end times.' },
      { name: 'Hours Calculator', slug: 'hours-calculator', icon: 'Clock4', desc: 'Calculate weekly timesheet work hours and overtime summaries.' },
      { name: 'Minutes Calculator', slug: 'minutes-calculator', icon: 'Clock8', desc: 'Convert decimal hours into clean hours and minutes.' },
      { name: 'Seconds Calculator', slug: 'seconds-calculator', icon: 'Timer', desc: 'Convert hours and days into total elapsed seconds.' }
    ]
  },

  // --- 11. Developer Tools — 40 ---
  'developer-tools': {
    name: 'Developer Tools',
    defaultIcon: 'Code2',
    color: 'violet',
    hex: '#8b5cf6',
    tools: [
      { name: 'JSON Formatter', slug: 'json-formatter', icon: 'Code', desc: 'Prettify and format messy JSON strings with 2-space or 4-space indentations.' },
      { name: 'JSON Validator', slug: 'json-validator', icon: 'CheckCircle2', desc: 'Validate JSON syntax errors with exact line and column error indicators.' },
      { name: 'JSON Minifier', slug: 'json-minifier', icon: 'Minimize2', desc: 'Strip whitespace and newlines from JSON to minimize payload bandwidth.' },
      { name: 'JSON to CSV', slug: 'json-to-csv', icon: 'Table', desc: 'Convert structured JSON arrays into downloadable CSV spreadsheet tables.' },
      { name: 'CSV to JSON', slug: 'csv-to-json', icon: 'FileSpreadsheet', desc: 'Convert spreadsheet CSV comma-separated data into structured JSON objects.' },
      { name: 'XML Formatter', slug: 'xml-formatter', icon: 'Code2', desc: 'Prettify XML documents with proper tag indentation and hierarchy.' },
      { name: 'XML Validator', slug: 'xml-validator', icon: 'ShieldCheck', desc: 'Validate XML markup syntax and tag closure structure.' },
      { name: 'XML Minifier', slug: 'xml-minifier', icon: 'Minimize2', desc: 'Compress XML files by stripping redundant spaces and line breaks.' },
      { name: 'YAML Formatter', slug: 'yaml-formatter', icon: 'FileCode', desc: 'Format and lint YAML configuration files with strict spacing.' },
      { name: 'YAML to JSON', slug: 'yaml-to-json', icon: 'ArrowRightLeft', desc: 'Convert Kubernetes and Docker YAML manifests into JSON structure.' },
      { name: 'JSON to YAML', slug: 'json-to-yaml', icon: 'ArrowRightLeft', desc: 'Convert JSON payloads into clean, readable YAML configuration.' },
      { name: 'HTML Formatter', slug: 'html-formatter', icon: 'Layout', desc: 'Beautify messy HTML code with clean tag indents.' },
      { name: 'HTML Minifier', slug: 'html-minifier', icon: 'FileMinus', desc: 'Minify HTML templates by removing comments and unneeded spaces.' },
      { name: 'CSS Formatter', slug: 'css-formatter', icon: 'Palette', desc: 'Format CSS stylesheets with standardized indentation and rule brackets.' },
      { name: 'CSS Minifier', slug: 'css-minifier', icon: 'Minimize', desc: 'Minify CSS files to reduce stylesheet download times.' },
      { name: 'JavaScript Formatter', slug: 'javascript-formatter', icon: 'FileCode2', desc: 'Beautify JavaScript and TypeScript code according to standard style guides.' },
      { name: 'JavaScript Minifier', slug: 'javascript-minifier', icon: 'Sparkles', desc: 'Minify JavaScript scripts to reduce production bundle sizes.' },
      { name: 'SQL Formatter', slug: 'sql-formatter', icon: 'Database', desc: 'Format PostgreSQL, MySQL, and SQLite queries with capitalized keywords.' },
      { name: 'SQL Minifier', slug: 'sql-minifier', icon: 'Database', desc: 'Collapse SQL queries into one single compact executable query line.' },
      { name: 'Markdown Formatter', slug: 'markdown-formatter', icon: 'FileText', desc: 'Format Markdown tables, lists, and headings consistently.' },
      { name: 'Base64 Encoder', slug: 'base64-encoder', icon: 'Binary', desc: 'Encode plain text and strings into Base64 encoded format.' },
      { name: 'Base64 Decoder', slug: 'base64-decoder', icon: 'Eye', desc: 'Decode Base64 strings back into readable UTF-8 text.' },
      { name: 'URL Encoder', slug: 'url-encoder', icon: 'Link', desc: 'Encode query parameters and URI components to percent-encoded format.' },
      { name: 'URL Decoder', slug: 'url-decoder', icon: 'Unlink', desc: 'Decode percent-encoded URL query strings into human-readable text.' },
      { name: 'HTML Encoder', slug: 'html-encoder', icon: 'Code', desc: 'Escape HTML entities (&, <, >, ", \') to prevent XSS injection attacks.' },
      { name: 'HTML Decoder', slug: 'html-decoder', icon: 'Eye', desc: 'Decode HTML entities back into regular characters and markup.' },
      { name: 'UUID Generator', slug: 'uuid-generator', icon: 'Key', desc: 'Generate random UUID / GUID v4 unique identifiers individually or in batch.' },
      { name: 'Regex Tester', slug: 'regex-tester', icon: 'Search', desc: 'Test regular expressions with live regex match highlighting and flags.' },
      { name: 'JWT Decoder', slug: 'jwt-decoder', icon: 'Shield', desc: 'Decode JSON Web Token (JWT) headers and payload claims without secret keys.' },
      { name: 'JWT Generator', slug: 'jwt-generator', icon: 'Lock', desc: 'Create test JWT tokens with custom claims, expiry, and payload parameters.' },
      { name: 'Hash Generator', slug: 'hash-generator-dev', icon: 'Hash', desc: 'Generate cryptographic digests for any input text string.' },
      { name: 'MD5 Generator', slug: 'md5-generator', icon: 'Hash', desc: 'Generate 128-bit MD5 checksum hashes for strings and passwords.' },
      { name: 'SHA-1 Generator', slug: 'sha-1-generator', icon: 'ShieldAlert', desc: 'Generate 160-bit SHA-1 cryptographic hashes.' },
      { name: 'SHA-256 Generator', slug: 'sha-256-generator', icon: 'ShieldCheck', desc: 'Generate standard secure SHA-256 cryptographic digests in browser.' },
      { name: 'SHA-512 Generator', slug: 'sha-512-generator', icon: 'Lock', desc: 'Generate ultra-high security 512-bit SHA-2 cryptographic hashes.' },
      { name: 'Unix Timestamp Dev', slug: 'unix-timestamp-dev', icon: 'Clock', desc: 'Inspect epoch timestamp values with relative time calculation.' },
      { name: 'Color Converter Dev', slug: 'color-converter-dev', icon: 'Palette', desc: 'Convert color values between HEX, RGB, HSL, and CSS color functions.' },
      { name: 'Cron Expression Generator', slug: 'cron-expression-generator', icon: 'CalendarClock', desc: 'Build and explain standard 5-part cron schedules visually.' },
      { name: 'User-Agent Parser', slug: 'user-agent-parser', icon: 'Laptop', desc: 'Parse browser, OS, device, and rendering engine from User-Agent strings.' },
      { name: 'IP Address Analyzer', slug: 'ip-address-analyzer', icon: 'Network', desc: 'Analyze IPv4 and IPv6 addresses, binary representation, and IP classes.' }
    ]
  },

  // --- 12. Web / SEO Tools — 30 ---
  'seo-tools': {
    name: 'Web / SEO Tools',
    defaultIcon: 'Search',
    color: 'lime',
    hex: '#84cc16',
    tools: [
      { name: 'Meta Tag Generator', slug: 'meta-tag-generator', icon: 'Code', desc: 'Generate essential SEO title, description, robots, and canonical meta tags.' },
      { name: 'Meta Description Generator', slug: 'meta-description-generator', icon: 'FileText', desc: 'Craft compelling 155-character meta descriptions optimized for SERP click-through.' },
      { name: 'Robots.txt Generator', slug: 'robots-txt-generator', icon: 'Bot', desc: 'Generate and configure robots.txt crawler rules for Googlebot and Bingbot.' },
      { name: 'Sitemap Generator', slug: 'sitemap-generator', icon: 'Network', desc: 'Create standard XML sitemaps with priority and changefreq attributes.' },
      { name: 'XML Sitemap Validator', slug: 'xml-sitemap-validator', icon: 'CheckSquare', desc: 'Validate XML sitemap files against Google sitemap schema standards.' },
      { name: 'Canonical URL Generator', slug: 'canonical-url-generator', icon: 'Link', desc: 'Generate canonical link tags to avoid duplicate content SEO penalties.' },
      { name: 'Open Graph Generator', slug: 'open-graph-generator', icon: 'Share2', desc: 'Create OpenGraph tags (og:title, og:image, og:description) for Facebook and LinkedIn.' },
      { name: 'Twitter Card Generator', slug: 'twitter-card-generator', icon: 'Twitter', desc: 'Generate Twitter/X card tags (summary_large_image) for rich tweet previews.' },
      { name: 'Schema Markup Generator', slug: 'schema-markup-generator', icon: 'Layers', desc: 'Generate Schema.org JSON-LD structured data for articles, FAQs, and products.' },
      { name: 'FAQ Schema Generator', slug: 'faq-schema-generator', icon: 'HelpCircle', desc: 'Create FAQPage JSON-LD structured data to gain Google SERP FAQ rich snippets.' },
      { name: 'Breadcrumb Schema Generator', slug: 'breadcrumb-schema-generator', icon: 'ChevronRight', desc: 'Generate BreadcrumbList Schema JSON-LD for rich navigation in search results.' },
      { name: 'Organization Schema Generator', slug: 'organization-schema-generator', icon: 'Building2', desc: 'Generate Organization Schema markup with logo, contacts, and social links.' },
      { name: 'Keyword Density Checker', slug: 'keyword-density-checker', icon: 'FileSearch', desc: 'Analyze single-word and two-word keyword frequency percentages in copy.' },
      { name: 'Word Density Checker', slug: 'word-density-checker', icon: 'BarChart2', desc: 'Inspect word distribution to prevent search engine keyword stuffing penalties.' },
      { name: 'SERP Preview', slug: 'serp-preview', icon: 'Eye', desc: 'Preview desktop and mobile Google search snippet results with live pixel widths.' },
      { name: 'Slug Generator', slug: 'slug-generator', icon: 'Type', desc: 'Convert article titles into clean, URL-friendly kebab-case permalinks.' },
      { name: 'URL Analyzer', slug: 'url-analyzer', icon: 'Compass', desc: 'Deconstruct URLs into protocol, domain, port, path, and query parameters.' },
      { name: 'URL Shortener', slug: 'url-shortener', icon: 'Link2', desc: 'Create clean concise redirect links for marketing and social posts.' },
      { name: 'UTM Builder', slug: 'utm-builder', icon: 'Megaphone', desc: 'Build Google Analytics GA4 campaign links with utm_source, medium, and campaign.' },
      { name: 'QR URL Generator', slug: 'qr-url-generator', icon: 'QrCode', desc: 'Generate high-resolution scannable QR codes for website URLs with download.' },
      { name: 'HTTP Status Checker', slug: 'http-status-checker', icon: 'Globe', desc: 'Look up meanings and solutions for 200, 301, 302, 404, and 500 HTTP response codes.' },
      { name: 'Website Screenshot Tool', slug: 'website-screenshot-tool', icon: 'Camera', desc: 'Preview and capture full-screen webpage mockups in multiple device viewports.' },
      { name: 'Favicon Generator', slug: 'favicon-generator', icon: 'Image', desc: 'Generate multi-resolution browser favicons (16x16, 32x32, 192x192 PNG) from icons.' },
      { name: 'HTML Preview', slug: 'html-preview-seo', icon: 'Eye', desc: 'Live sandbox rendering of HTML, CSS, and metadata snippets.' },
      { name: 'Website Color Extractor', slug: 'website-color-extractor', icon: 'Palette', desc: 'Analyze and extract dominant color palettes from web pages and logos.' },
      { name: 'Website Word Counter', slug: 'website-word-counter', icon: 'Hash', desc: 'Analyze webpage content volume, reading grade level, and paragraph counts.' },
      { name: 'Website Text Extractor', slug: 'website-text-extractor', icon: 'FileText', desc: 'Extract clean plain text from HTML markup, discarding tags and scripts.' },
      { name: 'Sitemap URL Extractor', slug: 'sitemap-url-extractor', icon: 'List', desc: 'Extract all webpage URLs from XML sitemaps into clean plain text lists.' },
      { name: 'SEO Title Generator', slug: 'seo-title-generator', icon: 'Sparkles', desc: 'Craft high-converting SEO titles under the recommended 60-character boundary.' },
      { name: 'SEO Heading Analyzer', slug: 'seo-heading-analyzer', icon: 'Heading', desc: 'Analyze H1, H2, and H3 heading hierarchies to ensure proper SEO page structure.' }
    ]
  },

  // --- 13. Color & Design — 25 ---
  'color-tools': {
    name: 'Color & Design',
    defaultIcon: 'Palette',
    color: 'fuchsia',
    hex: '#d946ef',
    tools: [
      { name: 'Color Picker', slug: 'color-picker', icon: 'Pipette', desc: 'Interactive visual color spectrum picker with live HEX, RGB, and HSL values.' },
      { name: 'HEX to RGB', slug: 'hex-to-rgb', icon: 'ArrowRightLeft', desc: 'Convert hexadecimal web color codes (#RRGGBB) to rgb(r, g, b) values.' },
      { name: 'RGB to HEX', slug: 'rgb-to-hex', icon: 'ArrowRightLeft', desc: 'Convert red, green, and blue numeric channel values into hex color codes.' },
      { name: 'HEX to HSL', slug: 'hex-to-hsl', icon: 'ArrowRightLeft', desc: 'Convert hex colors to Hue, Saturation, and Lightness percentages.' },
      { name: 'HSL to HEX', slug: 'hsl-to-hex', icon: 'ArrowRightLeft', desc: 'Convert HSL color parameters into standard web HEX color codes.' },
      { name: 'RGB to HSL', slug: 'rgb-to-hsl', icon: 'ArrowRightLeft', desc: 'Convert RGB screen colors into HSL cylindrical-coordinate color space.' },
      { name: 'Color Palette Generator', slug: 'color-palette-generator', icon: 'Layers', desc: 'Generate harmonious 5-color aesthetic palettes with one click.' },
      { name: 'Random Color Generator', slug: 'random-color-generator', icon: 'Sparkles', desc: 'Generate random aesthetically pleasing colors with instant copy buttons.' },
      { name: 'Gradient Generator', slug: 'gradient-generator', icon: 'Sliders', desc: 'Create linear and radial CSS gradients with custom angle and multi-color stops.' },
      { name: 'CSS Gradient Generator', slug: 'css-gradient-generator', icon: 'Code', desc: 'Generate cross-browser CSS linear-gradient code with live preview.' },
      { name: 'Color Shades Generator', slug: 'color-shades-generator', icon: 'Grid', desc: 'Generate a 10-step monochromatic darker shade ladder from any base color.' },
      { name: 'Color Tints Generator', slug: 'color-tints-generator', icon: 'Sun', desc: 'Generate a 10-step lighter tint ladder with gradual white blending.' },
      { name: 'Contrast Checker', slug: 'contrast-checker', icon: 'Contrast', desc: 'Calculate WCAG 2.1 color contrast ratios between text and background.' },
      { name: 'WCAG Contrast Checker', slug: 'wcag-contrast-checker', icon: 'CheckCircle', desc: 'Verify AA and AAA accessibility compliance for web design.' },
      { name: 'Complementary Color Generator', slug: 'complementary-color-generator', icon: 'Circle', desc: 'Find opposite 180° complementary colors on the color wheel for high contrast.' },
      { name: 'Analogous Color Generator', slug: 'analogous-color-generator', icon: 'PieChart', desc: 'Generate adjacent 30° harmonious colors for gentle, serene designs.' },
      { name: 'Triadic Color Generator', slug: 'triadic-color-generator', icon: 'Triangle', desc: 'Create balanced 120° triadic color schemes for vibrant visuals.' },
      { name: 'Color Temperature Tool', slug: 'color-temperature-tool', icon: 'Thermometer', desc: 'Analyze warm vs cool color temperatures measured in Kelvin.' },
      { name: 'Image Color Extractor', slug: 'image-color-extractor', icon: 'Image', desc: 'Upload an image and extract its dominant palette colors automatically.' },
      { name: 'Brand Color Generator', slug: 'brand-color-generator', icon: 'Building', desc: 'Build cohesive primary, secondary, and accent brand color sets.' },
      { name: 'CSS Box Shadow Generator', slug: 'css-box-shadow-generator', icon: 'Square', desc: 'Design smooth multi-layered CSS box shadows visually with live code export.' },
      { name: 'CSS Border Generator', slug: 'css-border-generator', icon: 'Minimize', desc: 'Design border-radius, outline styles, and border widths with CSS snippets.' },
      { name: 'CSS Button Generator', slug: 'css-button-generator', icon: 'Play', desc: 'Style modern interactive buttons with hover states and copy CSS code.' },
      { name: 'CSS Glassmorphism Generator', slug: 'css-glassmorphism-generator', icon: 'Droplets', desc: 'Create frosted glass UI effects with backdrop-filter blur and transparency.' },
      { name: 'CSS Text Shadow Generator', slug: 'css-text-shadow-generator', icon: 'Type', desc: 'Design 3D and glowing text-shadow CSS effects visually.' }
    ]
  },

  // --- 14. Security & Privacy Tools — 25 ---
  'security-tools': {
    name: 'Security & Privacy',
    defaultIcon: 'ShieldCheck',
    color: 'red',
    hex: '#ef4444',
    tools: [
      { name: 'Password Generator', slug: 'password-generator', icon: 'Lock', desc: 'Generate cryptographically strong random passwords with entropy scores.' },
      { name: 'Strong Password Generator', slug: 'strong-password-generator', icon: 'Shield', desc: 'Create 20+ character uncrackable passwords with symbols and digits.' },
      { name: 'Passphrase Generator', slug: 'passphrase-generator', icon: 'BookOpen', desc: 'Generate memorable Diceware multi-word passphrases (e.g. correct-horse-battery-staple).' },
      { name: 'Random Number Generator', slug: 'random-number-generator', icon: 'Dice5', desc: 'Generate cryptographically secure random integers within any min/max range.' },
      { name: 'Random String Generator', slug: 'random-string-generator', icon: 'Type', desc: 'Generate alphanumeric random tokens, API keys, and session strings.' },
      { name: 'PIN Generator', slug: 'pin-generator', icon: 'Key', desc: 'Generate secure 4-digit, 6-digit, and 8-digit numeric PIN codes.' },
      { name: 'Username Generator', slug: 'username-generator', icon: 'User', desc: 'Generate creative, anonymous, and memorable usernames for accounts.' },
      { name: 'Token Generator', slug: 'token-generator', icon: 'KeyRound', desc: 'Generate secure 32-character, 64-character, and 128-character auth tokens.' },
      { name: 'Hash Generator Sec', slug: 'hash-generator-sec', icon: 'Hash', desc: 'Generate SHA-256 and SHA-512 cryptographic digests in browser.' },
      { name: 'SHA Generator', slug: 'sha-generator', icon: 'ShieldCheck', desc: 'Calculate SHA-1, SHA-256, and SHA-512 hashes simultaneously.' },
      { name: 'MD5 Generator Sec', slug: 'md5-generator-sec', icon: 'Hash', desc: 'Generate standard MD5 checksum digests for text verification.' },
      { name: 'Checksum Generator', slug: 'checksum-generator', icon: 'CheckSquare', desc: 'Calculate CRC32 checksums for data integrity verification.' },
      { name: 'UUID Generator Sec', slug: 'uuid-generator-sec', icon: 'Key', desc: 'Generate RFC 4122 compliant version 4 UUID unique identifiers.' },
      { name: 'JWT Decoder Sec', slug: 'jwt-decoder-sec', icon: 'Shield', desc: 'Inspect JWT token claims, expiration times, and token headers.' },
      { name: 'JWT Generator Sec', slug: 'jwt-generator-sec', icon: 'Lock', desc: 'Generate test JSON Web Tokens with custom payload data.' },
      { name: 'Password Strength Checker', slug: 'password-strength-checker', icon: 'Gauge', desc: 'Test password crack times against dictionary and brute-force attacks.' },
      { name: 'Email Validator', slug: 'email-validator', icon: 'Mail', desc: 'Verify RFC 5322 email syntax and detect disposable email providers.' },
      { name: 'URL Safety Checker', slug: 'url-safety-checker', icon: 'ShieldAlert', desc: 'Analyze URLs for phishing patterns, deceptive redirects, and punycode spoofing.' },
      { name: 'IP Address Lookup', slug: 'ip-address-lookup', icon: 'Globe', desc: 'Inspect IP address metadata, subnet mask ranges, and address categories.' },
      { name: 'IPv4 Calculator', slug: 'ipv4-calculator', icon: 'Network', desc: 'Calculate network address, broadcast address, and host ranges for IPv4.' },
      { name: 'IPv6 Calculator', slug: 'ipv6-calculator', icon: 'Network', desc: 'Compress, expand, and calculate IPv6 prefix addresses.' },
      { name: 'Subnet Calculator', slug: 'subnet-calculator', icon: 'Grid', desc: 'Calculate network subnets, usable host IP counts, and wildcard masks.' },
      { name: 'CIDR Calculator', slug: 'cidr-calculator', icon: 'Cpu', desc: 'Convert CIDR slash notation (/24, /16) to decimal subnet masks.' },
      { name: 'SSL Certificate Checker', slug: 'ssl-certificate-checker', icon: 'Lock', desc: 'Look up SSL/TLS handshake requirements, encryption ciphers, and validation rules.' },
      { name: 'HTTP Header Analyzer', slug: 'http-header-analyzer', icon: 'FileSearch', desc: 'Analyze HTTP security headers including CSP, HSTS, and X-Frame-Options.' }
    ]
  },

  // --- 15. Education & Student Tools — 30 ---
  'education-tools': {
    name: 'Education & Student',
    defaultIcon: 'GraduationCap',
    color: 'sky',
    hex: '#0ea5e9',
    tools: [
      { name: 'GPA Calculator', slug: 'gpa-calculator', icon: 'GraduationCap', desc: 'Calculate semester and cumulative Grade Point Average on a 4.0 scale.' },
      { name: 'CGPA Calculator', slug: 'cgpa-calculator', icon: 'Award', desc: 'Calculate Cumulative GPA from semester grades and course credit hours.' },
      { name: 'Percentage Calculator Edu', slug: 'percentage-calculator-edu', icon: 'Percent', desc: 'Calculate exam score percentages and subject marks totals.' },
      { name: 'Grade Calculator', slug: 'grade-calculator', icon: 'CheckCircle2', desc: 'Calculate the minimum final exam grade required to earn your target course grade.' },
      { name: 'Average Calculator', slug: 'average-calculator', icon: 'BarChart', desc: 'Calculate the arithmetic mean, median, and range for any set of numbers.' },
      { name: 'Fraction Calculator', slug: 'fraction-calculator', icon: 'Divide', desc: 'Add, subtract, multiply, and divide fractions with step-by-step simplification.' },
      { name: 'Equation Solver', slug: 'equation-solver', icon: 'Equal', desc: 'Solve linear algebraic equations for X with step-by-step working.' },
      { name: 'Quadratic Equation Solver', slug: 'quadratic-equation-solver', icon: 'Activity', desc: 'Solve quadratic equations (ax² + bx + c = 0) with real and complex roots.' },
      { name: 'Scientific Calculator Edu', slug: 'scientific-calculator-edu', icon: 'Calculator', desc: 'Full-featured scientific calculator for physics, chemistry, and math problems.' },
      { name: 'Matrix Calculator', slug: 'matrix-calculator', icon: 'Grid', desc: 'Calculate matrix addition, multiplication, determinants, and transposes.' },
      { name: 'Statistics Calculator', slug: 'statistics-calculator', icon: 'BarChart2', desc: 'Calculate sample mean, standard deviation, variance, and quartiles.' },
      { name: 'Mean Calculator', slug: 'mean-calculator', icon: 'Sigma', desc: 'Calculate arithmetic, geometric, and harmonic means of datasets.' },
      { name: 'Median Calculator', slug: 'median-calculator', icon: 'Sliders', desc: 'Find the middle value and median of sorted numeric datasets.' },
      { name: 'Mode Calculator', slug: 'mode-calculator', icon: 'Layers', desc: 'Find the most frequently occurring numbers in a dataset.' },
      { name: 'Standard Deviation Calculator', slug: 'standard-deviation-calculator', icon: 'TrendingUp', desc: 'Calculate population and sample standard deviation (σ and s).' },
      { name: 'Variance Calculator', slug: 'variance-calculator', icon: 'Activity', desc: 'Calculate statistical variance measures of spread for data sets.' },
      { name: 'Probability Calculator Edu', slug: 'probability-calculator-edu', icon: 'Dice5', desc: 'Calculate permutations, combinations (nCr, nPr), and probability events.' },
      { name: 'Geometry Calculator', slug: 'geometry-calculator', icon: 'Shapes', desc: 'Calculate perimeter, area, and volume of geometric 2D and 3D shapes.' },
      { name: 'Triangle Calculator', slug: 'triangle-calculator', icon: 'Triangle', desc: 'Calculate triangle sides, angles, area, and perimeter using trigonometry.' },
      { name: 'Circle Calculator', slug: 'circle-calculator', icon: 'Circle', desc: 'Calculate circle radius, diameter, circumference, and area.' },
      { name: 'Pythagorean Calculator', slug: 'pythagorean-calculator', icon: 'Ruler', desc: 'Calculate right-angled triangle hypotenuse and leg lengths via a² + b² = c².' },
      { name: 'Prime Number Checker', slug: 'prime-number-checker', icon: 'Check', desc: 'Test whether any integer is prime and find its nearest prime neighbors.' },
      { name: 'Factor Calculator', slug: 'factor-calculator', icon: 'List', desc: 'Find all positive and negative factors and divisor pairs for any integer.' },
      { name: 'LCM Calculator', slug: 'lcm-calculator', icon: 'Minimize2', desc: 'Find the Least Common Multiple (LCM) of two or more numbers.' },
      { name: 'HCF Calculator', slug: 'hcf-calculator', icon: 'Maximize2', desc: 'Find the Highest Common Factor (HCF / GCD) of two or more numbers.' },
      { name: 'Number Factorizer', slug: 'number-factorizer', icon: 'Cpu', desc: 'Decompose any integer into its prime factorization representation.' },
      { name: 'Unit Converter Edu', slug: 'unit-converter-edu', icon: 'ArrowLeftRight', desc: 'Convert length, mass, time, temperature, and speed for physics homework.' },
      { name: 'Study Timer', slug: 'study-timer', icon: 'Clock', desc: 'Customizable study session timer with sound chimes for deep focus.' },
      { name: 'Pomodoro Timer', slug: 'pomodoro-timer', icon: 'Timer', desc: 'Classic 25-minute study focus interval timer with 5-minute restorative breaks.' },
      { name: 'Citation Generator', slug: 'citation-generator', icon: 'BookOpen', desc: 'Format APA, MLA, and Chicago bibliography citations for research papers.' }
    ]
  },

  // --- 16. Business & Productivity — 25 ---
  'business-tools': {
    name: 'Business & Productivity',
    defaultIcon: 'Briefcase',
    color: 'amber',
    hex: '#d97706',
    tools: [
      { name: 'Invoice Generator', slug: 'invoice-generator', icon: 'FileText', desc: 'Generate professional printable PDF invoices with line items, tax, and totals.' },
      { name: 'Receipt Generator', slug: 'receipt-generator', icon: 'Receipt', desc: 'Create clean sales transaction receipts for customers and accounting.' },
      { name: 'Quotation Generator', slug: 'quotation-generator', icon: 'FileSpreadsheet', desc: 'Create business price quotes and estimates for prospective clients.' },
      { name: 'Business Name Generator', slug: 'business-name-generator', icon: 'Sparkles', desc: 'Generate creative, brandable company and product name concepts.' },
      { name: 'Company Name Generator', slug: 'company-name-generator', icon: 'Building', desc: 'Brainstorm memorable corporate names across tech, retail, and services.' },
      { name: 'Username Generator Biz', slug: 'username-generator-biz', icon: 'User', desc: 'Generate professional handles for LinkedIn, GitHub, and corporate accounts.' },
      { name: 'QR Business Card Generator', slug: 'qr-business-card-generator', icon: 'QrCode', desc: 'Generate vCard QR codes that save contact info directly to phone address books.' },
      { name: 'Email Signature Generator', slug: 'email-signature-generator', icon: 'Mail', desc: 'Design professional HTML email signatures with photo, title, and social links.' },
      { name: 'Meeting Cost Calculator', slug: 'meeting-cost-calculator', icon: 'Clock', desc: 'Calculate the real financial dollar cost of team meetings based on attendee salaries.' },
      { name: 'Salary Calculator Biz', slug: 'salary-calculator-biz', icon: 'DollarSign', desc: 'Convert between hourly contractor rates and full-time employee compensations.' },
      { name: 'Profit Calculator Biz', slug: 'profit-calculator-biz', icon: 'TrendingUp', desc: 'Calculate gross profit, operating profit, and net profit margins.' },
      { name: 'Margin Calculator', slug: 'margin-calculator', icon: 'Percent', desc: 'Calculate product sales margins and markup pricing strategies.' },
      { name: 'ROI Calculator Biz', slug: 'roi-calculator-biz', icon: 'Target', desc: 'Calculate expected Return on Investment for marketing and software tools.' },
      { name: 'Break-Even Calculator Biz', slug: 'break-even-calculator-biz', icon: 'Sliders', desc: 'Calculate the break-even sales threshold in units and revenue dollars.' },
      { name: 'Invoice Number Generator', slug: 'invoice-number-generator', icon: 'Hash', desc: 'Generate sequential and structured invoice reference tracking numbers.' },
      { name: 'Freelance Rate Calculator', slug: 'freelance-rate-calculator', icon: 'Calculator', desc: 'Calculate your optimal hourly or project freelance billing rate.' },
      { name: 'Bill Splitter', slug: 'bill-splitter', icon: 'Users', desc: 'Split group business lunches and client entertainment tabs with tip.' },
      { name: 'Discount Calculator Biz', slug: 'discount-calculator-biz', icon: 'Tag', desc: 'Calculate volume order discounts and promotional client pricing.' },
      { name: 'Sales Tax Calculator', slug: 'sales-tax-calculator', icon: 'Coins', desc: 'Calculate state and provincial sales tax additions on checkout orders.' },
      { name: 'Working Days Calculator Biz', slug: 'working-days-calculator-biz', icon: 'Calendar', desc: 'Calculate billable project sprint days between kickoff and launch dates.' },
      { name: 'Mileage Expense Calculator', slug: 'mileage-expense-calculator', icon: 'Car', desc: 'Calculate business travel mileage reimbursements at IRS standard rates.' },
      { name: 'Overtime Pay Calculator', slug: 'overtime-pay-calculator', icon: 'Clock', desc: 'Calculate 1.5x time-and-a-half and 2.0x double-time overtime wage pay.' },
      { name: 'Customer Lifetime Value Calculator', slug: 'clv-calculator', icon: 'TrendingUp', desc: 'Calculate customer lifetime value (LTV / CLV) and churn economics.' },
      { name: 'Customer Acquisition Cost Calculator', slug: 'cac-calculator', icon: 'Target', desc: 'Calculate Customer Acquisition Cost (CAC) across sales channels.' },
      { name: 'Task Priority Matrix', slug: 'task-priority-matrix', icon: 'CheckSquare', desc: 'Prioritize business initiatives using the Eisenhower Urgent vs Important matrix.' }
    ]
  }
};

// Vibrant color palette pool
const PALETTE_COLORS = [
  { name: 'amber', hex: '#f59e0b', colorClass: 'text-amber-500', bgGradient: 'from-amber-500 to-orange-500' },
  { name: 'orange', hex: '#f97316', colorClass: 'text-orange-500', bgGradient: 'from-orange-500 to-amber-600' },
  { name: 'purple', hex: '#a855f7', colorClass: 'text-purple-500', bgGradient: 'from-purple-500 to-violet-600' },
  { name: 'violet', hex: '#8b5cf6', colorClass: 'text-violet-500', bgGradient: 'from-violet-500 to-indigo-600' },
  { name: 'pink', hex: '#ec4899', colorClass: 'text-pink-500', bgGradient: 'from-pink-500 to-rose-600' },
  { name: 'fuchsia', hex: '#d946ef', colorClass: 'text-fuchsia-500', bgGradient: 'from-fuchsia-500 to-purple-600' },
  { name: 'emerald', hex: '#10b981', colorClass: 'text-emerald-500', bgGradient: 'from-emerald-500 to-teal-600' },
  { name: 'teal', hex: '#14b8a6', colorClass: 'text-teal-500', bgGradient: 'from-teal-500 to-cyan-600' },
  { name: 'rose', hex: '#f43f5e', colorClass: 'text-rose-500', bgGradient: 'from-rose-500 to-pink-600' },
  { name: 'red', hex: '#ef4444', colorClass: 'text-red-500', bgGradient: 'from-red-500 to-rose-600' },
  { name: 'cyan', hex: '#06b6d4', colorClass: 'text-cyan-500', bgGradient: 'from-cyan-500 to-blue-600' },
  { name: 'sky', hex: '#0ea5e9', colorClass: 'text-sky-500', bgGradient: 'from-sky-500 to-cyan-600' },
  { name: 'indigo', hex: '#6366f1', colorClass: 'text-indigo-500', bgGradient: 'from-indigo-500 to-purple-600' },
  { name: 'blue', hex: '#3b82f6', colorClass: 'text-blue-500', bgGradient: 'from-blue-500 to-indigo-600' },
  { name: 'lime', hex: '#84cc16', colorClass: 'text-lime-500', bgGradient: 'from-lime-500 to-emerald-600' },
  { name: 'yellow', hex: '#eab308', colorClass: 'text-yellow-500', bgGradient: 'from-yellow-500 to-amber-600' }
];

// Read existing tools from toolsRegistry.ts
const currentContent = fs.readFileSync('src/data/toolsRegistry.ts', 'utf8');
const match = currentContent.match(/export const TOOLS_REGISTRY: ToolDefinition\[\] = (\[[\s\S]*?\]);\s*export function/);

let existingTools = [];
if (match) {
  try {
    existingTools = JSON.parse(match[1]);
  } catch (e) {
    console.error('Could not parse existing tools, starting fresh');
  }
}

// Map existing slugs
const existingSlugs = new Set(existingTools.map(t => t.slug));

let newToolList = [...existingTools];
let colorIdx = existingTools.length;

for (const [catId, catInfo] of Object.entries(NEW_CATEGORIES_DATA)) {
  catInfo.tools.forEach((t, i) => {
    if (existingSlugs.has(t.slug)) {
      // Tool already registered, skip or update category
      return;
    }
    const palette = PALETTE_COLORS[colorIdx % PALETTE_COLORS.length];
    colorIdx++;
    newToolList.push({
      id: t.slug,
      slug: t.slug,
      name: t.name,
      category: catId,
      componentId: t.slug,
      icon: t.icon,
      isPopular: i < 5,
      isNew: i > 25,
      accentColor: palette.name,
      accentHex: palette.hex,
      colorClass: palette.colorClass,
      bgGradient: palette.bgGradient,
      shortDesc: t.desc,
      description: `${t.name} is a 100% free, fast, and privacy-first online tool. Process files and calculations instantly in your browser with zero data uploaded to servers.`,
      keywords: [t.name.toLowerCase(), t.slug.replace(/-/g, ' '), `${t.name.toLowerCase()} online`, `free ${t.name.toLowerCase()}`],
      seo: {
        title: `${t.name} — Free 100% Online Tool | Toolio`,
        description: `${t.desc} Free, instant, and secure browser calculation on Toolio.`,
        canonicalPath: `/tools/${t.slug}`,
        schemaType: 'WebApplication'
      },
      howToUse: [
        'Enter your input values, numbers, or text into the fields.',
        'Customize options such as formulas, rate, or target preferences.',
        'Review the instant real-time live preview and calculated breakdown.',
        'Click the action button to copy the result or download the generated output.'
      ],
      features: [
        '100% client-side execution inside your browser for maximum privacy',
        'Instant calculations as you type with zero lag',
        'Visual interactive charts and breakdowns',
        'Zero registration or software installation required',
        'One-click copy and export options'
      ],
      faqs: [
        {
          question: `Is ${t.name} free to use?`,
          answer: `Yes, ${t.name} on Toolio is 100% free with unlimited usage and no account required.`
        },
        {
          question: `Are my numbers or data stored anywhere?`,
          answer: `No. All calculations run strictly in your browser memory. No data is stored, tracked, or sent across the internet.`
        }
      ]
    });
  });
}

console.log(`Total tools in registry now: ${newToolList.length}!`);

const fileContent = `import { ToolDefinition } from '../types';

export const TOOLS_REGISTRY: ToolDefinition[] = ${JSON.stringify(newToolList, null, 2)};

export function getToolBySlug(slug: string): ToolDefinition | undefined {
  return TOOLS_REGISTRY.find(t => t.slug === slug || t.id === slug);
}

export function getToolsByCategory(categoryId: string): ToolDefinition[] {
  return TOOLS_REGISTRY.filter(t => t.category === categoryId);
}

export function getPopularTools(): ToolDefinition[] {
  return TOOLS_REGISTRY.filter(t => t.isPopular);
}

export function searchTools(query: string): ToolDefinition[] {
  if (!query || !query.trim()) return [];
  const q = query.toLowerCase().trim();
  return TOOLS_REGISTRY.filter(tool => {
    return (
      tool.name.toLowerCase().includes(q) ||
      tool.shortDesc.toLowerCase().includes(q) ||
      tool.category.toLowerCase().includes(q) ||
      tool.keywords.some(k => k.toLowerCase().includes(q))
    );
  });
}
`;

fs.writeFileSync('src/data/toolsRegistry.ts', fileContent, 'utf8');
console.log('Successfully written updated toolsRegistry.ts');
