//global variables
let publishers=new Set();
let cartItems=[];
let allBooks=[];
let allBooksSortedNewest=[];
let allFilteredBooks=[];
async function fetchAndLoadDetailsOfBooks(bookId, query){
       //for accessing the price of each book, we need tp fetch the more detaild data of each book
       try{
        const detailsOfEachBookRes = await fetch(`https://openlibrary.org/api/books?bibkeys=OLID:${bookId}&jscmd=details&format=json`);
        if(!detailsOfEachBookRes.ok)
        throw new Error('در حال حاضر سرور قادر به پاسخگویی نمی‌باشد. لطفاٌ بعدا امتحان کنید.')
        const detailsOfEachBookData =await detailsOfEachBookRes.json();

        for (const key in  detailsOfEachBookData) {
         publishers.add(detailsOfEachBookData[key].details.publishers[0]);
          let bookPrice=( detailsOfEachBookData[key].details.notes?.value===undefined)?  detailsOfEachBookData[key].details.notes?.substring(5,) :  detailsOfEachBookData[key].details.notes?.value.substring(5,);
          bookPrice=(isNaN(Number(bookPrice)))?Math.floor(Math.random()*(400-100)+100):bookPrice;
          let cardTextContent;
          let discountBadge;
          let salePrice;
          //if the price of the book was more than 150, add the sale price and the discount badge
          if(bookPrice>150){
          salePrice=Math.floor(bookPrice*0.7); //sale price is 70% of the actual price. It means the discount is 30%;
          cardTextContent=`
          <p class="real-price text-decoration-line-through text-center mb-0">${bookPrice},000</p>
          <p class="sale-price price text-center ">${salePrice},000 <span>تومان</span></p>`;
          discountBadge=`
          <span class="badge discount-percent fs-6 px-1 px-md-2 pt-2 pt-md-3 pb-2">%30</span>`;
          }
          else{
            salePrice=bookPrice;
            cardTextContent=`
            <p class="price text-center "> ${bookPrice},000 <span>تومان</span></p>`;
            discountBadge='';
          }
          //the href
          let href=`product.html?q=${bookId},${bookPrice},${salePrice}`
          //load data on the page
          document.querySelector(`${query}`).insertAdjacentHTML('beforeend', `
          <div class="card user-select-none rounded-3" role="tabpanel" tabindex="0" data-OLID="${bookId}">
          <i class="add-to-cart-btn fa-solid fa-plus p-2"></i>
          ${discountBadge}
          <a href="${href}" class="text-decoration-none" >
              <div class="text-center pb-2 pb-md-3 pt-3">
                <img src="https://covers.openlibrary.org/b/olid/${bookId}-L.jpg" class="card-img-top" alt="bookPic">
              </div>
          </a>
              <div class="card-body d-flex flex-column justify-content-between p-0">
                <a class="card-title h5 text-center text-decoration-none my-2 px-2 px-md-3" href="${href}"><span>«</span>${detailsOfEachBookData[key].details.title}<span>»</span></a>
                <div class="card-text mb-2">
                  ${cardTextContent}
                </div>
              </div>
          </div>
        
        `)}
       }
       catch(error){
        console.error('با یک ارور غیر منتظره مواجه شدیم:', error)
       }

}
//fetching book data for boxes on index page
async function loadDataInBoxesOnIndexPage(){
  let psychologyData;
  let poetryData;
  let foreignData;
  let fictionData;
    //fetch data for categories box
      //fetch up to 15 psychology book for the psychology category on the main page
      try{
      const psychologyRes=await fetch('https://openlibrary.org/subjects/روانشناسی.json?limit=15');
      if(!psychologyRes.ok)
      throw new Error('در حال حاضر سرور قادر به پاسخگویی نمی‌باشد. لطفاٌ بعدا امتحان کنید.')

      psychologyData=await psychologyRes.json();
      psychologyData.works.forEach((book)=>fetchAndLoadDetailsOfBooks(book.cover_edition_key, "#navPsychology .tab-pane-container"));
    
     }
     catch(error){
      console.error('با یک ارور غیر منتظره مواجه شدیم:', error)
     }

      //fetch up to 15 poetry book for the poetry category on the main page
      try{
      const poetryRes=await fetch('https://openlibrary.org/subjects/شعر.json?offset=6&limit=15');
      if(!poetryRes.ok)
        throw new Error('در حال حاضر سرور قادر به پاسخگویی نمی‌باشد. لطفاٌ بعدا امتحان کنید.')

        poetryData=await poetryRes.json();
        poetryData.works.forEach((book)=>fetchAndLoadDetailsOfBooks(book.cover_edition_key,"#navPoetry .tab-pane-container"));
        
       }
      catch(error){
        console.error('با یک ارور غیر منتظره مواجه شدیم:', error)
      }

      //fetch up to 15 english fantasy book for the foreign literature category on the main page
      try{
      const foreignRes=await fetch('https://openlibrary.org/subjects/fantasy.json?language=eng&limit=15');
      if(!foreignRes.ok)
      throw new Error('در حال حاضر سرور قادر به پاسخگویی نمی‌باشد. لطفاٌ بعدا امتحان کنید.')
     
      foreignData=await foreignRes.json();
      foreignData.works.forEach(async (book)=>fetchAndLoadDetailsOfBooks(book.cover_edition_key,"#navForeign .tab-pane-container"));

    }
      catch(error){
       console.error('با یک ارور غیر منتظره مواجه شدیم:', error)
      }

      //fetch up to 15 fiction book for the fiction category on the main page
      try{
      const fictionRes=await fetch('https://openlibrary.org/subjects/ادبیات_داستانی.json?limit=15');
      if(!fictionRes.ok)
      throw new Error('در حال حاضر سرور قادر به پاسخگویی نمی‌باشد. لطفاٌ بعدا امتحان کنید.')

      fictionData=await fictionRes.json();
      fictionData.works.forEach((book)=>fetchAndLoadDetailsOfBooks(book.cover_edition_key, "#navFiction .tab-pane-container"));
  
      }
      catch(error){
       console.error('با یک ارور غیر منتظره مواجه شدیم:', error)
      }


    //fetching data for sale box
    //I use the data we've already fetched to see the price of which book is more than 150, so i can apply the discount on it
    let allBooksData=[...psychologyData.works, ...foreignData.works, ...poetryData.works, ...fictionData.works];
    allBooksData.forEach(async (book)=>{
      //for accessing the price of each book, we need tp fetch the more detaild data of each book
      try{
        const detailsOfEachBookRes = await fetch(`https://openlibrary.org/api/books?bibkeys=OLID:${book.cover_edition_key}&jscmd=details&format=json`);
        if(!detailsOfEachBookRes.ok)
        throw new Error('در حال حاضر سرور قادر به پاسخگویی نمی‌باشد. لطفاٌ بعدا امتحان کنید.')
       
        const detailsOfEachBookData =await detailsOfEachBookRes.json();
        document.querySelector('.sale-box .book-loader').style.display='none'; //hiding book loader
        for (const key in  detailsOfEachBookData) {
          let bookPrice=( detailsOfEachBookData[key].details.notes?.value===undefined)?  detailsOfEachBookData[key].details.notes?.substring(5,) :  detailsOfEachBookData[key].details.notes?.value.substring(5,);
          let salePrice;
          if(bookPrice>150){
            salePrice=Math.floor(bookPrice*0.7); //sale price is 70% of the actual price. It means the discount is 30%;
            //the href
            let href=`product.html?q=${book.cover_edition_key},${bookPrice},${salePrice}`;
            //load data on the page
            document.querySelector('.sale-box .recommend-box-cards').insertAdjacentHTML('beforeend', `
            <div class="card user-select-none rounded-3" role="tabpanel" tabindex="0" data-OLID="${book.cover_edition_key}">
            <i class="add-to-cart-btn fa-solid fa-plus p-2 "></i>
            <span class="badge discount-percent fs-6 px-1 px-md-2 pt-2 pt-md-3 pb-2">%30</span>
            <a href="${href}" class="text-reset text-decoration-none">
                <div class="text-center pb-2 pb-md-3 pt-3">
                  <img src="https://covers.openlibrary.org/b/olid/${book.cover_edition_key}-L.jpg" class="card-img-top" alt="bookPic">
                </div>
            </a>
                <div class="card-body d-flex flex-column justify-content-between p-0">
                  <a class="card-title h5 text-decoration-none text-center my-2 px-2 px-md-3" href"${href}"><span>«</span>${book.title}<span>»</span></a>
                  <div class="card-text mb-2">
                    <p class="real-price text-decoration-line-through text-center mb-0">${bookPrice},000</p>
                    <p class="sale-price price text-center ">${salePrice},000 <span>تومان</span></p>
                  </div>
                </div>
            </div>
          `)
          }
          else
          salePrice=bookPrice;
  
        }
      }
      catch(error){
        console.error('با یک ارور غیر منتظره مواجه شدیم:', error)
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
      try{
      const detailsOfEachBookRes = await fetch(`https://openlibrary.org/api/books?bibkeys=OLID:${book.cover_edition_key}&jscmd=details&format=json`);
      if(!detailsOfEachBookRes.ok)
      throw new Error('در حال حاضر سرور قادر به پاسخگویی نمی‌باشد. لطفاٌ بعدا امتحان کنید.')
      const detailsOfEachBookData =await detailsOfEachBookRes.json();
      document.querySelector('.popular-box .book-loader').style.display='none'; //hiding book loader
      for (const key in  detailsOfEachBookData) {
        let bookPrice=( detailsOfEachBookData[key].details.notes?.value===undefined)?  Number(detailsOfEachBookData[key].details.notes?.substring(5,)) :  Number(detailsOfEachBookData[key].details.notes?.value.substring(5,));
        bookPrice= (typeof(pricebook)!=Number)? Math.floor(Math.random()*(400-100)+100): bookPrice;
        let cardTextContent;
        let discountBadge;
        let salePrice;
        //if the price of the book was more than 150, add the sale price and the discount badge
        if(bookPrice>150){
        salePrice=Math.floor(bookPrice*0.7); //sale price is 70% of the actual price. It means the discount is 30%;
        cardTextContent=`
        <p class="real-price text-decoration-line-through text-center mb-0">${bookPrice},000</p>
        <p class="sale-price price text-center ">${salePrice},000 <span>تومان</span></p>`;
        discountBadge=`
        <span class="badge discount-percent fs-6 px-1 px-md-2 pt-2 pt-md-3 pb-2">%30</span>`;
        }
        else{
          salePrice=bookPrice;
          cardTextContent=`
          <p class="price text-center "> ${bookPrice},000 <span>تومان</span></p>`;
          discountBadge='';
        }
        //the href
        let href=`product.html?q=${book.cover_edition_key},${bookPrice},${salePrice}`;
        //load data on the page
        document.querySelector('.popular-box .recommend-box-cards').insertAdjacentHTML('beforeend', `
        <div class="card user-select-none rounded-3" role="tabpanel" tabindex="0" data-OLID="${book.cover_edition_key}">
        <i class="add-to-cart-btn fa-solid fa-plus p-2"></i>
        ${discountBadge}
        <a href="${href}" class="text-reset text-decoration-none">
            <div class="text-center pb-2 pb-md-3 pt-3">
              <img src="https://covers.openlibrary.org/b/olid/${book.cover_edition_key}-L.jpg" class="card-img-top" alt="bookPic">
            </div>
        </a>
            <div class="card-body d-flex flex-column justify-content-between p-0">
              <a class="card-title h5 text-decoration-none text-center my-2 px-2 px-md-3" href"${href}"><span>«</span>${book.title}<span>»</span></a>
              <div class="card-text mb-2">
                ${cardTextContent}
              </div>
            </div>
        </div>
      `)}
      loadedBook++;
      }
      catch(error){
       console.error('با یک ارور غیر منتظره مواجه شدیم:', error)
      }

    }
    
   }

   addCartItems();

}
//fetching book data for products box on categories page
async function loadDataOnCategoriesPage(cParam){
  let category;
  let res;
  //show the book loader
  document.querySelector('.book-loader').style.display='flex';

  //fetching books data
  switch(cParam){
    case 'foreign':
      category='foreign';
      try{
      res=await fetch(`https://openlibrary.org/subjects/fantasy.json?language=eng&limit=70`);
      if(!res.ok)
      throw new Error('در حال حاضر سرور قادر به پاسخگویی نمی‌باشد. لطفاٌ بعدا امتحان کنید.')
      }
      catch(error){
       console.error('با یک ارور غیر منتظره مواجه شدیم:', error)
      }
      break;

    case 'psychology':
      category= 'روانشناسی';
      try{
      res=await fetch(`https://openlibrary.org/subjects/${category}.json?limit=70`);
      if(!res.ok)
       throw new Error('در حال حاضر سرور قادر به پاسخگویی نمی‌باشد. لطفاٌ بعدا امتحان کنید.')
      }
      catch(error){
       console.error('با یک ارور غیر منتظره مواجه شدیم:', error)
      }
      break;

    case 'poetry':
      category='شعر';
      try{
      res=await fetch(`https://openlibrary.org/subjects/${category}.json?offset=6&limit=70`);
      if(!res.ok)
       throw new Error('در حال حاضر سرور قادر به پاسخگویی نمی‌باشد. لطفاٌ بعدا امتحان کنید.')
      }
       catch(error){
       console.error('با یک ارور غیر منتظره مواجه شدیم:', error)
      }
      break;

    case 'fiction':
      category= 'ادبیات_داستانی';
      try{
      res=await fetch(`https://openlibrary.org/subjects/${category}.json?limit=70`);
      if(!res.ok)
       throw new Error('در حال حاضر سرور قادر به پاسخگویی نمی‌باشد. لطفاٌ بعدا امتحان کنید.')
      }
      catch(error){
       console.error('با یک ارور غیر منتظره مواجه شدیم:', error)
      }
      break;

    case 'education':
      category='آموزشی';
      try{
      res=await fetch(`https://openlibrary.org/subjects/${category}.json?limit=70`);
      if(!res.ok)
       throw new Error('در حال حاضر سرور قادر به پاسخگویی نمی‌باشد. لطفاٌ بعدا امتحان کنید.')
      }
      catch(error){
       console.error('با یک ارور غیر منتظره مواجه شدیم:', error)
      }
      break;
    default:
  }
  
  const data=await res.json();
  //geting the data about every book in this category and then putting their olid and price in the allBooks array
  let fetchPromises=data.works.map(async book=>{
    try{
      const detailsOfEachBookRes = await fetch(`https://openlibrary.org/api/books?bibkeys=OLID:${book.cover_edition_key}&jscmd=details&format=json`);
      if(!detailsOfEachBookRes.ok)
       throw new Error('در حال حاضر سرور قادر به پاسخگویی نمی‌باشد. لطفاٌ بعدا امتحان کنید.')
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
       allBooks.push({id:book.cover_edition_key, title:detailsOfEachBookData[key].details.title, realPrice: Number(realPrice), salePrice: Number(salePrice), publisherName, createdDate: detailsOfEachBookData[key].details.created.value });
     }
      }
    catch(error){
      console.error('با یک ارور غیر منتظره مواجه شدیم:', error)
    }

  })
  await Promise.all(fetchPromises);
  allBooksSortedNewest =[...allBooks].sort((a,b)=> new Date(b.createdDate) - new Date(a.createdDate)); //sort all books from the newest one to the oldest one

}


