import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from 'uuid';
import axios from "axios";
import { Waypoint } from "react-waypoint";
import { CircularProgress, ListItem, Paper, IconButton } from "@mui/material";
//import InboxIcon from "@mui/icons-material/Close";



const initialList = [
  {
    id: 'a',
    login: 'Robin',
  },
  {
    id: 'b',
    login: 'Dennis',
  },
];

const UserCard = ({ sno, login, id, avatar_url, html_url }) => {
  return (
    <li className="list-group-item">
      <div className="card border-0">
        <div className="row no-gutters">
          <div className="col-md-3">
            <img
              src={avatar_url}
              className="img-thumbnail border-secondary rounded-circle"
            />
          </div>
          <div className="col-md-9">
            <div className="card-body py-1 px-2 text-left">
              <h5 className="card-title">
                {sno} . {login}
              </h5>
              <p className="card-text">{id}</p>
              <p className="card-text">
                <button
                  type="button"
                  className="btn btn-outline-info mr-2"
                >
                  <i className="fas fa-edit mr-2"></i>
                  View On Github
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

// ** with useReducer and complex object ** //

const listReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM':
      return {
        ...state,
        list: state.list.concat({ login: action.login, id: action.id }),
        
      };
    case 'ADD_LIST':
      return {
        ...state,
        list: state.list.concat({ login: action.login, id: action.id }),
      };

    default:
      throw new Error();
  }
};

const initialTodos = [
  {
    id: 'a',
    task: 'Learn React',
    complete: false,
  },
  {
    id: 'b',
    task: 'Learn Firebase',
    complete: false,
  },
];

const todoReducer = (state, action) => {
  switch (action.type) {
    case 'DO_TODO':
      return state.map(todo => {
        console.log("BRK "+todo.task)
        if (todo.id === action.id) {
          return { ...todo, complete: true };
        } else {
          return todo;
        }
      });
      
    case 'UNDO_TODO':
      return state.map(todo => {
        if (todo.id === action.id) {
          return { ...todo, complete: false };
        } else {
          return todo;
        }
      });
    default:
      return state;
  }
};


const App = () => {

  const [todos, dispatch] = React.useReducer(
    todoReducer,
    initialTodos
  );

  const handleChange2 = todo => {
    loadMoreData()
    dispatch({ type: 'DO_TODO', id: todo.id });
  };

  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const ITEMS_PER_PAGE = 20;


  const [counter, setCounter] = useState(1);
  const incrementCounter = () => setCounter(counter + 1);
  let decrementCounter = () => setCounter(counter - 1);



  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    if (!hasNextPage) return;

    const searchUserURL = `https://api.github.com/search/users?q=dcoder&page=${page}&per_page=${ITEMS_PER_PAGE}`;
    axios.get(searchUserURL).then(({ data: { items, total_count } }) => {
      if (items) {
        if (total_count === users.length + items.length) {
          setHasNextPage(false);
        }

        setUsers(users => [...users, ...items]);

        console.log([...users, ...items])
        setPage(page => page + 1);
      }
    });
  };

  const loadMoreData = () => {
    if (page > 1) {
      getData();
    }
  };
  const [listData, dispatchListData] = React.useReducer(listReducer, {
    list: initialList,
    isShowList: true,
  });
  const [login, setLogin] = React.useState('');

  function handleChange(event) {
    setLogin(event.target.value);
  }

  function handleAdd() {

    dispatchListData({ type: 'ADD_ITEM', login, id: uuidv4() });

    setLogin('');
  }

  function countup() {

setCounter(counter+1)
return counter;
  }
  return (

    <div>
      <AddItem
        login={login}
        onChange={handleChange}
        onAdd={handleAdd}
      />



      <List list={listData.list}  />
      <ul>
        {users.map(user => (
          <li key={user.id}>
            <label>
              <input
                type="checkbox"
                checked={todo.complete}
                onChange={handleChange2}
              />
               {user.id} {user.login} {user.node_id 
            </label>
          </li>
        ))}
      </ul>
      <List list={users} />


    </div>
  );
};

const AddItem = ({ login, onChange, onAdd }) => (
  <div>
    <input type="text" value={login} onChange={onChange} />
    <button type="button" onClick={onAdd}>
      Add
    </button>
  </div>
);

const List = ({ list }) => (
  <ul>
    {list.map((item) => (
      <li key={item.id}>{item.id} {item.login}</li>
    ))}
  </ul>
);

export default App;
