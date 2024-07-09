// Total cost
const totalCost = 130000;

// Constants for the calculations
const buyerPremiumRate = 0.05;
const taxRate = 0.15;
const taxOnBuyerPremiumRate = 0.15;

// Calculate the effective multiplier
const multiplier = 1 + buyerPremiumRate + taxRate + (buyerPremiumRate * taxOnBuyerPremiumRate);

// Calculate the hammer price
const hammerPrice = totalCost / multiplier;

console.log("Hammer Price:", hammerPrice.toFixed(2)); // Show result with two decimal precision
