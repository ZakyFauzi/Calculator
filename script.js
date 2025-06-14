const currDisplay = document.querySelector(".curr-display"); 
const prevDisplay = document.querySelector(".prev-display"); 
const numberButtons = document.querySelectorAll(".number"); 
const operationButtons = document.querySelectorAll(".operation"); 
const equalsButton = document.querySelector(".equal"); 
const clearButton = document.querySelector(".action-button"); 
const deleteButton = document.querySelector(".delete"); 

let currentExpression = ''; 
let resultCalculated = false; 

function updateDisplay() {
    currDisplay.textContent = currentExpression;
}

function appendToExpression(text) {
    if (resultCalculated && (text === '.' || (text >= '0' && text <= '9'))) {
        currentExpression = text; 
        resultCalculated = false;
    } else if (resultCalculated && (text === '+' || text === '-' || text === '*' || text === '/')) {
        resultCalculated = false;
        currentExpression += text; 
    } else {
        currentExpression += text;
    }
    updateDisplay();
}

function handleOperation(operator) {
    if (currentExpression === '' && operator !== '-' && operator !== '(') return;

    const lastChar = currentExpression.slice(-1);
    if (['+', '-', '*', '/'].includes(lastChar) && ['+', '-', '*', '/'].includes(operator)) {
        currentExpression = currentExpression.slice(0, -1) + operator;
    } else {
        currentExpression += operator;
    }
    resultCalculated = false;
    updateDisplay();
}

function clearDisplay() { 
    currentExpression = '';
    prevDisplay.textContent = '';
    resultCalculated = false;
    updateDisplay();
}

function deleteLast() { 
    currentExpression = currentExpression.slice(0, -1);
    resultCalculated = false;
    updateDisplay();
}

function calculateResult() { 
    if (currentExpression === '') return;

    try {
        let evalExpression = currentExpression.replace(/x²/g, '**2').replace(/√/g, 'math.sqrt(').replace(/%/g, '/100');
        
        if (evalExpression.includes('math.sqrt(')) {
            const openParenCount = (evalExpression.match(/\(/g) || []).length;
            const closeParenCount = (evalExpression.match(/\)/g) || []).length;
            if (openParenCount > closeParenCount) {
                evalExpression += ')'.repeat(openParenCount - closeParenCount);
            }
        }


        const result = eval(evalExpression);
        prevDisplay.textContent = currentExpression + ' =';
        currentExpression = result.toString();
        resultCalculated = true;
        updateDisplay();

    } catch (e) {
        currentExpression = "Error";
        resultCalculated = true;
        updateDisplay();
        console.error("Calculation error:", e);
        prevDisplay.textContent = '';
    }
}

function handleActionButton(text) {
    if (text === 'AC') { 
        clearDisplay(); 
    } else if (text === '+/-') {
        if (currentExpression !== '' && !isNaN(parseFloat(currentExpression))) {
            if (currentExpression.startsWith('-')) {
                currentExpression = currentExpression.substring(1);
            } else {
                currentExpression = '-' + currentExpression;
            }
            updateDisplay();
        }
    } else if (text === '%') {
        if (currentExpression !== '' && !isNaN(parseFloat(currentExpression))) {
            try {
                const num = parseFloat(currentExpression);
                currentExpression = (num / 100).toString();
                updateDisplay();
            } catch (e) {
                currentExpression = "Error";
                updateDisplay();
            }
        }
    }
}

numberButtons.forEach(button => {
    button.addEventListener("click", () => {
        appendToExpression(button.innerText);
    });
});

operationButtons.forEach(button => { 
    const buttonText = button.innerText; 
    button.addEventListener("click", () => { 
        if (['+', '-', '*', '/'].includes(buttonText)) {
            handleOperation(buttonText); 
        } else if (buttonText === 'x²') { 
            appendToExpression('**2'); 
        } else if (buttonText === '√') { 
            appendToExpression('math.sqrt('); 
        } else if (buttonText === '(' || buttonText === ')') { 
            appendToExpression(buttonText); 
        } else if (buttonText === 'AC' || buttonText === '+/-' || buttonText === '%') { 
            handleActionButton(buttonText); 
        }
    });
});

equalsButton.addEventListener("click", () => { 
    calculateResult(); 
});

deleteButton.addEventListener("click", () => { 
    deleteLast(); 
});

window.math = {
    sqrt: Math.sqrt
};