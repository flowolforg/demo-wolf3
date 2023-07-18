import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import axios from "axios";
import { Waypoint } from "react-waypoint";
import { CircularProgress, ListItem, Paper, IconButton } from "@mui/material";
import AppBar from '@mui/material/AppBar';
//import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { styled, alpha } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import InputBase from '@mui/material/InputBase';
import Toolbar from '@mui/material/Toolbar';
import * as rssParser from 'react-native-rss-parser';
import combinationOfKeywords from "./combinationOfKeywords";
import { sizing } from "@mui/system";
//import InboxIcon from "@mui/icons-material/Close";


function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

function replaceAll(str, find, replace) {
  return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

function readAndDeleteLastKeywordCombination(arr){
  console.log("End of Stack ?" + JSON.stringify(arr.length));
 
  if (arr.length===0){
   
    return arr =[]

  }

  let buf= arr[arr.length-1].query.pop();
  if(arr[arr.length-1].query.length===0){
   arr.pop()
  }
  return buf
}



//all:bitcoin+AND+all:%22google%20trends%22
function objectToQueryStringWithAND(obj) {
  console.log("obj "+JSON.stringify(obj))
  var str ="";
  for (var p in obj)
   if (obj.hasOwnProperty(p)) {
    
    str=str+(`+AND+all:${obj[p]}`);
    }
    //Arxiv.org API does not take "-"
    str = replaceAll(str, "-", "%20")
  return str
}


function generateSearchWordString (clear_arr,keywords){
 
  let combo=combinationOfKeywords(clear_arr)
  //console.log("COMBO "+JSON.stringify(combo))
 

 //let url_string = objectToQueryStringWithAND(readAndDeleteLastKeywordCombination(clear_arr))
 let url_string = objectToQueryStringWithAND(clear_arr)
 //console.log("Get Entities done "+url_string)
 
 //pvh url_string = replaceAll(url_string, "-", "%29")
 //url_string=url_string.replace( /\r|\n/g, ' ') //BUG 
 //console.log("DEBUG URL STRING " + url_string)
 //url_string=decodeURI(url_string)
 //console.log("Keywords " + keywords)

 let q = keywords
 if (url_string.length > 0)
   q = 'all:'+q+url_string 
 //q=returnFirstWord(keywords)+'%20AND%20('+url_string+')'
 //console.log("Query Refinement1 " + q)
 //q=q.split(" ").join("%20");
 //console.log("BRK AND "+q)

return q  
}

const listReducer = (state, action) => {
  switch (action.type) {

    case 'ADDITIONAL_KEYWORD_LIST':

    console.log("BRK ADD KEYWORD LIST")
  

    const insertList2 = [
      // Items before the insertion point:
      ...state.slice(0, action.index),
      // New item:
      ...action.newList,
      // Items after the insertion point:
      ...state.slice(action.index)
    ];

    return insertList2

    case 'INSERT_LIST':


    console.log("BRK INSERT LIST")
      const insertList = [
        // Items before the insertion point:
        ...state.slice(0, action.index),
        // New item:
        ...action.newList,
        // Items after the insertion point:
        ...state.slice(action.index)
      ];

      //console.log("BRK 3.2 " + action.index)
      //console.log("Insert LIST "+JSON.stringify(insertList))
      return insertList //state.concat({ name: action.name, id: action.id });
      

    case 'NEW_LIST':
      console.log("NEW LIST")
      return action.newList
    case 'MORE_DATA':

      const upDateList = [
        ...state, ...action.newList

      ];
      // console.log("More Data 1"+JSON.stringify(upDateList))
      // console.log("More Data 2"+JSON.stringify(action.list))
      return upDateList
    default:
      throw new Error();
  }
};





function clearEntities(entities, keywords) {
 

  // Entities excluding initial keyword(s), not case sensitive
  //console.log("BRK Keywords"+keywords)
  let clear_entities = entities.filter(e => e.toLowerCase() !== keywords.toLowerCase());
  //get rid of line feed etc  
  clear_entities = clear_entities.map(e => e.replace(/\r|\n/g, ' '));
  //de-duplicate
  clear_entities = [...new Set(clear_entities)];


  return clear_entities


}

const App = () => {

  

  const initialList = [
    {
      id_unique: 0,
      title: 'Robin',
      description: 'ABC'
    },
    {
      id_unique: 1,
      title: 'Denis',
      description: 'ABC'
    },
  ];


  const [list, dispatchList] = React.useReducer(
    listReducer,
    []
  );
 




  function handleChange2(index, id, text) {

    //console.log("BRK handleChange " + index + " " + id);
    document.getElementById(id).disabled = true;
    document.getElementById(id).textContent = 'hot!'
    getEntities(text, index, id)
   



  }








  const [papers, setPapers] = useState([]);


  const [keywords, setKeywords] = useState('');
  const [page, setPage] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [initialPage, setInitialPage] = useState(true);
  const [stopCombo, setStopCombo] = useState(true);
  const [moreCalls, setMoreCalls] = useState([
    {
      searchstring: '',
      arr:[],
      index:0,
      id:''
    }
  ]
  )


  const ITEMS_PER_PAGE = 3;


  const [counter, setCounter] = useState(0);

  const [counterInsert, setInsertCounter] = useState(0);

  const [entities, setEntities] = useState(['TEST']);

  function readAndDeleteLastKeywordCombination(arr){
   // console.log("End of Stack ?" + JSON.stringify(arr.length));
   
    if (arr.length===0){
     
      return arr =[]
  
    }
  
    let buf= arr[arr.length-1].query.pop();
    if(arr[arr.length-1].query.length===0){
     arr.pop()
    }
    return buf
  }

  useEffect(() => {

  //console.log("useEffect "+moreCalls)
  getData(counterInsert+1,moreCalls.id, 'ADDITIONAL_KEYWORD_LIST', moreCalls.searchstring, moreCalls.arr)
  
  }, [moreCalls])
  
  function unpack(obj, num, index, id, TYPE, keywords, arr ){

    for (var i=0; i<num; i++){
 


setMoreCalls({
  searchstring: 'bitcoin'+objectToQueryStringWithAND(obj[i]),
  arr: obj[i],
  //arr: arr,
  index: index,
  id: id
});
    //console.log(objectToQueryStringWithAND(obj[i]))

//console.log("getData "+(index + 1)+" "+id+'INSERT_LIST'+" "+objectToQueryStringWithAND(obj[i])+" "+arr);
   
    //getData((index + 1), id, 'INSERT_LIST',objectToQueryStringWithAND(obj[i]),arr)
   
  }
 setStopCombo(true) 

  }

  function readKeywordCombination(arr, num){

   // console.log("BRK 30 " + JSON.stringify(arr[num]));
   // console.log("BRK 31 "+arr[num].query[num].map(str=>str))
    var buf = []
    buf = arr[num].query[num].map(str=>str)
    return buf
  }
  
  function page_generator(TYPE) {



    switch (TYPE) {
      case 'ADDITIONAL_KEYWORD_LIST':
        setPage(0)
        return 0

      case 'INSERT_LIST':
     
        setPage(0);
        return 0
     
      case 'NEW_LIST':
        setPage(0);
        return 0
    
      case 'MORE_DATA':
        setPage(page => (page + ITEMS_PER_PAGE));
        return page + ITEMS_PER_PAGE
      
}
  }
  function id_generator(TYPE, i, id) {



    switch (TYPE) {

      case 'ADDITIONAL_KEYWORD_LIST':
        //return id.slice(0, -1) + (i+1);
        //console.log("id generator "+id + '.' + i)
        return (id + '.' + i);

      case 'INSERT_LIST':
        //setPage(page => (page+1));
        //console.log("INSERT_LIST " + page)

       // setCounter(counter => (counter + 1));
      
        return (id + '.' + i);
      case 'NEW_LIST':
     
        setCounter(counter => (counter + 1));
        return ('' + i);
      case 'MORE_DATA':
    
        setCounter(counter => (counter + 1));
        //console.log("MORE DATA " + (counter+i))
        // setPage(page => (page+1));
        return ('' + (counter+i ))//(''+(counter+1));


      default:
        throw new Error();
    }
  }


  useEffect(() => {
    //console.log("BRK GET Entities")
    getEntities();
  }, []);

  const getEntities = (text,index,id) => {
    let arr=[]
 
     //encode percentage sign
     if (text != undefined){
     text = replaceAll(text, "%", "%25")

     }

    const searchURL = `https://api.dandelion.eu/datatxt/nex/v1/?%2Cabstract%2Ctypes%2Ccategories%2Clod&top_entities=8&min_confidence=0.75&text=${text}&country=-1&token=f65a2644720e43bb8e8b567abd29dc7e`


    //console.log("getEntities " + searchURL)
    axios({
      method: 'GET',
      url: searchURL,

    }).then((res) => {



    //console.log("Clean ENtities "+(res.data.annotations.map(b => b.spot)+" "+keywords))
    let arr=clearEntities(res.data.annotations.map(b => b.spot),keywords)

    

    let searchWordsString=generateSearchWordString(arr, keywords)
    console.log("searchWordsString "+searchWordsString)
  
     
      /* pvh getData((index + 1), id, 'INSERT_LIST', searchWordsString, arr); */

            let combo =combinationOfKeywords(arr)
 
      //console.log("BRK STOP "+stopCombo)
       // if(TYPE === 'INSERT_LIST' && stopCombo==false)
        combo.map(({ query, num },i) => (
      
          //console.log("Zähler "+i),
          //console.log("BRK 32 "+JSON.stringify(query)+" num "+num),
        
  
         unpack(query.map(l =>l),num,  index, id_generator('ADDITIONAL_KEYWORD_LIST', i, id), 'ADDITIONAL_KEYWORD_LIST', keywords, arr)
          
      ))



    })
  
  };



  useEffect(() => {
    //console.log("BRK GET DATA")
    getData();
  }, []);

  const getData = (index, id, TYPE, keywords, arr) => {
    setInitialPage(false)
    console.log("BRK Iintialpage " + initialPage)
    if (initialPage) return;
    if (!hasNextPage) return;
    let p =page_generator(TYPE)
    //console.log("PAGE "+p+" "+page)
    let max_results=ITEMS_PER_PAGE
    if (TYPE ==='INSERT_LIST')
     max_results=3
   
    //const searchURL = `https://api.core.ac.uk/v3/search/works/?q=bit&limit=${ITEMS_PER_PAGE}&offset=${page}0&api_key=zJkcW2YTpr8uZShRM3ivm1AwF0Dj5C4E`
    const searchURL = `https://export.arxiv.org/api/query?search_query=${keywords}&start=${p}&max_results=${max_results}`
    console.log("getData " + searchURL)
    axios({
      method: 'GET',
      url: searchURL,
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_API_KEY}`

      }
    }).then((res) => rssParser.parse(res.data))
      .then((rss) => {

        //QUICK BUG FIX
        if (arr === undefined)
        arr=['Test']

        const newList = rss.items.map(({ title, description, links }, i) => ({
          id_unique: id_generator(TYPE, i, id),
          title: title+' '+TYPE,
          description,
          links: links[1].url,
          searchwords: arr,
          page: page + ITEMS_PER_PAGE,
          hasMorePage: true,
          selected: false

        }))

        if(TYPE === 'INSERT_LIST'){
        setInsertCounter(rss.items.length+index)

        }

        //console.log("BRK new List " + JSON.stringify(newList));

        



        dispatchList({ type: TYPE, newList, index });

/*pvh
      let combo =combinationOfKeywords(arr)
 
      console.log("BRK STOP "+stopCombo)
        if(TYPE === 'INSERT_LIST' && stopCombo==false)
        combo.map(({ query, num },i) => (
      
          console.log("Zähler "+i),
          console.log("BRK 32 "+JSON.stringify(query)+" num "+num),
        
  
         unpack(query.map(l =>l),num,  index, id_generator(TYPE, i, id), TYPE, keywords, arr)
          
      ))
        
        */
    /*pvh  if(TYPE != 'INSERT_LIST')
      setStopCombo(false)*/

   
       
          



      })

      
  };







  const loadMoreData = () => {
    console.log("loadMoreData " + counter + 'MORE_DATA')
    //if (page > 1) {
      getData(0, 0, 'MORE_DATA', keywords);
   // }
  };





  const [message, setMessage] = useState('');

  const [updated, setUpdated] = useState('');

  const handleChange3 = (event) => {
    setMessage(event.target.value);

  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      // 👇 Get input value
      setUpdated(message);
      setKeywords(message)
      getData(0, 0, 'NEW_LIST', message);
     
    }
  };


//Material Bug https://github.com/mui/material-ui/issues/16844#issuecomment-517205129

  return (
    <Grid container >
      <Grid container >

        <AppBar component="nav" position="fixed">

          <Toolbar>
            <Grid item xs={2}  >
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
              >
                flowolf
              </Typography>
            </Grid>
            <Grid item xs={7}  >

          
                <label>
                  Search:
                  <input
                 type="text"
                 id="message"
                 name="message"
                 value={message}
                 onChange={handleChange3}
                 onKeyDown={handleKeyDown}
                  />
                </label>

            

            </Grid>
            <Grid item xs={3}  >

InsertCounter {counterInsert} 
            </Grid>

          </Toolbar>
        </AppBar>
        <Toolbar /> 

      </Grid>
    


      {list.map((item, i) => (
      
  

      <Grid container >
          <Grid item xs={2}  >
          </Grid>
          <Grid item xs={7}  >
            <Card>
              <CardContent key={item.id_unique}>
             
            
              {i} <button id={item.id_unique} onClick={() => handleChange2(i, item.id_unique, item.description)} >{'Hot?'}</button>

              {item.id_unique} {item.title}
              <p>

                {item.description}
              </p>


              <p>

              
              </p>

           

            
  
                



              </CardContent>
              <CardActions>
          PDF LINK
              </CardActions>
            </Card>
        
          </Grid>


     


          <Grid item xs={3}  >
       
       
       
       Additional search words
       <p>
 

        {item.searchwords.map((type, index) => { return <li key={index}>{type}</li>})}

        </p>

          </Grid>


        </Grid>
      
      ))
      }
  <Waypoint onEnter={loadMoreData}>
                            <h5 className="text-muted mt-5">
                                Loading data Mainstream{" "}
                             
                            </h5>
                        </Waypoint>
    </Grid>

  );
};



export default App;
