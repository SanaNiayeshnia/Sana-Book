//global variables
let cartItems=[];
let publishers=new Set();
let allBooks=[];
let allBooksSortedNewest=[];
let allFilteredBooks=[];
async function fetchAndLoadDetailsOfBooks(bookId, query){
       //for accessing the price of each book, we need tp fetch the more detaild data of each book
       const detailsOfEachBookRes = await fetch(`http://openlibrary.org/api/books?bibkeys=OLID:${bookId}&jscmd=details&format=json`);
       const detailsOfEachBookData =await detailsOfEachBookRes.json();

       for (const key in  detailsOfEachBookData) {
        publishers.add(detailsOfEachBookData[key].details.publishers[0]);
         let bookPrice=( detailsOfEachBookData[key].details.notes?.value===undefined)?  detailsOfEachBookData[key].details.notes?.substring(5,) :  detailsOfEachBookData[key].details.notes?.value.substring(5,);
         bookPrice=(isNaN(Number(bookPrice)))?100:bookPrice;
         let cardTextContent;
         let discountBadge;
         //if the price of the book was more than 150, add the sale price and the discount badge
         if(bookPrice>150){
         let salePrice=Math.floor(bookPrice*0.7); //sale price is 70% of the actual price. It means the discount is 30%;
         cardTextContent=`
         <p class="real-price text-decoration-line-through text-center mb-0">${bookPrice},000</p>
         <p class="sale-price price text-center ">${salePrice},000 <span>تومان</span></p>`;
         discountBadge=`
         <span class="badge discount-percent fs-6 px-1 px-md-2 pt-2 pt-md-3 pb-2">%30</span>`;
         }
         else{
           cardTextContent=`
           <p class="price text-center "> ${bookPrice},000 <span>تومان</span></p>`;
           discountBadge='';
         }
         //load data on the page
         document.querySelector(`${query}`).insertAdjacentHTML('beforeend', `
         <div class="card user-select-none rounded-3" role="tabpanel" tabindex="0" data-OLID="${bookId}">
         <i class="add-to-cart-btn fa-solid fa-plus p-2"></i>
         ${discountBadge}
         <a href="#" class="text-decoration-none" >
             <div class="text-center pb-2 pb-md-3 pt-3">
               <img src="https://covers.openlibrary.org/b/olid/${bookId}-L.jpg" class="card-img-top" alt="bookPic">
             </div>
         </a>
             <div class="card-body d-flex flex-column justify-content-between p-0">
               <a class="card-title h5 text-center text-decoration-none my-2 px-2 px-md-3" href="#"><span>«</span>${detailsOfEachBookData[key].details.title}<span>»</span></a>
               <div class="card-text mb-2">
                 ${cardTextContent}
               </div>
             </div>
         </div>
       
       `)}
}
//fetching book data for boxes on index page
async function loadDataInBoxesOnIndexPage(){
    //fetch data for categories box
      //fetch up to 15 psychology book for the psychology category on the main page
      const psychologyRes=await fetch('http://openlibrary.org/subjects/روانشناسی.json?limit=15');
      const psychologyData=await psychologyRes.json();
      psychologyData.works.forEach((book)=>fetchAndLoadDetailsOfBooks(book.cover_edition_key, "#navPsychology .tab-pane-container"));
    
      //fetch up to 15 poetry book for the poetry category on the main page
      const poetryRes=await fetch('http://openlibrary.org/subjects/شعر.json?offset=6&limit=15');
      const poetryData=await poetryRes.json();
      poetryData.works.forEach((book)=>fetchAndLoadDetailsOfBooks(book.cover_edition_key,"#navPoetry .tab-pane-container"));
      //fetch up to 15 english fantasy book for the foreign literature category on the main page
      const foreignRes=await fetch('http://openlibrary.org/subjects/fantasy.json?language=eng&limit=15');
      const foreignData=await foreignRes.json();
      foreignData.works.forEach(async (book)=>{
        //for accessing the price of each book, we need tp fetch the more detaild data of each book
          const detailsOfEachBookRes = await fetch(`http://openlibrary.org/api/books?bibkeys=OLID:${book.cover_edition_key}&jscmd=details&format=json`);
          const detailsOfEachBookData =await detailsOfEachBookRes.json();
          for (const key in  detailsOfEachBookData) {
            //there's no property called price in open library, so i get a random price to not leave this field empty
            let bookPrice=Math.floor(Math.random()*(400-100)+100); 
            let cardTextContent;
            let discountBadge;
            //if the price of the book was more than 150, add the sale price and the discount badge
            if(bookPrice>150){
            let salePrice=Math.floor(bookPrice*0.7); //sale price is 70% of the actual price. It means the discount is 30%;
            cardTextContent=`
            <p class="real-price text-decoration-line-through text-center mb-0">${bookPrice},000</p>
            <p class="sale-price price text-center ">${salePrice},000 <span>تومان</span></p>`;
            discountBadge=`
            <span class="badge discount-percent fs-6 px-1 px-md-2 pt-2 pt-md-3 pb-2">%30</span>`;
            }
            else{
              cardTextContent=`
              <p class="price text-center "> ${bookPrice},000 <span>تومان</span></p>`;
              discountBadge='';
            }
            //load data on the page
            document.querySelector('#navForeign .tab-pane-container').insertAdjacentHTML('beforeend', `
            <div class="card user-select-none rounded-3" role="tabpanel" tabindex="0" data-OLID="${book.cover_edition_key}">
            <i class="add-to-cart-btn fa-solid fa-plus p-2"></i>
            ${discountBadge}
            <a href="#" class="text-reset text-decoration-none">
                <div class="text-center pb-2 pb-md-3 pt-3">
                  <img src="https://covers.openlibrary.org/b/olid/${book.cover_edition_key}-L.jpg" class="card-img-top" alt="bookPic">
                </div>
            </a>
                <div class="card-body d-flex flex-column justify-content-between p-0">
                  <a class="card-title h5 text-decoration-none foreign text-center my-2 px-2 px-md-3" href="#"><span>«</span>${book.title}<span>»</span></a>
                  <div class="card-text mb-2">
                    ${cardTextContent}
                  </div>
                </div>
            </div>
        
          `)
          }
      })
      //fetch up to 15 fiction book for the fiction category on the main page
      const fictionRes=await fetch('http://openlibrary.org/subjects/ادبیات_داستانی.json?limit=15');
      const fictionData=await fictionRes.json();
      fictionData.works.forEach((book)=>fetchAndLoadDetailsOfBooks(book.cover_edition_key, "#navFiction .tab-pane-container"));
  

    //fetching data for sale box
    //I use the data we've already fetched to see the price of which book is more than 150, so i can apply the discount on it
    let allBooksData=[...psychologyData.works, ...foreignData.works, ...poetryData.works, ...fictionData.works];
    allBooksData.forEach(async (book)=>{
      //for accessing the price of each book, we need tp fetch the more detaild data of each book
        const detailsOfEachBookRes = await fetch(`http://openlibrary.org/api/books?bibkeys=OLID:${book.cover_edition_key}&jscmd=details&format=json`);
        const detailsOfEachBookData =await detailsOfEachBookRes.json();
        document.querySelector('.sale-box .book-loader').style.display='none'; //hiding book loader
        for (const key in  detailsOfEachBookData) {
          let bookPrice=( detailsOfEachBookData[key].details.notes?.value===undefined)?  detailsOfEachBookData[key].details.notes?.substring(5,) :  detailsOfEachBookData[key].details.notes?.value.substring(5,);
          if(bookPrice>150){
            let salePrice=Math.floor(bookPrice*0.7); //sale price is 70% of the actual price. It means the discount is 30%;
            //load data on the page
            document.querySelector('.sale-box .recommend-box-cards').insertAdjacentHTML('beforeend', `
            <div class="card user-select-none rounded-3" role="tabpanel" tabindex="0" data-OLID="${book.cover_edition_key}">
            <i class="add-to-cart-btn fa-solid fa-plus p-2 "></i>
            <span class="badge discount-percent fs-6 px-1 px-md-2 pt-2 pt-md-3 pb-2">%30</span>
            <a href="#" class="text-reset text-decoration-none">
                <div class="text-center pb-2 pb-md-3 pt-3">
                  <img src="https://covers.openlibrary.org/b/olid/${book.cover_edition_key}-L.jpg" class="card-img-top" alt="bookPic">
                </div>
            </a>
                <div class="card-body d-flex flex-column justify-content-between p-0">
                  <a class="card-title h5 text-decoration-none text-center my-2 px-2 px-md-3" href"#"><span>«</span>${book.title}<span>»</span></a>
                  <div class="card-text mb-2">
                    <p class="real-price text-decoration-line-through text-center mb-0">${bookPrice},000</p>
                    <p class="sale-price price text-center ">${salePrice},000 <span>تومان</span></p>
                  </div>
                </div>
            </div>
          `)
          }
  
        }
    })
  
    //fetching data for popular box
    //I don't have any criterion for determining the popular books, so I get books randomly for now and put in this boxs
    let randomIndexArray=[]; //to avoid loading repeated data
    let loadedBook=0;
    while(loadedBook<15){
    let randomIndex=Math.floor(Math.random()*allBooksData.length);
    if(!randomIndexArray.includes(randomIndex)) //if the book with this index hasn't already been loaded, add the book
    { randomIndexArray.push(randomIndex);
      let book=allBooksData[randomIndex];
      //for accessing the price of each book, we need tp fetch the more detaild data of each book
      const detailsOfEachBookRes = await fetch(`http://openlibrary.org/api/books?bibkeys=OLID:${book.cover_edition_key}&jscmd=details&format=json`);
      const detailsOfEachBookData =await detailsOfEachBookRes.json();
      document.querySelector('.popular-box .book-loader').style.display='none'; //hiding book loader
      for (const key in  detailsOfEachBookData) {
        let bookPrice=( detailsOfEachBookData[key].details.notes?.value===undefined)?  Number(detailsOfEachBookData[key].details.notes?.substring(5,)) :  Number(detailsOfEachBookData[key].details.notes?.value.substring(5,));
        bookPrice= (typeof(pricebook)!=Number)? Math.floor(Math.random()*(400-100)+100): bookPrice;
        let cardTextContent;
        let discountBadge;
        //if the price of the book was more than 150, add the sale price and the discount badge
        if(bookPrice>150){
        let salePrice=Math.floor(bookPrice*0.7); //sale price is 70% of the actual price. It means the discount is 30%;
        cardTextContent=`
        <p class="real-price text-decoration-line-through text-center mb-0">${bookPrice},000</p>
        <p class="sale-price price text-center ">${salePrice},000 <span>تومان</span></p>`;
        discountBadge=`
        <span class="badge discount-percent fs-6 px-1 px-md-2 pt-2 pt-md-3 pb-2">%30</span>`;
        }
        else{
          cardTextContent=`
          <p class="price text-center "> ${bookPrice},000 <span>تومان</span></p>`;
          discountBadge='';
        }
        //load data on the page
        document.querySelector('.popular-box .recommend-box-cards').insertAdjacentHTML('beforeend', `
        <div class="card user-select-none rounded-3" role="tabpanel" tabindex="0" data-OLID="${book.cover_edition_key}">
        <i class="add-to-cart-btn fa-solid fa-plus p-2"></i>
        ${discountBadge}
        <a href="#" class="text-reset text-decoration-none">
            <div class="text-center pb-2 pb-md-3 pt-3">
              <img src="https://covers.openlibrary.org/b/olid/${book.cover_edition_key}-L.jpg" class="card-img-top" alt="bookPic">
            </div>
        </a>
            <div class="card-body d-flex flex-column justify-content-between p-0">
              <a class="card-title h5 text-decoration-none text-center my-2 px-2 px-md-3" href"#"><span>«</span>${book.title}<span>»</span></a>
              <div class="card-text mb-2">
                ${cardTextContent}
              </div>
            </div>
        </div>
      `)}
      loadedBook++;
    }
    
   }
   
   //add the book to cart by clicking on the .add-to-cart-btn
   Array.from(document.getElementsByClassName('add-to-cart-btn')).forEach(btn=>{
    btn.addEventListener('click', ()=>{
      cartItems.push(btn.parentElement.dataset.olid);
      let orderCount=(cartItems.length<=5)?cartItems.length:"+5";
      document.querySelectorAll('.cart-icon .badge').forEach(cartIcon=> cartIcon.innerHTML=orderCount);
    })

   })
}
//fetching book data for products box on categories page
async function loadDataInBoxesOnCategoriesPage(cParam){
  let category;
  let res;
  //show the book loader
  document.querySelector('.book-loader').style.display='flex';

  //fetching books data
  switch(cParam){
    case 'foreign':
      category='foreign';
      res=await fetch(`http://openlibrary.org/subjects/fantasy.json?language=eng&limit=70`);
      break;

    case 'psychology':
      category= 'روانشناسی';
      res=await fetch(`http://openlibrary.org/subjects/${category}.json?limit=70`);
      break;

    case 'poetry':
      category='شعر';
      res=await fetch(`http://openlibrary.org/subjects/${category}.json?offset=6&limit=70`);
    
      break;
    case 'fiction':
      category= 'ادبیات_داستانی';
      res=await fetch(`http://openlibrary.org/subjects/${category}.json?limit=70`);
    
      break;
    case 'education':
      category='آموزشی';
      res=await fetch(`http://openlibrary.org/subjects/${category}.json?limit=70`);
    
      break;
    default:
  }
  const data=await res.json();
  //geting the data about every book in this category and then putting their olid and price in the allBooks array
  let fetchPromises=data.works.map(async book=>{
      const detailsOfEachBookRes = await fetch(`http://openlibrary.org/api/books?bibkeys=OLID:${book.cover_edition_key}&jscmd=details&format=json`);
      const detailsOfEachBookData =await detailsOfEachBookRes.json();
      for (const key in  detailsOfEachBookData) {
      let publisherName=(detailsOfEachBookData[key].details.publishers!=undefined)? detailsOfEachBookData[key].details.publishers[0]: '';
      let realPrice=( detailsOfEachBookData[key].details.notes?.value===undefined)?  detailsOfEachBookData[key].details.notes?.substring(5,) :  detailsOfEachBookData[key].details.notes?.value.substring(5,);
      if(category==='foreign'){
        realPrice=Math.floor(Math.random()*(600-100)+100);
      }
      let salePrice=realPrice;
      if(realPrice>150)
      salePrice=Math.floor(realPrice*0.7); //their price with discount
      allBooks.push({id:book.cover_edition_key, title:detailsOfEachBookData[key].details.title, realPrice: Number(realPrice), salePrice: Number(salePrice), publisherName, lastModified: detailsOfEachBookData[key].details.last_modified.value });
    }
  })
  await Promise.all(fetchPromises);
  allBooksSortedNewest =[...allBooks].sort((a,b)=> new Date(b.lastModified) - new Date(a.lastModified)); //sort all books from the newest one to the oldest one

}

