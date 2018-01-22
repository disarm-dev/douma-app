# Foci Applet

## Pages
- First run page
- Foci Register
	- Map
	- Summary table
	- List (All foci)
- Individual foci
	- Investigation Map page
	- Investigation Editing page 
- Settings page

## Store
- Focis
- Stack of focis that have new suggested boundaries



## Components

### Map showing multiple foci

**page**: Foci Register Map

**props**:
- focis - FeatureCollection of foci

Each foci will be colored according to its status. Clicking a foci sends the user to the foci investigation page.


### List/table with ability to sort each column

**page**: Foci Register List

This list/table must be able to do virtual scrolling and have sorting functionality.

Might be easier to look for a prebuilt component for this than building it. 

- [Vue-tables-2](https://github.com/matfish2/vue-tables-2)
- [Vuetable-2](https://github.com/ratiw/vuetable-2)
- [Vue-smart-table](https://www.npmjs.com/package/vue-smart-table)


### Simple table with numeric values

**page**: Foci Register Summary Table

Needs to display some values and percentages. With a toggle to switch between the two. This should probably be the front page for the applet. 


### Map for single foci

**page**: Investigation page

**props**:
- foci_boundary - A polygon 
- proposed_foci_boundary - A polygon
- structures - A FeatureCollection of centroids  

Must show the foci at a given point in time. The map should be dumb, only receive a polygon and some centroids and render them.

It will receive two different types of polygons, one for the current boundary. The second is an optional proposed new boundary. This will be drawn with a dotted line instead of a solid line. 



### Timeline slider

**page**: Investigation page

A slider component showing the number of cases in foci. It should receive a date interval with a number for each date as a props. It should emit a 'on change' event the parent view can respond to.


### Foci info box

**page**: Investigation page

**props**:
- foci - A foci with properties

It will show the foci id, the status, number of cases.

It has two buttons for switching between foci, and an edit button that sends the user to the editing page.


### Foci editing map

**page**: Editing page

**props**:
- foci

A map with polygon editing tools. This map also needs to be able to calculate a new boundary if a driver of risk is added to the map. 

### Settings page

Controls and toggles for adjusting the parameters for the foci clusterer.


### First run page

Responsible for creating the first batch of foci. Prompt the user for the settings for the foci clusterer.