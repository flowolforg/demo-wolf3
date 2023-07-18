import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from 'uuid';
import axios from "axios";
import { Waypoint } from "react-waypoint";
import { CircularProgress, ListItem, Paper, IconButton } from "@mui/material";
import * as rssParser from 'react-native-rss-parser';
//import InboxIcon from "@mui/icons-material/Close";

const initialList = [
  {
    id: 'a',
    name: 'Robin',
  },
  {
    id: 'b',
    name: 'Dennis',
  },
];


const listReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM':
      return state.concat({ name: action.name, id: action.id });
    default:
      throw new Error();
  }
};

const insertionList = [
  {
    id_unique: uuidv4(),
    title: 'Robin',
  },
  {
    id_unique: uuidv4() ,
    title: 'Dennis',
  },
];


function reducer(count, action) {
  switch (action.type) {
    
    case 'increment':{
      console.log("BRK COUNT "+JSON.stringify(action))
      console.log("BRK COUNT "+JSON.stringify(action.item))
      return count + 1
    }
    default:
      return count
  }

}

const App = () => {


  const [list, dispatchList] = React.useReducer(
    listReducer,
    initialList
  );
  const [name, setName] = React.useState('');

  function handleChange(event) {
    setName(event.target.value);
  }

  function handleAdd() {
    dispatchList({ type: 'ADD_ITEM', name, id: uuidv4() });

    setName('');
  }

  const [count, dispatch] = React.useReducer(reducer, 1)
  
 
  


  


  const [papers, setPapers] = useState([]);


  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const ITEMS_PER_PAGE = 10;


  const [counter, setCounter] = useState(1);
  const incrementCounter = () => setCounter(counter + 1);
  let decrementCounter = () => setCounter(counter - 1);



  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    if (!hasNextPage) return;
    //const searchURL = `https://api.core.ac.uk/v3/search/works/?q=bit&limit=${ITEMS_PER_PAGE}&offset=${page}0&api_key=zJkcW2YTpr8uZShRM3ivm1AwF0Dj5C4E`
    const searchURL = `https://export.arxiv.org/api/query?search_query=bitcoin&id_list=&start=${page}&max_results=${ITEMS_PER_PAGE}`
    axios({
      method: 'GET',
      url: searchURL,
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_API_KEY}`
       
      }
    }).then((res) => rssParser.parse(res.data))
      .then((rss) => {

       console.log("rss", rss.items)
       // //console.log("Debug 1 "+rss.title)
       // //console.log(rss.items.map(b => b.title))
       console.log(rss.items.map(l =>l.links[1].url))
      

   /* }).then((res) => {
      console.log("DEBUG", res.data.results.map(({title,abstract, downloadUrl}) => ({
        title,
        abstract,
        downloadUrl
      })))



      const dump = res.data.results.map(({title,abstract, downloadUrl}) => ({
        id_unique:  uuidv4(), 
        title,
        abstract,
        downloadUrl
      }))*/

      let count =0
      const dump=  rss.items.map(({title, description, links}) => ({
        id_unique:  page+(count++), 
        title,
        description,
        links: links[1].url
        }))

    


     

        console.log("DEbug",dump.map(({id_unique,title, description,links}) => ({
          id_unique,
          title,
          description,
          links: links[1].url
        })))

    

     /*setPapers( 
        res.data.results.map(({title, abstract, downloadUrl}) => ({
        id_unique:  uuidv4(), 
        title,
        abstract,
        downloadUrl
        }))*/

      setPapers(  (papers => [...papers, ...dump]));
      
      

      setPage(page => page + ITEMS_PER_PAGE);
      setCounter(counter => counter + ITEMS_PER_PAGE);

  })
  };



 

  const loadMoreData = () => {
    if (page > 1) {
      getData();
    }
  };



 

  
  return (

    <div>


{papers.length}
<div>
      <AddItem
        name={name}
        onChange={handleChange}
        onAdd={handleAdd}
      />

      <List list={list} />
    </div>
      <ul>
        {papers.map(paper => (
          <li key={paper.id_unique}>
            <label>
              <input
                type="checkbox"
                checked={false}
                onChange={() => dispatch({ type: 'increment', insertionList, papers })}
              />
             
              <div> ID: {paper.id_unique} </div>
               <div> Title {paper.title} </div> 
               <div> Abstract {paper.description}  </div> 
               <div> Counter {count}  </div> 
            </label>
          </li>
    
        ))}
      </ul>
   
      <Waypoint onEnter={loadMoreData}>
                            <h5 className="text-muted mt-5">
                                Loading data{" "}
                             
                            </h5>
                        </Waypoint>

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
