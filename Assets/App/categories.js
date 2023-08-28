'use strict'
//import functions
import {loadDataOnCategorisePage, sortAndFilterBooks} from "./functions.js";


let filterBtn=document.getElementById('filterBtn');
let filterBox=document.getElementById('filterBox');

let sortIcon=document.getElementById('sortIcon');
let sortBox=document.getElementById('sortBox');

let closeIcons=document.querySelectorAll('.close-box-icon');
let closeBtns=document.querySelectorAll('.language .close-box-btn, .publishers .close-box-btn');

let maxRanges=document.querySelectorAll('.range-input .max');
let minRanges=document.querySelectorAll('.range-input .min');
let minRangeNumbers=document.querySelectorAll('.range-price .min-number');
let maxRangeNumbers=document.querySelectorAll('.range-price .max-number');

let sortBoxBtns=document.querySelectorAll('.sorting .orders input[type="radio"]');

let checkAvailibilityBtns=document.querySelectorAll('.check-availability-btn');

//global variables
let sortFilter;
let minPriceRange=0;
let maxPriceRange=1000000;
let searchParams=new URLSearchParams(location.search);

window.addEventListener('load', ()=>{
//load books data on the page
loadDataOnCategorisePage(searchParams.get('c'));
})
//show the filter box by clicking on the filter button
filterBtn.addEventListener('click', (event)=>{
    filterBox.classList.remove('hide');
    document.querySelector('.content').style.filter='blur(10px)';
    filterBox.classList.add('show');
})
//show the sort box by clicking on the sort button
sortIcon.addEventListener('click', (event)=>{
    sortBox.classList.remove('hide');
    document.querySelector('.content').style.filter='blur(10px)';
    sortBox.classList.add('show');
})
//hide the filter box or the sort box by clicking on the clode icon
closeIcons.forEach(icon=>{
    icon.addEventListener('click', (event)=>{
    event.target.parentElement.classList.remove('show');
    event.target.parentElement.classList.add('hide');
    document.querySelector('.content').style.filter='blur(0)';
    })
})

//opening and closeing language box and publisher box
closeBtns.forEach(btn=>btn.addEventListener('click', (event)=>{
    if(!event.target.classList.contains('fa-angle-down')){
        event.target.parentElement.nextElementSibling.classList.remove('open');
        event.target.parentElement.nextElementSibling.classList.add('close');
        event.target.classList.remove('fa-angle-up');
        event.target.classList.add('fa-angle-down');
    }
    else{
        event.target.parentElement.nextElementSibling.classList.remove('close');
        event.target.parentElement.nextElementSibling.classList.add('open');

        event.target.classList.remove('fa-angle-down');
        event.target.classList.add('fa-angle-up');
    }
}))
//selecting a language or a publisher from the boxes
document.querySelectorAll('.language .lang-list li , .publishers .pub-list li').forEach(li=>{
    li.addEventListener('click', (event)=>{
        if(!event.target.classList.contains('selected'))
        event.target.classList.add('selected');
        else
        event.target.classList.remove('selected');
    })
})

