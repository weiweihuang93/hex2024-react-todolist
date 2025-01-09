import { useState } from 'react';
import axios from 'axios';

function App() {
  const api = 'https://todolist-api.hexschool.io';

  // 註冊
  const [emailSignUp, setEmailSignUp] = useState('');
  const [passwordSignUp, setPasswordSignUp] = useState('');
  const [nicknameSignUp, setNicknameSignUp] = useState('');
  // 註冊提示訊息和錯誤設置
  const [responseMessage, setResponseMessage] = useState('');
  const [isErrorMessage, setIsErrorMessage] = useState(false);

  // 登入
  const [emailSignIn, setEmailSignIn] = useState('');
  const [passwordSignIn, setPasswordSignIn] = useState('');
  // 登入提示訊息和錯誤設置
  const [responseSignIn, setResponseSignIn] = useState('');
  const [isErrorSignIn, setIsErrorSignIn] = useState(false);

  const [token, setToken] = useState('');

  // 代辦事項
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  // 編輯資料
  const [editTodo, setEditTodo] = useState({});

  // 註冊
  const signUp = (e) => {
    e.preventDefault();

    axios.post(`${api}/users/sign_up`, {
      "email": emailSignUp,
      "password": passwordSignUp,
      "nickname": nicknameSignUp
    })
    .then((res) => {
      setResponseMessage('註冊成功');
      setIsErrorMessage(false);
    })
    .catch((err) => {
      setResponseMessage(`註冊失敗: ${err.response?.data?.message || '未知錯誤'}`)
      setIsErrorMessage(true);
    })
  }

  // 登入
  const signIn = (e) => {
    e.preventDefault();

    axios.post(`${api}/users/sign_in`, {
      "email": emailSignIn,
      "password": passwordSignIn,
    })
    .then((res) => {
      setResponseSignIn('登入成功');
      setIsErrorSignIn(false);
      setToken(res.data.token);
      
    })
    .catch((err) => {
      setResponseSignIn(`登入失敗: ${err.response?.data?.message || '未知錯誤'}`)
      setIsErrorSignIn(true);
    })
  }

  // 新增代辦事項
  const addTodo = (e) => {
    e.preventDefault();

    if (!newTodo) {
      alert('請輸入內容');
      return;
    }
    const todo = { "content": newTodo };
    axios.post(`${api}/todos/`, todo, {
      headers: { Authorization: token }
    })
    .then((res) => {
      setNewTodo('');
      getTodos();
    })
    .catch((err) => alert('新增資料失敗'))
  }

  // 取得代辦事項
  const getTodos = () => {
    axios.get(`${api}/todos/`, {
      headers: { Authorization: token }
    })
    .then((res) => {
      setTodos(res.data.data.map(todo => ({...todo, isEditing: false})))
    })
    .catch((err) => alert('取得資料失敗'))
  }

  // 刪除
  const deleteTodo = (id) => {
    axios.delete(`${api}/todos/${id}`,{
      headers: { Authorization: token }
    })
    .then((res) => {
      alert('刪除成功');
      getTodos();
    })
    .catch((err) => alert('刪除失敗'))
  }

  // 編輯
  const editTodoId = (id) => {
    setTodos(todos.map(todo => todo.id === id ? { ...todo, isEditing: true} : todo ))
  };

  // 取消編輯
  const cancelEditTodoId = (id) => {
    setTodos(todos.map(todo => todo.id === id ? { ...todo, isEditing: false} : todo ))
  };

  // 編輯輸入框改變處理
  const onEditInputChange = (event, id) => {
    setEditTodo({
      ...editTodo,
      [id]: event.target.value,
    })
  }

  // 保存
  const saveTodo = (id, value) => {
    const todo = { "content": value };
    axios.put(`${api}/todos/${id}`, todo, {
      headers: { Authorization: token }
    })
    .then((res) => {
      getTodos();
    })
    .catch((err) => alert('更新資料失敗'))
  }

  return(
    <div className="container mt-2">
      <div className="row row-cols-2">
        <div className="col">
          <h2>註冊</h2>
          <form onSubmit={signUp}>
            <div className="form-group">
              <label htmlFor="exampleInputEmail1">Email</label>
              <input
                value={emailSignUp}
                onChange={(e) => setEmailSignUp(e.target.value)}
                type="email"
                className="form-control"
                id="exampleInputEmail1"
                placeholder="請輸入信箱"
              />
            </div>
            <div className="form-group my-3">
              <label htmlFor="exampleInputPassword1">Password</label>
              <input
                value={passwordSignUp}
                onChange={(e) => setPasswordSignUp(e.target.value)}
                type="password"
                className="form-control"
                id="exampleInputPassword1"
                placeholder="請輸入密碼"
                />
            </div>
            <div className="form-group my-3">
              <label htmlFor="exampleInputNickname1">Nickname</label>
              <input
                value={nicknameSignUp}
                onChange={(e) => setNicknameSignUp(e.target.value)}
                type="text"
                className="form-control"
                id="exampleInputNickname1"
                placeholder="請輸入密碼"
                />
            </div>
            <button type="submit" className="btn btn-primary">註冊</button>
          </form>
          {responseMessage && (
            <p className={`mt-2 ${isErrorMessage ? 'text-danger' : 'text-success'}`}>
              {responseMessage}
            </p>
          )}
        </div>
        <div className="col">
          <h2>登入</h2>
          <form onSubmit={signIn}>
            <div className="form-group">
              <label htmlFor="exampleInputEmail1">Email</label>
              <input
                value={emailSignIn}
                onChange={(e) => setEmailSignIn(e.target.value)}
                type="email"
                className="form-control"
                id="exampleInputEmail1"
                placeholder="請輸入信箱"
              />
            </div>
            <div className="form-group my-3">
              <label htmlFor="exampleInputPassword1">Password</label>
              <input
                value={passwordSignIn}
                onChange={(e) => setPasswordSignIn(e.target.value)}
                type="password"
                className="form-control"
                id="exampleInputPassword1"
                placeholder="請輸入密碼"
                />
            </div>
            <button type="submit" className="btn btn-primary">登入</button>
          </form>
          {responseSignIn && (
            <p className={`mt-2 ${isErrorSignIn ? 'text-danger' : 'text-success'}`}>
              {responseSignIn}
            </p>
          )}
        </div>
      </div>

      <hr />
      <form onSubmit={addTodo}>
        <h2>新增資料</h2>
        <div className="form-group">
          <input
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            type="text"
            className="form-control"
            placeholder="請輸入內容"
          />
        </div>
        <button type="submit" className="btn btn-primary mt-3">送出</button>
      </form>

      <hr />
      <h2>取得資料</h2>
      <ul>
        {todos.map((item) => (
          <li key={item.id} className="mt-3 ms-1">{item.content}
            {item.isEditing ? (
            <>
              <input
                value={editTodo[item.id] || item.content}
                onChange={(e) => onEditInputChange(e, item.id)}
                type="text" />
              <button 
                onClick={() => saveTodo(item.id, editTodo[item.id] || item.content)}
                type="button"
                className="btn btn-primary ms-1">保存</button>
              <button 
                  onClick={() => cancelEditTodoId(item.id)}
                  type="button"
                  className="btn btn-danger ms-1">取消編輯</button>
            </>
            ) : (
            <>
              <button
                onClick={() => editTodoId(item.id)}
                type="button"
                className="btn btn-secondary ms-1">編輯</button>
                <button
                  onClick={() => deleteTodo(item.id)}
                  type="button"
                  className="btn btn-danger ms-1">刪除</button>
              </>)}
            </li>)
        )}
      </ul>

    </div>
  )
};

export default App