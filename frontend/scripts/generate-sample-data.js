const fs = require('fs');
const path = require('path');

const categories = {
  "Electronics": {
    subcategories: ["Smartphones", "Laptops", "Accessories", "Audio", "Wearables"],
    products: [
      { name: "iPhone 15 Pro", price: 999, cost: 650 },
      { name: "MacBook Air M3", price: 1099, cost: 700 },
      { name: "Wireless ANC Headphones", price: 199, cost: 110 },
      { name: "Smart Fitness Watch", price: 249, cost: 150 },
      { name: "Ultra-wide 34\" Monitor", price: 449, cost: 280 },
      { name: "USB-C Multiport Hub", price: 79, cost: 35 },
      { name: "Mechanical Keyboard", price: 129, cost: 60 }
    ]
  },
  "Furniture": {
    subcategories: ["Chairs", "Desks", "Storage", "Lighting", "Decor"],
    products: [
      { name: "Ergonomic Office Chair", price: 349, cost: 180 },
      { name: "Standing Desk (Electric)", price: 499, cost: 260 },
      { name: "3-Tier Bookshelf", price: 149, cost: 80 },
      { name: "LED Architect Desk Lamp", price: 89, cost: 40 },
      { name: "Minimalist Coffee Table", price: 199, cost: 100 }
    ]
  },
  "Office Supplies": {
    subcategories: ["Paper", "Pens", "Binders", "Organizers", "Supplies"],
    products: [
      { name: "Premium Notebook (A5)", price: 18, cost: 7 },
      { name: "Gel Pen Multi-color Set", price: 15, cost: 5 },
      { name: "Heavy Duty Stapler", price: 25, cost: 10 },
      { name: "Mesh Desk Organizer", price: 29, cost: 12 },
      { name: "Dry Erase Whiteboard", price: 59, cost: 25 }
    ]
  }
};

const regions = {
  "North America": ["California", "New York", "Texas", "Washington", "Illinois"],
  "Europe": ["London", "Paris", "Berlin", "Amsterdam", "Madrid"],
  "Asia-Pacific": ["Tokyo", "Singapore", "Sydney", "Mumbai", "Seoul"],
  "Latin America": ["São Paulo", "Mexico City", "Bogotá", "Santiago", "Lima"]
};

const salespersons = {
  "North America": ["Sarah Jenkins", "Michael Chang"],
  "Europe": ["Emma Watson", "Hans Schmidt"],
  "Asia-Pacific": ["Rajesh Kumar", "Yuki Tanaka"],
  "Latin America": ["Carlos Gomez", "Sofia Rossi"]
};

const paymentMethods = ["Credit Card", "PayPal", "Bank Transfer", "Apple Pay"];
const orderStatuses = ["Completed", "Completed", "Completed", "Pending", "Cancelled"];
const genders = ["Male", "Female", "Non-binary", "Prefer not to say"];

function generateData() {
  const rows = [];
  const now = new Date("2026-07-11");
  const totalRows = 350; // Generating 350 rows for rich charts

  for (let i = 1; i <= totalRows; i++) {
    // Generate order date spread over the last 12 months with trend
    const daysAgo = Math.floor(Math.random() * 365);
    const orderDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    
    // Choose Category
    const catKeys = Object.keys(categories);
    const category = catKeys[Math.floor(Math.random() * catKeys.length)];
    const catData = categories[category];
    
    // Choose Product
    const product = catData.products[Math.floor(Math.random() * catData.products.length)];
    const subcategory = catData.subcategories[Math.floor(Math.random() * catData.subcategories.length)];
    
    // Quantity
    const qty = Math.floor(Math.random() * 5) + 1; // 1 to 5 units
    
    // Discount
    const discChance = Math.random();
    const discount = discChance > 0.7 ? (discChance > 0.9 ? 0.2 : 0.1) : 0.0;
    
    // Calculations
    const unitPrice = product.price;
    const costPrice = product.cost;
    const rawTotal = unitPrice * qty;
    const sellingPrice = parseFloat((rawTotal * (1 - discount)).toFixed(2));
    const profit = parseFloat((sellingPrice - (costPrice * qty)).toFixed(2));
    
    // Geography
    const regionKeys = Object.keys(regions);
    const region = regionKeys[Math.floor(Math.random() * regionKeys.length)];
    const stateList = regions[region];
    const state = stateList[Math.floor(Math.random() * stateList.length)];
    const city = state; // Simple mapping
    
    // Salesperson
    const spList = salespersons[region];
    const salesperson = spList[Math.floor(Math.random() * spList.length)];
    
    // Customer
    const customerIdNum = Math.floor(Math.random() * 80) + 1;
    const customerId = `CUST-${String(customerIdNum).padStart(4, '0')}`;
    const customerName = `Client ${customerIdNum}`;
    const customerAge = Math.floor(Math.random() * 45) + 20; // 20 to 65
    const customerGender = genders[Math.floor(Math.random() * genders.length)];
    
    const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
    const orderStatus = orderStatuses[Math.floor(Math.random() * orderStatuses.length)];
    const deliveryTime = orderStatus === "Completed" ? Math.floor(Math.random() * 5) + 1 : 0;
    const stockAvailable = Math.floor(Math.random() * 200) + 10;
    const supplier = `${category} Global Supply Co.`;
    
    rows.push({
      "Sales ID": `S-${String(i).padStart(6, '0')}`,
      "Order Date": orderDate.toISOString().split('T')[0],
      "Product Name": product.name,
      "Category": category,
      "Sub Category": subcategory,
      "Quantity": qty,
      "Unit Price": unitPrice,
      "Discount": discount,
      "Cost Price": costPrice,
      "Selling Price": sellingPrice,
      "Profit": profit,
      "Region": region,
      "State": state,
      "City": city,
      "Salesperson": salesperson,
      "Customer Name": customerName,
      "Customer ID": customerId,
      "Customer Age": customerAge,
      "Customer Gender": customerGender,
      "Payment Method": paymentMethod,
      "Order Status": orderStatus,
      "Delivery Time": deliveryTime,
      "Stock Available": stockAvailable,
      "Supplier": supplier
    });
  }

  // Sort by date ascending
  rows.sort((a, b) => new Date(a["Order Date"]) - new Date(b["Order Date"]));

  const outDir = path.join(__dirname, '..', 'public', 'data');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(outDir, 'sample_sales.json'),
    JSON.stringify(rows, null, 2)
  );

  console.log(`Generated ${rows.length} rows of sample sales data to public/data/sample_sales.json`);
}

generateData();
