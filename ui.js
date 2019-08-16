var selected_burg;


/*
Name: zoom in burg.
Summary: zooms in to x and y location.


@since 16-8-2019.
@deprecated.
@see zoomTo() for use how zoom works.

@param {int} x  x cordinats of burg.
@param {int} y  y cordinats of burg.

@return {object} burgs all the burgs that are selected.
*/
function zoom_in_burg(x, y){
    
    if(!x & !y){
      if(!selected_burg) return;
        x = selected_burg.x;
        y = selected_burg.y;
    }

    if (x && y) zoomTo(x, y, 8, 1600);
}


/*
Name: get burgs.
Summary: select/list all the burgs.
Description: this function is able tho clean and make a object  of the burgs.
You can filter burgs on states or culture. This is not necessary for use.


@since 16-8-2019.
@deprecated.
@global {object} pack.burg  the burg that are in the map.

@param {string} selectedState  if you want to select a burgs on States this is not necessary for use.
@param {string} selectedCulture  if you want to select a burgs on Culture this is not necessary for use.

@return {object} burgs all the burgs that are selected.
*/
function get_burgs(selectedState, selectedCulture){ 
    let burgs = pack.burgs.filter(b => b.i && !b.removed); // all valid burgs
    if (selectedState != -1 && selectedState != null) burgs = burgs.filter(b => b.state === selectedState); // filtered by state
    if (selectedCulture != -1 && selectedCulture != null) burgs = burgs.filter(b => b.culture === selectedCulture); // filtered by culture

    //add keys to the burgs
    for(var i in burgs){
        burgs[i].key = i;
    }
    
    return burgs;
}

/*
Name: select_burg.
Summary: show information of a select burg.
Description: this function fills all the information of the burg in to the .
side menu. The side menu is now a const (this may change in the futer).


@since 16-8-2019.
@deprecated.
@global {object} selected_burg  the burg that is curently selected.
@param {int} id  The id of a slected burg.
@return null.
*/
function select_burg(id){
  const menu = document.getElementsByClassName('city'); //select the head menu

  //stop if not al the data is there
  if(!id) return;
  if(!menu) return;

  const burg = pack.burgs[id];  //selected burg
  const MFCG_url =  gen_MFCG(burg, id); //burg url

  //burg location
  let x = burg.x;
  let y = burg.y;
  const i = findCell(x, y); // pack ell id
  const g = findGridCell(x, y); // grid cell id

  //burg information
  const name  = burg.name;
  const population = burg.population;
  const state = pack.states[burg.state].name;
  const culture = pack.cultures[burg.culture].name;
  const cell = burg.cell;
  const port = burg.port;


  //biom information of the burg
  let temputure =  grid.cells.temp[g];
  let biom      =  biomesData.name[pack.cells.biome[i]];
  let altitude  =  getFriendlyHeight(grid.cells.h[i]);
  let Precipitation =  pack.cells.h[i] >= 20 ? getFriendlyPrecipitation(i) : "n/a";

  //burg display data 
  var data_city = `
      <li>
          <i class='material-icons'>
                  public
          </i>
          ${state}
      </li>
      <li>
          <i class='material-icons'>
                  poll
          </i>
          ${culture}
      </li>
      <li>
          <i class='material-icons'>
                  people
          </i>
          ${population}
      </li>
      <li>
          <i class='material-icons'>
                  directions_boat
          </i>
          ${port}
      </li>                                    
      <li class='info_special'>         
          <i class='material-icons'>
          terrain
          </i> 
          ${altitude}
          <hr />
          <br />
          <i class='material-icons' style='color:#FFE168;'>
                  brightness_1
          </i>    
          ${temputure} °C
          
          <br />
          ${biom}
      </li>   

  `;
  
  //writing the burg data to the screen
  menu[0].querySelector('#burg_info').innerHTML = data_city;
  menu[0].querySelector('#burg_name').innerHTML = name;
  menu[0].querySelector('#burg_preview').innerHTML = `<embed src='${MFCG_url}' >`;
      
  selected_burg = burg; //replace the selected burg
}


/*
Name: open_embed.
Summary: opens a url in new windo.
Description: opens the embed(string) of a object in a new window.

@since 16-8-2019.
@deprecated
@param {object} element  the element that includs the embed as attribute.
@return null.
*/
function open_embed(obj){
  let url = obj.getElementsByTagName('embed')[0];
  let win = window.open(url.src, '_blank');
  win.focus();
}
/*
Name: gen_MFCG.
Summary: This function generates the URL for the MFCG map.
Description: The MFCG map is a external map of a city,
The of the city is generated base of the information of the main map,
The function returns a url that can be used.

@since 16-8-2019.
@deprecated --.
@param {object} brug  this is the obj(data) of the select burg.
@return {string} url of the MFCG map.
*/
function gen_MFCG(burg) {
    
    const i    = burg.i;
    const id   = i.toString();
    const name = pack.burgs[i].name;
    const cell = pack.burgs[i].cell;
    const pop = rn(pack.burgs[i].population);
    const size = Math.max(Math.min(pop, 65), 6);

    // MFCG seed is FMG map seed + burg id padded to 4 chars with zeros
    const s = seed + id.padStart(4, 0);
    const hub = +pack.cells.road[cell] > 50;
    const river = pack.cells.r[cell] ? 1 : 0;
    const coast = +pack.burgs[i].port;

    const half = rn(pop) % 2;
    const most = (+id + rn(pop)) % 3 ? 1 : 0;
    const walls = pop > 10 && half || pop > 20 && most || pop > 30 ? 1 : 0;;
    const shanty = pop > 40 && half || pop > 60 && most || pop > 80 ? 1 : 0;
    const temple = pop > 50 && half || pop > 80 && most || pop > 100 ? 1 : 0;

    const url = `http://fantasycities.watabou.ru/?name=${name}&size=${size}&seed=${s}&hub=${hub}&random=0&continuous=0&river=${river}&coast=${coast}&citadel=${half}&plaza=${half}&temple=${temple}&walls=${walls}&shantytown=${shanty}`;
    return url;
  }
