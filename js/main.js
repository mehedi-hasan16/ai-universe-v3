const spinner = document.getElementById('spinner');
// Load data
const loadData =(limit,sortBy) =>{
  spinner.classList.remove('d-none');
    const url ='https://openapi.programming-hero.com/api/ai/tools';
    fetch(url)
    .then(res=>res.json())
    .then(data=> displayData(data.data.tools, limit, sortBy))
}

// show data in card 
const displayData =(data, limit, sortBy)=>{
    const cardContainer = document.getElementById('card-container');
    cardContainer.innerHTML="";
          if(limit){
            data= data.slice(0, limit);
          }else{
            document.getElementById('see-more-btn').classList.add('d-none');
          }

        if (sortBy === "date") {
          data.sort(function (a, b) {
            let c = new Date(a.published_in[0]);
            let d = new Date(b.published_in[0]);
            return d - c;
          });
        }
  
    data.forEach(data=>{
        const {id, name, published_in, image, features} = data;
        cardContainer.innerHTML +=`
            <div class="col">
                  <div class="card h-100 p-3">
                    <img src="${image}" class="card-img-top img-fluid rounded h-75" alt="images">
                    <div class="my-2">
                      <h5 class="card-title fw-bold">Features</h5>
                      <div>
                        <ol class="ps-3">
                        ${features.map(item =>`<li>${item}</li>`).join('')}
                        </ol>
                      </div>
                      <hr>
                      <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h5 class="fw-bold">${name}</h5>
                            <p><i class="fa-solid fa-calendar-days"></i> ${published_in}</p>
                        </div>
                        <div>
                            <i onclick="individualNews('${id}')" class="fa-solid fa-arrow-right bg-danger-subtle text-danger p-3 rounded-circle" data-bs-toggle="modal" data-bs-target="#exampleModal">
                            </i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
        `;
        spinner.classList.add('d-none');  
    })
}

// Load data for individual data 
const individualNews = (id)=>{
    const url = `https://openapi.programming-hero.com/api/ai/tool/${id}`;
    fetch(url)
    .then(res=>res.json())
    .then(data=>displayModalIndividualNews(data.data))
}

// display modal 
const displayModalIndividualNews= (data) =>{
    const {description, pricing, features, integrations, image_link, input_output_examples, accuracy} =data;
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML= '';
    modalBody.innerHTML+=`
    <div class="row">
        <div class="col-sm-6">
            <div class="card h-100 bg-danger-subtle border border-danger">
                <div class="card-body">
                <h5 class="card-title">${description}</h5>
                <div class="d-flex justify-content-center align-items-center gap-2 my-3 text-center">
                ${coursePriceing(pricing) ? coursePriceing(pricing): 'Free of Cost'}
                </div>
              <div class="d-flex gap-3">
                <div>
                    <h5 class="fw-bold">Features</h5>
                    <ul>
                        ${Object.keys(features).map(key=>`<li>${features[key].feature_name}</li>`).join('')}
                    </ul>
                </div>
                <div>
                    <h5 class="fw-bold">Integrations</h5>
                    <ul>
                    ${integrations?.map(item =>`<li>${item}</li>`).join('') || "No data Found"}
                    </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-sm-6 text-center">
            <div class="card p-3 h-100 position-relative">
                <img src="${image_link[0]}" class="card-img-top rounded" alt="images">
                <div class="bg-danger position-absolute top-0 end-0 rounded text-white p-1 fst-italic ${accuracy.score ? '' : 'd-none'}">${(accuracy.score)*100 ? (accuracy.score)*100:'0'}% accuracy</div>
                <div class="card-body">
                <h5 class="card-text fw-bold">${input_output_examples?.[0]?.input || "Can you give any example?"}</h5>
                <p>${input_output_examples?.[0]?.output || "No! Not Yet! Take a break"}</p>
            </div>
            </div>
        </div>
    </div>       
    `;
}

// price function 
const coursePriceing = (price) =>{
  if(price === null){
    return `<h2 class="text-danger">Free of Cost</h2>`;
  }else {

    return price.map(element=>`<div class="d-flex justify-content-center align-items-center bg-white fw-bold rounded p-2 customize-size text-primary">${element?.price} <br> ${element?.plan}</div>`).join('');

  }
  }

// see more btn 
document.getElementById('see-more-btn').addEventListener('click',function(){
    loadData();
    spinner.classList.remove('d-none');

})

//sort btn
document.getElementById('sort-btn').addEventListener('click', function(){
  loadData(6, 'date');
})


loadData(6);

