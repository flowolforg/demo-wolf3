import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { Waypoint } from 'react-waypoint';
import { ListItem, Paper, IconButton } from '@mui/material';
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
import combinationOfKeywords from './combinationOfKeywords';
import { sizing } from '@mui/system';
//import InboxIcon from "@mui/icons-material/Close";
import Tooltip from '@mui/material/Tooltip';

import Chip from '@mui/material/Chip';

import { useTimer } from 'react-timer-hook';







function OnScreenTimer(props) {


  const countdown=30;
  const time = new Date();
  time.setSeconds(time.getSeconds() + countdown); 
  

 
    
  const {
    seconds,
    minutes,
    hours,
    days,
    start,
    restart,
    pause,
    resume,
  } = useTimer({ expiryTimestamp:time, onExpire: () => props.handleCallback(props), autoStart: false });

 


  //const [timeLeft, actions] = useCountDown(3000, 100);

  const [highlighted, setBackground] = useState(false);
  const [initialising, presetTimer] = useState(false);
 


function startT(){
//console.log("start timer");
  start();

}
  

       ////console.log("DEBUG "+props.value+" "+timeLeft+"  "+initialising)

      
      
       ////console.log("DEBUG "+props.value+" "+seconds);
 



    function onEnter(){
      if(props.start==false)
      return
      //console.log(props.value+" Enter");
      setBackground(false);
      presetTimer(true);
      //start();
      //actions.start();
      const time = new Date();
      time.setSeconds(time.getSeconds() + countdown);
      restart(time);   


    }

    function onLeave(){
      //console.log(props.value+" Leave");
      setBackground(false);
      pause();
      //actions.pause();

    }

  

  return (
   
    
     <Waypoint  onEnter={onEnter}  onLeave={onLeave} topOffset='400px' bottomOffset='50px' >
    <div   style={{backgroundColor: highlighted ? '#FFE5B4' : 'white',}}
      className="OnScreenTimer">
        {props.showTimer && 
    <div>{seconds}</div>
        }
   </div>
    </Waypoint>
  );
}






