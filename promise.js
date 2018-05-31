/*
  Promise guide.
*/


/*
  Before promises were invented we would use callback functions in javascript
  to run asynchronus methods. Asynchronus means code that does not execute
  right away because it would stall your program if it had to
  wait on the code to run (accessing the internet, accessing a file). Javascript
  is single threaded so if you didn't have asynchronus code it your code was
  stalling (called blocking) you wouldn't be able to do anything on the ui
  (press buttons, etc) until the code that takes a long time to run was completed.

  Below I'm going to show you how you would run a bunch of asynchronus methods
  before promises were around and you'll see why they made them. It's called
  callback hell.
*/

/*
  Below is how I would write and run a single asynchronus method (method that runs a
  callback method when it is completed)
*/
function normalAsyncFunction(callThisFunctionWhenImDone) {
  //Do something that takes a while
  setTimeout(function() {
    console.log("It's been 1 second.");
    //Call my callback function to continue with whatever I was doing.
    callThisFunctionWhenImDone();
  }, 1000);
}
//Run my normal asynchronus method
normalAsyncFunction(function() {
    //This is executed after normalFunction has completed running.
    console.log('Doing something else here.')
})


/*
  Okay now imagine i had 4 async functions I needed to run back to back, one after
  another.
*/
function funcOne(callbackFunc) {
  setTimeout(function() {
    console.log('Done with 1.')
    callbackFunc();
  }, 1000);
}
function funcTwo(callbackFunc) {
  setTimeout(function() {
    console.log('Done with 2.')
    callbackFunc();
  }, 1000);
}
function funcThree(callbackFunc) {
  setTimeout(function() {
    console.log('Done with 3.')
    callbackFunc();
  }, 1000);
}
function funcFour(callbackFunc) {
  setTimeout(function() {
    console.log('Done with 4.')
    callbackFunc();
  }, 1000);
}

//Run all 4 functions one after another, waiting for each to complete before running the next.
funcOne(function() {
  funcTwo(function() {
    funcThree(function() {
      funcFour(function() {
        console.log('All done running all 4 functions one after another.')
      });
    })
  })
})
/*
  As you can see it becomes a endless nesting mess. So it's hard to code because
  you keep getting indented more and more over so it's hard to keep track of.
  That is why they made promises. A promise is a object in javascript that represents
  the eventual completation or failure of a asynchronus function. Below I will write the
  same 1 second timeout code returning a promise.
*/

function promiseFunction() {
  //Return the new promise I have created.
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      console.log("It's been 1 second.");
      resolve(); //Resolve is called when we are finished, reject would be called if there was an error.
    }, 1000);
  })
}

//Now I can use promise.then() to wait until after the promise is resolved
promiseFunction().then(function() {
  //This is executed after promiseFunction has completed running.
  console.log('Doing something else here.')
});


/*
  Okay now I am going to do the same 4 asynchronus functions ran back to back like above
  but written as promises so you can see the difference.
*/
function funcOnePromise() {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      console.log('Done with 1.')
      resolve();
    }, 1000);
  });
}
function funcTwoPromise() {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      console.log('Done with 2.')
      resolve();
    }, 1000);
  });
}
function funcThreePromise() {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      console.log('Done with 3.')
      resolve();
    }, 1000);
  });
}
function funcFourPromise() {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      console.log('Done with 4.')
      resolve();
    }, 1000);
  });
}

//Run all 4 functions one after another, waiting for each to complete before running the next.
funcOnePromise().then(function() {
  return funcTwoPromise(); //Must return it so we are returning the promise funcTwoPromise is making so we can do .then() again
}).then(function() {
  return funcThreePromise();
}).then(function() {
  return funcFourPromise();
});
/*
  As you can see there is no longer endless nesting.
  Next I'll show you how to catch an error from a promise or promise chain.
*/

//This would catch an error if any of the promise function called reject() instead of resolve()
funcOnePromise().then(function() {
  return funcTwoPromise(); //Must return it so we are returning the promise funcTwoPromise is making so we can do .then() again
}).then(function() {
  return funcThreePromise();
}).then(function() {
  return funcFourPromise();
}).catch(function() {
  console.log('One of the functions called reject()')
});
/*In the above example, if funcOnePromise called reject() none of the other functions would run. If function funcTwoPromise
 called reject() funcThreePromise and funcFourPromise would not run.

 You can also check for errors and continue within the promise chain, see below
*/
funcOnePromise().then(function() {
  return funcTwoPromise(); //Must return it so we are returning the promise funcTwoPromise is making so we can do .then() again
}).then(function() {
  return funcThreePromise();
}).catch(function() {
  console.log('Function 1, 2, or 3 called reject()')
}).then(function() {
  return funcFourPromise();
}).catch(function() {
  console.log('Function 4 called reject()')
});
/*
  In the above example if function 1, 2, or 3 called reject() the first catch function would run, then funcFourPromise would be ran.
*/



/*
   You can return values from promises as well. You just put whatever you would like to return inside the resolve() call.
*/
function aPromiseTheResolvesToAValue() {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      resolve("This is something I am returning");
    }, 1000);
  });
}
aPromiseTheResolvesToAValue().then(function(myValue) {
  console.log('aPromiseTheResolvesToAValue returned:', myValue);
});

/*
  Normally you don't have to use new Promise() because the libraries you use will return the promise for you so don't need to create
  one.
*/
knex.select().from('inventory').then((rows) => {
  //Checking array
  if (rows.length === 0) {
    //Returning false
    return false; //Since you are inside a .then() this is basically the same as doing resolve(false)
  } else {
    //Returning true
    return true; //Since you are inside a .then() this is basically the same as doing resolve(true)
  }
});

/*
  But if I had the above code inside a normal function and didn't return the promise
  then there would be no way to wait for it to complete and get the result of resolve().
*/
function myFunc() {
  knex.select().from('inventory').then((rows) => {
    //Checking array
    if (rows.length === 0) {
      //Returning false
      return false;
    } else {
      //Returning true
      return true;
    }
  });
}
//I can't call .then() because myFunc doesn't return a promise so there is no way to get my false/true result.
var result = myFunc(); //Result will be undefined because myFunc does not return anything.

//So I have to return the promise like below
function myFuncReturnsPromise() {
  return knex.select().from('inventory').then((rows) => {
    //Checking array
    if (rows.length === 0) {
      //Returning false
      return false;
    } else {
      //Returning true
      return true;
    }
  });
}
myFuncReturnsPromise().then((result) => {
  //Now I can go on with my code inside here.
  if (result == true) {
    console.log('This is rows in the database');
  } else {
    console.log('There are no rows in the database.')
  }
});
