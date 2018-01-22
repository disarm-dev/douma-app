# Notes on how to update data in the map

1. Click entity on map => setActiveEntity in $store
2. Select entity from list => setActiveEntity in $store
3. Watch activeEntity from map, onchange => find geojson layer (layerId), re-render
4. On view form => clone activeEntity
5. On form submit => updateActiveEntity (list reactive, map will re-render)
