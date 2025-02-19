// example pseudocode for a simple test to check task addition
test('adds a task', () => {
    document.body.innerHTML = '<input id="task" value="new task">' +
                              '<input id="description" value="new description">' +
                              '<button onclick="addTask()">Add Task</button>';

    require('./script.js');  // assuming your main js file is script.js
    addTask('Test Task', 'Test Description');
    expect(document.querySelector('#taskTable tbody').textContent).toContain('Test Task');
});