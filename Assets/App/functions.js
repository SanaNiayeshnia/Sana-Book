
async function fetchAndLoadDetailsOfBooks(bookId, query){
       //for accessing the price of each book, we need tp fetch the more detaild data of each book
       const detailsOfEachBookRes = await fetch(`http://openlibrary.org/api/books?bibkeys=OLID:${bookId}&jscmd=details&format=json`);
       const detailsOfEachBookData =await detailsOfEachBookRes.json();

       for (const key in  detailsOfEachBookData) {
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
//fetching book data for boxes
async function loadDataInBoxesOnIndexPage(cartItems){
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

async function loadDataOnCategorisePage(cParam){
 let category;
 //removing previous books from the products box
 while(document.querySelector('.products').firstChild){
  document.querySelector('.products').firstChild.remove()
 }
 //show the book loader
 document.querySelector('.book-loader').style.display='flex';
 //adding new books
switch(cParam){
  case 'foreign':
    category='ادبیات خارجی';
    const foreignRes=await fetch(`http://openlibrary.org/subjects/fantasy.json?language=eng&limit=12`);
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
          document.querySelector(`.main-sec .products`).insertAdjacentHTML('beforeend', `
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
    break;
  case 'psychology':
    category= 'روانشناسی';
      const psychologyRes=await fetch(`http://openlibrary.org/subjects/روانشناسی.json?limit=12`);
      const psychologyData=await psychologyRes.json();
      psychologyData.works.forEach((book)=>fetchAndLoadDetailsOfBooks(book.cover_edition_key, '.main-sec .products'));
    break;
  case 'poetry':
    category='شعر';
    const poetryRes=await fetch(`http://openlibrary.org/subjects/شعر.json?offset=6&limit=12`);
    const poetryData=await poetryRes.json();
    poetryData.works.forEach((book)=>fetchAndLoadDetailsOfBooks(book.cover_edition_key,'.main-sec .products'));
    break;
  case 'fiction':
    category= 'ادبیات داستانی';
    const fictionRes=await fetch(`http://openlibrary.org/subjects/ادبیات_داستانی.json?limit=12`);
    const fictionData=await fictionRes.json();
    fictionData.works.forEach((book)=>fetchAndLoadDetailsOfBooks(book.cover_edition_key,'.main-sec .products'));
    break;
  case 'education':
    category='آموزشی';
    const educationRes=await fetch(`http://openlibrary.org/subjects/آموزشی.json?limit=12`);
    const educationData=await educationRes.json();
    educationData.works.forEach((book)=>fetchAndLoadDetailsOfBooks(book.cover_edition_key, '.main-sec .products'));
    break;
}
//hide the book loader
document.querySelector('.book-loader').style.display='none';

document.querySelector('.title-sec .breadcrumb .active').innerHTML=category;
document.querySelector('.title-sec .category-title').innerHTML=category;
}

async function sortAndFilterBooks(cParam, sortFilter, minPriceRange, maxPriceRange){
  let category;
  let bookArray=[];
  let publishers=new Set();
  let res;
  //show the book loader
  document.querySelector('.book-loader').style.display='flex';
  //removing previous books from the products box
  while(document.querySelector('.products').firstChild){
    document.querySelector('.products').firstChild.remove()
  }
  //fetching books data
  switch(cParam){
    case 'foreign':
      category='foreign';
      if(sortFilter==='newest')
      res=await fetch(`http://openlibrary.org/subjects/fantasy.json?language=eng&sort=new&limit=100`);
      else
      res=await fetch(`http://openlibrary.org/subjects/fantasy.json?language=eng&limit=100`);
      break;

    case 'psychology':
      category= 'روانشناسی';
      if(sortFilter==='newest')
      res=await fetch(`http://openlibrary.org/subjects/${category}.json?sort=new&limit=100`);
      else
      res=await fetch(`http://openlibrary.org/subjects/${category}.json?limit=100`);
      break;

    case 'poetry':
      category='شعر';
      if(sortFilter==='newest')
      res=await fetch(`http://openlibrary.org/subjects/${category}.json?offset=6&sort=new&limit=100`);
      else
      res=await fetch(`http://openlibrary.org/subjects/${category}.json?offset=6&limit=100`);
    
      break;
    case 'fiction':
      category= 'ادبیات داستانی';
      if(sortFilter==='newest')
      res=await fetch(`http://openlibrary.org/subjects/${category}.json?sort=new&limit=100`);
      else
      res=await fetch(`http://openlibrary.org/subjects/${category}.json?limit=100`);
    
      break;
    case 'education':
      category='آموزشی';
      if(sortFilter==='newest')
      res=await fetch(`http://openlibrary.org/subjects/${category}.json?sort=new&limit=100`);
      else
      res=await fetch(`http://openlibrary.org/subjects/${category}.json?limit=100`);
    
      break;
    default:
  }
  const data=await res.json();
  //geting the data about every book in this category and then putting their olid and price in the bookArray
  let fetchPromises;
  fetchPromises=data.works.map(async book=>{
    const detailsOfEachBookRes = await fetch(`http://openlibrary.org/api/books?bibkeys=OLID:${book.cover_edition_key}&jscmd=details&format=json`);
    const detailsOfEachBookData =await detailsOfEachBookRes.json();
    for (const key in  detailsOfEachBookData) {
      publishers.add(detailsOfEachBookData[key].details.publishers[0]);
      let bookPrice=( detailsOfEachBookData[key].details.notes?.value===undefined)?  detailsOfEachBookData[key].details.notes?.substring(5,) :  detailsOfEachBookData[key].details.notes?.value.substring(5,);
      if(category==='foreign'){
        bookPrice=Math.floor(Math.random()*(600-100)+100);
      }
      let realPrice=bookPrice;
      if(bookPrice>150)
      bookPrice=Math.floor(bookPrice*0.7); //their price with discount
      if(bookPrice*1000>=minPriceRange && bookPrice<=maxPriceRange)
      bookArray.push({id: book.cover_edition_key, title: detailsOfEachBookData[key].details.title, price: Number(bookPrice), realPrice:realPrice}); }
    })
  await Promise.all(fetchPromises);
  document.querySelectorAll('.pub-list').forEach(list=>{
    publishers.forEach(pub=>{
      let liElem=document.createElement('li');
      liElem.innerHTML=pub;
      liElem.className='pub px-2 py-1';
      list.append(liElem);
    })

  })
    switch(sortFilter){
      case 'cheapest':
        //sorting them according to their price
        bookArray.sort((a,b)=> a.price - b.price);
      break;
      case 'mostExpensive':
        //sorting them according to their price 
        bookArray.sort((a,b)=> b.price - a.price);
      break;
    }

    //hide the book loader
    document.querySelector('.book-loader').style.display='none';

    //adding new books to the container
    for (let i=0; i<bookArray.length; i++) {
      if(i===12){
        break;
      }
      let cardTextContent;
      let discountBadge;
      //if the price of the book was more than 150, add the sale price and the discount badge
      if(bookArray[i].realPrice>150){
      cardTextContent=`
      <p class="real-price text-decoration-line-through text-center mb-0">${bookArray[i].realPrice},000</p>
      <p class="sale-price price text-center ">${bookArray[i].price},000 <span>تومان</span></p>`;
      discountBadge=`
      <span class="badge discount-percent fs-6 px-1 px-md-2 pt-2 pt-md-3 pb-2">%30</span>`;
      }
      else{
        cardTextContent=`
        <p class="price text-center "> ${bookArray[i].price},000 <span>تومان</span></p>`;
        discountBadge='';
      }
      //load data on the page
      document.querySelector(`.products`).insertAdjacentHTML('beforeend', `
      <div class="card user-select-none rounded-3" role="tabpanel" tabindex="0" data-OLID="${bookArray[i].id}">
      <i class="add-to-cart-btn fa-solid fa-plus p-2"></i>
      ${discountBadge}
      <a href="#" class="text-decoration-none" >
          <div class="text-center pb-2 pb-md-3 pt-3">
            <img src="https://covers.openlibrary.org/b/olid/${bookArray[i].id}-L.jpg" class="card-img-top" alt="bookPic">
          </div>
      </a>
          <div class="card-body d-flex flex-column justify-content-between p-0">
            <a class="card-title h5 text-center text-decoration-none my-2 px-2 px-md-3" href="#"><span>«</span>${bookArray[i].title}<span>»</span></a>
            <div class="card-text mb-2">
              ${cardTextContent}
            </div>
          </div>
      </div>
    
    `)}
  

}

  
export {loadDataInBoxesOnIndexPage,loadDataOnCategorisePage, sortAndFilterBooks} ; 
