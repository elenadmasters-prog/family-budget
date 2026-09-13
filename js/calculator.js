/* ============================================================
       КАЛЬКУЛЯТОР СЕМЕЙНОГО БЮДЖЕТА
       JavaScript
       ============================================================ */


    /* ============================================================
       1. СТАРТОВЫЕ ДАННЫЕ
       ============================================================

       Эти массивы используются при первом открытии страницы.

       Вы можете изменить названия категорий прямо здесь.
    */

    const defaultIncomes = [
        {
            name: "Зарплата 1",
            amount: ""
        },
        {
            name: "Зарплата 2",
            amount: ""
        },
        {
            name: "Дополнительный доход",
            amount: ""
        }
    ];


    const defaultExpenses = [
        {
            name: "Жильё / ипотека / аренда",
            amount: ""
        },
        {
            name: "Коммунальные услуги",
            amount: ""
        },
        {
            name: "Продукты",
            amount: ""
        },
        {
            name: "Транспорт",
            amount: ""
        },
        {
            name: "Дети / образование",
            amount: ""
        },
        {
            name: "Связь и интернет",
            amount: ""
        },
        {
            name: "Здоровье",
            amount: ""
        },
        {
            name: "Развлечения",
            amount: ""
        }
    ];


    /* ============================================================
       2. СОЗДАНИЕ СТРОКИ
       ============================================================

       Функция создаёт HTML-блок:

       [Название категории] [Сумма] [Удалить]

       type может быть:
       income  — доход
       expense — расход
    */

    function createRow(type, name = "", amount = "") {

        const row = document.createElement("div");

        row.className = "budget-row";

        /*
            Безопасно вставляем значения через value,
            а не через innerHTML.
        */

        const nameInput = document.createElement("input");

        nameInput.type = "text";
        nameInput.className = "category-name";
        nameInput.placeholder =
            type === "income"
                ? "Источник дохода"
                : "Категория расхода";

        nameInput.value = name;


        const amountInput = document.createElement("input");

        amountInput.type = "number";
        amountInput.className = "category-amount";
        amountInput.placeholder = "₽";
        amountInput.min = "0";
        amountInput.step = "100";

        amountInput.value = amount;


        /*
            При любом изменении суммы
            пересчитываем бюджет.
        */

        amountInput.addEventListener(
            "input",
            calculateBudget
        );


        /*
            Кнопка удаления строки.
        */

        const deleteButton = document.createElement("button");

        deleteButton.type = "button";
        deleteButton.className = "delete-button";
        deleteButton.title = "Удалить";

        deleteButton.innerHTML = "×";


        deleteButton.addEventListener(
            "click",
            function () {

                row.remove();

                calculateBudget();
            }
        );


        row.appendChild(nameInput);
        row.appendChild(amountInput);
        row.appendChild(deleteButton);

        return row;
    }


    /* ============================================================
       3. ДОБАВЛЕНИЕ ДОХОДА
       ============================================================ */

    function addIncomeRow(
        name = "",
        amount = ""
    ) {

        const list =
            document.getElementById("incomeList");

        list.appendChild(
            createRow(
                "income",
                name,
                amount
            )
        );

        calculateBudget();
    }


    /* ============================================================
       4. ДОБАВЛЕНИЕ РАСХОДА
       ============================================================ */

    function addExpenseRow(
        name = "",
        amount = ""
    ) {

        const list =
            document.getElementById("expenseList");

        list.appendChild(
            createRow(
                "expense",
                name,
                amount
            )
        );

        calculateBudget();
    }


    /* ============================================================
       5. ФОРМАТИРОВАНИЕ ДЕНЕГ
       ============================================================

       Пример:

       125000

       превращается в:

       125 000 ₽
    */

    function formatMoney(value) {

        return new Intl.NumberFormat(
            "ru-RU",
            {
                maximumFractionDigits: 0
            }
        ).format(value) + " ₽";
    }


    /* ============================================================
       6. ПОЛУЧЕНИЕ СУММЫ ИЗ СПИСКА
       ============================================================ */

    function getTotal(listId) {

        const list =
            document.getElementById(listId);

        const amountInputs =
            list.querySelectorAll(
                ".category-amount"
            );

        let total = 0;


        amountInputs.forEach(
            function (input) {

                const value =
                    parseFloat(input.value);

                /*
                    Если поле пустое
                    или введено не число,
                    оно считается равным нулю.
                */

                if (!isNaN(value) && value > 0) {
                    total += value;
                }
            }
        );


        return total;
    }


    /* ============================================================
       7. ГЛАВНЫЙ РАСЧЁТ
       ============================================================ */

    function calculateBudget() {

        /*
            Получаем доходы и расходы.
        */

        const income =
            getTotal("incomeList");

        const expenses =
            getTotal("expenseList");

        /*
            Остаток бюджета.
        */

        const balance =
            income - expenses;


        /*
            Процент расходов.
        */

        let expensePercent = 0;

        if (income > 0) {
            expensePercent =
                (expenses / income) * 100;
        }


        /*
            Процент потенциальных накоплений.
        */

        let savingPercent = 0;

        if (
            income > 0 &&
            balance > 0
        ) {

            savingPercent =
                (balance / income) * 100;
        }


        /* ---------------------------------------------------------
           Обновляем карточки
           --------------------------------------------------------- */

        document.getElementById(
            "totalIncome"
        ).textContent =
            formatMoney(income);


        document.getElementById(
            "totalExpenses"
        ).textContent =
            formatMoney(expenses);


        document.getElementById(
            "balance"
        ).textContent =
            formatMoney(balance);


        document.getElementById(
            "savingPercent"
        ).textContent =
            savingPercent.toFixed(1) + "%";


        /*
            Цвет остатка.

            Зелёный — деньги остаются.
            Красный — расходы выше дохода.
        */

        const balanceElement =
            document.getElementById(
                "balance"
            );


        if (balance >= 0) {

            balanceElement.style.color =
                "#1e9e63";

        } else {

            balanceElement.style.color =
                "#e25555";
        }


        /* ---------------------------------------------------------
           Полоса расходов
           --------------------------------------------------------- */

        document.getElementById(
            "expensePercentText"
        ).textContent =
            expensePercent.toFixed(1) + "%";


        /*
            Максимальная ширина полосы — 100%.

            Даже если расходы составляют 130% дохода,
            полоса физически не выйдет за контейнер.
        */

        const progressWidth =
            Math.min(
                expensePercent,
                100
            );


        document.getElementById(
            "expenseProgress"
        ).style.width =
            progressWidth + "%";


        /* ---------------------------------------------------------
           Аналитическое сообщение
           --------------------------------------------------------- */

        updateBudgetMessage(
            income,
            expenses,
            balance,
            savingPercent
        );


        /* ---------------------------------------------------------
           Расчёт цели накоплений
           --------------------------------------------------------- */

        calculateGoal(balance);
    }


    /* ============================================================
       8. АНАЛИЗ СОСТОЯНИЯ БЮДЖЕТА
       ============================================================ */

    function updateBudgetMessage(
        income,
        expenses,
        balance,
        savingPercent
    ) {

        const message =
            document.getElementById(
                "budgetMessage"
            );


        /*
            Сначала удаляем предыдущие классы.
        */

        message.className =
            "budget-message";


        /*
            Доход ещё не введён.
        */

        if (income === 0) {

            message.textContent =
                "Добавьте доходы семьи, чтобы калькулятор смог оценить состояние бюджета.";

            return;
        }


        /*
            Расходы выше доходов.
        */

        if (balance < 0) {

            message.classList.add(
                "danger"
            );

            message.innerHTML =
                "Расходы превышают доходы на <strong>" +
                formatMoney(
                    Math.abs(balance)
                ) +
                "</strong>. " +
                "Стоит пересмотреть наиболее крупные категории расходов.";

            return;
        }


        /*
            Сбережения менее 10%.
        */

        if (savingPercent < 10) {

            message.classList.add(
                "warning"
            );

            message.innerHTML =
                "Бюджет остаётся положительным, но свободными остаются только <strong>" +
                savingPercent.toFixed(1) +
                "%</strong> доходов. " +
                "Даже небольшое сокращение необязательных расходов поможет увеличить финансовый резерв.";

            return;
        }


        /*
            Сбережения 10–20%.
        */

        if (savingPercent < 20) {

            message.classList.add(
                "good"
            );

            message.innerHTML =
                "Хороший результат: после расходов остаётся <strong>" +
                formatMoney(balance) +
                "</strong>, или <strong>" +
                savingPercent.toFixed(1) +
                "%</strong> семейного дохода.";

            return;
        }


        /*
            Сбережения 20% и выше.
        */

        message.classList.add(
            "good"
        );

        message.innerHTML =
            "Отличный запас бюджета. После текущих расходов остаётся <strong>" +
            formatMoney(balance) +
            "</strong>, что составляет <strong>" +
            savingPercent.toFixed(1) +
            "%</strong> дохода.";
    }


    /* ============================================================
       9. РАСЧЁТ ЦЕЛИ НАКОПЛЕНИЙ
       ============================================================ */

    function calculateGoal(
        monthlyBalance
    ) {

        const goal =
            parseFloat(
                document.getElementById(
                    "goalAmount"
                ).value
            ) || 0;


        const current =
            parseFloat(
                document.getElementById(
                    "currentSavings"
                ).value
            ) || 0;


        const result =
            document.getElementById(
                "goalResult"
            );


        /*
            Цель ещё не задана.
        */

        if (goal <= 0) {

            result.textContent =
                "Укажите сумму цели, чтобы рассчитать срок накопления.";

            return;
        }


        /*
            Цель уже достигнута.
        */

        if (current >= goal) {

            result.innerHTML =
                "<strong>Поздравляем!</strong> Цель накоплений уже достигнута.";

            return;
        }


        /*
            Нет положительного остатка бюджета.
        */

        if (monthlyBalance <= 0) {

            result.innerHTML =
                "Сейчас свободного остатка бюджета недостаточно для автоматического накопления на эту цель.";

            return;
        }


        /*
            Сколько ещё нужно накопить.
        */

        const remaining =
            goal - current;


        /*
            Делим необходимую сумму
            на ежемесячный остаток.

            Math.ceil округляет вверх.
        */

        const months =
            Math.ceil(
                remaining /
                monthlyBalance
            );


        result.innerHTML =
            "До цели осталось <strong>" +
            formatMoney(remaining) +
            "</strong>. " +
            "Если ежемесячно откладывать весь текущий свободный остаток " +
            "<strong>" +
            formatMoney(monthlyBalance) +
            "</strong>, цель можно достичь примерно за <strong>" +
            months +
            " мес.</strong>";
    }


    /* ============================================================
       10. ПОЛУЧЕНИЕ ДАННЫХ ИЗ СПИСКА
       ============================================================ */

    function getListData(
        listId
    ) {

        const rows =
            document.querySelectorAll(
                "#" + listId + " .budget-row"
            );


        const data = [];


        rows.forEach(
            function (row) {

                const name =
                    row.querySelector(
                        ".category-name"
                    ).value;


                const amount =
                    row.querySelector(
                        ".category-amount"
                    ).value;


                data.push({
                    name: name,
                    amount: amount
                });
            }
        );


        return data;
    }


    /* ============================================================
       11. СОХРАНЕНИЕ ДАННЫХ
       ============================================================

       Используется LocalStorage.

       Это встроенная возможность браузера.
       Данные остаются на устройстве пользователя.
    */

    function saveBudget() {

        const budgetData = {

            incomes:
                getListData(
                    "incomeList"
                ),

            expenses:
                getListData(
                    "expenseList"
                ),

            goal:
                document.getElementById(
                    "goalAmount"
                ).value,

            currentSavings:
                document.getElementById(
                    "currentSavings"
                ).value
        };


        localStorage.setItem(
            "familyBudgetData",
            JSON.stringify(
                budgetData
            )
        );


        alert(
            "Бюджет сохранён в браузере."
        );
    }


    /* ============================================================
       12. ЗАГРУЗКА СОХРАНЁННЫХ ДАННЫХ
       ============================================================ */

    function loadBudget() {

        const saved =
            localStorage.getItem(
                "familyBudgetData"
            );


        /*
            Если сохранённых данных нет,
            показываем стандартные категории.
        */

        if (!saved) {

            loadDefaultRows();

            return;
        }


        try {

            const data =
                JSON.parse(saved);


            /*
                Очищаем текущие списки.
            */

            document.getElementById(
                "incomeList"
            ).innerHTML = "";


            document.getElementById(
                "expenseList"
            ).innerHTML = "";


            /*
                Восстанавливаем доходы.
            */

            if (
                data.incomes &&
                data.incomes.length > 0
            ) {

                data.incomes.forEach(
                    function (item) {

                        addIncomeRow(
                            item.name,
                            item.amount
                        );
                    }
                );

            } else {

                defaultIncomes.forEach(
                    function (item) {

                        addIncomeRow(
                            item.name,
                            item.amount
                        );
                    }
                );
            }


            /*
                Восстанавливаем расходы.
            */

            if (
                data.expenses &&
                data.expenses.length > 0
            ) {

                data.expenses.forEach(
                    function (item) {

                        addExpenseRow(
                            item.name,
                            item.amount
                        );
                    }
                );

            } else {

                defaultExpenses.forEach(
                    function (item) {

                        addExpenseRow(
                            item.name,
                            item.amount
                        );
                    }
                );
            }


            /*
                Восстанавливаем цель.
            */

            document.getElementById(
                "goalAmount"
            ).value =
                data.goal || "";


            document.getElementById(
                "currentSavings"
            ).value =
                data.currentSavings || "";


            calculateBudget();

        } catch (error) {

            /*
                Если сохранённые данные повреждены,
                запускаем стандартную конфигурацию.
            */

            console.error(
                "Ошибка загрузки бюджета:",
                error
            );

            loadDefaultRows();
        }
    }


    /* ============================================================
       13. СТАНДАРТНЫЕ КАТЕГОРИИ
       ============================================================ */

    function loadDefaultRows() {

        document.getElementById(
            "incomeList"
        ).innerHTML = "";


        document.getElementById(
            "expenseList"
        ).innerHTML = "";


        defaultIncomes.forEach(
            function (item) {

                addIncomeRow(
                    item.name,
                    item.amount
                );
            }
        );


        defaultExpenses.forEach(
            function (item) {

                addExpenseRow(
                    item.name,
                    item.amount
                );
            }
        );


        calculateBudget();
    }


    /* ============================================================
       14. ПОЛНАЯ ОЧИСТКА
       ============================================================ */

    function clearBudget() {

        const confirmed =
            confirm(
                "Удалить все введённые данные и вернуть стандартные категории?"
            );


        if (!confirmed) {
            return;
        }


        /*
            Удаляем сохранённую запись.
        */

        localStorage.removeItem(
            "familyBudgetData"
        );


        /*
            Очищаем цель.
        */

        document.getElementById(
            "goalAmount"
        ).value = "";


        document.getElementById(
            "currentSavings"
        ).value = "";


        /*
            Возвращаем стандартные поля.
        */

        loadDefaultRows();
    }


    /* ============================================================
       15. ПЕРЕКЛЮЧЕНИЕ СВЕТЛОЙ И ТЁМНОЙ ТЕМЫ
       ============================================================

       Тема хранится в LocalStorage под ключом familyBudgetTheme.
       Значения: "light" или "dark".
    */

    function isDarkTheme() {

        return document.documentElement.classList.contains(
            "dark-theme"
        );
    }


    function updateThemeButton() {

        const icon =
            document.getElementById(
                "themeToggleIcon"
            );

        const button =
            document.getElementById(
                "themeToggle"
            );

        if (!icon || !button) {
            return;
        }

        if (isDarkTheme()) {

            icon.textContent = "☀️";
            button.title = "Включить светлую тему";
            button.setAttribute(
                "aria-label",
                "Включить светлую тему"
            );

        } else {

            icon.textContent = "🌙";
            button.title = "Включить тёмную тему";
            button.setAttribute(
                "aria-label",
                "Включить тёмную тему"
            );
        }
    }


    function applyTheme(theme) {

        if (theme === "dark") {

            document.documentElement.classList.add(
                "dark-theme"
            );

        } else {

            document.documentElement.classList.remove(
                "dark-theme"
            );
        }

        localStorage.setItem(
            "familyBudgetTheme",
            theme
        );

        updateThemeButton();
    }


    function toggleTheme() {

        if (isDarkTheme()) {

            applyTheme("light");

        } else {

            applyTheme("dark");
        }
    }


    /* ============================================================
       16. ЗАПУСК ПРИ ЗАГРУЗКЕ СТРАНИЦЫ
       ============================================================ */

    document.addEventListener(
        "DOMContentLoaded",
        function () {

            loadBudget();

            const themeButton =
                document.getElementById(
                    "themeToggle"
                );

            if (themeButton) {

                themeButton.addEventListener(
                    "click",
                    toggleTheme
                );
            }

            updateThemeButton();
        }
    );
