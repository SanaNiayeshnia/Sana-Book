'use-strict'
import {loadDataOnProductPage} from "./functions.js";

let searchIcon=document.getElementById('searchIcon');
let recommendationBoxForwardBtn=document.querySelector('.forward-btn');
let recommendationBoxBackBtn=document.querySelector('.back-btn');

window.addEventListener('load', ()=>{
    let searchParams=new URLSearchParams(location.search);
    let query=searchParams.get('q');
    let bookParamsArray=query.split(',');
    let bookParamsObj={id:bookParamsArray[0], realPrice:bookParamsArray[1], salePrice:bookParamsArray[2]};
    loadDataOnProductPage(bookParamsObj);
})


//show the search-nav by clicking on the search icon
searchIcon.addEventListener('click', ()=>{
    let wave=document.getElementsByClassName('wave1')[0];
    let searchNav=document.getElementById('searchNav');
    if(!wave.classList.contains('show')){
        wave.classList.remove('hide');
        wave.classList.add('show');
    }

    else{
        wave.classList.remove('show');
        wave.classList.add('hide');
    }

    if(!searchNav.classList.contains('show')){
        setTimeout(()=>{
        searchNav.classList.remove('hide');
            searchNav.classList.add('show');
        },50)
    }

    else{
        searchNav.classList.remove('show');
        searchNav.classList.add('hide');
    }

})


//scrolling in the recommendation boxes by clicking on the navigator buttons

//hide and show the back button(by default it's hidden)

recommendationBoxForwardBtn.parentElement.parentElement.addEventListener('scroll', ()=>{
    if(recommendationBoxForwardBtn.parentElement.parentElement.scrollLeft<0){
      recommendationBoxForwardBtn.previousElementSibling.style.visibility='visible'
    }
    else{
        recommendationBoxForwardBtn.previousElementSibling.style.visibility='hidden'
      }
})

//scrolling to left by clicking on the forward button
recommendationBoxForwardBtn.addEventListener('click', (event)=>{
  event.target.parentElement.parentElement.scrollBy(-220,0);
})


//scrolling to right by clicking on the forward button
recommendationBoxBackBtn.addEventListener('click', (event)=>{
    event.target.parentElement.parentElement.scrollBy(220,0);
})
