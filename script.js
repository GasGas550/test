// Ждем, пока вся HTML-страница полностью загрузится
document.addEventListener('DOMContentLoaded', function() {

    // Находим нашу форму и элемент для вывода статуса по их ID
    const form = document.getElementById('order-form');
    const status = document.getElementById('status');

    // Добавляем "слушателя" на событие отправки формы
    form.addEventListener("submit", async function(event) {
        // 1. Предотвращаем стандартное поведение формы (перезагрузку страницы)
        event.preventDefault();

        // 2. Собираем данные из всех полей формы
        const data = new FormData(form);

        // 3. Показываем сообщение о том, что заявка отправляется
        status.textContent = 'Отправка...';
        status.style.color = '#2c3e50'; // Темно-серый цвет

        try {
            // 4. Отправляем данные на сервер Formspree асинхронно
            const response = await fetch(form.action, {
                method: form.method,
                body: data,
                headers: {
                    'Accept': 'application/json'
                }
            });

            // 5. Проверяем ответ от сервера
            if (response.ok) {
                // Если все хорошо, показываем сообщение об успехе
                status.textContent = "Спасибо за вашу заявку! Мы скоро с вами свяжемся.";
                status.style.color = 'green'; // Зеленый цвет для успеха
                form.reset(); // Очищаем поля формы
            } else {
                // Если сервер вернул ошибку, пробуем получить текст ошибки
                const errorData = await response.json();
                if (Object.hasOwn(errorData, 'errors')) {
                    const errorMessage = errorData["errors"].map(error => error["message"]).join(", ");
                    throw new Error(errorMessage);
                } else {
                    throw new Error('Что-то пошло не так при отправке формы.');
                }
            }
        } catch (error) {
            // 6. Если произошла сетевая ошибка, показываем ее
            status.textContent = "Ошибка! " + error.message;
            status.style.color = 'red'; // Красный цвет для ошибки
        }
    });
});