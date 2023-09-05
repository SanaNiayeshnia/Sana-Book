'use strict'

//getting elements
let topNav=document.getElementsByClassName('top-nav')[0];

let helpIcon=document.getElementById('helpIcon');

let searchInputs=document.querySelectorAll('.search-input');

let seachIcons=document.querySelectorAll('.search-icon');

let goToTopIcon=document.getElementById('goToTopIcon');

window.addEventListener('load', ()=>{
  //show the sections and hide the loader after 7 seconds
  setTimeout(()=>{
    document.querySelector('.content').style.display='block';
    document.querySelector('.loader').style.display='none';
  },7000)
  
  //initialising bootstrap tooltips
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
  const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));


})
window.addEventListener('scroll', ()=>{
  //Changing the style of top navbar when the window scrolls from top
      if(window.scrollY>5){
              topNav.classList.add('changed');
      }
      else {
          topNav.classList.remove('changed');
      }
  //show and hide the goToTopIcon
      if(window.scrollY>400)
      goToTopIcon.style.opacity=1;
      else
      goToTopIcon.style.opacity=0;

})  

//show the help message by clicking on the help icon
helpIcon.addEventListener('click',()=>{
  let helpMessage=helpIcon.previousElementSibling;
  if(helpMessage.classList.contains('hidden')){
    helpMessage.classList.remove('hidden');
    helpIcon.classList.remove('fa-headset');
    helpIcon.classList.add('fa-close');
  }
  else{
    helpMessage.classList.add('hidden');
    helpIcon.classList.remove('fa-close');
    helpIcon.classList.add('fa-headset');
  }


})


//load search results
searchInputs.forEach(searchInput=>{
  searchInput.addEventListener('keyup', ()=>{
    let searchedPhrase=searchInput.value;
    let searchResultBox=searchInput.parentElement.nextElementSibling;
    searchResultBox.style.opacity=0;
    searchResultBox.innerHTML="";
    
    searchedPhrase=searchedPhrase.replace(/\s/g,'+');
    fetch(`https://openlibrary.org/search.json?q=${searchedPhrase}&limit=5`)
    .then(res=>res.json())
    .then(data=>{
      //removing the previous results
      while(searchResultBox.firstChild){
        searchResultBox.lastChild.remove();
      }
      //adding the new results
      let resultBooksArray=data.docs;
      console.log(resultBooksArray);
      let index=0; //book index in resultBooksArray
      while(index<resultBooksArray.length){
        searchResultBox.style.opacity=1;
        let bookCoverURL=(resultBooksArray[index].cover_edition_key!=undefined)? ("https://covers.openlibrary.org/b/olid/"+resultBooksArray[index].cover_edition_key+"-L.jpg"): "Assets/Images/undefined-bookcover.jpg";
        let authorName=(resultBooksArray[index]?.author_name===undefined)?"ناشناس":resultBooksArray[index]?.author_name[0];
        if(index===resultBooksArray.length-1){
          searchResultBox.insertAdjacentHTML("beforeend",`
          <a class="search-result-item text-decoration-none text-white d-flex justify-content-between align-items-center px-2" href="product.html?id=${resultBooksArray[index].cover_edition_key}"><span class="result-title"> ${resultBooksArray[index]?.title} | ${authorName} </span><img src="${bookCoverURL}" alt="resultImage" class="result-img img-fluid rounded-1"></a>
        `);
        }
        else{
          searchResultBox.insertAdjacentHTML("beforeend",`
          <a class="search-result-item text-decoration-none text-white d-flex justify-content-between align-items-center px-2" href="product.html?id=${resultBooksArray[index].cover_edition_key}"><span class="result-title"> ${resultBooksArray[index]?.title} | ${authorName} </span><img src="${bookCoverURL}" alt="resultImage" class="result-img img-fluid rounded-1"></a>
          <hr class="text-white bg-white my-2">
        `);
        }
        index++;
      }

    })
 })
})

//clicking on search icon 
seachIcons.forEach(icon=>{
  icon.addEventListener('click', ()=>{
    let searchResultBox=icon.parentElement.nextElementSibling;
    searchResultBox.style.opacity=0;
  })
})

//hiding search results by clicking on the page
document.addEventListener('click',(event)=>{
  document.querySelectorAll('.search-result-box').forEach(box=>{
  box.style.opacity=0;
  })
})

//go to top of the page by clicking on the goToTopIcon
goToTopIcon.addEventListener('click', ()=>window.scrollTo(0,0))