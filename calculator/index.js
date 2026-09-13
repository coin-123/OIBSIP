const buttons = document.querySelectorAll(".btn");
const topScreen = document.querySelector(".topScreen")
const bottomScreen = document.querySelector(".bottomScreen")

// Select the theme button (adjust selector to match your HTML class/id)
const container = document.querySelector(".container")
const themeButton = document.querySelector(".theme-btn");

themeButton.addEventListener("click", () => {
  // Toggles the 'dark-theme' class on the body element
  container.classList.toggle("dark");
});


function calculateExpression(expression) {
  const cleanStr = expression.replace(/\s+/g, '');
  let result = 0;
  let currentNumber = "";
  let previousOperator = "+";

  for (let i = 0; i < cleanStr.length; i++) {
    const char = cleanStr[i];

    if (/[0-9.]/.test(char)) {
      currentNumber += char;
    }

    if (/[+\-*/]/.test(char) || i === cleanStr.length - 1) {
      const num = parseFloat(currentNumber);

      switch (previousOperator) {
        case "+":
          result += num;
          break;
        case "-":
          result -= num;
          break;
        case "*":
          result *= num;
          break;
        case "/":
          result /= num;
          break;
      }

      previousOperator = char;
      currentNumber = "";
    }
  }

  return result;
}

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const textContent = button.textContent;

    if (textContent === "C") {
      topScreen.textContent = "0";
      bottomScreen.textContent = "";
    } else if (textContent === "=") {
      try {
        const result = calculateExpression(topScreen.textContent);
        if (Number.isNaN(result)) {
          bottomScreen.textContent = "Error";
        } else {
          bottomScreen.textContent = result;
        }
      } catch (error) {
        bottomScreen.textContent = "Error";
      }
    } else if (textContent === "DEL" || textContent === "←" || textContent === "⌫") {
      if (topScreen.textContent.trim().length > 1) {
        topScreen.textContent = topScreen.textContent.slice(0, -1);
      } else {
        topScreen.textContent = "0";
      }
    } else {
      // Replaces the initial "0" with the first clicked button using trim, 
      // otherwise appends normally for subsequent clicks
      if (topScreen.textContent.trim() === "0") {
        topScreen.textContent = textContent;
      } else {
        topScreen.textContent += textContent;
      }
    }
  });
});

