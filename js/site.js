// Get the loan information from the page.
function getValues() {

    // Step 1: Get values from the page.
    let loanAmount = Number(document.getElementById("loanAmount").value);
    let loanTerms = parseInt(document.getElementById("loanTerms").value);
    let loanRate = parseFloat(document.getElementById("loanRate").value);

    // Check for NaN
    if (isNaN(loanAmount)) {
        alert("Enter a valid loan amount. Must be a number.");
        document.getElementById("loanAmount").focus();
    } else if (isNaN(loanTerms)) {
        alert("Enter valid payment terms. Must be entered in number of months.");
        document.getElementById("loanTerms").focus();
    } else if (isNaN(loanRate)) {
        alert("Enter a valid interest rate. Leave off any symbols.");
        document.getElementById("loanRate").focus();
    } else {

        // Convert annual rate to monthly rate
        let monthlyRate = calcRate(loanRate);

        // Calculate monthly payment
        let loanPayment = calcPayment(loanAmount, monthlyRate, loanTerms);

        // Build schedule
        let payments = buildSchedule(loanAmount, monthlyRate, loanTerms, loanPayment);

        displayData(payments, loanAmount, loanPayment);
    }

}

// Builds an amortization schedule.
function buildSchedule(amount, rate, term, payment) {

    let payments = [];

    let balance = amount;
    let totalInterest = 0;
    let monthlyInterest = 0;
    let monthlyPrincipal = 0;

    for (let month = 1; month <= term; month++) {

        monthlyInterest = calcInterest(balance, rate);
        totalInterest += monthlyInterest;
        monthlyPrincipal = payment - monthlyInterest;
        balance = balance - monthlyPrincipal;

        let currentPayment = {
            month: month,
            payment: payment,
            principal: monthlyPrincipal,
            interest: monthlyInterest,
            totalInterest: totalInterest,
            balance: balance
        }

        payments.push(currentPayment);

    }

    return payments;

}

// Display table of payments.
// Display summary information at the top of the page.
function displayData(payments, loanAmount, payment) {

    let tableBody = document.getElementById("scheduleBody");
    let template = document.getElementById("scheduleTemplate");

    // Clear the table of previous values
    tableBody.innerHTML = "";

    for (let index = 0; index < payments.length; index++) {

        // Clone the template
        paymentRow = document.importNode(template.content, true);

        // Get the array of columns
        paymentCols = paymentRow.querySelectorAll("td");

        paymentCols[0].textContent = payments[index].month;
        paymentCols[1].textContent = payments[index].payment.toFixed(2);
        paymentCols[2].textContent = payments[index].principal.toFixed(2);
        paymentCols[3].textContent = payments[index].interest.toFixed(2);
        paymentCols[4].textContent = payments[index].totalInterest.toFixed(2);
        paymentCols[5].textContent = payments[index].balance.toFixed(2);

        // Write the payment to the page
        tableBody.appendChild(paymentRow);


    }

    document.getElementById("payment").innerHTML = Number(payment).toLocaleString("en-US", {
        style: "currency",
        currency: "USD"
    });

    document.getElementById("totalPrincipal").innerHTML = Number(loanAmount).toLocaleString("en-US", {
        style: "currency",
        currency: "USD"
    });

    let totalInterest = payments[payments.length - 1].totalInterest;

    document.getElementById("totalInterest").innerHTML = Number(totalInterest).toLocaleString("en-US", {
        style: "currency",
        currency: "USD"
    });

    let totalCost = totalInterest + loanAmount;

    document.getElementById("totalCost").innerHTML = Number(totalCost).toLocaleString("en-US", {
        style: "currency",
        currency: "USD"
    });

}

// Calculates a payment / rate is a monthly rate, term is total-months
function calcPayment(amount, rate, term) {
    let payment = 0;
    payment = (amount * rate) / (1 - Math.pow(1 + rate, -term));
    return payment;
}

// Calculates monthly rate for loan duration.
function calcRate(rate) {
    return rate = rate / 1200;
}

// Current balance and monthly rate
function calcInterest(balance, rate) {
    return balance * rate;
}