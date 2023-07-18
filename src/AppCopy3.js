import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from 'uuid';
import axios from "axios";
import { Waypoint } from "react-waypoint";
import { CircularProgress, ListItem, Paper, IconButton } from "@mui/material";
import * as rssParser from 'react-native-rss-parser';
//import InboxIcon from "@mui/icons-material/Close";


let counter =0
const initialArtists = [
  { id: 0, name: 'Marta Colvin Andrade' },
  { id: 1, name: 'Lamidi Olonade Fakeye'},
  { id: 2, name: 'Louise Nevelson'},
];



const initialList2 = [
  {
    id: 'a',
    name: 'Max',
  },
  {
    id: 'b',
    name: 'Lea',
  },
  {
    id: 'c',
    name: 'Kuno',
  }
];


// ** with useState ** //

// const App = () => {
//   const [list, setList] = React.useState(initialList);
//   const [name, setName] = React.useState('');

//   function handleChange(event) {
//     setName(event.target.value);
//   }

//   function handleAdd() {
//     const newList = list.concat({ name, id: uuidv4() });

//     setList(newList);

//     setName('');
//   }

//   return (
//     <div>
//       <AddItem
//         name={name}
//         onChange={handleChange}
//         onAdd={handleAdd}
//       />

//       <List list={list} />
//     </div>
//   );
// };

// const AddItem = ({ name, onChange, onAdd }) => (
//   <div>
//     <input type="text" value={name} onChange={onChange} />
//     <button type="button" onClick={onAdd}>
//       Add
//     </button>
//   </div>
// );

// const List = ({ list }) => (
//   <ul>
//     {list.map((item) => (
//       <li key={item.id}>{item.name}</li>
//     ))}
//   </ul>
// );

// ** with useReducer ** //

// const listReducer = (state, action) => {
//   switch (action.type) {
//     case 'ADD_ITEM':
//       return state.concat({ name: action.name, id: action.id });
//     default:
//       throw new Error();
//   }
// };

// const App = () => {
//   const [list, dispatchList] = React.useReducer(
//     listReducer,
//     initialList
//   );
//   const [name, setName] = React.useState('');

//   function handleChange(event) {
//     setName(event.target.value);
//   }

//   function handleAdd() {
//     dispatchList({ type: 'ADD_ITEM', name, id: uuidv4() });

//     setName('');
//   }

//   return (
//     <div>
//       <AddItem
//         name={name}
//         onChange={handleChange}
//         onAdd={handleAdd}
//       />

//       <List list={list} />
//     </div>
//   );
// };

// const AddItem = ({ name, onChange, onAdd }) => (
//   <div>
//     <input type="text" value={name} onChange={onChange} />
//     <button type="button" onClick={onAdd}>
//       Add
//     </button>
//   </div>
// );

// const List = ({ list }) => (
//   <ul>
//     {list.map((item) => (
//       <li key={item.id}>{item.name}</li>
//     ))}
//   </ul>
// );

// ** with useState and complex object ** //

// const App = () => {
//   const [listData, setListData] = React.useState({
//     list: initialList,
//     isShowList: true,
//   });
//   const [name, setName] = React.useState('');

//   function handleChange(event) {
//     setName(event.target.value);
//   }

//   function handleAdd() {
//     const newList = listData.list.concat({
//       name,
//       id: uuidv4(),
//     });

//     setListData({ ...listData, list: newList });

//     setName('');
//   }

//   return (
//     <div>
//       <AddItem
//         name={name}
//         onChange={handleChange}
//         onAdd={handleAdd}
//       />

//       {listData.isShowList && <List list={listData.list} />}
//     </div>
//   );
// };

// const AddItem = ({ name, onChange, onAdd }) => (
//   <div>
//     <input type="text" value={name} onChange={onChange} />
//     <button type="button" onClick={onAdd}>
//       Add
//     </button>
//   </div>
// );

// const List = ({ list }) => (
//   <ul>
//     {list.map((item) => (
//       <li key={item.id}>{item.name}</li>
//     ))}
//   </ul>
// );

// ** with useReducer and complex object ** //

const listReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM':
      console.log("BRK 1 "+JSON.stringify(state))
      console.log("BRK 2 "+JSON.stringify(state.list))
      console.log("BRK 3 "+JSON.stringify(action))
      let count=2
      const dump=  state.list.map(({id, name}) => ({
        id:  nextId(), 
        name: counter,
       
        }))
        console.log("BRK 3.1 "+JSON.stringify(dump))
      const nextList = [
        // Items before the insertion point:
        ...state.list.slice(0, 1),
        // New item:
        ...dump,
        // Items after the insertion point:
        ...state.list.slice(1)
      ];
      
      console.log("BRK 4 "+JSON.stringify(nextList))
      return  {

        list: nextList,
      };
    default:
      throw new Error();
  }
};

function nextId(){
  return counter++;
}


const App = () => {


  const initialList = [
    {
      id: nextId(),
      name: 'Robin',
    },
    {
      id: nextId(),
      name: 'Dennis',
    },
  ];


  const [name, setName] = useState('');
  const [artists, setArtists] = useState(
    initialArtists
  );



  function handleClick() {
    const insertAt = 1; // Could be any index
    const nextArtists = [
      // Items before the insertion point:
      ...artists.slice(0, insertAt),
      // New item:
      { id: nextId++, name: name },
      // Items after the insertion point:
      ...artists.slice(insertAt)
    ];
    setArtists(nextArtists);
    setName('');
  }


  const [listData, dispatchListData] = React.useReducer(listReducer, {
    list: initialList,
    isShowList: true,
  });
  //const [name, setName] = React.useState('');

  function handleChange(event) {
    setName(event.target.value);
  }

  function handleAdd() {
    console.log("BRK 5 "+listData.list.length)
    dispatchListData({ type: 'ADD_ITEM', name, id: uuidv4() });

    setName('');
  }

  return (
    <>
    

    <div>
      <AddItem
        name={name}
        onChange={handleChange}
        onAdd={handleAdd}
      />

      <List list={listData.list} />
    </div>
    </>
  );
};

const AddItem = ({ name, onChange, onAdd }) => (
  <div>
    <input type="text" value={name} onChange={onChange} />
    <button type="button" onClick={onAdd}>
      Add
    </button>
  </div>
);

const List = ({ list }) => (
  <ul>
    {list.map((item) => (
      <li key={item.id}>{item.id}. {item.name}</li>
    ))}
  </ul>
);

export default App;