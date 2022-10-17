(function() {
    // создаем и возвращаем заголовок приложения
    function createAppTitle(title) {
        let appTitle = document.createElement('h2');
        appTitle.innerHTML = title;
        return appTitle;
    };

    // создаем и возвращаем форму для создания дела
    function createTodoItemForm() {
        let form = document.createElement('form');
        let input = document.createElement('input');
        let buttonWrapper = document.createElement('div');
        let button = document.createElement('button');

        form.classList.add('input-group', 'mb-3');
        input.classList.add('form-control');
        input.placeholder = 'Введите название нового дела';
        buttonWrapper.classList.add('input-group-append');
        button.classList.add('btn', 'btn-primary');
        button.textContent = 'Добавить дело';

        buttonWrapper.append(button);
        form.append(input);
        form.append(buttonWrapper);

        button.setAttribute('disabled', true);

        function disabledBtn() {
            if (input.value !== "") {
                button.removeAttribute('disabled');
            } else {
                button.setAttribute('disabled', true);
            }
        };

        input.addEventListener('input', disabledBtn);

        return {
            form,
            input,
            button,
        };
    };


    // создаем и возвращаем список элементов
    function createTodoList(itemsExist, title) {
        let list = document.createElement('ul');
        list.classList.add('list-group');

        if (itemsExist.length > 0) {
            for (i of itemsExist) {
                let todoItemExist = createTodoItem(i.nameTodo, i.done, title);  

                list.append(todoItemExist.item);
            };
        }; 
        
        return list;
    };


    function createTodoItem(nameTodo, done, title) {
        let item = document.createElement('li');
        let itemText = document.createElement('div');
        let buttonGroup = document.createElement('div');
        let doneButton = document.createElement('button');
        let deleteButton = document.createElement('button');
    
        item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        itemText.textContent = nameTodo;
        if (done) {
            item.classList.add('list-group-item-success');  
        };
    
        buttonGroup.classList.add('btn-group', 'btn-group-sm');
        doneButton.classList.add('btn', 'btn-success');
        doneButton.textContent = 'Готово';
        deleteButton.classList.add('btn', 'btn-danger');
        deleteButton.textContent = 'Удалить';

        doneButton.addEventListener('click', function() {
           let done = item.classList.toggle('list-group-item-success');
            updateTodoItem (title, itemText.textContent, done);
        });

        deleteButton.addEventListener('click', function() {
            if(confirm('Вы уверены?')) {
                deleteTodoItem (title, itemText.textContent); 
                item.remove();
            };   
        });

        item.append(itemText);
        buttonGroup.append(doneButton);
        buttonGroup.append(deleteButton);
        item.append(buttonGroup);
        
        return {
            item,
            doneButton,
            deleteButton,
        };
    };

    
    function updateTodoItem (title, updatedItem, done) {
        
        let savedArray = JSON.parse(localStorage.getItem(title));  

        let ObjectTodo = {};

        for (let i=0; i<savedArray.length; i++) {
            if (savedArray[i].nameTodo === updatedItem) {
                ObjectTodo.nameTodo = savedArray[i].nameTodo;
                ObjectTodo.done = done;
                savedArray.splice(i, 1, ObjectTodo);
            };
        };
        
        localStorage.setItem(title, JSON.stringify(savedArray)); 
    };
    
    
    function deleteTodoItem (title, deleteItem) {
        let savedArray = JSON.parse(localStorage.getItem(title));  
        for (let i=0; i<savedArray.length; i++) {
            if (savedArray[i].nameTodo === deleteItem) {
                savedArray.splice(i, 1);
            };
        };
        localStorage.setItem(title, JSON.stringify(savedArray)); 
    };


    function createTodoApp(container, title, inArray) {
        let todoAppTitle = createAppTitle(title);
        let todoItemForm = createTodoItemForm();
        let itemsArray;

        let savedTodo = JSON.parse(localStorage.getItem(title));
        if (savedTodo === null) {
            itemsArray = inArray;
        } else {
            itemsArray = inArray.concat(savedTodo);
        };
        
        let todoList = createTodoList(itemsArray, title);

        container.append(todoAppTitle);
        container.append(todoItemForm.form);
        container.append(todoList);

        todoItemForm.form.addEventListener('submit', function(e) {
            e.preventDefault();

            if (!todoItemForm.input.value) {
                return;
            };

            let ObjectTodo = {};
            ObjectTodo.nameTodo = todoItemForm.input.value;
            ObjectTodo.done = false;
            
            let todoItem = createTodoItem(ObjectTodo.nameTodo, ObjectTodo.done, title);
            todoList.append(todoItem.item);

            itemsArray.push(ObjectTodo);
             
            let arrayToString = JSON.stringify(itemsArray);
            localStorage.setItem(title, arrayToString);

            introArray = JSON.parse(localStorage.getItem(title));

            todoItemForm.input.value = '';
            todoItemForm.button.setAttribute('disabled', true);
        });
    };

    window.createTodoApp = createTodoApp;

})();
