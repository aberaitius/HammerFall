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
  
    // Calculate the hammer price with high precision
    const hammerPrice = totalExpense / (1 + (buyerPremiumRate / 100) + (taxRate / 100) + ((buyerPremiumRate / 100) * (taxPremiumRate / 100)));
    console.log("Hammer Price (Raw):", hammerPrice); 
    // Round the hammer price to avoid floating-point precision issues
    //const roundedHammerPrice = Math.round((hammerPrice + Number.EPSILON) * 100) / 100;

    const formattedHammerPrice = hammerPrice.toFixed(2).toLocaleString('en-US').replace(/,/g, ' ');

    // Display the result
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `<h3>Your Final Bid/ Hammer Price: ${formattedHammerPrice}</h3>`;
    resultDiv.style.display = 'block';

    document.getElementById('addToTable').style.display = 'inline-block';
});


document.getElementById('addToTable').addEventListener('click', function() {
    const hammerPriceText = document.getElementById('result').textContent;
    const hammerPrice = parseFloat(hammerPriceText.replace(/[^\d.-]/g, ''));
    const description = '';
    const totalExpense = document.getElementById('totalExpense').value;

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
