let tasks = JSON.parse(localStorage.getItem('taskflow_tasks')) || [];
const lists = document.querySelectorAll('.task-list');
const modal = document.getElementById('modal');
const searchInput = document.getElementById('search-input');
const taskForm = document.getElementById('task-form');


function renderTasks(filter = '') {
    lists.forEach(l => l.innerHTML = '');

    const filtered = tasks.filter(t => 
        t.title.toLowerCase().includes(filter.toLowerCase()) ||
        t.desc.toLowerCase().includes(filter.toLowerCase())
    );

    filtered.forEach(task => {
        const card = document.createElement('div');
        card.className = 'task-card';
        card.draggable = true;
        card.dataset.id = task.id;

        
        const title = document.createElement('h4');
        title.textContent = task.title;

        const desc = document.createElement('p');
        desc.textContent = task.desc;

       const footer = document.createElement('div');
footer.className = 'task-footer';


const delBtn = document.createElement('button');
delBtn.className = 'btn-del';
delBtn.innerHTML = '<i class="bi bi-trash"></i>';
delBtn.ariaLabel = "Excluir tarefa"; 

delBtn.onclick = () => deleteTask(task.id);


footer.appendChild(delBtn);

        card.appendChild(title);
        card.appendChild(desc);
        card.appendChild(footer);

        card.addEventListener('dragstart', () => card.classList.add('dragging'));
        card.addEventListener('dragend', () => card.classList.remove('dragging'));

        const targetList = document.getElementById(`list-${task.status}`);
        if(targetList) targetList.appendChild(card);
    });
}


lists.forEach(list => {
    list.addEventListener('dragover', e => {
        e.preventDefault();
        list.classList.add('drag-over');
    });

    list.addEventListener('dragleave', () => {
        list.classList.remove('drag-over');
    });

    list.addEventListener('drop', e => {
        list.classList.remove('drag-over');
        const dragCard = document.querySelector('.dragging');
        if (!dragCard) return;

        const taskId = Number(dragCard.dataset.id);
        const newStatus = list.id.replace('list-', '');

        tasks = tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t);
        saveAndRender();
    });
});


taskForm.onsubmit = (e) => {
    e.preventDefault();
    const newTask = {
        id: Date.now(),
        title: document.getElementById('task-title').value,
        desc: document.getElementById('task-desc').value,
        status: document.getElementById('task-status').value
    };
    tasks.push(newTask);
    saveAndRender();
    closeModalFunc();
};


function deleteTask(id) {
    if(confirm('Deseja excluir esta tarefa?')) {
        tasks = tasks.filter(t => t.id !== id);
        saveAndRender();
    }
}

function saveAndRender() {
    localStorage.setItem('taskflow_tasks', JSON.stringify(tasks));
    renderTasks(searchInput.value);
}

const closeModalFunc = () => {
    modal.style.display = 'none';
    taskForm.reset();
};

document.getElementById('open-modal').onclick = () => modal.style.display = 'flex';
document.getElementById('close-modal').onclick = closeModalFunc;
searchInput.oninput = (e) => renderTasks(e.target.value);

window.onclick = (e) => { 
    if (e.target === modal) closeModalFunc(); 
};


renderTasks();
