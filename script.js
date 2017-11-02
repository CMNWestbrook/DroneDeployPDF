// var $ = document.querySelector.bind(document);
// new DroneDeploy({ version: 1 }).then(function(dronedeploy){
//   function getPlanGeometry(){
//     return dronedeploy.Plans.getCurrentlyViewed()
//       .then(function(plan){
//         return plan.geometry
//       })
//   }

//   function putImageOverGeometry(geometry){
//     dronedeploy.Map.addImageOverlay(
//       "https://pbs.twimg.com/profile_images/740441209265606656/eYeOjy5i.jpg",
//       geometry
//     ).subscribe(function(overlay){})
//   }


//   function getImage(geometry){
//     dronedeployApi.Tiles.get({planId, layerName, zoom})
//   .subscribe(function(tileInformation){ console.log(template) });
//   }

//   $('#get-images').addEventListener('click', function(){
//     getPlanGeometry().then(getImage);
//   });

//   $('#image-overlay').addEventListener('click', function(){
//     getPlanGeometry().then(putImageOverGeometry);
//   });

//   $('#tile-layer').addEventListener('click', function(){
//     dronedeploy.Map.addTileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZGFuaWVscmFzbXVzb24yIiwiYSI6ImNpajM3anR2ODAwNGJ1eGtuNXFtbXhqMTMifQ.u3dqaFnALVDcqWyGu6Oq-w')
//       .subscribe()
//   });

//   $('#pan-map').addEventListener('click', function(){
//     getPlanGeometry().then(function(geometry){
//       dronedeploy.Map.panTo(geometry[0], {zoom: 18});
//     });
//   });

//   $('#red-polygon').addEventListener('click', function(){
//     getPlanGeometry().then(function(geometry){
//       dronedeploy.Map.addPolygon(geometry, {color: 'red', fillColor: 'red'}).subscribe();
//     });
//   });

// });


function getTilesFromGeometry(geometry, template, zoom){
  function long2tile(lon,zoom) {
    return (Math.floor((lon+180)/360*Math.pow(2,zoom)));
  }

  function long2tile(lon,zoom) {
    return (Math.floor((lon+180)/360*Math.pow(2,zoom)));
  }
  function lat2tile(lat,zoom) {
    return (Math.floor((1-Math.log(Math.tan(lat*Math.PI/180) + 1/Math.cos(lat*Math.PI/180))/Math.PI)/2 *Math.pow(2,zoom)));
  }
  function replaceInTemplate(point){
    return template.replace('{z}', point.z)
      .replace('{x}', point.x)
      .replace('{y}', point.y);
  }

  var allLat = geometry.map(function(point){
    return point.lat;
  });
  var allLng = geometry.map(function(point){
    return point.lng;
  });
  var minLat = Math.min.apply(null, allLat);
  var maxLat = Math.max.apply(null, allLat);
  var minLng = Math.min.apply(null, allLng);
  var maxLng = Math.max.apply(null, allLng);
  var top_tile    = lat2tile(maxLat, zoom); // eg.lat2tile(34.422, 9);
  var left_tile   = long2tile(minLng, zoom);
  var bottom_tile = lat2tile(minLat, zoom);
  var right_tile  = long2tile(maxLng, zoom);

  var tiles = [];
  for (var y = top_tile; y < bottom_tile + 1; y++) {
    for (var x = left_tile; x < right_tile + 1; x++) {
      // tiles.push(replaceInTemplate({x, y, z: zoom}))
      tiles.push(replaceInTemplate({x, y, z: zoom}))
    }
  }

  return tiles;
}

