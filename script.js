document.getElementById('auctionForm').addEventListener('submit', function(event) {
    event.preventDefault();
  
    const totalExpense = parseFloat(document.getElementById('totalExpense').value);
    const buyerPremiumRate = parseFloat(document.getElementById('buyerPremiumRate').value);
    const taxRate = parseFloat(document.getElementById('taxRate').value);
    const taxPremiumRate = parseFloat(document.getElementById('taxPremiumRate').value);
  
    const expenseError = document.getElementById('expenseError');
    const premiumError = document.getElementById('premiumError');
    const taxError = document.getElementById('taxError');
    const taxPremiumError = document.getElementById('taxPremiumError');
  
    let valid = true;
  
    if (isNaN(totalExpense) || totalExpense <= 0) {
      expenseError.textContent = 'Please enter a valid total expense greater than 0.';
      expenseError.style.display = 'block';
      valid = false;
    } else {
      expenseError.style.display = 'none';
    }
  
    if (isNaN(buyerPremiumRate) || buyerPremiumRate < 0) {
      premiumError.textContent = 'Please enter a valid buyer\'s premium percentage.';
      premiumError.style.display = 'block';
      valid = false;
    } else {
      premiumError.style.display = 'none';
    }
  
    if (isNaN(taxRate) || taxRate < 0) {
      taxError.textContent = 'Please enter a valid tax rate on hammer price.';
      taxError.style.display = 'block';
      valid = false;
    } else {
      taxError.style.display = 'none';
    }
  
    if (isNaN(taxPremiumRate) || taxPremiumRate < 0) {
      taxPremiumError.textContent = 'Please enter a valid tax rate on buyer\'s premium.';
      taxPremiumError.style.display = 'block';
      valid = false;
    } else {
      taxPremiumError.style.display = 'none';
    }
  
    if (!valid) return;
  
    // Calculate the hammer price
    const hammerPrice = totalExpense / (1 + (buyerPremiumRate / 100) + (taxRate / 100) + ((buyerPremiumRate / 100) * (taxPremiumRate / 100)));

    // Format the hammer price with two decimal places and spaces
    const formattedHammerPrice = parseFloat(hammerPrice.toFixed(2)).toLocaleString('en-US').replace(/,/g, ' ');

  
    // Display the result with formatting
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `<h3>Your Final Bid/ Hammer Price: ${formattedHammerPrice}</h3>`;
    resultDiv.style.display = 'block';
  });
  