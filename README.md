# Dabbulu Urike Ravu - Personal Expense Tracker

A beautifully designed expense tracker specifically built for Indian bachelor lifestyle. Track expenses, set budgets, and get smart insights - all starting from zero data.

## Features

### 🚀 Ultra-Fast Expense Entry (< 10 seconds)
- Single compact form with smart defaults
- Auto-categorization based on merchant keywords
- Payment methods: UPI, Wallet, Cash, Card
- Instant toast notifications

### 🏠 India Bachelor Categories
Pre-configured categories for typical bachelor expenses:
- Rent
- Mess/Food (Zomato, Swiggy auto-detected)
- Tiffin
- Groceries (DMart, Big Bazaar auto-detected)
- UPI/Wallet (PhonePe, Paytm, GPay auto-detected)
- Commute (Uber, Ola, Metro, Auto auto-detected)
- Mobile/Data (Jio, Airtel, Vi auto-detected)
- Utilities (Electricity, Water, Gas)
- Entertainment (Netflix, Movies)
- Health/Pharmacy
- Shopping (Amazon, Flipkart)
- Travel

### 📊 Smart Dashboard
- Today's spending total
- Monthly spending with trend
- Category breakdown (visual)
- Recent transactions with quick actions
- Budget alerts and warnings

### 💰 Budget Management
- Set monthly limits per category
- Visual progress indicators
- Gentle warnings at 80% usage
- Clear alerts when over budget
- Remaining budget calculations

### 📱 Beautiful Design
- Mobile-first responsive design
- Orange and teal color palette inspired by Indian aesthetics
- Smooth animations and micro-interactions
- High contrast for readability
- Large touch targets for mobile

## How to Run

### Development
```bash
npm install
npm run dev
```

### Build for Production
```bash
npm run build
npm run preview
```

## Usage Flows

### Adding an Expense (< 10 seconds)
1. Click the floating + button
2. Enter amount (auto-focused)
3. Select payment method (defaults to UPI)
4. Add note (optional - triggers smart categorization)
5. Category auto-selected or manually choose
6. Click "Add Expense"
7. Toast confirmation → Ready for next entry

### Setting Budgets
1. Go to Budgets tab
2. Click "Set Budget" for any category
3. Enter monthly limit
4. System tracks progress automatically
5. Get alerts when approaching/exceeding limits

### Smart Categorization
The app automatically suggests categories based on keywords in notes:
- "Zomato" → Mess/Food
- "Metro" → Commute
- "Jio recharge" → Mobile/Data
- "DMart" → Groceries
- And many more...

## Data Storage
- Uses browser localStorage (no server needed)
- Single user design
- All data stays on your device
- No sign-up complexity - just email

## Technical Details
- Built with React + TypeScript
- Vite for fast development
- Tailwind CSS for styling
- Lucide React for icons
- Responsive design (mobile-first)

## Success Criteria ✅
- ✅ Expense entry in under 10 seconds
- ✅ Dashboard understood in under 5 seconds  
- ✅ Budget alerts are helpful, not intrusive
- ✅ Zero sample data - starts completely clean
- ✅ Beautiful production-ready design

Start tracking your expenses the Indian bachelor way! 🇮🇳