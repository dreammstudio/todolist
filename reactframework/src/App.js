import "./App.css";
import React, { useEffect, useState } from "react";
function App() {
  const [todos,setTodos] = useState([]);
  const [shownTodos,setShownTodos] = useState(todos);
  const [message,setMessage] = useState({error:false,message:""});
  useEffect(() => {
    setTodos(JSON.parse(localStorage.getItem("todos",todos) || "[]"))
    setShownTodos(todos)
  },[])
  useEffect(() => {
    localStorage.setItem("todos",JSON.stringify(todos))
      setShownTodos(todos)
  },[todos])
  useEffect(() => {
    setTimeout(() => {
      setMessage({error:false,message:""})
    }, 3000);
  },[message])
  return (
    <div className="todo_app">
      <div className="notify" style={{display:`${message.message.length == 0 ? 'none' : 'block'}`,backgroundColor:`${message.error ? "#db471e" : "#188977"}`}}>
        <h3>{message.error ? "Oops something went wrong!" : "Successfully!"}</h3>
        <p>{message.message}</p>
      </div>
      <form id="todo_form" onSubmit={(event) => {
         event.preventDefault()
         let value = event.target.todo_input.value;
         if(value.trim().startsWith(" ") || value.trim() === "") return setMessage({error:true,message:"Please provide to-do"})
         if(todos.find(e => e.content.trim() == value.trim())) return setMessage({error:true,message:"Things to-do already have."})
         setTodos([...todos,{content:value,status:false}])
         setMessage({error:false,message:"Successfully added."})
         event.target.todo_input.value = ""
      }}>
        <div style={{ textAlign: "center" }}>
          <label htmlFor="form_input"></label>
          <input
            id="form_input"
            autoComplete="off"
            name="todo_input"
            placeholder="Have breakfast"
          />
          <button id="add_todo" type="submit">
            Add
          </button>
        </div>
      </form>
      <div className="todos" >
        <div className="header">
          <p
            style={{
              display: "inline-block",
              fontWeight: "bold",
              letterSpacing: "1px",
              fontSize: "1.25rem",
            }}
          >
            To Do List
          </p>
          <select id="filter_todos" onChange={(event) => {
            const search_value = document.querySelector("#search_form").value.trim().toLowerCase()
            switch(event.target.value) {
              case "all":
                setShownTodos(todos.filter(e => e.content.toLowerCase().trim().includes(search_value)))
                break;
              case "completed":
                setShownTodos(todos.filter(e => e.status && e.content.toLowerCase().trim().includes(search_value)))
                break;
              case "uncompleted":
                setShownTodos(todos.filter(e => !e.status && e.content.toLowerCase().trim().includes(search_value)))
                break;
            }
          }}>
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="uncompleted">Not Completed</option>
          </select>
          <input
            type="text"
            id="search_form"
            placeholder="Search something"
            style={{padding:".20rem",fontSize: ".90rem"}}
            onChange={(event) => {
              setShownTodos(todos.filter(e => e.content.toLowerCase().includes(event.target.value.toLowerCase())))
              switch(document.querySelector("#filter_todos").value) {
                case "all":
                  setShownTodos(todos.filter(e => e.content.toLowerCase().includes(event.target.value.toLowerCase())))
                  break;
                case "completed":
                  setShownTodos(todos.filter(e => e.status && e.content.toLowerCase().includes(event.target.value.toLowerCase())))
                  break;
                case "uncompleted":
                  setShownTodos(todos.filter(e => !e.status && e.content.toLowerCase().includes(event.target.value.toLowerCase())))
                  break;
                  
              } 
            }}
          />
        </div>
        {
          shownTodos.map((todo,index) => (
            <article key={`${todo}.${index}`} className={todo.status === true ? 'todo_completed' : 'todo'} style={todo.status === true ? {opacity:"0.7"} : {opacity:1}}>
            <input type="checkbox" className="complete_todo" checked={todo.status} onChange={(event) => {
             todos.find(e => e.content.trim() == todo.content.trim()).status = event.target.checked
              setTodos([...todos])
            }} />
             <button className="delete_todo" onClick={() => {
               setTodos(todos.filter(e => e.content !== todo.content))
             }}>X</button>
             <p>{todo.content}</p>
         </article>
          ))
        }
      </div>
    </div>
  );
}

export default App;
