'use strict'
//import functions
import {loadDataInBoxesOnIndexPage} from "./functions.js";

//getting elements
let topNav=document.getElementsByClassName('top-nav')[0];

let recommendSecBackBtns=document.querySelectorAll('.recommend-sec .back-btn');
let recommendSecForwardBtns=document.querySelectorAll('.recommend-sec .forward-btn');

let categoriesSecBackBtn=document.querySelector('.categories-sec .back-btn');
let categoriesSecForwardBtn=document.querySelector('.categories-sec .forward-btn');

let saleBox=document.querySelector('.sale-box .recommend-box-cards');
let popularBox=document.querySelector('.popular-box .recommend-box-cards');




window.addEventListener('load', ()=>{
  
  //initialising bootstrap tooltips
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
  const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
  
  //loading book data into the boxes
  loadDataInBoxesOnIndexPage();
  
}) 

window.addEventListener('scroll', ()=>{
//show the recommendation box pics when scrollbar reaches that point
   if(window.scrollY>600){
    document.querySelector('.sale-box .recommend-box-pic img').classList.add('show');
   }
   if(window.scrollY>1100){
    document.querySelector('.popular-box .recommend-box-pic img').classList.add('show');
   }

  })

//scrolling in the recommendation boxes by clicking on the navigator buttons
recommendSecForwardBtns.forEach((btn)=>{
    //hide and show the back button(by default it's hidden)
    btn.parentElement.parentElement.addEventListener('scroll', ()=>{
        if(btn.parentElement.parentElement.scrollLeft<0){
          btn.previousElementSibling.style.visibility='visible'
        }
        else{
            btn.previousElementSibling.style.visibility='hidden'
          }
    })
    //scrolling to left by clicking on the forward button
    btn.addEventListener('click', (event)=>{
      event.target.parentElement.parentElement.scrollBy(-220,0);
    })
})

recommendSecBackBtns.forEach((btn)=>{
    //scrolling to right by clicking on the forward button
    btn.addEventListener('click', (event)=>{
      event.target.parentElement.parentElement.scrollBy(220,0);
    })
})


//scrolling in the categories container by clicking on the navigator buttons

//hide and show the back button(by default it's hidden)
categoriesSecForwardBtn.parentElement.nextElementSibling.querySelectorAll('.tab-pane-container').forEach((tab)=>{
tab.addEventListener('scroll', ()=>{
  if(tab.scrollLeft<0){
      categoriesSecBackBtn.style.visibility='visible';
  }
  else{
      categoriesSecBackBtn.style.visibility='hidden';
    }
})
})


//scrolling to left by clicking on the forward button
categoriesSecForwardBtn.addEventListener('click',(event)=>{
  event.target.parentElement.nextElementSibling.querySelector('.active .tab-pane-container').scrollBy(-220,0);
})
//scrolling to right by clicking on the back button
categoriesSecBackBtn.addEventListener('click',(event)=>{
  event.target.parentElement.nextElementSibling.querySelector('.active .tab-pane-container').scrollBy(220,0);
})

//scroll the recommendation boxes every 3 seconds
let isSaleBoxPaused=false;
let isPopularBoxPaused=false;
let resumeSaleBoxTimeout;
let resumePopularBoxTimeout;


let saleBoxScrollInterval=setInterval(()=>{
  scrollTheBoxToLeft(saleBox);
},3000);
let popularBoxScrollInterval=setInterval(()=>{
  scrollTheBoxToLeft(popularBox);
},3000);

//if mouse moves over the box, the interval stops and after 7 seconds it starts to work again
saleBox.addEventListener('mousemove', ()=> {
  if(!isSaleBoxPaused){
    clearInterval(saleBoxScrollInterval);
    clearTimeout(resumeSaleBoxTimeout);
    isSaleBoxPaused=true;
  }
});
saleBox.addEventListener('mouseleave', ()=> {
  if(isSaleBoxPaused){
    isSaleBoxPaused=false;
    resumeSaleBoxTimeout=setTimeout(()=>{
      saleBoxScrollInterval=setInterval(()=>{
      scrollTheBoxToLeft(saleBox);
      },3000);
    },7000)
  }
});

popularBox.addEventListener('mousemove', ()=> {
  if(!isPopularBoxPaused){
    clearInterval(popularBoxScrollInterval);
    clearTimeout(resumePopularBoxTimeout);
    isPopularBoxPaused=true;
  }
});
popularBox.addEventListener('mouseleave', ()=> {
  if(isPopularBoxPaused){
    isPopularBoxPaused=false;
    resumePopularBoxTimeout=setTimeout(()=>{
      popularBoxScrollInterval=setInterval(()=>{
      scrollTheBoxToLeft(popularBox);
      },3000);
    },7000)
  }
});

//if touch moves over the box, the interval stops and after 7 seconds it starts to work again
saleBox.addEventListener('touchmove', ()=> {
  if(!isSaleBoxPaused){
    clearInterval(saleBoxScrollInterval);
    clearTimeout(resumeSaleBoxTimeout);
    isSaleBoxPaused=true;
  }
});
saleBox.addEventListener('touchend', ()=> {
  if(isSaleBoxPaused){
    isSaleBoxPaused=false;
    resumeSaleBoxTimeout=setTimeout(()=>{
      saleBoxScrollInterval=setInterval(()=>{
      scrollTheBoxToLeft(saleBox);
      },3000);
    },7000)
  }
});

popularBox.addEventListener('touchmove', ()=> {
  if(!isPopularBoxPaused){
    clearInterval(popularBoxScrollInterval);
    clearTimeout(resumePopularBoxTimeout);
    isPopularBoxPaused=true;
  }
});
popularBox.addEventListener('touchend', ()=> {
  if(isPopularBoxPaused){
    isPopularBoxPaused=false;
    resumePopularBoxTimeout=setTimeout(()=>{
      popularBoxScrollInterval=setInterval(()=>{
      scrollTheBoxToLeft(popularBox);
      },3000);
    },7000)
  }
});

//checks is the box interval is paused or not
function scrollTheBoxToLeft(box){
  if(isSaleBoxPaused){
    clearInterval(saleBoxScrollInterval);
    clearTimeout(resumeSaleBoxTimeout);
    isSaleBoxPaused=false;
    resumeSaleBoxTimeout=setTimeout(()=>{
      saleBoxScrollInterval=setInterval(()=>{
      scrollTheBoxToLeft(box);
      },3000);
    },7000)

   }
   else if(isPopularBoxPaused){
    clearInterval(popularBoxScrollInterval);
    clearTimeout(resumePopularBoxTimeout);
    isPopularBoxPaused=false;
    resumePopularBoxTimeout=setTimeout(()=>{
      saleBoxScrollInterval=setInterval(()=>{
        scrollTheBoxToLeft(box);
      },3000);
    },7000)
    }
   else{
    if(Math.abs(box.scrollLeft)>=box.scrollWidth- box.clientWidth)//if it reaches the end
    {box.scrollTo(0,0);}
    else
    box.scrollBy(-220,0);
   }

} 