//making a dynamic range slider
maxRanges.forEach(maxRange=>{
    maxRange.addEventListener('input', (event)=>{
        //move the selector when the user move the max range thumb
        let minValue=maxRange.previousElementSibling.value;
        let maxValue=maxRange.value;
        event.target.parentElement.parentElement.querySelector('.range-selected').style.cssText=`
        left: ${(Math.floor(1000000-maxValue)/1000000)*100}%;
        right: ${Math.floor((minValue/1000000)*100)}%;
    `;
        //change the max number input when the range input changes
        event.target.parentElement.nextElementSibling.querySelector('.max-number').value=maxValue;

        //load new data by changing the price range input
        sortAndFilterBooks(searchParams.get('c',sortFilter, minPrice, maxPrice))
    })
})
minRanges.forEach(minRange=>{
    minRange.addEventListener('input', (event)=>{
        //move the selector when the user move the min range thumb
        let minValue=minRange.value;
        let maxValue=event.target.nextElementSibling.value;
        event.target.parentElement.parentElement.querySelector('.range-selected').style.cssText=`
        right: ${Math.floor((minValue/1000000)*100)}%;
        left: ${(Math.floor(1000000-maxValue)/1000000)*100}%;
    `;
        //changing the min number input when the range input changes
        event.target.parentElement.nextElementSibling.querySelector('.min-number').value=minValue;

    })
})
minRangeNumbers.forEach(minRangeNumber=>{
    minRangeNumber.addEventListener('input',(event)=>{
        //move the selector when the user change the min number input
        let minValue=minRangeNumber.value;
        let maxValue=event.target.nextElementSibling.nextElementSibling.value;
        event.target.parentElement.parentElement.querySelector('.range-selected').style.cssText=`
        right: ${Math.floor((minValue/1000000)*100)}%;
        left: ${(Math.floor(1000000-maxValue)/1000000)*100}%;
    `;
        //move the range thumb when the user change the min number input
        event.target.parentElement.previousElementSibling.children[0].value=minValue;
        event.target.parentElement.previousElementSibling.children[1].value=maxValue;
        
    })
})
maxRangeNumbers.forEach(maxRangeNumber=>{
    maxRangeNumber.addEventListener('input',(event)=>{
        //move the selector when the user change the max number input
        let maxValue=maxRangeNumber.value;
        let minValue=event.target.previousElementSibling.previousElementSibling.value;
        event.target.parentElement.parentElement.querySelector('.range-selected').style.cssText=`
        right: ${Math.floor((minValue/1000000)*100)}%;
        left: ${(Math.floor(1000000-maxValue)/1000000)*100}%;
    `;

        //move the range thumb when the user change the min number input
        event.target.parentElement.previousElementSibling.children[0].value=minValue;
        event.target.parentElement.previousElementSibling.children[1].value=maxValue;
    })
})

//reload data by changing the order of the sort box
sortBoxBtns.forEach(btn=>{btn.addEventListener('click', (event)=>{
    document.querySelectorAll('.filters').forEach(f=>{
        f.querySelector('.sort-filter-name').remove();
        f.insertAdjacentHTML('beforeend',`
        <div class="filter sort-filter-name d-flex justify-content-between align-items-center">
            <i class="fa-solid fa-close me-2 mb-0"></i>
            <p class="m-0">${btn.nextElementSibling.innerHTML}</p>
        </div> `) 
    })
   sortFilter=event.target.dataset.sort;
  
switch(sortFilter){
    case 'newest':
       sortAndFilterBooks(searchParams.get('c'), sortFilter, minPriceRange, maxPriceRange);
    break;
    case 'mostRelevant':
       sortAndFilterBooks(searchParams.get('c'), sortFilter, minPriceRange, maxPriceRange);
    break;
    case 'mostExpensive':
        sortAndFilterBooks(searchParams.get('c'), sortFilter, minPriceRange, maxPriceRange);
    break;
    case 'cheapest':
        sortAndFilterBooks(searchParams.get('c'), sortFilter, minPriceRange, maxPriceRange);
    break;
}
})})

//add filter to applied filters by checking the availibily switch
checkAvailibilityBtns.forEach(btn=>btn.addEventListener('change', ()=>{
    if(btn.checked){
        document.querySelectorAll('.filters').forEach(f=>{
            f.insertAdjacentHTML('beforeend',`
            <div class="filter availability-filter d-flex justify-content-between align-items-center">
            <i class="fa-solid fa-close me-2 mb-0"></i>
            <p class="m-0">فقط کالاهای موجود</p>
          </div>`)
        })
        checkAvailibilityBtns.forEach(btn=>btn.checked=true);
    }
    else {
        document.querySelectorAll('.filters').forEach(f=>{
            f.querySelector('.availability-filter').remove();
        })
        checkAvailibilityBtns.forEach(btn=>btn.checked=false);

    }

 
}))
