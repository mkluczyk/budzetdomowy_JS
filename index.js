"use strict";
import { v4 as uuidv4 } from "https://jspm.dev/uuid";

document.addEventListener("DOMContentLoaded", () => {
  const incomes = [];
  const spendings = [];

  const budgetSummary = document.querySelector("#sum-up");
  const incomeName = document.querySelector("#income-name");
  const incomeValue = document.querySelector("#income-value");
  const incomeBtn = document.querySelector("#income-btn");
  const incomeList = document.querySelector("#income-list");
  const totalIncomeValue = document.querySelector("#total-income-value");
  const spendingName = document.querySelector("#spending-name");
  const spendingValue = document.querySelector("#spending-value");
  const spendingBtn = document.querySelector("#spending-btn");
  const spendingList = document.querySelector("#spendings-list");
  const totalSpendingValue = document.querySelector("#total-spendings-value");

  const createItem = (name, value, id, type) => {
    const li = document.createElement("li");
    li.classList.add("li");

    const itemName = document.createElement("span");
    itemName.textContent = name;
    itemName.classList.add("li-name");

    const itemValue = document.createElement("input");
    itemValue.value = value.toFixed(2);
    itemValue.classList.add("li-value");

    const validateInput = () => {
      const value = parseFloat(itemValue.value);
      if (isNaN(value) || value <= 0) {
        return alert("Proszę podać wartość liczbową większą od zera.");
      } else {
        return (itemValue.value = value.toFixed(2));
      }
    };
    itemValue.addEventListener("change", validateInput);

    const buttons = document.createElement("div");
    buttons.classList.add("buttons");

    const properArray = type === "spending" ? spendings : incomes;

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edytuj";
    editBtn.classList.add("list-btn");
    editBtn.addEventListener("click", () => {
      editBtn.replaceWith(saveBtn);
      itemName.setAttribute("contenteditable", true);
      itemName.classList.add("saveBtn-on");
      itemValue.removeAttribute("disabled");
      itemValue.classList.add("saveBtn-on");
    });

    const saveBtn = document.createElement("button");
    saveBtn.textContent = "Zapisz";
    saveBtn.classList.add("list-btn");
    saveBtn.addEventListener("click", () => {
      saveBtn.replaceWith(editBtn);
      itemName.setAttribute("contenteditable", false);
      itemName.classList.add("editBtn-on");
      itemValue.setAttribute("disabled", true);
      itemValue.classList.add("editBtn-on");

      const itemToEdit = properArray.find((item) => item.id === id);

      if (!itemName.textContent || parseFloat(itemValue.value) <= 0) {
        alert("Podaj poprawne wartości");
        itemName.textContent = itemToEdit.name;
        itemValue.value = itemToEdit.value;
        return;
      }

      itemToEdit.name = itemName.textContent;
      itemToEdit.value = parseFloat(itemValue.value);
      updateTotalValues();
    });

    updateTotalValues();

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Usuń";
    deleteBtn.classList.add("list-btn");
    deleteBtn.addEventListener("click", () => {
      li.remove();
      const indexOfItemToRemove = properArray.findIndex(
        (item) => item.id === id
      );
      properArray.splice(indexOfItemToRemove, 1);

      updateTotalValues();
    });

    li.appendChild(itemName);
    li.appendChild(itemValue);
    li.appendChild(buttons);
    buttons.appendChild(editBtn);
    buttons.appendChild(deleteBtn);

    return li;
  };

  const addIncome = () => {
    const name = incomeName.value;
    const value = parseFloat(incomeValue.value);

    if (name && value > 0) {
      const newIncome = {
        name: name,
        value: value,
        id: uuidv4(),
      };

      const incomeLi = createItem(
        newIncome.name,
        newIncome.value,
        newIncome.id,
        "income"
      );
      incomeList.appendChild(incomeLi);

      incomes.push(newIncome);
    } else {
      alert("Podaj poprawne wartości");
      return;
    }

    incomeName.value = "";
    incomeValue.value = "";
    updateTotalValues();
  };

  const addSpending = () => {
    const name = spendingName.value;
    const value = parseFloat(spendingValue.value);

    if (name && value > 0) {
      const newSpending = {
        name: name,
        value: value,
        id: uuidv4(),
      };

      const spendingLi = createItem(
        newSpending.name,
        newSpending.value,
        newSpending.id,
        "spending"
      );
      spendingList.appendChild(spendingLi);

      spendings.push(newSpending);
    } else {
      alert("Podaj poprawne wartości");
      return;
    }

    spendingName.value = "";
    spendingValue.value = "";
    updateTotalValues();
  };

  incomeBtn.addEventListener("click", addIncome);
  spendingBtn.addEventListener("click", addSpending);

  const updateTotalValues = () => {
    const calculateTotalIncomes = () => {
      return incomes.reduce((acc, income) => {
        return acc + income.value;
      }, 0);
    };

    const calculateTotalSpendings = () => {
      return spendings.reduce((acc, spending) => {
        return acc + spending.value;
      }, 0);
    };

    const totalIncomes = calculateTotalIncomes();
    const totalSpendings = calculateTotalSpendings();

    const remainingBudget = totalIncomes - totalSpendings;
    if (remainingBudget > 0) {
      budgetSummary.innerHTML = `Możesz jeszcze wydać <br> ${remainingBudget.toFixed(
        2
      )} PLN`;
    } else if (remainingBudget < 0) {
      budgetSummary.innerHTML = `Przekroczyłeś/aś limit wydatków o <br> ${Math.abs(
        remainingBudget.toFixed(2)
      )} PLN`;
    } else {
      budgetSummary.innerHTML = `Nie masz oszczędności do wydania`;
    }

    budgetSummary.classList.add("budget-summary");

    const updateIncomesSum = (totalIncomes) => {
      totalIncomeValue.textContent = `${totalIncomes.toFixed(2)} PLN`;
    };

    const updateSpendingsSum = (totalSpendings) => {
      totalSpendingValue.textContent = `${totalSpendings.toFixed(2)} PLN`;
    };

    updateIncomesSum(totalIncomes);
    updateSpendingsSum(totalSpendings);
  };
});
