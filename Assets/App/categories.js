'use strict'
//import functions
import {loadDataInBoxesOnCategoriesPage, sortAndFilterBooks} from "./functions.js";


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

let applyRangeFilterBtns=document.querySelectorAll('.apply-range-filter-btn');

let nextPageBtn=document.getElementById('nextPageBtn');
let previousPageBtn=document.getElementById('previousPageBtn');



//global variables
let pageNumber=1;
let sortFilter="mostRelevant";
let publisherFilter='all';
let minPriceRange=0;
let maxPriceRange=1000000;
let pageCount;
let searchParams=new URLSearchParams(location.search);

window.addEventListener('load', async()=>{
let category;
switch(searchParams.get('c')){
    case 'foreign':
        category='ادبیات خارجی';
      break;
    case 'psychology':
      category= 'روانشناسی';
        break;
    case 'poetry':
      category='شعر';
      break;
    case 'fiction':
      category= 'ادبیات داستانی';
      break;
    case 'education':
      category='آموزشی';
      break;
}
document.querySelector('.title-sec .breadcrumb .active').innerHTML=category;
document.querySelector('.title-sec .category-title').innerHTML=category;

//load books data on the page
await loadDataInBoxesOnCategoriesPage(searchParams.get('c'));
sortAndFilterBooks(searchParams.get('c'), sortFilter, minPriceRange, maxPriceRange, publisherFilter, pageNumber);

pageCount=Number(document.querySelector('.page-count').innerHTML);

//remove previous page buttons
while(document.querySelector('.pagination .btn-group').firstChild){
    document.querySelector('.pagination .btn-group').firstChild.remove()
}

//making pagination buttons
for (let i = 1; i <= 3; i++) {
    if(i>pageCount)
    break;
    if(i===1){
        document.querySelector('.pagination .btn-group').insertAdjacentHTML('beforeend', `
        <input type="radio" class="btn-check" name="paginationradio" id="page${i}" autocomplete="off" checked }>
        <label class="page${i} btn btn-outline-primary rounded-3 " for="page${i}">${i}</label>
      `)
    }
    else{
        document.querySelector('.pagination .btn-group').insertAdjacentHTML('beforeend', `
        <input type="radio" class="btn-check" name="paginationradio" id="page${i}" autocomplete="off" }>
        <label class="page${i} btn btn-outline-primary rounded-3 " for="page${i}">${i}</label>
      `)
    }

}
if(pageCount<=4){
    document.querySelector('.pagination #nextPageBtn').remove();
}
if(pageCount===4){
    document.querySelector('.pagination .btn-group').insertAdjacentHTML('beforeend', `
    <input type="radio" class="btn-check" name="paginationradio" id="lastPage" autocomplete="off" }>
    <label class="last-page btn btn-outline-primary rounded-3 " for="lastPage">${pageCount}</label>
    `)
}
if(pageCount>4){
    document.querySelector('.pagination .btn-group').insertAdjacentHTML('beforeend', `
    <span>...</span>
    <input type="radio" class="btn-check" name="paginationradio" id="lastPage" autocomplete="off" }>
    <label class="last-page btn btn-outline-primary rounded-3 " for="lastPage">${pageCount}</label>
    `)
}

//changing the page number variable and load new data by clicking on a pagination button
document.querySelectorAll('.pagination .btn-check').forEach(btn=> btn.addEventListener('click', (event)=>{
    pageNumber=Number(event.target.nextElementSibling.innerHTML);
    sortAndFilterBooks(searchParams.get('c'), sortFilter, minPriceRange, maxPriceRange, publisherFilter, pageNumber);
    document.querySelector('.main-sec').scrollIntoView();
}))


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

//making a dynamic range slider
maxRanges.forEach(maxRange=>{
    maxRange.addEventListener('input', (event)=>{
        //move the selector when the user move the max range thumb
        minPriceRange=maxRange.previousElementSibling.value;
        maxPriceRange=maxRange.value;
        event.target.parentElement.parentElement.querySelector('.range-selected').style.cssText=`
        left: ${(Math.floor(1000000-maxPriceRange)/1000000)*100}%;
        right: ${Math.floor((minPriceRange/1000000)*100)}%;
    `;
        //change the max number input when the range input changes
        event.target.parentElement.nextElementSibling.querySelector('.max-number').value=maxPriceRange;
    })
})
minRanges.forEach(minRange=>{
    minRange.addEventListener('input', (event)=>{
        //move the selector when the user move the min range thumb
        minPriceRange=minRange.value;
        maxPriceRange=event.target.nextElementSibling.value;
        event.target.parentElement.parentElement.querySelector('.range-selected').style.cssText=`
        right: ${Math.floor((minPriceRange/1000000)*100)}%;
        left: ${(Math.floor(1000000-maxPriceRange)/1000000)*100}%;
    `;
        //changing the min number input when the range input changes
        event.target.parentElement.nextElementSibling.querySelector('.min-number').value=minPriceRange;

    })
})
minRangeNumbers.forEach(minRangeNumber=>{
    minRangeNumber.addEventListener('input',(event)=>{
        //move the selector when the user change the min number input
        minPriceRange=minRangeNumber.value;
        maxPriceRange=event.target.nextElementSibling.nextElementSibling.value;
        event.target.parentElement.parentElement.querySelector('.range-selected').style.cssText=`
        right: ${Math.floor((minPriceRange/1000000)*100)}%;
        left: ${(Math.floor(1000000-maxPriceRange)/1000000)*100}%;
    `;
        //move the range thumb when the user change the min number input
        event.target.parentElement.previousElementSibling.children[0].value=minPriceRange;
        event.target.parentElement.previousElementSibling.children[1].value=maxPriceRange;
        
    })
})
maxRangeNumbers.forEach(maxRangeNumber=>{
    maxRangeNumber.addEventListener('input',(event)=>{
        //move the selector when the user change the max number input
        maxPriceRange=maxRangeNumber.value;
        minPriceRange=event.target.previousElementSibling.previousElementSibling.value;
        event.target.parentElement.parentElement.querySelector('.range-selected').style.cssText=`
        right: ${Math.floor((minPriceRange/1000000)*100)}%;
        left: ${(Math.floor(1000000-maxPriceRange)/1000000)*100}%;
    `;

        //move the range thumb when the user change the min number input
        event.target.parentElement.previousElementSibling.children[0].value=minPriceRange;
        event.target.parentElement.previousElementSibling.children[1].value=maxPriceRange;
    })
})

//reload data by changing the order of the sort box
sortBoxBtns.forEach(btn=>{btn.addEventListener('click', (event)=>{
    //add sortFilter name to the appliedFilter box
    document.querySelectorAll('.filters').forEach(f=>{
        f.querySelector('.sort-filter-name').remove();
        f.insertAdjacentHTML('beforeend',`
        <div class="filter sort-filter-name d-flex justify-content-between align-items-center">
            <i class="fa-solid fa-close me-2 mb-0"></i>
            <p class="m-0">${btn.nextElementSibling.innerHTML}</p>
        </div> `) 
    })
   sortFilter=event.target.dataset.sort;
   publisherFilter=document.querySelector('.pub-list li.selected')?.innerHTML || 'all';
  //sort books according to the filters 
switch(sortFilter){
    case 'newest':
       sortAndFilterBooks(searchParams.get('c'), sortFilter, minPriceRange, maxPriceRange, publisherFilter, pageNumber);
    break;
    case 'mostRelevant':
       sortAndFilterBooks(searchParams.get('c'), sortFilter, minPriceRange, maxPriceRange, publisherFilter, pageNumber);
    break;
    case 'mostExpensive':
        sortAndFilterBooks(searchParams.get('c'), sortFilter, minPriceRange, maxPriceRange, publisherFilter, pageNumber);
    break;
    case 'cheapest':
        sortAndFilterBooks(searchParams.get('c'), sortFilter, minPriceRange, maxPriceRange, publisherFilter, pageNumber);
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
//reload data by clicking on the applyRangeFilterBtn when the price range changes
applyRangeFilterBtns.forEach(btn=>btn.addEventListener('click', ()=>{
   publisherFilter=document.querySelector('.pub-list li.selected')?.innerHTML || 'all';
    sortAndFilterBooks(searchParams.get('c'), sortFilter, minPriceRange, maxPriceRange, publisherFilter, pageNumber);
    //add the price range to the applied filter box
    document.querySelectorAll('.filters').forEach(f=>{
        f.querySelector('.price-range-filter').remove();
        f.insertAdjacentHTML('beforeend',`
        <div class="filter price-range-filter d-flex justify-content-between align-items-center">
        <i class="fa-solid fa-close me-2 mb-0"></i>
        <p class="m-0"> از ${minPriceRange} تا ${maxPriceRange} تومان</p>
      </div>`)
    })
}))



//going to the next page by clicking on the next page button
nextPageBtn.addEventListener('click', ()=>{
    if(1<pageNumber<4)
    previousPageBtn.style.display='block';

    if(pageNumber%3===0){
        document.querySelector('.page1').innerHTML=pageNumber+1;

        if(pageNumber+2>pageCount)
        document.querySelector('.page2').remove();
        else
        document.querySelector('.page2').innerHTML=pageNumber+2;

        if(pageNumber+3>pageCount)
        document.querySelector('.page3').remove();
        else
        document.querySelector('.page3').innerHTML=pageNumber+3;
    }

    document.querySelectorAll('.pagination .btn-check').forEach(btn=>{
        if(Number(btn.nextElementSibling.innerHTML)===pageNumber+1){
            btn.checked=true;
        }
    })
    if((pageNumber+2===pageCount || pageCount===pageNumber+3) && pageCount>4){
        document.querySelector('.pagination .btn-group span')?.remove();
        document.querySelector('.pagination .btn-group .last-page').remove();
    }


    pageNumber++;
    sortAndFilterBooks(searchParams.get('c'), sortFilter, minPriceRange, maxPriceRange, publisherFilter, pageNumber);
    
    document.querySelector('.main-sec').scrollIntoView();

})

previousPageBtn.addEventListener('click', ()=>{

})