function sortAndFilterBooks(cParam, sortFilter, minPriceRange, maxPriceRange, publisherFilter, pageNumber, makePaginationBtns, addRemovingEventsToAppliedFilter){
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
        if(book.salePrice*1000>=minPriceRange && book.salePrice*1000<=maxPriceRange && book.publisherName===publisherFilter)
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
    if(allFilteredBooks.length===0){
      document.querySelector('.products').insertAdjacentHTML('afterbegin', `
      <div class="d-flex flex-column justify-content-center align-items-center mt-2">
      <img src="Assets/Images/Illustrations/sad face.svg" alt="errorPic" id="notFoundPic">
      <p class="not-found-message">متاسفانه کتابی پیدا نشد.</p>
    </div>
      `);
    }
    else{
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
        //the href
        let href=`product.html?q=${allFilteredBooks[i].id},${allFilteredBooks[i].realPrice},${allFilteredBooks[i].salePrice}`
        //load data on the page
        document.querySelector(`.products`).insertAdjacentHTML('beforeend', `
        <div class="card user-select-none rounded-3" role="tabpanel" tabindex="0" data-OLID="${allFilteredBooks[i].id}">
        <i class="add-to-cart-btn fa-solid fa-plus p-2"></i>
        ${discountBadge}
        <a href="${href}" class="text-decoration-none" >
            <div class="text-center pb-2 pb-md-3 pt-3">
              <img src="https://covers.openlibrary.org/b/olid/${allFilteredBooks[i].id}-L.jpg" class="card-img-top" alt="bookPic">
            </div>
        </a>
            <div class="card-body d-flex flex-column justify-content-between p-0">
              <a class="card-title h5 text-center text-decoration-none my-2 px-2 px-md-3" href="${href}"><span>«</span>${allFilteredBooks[i].title}<span>»</span></a>
              <div class="card-text mb-2">
                ${cardTextContent}
              </div>
            </div>
        </div>
      
      `)
    }
    
    addCartItems()
  
    }

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
        sortAndFilterBooks(cParam,sortFilter,minPriceRange,maxPriceRange,publisherFilter,pageNumber, makePaginationBtns,addRemovingEventsToAppliedFilter);
        
        //make new page buttons and go to the first page
        pageNumber=1;
        if(pageCount>4){
          nextPageBtn.style.display='block';
        }
        makePaginationBtns();
        //add events for removing
        document.querySelectorAll('.applied-filters .publisher-filter i.fa-close').forEach(closeIcon=>{
        addRemovingEventsToAppliedFilter(closeIcon);
        })


      })
    })

  })

  //pagination 
  let pageCount=Math.ceil(allFilteredBooks.length/12);
  document.querySelectorAll('.applied-filters .paginationInfo').forEach(pi=>{
    pi.querySelector('.current-page').innerHTML=(allFilteredBooks.length===0)?0: pageNumber;
    pi.querySelector('.page-count').innerHTML=pageCount;
  })
} 