function sortAndFilterBooks(cParam, sortFilter, minPriceRange, maxPriceRange, publisherFilter, pageNumber){
  //removing previous filtered books
  allFilteredBooks.splice(0,allFilteredBooks.length); 

  //removing previous books from the products box
  while(document.querySelector('.products').firstChild){
    document.querySelector('.products').firstChild.remove();
   }
   document.querySelector('.products').innerHTML='';
  document.querySelector('.book-loader').style.display='flex'; //show the book loader
  publishers.clear();

  if(sortFilter==='newest'){
    allBooksSortedNewest.forEach(book=>{
      publishers.add(book.publisherName);
      if(publisherFilter==='all'){
        if(book.salePrice*1000>=minPriceRange && book.salePrice*1000<=maxPriceRange)
         allFilteredBooks.push(book);        
      }
      else{
        if(book.salePrice*1000>=minPriceRange && book.salePrice*1000<=maxPriceRange && book.publisherName===publisherFilter)
        allFilteredBooks.push(book);
      }
    })
  }
  else{
    allBooks.forEach(book=>{
      publishers.add(book.publisherName);
      if(publisherFilter==='all'){
        if(book.salePrice*1000>=minPriceRange && book.salePrice*1000<=maxPriceRange)
         allFilteredBooks.push(book);        
      }
      else{
        if(book.salePrice*1000>=minPriceRange && book.salePrice*1000<=maxPriceRange && book.publisherName==publisherFilter)
        allFilteredBooks.push(book);
      }
    })

  }

    switch(sortFilter){
      case 'cheapest':
        //sorting them according to their price
        allFilteredBooks.sort((a,b)=> a.salePrice - b.salePrice);
      break;
      case 'mostExpensive':
        //sorting them according to their price 
        allFilteredBooks.sort((a,b)=> b.salePrice - a.salePrice);
      break;
    }

    //hide the book loader
    setTimeout(() => {
    document.querySelector('.book-loader').style.display='none';
    //adding new books to the container
    for (let i=(pageNumber-1)*12; i<pageNumber*12; i++) {
      if(i>allFilteredBooks.length-1)
      break;
      let cardTextContent;
      let discountBadge;
      //if the price of the book was more than 150, add the sale price and the discount badge
      if(allFilteredBooks[i].realPrice>150){
      cardTextContent=`
      <p class="real-price text-decoration-line-through text-center mb-0">${allFilteredBooks[i].realPrice},000</p>
      <p class="sale-price price text-center ">${allFilteredBooks[i].salePrice},000 <span>تومان</span></p>`;
      discountBadge=`
      <span class="badge discount-percent fs-6 px-1 px-md-2 pt-2 pt-md-3 pb-2">%30</span>`;
      }
      else{
        cardTextContent=`
        <p class="price text-center "> ${allFilteredBooks[i].realPrice},000 <span>تومان</span></p>`;
        discountBadge='';
      }
      //load data on the page
      document.querySelector(`.products`).insertAdjacentHTML('beforeend', `
      <div class="card user-select-none rounded-3" role="tabpanel" tabindex="0" data-OLID="${allFilteredBooks[i].id}">
      <i class="add-to-cart-btn fa-solid fa-plus p-2"></i>
      ${discountBadge}
      <a href="#" class="text-decoration-none" >
          <div class="text-center pb-2 pb-md-3 pt-3">
            <img src="https://covers.openlibrary.org/b/olid/${allFilteredBooks[i].id}-L.jpg" class="card-img-top" alt="bookPic">
          </div>
      </a>
          <div class="card-body d-flex flex-column justify-content-between p-0">
            <a class="card-title h5 text-center text-decoration-none my-2 px-2 px-md-3" href="#"><span>«</span>${allFilteredBooks[i].title}<span>»</span></a>
            <div class="card-text mb-2">
              ${cardTextContent}
            </div>
          </div>
      </div>
    
    `)
  }

    //add the book to cart by clicking on the .add-to-cart-btn
  /*  document.querySelectorAll('.add-to-cart-btn').forEach(btn=>{
     btn.addEventListener('click', ()=>{
       cartItems.push(btn.parentElement.dataset.olid);
       let orderCount=(cartItems.length<=5)?cartItems.length:"+5";
       document.querySelectorAll('.cart-icon .badge').forEach(cartIcon=> cartIcon.innerHTML=orderCount);
     })
  
  
    })
  */
    },3000);

  //remove previous publishers' names to the pub-list
  document.querySelectorAll('.pub-list li').forEach(li=>{
    li.remove();
  })

  //add new publishers' names to the pub-list
  document.querySelectorAll('.pub-list').forEach(list=>{
    publishers.forEach(pub=>{
      let liElem=document.createElement('li');
      liElem.innerHTML=pub;
      liElem.className='pub px-2 py-1';
      list.append(liElem);
      if(liElem.innerHTML===publisherFilter){
      liElem.classList.add('selected');
      }
      liElem.addEventListener('click', (event)=>{
        document.querySelectorAll('.pub-list li').forEach((li)=>{
          if(li.classList.contains('selected'))
          li.classList.remove('selected');
          if(li.innerHTML===liElem.innerHTML)
          li.classList.add('selected');

          publisherFilter=liElem.innerHTML;
        })
        document.querySelectorAll('.applied-filters .filters').forEach(box=>{
          box.querySelector('.publisher-filter')?.remove();
          box.insertAdjacentHTML('beforeend', `
          <div class="filter publisher-filter d-flex justify-content-between align-items-center">
          <i class="fa-solid fa-close me-2"></i>
          <p class="m-0">ناشر: ${liElem.innerHTML}</p>
        </div>`)
        })
        liElem.parentElement.scrollTop=0;
        sortAndFilterBooks(cParam,sortFilter,minPriceRange,maxPriceRange,publisherFilter);

    })
    })

  })

  //pagination 
  let pageCount=Math.ceil(allFilteredBooks.length/12);
  document.querySelectorAll('.applied-filters .paginationInfo').forEach(pi=>{
    pi.querySelector('.current-page').innerHTML= pageNumber;
    pi.querySelector('.page-count').innerHTML=pageCount;
  })
    
} 




export {loadDataInBoxesOnIndexPage, loadDataInBoxesOnCategoriesPage, sortAndFilterBooks} ; 
