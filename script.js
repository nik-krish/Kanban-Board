const taskForm = document.getElementById("taskform");
const statusList = {
  todoColumn: "TODO",
  inprogressColumn: "IN-PROGRESS",
  doneColumn: "DONE",
};
const taskList = {};
let containerHtml = "";
let statusOptions = "";
Object.entries(statusList).forEach(([key, statusText]) => {
  statusOptions += `<option value="${key}">${statusText}</option>`;
  containerHtml += `<div 
                        class="col" 
                        id="${key}"
                        ondrop="drop(event)" 
                        ondragover="allowdrop(event)"
                      ><h4 align="center">${statusText}</h4></div>`;
});
document.getElementById("taskstatus").innerHTML = statusOptions;
document.getElementById("edittaskstatus").innerHTML = statusOptions;
document.getElementById("statusContainer").innerHTML = containerHtml;

document.getElementById("addtaskbtn").addEventListener("click", function () {
  document.getElementById("taskformpopup").style.display = "block";
});
document.getElementById("closepopupbtn").addEventListener("click", function () {
  document.getElementById("taskformpopup").style.display = "none";
});
taskForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const title = document.getElementById("tasktitle").value;
  const description = document.getElementById("taskdesc").value;
  const date = document.getElementById("taskdate").value;
  const status = document.getElementById("taskstatus").value;
  const validationErrors = [];

  if (!title) validationErrors.push("<span class='error-field'>Title</span>");
  if (!description)
    validationErrors.push("<span class='error-field'>Description</span>");
  if (!date) validationErrors.push("<span class='error-field'>Due Date</span>");
  if (!status) validationErrors.push("<span class='error-field'>Status</span>");

  if (validationErrors.length > 0) {
    document.getElementById(
      "validationmessage"
    ).innerHTML = `Please fill the following fields:<br> ${validationErrors.join(
      "<br>"
    )}`;
    document.getElementById("validationpopup").style.display = "block";
    return;
  }

  const taskId = "task" + Date.now();
  const taskElement = document.createElement("p");
  taskList[taskId] = { title, description, date, status, taskId, taskElement };
  taskElement.className = "task";
  taskElement.id = taskId;
  taskElement.draggable = true;
  taskElement.ondragstart = drag;
  taskElement.innerHTML = `${title}<br>${date}<br>${description}
        <button class="remove-task-btn">X</button>`;
  const columnId = status + "Column";
  document.getElementById(status).appendChild(taskElement);
  taskForm.reset();
  document.getElementById("taskformpopup").style.display = "none";
  taskElement.addEventListener("click", function () {
    showTaskDetails(taskId);
  });
  taskElement.addEventListener("dblclick", function () {
    document.getElementById("taskdetailspopup").style.display = "none";
    showEditPopup(taskId, title, description, date, status);
  });

  taskElement
    .querySelector(".remove-task-btn")
    .addEventListener("click", function (e) {
      e.stopPropagation();
      taskElement.remove();
      delete taskList[taskId];
    });
});

document
  .getElementById("edittaskform")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    const taskId = document.getElementById("edittaskid").value;
    const title = document.getElementById("edittasktitle").value;
    const description = document.getElementById("edittaskdesc").value;
    const date = document.getElementById("edittaskdate").value;
    const status = document.getElementById("edittaskstatus").value;

    const taskElement = document.getElementById(taskId);
    taskElement.innerHTML = `${title}<br>${date}<br>${description}
        <button class="remove-task-btn">X</button>`;

    document.getElementById(status).appendChild(taskElement);

    taskElement.addEventListener("click", function () {
      showTaskDetails(title, description, date, statusList[status]);
    });

    taskElement.addEventListener("dblclick", function () {
      showEditPopup(taskId, title, description, date, status);
    });

    taskElement
      .querySelector(".remove-task-btn")
      .addEventListener("click", function (e) {
        e.stopPropagation();

        taskElement.remove();
        delete task[taskId];
      });
    taskList[taskId] = {
      title,
      description,
      date,
      status,
      taskId,
      taskElement,
    };
    document.getElementById("edittaskpopup").style.display = "none";
  });

document
  .getElementById("closedetailspopupbtn")
  .addEventListener("click", function () {
    document.getElementById("taskdetailspopup").style.display = "none";
  });

document
  .getElementById("closeeditpopupbtn")
  .addEventListener("click", function () {
    document.getElementById("edittaskpopup").style.display = "none";
  });
document
  .getElementById("closevalidationpopupbtn")
  .addEventListener("click", () => {
    document.getElementById("validationpopup").style.display = "none";
  });

function showTaskDetails(taskId) {
  const task = taskList[taskId];
  document.getElementById(
    "taskdetailstitle"
  ).innerText = `Title: ${task.title}`;
  document.getElementById(
    "taskdetailsdesc"
  ).innerText = `Description: ${task.description}`;
  document.getElementById(
    "taskdetailsdate"
  ).innerText = `Due Date: ${task.date}`;
  document.getElementById("taskdetailsstatus").innerHTML = `Status: ${
    statusList[task.status]
  }`;
  document.getElementById("taskdetailspopup").style.display = "block";
}

function showEditPopup(taskId, title, description, date, status) {
  document.getElementById("edittaskid").value = taskId;
  document.getElementById("edittasktitle").value = title;
  document.getElementById("edittaskdesc").value = description;
  document.getElementById("edittaskdate").value = date;
  document.getElementById("edittaskstatus").value = status;
  document.getElementById("edittaskpopup").style.display = "block";
}

function drop(e) {
  e.preventDefault();
  const taskId = e.dataTransfer.getData("text");
  const taskElement = document.getElementById(taskId);
  const targetColumn = e.target.closest(".col");

  if (!targetColumn || !taskElement) return;

  const newStatus = targetColumn.id;
  targetColumn.appendChild(taskElement);
  taskList[taskId].status = newStatus;
  showTaskDetails(taskId);
}

function allowdrop(e) {
  debugger;
  e.preventDefault();
}

function drag(e) {
  e.dataTransfer.setData("text", e.target.id);
}