function addCartItems(){
    let cartCount;
    let orderCount;
    if(JSON.parse(localStorage.getItem('cartItems'))!=null){
      cartCount=JSON.parse(localStorage.getItem('cartItems')).length;
    }
    else{
      localStorage.setItem('cartItems',JSON.stringify(cartItems));
      cartCount=JSON.parse(localStorage.getItem('cartItems')).length;
    }
    orderCount=(cartCount<=5)?cartCount:"+5";
    document.querySelectorAll('.cart-icon .badge').forEach(cartIcon=> cartIcon.innerHTML=orderCount);
    

    //add the book to cart by clicking on the .add-to-cart-
    document.querySelectorAll('.add-to-cart-btn').forEach(btn=>{
     btn.addEventListener('click', ()=>{
      if(JSON.parse(localStorage.getItem('cartItems'))!=null)
       cartItems=[...JSON.parse(localStorage.getItem('cartItems'))];

       cartItems.push({olid:btn.parentElement.dataset.olid});
       localStorage.setItem('cartItems', JSON.stringify(cartItems));

      cartCount=JSON.parse(localStorage.getItem('cartItems')).length;
      orderCount=(cartCount<=5)?cartCount:"+5";
      document.querySelectorAll('.cart-icon .badge').forEach(cartIcon=> cartIcon.innerHTML=orderCount);
      

       //show the addToCart alert 
       let addToCartAlert=document.getElementById('addToCartToast');
       let addToCartToast = new bootstrap.Toast(addToCartAlert);
       addToCartToast.show();

    })
  })

}

