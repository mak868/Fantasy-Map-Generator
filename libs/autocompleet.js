var autocompleet_data_old = [
];



const matchItems = (haystack, needle) => {
    return haystack.filter((item) => item.name.toLowerCase().indexOf(needle.toLowerCase()) !== -1)
};

const findMatches = (value) => {
    //od way to make the function work
    let autocompleet_data = get_burgs();



    const matches = matchItems(autocompleet_data, value);
    const regex = new RegExp(`(${value})`, 'gi');

    const results = matches.map((item) => {
      return {
        ...item,
        name: item.name
      };
    });
  
    return results;
};

const createResultsHtml = (results) => {
    if (!results) return;
  
    const items = results.map((item) => {

        //if the city is a state
        if(item.state == 1){
            return `<li class="results__item" item_key="${item.i}"> 
            <a class="results__link" item_key="${item.i}" >
                <span class="results__name"><strong>${item.name}</strong></span>
                <span class="results__right">
                    <i class="material-icons ">
                        star_border
                    </i>
                </span>
                <span class="results__right">${item.population}</span>

            </a>
          </li>`;
        }


        return `<li class="results__item" item_key="${item.i}">
          <a class="results__link" item_key="${item.i}" > 
              <span class="results__name"><strong>${item.name}</strong></span>
              <span class="results__right">${item.population}</span>
          </a>
        </li>`;
    });
  
    return items.join('');
};  

const autocompletePlaceholder = document.querySelector('.js-autocomplete-placeholder');
const inputEl = document.querySelector('.js-search-input');

const buildAutocomplete = (html) => autocompletePlaceholder.innerHTML = `<ul class="results">${html}</ul>`;

const resetAutoComplete = () => autocompletePlaceholder.innerHTML = '';

const handleSearchInputChange = (e) => {
    const {value} = e.target;
    const prevHtml = autocompletePlaceholder.innerHTML;
    
    if (value.length >= 2) {
        const results = findMatches(value);
        const html = (results.length)
            ? createResultsHtml(results)
            : `<li class="results__link">
                    No results found
                </li>`;
    
        buildAutocomplete(html);
    } else {
        resetAutoComplete();
    }
};

inputEl.addEventListener('change', handleSearchInputChange);
inputEl.addEventListener('keyup', handleSearchInputChange);



/*event lisner for click */
autocompletePlaceholder.addEventListener('click', click_burg ,true);

function click_burg(e){

    select_burg(e.path[0].getAttribute('item_key'));
    zoom_in_burg();
    resetAutoComplete();
}