var tileList = document.querySelector('#tile-list');
new DroneDeploy({version: 1}).then(function(dronedeploy){
  dronedeploy.Plans.getCurrentlyViewed().then(function(plan){
    var zoom = 20
    dronedeploy.Tiles.get({planId: plan.id, layerName: 'ortho', zoom: zoom})
      .then(function(res){
        const tiles = getTilesFromGeometry(plan.geometry, res.template, zoom);
        // changing this:
        tileList.innerHTML = tiles.slice(0, 10).map((tileUrl) => {
          // regexYz = /https\:\/\/public\-tiles\.dronedeploy\.com\/d8cbeae7e6\_WESTBROOKOPENPIPELINE\_ortho\_uwj\/20\/([\d-]{6})\/([\d-]{6})\.png\?Policy\=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wdWJsaWMtdGlsZXMuZHJvbmVkZXBsb3kuY29tL2Q4Y2JlYWU3ZTZfV0VTVEJST09LT1BFTlBJUEVMSU5FX29ydGhvX3V3ai8qIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoyMTQ1OTEzNDk5fX19XX0\_\&Signature\=TWFNWjo\-RlJjRCqB\-vlf113yb4sAYEaxe8fC3j1mDwG67cb71X5P8hTVOQ627xzk7FWAzXyca1FoKpvvPV5Ew5sJX5QBAx72rvgNqjLqeHDrCPoZaVABhqedLKf5hrjMAOvIcZ06cFzexZ\-Y0bfddTx5TO8gz3kqW2aYsTS3VIdUypCcQfORjFVEaSjCLSgsHCIEi91Ti8U\-g7iowebrMoLtveoZF3sUy1ULUbWMXnzNuOhjAjF8phf9D8W4de9X4p8HE3JwsQl0R0Y4Ez\~jd9xwK4g4qhbw4UmEuPdbTXKs2Wkd5\~Ou\~KGZN0ZXsKqzb8MlpJvSoTOgx3yJdBT84Q\_\_\&Key\-Pair\-Id\=APKAJXGC45PGQXCMCXSA/;
          regexYz = /https\:\/\/public\-tiles\.dronedeploy\.com\/d8cbeae7e6\_WESTBROOKOPENPIPELINE\_ortho\_uwj\/20\/([\d-]{6})\/([\d-]{6})/;

          // url = 'https://public-tiles.dronedeploy.com/d8cbeae7e6_WESTBROOKOPENPIPELINE_ortho_uwj/20/242484/412020.png?Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wdWJsaWMtdGlsZXMuZHJvbmVkZXBsb3kuY29tL2Q4Y2JlYWU3ZTZfV0VTVEJST09LT1BFTlBJUEVMSU5FX29ydGhvX3V3ai8qIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoyMTQ1OTEzNDk5fX19XX0_&Signature=TWFNWjo-RlJjRCqB-vlf113yb4sAYEaxe8fC3j1mDwG67cb71X5P8hTVOQ627xzk7FWAzXyca1FoKpvvPV5Ew5sJX5QBAx72rvgNqjLqeHDrCPoZaVABhqedLKf5hrjMAOvIcZ06cFzexZ-Y0bfddTx5TO8gz3kqW2aYsTS3VIdUypCcQfORjFVEaSjCLSgsHCIEi91Ti8U-g7iowebrMoLtveoZF3sUy1ULUbWMXnzNuOhjAjF8phf9D8W4de9X4p8HE3JwsQl0R0Y4Ez~jd9xwK4g4qhbw4UmEuPdbTXKs2Wkd5~Ou~KGZN0ZXsKqzb8MlpJvSoTOgx3yJdBT84Q__&Key-Pair-Id=APKAJXGC45PGQXCMCXSA'; // on js page
          url = "'" + tileUrl + "'"
          xCoord = url.match(regexYz)[1];
          yCoord = url.match(regexYz)[2];

          return " '" + [xCoord, yCoord] + "' "

        // tileList.innerHTML = tiles.map((tileUrl) => {
          //changing this:
          // return '<div style="display: flex; flex: 25;"><img src="'+tileUrl+'"></img></div>'
          // return '<div><img src="'+tileUrl+'"></img></div>'
          // return tileUrl
          // return plan.geometry
          // return tiles
          
        }).join('')

      });
  });
});

//plans have tiles?


// new DroneDeploy({version: 1}).then(function(dronedeploy){
//   dronedeploy.Plans.getCurrentlyViewed().then(function(plan){
//     document.querySelector('#plan-area').innerHTML = geodesicArea(plan.geometry)+' meters<sup>2</sup>';
//   });
// });


// console.log(getCurrentlyViewed)






// const planId = String;
// const layerName = 'ortho' || 'dem';
// const zoom = Number; // Common zoom levels are [16, 17, 18, 19, 20, 21]

// dronedeployApi.Tiles.get({planId, layerName, zoom})
//   .then(function(tileInformation){ console.log(tileInformation) });
  
// console.log (tileInformation)

