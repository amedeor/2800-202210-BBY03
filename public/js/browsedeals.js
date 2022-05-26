"use strict";

getAllDeals();

// Retrieves and populates all posted deals onto the page
async function getAllDeals() {
  let dealsContainer = document.querySelector("#deals");

  let response = await fetch("/get-all-deals");
  
  let parsedResponse = await response.json();

  console.log(parsedResponse);
  
    dealsContainer.innerHTML = "";
  
    //allDeals is the name of the variable that holds the json sent from the server
    for (let deal of parsedResponse.allDeals) {
  
      let dealContainer = document.createElement("div");
  
      //set the id of the deal container to the id of the specific deal
      dealContainer.setAttribute("id", deal.deal_id);
      dealContainer.setAttribute("class", "deal-container");
  
      let dealIdParagraph = document.createElement("p");
      dealIdParagraph.setAttribute("id", "dealidparagraph");
      let dealIdSpan = document.createElement("span");
  
      let userIdParagraph = document.createElement("p");
      userIdParagraph.setAttribute("id", "useridparagraph");
      let userIdSpan = document.createElement("span");
  
  
      let dealNameParagraph = document.createElement("p");
      dealNameParagraph.setAttribute("id", "dealnameparagraph");
      let dealNameSpan = document.createElement("span");
  
  
      let dealPriceParagraph = document.createElement("p");
      dealPriceParagraph.setAttribute("id", "dealpriceparagraph");
      let dealPriceSpan = document.createElement("span");
  
  
      let dealPostDateParagraph = document.createElement("p");
      dealPostDateParagraph.setAttribute("id", "dealpostdateparagraph");
      let dealPostSpan = document.createElement("span");
  
  
      let dealExpiryDateParagraph = document.createElement("p");
      dealExpiryDateParagraph.setAttribute("id", "dealexpirydateparagraph");
      let dealExpiryDateSpan = document.createElement("span");
  
  
      let dealDescriptionParagraph = document.createElement("p");
      dealDescriptionParagraph.setAttribute("id", "dealdescriptionparagraph");
      let dealDescriptionSpan = document.createElement("span");
  
  
      let dealStoreLocationParagraph = document.createElement("p");
      dealStoreLocationParagraph.setAttribute("id", "dealstorelocationparagraph");
      let dealStoreLocationSpan = document.createElement("span");
  
  
      //This block of code to calculate the local time using the built in JavaScript getTimezoneOffset() function is from 
      //https://stackoverflow.com/questions/7403486/add-or-subtract-timezone-difference-to-javascript-date
      //with adaptatations made to display the local date and time using the built in JavaScript toLocaleDateString() function
      let dateTimeFromSQL = deal.deal_post_date_time;
      let localDateTime = new Date(dateTimeFromSQL);
      localDateTime.setMinutes(localDateTime.getMinutes() - localDateTime.getTimezoneOffset());
  
      let slicedDealPostDate = deal.deal_post_date_time.slice(0, 10);
      let dealPostTimeLocalFormat = localDateTime.toLocaleTimeString();
      let slicedDealExpiryDate = deal.deal_expiry_date.slice(0, 10);
  
      dealIdParagraph.insertAdjacentText("beforeend", "Deal ID: ");
      dealIdSpan.insertAdjacentText("beforeend", deal.deal_id);
  
      userIdParagraph.insertAdjacentText("beforeend", "User ID: ");
      userIdSpan.insertAdjacentText("beforeend", deal.user_id);
  
      dealNameParagraph.insertAdjacentText("beforeend", "Deal Name: ");
      dealNameSpan.insertAdjacentText("beforeend", deal.deal_name);
  
      dealPriceParagraph.insertAdjacentText("beforeend", "Price: ");
      dealPriceSpan.insertAdjacentText("beforeend", deal.deal_price);
  
      dealPostDateParagraph.insertAdjacentText("beforeend", "Post Date: ");
      dealPostSpan.insertAdjacentText("beforeend", `${slicedDealPostDate} at ${dealPostTimeLocalFormat}`);
  
      dealExpiryDateParagraph.insertAdjacentText("beforeend", "Deal Expiry Date: ");
      dealExpiryDateSpan.insertAdjacentText("beforeend", slicedDealExpiryDate);
  
      dealDescriptionParagraph.insertAdjacentText("beforeend", "Description: ");
      dealDescriptionSpan.insertAdjacentHTML("beforeend", deal.deal_description);
  
      dealStoreLocationParagraph.insertAdjacentText("beforeend", "Store Location: ")
      dealStoreLocationSpan.insertAdjacentText("beforeend", deal.deal_store_location);
  
      dealContainer.insertAdjacentElement("beforeend", dealIdParagraph);
      dealIdParagraph.insertAdjacentElement("beforeend", dealIdSpan);
  
      dealContainer.insertAdjacentElement("beforeend", userIdParagraph);
      userIdParagraph.insertAdjacentElement("beforeend", userIdSpan);
  
      dealContainer.insertAdjacentElement("beforeend", dealNameParagraph);
      dealNameParagraph.insertAdjacentElement("beforeend", dealNameSpan);
  
      dealContainer.insertAdjacentElement("beforeend", dealPriceParagraph);
      dealPriceParagraph.insertAdjacentElement("beforeend", dealPriceSpan);
  
      dealContainer.insertAdjacentElement("beforeend", dealPostDateParagraph);
      dealPostDateParagraph.insertAdjacentElement("beforeend", dealPostSpan);
  
      dealContainer.insertAdjacentElement("beforeend", dealExpiryDateParagraph);
      dealExpiryDateParagraph.insertAdjacentElement("beforeend", dealExpiryDateSpan);
  
      dealContainer.insertAdjacentElement("beforeend", dealDescriptionParagraph);
      dealDescriptionParagraph.insertAdjacentElement("beforeend", dealDescriptionSpan);
  
      dealContainer.insertAdjacentElement("beforeend", dealStoreLocationParagraph);
      dealStoreLocationParagraph.insertAdjacentElement("beforeend", dealStoreLocationSpan);
  
      let photosContainer = document.createElement("div");
      photosContainer.setAttribute("id", "photoscontainer");
  
      for (let photo of deal.photos) {
        let photoElement = document.createElement("img");
        photoElement.setAttribute("id", photo.photo_id);
        photoElement.setAttribute("src", photo.photo_url);
        photoElement.setAttribute("class", `dealphoto ${photo.photo_id}`);
        photosContainer.insertAdjacentElement("beforeend", photoElement);
  
      //put the photos container inside the deal container
      dealContainer.insertAdjacentElement("beforeend", photosContainer);
    
      dealsContainer.insertAdjacentElement("beforeend", dealContainer);
    }
  }
}

