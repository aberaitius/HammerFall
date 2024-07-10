document.getElementById('auctionForm').addEventListener('submit', function(event) {
    event.preventDefault();
  
    const totalExpense = parseFloat(document.getElementById('totalExpense').value);
    const buyerPremiumRate = parseFloat(document.getElementById('buyerPremiumRate').value);
    const taxRate = parseFloat(document.getElementById('taxRate').value);
    const taxPremiumRate = parseFloat(document.getElementById('taxPremiumRate').value);
    const taxChargesRate = parseFloat(document.getElementById('taxChargesRate').value);
    const calcMode = document.getElementById('calcMode').checked;
  
    const expenseError = document.getElementById('expenseError');
    const premiumError = document.getElementById('premiumError');
    const taxError = document.getElementById('taxError');
    const taxPremiumError = document.getElementById('taxPremiumError');
    const taxChargesError = document.getElementById('taxChargesError');
  
    let valid = true;
  
    if (isNaN(totalExpense) || totalExpense <= 0) {
      expenseError.textContent = 'Please enter a valid amount greater than 0.';
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

    if (isNaN(taxChargesRate) || taxChargesRate < 0) {
      taxChargesError.textContent = 'Please enter a valid tax rate on charges.';
      taxChargesError.style.display = 'block';
      valid = false;
    } else {
      taxChargesError.style.display = 'none';
    }
  
    if (!valid) return;
  
    let result, hammerPriceValue, totalExpenseValue;
    if (calcMode) {
        // Calculate ideal bid based on the provided total expense
        const hammerPrice = totalExpense / (1 + (buyerPremiumRate / 100) + (taxRate / 100) + ((buyerPremiumRate / 100) * (taxPremiumRate / 100)));
        hammerPriceValue = Math.round((hammerPrice + Number.EPSILON) * 100) / 100;
        result = `Your Ideal Bid / Hammer Price: ${hammerPriceValue.toFixed(2).toLocaleString('en-US').replace(/,/g, ' ')}`;
    } else {
        // Calculate total expense from the provided hammer price
        hammerPriceValue = totalExpense;
        const buyerPremium = hammerPriceValue * (buyerPremiumRate / 100);
        const taxOnHammerPrice = hammerPriceValue * (taxRate / 100);
        const taxOnPremium = buyerPremium * (taxPremiumRate / 100);
        const taxOnCharges = hammerPriceValue * (taxChargesRate / 100);
        totalExpenseValue = hammerPriceValue + buyerPremium + taxOnHammerPrice + taxOnPremium + taxOnCharges;
        result = `Your Total Expense: ${totalExpenseValue.toFixed(2).toLocaleString('en-US').replace(/,/g, ' ')}`;
    }

    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `<h3>${result}</h3>`;
    resultDiv.style.display = 'block';
  
    document.getElementById('addToTable').style.display = 'inline-block';

    // Store the calculated values for later use
    document.getElementById('addToTable').dataset.hammerPrice = hammerPriceValue.toFixed(2);
    document.getElementById('addToTable').dataset.totalExpense = totalExpenseValue ? totalExpenseValue.toFixed(2) : totalExpense;
});

document.getElementById('calcMode').addEventListener('change', function() {
    const calcModeLabel = document.getElementById('calcModeLabel');
    const inputLabel = document.getElementById('inputLabel');
    const totalExpenseInput = document.getElementById('totalExpense');
    const calculateButton = document.querySelector('.btn');

    if (this.checked) {
        calcModeLabel.textContent = 'Calculate Ideal Bid / Hammer Price';
        inputLabel.textContent = 'Total Expense';
        totalExpenseInput.placeholder = 'The total amount you are willing to spend';
        totalExpenseInput.classList.remove('total-expense-mode');
        totalExpenseInput.classList.add('ideal-bid-mode');
        calculateButton.classList.remove('total-expense-mode');
        calculateButton.classList.add('ideal-bid-mode');
    } else {
        calcModeLabel.textContent = 'Calculate Total Expense';
        inputLabel.textContent = 'Hammer Price';
        totalExpenseInput.placeholder = 'The hammer price of the item';
        totalExpenseInput.classList.remove('ideal-bid-mode');
        totalExpenseInput.classList.add('total-expense-mode');
        calculateButton.classList.remove('ideal-bid-mode');
        calculateButton.classList.add('total-expense-mode');
    }
});

document.getElementById('addToTable').addEventListener('click', function() {
    const hammerPrice = this.dataset.hammerPrice;
    const totalExpense = this.dataset.totalExpense;
    const description = '';
  
    const table = document.getElementById('hammerfallTable').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();
    const cell1 = newRow.insertCell(0);
    const cell2 = newRow.insertCell(1);
    const cell3 = newRow.insertCell(2);
    const cell4 = newRow.insertCell(3);
  
    cell1.innerHTML = `<input type="text" class="editable" style="width:auto; border:none;" value="${hammerPrice}" />`;
    cell2.innerHTML = `<input type="text" class="editable" style="width:auto; border:none;" value="${description}" />`;
    cell3.innerHTML = `<input type="text" class="editable" style="width:auto; border:none;" value="${totalExpense}" />`;
    cell4.innerHTML = `<button class="remove-btn">Remove</button>`;
  
    document.getElementById('hammerfallTable').style.display = 'table';
    document.getElementById('exportTable').style.display = 'inline-block';
  
    // Remove row functionality
    cell4.querySelector('.remove-btn').addEventListener('click', function() {
        this.closest('tr').remove();
        if (table.rows.length === 0) {
            document.getElementById('hammerfallTable').style.display = 'none';
            document.getElementById('exportTable').style.display = 'none';
        }
    });
});

document.getElementById('exportTable').addEventListener('click', function() {
    const table = document.getElementById('hammerfallTable');
    const cloneTable = table.cloneNode(true);
  
    // Get data from inputs and set it as text content
    for (let row of cloneTable.rows) {
        for (let cell of row.cells) {
            if (cell.children.length > 0 && cell.children[0].tagName === 'INPUT') {
                cell.textContent = cell.children[0].value;
            }
        }
        row.deleteCell(-1); // Remove the last cell (Actions)
    }
    
    const workbook = XLSX.utils.table_to_book(cloneTable, {sheet: "Sheet1"});
    XLSX.writeFile(workbook, 'hammerfall_data.xlsx');
});
