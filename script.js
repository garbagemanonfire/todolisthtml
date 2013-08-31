
      var simpletodo = {};
      simpletodo.webdb = {};
      
      simpletodo.webdb.db = null;
      
      simpletodo.webdb.open = function() {
        var dbSize = 5 * 1024 * 1024; // 5MB
        simpletodo.webdb.db = openDatabase("Todo", "1.0", "Todo manager", dbSize);
      }
      
      simpletodo.webdb.onError = function(tx, e) {
        alert("Shit hit the fan, check the database: " + e.message);
      }

      simpletodo.webdb.onSuccess = function(tx, r) {
        // re-render the data.
        simpletodo.webdb.getAllTodoItems(loadTodoItems);
      }

      simpletodo.webdb.createTable = function() {
        var db = simpletodo.webdb.db;
        db.transaction(function(tx) {
          tx.executeSql("CREATE TABLE IF NOT EXISTS todo(ID INTEGER PRIMARY KEY ASC, todo TEXT, added_on DATETIME)", []);
        });
      }
      
      simpletodo.webdb.addTodo = function(todoText) {
        var db = simpletodo.webdb.db;
        db.transaction(function(tx){
          var addedOn = new Date();
          tx.executeSql("INSERT INTO todo(todo, added_on) VALUES (?,?)",
              [todoText, addedOn],
              simpletodo.webdb.onSuccess,
              simpletodo.webdb.onError);
         });
      }
      
      simpletodo.webdb.getAllTodoItems = function(renderFunc) {
        var db = simpletodo.webdb.db;
        db.transaction(function(tx) {
          tx.executeSql("SELECT * FROM todo", [], renderFunc,
              simpletodo.webdb.onError);
        });
      }
      
      simpletodo.webdb.deleteTodo = function(id) {
        var db = simpletodo.webdb.db;
        db.transaction(function(tx){
          tx.executeSql("DELETE FROM todo WHERE ID=?", [id],
              simpletodo.webdb.onSuccess,
              simpletodo.webdb.onError);
          });
      }
      
      function loadTodoItems(tx, rs) {
        var rowOutput = "";
        var todoItems = document.getElementById("todoItems");
        for (var i=0; i < rs.rows.length; i++) {
          rowOutput += renderTodo(rs.rows.item(i));
        }
      
        todoItems.innerHTML = rowOutput;
      }
      
      function renderTodo(row) {
        return "<li class> <a href='javascript:void(0);'  onclick='simpletodo.webdb.deleteTodo(" + row.ID +");'>"+ row.todo + "</a></li>";
      }
      
      function init() {
        simpletodo.webdb.open();
        simpletodo.webdb.createTable();
        simpletodo.webdb.getAllTodoItems(loadTodoItems);
      }
      
      function addTodo() {
        var todo = document.getElementById("todo");
        simpletodo.webdb.addTodo(todo.value);
        todo.value = "";
      }
