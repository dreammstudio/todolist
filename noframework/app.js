class UI {
    static add = (todo) => {
        document.querySelector(".todos").innerHTML += `
           <article class=${todo.status === true ? 'todo_completed' : 'todo'} style=${todo.status === true ? 'opacity:0.7' : 'opacity:1'}>
           ${todo.status === true ? '<input type="checkbox" class="complete_todo" checked>' : '<input type="checkbox" class="complete_todo">'}
            <button class="delete_todo">X</button>
            <p>${todo.content}</p>
        </article>
        `

    }
    static showMessage = (message,type) => {
        let div = document.createElement("div") // Create notify div
        div.style.display = "block"
        div.className = "notify"
        let title = document.createElement("h3")
        if(type === "danger") {
            title.textContent = "Oops something went wrong!"
            div.style.background = "#db471e"
        }else if(type === "success") {
            title.textContent = "Successfully!"
            div.style.background = "#188977"
        }
        div.appendChild(title)
        let message_element = document.createElement("p")

        message_element.textContent = message
        div.appendChild(message_element)
        document.querySelector(".todo_app").appendChild(div) // Append

        // Delete after 3 seconds
        setTimeout(() => {
            div.remove()
        },3000)
    }
}
class ToDoStorage {
static add = (todo) => {
    let storage = localStorage.getItem("todos")
    let todos = []
    if(storage) {
        todos = JSON.parse(storage)
    }
    todos.push(todo)

    localStorage.setItem("todos",JSON.stringify(todos))
}
static remove = (todo) => {
    let storage = localStorage.getItem("todos")

    if(storage) {
        storage = JSON.parse(storage)
        if(storage.find(object => object.content.toLowerCase().trim() === todo.content.toLowerCase().trim())) {
            storage = storage.filter(object => object.content.toLowerCase().trim() !== todo.content.toLowerCase().trim())
            localStorage.setItem("todos",JSON.stringify(storage))
        }else {
            UI.showMessage("To-do not found!","danger")
        }
    }else {
        UI.showMessage("To-do not found!","danger")
    }

}
static change = (todo,new_todo) => {
    let storage = localStorage.getItem("todos")

    let todos = []
    if(storage) {
        todos = JSON.parse(storage)
    }
    if(todos.find(object => object.content === todo.content)) {
        todos.find(object => object.content === todo.content).content = new_todo.content
        todos.find(object => object.content === todo.content).status = new_todo.status

        localStorage.setItem("todos",JSON.stringify(todos))
    }else {
        UI.showMessage("To-do not found!","danger")
    }
}
static find = (content) => {
    let storage = localStorage.getItem("todos")

    let todos = []
    if(storage) {
        todos = JSON.parse(storage)
    }
    return !!todos.find(object => object.content.toLowerCase().trim() === content.toLowerCase().trim());
}
}
const todo_storage = localStorage.getItem("todos");
if(todo_storage) {
    JSON.parse(todo_storage).forEach((todo) => {
        UI.add(todo)
    })
}
document.querySelector("#todo_form").addEventListener("submit",(event) => {
    event.preventDefault()
    let value = event.target.todo_input.value;
    if(value.trim().startsWith(" ") || value.trim() === "") return UI.showMessage("Please provide to-do","danger")
    value = value.trim()
    if(ToDoStorage.find(value)) return UI.showMessage("Things to-do already have.","danger")
    let todo = {
        content:value,
        status:false
    }
    UI.add(todo);
    ToDoStorage.add(todo)
    event.target.todo_input.value = ""
    UI.showMessage("Successfully deleted","success")
})
document.querySelector(".todos").addEventListener("click",(event) => {
        if(event.target.className === "complete_todo") {
            if(event.target.checked) {
                event.target.parentElement.className = "todo_completed"
                event.target.parentElement.style.opacity = 0.7;
                let todo = event.target.parentElement.children
                let old_todo = {content:  todo[todo.length-1].textContent,status:false}


                ToDoStorage.change(old_todo,{content:todo[todo.length-1].textContent,status:true})
            }else {
                event.target.parentElement.className = "todo"
                event.target.parentElement.style.opacity = 1;
                let todo = event.target.parentElement.children
                let old_todo = {content:  todo[todo.length-1].textContent,status:true}


                ToDoStorage.change(old_todo,{content:todo[todo.length-1].textContent,status:false})
            }
        }else if(event.target.className === "delete_todo") {
            let todo = event.target.parentElement
            let todo_object = {content:  todo.children[todo.children.length-1].textContent,status:undefined}
            ToDoStorage.remove(todo_object)
           todo.remove()
            UI.showMessage("Successfully deleted","success")
        }
    })

document.querySelector("#filter_todos").addEventListener("change",(event) => {
    if(event.target.value === "ncompleted") {
        document.querySelectorAll(".todo,.todo_completed").forEach(todo => {
            if(!todo.children[0].checked) {
                todo.style.display = "flex"
            }else {
                todo.style.display = "none"
            }
        })
    }else if(event.target.value === "completed") {
        document.querySelectorAll(".todo,.todo_completed").forEach(todo => {
            if(!todo.children[0].checked) {
                todo.style.display = "none"
            }else {
                todo.style.display = "flex"

            }
        })
    }else if(event.target.value === "all") {
        document.querySelectorAll(".todo,.todo_completed").forEach(todo => {
            todo.style.display = "flex"
        })
    }
})
document.querySelector("#search_form").addEventListener("keyup",(event) => {
    let value = event.target.value;
    document.querySelectorAll(".todo,.todo_completed").forEach(todo => {

        let content = todo.children[todo.children.length-1].textContent
        if(!content.toLowerCase().trim().includes(value)) {
            todo.style.display = "none"
        }else {
            todo.style.display = "flex"
        }
    })
})