//fetching the book data on product page
async function loadDataOnProductPage(bookParamsObj){
  try{
    const bookRes = await fetch(`https://openlibrary.org/api/books?bibkeys=OLID:${bookParamsObj.id}&jscmd=data&format=json`);
    if(!bookRes.ok)
    throw new Error('در حال حاضر سرور قادر به پاسخگویی نمی‌باشد. لطفاٌ بعدا امتحان کنید.')
    const bookData =await bookRes.json();
    
    for(const key in bookData){
      let subject;
      let allSubjects=['روانشناسی', 'شعر', 'ادبیات داستانی', 'آموزشی'];
      (allSubjects.some(s=>s===bookData[key].subjects[0].name))?subject=bookData[key].subjects[0].name:subject='ادبیات خارجی';
      document.querySelector('.breadcrumb .subject').innerHTML=subject;
      document.querySelector('.breadcrumb .active').innerHTML=bookData[key].title;
      document.getElementById('bookTitle').innerHTML=bookData[key].title;
      document.getElementById('authorName').innerHTML=bookData[key].authors[0].name;
      document.getElementById('bookPic').setAttribute('src', bookData[key].cover.large);
      let isbn=(bookData[key].identifiers.isbn_13===undefined)?'9085895728136':bookData[key].identifiers.isbn_13[0];
      document.getElementById('ISBN').innerHTML=isbn;
      document.getElementById('bookId').innerHTML=bookParamsObj.id;
      document.getElementById('publisher').innerHTML=bookData[key].publishers[0].name;
      document.getElementById('pageCount').innerHTML=bookData[key].number_of_pages;
      document.getElementById('publishDate').innerHTML=bookData[key].publish_date;

      let priceElementContent;
      if(bookParamsObj.salePrice===bookParamsObj.realPrice){
        priceElementContent=`<p class="sale-price text-center mb-md-2">${bookParamsObj.salePrice},000<span class="ms-2">تومان</span></p>`;
      }
      else{
        document.getElementById('badgeContainer').insertAdjacentHTML('beforeend', `
        <div class="discount-badge rounded-circle">%30</div>
        `);
        priceElementContent=`
        <p class="real-price text-center mb-0 mb-lg-1">${bookParamsObj.realPrice},000</p>
        <p class="sale-price text-center mb-md-2">${bookParamsObj.salePrice},000<span class="ms-2">تومان</span></p>`
      }
      document.getElementById('price').insertAdjacentHTML('beforeend', priceElementContent);

      //load data in recommmendedBookBox
      let recommendedRes;
      if(subject==='ادبیات خارجی')
       recommendedRes=await fetch(`https://openlibrary.org/subjects/fantasy.json?sort=random`);
       else if(subject==='ادبیات داستانی')
       recommendedRes=await fetch(`https://openlibrary.org/subjects/ادبیات_داستانی.json?sort=random`);
      else
       recommendedRes=await fetch(`https://openlibrary.org/subjects/${subject}.json?sort=random`);
      let recommendedData=await recommendedRes.json();
   
      let fetchPromises= recommendedData.works.map(async book=>{
        await fetchAndLoadDetailsOfBooks(book.cover_edition_key, '#recommendedBooksBox');
      })

      await Promise.all(fetchPromises);

      addCartItems()


    }
  
    const bookDetailsRes = await fetch(`https://openlibrary.org/api/books?bibkeys=OLID:${bookParamsObj.id}&jscmd=details&format=json`);
    if(!bookRes.ok)
    throw new Error('در حال حاضر سرور قادر به پاسخگویی نمی‌باشد. لطفاٌ بعدا امتحان کنید.')
    const bookDetailsData =await bookDetailsRes.json();
    for (const key in bookDetailsData) {
      let editionNum=(bookDetailsData[key].details.edition_name===undefined)?1:bookDetailsData[key].details.edition_name;
      document.getElementById('editionNum').innerHTML=editionNum;
      let physicalCover=(bookDetailsData[key].details.physical_format===undefined)?'شومیز':bookDetailsData[key].details.physical_format;
      document.getElementById('physicalCover').innerHTML=physicalCover;
      if(bookDetailsData[key].details.contributors && bookDetailsData[key].details.contributors[0].role==="Translator")
      document.querySelector('.book-info .part1').insertAdjacentHTML('afterbegin', `
      <p><i class="fa-solid fa-circle me-2"></i> مترجم: <span id="translator">${bookDetailsData[key].details.contributors[0].name}</span></p>
      `)
      if(bookDetailsData[key].details.description===undefined)
      document.getElementById('aboutThisBookText').innerHTML='توضیحی برای این کتاب درج نشده است.';
      else if(bookDetailsData[key].details.description && bookDetailsData[key].details.description.value===undefined)
      document.getElementById('aboutThisBookText').innerHTML=bookDetailsData[key].details.description;
      else if(bookDetailsData[key].details.description || bookDetailsData[key].details.description.value)
      document.getElementById('aboutThisBookText').innerHTML=bookDetailsData[key].details.description.value;


    }

    
  
  }
  catch(error){
    console.error('با یک ارور غیر منتظره مواجه شدیم:', error)
  }

}

export {loadDataInBoxesOnIndexPage, loadDataOnCategoriesPage, sortAndFilterBooks, loadDataOnProductPage} ; 
