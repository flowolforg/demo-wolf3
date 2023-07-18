//arrays//
// var name = ["rakesh", "mohit", "john", "joy"];
// document.write("<ul>");
// for (var a = 0; a < 4; a++) {
//   document.write("<li>" + name[a] + "</li>");
// }
// document.write("<ul>");
//var names = ["Hund", "Katze", "Maus", "Käse", "Bakterien"];



function packObj(arr1, n) {
    var Obj = {
      query: [],
      num: 0
    };
  
    for (let i = 0; i < arr1.length; i++) {
      Obj.query.push(arr1[i]);
    }
  
   
  
  
    Obj.num = n;
    return Obj;
  }
  
  function flatten(arr) {
    let flatArray = [].concat(...arr);
    return flatArray;
  }
  
  
  
  export default function combinationOfKeywords(arr) {
    var array2 = [];
    var inner_box = [];
  
    var outer_box = [];
  
    var initial_obj = arr.length - 1;
  
    //INIT
  
    for (let k = 0; k < initial_obj + 1; ++k) {
      inner_box.push([arr[k]]);
    }
    //First line
    array2.push(packObj(inner_box, arr.length));
  
    //INIT Stepper
  
    var steps = [];
    var arr_steps = [];
    for (let m = initial_obj; m > 0; m--) {
      steps.push(m);
    }
    arr_steps.push(steps);
    steps = [];
    let counter = 0;
    for (let k = 0; k < initial_obj - 2; ++k) {
      for (let n = 0; n < initial_obj - 2 - k; ++n) {
        for (let m = 1 + n; m < initial_obj - k; ++m) {
          counter += arr_steps[k][m];
        }
        steps.push(counter);
        if (n === arr_steps[k].length - 3) counter = 1;
        else counter = 0;
      }
      steps.push(counter);
      arr_steps.push(steps);
      steps = [];
      counter = 0;
    }
    arr_steps.push([1]);
  
    inner_box = [];
    var count = 0;
    for (let n = 0; n < initial_obj; ++n) {
      for (let k = 0; k < initial_obj; ++k) {
        for (let i = 0; i < arr_steps[n][k]; ++i) {
  
          inner_box.push(array2[0].query[0 + k]);
          inner_box.push(array2[n].query[array2[n].num - i - 1]);
          inner_box = flatten(inner_box);
          ++count;
          outer_box.push(inner_box);
          inner_box = [];
        }
      }
      array2.push(packObj(outer_box, count));
      count = 0;
      outer_box = [];
    
    }
  
    return array2;
  }
  
  