function searchbarStr2arrayWithKeywords(str){
// string from searchbar  'keyword1 "key word2" "key word3"' is stored in an array ['keyword1', 'key word2', 'key word3'] 
  return str.match(/(".*?"|[^"\s]+)(?=\s*|\s*$)/g).map(keyword => keyword.replace(/"/g, '')); 

}

function inputStringToQueryWithAnd (myString){

  var myRegexp = /[^\s"]+|"([^"]*)"/gi;

var myArray = [];

do {
    //Each call to exec returns the next regex match as an array
    var match = myRegexp.exec(myString);
    if (match != null)
    {
        //Index 1 in the array is the captured group if it exists
        //Index 0 is the matched text, which we use if no captured group exists
        myArray.push(match[1] ? match[1] : match[0]);
    }
} while (match != null);



let string=objectToQueryStringWithAND(myArray)
return string;
  }

  
  function inputStringToQueryWithAnd2(myString){

    var myRegexp = /[^\s"]+|"([^"]*)"/gi;
  
  var myArray = [];
  
  do {
      //Each call to exec returns the next regex match as an array
      var match = myRegexp.exec(myString);
      if (match != null)
      {
          //Index 1 in the array is the captured group if it exists
          //Index 0 is the matched text, which we use if no captured group exists
          myArray.push(match[1] ? match[1] : match[0]);
      }
  } while (match != null);
  

  
  let string=objectToQueryStringWithAND2(myArray)
  return string;
    }




const makeCounter = init => {
  let value = init;
  return {
    increment: () => (value += 1),
    decrement: () => (value -= 1),
    incrementWithOffset: delta => (value +=delta+1),
    current: () => (value),
  };
};


function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

function replaceAll(str, find, replace) {
  return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

function readAndDeleteLastKeywordCombination(arr) {
 

  if (arr.length === 0) {
    return (arr = []);
  }

  let buf = arr[arr.length - 1].query.pop();
  if (arr[arr.length - 1].query.length === 0) {
    arr.pop();
  }
  return buf;
}


function objectToQueryStringWithANDNOT2(obj) {
  var str = [];
  for (var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push('%22'+obj[p]+'%22');
    }
  var q= str.join("OR");
  q = replaceAll(q, '-', '%20');
  return '+ANDNOT+%28'+q+'%29';
}

function objectToQueryStringWithANDNOT(obj) {

 var str = '';
 for (var p in obj)
   if (obj.hasOwnProperty(p)) {
     str = str + `all:%22${obj[p]}%22+OR+`;
   }
 //Arxiv.org API does not take "-"
 str = replaceAll(str, '-', '%20');
 return '+ANDNOT+%28'+str+'%29';
}



//all:bitcoin+AND+all:%22google%20trends%22
function objectToQueryStringWithAND(obj) {

  var str = '';
  for (var p in obj)
    if (obj.hasOwnProperty(p)) {
      str = str + `+AND+all:%22${obj[p]}%22`;
    }
  //Arxiv.org API does not take "-"
  str = replaceAll(str, '-', '%20');
 console.log("STR ", str)
  return str;
}

function arrayToQueryStringWithAND(arr) {

  var str = [];
  for (var x=0; x<arr.length; x++)
    str.push("all:%20%22" +arr[x]+"%22%20");
    
  str=str.join("+AND+");
  str = replaceAll(str, '-', '%20');
  return str;

}

function arrayToQueryStringWithANDforCore(arr) {

  var str = [];
  for (var x=0; x<arr.length; x++)
    str.push("%20%22" +arr[x]+"%22%20");
    
  str=str.join("+AND+");
  str = replaceAll(str, '-', '%20');
  return str;

}

function arrayToQueryStringWithANDNOT(arr) {

  var str = [];
  for (var x=0; x<arr.length; x++)
    str.push("all:%20%22" +arr[x]+"%22%20");
    
  str= str.join("+OR+");
  str = replaceAll(str, '-', '%20');
  return '+ANDNOT+%28' + str + '%29';
}



function objectToQueryStringWithAND2(obj) {
  var str = [];
  for (var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push("all:%20%22" +obj[p]+"%22%20");
    }
  return str.join("+AND+");
}



function generateSearchWordString(qAND, qNOT, querySearchkeywords) {


 
  let AND_string = arrayToQueryStringWithAND(qAND);




   if(qNOT.length===0)
   var NOT_string=''
  else var NOT_string= arrayToQueryStringWithANDNOT(qNOT)


  

let q2=''



  if (AND_string.length > 0) q2 = querySearchkeywords +'+AND+'+AND_string +NOT_string;


  return q2;
}

const listReducer = (state, action) => {
  switch (action.type) {
    case 'ADDITIONAL_KEYWORD_LIST':
     // console.log('BRK ADD KEYWORD LIST at index '+action.index+' with tpye '+action.type+' length '+action.newList.length);


 


    case 'INSERT_LIST':
    
 
      const insertList = [
        // Items before the insertion point:
        ...state.slice(0, action.index-1),
        // New item:
        ...action.newList,
        // Items after the insertion point:
        ...state.slice(action.index),
      ];

      //console.log("BRK 3.2 " + action.index)
      //console.log("Insert LIST "+JSON.stringify(insertList))
      return insertList; //state.concat({ name: action.name, id: action.id });

    case 'NEW_LIST':
      console.log('NEW LIST');
      return action.newList;
    case 'MORE_DATA':
      const upDateList = [...state, ...action.newList];
      // console.log("More Data 1"+JSON.stringify(upDateList))
      // console.log("More Data 2"+JSON.stringify(action.list))
      return upDateList;
    default:
      throw new Error();
  }
};



function clearEntities(entities, keywords) {



  // Entities excluding initial keyword(s), not case sensitive
  let clear_entities = entities.filter(
    (e) => e.toLowerCase() !== keywords.toLowerCase()
  );

   //replace # by %23
   clear_entities = clear_entities.map((e) =>
   e.replace(/#/g, '%23')
  );


   //replace _ by space
 clear_entities = clear_entities.map((e) =>
 e.replace(/_/g, ' ')
);

  //get rid of line feed etc
  clear_entities = clear_entities.map((e) =>
    e.replace(/\r|\n/g, ' ')
  );
  //de-duplicate
  clear_entities = [...new Set(clear_entities)];

  

  return clear_entities;
}



function Teaser(props) {
  const [initTeaser, setInitTeaser] = useState(true);




  useEffect(() => {
    if(initTeaser){
   
      
      props.handleCallback(props)

      setInitTeaser(false);
    }
  }, []); // Empty dependency array makes this run on first render only.
 

  return (
   
    

   <div   style={{backgroundColor:  'white'}}
     className="Teaser">


  </div>

 );
}


const App = () => {


  const [showTimer, setShowTimer] = useState(false);

  //console.log( counter() ); // 0
  //console.log( counter() ); // 1


  const c1 = makeCounter(0); 

  const c2= makeCounter(0); 

  const c3= makeCounter(0);




  

  

  const [list, dispatchList] = React.useReducer(listReducer, []);


  function handleChange4(type, index){
     chatGPT(type, index)

  }

  function initialTeaserData (pros) {
   
   let keywords=[pros.keywords]
  //  console.log("Call to initialTeaserData", keywords);
  setKeywordsArrayFromSearchbar(keywords)
    getData(0, 0, 'INSERT_LIST', arrayToQueryStringWithAND(keywords), keywords, [], [], true);

   
  }


 function handleParentFun (props) {
    console.log("Call to Parent Component!",props);
    
    setInsertCounter((counterInsert) => (counterInsert + props.index));
  
    c1.incrementWithOffset(props.index)
   
    getEntities(props.text, props.iindex, props.id_unique)
  }



  function handleChange2(index, id, text) {
   // console.log("BRK handleChange " + index + " " + id);
    document.getElementById(id).disabled = true;
    document.getElementById(id).textContent = 'Interesting paper. Add similar papers below.';
    setInsertCounter((counterInsert) => (counterInsert + index));
  
    c1.incrementWithOffset(index)
   
   
   // getEntitiesFromGPT(text, index, id);
    
  getEntities(text, index, id);
  }

  const [papers, setPapers] = useState([]);

  const [keywords, setKeywords] = useState('');
  const [keywordsArrayFromSearchbar, setKeywordsArrayFromSearchbar] = useState([]);
  const [page, setPage] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [initialPage, setInitialPage] = useState(true);
  const [stopCombo, setStopCombo] = useState(true);
  const [moreCalls, setMoreCalls] = useState([
    {
      searchstring: '',
      arr: [],
      index: 0,
      id: '',
    },
  ]);

  const ITEMS_PER_PAGE = 10;
  const MAX_KEYWORS_FROM_ABS =5

  const [counter, setCounter] = useState(0);

  const [counterInsert, setInsertCounter] = useState(0);

  const [entities, setEntities] = useState(['']);

  const [tooltip, setToolTip] = useState(['']);



  

  function readAndDeleteLastKeywordCombination(arr) {
    // console.log("End of Stack ?" + JSON.stringify(arr.length));

    if (arr.length === 0) {
      return (arr = []);
    }

    let buf = arr[arr.length - 1].query.pop();
    if (arr[arr.length - 1].query.length === 0) {
      arr.pop();
    }
    return buf;
  }



  function readKeywordCombination(arr, num) {
    // console.log("BRK 30 " + JSON.stringify(arr[num]));
    // console.log("BRK 31 "+arr[num].query[num].map(str=>str))
    var buf = [];
    buf = arr[num].query[num].map((str) => str);
    return buf;
  }

  function page_generator(TYPE) {
    switch (TYPE) {
      case 'ADDITIONAL_KEYWORD_LIST':
        setPage(0);
        return 0;

      case 'INSERT_LIST':
        setPage(0);
        return 0;

      case 'NEW_LIST':
        setPage(0);
        return 0;

      case 'MORE_DATA':
        setPage((page) => page + ITEMS_PER_PAGE);
        return page + ITEMS_PER_PAGE;
    }
  }
  function id_generator(TYPE, i, id) {
    switch (TYPE) {
      case 'ADDITIONAL_KEYWORD_LIST':
        //return id.slice(0, -1) + (i+1);
        //console.log("id generator "+id + '.' + i)
        //console.log("id "+id)
        return id + '.' + i;

      case 'INSERT_LIST':
        //setPage(page => (page+1));
        //console.log("INSERT_LIST " + page)

        // setCounter(counter => (counter + 1));

        return id + '.' + i;
      case 'NEW_LIST':
        setCounter((counter) => counter + 1);
        return '' + i;
      case 'MORE_DATA':
        setCounter((counter) => counter + 1);
        //console.log("MORE DATA " + (counter+i))
        // setPage(page => (page+1));
        return '' + (counter + i); //(''+(counter+1));

      default:
        throw new Error();
    }
  }

  function id_generator2(TYPE) {
    switch (TYPE) {
      case 'ADDITIONAL_KEYWORD_LIST':
          
        return c2.current()+ '.' + c3.increment();

      case 'INSERT_LIST':
        //setPage(page => (page+1));
        //console.log("INSERT_LIST " + page)

        // setCounter(counter => (counter + 1));

        return c2.current() + '.' + c3.increment();
      case 'NEW_LIST':
        
        return c2.increment()
      case 'MORE_DATA':
        return c2.increment()

      default:
        throw new Error();
    }
  }
 
 
  const [kwords, setKwords] = useState([]);
  let prompt = "This is a test"
  const chatGPT2 = async () => {
    try {
      const response = await axios.post('http://localhost:8080/extractKeywords', { prompt });

      setKwords(response.data.keywords);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  
  
 


  
  function removeLineBreaks(obj) {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }
  
    const result = {};
  
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
  
        if (typeof value === 'string') {
          result[key] = value.replace(/\n/g, '');
        } else if (Array.isArray(value)) {
          result[key] = value.map(item => typeof item === 'string' ? item.replace(/\n/g, '') : item);
        } else {
          result[key] = removeLineBreaks(value);
        }
      }
    }
  
    return result;
  }

  
// regex to match the number in the format (xxx) xxx-xxx


  const chatGPT = (type,index) => {
   
    let text = type

    // Send a request to the server with the prompt
    axios({
      method: 'POST',
      url: 'http://localhost:8080/chat2',
     params: { q: text}
      
    }).then((res) => {
        // Update the response state with the server's response
        //setResponse(res.data);
       // console.log("BRK chatGPT", res.data)
       // document.getElementById(index).textContent = JSON.stringify(res.data.keywords);
       // setToolTip(res.data.keywords)
      console.log("BRK chatGPT1", res.data.keywords[0])
      
     
      
      })
      .catch((err) => {
        console.error(err);
      });
  };

  /*useEffect(() => {
    //console.log("BRK GET Entities")
    getEntitiesFromGPT();
  }, []); */


  const getEntitiesFromGPT = (text, index, id) => {

    //chatGPT (text,index);
    

 

    //encode percentage sign
    if (text != undefined) {
      text = replaceAll(text, '%', '%25');
    }

     //encode # sign
     if (text != undefined) {
      text = replaceAll(text, '#', '%23');
    }

  
    //let res_obj={};
         
    axios({
      method: 'POST',
      url: 'http://localhost:8080/ask2',
     params: { q: text}
      
    }).then((res) => {
        // Update the response state with the server's response
        //setResponse(res.data);
       // console.log("BRK chatGPT", res.data)
       // document.getElementById(index).textContent = JSON.stringify(res.data.keywords);
       // setToolTip(res.data.keywords)
      
       console.log("BRK entitiesFromChatGPT", res.data)
    
   

       let obj = res.data.keywords.map((spot, index) => ({
        spot,
        explanation: res.data.explanations[index],
        confidence: 1.0
      }));
    
   


  

   console.log("BRK ChatGPT 3", obj)


let arr = [...keywordsArrayFromSearchbar]



        




console.log("BRK CHATGPT 4", arr)
//delete abs keyword if covered by search keyword, rank keywords by confidence and return top keywords defined by  MAX_KEYWORS_FROM_ABS

let clear_entities = obj
   .reduce((acc, curr) => {
     const lowerCaseSpot = curr.spot.toLowerCase();
     const index = acc.findIndex(e => e.spot.toLowerCase() === lowerCaseSpot);
     if (index !== -1) {
         if (curr.confidence > acc[index].confidence) {
             acc[index] = curr;
         }
     } else {
         acc.push(curr);
     }
     return acc;
   }, [])
   .filter(e => !arr.some(s => s.toLowerCase() === e.spot.toLowerCase()))
   .sort((a, b) => b.confidence - a.confidence)
   .slice(0, MAX_KEYWORS_FROM_ABS)


   



   console.log("BRK CHATGPT 4", clear_entities)

  

   console.log("BRK CHATGPT 5", clear_entities.map(explanation => explanation.explanation))

    arr = clearEntities(clear_entities.map(spot => spot.spot), keywords)


      let searchWordsString = generateSearchWordString(arr, keywords);
      console.log('searchWordsString ' + searchWordsString);

      /* pvh getData((index + 1), id, 'INSERT_LIST', searchWordsString, arr); */

      let combo = combinationOfKeywords(arr);

       combo.map(({ queryAND, queryNOT }, i) => (
     
        getData(
          index,
          c3.increment(),//moreCalls.id,
          'ADDITIONAL_KEYWORD_LIST',
          generateSearchWordString(queryAND, queryNOT, arrayToQueryStringWithAND(keywordsArrayFromSearchbar)),
          keywordsArrayFromSearchbar,
          queryAND,
          clear_entities.map(explanation => explanation.explanation),false
          )
        )
      ); 

      })
      .catch((err) => {
        console.error(err);
      });
          
     

     //console.log("BRK ARRAY", keywordArray)
     // let combo = combinationOfKeywords(keywordArray);

    /*  combo.map(({ queryAND, queryNOT }, i) => (
    
       getData(
         index,
         c3.increment(),//moreCalls.id,
         'ADDITIONAL_KEYWORD_LIST',
         generateSearchWordString(queryAND, queryNOT, arrayToQueryStringWithAND(keywordsArrayFromSearchbar)),
         keywordsArrayFromSearchbar,
         queryAND
         
         )
       ))*/
      
  };


   useEffect(() => {
    //console.log("BRK GET Entities")
    getEntities();
  }, []);

  const getEntities = (text, index, id) => {

    
  

    let arr = [];

    //encode percentage sign
    if (text != undefined) {
      text = replaceAll(text, '%', '%25');
    }

     //encode # sign
     if (text != undefined) {
      text = replaceAll(text, '#', '%23');
    }

  
   const searchURL = `https://api.dandelion.eu/datatxt/nex/v1/?%2Cabstract%2Ctypes%2Ccategories%2Clod&top_entities=5&min_confidence=0.6&text=${text}&country=-1&token=f65a2644720e43bb8e8b567abd29dc7e`;

    //console.log("getEntities " + searchURL)
 axios({
      method: 'GET',
      url: searchURL,
    }).then((res) => {
      //console.log("Clean ENtities "+(res.data.annotations.map(b => b.spot)+" "+keywords))
      //console.log("BRK "+res.data.topEntities.map((b) => (b.uri.split("/").pop())))
    // console.log("BRK 1 ", res.data.annotations)
      let obj =res.data.annotations.map(({spot, confidence}) => ({
        spot,
        confidence
           }

/*/
     axios({
            method: 'GET',
            url: 'http://localhost:8080/keywords',
           // params: { q: text+'&top_entities=8&min_confidence=0.8&country=-1&token='},
           params: { q: text}
            
          }).then((res) => {
          
            
    
              console.log("DEBUG 5 ", res.data.keywords_and_keyphrases)

                 //replace # by %23
   let obj=res.data.keywords_and_keyphrases.map((spot) => (
    {
        spot,
      confidence: 1.0
      }  */

   )
  );
            
            
           /*   let obj =res.data.keywords_and_keyphrases.map(({spot}) => (
                
                {
              
                spot,
                confidence: 1.0
                   }))*/
    
    
     
                   
         

           
  

let arr = [...keywordsArrayFromSearchbar]

//delete abs keyword if covered by search keyword, rank keywords by confidence and return top keywords defined by  MAX_KEYWORS_FROM_ABS


let clear_entities = obj
   .reduce((acc, curr) => {
     const lowerCaseSpot = curr.spot.toLowerCase();
     const index = acc.findIndex(e => e.spot.toLowerCase() === lowerCaseSpot);
     if (index !== -1) {
         if (curr.confidence > acc[index].confidence) {
             acc[index] = curr;
         }
     } else {
         acc.push(curr);
     }
     return acc;
   }, [])
   .filter(e => !arr.some(s => s.toLowerCase() === e.spot.toLowerCase()))
   .sort((a, b) => b.confidence - a.confidence)
   .slice(0, MAX_KEYWORS_FROM_ABS)

   console.log("BRK getEntities 2 ", clear_entities)

    arr = clearEntities(clear_entities.map(spot => spot.spot), keywords)


      let searchWordsString = generateSearchWordString(arr, keywords);
      console.log('searchWordsString ' + searchWordsString);

      /* pvh getData((index + 1), id, 'INSERT_LIST', searchWordsString, arr); */

      let combo = combinationOfKeywords(arr);

       combo.map(({ queryAND, queryNOT }, i) => (
     
        /*getData2(
          index,
          c3.increment(),//moreCalls.id,
          'ADDITIONAL_KEYWORD_LIST',
          generateSearchWordString(queryAND, queryNOT, arrayToQueryStringWithAND(keywordsArrayFromSearchbar)),
          keywordsArrayFromSearchbar,
          queryAND,

          
          )*/
        getData(
          index,
          c3.increment(),//moreCalls.id,
          'ADDITIONAL_KEYWORD_LIST',
          generateSearchWordString(queryAND, queryNOT, arrayToQueryStringWithANDforCore(keywordsArrayFromSearchbar)),
          keywordsArrayFromSearchbar,
          queryAND,
          ['info']          
          )
        )
      ); 
        

    });
  };

  useEffect(() => {

    getData();
  }, []);

/*  useEffect(() => {
    //console.log("BRK GET DATA")
    getData2();
  }, []);*/

  function keysToString(jsonObject) {
    return Object.keys(jsonObject).join(' ');
}


function decodeInvertedIndex(index) {
  // Initialize an array to hold the words
  let words = [];

  // Iterate over each word in the index
  for (let word in index) {
      // Iterate over each position for the word
      for (let position of index[word]) {
          // Place the word in its corresponding position
          words[position] = word;
      }
  }

  // Join the words into a single string with spaces in between
  return words.join(' ');
}

  const getData2 = (index, id, TYPE, searchquery,keywordsFromSearchbar, keywordsFromAbs, explanationsOfKeywords) => {
       setInitialPage(false);
  
     if (initialPage) return;
     if (!hasNextPage) return;
    //if (keywords === '') return;
    let p = page_generator(TYPE);
    //console.log("PAGE "+p+" "+page)
    let max_results = ITEMS_PER_PAGE;

    let number_results=max_results

if (TYPE === 'ADDITIONAL_KEYWORD_LIST')
number_results=10;


    searchquery="chatgpt"

    //const searchURL = `https://api.core.ac.uk/v3/search/works/?q=bit&limit=${ITEMS_PER_PAGE}&offset=${page}0&api_key=zJkcW2YTpr8uZShRM3ivm1AwF0Dj5C4E`
   // const searchURL = `https://export.arxiv.org/api/query?search_query=${searchquery}&start=${p}&max_results=${number_results}`;
    const searchURL = `https://api.openalex.org/works?search=${searchquery}&select=id,display_name,abstract_inverted_index,primary_location,concepts&filter=has_oa_accepted_or_published_version:true,has_abstract:true,concept.id:C39432304&page=${p+1}&per_page=${number_results}`;
    axios({
      method: 'GET',
      url: searchURL/*, headers: {
        Authorization: `Bearer ${process.env.REACT_APP_API_KEY}`,
      },*/
    })
      .then((res) => {
    

      
      
       
       const newList = res.data.results.map(results => {
              return {
                id_unique: uuidv4(), //id_generator2(TYPE),//uuidv4(),
                  title: results.display_name,
                  // Assuming description corresponds to 'abstract_inverted_index'
                  description: decodeInvertedIndex(results.abstract_inverted_index),
                  links: results.primary_location.landing_page_url,
                  searchwordsFromSearchbar: keywordsFromSearchbar,
                  searchwordsFromAbs: keywordsFromAbs,
                  explanationsOfKeywords: explanationsOfKeywords,
                  page: page + ITEMS_PER_PAGE,
                  hasMorePage: true,
                  selected: false,
                  api: searchURL,
                  type: TYPE,
                  
              };
          });
          
          console.log("BRK getData2 ",newList)
        
       if (TYPE === 'ADDITIONAL_KEYWORD_LIST') {    
          index=counterInsert
        }

        //console.log("BRK new List " + JSON.stringify(newList));
        
      
      // index=c1.current()
      let i= c1.current()
   
        if(newList.length>0){
       dispatchList({ type: TYPE, newList, index: c1.current() });
        c1.incrementWithOffset(newList.length-1)
        //console.log(" Has data "+index+" "+keywords)
        //console.log("Positiv searchURL", searchURL)
      }else{
        console.log(" No data "+index+" "+keywords)
     
       
        //if (TYPE === 'ADDITIONAL_KEYWORD_LIST')
       //console.log("Negativ searchURL", searchURL)
       // c1.incrementWithOffset(newList.length-1)
    
      }
      });
  };


  const getData = (index, id, TYPE, searchquery,keywordsFromSearchbar, keywordsFromAbs, explanationsOfKeywords, initialTeaser) => {
    //console.log("BRK 2 getData ",index, id, TYPE, searchquery,keywordsFromSearchbar, keywordsFromAbs, explanationsOfKeywords)
   
    setInitialPage(false);
  
   if (initialPage) return;
   if (!hasNextPage) return;


    //if (keywords === '') return;
    let p = page_generator(TYPE);
    //console.log("PAGE "+p+" "+page)

    let number_results=ITEMS_PER_PAGE

if (TYPE === 'ADDITIONAL_KEYWORD_LIST')
number_results=10;


    const focusSustainbility=''// '(all:%20"climate%20change"%20+OR+all:"cimate%20change"+OR+all:sustainbility)+AND+'

    // const searchURL = `https://api.core.ac.uk/v3/search/works/?q=${searchquery}&limit=${ITEMS_PER_PAGE}&offset=${page}&api_key=zJkcW2YTpr8uZShRM3ivm1AwF0Dj5C4E`
    const searchURL = `https://export.arxiv.org/api/query?search_query=${searchquery}&start=${p}&max_results=${number_results}`;
    console.log("BRK getData ",searchquery)

    axios({
      method: 'GET',
      mode: 'cors',
      
      //url: 'http://localhost:3000/arxive',
     url: 'https://heroku-server3-b7bab417195a.herokuapp.com/arxive',
     params: { q: searchquery, p: p, r: number_results}
      
    }).then((res) => {


 console.log("BRK 99", res)
    
      
       

        const newList = res.data.items.map(
          ({ title, description, links }, i) => ({
            id_unique: uuidv4(), //id_generator2(TYPE),//uuidv4(),
            title: title,
            description: description,
            links: links[1].url,
            searchwordsFromSearchbar: keywordsFromSearchbar,
            searchwordsFromAbs: keywordsFromAbs,
            explanationsOfKeywords: explanationsOfKeywords,
            page: page + ITEMS_PER_PAGE,
            hasMorePage: true,
            selected: false,
            api: searchURL,
            type: TYPE,
           
          })
        );



   /* core.ac.uk
        .then((res) => {
      
          console.log("BRK getData ",searchURL)
         console.log("BRK getData ",res.data.results)
         
  
          const newList = res.data.results.map(
            ({ title, abstract, links }, i) => ({
              id_unique: uuidv4(), //id_generator2(TYPE),//uuidv4(),
              title: title,
              description:  abstract,
              links: links[1].url,
              searchwordsFromSearchbar: keywordsFromSearchbar,
              searchwordsFromAbs: keywordsFromAbs,
              explanationsOfKeywords: explanationsOfKeywords,
              page: page + ITEMS_PER_PAGE,
              hasMorePage: true,
              selected: false,
              api: searchURL,
              type: TYPE,
             
            })
          );*/
        
     /*   if (TYPE === 'ADDITIONAL_KEYWORD_LIST') {    
          index=counterInsert
        }*/

        //console.log("BRK new List " + JSON.stringify(newList));
        
      
      // index=c1.current()
      let i= c1.current()
   
        if(newList.length>0){
       dispatchList({ type: TYPE, newList, index: c1.current() });
        c1.incrementWithOffset(newList.length-1)
        //console.log(" New data "+index+" "+keywords)
        console.log("NEW DATA", TYPE, index, c1.current())
        //console.log("Positiv searchURL", searchURL)
      }else{
        console.log(" No data "+i+" "+keywordsFromAbs)
     
       
        //if (TYPE === 'ADDITIONAL_KEYWORD_LIST')
       //console.log("Negativ searchURL", searchURL)
       // c1.incrementWithOffset(newList.length-1)
    
      }
      });
  };




  const loadMoreData = () => {
    console.log('loadMoreData ' + counter + 'MORE_DATA');
    //if (page > 1) {
   // getData(0, 0, 'MORE_DATA', keywords);
   //getData2(0, 0, 'MORE_DATA', arrayToQueryStringWithAND(keywordsArrayFromSearchbar), keywordsArrayFromSearchbar, [], []);
   
   getData(0, 0, 'MORE_DATA', arrayToQueryStringWithAND(keywordsArrayFromSearchbar), keywordsArrayFromSearchbar, [], [], false);
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
    //setUpdated(message)
     
   //setKeywords(message);

 
    window.scrollTo(0, 0)


   const keywordsFromSearchbar =  searchbarStr2arrayWithKeywords(message)
     setKeywordsArrayFromSearchbar(keywordsFromSearchbar)
  //    console.log("TEST 1 ",searchbarStr2arrayWithKeywords(message) )
      //getData2(0, 0, 'NEW_LIST', arrayToQueryStringWithAND(keywordsFromSearchbar), keywordsFromSearchbar, []);
      getData(0, 0, 'NEW_LIST', arrayToQueryStringWithAND(keywordsFromSearchbar), keywordsFromSearchbar, [], []);

    }
  };

  //Material Bug https://github.com/mui/material-ui/issues/16844#issuecomment-517205129

  return (

    <Grid container >

  
      <Grid container>
        <AppBar component="nav" position="fixed">
          <Toolbar>
            <Grid item xs={2}>
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{
                  flexGrow: 1,
                  display: { xs: 'none', sm: 'block' },
                }}
              >
                flowolf
              </Typography>
            </Grid>
            <Grid item xs={7}>
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
            <Grid item xs={3}>
            <CardActions>
              <button
                
                  onClick={() =>
                    setShowTimer(prevShowTimer => !prevShowTimer)
                  }
                >
                  {'Toggle: Under the hood'}
                </button>



    
                </CardActions>
            </Grid>
          </Toolbar>
        </AppBar>
        <Toolbar />
      </Grid>
          

      {list.map((item, i) => (
        <Grid key={item.id_unique} container    >
          <Grid key={item} item xs={2}></Grid>
          <Grid item xs={7}>
        
            <Card sx={{ maxWidth: 600 }} key={item.id_unique}>
       
      
              <CardContent key={item.id_unique}>
              
        
                <Typography gutterBottom variant="h5" component="div">
          
                
                <a key={item.id_unique} href={item.links} target="_blank" rel="noreferrer noopener">{item.title} </a>     
        
          </Typography>
       
          <Typography variant="body2" color="text.secondary">
          {item.description}
          </Typography>
            



              </CardContent>
              {showTimer && 
              <CardActions>
              <button
                  id={item.id_unique}
                  onClick={() =>
                    handleChange2(i, item.id_unique, item.title) //+' '+item.description)
                  }
                >
                  {'Interesting paper. Add similar papers below.'}
                </button>
                </CardActions>
                 }
           
                
       
            </Card>
            
            <OnScreenTimer   handleCallback={handleParentFun}
         text={item.title} id={item.id_unique} index={i} showTimer={showTimer}> 
      </OnScreenTimer>
      
    
          </Grid>
          {showTimer &&
          <Grid item xs={3}>
        
           Your Keyword 
       
            {item.searchwordsFromSearchbar.map((type, index) => {
                return   <CardActions key={index}>
                <Chip
    key={index} label={type}
    
   />
                 </CardActions>
                
                
               
              })}
              
          
 
           Additional Keywords 

          
              {item.searchwordsFromAbs.map((type, index) => {


                return  <Tooltip  key={index} value={type} id={type} title={"info"}>
                   <CardActions>
                   <Chip
        label={type}
    
      />
                    </CardActions>
              
              </Tooltip>
                })}
              


  
            
          </Grid>
}
        </Grid>
      ))}
  <Waypoint onEnter={loadMoreData}>
                            <h5 className="text-muted mt-5">
                        </h5>
                        </Waypoint>
    </Grid>
  );
};

export default App;
