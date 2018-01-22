# Need to do 3 things:

1. [ ] Use a `geojson-vt` solution in browser
2. [x] Send PBF from server instead of GeoJSON
3. [ ] In-browser masking of target_areas (`local_areas` and arbitrary) from the `Clusters` collection --> `LocalClusters` (or similar)


This works:
```
import geobuf from "geobuf";
import Pbf from "pbf";

const url = "http://localhost:3000/sample_pbf"
const options = {
  method: "GET",
  mode: "cors"
}

fetch(url, options).then((response) => {

  if (!response.ok) {
    return console.log('error')
  }

  return response.blob().then(blob => {
    var reader = new FileReader()
    return new Promise(resolve => {
      reader.addEventListener("loadend", () => {
        var pbf = new Pbf( reader.result )
        return resolve(geobuf.decode(pbf))
      })
      reader.readAsArrayBuffer(blob)
    })
  })
}).then(json => {
  console.log(json)
})
```
