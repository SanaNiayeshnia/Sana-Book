'use-strict'
import {loadDataOnProductPage} from "./functions.js";

let searchIcon=document.getElementById('searchIcon');
let recommendationBoxForwardBtn=document.querySelector('.forward-btn');
let recommendationBoxBackBtn=document.querySelector('.back-btn');

window.addEventListener('load',async ()=>{
    let searchParams=new URLSearchParams(location.search);
    await loadDataOnProductPage(searchParams.get('id'));
    
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

//add the book to cart by clicking on the addToCartBtn
document.getElementById('addToCartBtn').addEventListener('click', (event)=>{
    let cartCount=0;
    let orderCount;
    let cartItems=[];
    if(JSON.parse(localStorage.getItem('cartItems'))!=null){
      cartItems=[...JSON.parse(localStorage.getItem('cartItems'))];     
    }
    else{
      localStorage.setItem('cartItems',JSON.stringify(cartItems));
    } 

    let sameItemIndex= cartItems.findIndex(item=>item.olid===event.target.dataset.olid);
    if(sameItemIndex===-1)
    cartItems.push({olid:event.target.dataset.olid, count:1});
    else{
      cartItems[sameItemIndex].count=cartItems[sameItemIndex].count+1;
    }
    localStorage.setItem('cartItems', JSON.stringify(cartItems)); 

    cartItems.forEach(item=>{
        cartCount+=item.count;
    })   
    orderCount=(cartCount<=5)?cartCount:"+5";
    document.querySelectorAll('.cart-icon .badge').forEach(cartIcon=> cartIcon.innerHTML=orderCount);

    //show the addToCart alert 
    let addToCartAlert=document.getElementById('addToCartToast');
    let addToCartToast = new bootstrap.Toast(addToCartAlert);
    addToCartToast.show();

})