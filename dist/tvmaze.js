// Global Selectors and Constance
const BASE_URL= "https://api.tvmaze.com/search/shows" 
const $showsList = $("#shows-list");
const $episodeList = $("#episodes-list");

async function searchShows(query) {
  let q = query;

  const newArr = new Array;
  try {
    const res = await axios.get(BASE_URL, { params: { q } });
    let showsArr = new Array(res.data);
   
    for (let i = 0; i < showsArr[0].length; i++) {
      if (showsArr[0][i].show.image === null) {
        continue
      };
      let show = {
        id: showsArr[0][i].show.id,
        name: showsArr[0][i].show.name,
        summary: showsArr[0][i].show.summary,
        image: showsArr[0][i].show.image
      }
       newArr.push(show);
    }
  } catch (e) {
    alert("MATCH NOT FOUND!");
  }
  return newArr
}

// Add Shows to the Mark-up HTML //
function populateShows(shows) {
  $("#search-query").val("");
  
  for (let show of shows) {
    let $item = $(
      `<div class="card col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div data-show-id="${show.id}">
           <div class="card-body col-12 col-sm-12 ">
           <img class="card-img-top" src="${show.image.medium}" alt="No">
             <h5 class="card-title">${show.name}</h5>
             <button class="btn btn-info mt-auto" data-toggle="modal" data-target="#myModal"  id="${show.id}"> Episodes - More Info</button>
             <p class="card-text ">${show.summary}</p>
             
           </div>
         </div>
       </div>`);
    
    $showsList.append($item);
  }
  // Add event listener to each button
  $(".btn.btn-info").on("click", async function handleSearch (evt) {
    evt.preventDefault();
    // Use evt object properties to get div ID
    let id = evt.target.id
  
    let episodes = await getEpisodes(id);
    populateEpisodes(episodes);
  });
}

//  Handle search form submission //

$("#search-form").on("submit", async function handleSearch(evt) { 
  evt.preventDefault();
  $showsList.empty();

  let query = $("#search-query").val();
  
  if (!query) return;

  $("#episodes-area").hide();

  shows = await searchShows(query);

  populateShows(shows);
  
});


// Function to get Episodes //
async function getEpisodes(id) {
  let response = await axios.get(`https://api.tvmaze.com/shows/${id}/episodes`);

  let episodes = response.data.map(episode => ({
    id: episode.id,
    name: episode.name,
    season: episode.season,
    number: episode.number,
  }));

  return episodes;
}

// Funtion to add episodes to the mark-up//
function populateEpisodes(episodes) {
  
  $episodeList.empty();
  $("#episodes-area").show();
  for (let episode of episodes) {
    
    let $item = $(
      `<li>${episode.name}</li>`);
    $episodeList.append($item)
  }
}

function firstSplash() {

}

