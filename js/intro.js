/*****************************************/
/*      Traditional Synchronous Loops    */
/*****************************************/
// console.groupCollapsed('Fruits Group');
// const fruits = ['Apple', 'Blackberry', 'Orange'];
// fruits.forEach((fruit) => {
  // console.log(fruit);
// });
// console.log('After fruits');
// console.groupEnd();


/*****************************************/
/*           jQuery Async $.get          */
/*      Comparable to XMLHttpRequest     */
/*****************************************/
// $.get('https://raw.githubusercontent.com/yuschick/31-Nights-of-Horror-2016/master/movies.json', (response) => {
//   console.log(JSON.parse(response));
// });
// console.log('This will run before the $.get()');


/*****************************************/
/*          jQuery Async $.ajax          */
/*     Callback Hell - Arrow of Death    */
/*****************************************/
// function handleError(error) {
//   console.log(error);
// }
// $.ajax({
//   type: 'GET',
//   url: 'https://raw.githubusercontent.com/yuschick/31-Nights-of-Horror-2016/master/movies.json',
//   success(response) {
//     console.log(JSON.parse(response));
//
//     // running a second ajax request only after previous request has completed
//     $.ajax({
//       type: 'GET',
//       url: 'data/music.json',
//       success(response) {
//         console.log(response);
//
//         // third request goes after both others have finished
//         $.ajax({
//           type: 'GET',
//           url: 'data/albums.json',
//           success(response) {
//             console.log(response);
//           },
//           error: handleError(error);
//         });
//       },
//       error(jqXHR, testStatus, error) {
//         console.log(error);
//       }
//     });
//   },
//   error(jqXHR, testStatus, error) {
//     console.log(error);
//   }
// });


/*****************************************/
/*           Promise Chaining            */
/*         with XMLHttpRequests          */
/*****************************************/
// function get(url) {
//   // Promise object, function with two parameters resolve/reject
//   return new Promise((resolve, reject) => {
//     const http = new XMLHttpRequest();
//     http.open('GET', url, true);
//     http.onload = function() { // similar to http.readyState === 4
//       if (http.status === 200) {
//         resolve(JSON.parse(http.response));
//       } else {
//         reject(http.statusText);
//       }
//     };
//     http.onerror = function() {
//       reject(http.statusText);
//     };
//     http.send();
//   });
// }
//
// const music = get('data/music.json');
// // console.log(music);
//
// // multiple thens to chain promises.  just need one catch.
// music.then((bands) => {
//   console.log('bands: ', bands);
//   return get('data/albums.json');
//
// }).then((albums) => {
//   console.log('albums: ', albums);
//   return get('data/dogs.json');
//
// }).then((dogs) => {
//   console.log('dogs: ', dogs);
// }).catch((error) => {
//   console.log(error);
// });


/*****************************************/
/*           Promise Chaining            */
/*              with jQuery              */
/*****************************************/
// $.get('data/music.json').then((bands) => {
//   console.log('bands: ', bands);
//   return $.get('data/albums.json');
// }).then((albums) => {
//   console.log('albums: ', albums);
//   return $.get('data/dogs.json');
// }).then((dogs) => {
//   console.log('dogs', dogs);
// }).catch((error) => {
//   console.log(error);
// });

$.ajax({
  type: 'GET',
  url: 'data/music.json'
}).then((bands) => {
  console.log('bands: ', bands);

  return $.ajax({
    type: 'GET',
    url: 'data/albums.json'
  });

}).then((albums) => {
  console.log('albums: ', albums);
}).catch((error) => {
  console.log(error);
});
