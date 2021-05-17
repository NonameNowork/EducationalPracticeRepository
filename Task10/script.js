window.onload = () => {

    class AdList {
        _adList = [];
        
        constructor (adList){
            this._adList = adList.slice();
        }
    
        getCountAds(){
            return this._adList.length;
        }

        getOffers(){
            return this._adList;
        }
    
        get(id){
            if (typeof id === 'string'){
                return this._adList.find(item => item.id == id);
            }
            else{
                console.log('Incorrect type of id!');
            }
        }
    
        getPage(skip = 0, top = 10, paramFilter){
            if (typeof skip !== 'number' || typeof top !== 'number') {
                console.log('Error with inputting types!');
                return;
            }
        
            let returningAdsList = this._adList.concat();
            if (paramFilter){
                for (let param in paramFilter){
                    if (param === 'hashtags'){
                        for (let i = 0; i < paramFilter.hashtags.length; i++){
                            returningAdsList = returningAdsList.filter(item => item.hashtags.includes(paramFilter.hashtags[i]));
                        }
                    }
                    else if (param === 'vendor'){
                        returningAdsList = returningAdsList.filter(item => item.vendor === paramFilter.vendor);
                    }
                    else if (param === 'dateFrom'){
                        returningAdsList = returningAdsList.filter(item => new Date(item.createdAt) >= new Date(paramFilter.dateFrom));
                    }
                    else if (param === 'dateTo'){
                        returningAdsList = returningAdsList.filter(item => new Date(item.createdAt) < new Date(paramFilter.dateTo));
                    }
                }
            }
            returningAdsList.sort(comparator);
            //if(this._adList.length >= top){
                return returningAdsList.slice(skip, skip + top);
            /*}
            else{
                return returningAdsList.slice(skip, skip + this._adList.length);
            }*/
            function comparator(first, second) {
                return  new Date(second.createdAt) - new Date(first.createdAt);
            }
        }
    
        getCountAdsFilter(skip, top, paramFilter){
            if (typeof skip !== 'number' || typeof top !== 'number') {
                console.log('Error with inputting types!');
                return;
            }
        
            let returningAdsList = this._adList.concat();
            if (paramFilter){
                for (let param in paramFilter){
                    if (param === 'hashtags'){
                        for (let i = 0; i < paramFilter.hashtags.length; i++){
                            returningAdsList = returningAdsList.filter(item => item.hashtags.includes(paramFilter.hashtags[i]));
                        }
                    }
                    else if (param === 'vendor'){
                        returningAdsList = returningAdsList.filter(item => item.vendor === paramFilter.vendor);
                    }
                    else if (param === 'dateFrom'){
                        returningAdsList = returningAdsList.filter(item => new Date(item.createdAt) >= new Date(paramFilter.dateFrom));
                    }
                    else if (param === 'dateTo'){
                        returningAdsList = returningAdsList.filter(item => new Date(item.createdAt) < new Date(paramFilter.dateTo));
                    }
                }
            }
            return returningAdsList.length;
        }
    
        static validate (adItem){
            let parameters = ['id', 'description',  'createdAt', 'link', 'vendor', 'photoLink', 'validUntil', 'discount', 'hashtags'];
            for(let i = 0; i < parameters.length; i++){
                if(adItem[parameters[i]] == undefined){
                    return false;
                }
            }
        
            for(let param in adItem){
                switch (param){
                    case 'id':
                        if(typeof adItem.id !== 'string' || adItem.id.length === 0){
                            return false;
                        }
                        break;
                    case 'description':
                        if(typeof adItem.description !== 'string' || adItem.description.length >= 200 || adItem.description.length === 0){
                            return false;
                        }
                        break;
                    case 'createdAt':
                        if(Object.prototype.toString.call(new Date(adItem.createdAt)) !== '[object Date]'){
                            return false;
                        }
                        break;
                    case 'link':
                        if(typeof adItem.link !== 'string' || adItem.link.length === 0){
                            return false;
                        }
                        break;
                    case 'vendor':
                        if(typeof adItem.vendor !== 'string' || adItem.vendor.length === 0){
                            return false;
                        }
                        break;
                    case 'hashtags':
                        if (adItem.hashtags){
                            if (!adItem.hashtags.every(item => typeof item === 'string')){
                                return false;
                            }
                        }
                        break;
                    case 'validUntil':
                        if(Object.prototype.toString.call(new Date(adItem.validUntil)) !== '[object Date]'){
                            return false;
                        }
                        break;
                    case 'photoLink':
                        if(typeof adItem.photoLink !== 'string' || adItem.photoLink.length === 0){
                            return false;
                        }
                        break;
                    case 'discount':
                        if(typeof adItem.discount !== 'string' || adItem.discount.length === 0){
                            return false;
                        }
                        break;
                    case 'reviews':
                        if (adItem.reviews){
                            if (!adItem.reviews.every(item => typeof item === 'string')){
                                return false;
                            }
                        }
                        break;
                    case 'rating':
                        if(typeof adItem.rating !== 'number' || adItem.rating.length === 0){
                            return false;
                        }
                        break;
                    default:
                        console.log('Something went wrong :(');
                        return false;
                }
            }
            return true;
        }
    
        add(adItem){
            if(AdList.validate(adItem)){
                if (this._adList.filter(offer => offer['id'] === adItem['id']).length === 0){
                    this._adList.push(adItem);
                    return true;
                }
                else{
                    console.log('this offer can\'t added, because your collection containes offer with this id');
                    return false;
                }
            }
            else{
                console.log('offer isn\'t validated');
                return false;
            }
        }
    
        edit(id, adItem){
            for(let parameteres in adItem){
                if(parameteres === 'id' || parameteres === 'vendor' || parameteres === 'createdAt'){
                    console.log('you can\'t change id, vendor name, createdAt');
                    return false;
                }
            }
            
            let cloneOffer = {};
            let bufOffer = this.get(id);
            for(let key in bufOffer){
                cloneOffer[key] = bufOffer[key];
            }
            for(let param in adItem){
                cloneOffer[param] = adItem[param];
            }
            if(!AdList.validate(cloneOffer)){
                console.log('new offer isn\'t validated');
                return false;
            }
            
            for (let key in cloneOffer){
                bufOffer[key] = cloneOffer[key];
            }
            return true;
        }
    
        remove(id){
            if (typeof id === 'string'){
                let index = this._adList.findIndex(offer => offer.id === id);
                if (index !== -1){
                    this._adList.splice(index, 1);
                    return true;
                }
            }
            return false;
        }
    
        addAll(adList){
            let unvalidatedOffers = adList.filter(offer => !this.add(offer));
            return unvalidatedOffers;
        }
    
        clear(){
            this._adList.splice(0, this._adList.length);
        }
    }
    
    class View {
        _offers;
        _username;
        _vendorStatus;
        _tegOffersList;
        _offerTmp;
        _blockOffers;
    
        constructor(offerList, username, vendorStatus){
            this._offers = new AdList(offerList);
            this._username = username;
            this._vendorStatus = vendorStatus;
            this._tegOffersList = document.querySelector('.offers_list');
            this._offerTmp = document.querySelector('.offer');
            this._blockOffers = document.querySelector('.section_position');
            let deletedOffer = document.querySelector('.offer');
            deletedOffer.remove();
        }

        getOfferById(id) {
            return this._offers.get(id);
        }
    
        getCountOffers(){
            return this._offers.getCountAds();
        }
    
        showStatus(){
            if(this._username === null || this._username.length === 0) {
                document.querySelector('.Sign_in').textContent = 'Log in';
                document.querySelector('.door').style.visibility = 'hidden';
            }
            else{
                document.querySelector('.Sign_in').textContent = this._username;
                document.querySelector('.door').style.visibility = 'visible';
            }
        }
    
        _links = [
            'https://png.pngtree.com/element_our/20190530/ourlarge/pngtree-cartoon-game-character-sprint-competition-image_1252973.jpg',
            'https://qph.fs.quoracdn.net/main-qimg-1eee2256d2263b0d1601804c5bc87a8d',
            'https://api.time.com/wp-content/uploads/2017/06/pikachu-most-influential-game-characters.jpg?quality=85',
            'https://api.time.com/wp-content/uploads/2017/06/vault-boy-most-influential-game-characters1.jpg?quality=85',
            'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/sonic-1594326838.jpg?crop=1xw:1xh;center,top&resize=480:*'
        ]

        _fillOffer(offer){
            var newOffer = document.importNode(this._offerTmp, true);
            var imageIndex = Math.min(Math.floor(Math.random() * this._links.length), this._links.length);
            newOffer.querySelector('.photo').setAttribute('src', this._links[imageIndex]);
            newOffer.querySelector('.discount').textContent = offer.discount + '%';
            offer.validUntil = new Date(offer.validUntil);
            newOffer.querySelector('.validUntil').textContent = "Valid to: " + offer.validUntil.getDate() + "." + (offer.validUntil.getDate() + 1) + "." + offer.validUntil.getFullYear();
            newOffer.querySelector('.vendor_name').textContent = offer.vendor;
            offer.hashtags.forEach(tag => {
                newOffer.querySelector('.hashtags').textContent += "#" + tag + " ";
            });
            newOffer.querySelector('.short_description').textContent = offer.description;
            offer.reviews.forEach(comment => {
                let review = document.createElement('span');
                review.textContent = comment;
                newOffer.querySelector('.comments').append(review);
                newOffer.querySelector('.comments').append(document.createElement('br'));
            });
            newOffer.querySelector('.link_to_website').textContent = offer.link;
            newOffer.querySelector('.link_to_website').setAttribute('href', offer.link);
            newOffer.querySelector('.rating').textContent = offer.rating + ' / 5 rating';
            if(this._username === null || this._username.length === 0){
                // guest
                newOffer.querySelector('.icons').style.visibility = 'hidden';
                document.querySelector('.buttonAdd_newOffer').style.visibility = 'hidden';
            }
            else if(this._vendorStatus === true){
                // vendor
                if(!(this._username == offer.vendor)){
                    newOffer.querySelectorAll('.iconCustomer').forEach(bottom => bottom.style.visibility = 'hidden');
                }
                else{
                    newOffer.querySelector('.button_delete_offer').addEventListener('click', handleDeleteOffer(offer.id));
                    newOffer.querySelector('.button_edit_offer').addEventListener('click', handleEditOffer(offer.id));
                }
                newOffer.querySelector('.iconComment').style.visibility = 'hidden';
                document.querySelector('.buttonAdd_newOffer').style.visibility = 'visible';
            }
            else{
                // client
                newOffer.querySelectorAll('.iconCustomer').forEach(bottom => bottom.style.visibility = 'hidden');
                document.querySelector('.buttonAdd_newOffer').style.visibility = 'hidden';
                //let iddd = offer.id;
                //newOffer.querySelector('.iconComment').removeEventListener('click');
                newOffer.querySelector('.iconComment').addEventListener('click', handleAddReviewOffer(offer.id));
            }
            return newOffer;
        }
    
        showOffers(skip = 0, top = 10, paramFilter){
            document.querySelectorAll('.offer').forEach(offer => offer.remove());
            let button = document.querySelector('.button_load_more');
            this._offers.getPage(skip, top, paramFilter).forEach(offer => button.before(this._fillOffer(offer)));
            let length = this._offers.getCountAdsFilter(skip, top, paramFilter);
            if(top >= length){
                document.querySelector('.button_load_more').style.visibility = 'hidden';
            }
            else{
                document.querySelector('.button_load_more').style.visibility = 'visible';
            }
        }
    
        addOffer(offer){
            if(this._offers.add(offer)){
                this.showOffers();
                return true;
            }
            return false;
        }
    
        removeOffer(id){
            if(this._offers.remove(id)){
                return true;
            }
            return false;
        }
    
        editOffer(id, offer){
            if(this._offers.edit(id, offer)){
                this.showOffers();
                return true;
            }
            return false;
        }
    
        getSignInPage(){
            return `<div class="sign_in_wrapper">
            <p class="sign_in_text">Enter your login and password</p>
            <div class="input_items">
                <input class="sign_in_input" id="sign_in_input1" placeholder="Login" autocomplete="off">
                <input class="sign_in_input" id="sign_in_input2" placeholder="Password" autocomplete="off">
                 <div class="sign_in_wrapper_chechbox">
                     <div class="sign_in_wrapper_vendor">
                        <input class="sign_in_chechbox_vendor" type="checkbox">
                        <a>Vendor</a>
                    </div>
                    <div class="sign_in_wrapper_client">
                        <input class="sign_in_chechbox_client" type="checkbox">
                        <a>Client</a>
                    </div>
                 </div>
                <button class="sign_in_button">Sign in</button>
            </div>
        </div>`
        }
    
        getAddOfferPage(){
            return `<div class="add_offer_wrapper">
            <div class="add_offer_columns">
                <div class="column_1">
                    <p class="add_offer_text">Enter your Service name</p>
                    <input class="add_offer_serviceName add_offer_items" placeholder="Service name">
                    <p class="add_offer_text">Enter short description</p>
                    <textarea class="add_offer_shortDescription add_offer_items" placeholder="Short description" type="text"></textarea>
                </div>
                <div class="column_2">
                    <p class="add_offer_text">Enter link to your website</p>
                    <input class="add_offer_link add_offer_items" placeholder="Link">
                    <p class="add_offer_text">Enter hashtags</p>
                    <textarea class="add_offer_hashtags add_offer_items" type="text" placeholder="hashtags"></textarea>
                    <p class="add_offer_text">Enter duration of your offer</p>
                    <input class="add_offer_validUntil add_offer_items" type="date">
                    <p class="add_offer_text">Enter discount</p>
                    <input class="add_offer_discount add_offer_items" placeholder="Discount">
                </div>
                <div class="column_3">
                    <p class="add_offer_text">Enter link to Photo</p>
                    <input class="add_offer_linkToPhoto add_offer_items" placeholder="PhotoLink">
                </div>
            </div>
            <button class="add_offer_button">Add Offer</button>
        </div>`
        }

        getEditOfferPage() {
            return `<div class="add_offer_wrapper">
            <div class="add_offer_columns">
                <div class="column_1">
                    <p class="add_offer_text">Edit short description</p>
                    <textarea class="add_offer_shortDescription add_offer_items" placeholder="Short description" type="text"></textarea>
                </div>
                <div class="column_2">
                    <p class="add_offer_text">Edit link to your website</p>
                    <input class="add_offer_link add_offer_items" placeholder="Link">
                    <p class="add_offer_text">Edit hashtags</p>
                    <textarea class="add_offer_hashtags add_offer_items" type="text" placeholder="hashtags"></textarea>
                    <p class="add_offer_text">Edit duration of your offer</p>
                    <input class="add_offer_validUntil add_offer_items" type="date">
                    <p class="add_offer_text">Edit discount</p>
                    <input class="add_offer_discount add_offer_items" placeholder="Discount">
                </div>
                <div class="column_3">
                    <p class="add_offer_text">Edit link to Photo</p>
                    <input class="add_offer_linkToPhoto add_offer_items" placeholder="PhotoLink">
                </div>
            </div>
            <button id="edit_offer_button" class="add_offer_button">Edit Offer</button>
        </div>`
        }
    
        logOut(){
            this._username = '';
            this._vendorStatus = false;
            localStorage.removeItem('user');
            localStorage.removeItem('status');
        }
    
        logIn(){
            if(this._username == ''){
                document.querySelector('.section_position').remove();
                let sign_in = document.createElement('section');
                sign_in.className = 'sign_in section_position';
                sign_in.innerHTML = this.getSignInPage();
                document.querySelector('.container').after(sign_in);
            }
        }
        goToMainPage() {
            document.getElementsByTagName('section')[0].remove();
            document.querySelector('.container').after(this._blockOffers);
            document.querySelector('.door').style.visibility = 'visible';
        }
        sign_in(skip, top, paramFilter){
            let login = document.getElementById('sign_in_input1').value;
            let password = document.getElementById('sign_in_input2').value;
            let vendorCheckbox = document.querySelector('.sign_in_chechbox_vendor');
            let clientCheckbox = document.querySelector('.sign_in_chechbox_client');
            if(login != '' && password != '' && (vendorCheckbox.checked || clientCheckbox.checked)){
                document.querySelector('.section_position').remove();
                document.querySelector('.container').after(this._blockOffers);
                this._username = login;
                if(vendorCheckbox.checked){
                    this._vendorStatus = true;
                }
                else {
                    this._vendorStatus = false;
                }
                
                localStorage.setItem('user', this._username);
                localStorage.setItem('status', JSON.stringify({'status':this._vendorStatus}));

                this.showStatus();
                this.showOffers(skip, top, paramFilter);
            }
            else if((login == '' && password != '') || (login != '' && password == '')){
                alert('Enter login and password !');
            }
            
        }
        goToAddOfferPage(){
            document.querySelector('.section_position').remove();
            let addPage = document.createElement('section');
            addPage.className = 'add_offer';
            addPage.innerHTML = this.getAddOfferPage();
            document.querySelector('.container').after(addPage);
        }

        _getNewOfferFromAddPage(){
            let addedOffer = {};
            //addedOffer.id = (this._offers.getCountAds() + 1).toString();
            addedOffer.id = ((new Date()).getTime()).toString();
            addedOffer.description = document.querySelector('.add_offer_shortDescription').value;
            addedOffer.createdAt = new Date();
            addedOffer.link = document.querySelector('.add_offer_link').value;
            addedOffer.vendor = this._username;
            addedOffer.photoLink = document.querySelector('.add_offer_linkToPhoto').value;
            addedOffer.hashtags = document.querySelector('.add_offer_hashtags').value.split(' ');
            addedOffer.discount = document.querySelector('.add_offer_discount').value;
            addedOffer.validUntil = new Date(document.querySelector('.add_offer_validUntil').value);
            addedOffer.rating = 0;
            addedOffer.reviews = ['No reviews'];
            return addedOffer;
        }
        goToMainPageFromAddPage (skip, top, paramFilter){
            this._offers.add(this._getNewOfferFromAddPage());
            this.save();
            this.goToMainPage();
            this.showOffers(skip, top, paramFilter);
        }
        goToEditOfferPage(id){
            document.querySelector('.section_position').remove();
            let editPage = document.createElement('section');
            editPage.className = 'add_offer';
            editPage.innerHTML = this.getEditOfferPage();
            editPage.querySelector('.add_offer_shortDescription').textContent = this._offers.get(id).description;
            editPage.querySelector('.add_offer_link').value = this._offers.get(id).link;
            this._offers.get(id).hashtags.forEach(hashtag => editPage.querySelector('.add_offer_hashtags').textContent += hashtag + ' ');
            let month = this._offers.get(id).validUntil.getMonth().toString();
            if(month.length === 1){
                month = '0' + month;
            }
            let buf_untilDate = this._offers.get(id).validUntil.getFullYear() + '-' + month + '-' + this._offers.get(id).validUntil.getDate();
            editPage.querySelector('.add_offer_validUntil').setAttribute('value', buf_untilDate);
            editPage.querySelector('.add_offer_discount').value = this._offers.get(id).discount;
            editPage.querySelector('.add_offer_linkToPhoto').value = this._offers.get(id).photoLink;
            document.querySelector('.container').after(editPage);
        }
        _getNewOfferFromEditPage(id, createdAt, rating, reviews){
            let addedOffer = {};
            addedOffer.id = id;
            addedOffer.description = document.querySelector('.add_offer_shortDescription').value;
            addedOffer.createdAt = createdAt;
            addedOffer.link = document.querySelector('.add_offer_link').value;
            addedOffer.vendor = this._username;
            addedOffer.photoLink = document.querySelector('.add_offer_linkToPhoto').value;
            addedOffer.hashtags = document.querySelector('.add_offer_hashtags').value.split(' ');
            addedOffer.discount = document.querySelector('.add_offer_discount').value;
            addedOffer.validUntil = new Date(document.querySelector('.add_offer_validUntil').value);
            addedOffer.rating = rating;
            addedOffer.reviews = reviews;
            return addedOffer;
        }
        goToMainPageFromEditPage (id, createdAt, rating, reviews,  skip, top, paramFilter){
            this._offers.add(this._getNewOfferFromEditPage(id, createdAt, rating, reviews));
            this.goToMainPage();
            this.showOffers(skip, top, paramFilter);
            this.save();
        }
        addNewReviewOffer(idd, newReview) {
            this.getOfferById(idd).reviews.push(newReview);
        }

        save(){
            localStorage.setItem('offers', JSON.stringify(this._offers.getOffers()));
        }
    }

    localStorage.clear();
    if(localStorage.getItem('offers') == null) {
        localStorage.setItem('offers', JSON.stringify([
            {
                id: '1',
                description : 'Компьютеры со скидкой 40%',
                createdAt : new Date('2021-04-10T20:12:32'),
                link : 'https://PC.pl',
                vendor : 'German',
                photoLink : 'data:image/jpeg;base64,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',
                hashtags : ['PC', 'CS', 's1mple', 'BSU'],
                discount : '40',
                validUntil : new Date('2021-05-10T20:12:32'),
                rating : 3.8,
                reviews : ['Xbox is better!'],
            },
            {
                id: '2',
                description : 'Компьютеры со скидкой 2%',
                createdAt : new Date('2021-04-16T20:12:32'),
                link : 'https://PC.pl',
                vendor : 'Artyom',
                photoLink : 'data:image/jpeg;base64,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',
                hashtags : ['PC', 'CSGO', 's1mple'] ,
                discount : '2',
                validUntil : new Date('2021-05-16T20:12:32'),
                rating : 4.2,
                reviews : ['Xbox is better!'],
            },
            {
                id: '3',
                description : 'Компьютеры со скидкой 44%',
                createdAt : new Date('2021-04-12T20:12:32'),
                link : 'https://PC.pl',
                vendor : 'Pasha',
                photoLink : 'data:image/jpeg;base64,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',
                hashtags : ['PC', 'CS', 'ACER','s1mple'],
                discount : '44',
                validUntil : new Date('2021-05-12T20:12:32'),
                rating : 4.4,
                reviews : ['Xbox is better!', 'MacBook is the best computer !', 'MacOS is the best OS'],
            },
            {
                id: '4',
                description : 'Компьютеры со скидкой 7%',
                createdAt : new Date('2021-04-14T20:12:32'),
                link : 'https://PC.pl',
                vendor : 'Masha',
                photoLink : 'data:image/jpeg;base64,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',
                hashtags : ['PC', 'CS', 's1mpletop1'],
                discount : '25',
                validUntil : new Date('2021-05-14T20:12:32'),
                rating : 3.1,
                reviews : ['Xbox is better!'],
            },
            {
                id: '5',
                description : 'Компьютеры со скидкой 7%',
                createdAt : new Date('2021-04-18T20:12:32'),
                link : 'https://PC.pl',
                vendor : 'German',
                photoLink : 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHCBYWFRgWFhYZGRgaGhoYGhgYGBoaGhwYGBoZGhkYGBocIS4lHB4rIRgYJjgmKy8xNTU1GiQ7QDszPy40NTEBDAwMEA8QHhISHzQkJCQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NP/AABEIAOEA4QMBIgACEQEDEQH/xAAbAAACAgMBAAAAAAAAAAAAAAAEBQMGAAECB//EADsQAAEDAwEFBgUDBAIABwAAAAEAAhEDBCExBRJBUWEGInGBkaETscHR8DJCUhQj4fEVYgcWcoKSorL/xAAZAQADAQEBAAAAAAAAAAAAAAABAgMABAX/xAAiEQACAgIDAQEAAwEAAAAAAAAAAQIRITEDEkFRExQiMgT/2gAMAwEAAhEDEQA/APQKFVSCul9J6x1RRky0UNBUlQ1X4KiY9Q3L0yYrRq3q95NalXAVcoVO95ps9/dTWCgijVyu6lZL6NTK7qPQbwFLJt9wuqFWUveSTCZWNmcFx7p4j7FJFtsaSSR3UcTot07RxGSApq263TPUoJ+0WsJJMjkmcqFUbCWbHDv1Ox0RVvswMPddjkQhbfaLXaLTdpmSCTC3ZG6sebqzdASV926ZHRSUdoOxI/0t+iN0YXc2bXfuhItoWppkcWnQp+yu13RaurQVG7pOJBnj4BFSsVqiusqGEHWr5Vubs9gBDR56+ip22aO4/Ua6TJ9lngKyFUa6kfWSu3qKd70nYfqN6dWQgLg95d0H4Q9Z+U20KsMIYIC06ouN/CHdUykf9Rm7GFKoubl8oVlVT70hSlzUT7UwfeKxTQFiT90HsapuUb3rii9RvcryZWKGNJ+Aorl65pOwFFdORTwZoFo1O8mr391Iabu+mxd3EUwNG6VTKaW1DePRJrQ98Kz03QBAAx0TLIjdGnMYwfo9UDWvge60LL+uYOUjNy1kumTwWbCkG3dzH6jA5Sk9zeN0z4oG7uy4kuJ9vuoWXLTg+sYKhKVlYxoOoXRaQRzEI9m0u8Z0cOPDP+UtfQgbzTIOY5FaYcevvlBNoNWOre9LnBs8x8o+aNZXzPDSPJV2wMFx5T6iITPZ1fed4LORuo4ZXcEdbbQnBSh78wpGO8llJrRnFMsdOqOCgrWFF/6mtJ58Uut7kjipqdXdfE65GVVcmCThkGuezzW5YT4H6JDdMLHQcK53NdwaSGhyo+0rnffMbvRaTRo36GUHYQ9d+VxRrYXFV0lZSD1bCt/CXXNeCiS/CV3eqEmPCIZb3Eo014CS2rysvLqApSgmhHC2Nf6rqsVb/rOq0k/NG/ItNNRF+UbWpQgHtyrSGiHUDhc3LV1YsmE0NqCmWgS2VcN76ZNd3UVWsADKFrsgFFAN2Ld54Tu6rNZynmdUl2KYc55/aMTzSnau0Dv4d4n7St2pGUbY12rfkM6mB69B8lXdpVt2BAPsi725lrCMydTHtKWXJL39PVJJ2MkRUGPecDHHko70AECY5/VGX94KTIBAxJJwABx6KgXvaWXy2SAckwJHGBr+cEOl6D2rZ6Ebghog4j3WqNx3vb6fVIdn3pewEZHBP7agYnnCUawm3bLiBz+yNse4/pI9D/tQWDZeUxvqW7B4I0ZsytejfmQMnz6p/ZsZUbg5Xh/avadX+oDWuLNACQCJ3iDvThoGD4FWPsl2xNOoKVZzTIaWPbIa4HEEH9LsafJUUKVtYJOVuls9KqUnNMH3CX7WlhY8cNc/4TutVa9ocOIlLr6g2owsJg6gzkHhhTaWUh4vTY1srnfaCDqFUtss/uO+YTTs7XLSWO1BhAdoxu1pjDgD48Ct2/qFpKQuYCtmVtrxqoa90AhFsdMke/CEeZOVA+9kwFp0rSHQwpgRhLNo050XTarkTRp76ybaNSTEfwStqyf8eFiFMNoaPrbyGcMoe0fKIqOynkQiGWjoCMdfBvFLKL8JftR5GieOhJbLB/XBy1VtnOExA5nAVY2fcHfG8VZa9YbkkmOQP2WsAuvqzA0Ma0P56keMDB81UNu1gCGtEAxgcpgDHVMrjaJlwHiefQJM9jqjxjIz4cvRJJ2isVQz2pU3GU5yQ2egwl9tfb2Rnw+6M21DiBwI9GgYSbs0wOaejj7EpW22bRx2l2fVrNG67/28+ipg2PW3g3cM+y9YOmngudn2cvL38PwBVg2lglJJvIJsTYxYxjDqGifE5KtFla8Fqm0DJEAa+P3RVjVDz+gxzOEOuQ2T22yw1xM6n2R1W2xC6pHhj1RTTwPrKzRrPPO0nY8Vn77HFp4xz08px6KDYXYpky8lz8a5j7BejmnnI8VlGy3HFwiD0Ri21TA0k7Rqjs/cYA08EJdSNfUSnNN/NKttN6x1lJS8GTfouZdD4jO8Znpn0TLtBR36UxJbmeMKuuqAPYJkyOHDpzVvuqe8wweH55IfRl4eeVd5LaweSrG+21Sq8ZBwpO9F8LINZWeU2ZRUNkJR+5ATZQLTArinAQ9pXhyJuag0QuEwmRp/VrEr31i1mtjS2IXdU5UFE5UlR8FNISIwsqchdXVoCorK4CMqVFFSkmJJ5FzLBocDCk2rchjCDqdApm1MpZ2mpHcDuRHziPdUU7NHLKq14aHvdzIAnjxJ8PouLa47riBqfWdB4LVRrTgjALgBzdJyfSVyyoButH8gStZYJun4aTnEH3H0QfZuoIeB/N3pJKJrVA5mNQCT5E/dI9hXG7UcyZ72J4SPBBPIGsFwZUJMD7DzKaWoyGjhkpdTa1jd7UnRF7Ka8Ne9x/UYHgqxJy+m76+axw3ngYPd6DJyqtedtN15yAOA1d6DRTdpqTnMkZLTvRzjgvMKriSSdSTPiq8ftkpvxHow7Zvlu8InQuJ8yNFdthbbdUEOcNDnlHA+i8JYHOAAJJA7on5e/orP2HZVNRzSXBjhGSf1TqB5HKdpNMRNpnvez6geNZHVENdq3kUs2Yd1rUxrsmHCZ4x0XPWC6dmyIVW7YbYFJuTGQMjjywrRXf3SdF4723rmrWa0GYe3EwdR6+SXSGStjbZtRz6zDMEkFelsq5jhC867L0t6u3/rlXqi7ecfE+xUov0pJLCK7tKqGVHAfngllZu8VLfUXfFfvcCfSZU1O3T4DTIqbICjuLrCYOpCErvKSHbI1YAXVHE4CmZSLkTbMEIhkBbZqaQL/RrEZ8QLFqQtkVN+V1cOUNI5UldPImju0flNxoklk7Kcl/dU3DshZI4pug5XW3SPgzrBwgH1co0MD2Fp/CpKDizRVMoD9fCTHU4HzQz3Bpnr/gfnRWHbmziHF7BjEjwVSrk7xnoPmmbousjmg3uaahILaluVy4j18Tw1VmbikPCfTCQUXQ+eJMjoOabTFbwXKyp78Z5Y/NE5cA1gEkHVKdhEbg5ymNxVdkCCPl5roisEJMSbVcBOs5gA/NeebZs2OdvMweIGh69FdNpXAkjE/nuqxclrSZyTAA/PVOnQjVleNk4EK59k3bsNEzz4z4nRIWXDt6SyWyYPL7p7skNDgWyBrB106+SNtg6nrOyXyGgmVZKLcRoql2cqNI/Vn7q1UHj6IUaxX2hfuM3RqV5JtW3JeHHPeBnz4r1DtVWO9ESI6+o5FUl9mXO3m5mQRoZ/zjTxUeRF+NjbsU4Gs6dY9lZ7R0OI6n5qn9jnEXBHT5xCtVzVFMOJwf8ABOPRRjotLYt7RVwKo5kCfuhqdxhB7SuhUfvcIj3J+q5a+Ai02zeBpuhOVldocEprPM4R1u4xlPGNAbIwyF09+FHc3ABUdF5KSSyPGWKNysUqxY2DVvqpLp2ENanKIuRhVeiCB7V/eTg1O6k9BmUya2RCEXSNIBqVMptZvJGAgXWaYbKtXOcAPVaLU3QjeLC6OyH1ASQI6/JV/tN2VYGFzD3xBgaGcR7L0Go/caGkyUmvWggz/lXfDHrRNcsrs86Lf7YZxjd+X1QVO3AMkdTnSNBorHcWzmu3twGSTB4cM8ig6luM/RQ6NZLuaeDvZtTBDcSurzaADTvyDzGZQjWlmQuy5tQbr8H2W7OgUmKK9JzyN3jmTwXbtnHADZjJMZVgoWDQBJRQfkNAx/I/ZFSaA4oro2YI/R7c/wAKNp7EJaMbsaHin4afwLmo/SSfzimcmKonWz7Woxo73HkrPaNzvOJ8ylVrRLiDwwm72SIWVszaQp2wS8oawsDvTCavo8ITPZlnoSj1tm7UiuDYT6FYVWiWOJP/AKZyWkcuRSXtReu+M5pJDdR5jX85r1Z7ARBGNF512y2UQ6dQNCNQORC0uGsoMea6sqbLolTU6xJUFJgmAi208hTUSjkHsZIlR17rdEImme6ke1XQU0sIEXbMfWLnIqk8hKrN+U3bok2hrJt8rSi+IsS0Gyege8UZVHdS+k7vFHvd3U7YqQMwwUaytCXg5Wrl+EtWqNJDtl02FLY1SHjcE9AqhSvXAwrHsKr3gSwu5Ac0vDCpknFpFkvnPiSCEseTxKeXr3FuRHTUqu3JPBdzwSQDfPEYXm3aPaFxTqmHQ0wWxx/kD1n2V8vQYJJVevrVtUFrmyD+SORUu2clFEU7K7Uh0Nq4d/IDB+ybU7+jUDnh4IaY5ZVO2lsJ7DLZcOX7h90q+I4AtyBMkdQj0jLRuzWz1Cx2ix8hjwS3UfXwTSld6ZleZVaBoWzHAubUrOkRj+20AzIPElvuu6XaGs2nEjHdDiMnSJ8i7KH5vw3f6elXN8dBpxPiPnou7aqXnwED1VT2Jt5tYta6k8xq7elg9T7K2XFWnTbvucGAj9TyGiOgOvgMrKD9M5oeWt1uxJTuhUByDK89s9tMf3Kcvc4d1zmuazeBMCDDjnwVq2bWeA1zxBiHt0g8SOmqaqEux/Tt5MplRxol9CuBoZBR1N6bCBkMa9B7WsGVWODsGNRr/lTsBK42i6Kbsu0/bqimCjye9s/hvLeuCNCtAZW715LzM6nXJWNUJFgoHCr21nZT2cJFtMJJ6KRWQK1fBTdlXCVWzcpm1mFNaG9M+IsXO6sQGD2tO8UeD3VupTErUId7JRlYMQuLhuEyo2vNR3rIBRjNaHbTENBneV77KsI726YjXh5yqhs+ye9+6MScEgx6r0KyY+lSDXRMfmeKtxRd9mS5ZKqIdoVZJyklYSdUVeVnEmIPRKnXHe5dHaevBUlISMSG5tx1J6oIW7szgeATcwenQn6qGpTJx/tKMKH2c65HNV3a+xmFxlvCZGo8PZXXdDRGp5JXe2w3jumCYBnlIOfMBbRilbesn1nbzAd2mxrGtOO43iPM6JGbd28ylBBJ4j9ziB5wI916Lc2jmh+kEua3EGGx3vWfdBMtYc3EwQ70T92sMHX4Kds7UfbllG3IYAwFzg1u/LpxvkSMQcRqktG5Lny+Xk6lznOJwYkk51Vo2hsNlR5f3998Z3xAgR3Ru4EDiSutmdlaW+N5z3cS2QBHiAs5YwNFL1GuztJz3hgBDW/qgFu6BkdRlen2LN5gBJnmllhs9jG7jWhsHQDPi48SndmwDEpUwPIRQbGBKa2xQdJh1KNpMRQjDKZU7mSCDxUNLCIaVSIrPOu02yNx5eJg80mFNeh9pLXfYqC5sGDwU5KmUi7RhbhINqhWJwwkW02qc9FI7F1pqnDdEptxlNQe6pLRT04hYtbyxAYbV6kLKNVCV6wlc03Spcas54LA3beBS0LR9cw0jz+qWW9EkjxV32Zaii0zE8PBdXDwpO2CbrQRZ24osDd0Tx456Ia7uSZIyt17knT5pTXrGcwPHA9dF0yfwmkD3NR0zu+uEKboHD2A+ClrVHHgPLK4+ECJI8hlRZVEBbTPNo81I1jIABnwXL7URMQo6VrI3mmDOvRAJK0hpJKy0t2VKsvIDWic9AST4wMdSFly2RA1wudn1Nx+cA4kiQDpnoU0XkSWifalJhcA1xLHiRvEHLjug9HA7umoJSqtbhrQTxH0Vhuae62Xljnn9DWkEAjIdgkAyG+iUVG77BzHD2KMhYgDGd0ECZHst2LYfz8DEHxUrqEMAld2cNhrhjhCmVHlOiZ3iZIwAdIRrGwAQJPGEuowCCRjimbH7okackyFYfTcYEIym4wldF7Had3wRjIH7j7ogoY0HniUawpVTd/pH0XposWSJatMOBBVM25sLdJc0yDn/auwKiuaIe0ggHlIkTzVGlIRNo8xewgZSLaQV12vahri3U9AqrtG1K5ZusMtCSbElHVHOPdQjWQUwYyQpouAbxW0b8ALFjEFwDKZWNKQo7polOez9Il43WB3iUeNXgnpDnYmyyO+4CCIIx8j/tMLpjYjIRdasQIIjnCAqt3uOOpXZSSpELbdim5cG/uQdS8aRD3fROTYMPEn5eqHr7CY7hHopux1QhfTZq0g+J+y5bUYP3nwzC52rsSpSO+wFzRwCDZtDTfbHzHkpvGx6+Dtjt4RwULwQd5ug06+KFp13ngAznJOOiPbcNLcBHYNHAuQ45EE46Su3UxHzQzg3eI4HPhCnpVeBOfn1RQCC5G48OGmi7YZkhbrZHNdURC3pjhgxKhMHTUn0RD3AAg8/ZC7+R6oMyGNKvgSOBB+6KoXLQQJg8ZSN9y1o1zr5+C3RupIJEfmUUYfm5cH8PKE0tqs6yqxdVwX7wOOXRNbW6JieWIxj1yg5JBUWywMc0aQEVSrt/kEqtmsdktzpqfcI+jasGiKkBxGVKoDopggabI0U9KrOFWMiUogG19mh4LgYIGeqo20aYEr0utTDmlp4hUDa9sGvc0OBAPBR54rYI4ZTqjO8jaLcKa4oZRNlSkLncqR1qWAP4ZWJt8BaU/1N2EV287wCuPZSgQN7pr9kkfsKsXA7nuFcNk2fw6feBnrB9Cu7hg07aJTkqpElep6oZ9SNSJ6fUlRVXOJJ/S0cSRPkFlKgXZieQ6cyqvJNYNG46ev05rn4x4fnoi/6EnJPupP6NvQ+n0U2iiYIahjInp/gqv7b2S17d9mHCC5o0jjCstdnDRL3S12vHRTY6yVJlxvEM0A16AcFODJHIFC7XcKVR4jUjPQ5x8kPQvRgE5/MJqED7s4J8/Dog2XJAz+BQXl/gxpMegyoRW3jjl80GFDizui4x1TVrhHnCrVo/dd+ao9lYxEzJnw6rRZmho9oIj88Erva254rqpdHTz+yRPvS55J4Y99UzAF/EbJBOmXTqXHSVj7uGz4/nsqrVve+4g/qIJ8v9qy2to54DtGCJJx6dVOT+DxS9Ddl03OzJk6HgfX5YVtsKJA5g+GEBsiiwAbtNz+rumMA6aKx2z2cGFvSFkhmzq3xr6/dMmOjw+RUVHdJx6IplKMcDoikI2TMdiVM2ChaOJB0+SIpMjRUiTkS1AS0hpgxgqlbQtXh53o11Cu4OFX73Zz3uJBAnql/wChNxXVWJFW8lSuKK3Qp7qsTthPPFvquB2cqfyZ6riXFytVRVySQmlYnf8A5cqfyb6rFv4/J8E7L6MWPbyK4u63d+ij+KAdZ/8Alj2WfHZ3nEiGiZJwvYZMgc5rQC/XHd0An+UfJSP2luiABPh9FV7bbHxq790H4dPO/wDyfyH5/npt4HESdXQDx3RklSbHSH1xtzcDd9wLnGAOqkfcseQNHenvwVbogVblxiWUmgNzjedkmOcR6psymd/I5A/b5qbdlEHbw0JkaSdQeCAuaJDkU6qZEZgHeHgQB9V0928wOiDxHKFNoZMoPbc99h4bnuCfuqVcX+7lOe2z6z6x3QC0YCp1a2rO1YfJUSFG9LaJdDeknzTixuRE/mNVUra3e3O6fNFMqvbzSy2YuFO6EbwPEfnzRtG6aJBPCfUqhUb8sJ3ifAAwuLnbLiTBOei0UzMt20dqtbvZz04BVG42ySSQOOPL/KArXpdxyhCZTxhf+hXJLQ42NZuuK7GA4MF50Aa3JLjw5L1B9tuuYwPaW6QJwAqT2GoHcqvByS1vkBJ//Q9FaGVP7oZ/0JPSCD9/VLyVdDRurLDYXrQD3ZIcBvGZIMnHLRMrHaP9/wCGDPcBgnMkuBb5Rx5qv2YJc0jQEDxyY+qn2Ywf11w/QNbTyeB3Q4x5uCCyFl3ovB1b3geHHwPOEfReHAe3NLbRpIzrw+Y+cKSxr73eHNMKMN8SRxUtPB1QNV26+ZwhztDvQEU6A1Y+ChcwIRt87+K7L97UHyVE7J1R28R/tYwjl7qINP4JXW4TxRo1ksN6rFx8HqVtajWhLUpAj9R9B6pPtG336b6ZMB4IkTI5H5Kx/wBOeMeCX39u2JE+v3TtAs8urvqWzHUctcf38C2dWpJbXR+IwPe6ASTk8s6c1du0z3vbuNZMdPqvOK9rX+I1zqTwAchonu8VBqnRSLLbS2o+ixrmxNSpvkHi3gD4N+Svmy9rMrkFuurhxEc49l4vWNwHk/De4Tghp04CIVg7L7RrsqEuo1GtLd09x32QSwNeT0fYt42s57hP6jnhiBHkmF68MYTzmPSFSuzN5VbWIdSe2mS4CRAAkkOjrPurXeVN840GiNAsrdSwaTJAk8Vr/i2HgFYmWoOsKYWbVqNZVf8Ahgf2D88Fp2xW/wAGq3C2C0aQ4LdAdikv2G3+DfRBXOwW/wAB6SvQjbqJ9og4m7HllfZIbqz/AOqFfs9v8fZeqVtkNdqEDV7NtKR8bGUylbKqMo0nzDcznmcBbsNotDqj3vA/YPCcnzwrJddiw8EE4ONUkrf+GpIhtVwHIkEfJMo/TOR3YdpA57GtYckCTz3hmPI+qLutovovuKsA71ZrI4QabI9InyS2j/4d3DXAtuAIMiWk/VM77sXXquDvjhud5wDZl0Abxk8gj1F7F07O7eZXjdMOEd10SYyXfNa2HcsFzUpb0bzi4AnwdA9Pmq5svsa+nJ/qHycS1rAQOQxhWPY2xm0ZMlzjq90Fx84T0LY+vIcemnpxUbGAcFoEKQFajWStIUzHj+Xshg4LoEIpAbDA/wD7LoPQfxF38T8hMKFb/VYhfiHmsRMF1dT+cUv2ksWImK9dapZXWlinLYyImaotixYlG9JqeqOpLFiKMyc6BdvWliIDGrQWLETG1oLFiBjH6ei0sWLGNLCsWIGNBdFYsRMdsRVNbWIAM/csCxYsY7Yu1ixMgHTVgWLEwDaxYsWMf//Z',
                hashtags : ['PC', 'CSGO', 's1mple'],
                discount : '11',
                validUntil : new Date('2021-05-18T20:12:32'),
                rating : 4.3,
                reviews : ['Xbox is better!'],
            },
            {
                id: '6',
                description : 'Компьютеры со скидкой 7%',
                createdAt : new Date('2021-04-20T20:12:32'),
                link : 'https://ghost-writers.ru',
                vendor : 'Rodion',
                photoLink : 'data:image/jpeg;base64,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',
                hashtags : ['PC', 'CS', 's1mple'],
                discount : '10',
                validUntil : new Date('2021-05-20T20:12:32'),
                rating : 4.8,
                reviews : ['Xbox is better!'],
            }
        ]));
    }
    let myOffers = JSON.parse(localStorage.getItem('offers'));
    var view;
    if(localStorage.getItem('user') == null && localStorage.getItem('status') == null){
        view = new View(myOffers, '', false);
    }
    else{
        view = new View(myOffers, localStorage.getItem('user'), JSON.parse(localStorage.getItem('status')).status);
    }
    

    let skip = 0;
    let top = 3;
    let paramFilter = {};

    

    view.showOffers(skip, top, paramFilter);
    view.showStatus();

    let buttonFind = document.querySelector('.button_find');
    let buttonLoadMore = document.querySelector('.button_load_more');
    let buttonDoor = document.querySelector('.door');
    let buttonLogIn = document.querySelector('.Sign_in');
    let buttonBali = document.querySelector('.logo');
    let buttonAddMainPage = document.querySelector('.buttonAdd_newOffer');
    let backgroundClick = document.getElementById('background');
    let buttonCloseWindowAddReview = document.querySelector('.close');

    buttonFind.addEventListener('click', handleFilter);
    buttonLoadMore.addEventListener('click', handleLoadMoreOffers);
    buttonDoor.addEventListener('click', handleLogOut);
    buttonLogIn.addEventListener('click', handleLogIn);
    buttonBali.addEventListener('click', handleGoToMainPage);
    buttonAddMainPage.addEventListener('click', handleGoToAddOfferPage);
    backgroundClick.addEventListener('click', handleCloseWindowAddReview);
    buttonCloseWindowAddReview.addEventListener('click', handleCloseWindowAddReview);
    
    function handleFilter() {
        paramFilter = {};
        let checkbox1 = document.getElementById('checkbox1');
        let checkbox4 = document.getElementById('checkbox4');
        let checkbox5 = document.getElementById('checkbox5');
        if(checkbox1.checked){
            paramFilter.dateFrom = document.getElementById('checkbox2').value;
            paramFilter.dateTo = document.getElementById('checkbox3').value;
        }
        if(checkbox4.checked){
            paramFilter.hashtags = document.getElementById('textarea_hashtags').value.split(' ');
        }
        if(checkbox5.checked){
            paramFilter.vendor = document.getElementById('textarea_vendorName').value;
        }
        console.log("find by params -> ", paramFilter);
        view.showOffers(skip, top, paramFilter);
    }

    function handleLoadMoreOffers() {
        top += 1;
        handleFilter(skip, top);
        let count = view.getCountOffers();
        if(top >= count){
            document.querySelector('.button_load_more').style.visibility = 'hidden';
        }
        else{
            document.querySelector('.button_load_more').style.visibility = 'visible';
        }
    }

    function handleLogOut() {
        view.logOut();
        view.showStatus();
        view.showOffers(skip, top);
    }

    function handleLogIn() {
        view.logIn();
        if(document.querySelector('.sign_in') != null){
            document.querySelector('.sign_in_button').addEventListener('click', handleSignIn);
        }
        
    }

    function handleGoToMainPage() {
        view.goToMainPage();
    }

    function handleSignIn() {
        view.sign_in(skip, top, paramFilter);
    }

    function handleGoToAddOfferPage() {
        view.goToAddOfferPage();
        document.querySelector('.door').style.visibility = 'hidden';
        
        document.querySelector('.add_offer_button').addEventListener('click', handleAddNewOffer);
    }

    function handleAddNewOffer() {
        view.goToMainPageFromAddPage(skip, top, paramFilter);
    }

    function handleDeleteOffer(id) {
        return function() {
            if(view.removeOffer(id)) {
                handleFilter();
                view.save();
            }
        }
    }

    function handleAddReviewOffer(id) {
        return function() {
            document.getElementById('background').style.display = 'block';
            document.getElementById('window').style.display = 'block';
            var old_element = document.querySelector('.form_button_add_review');
            var new_element = old_element.cloneNode(true);
            old_element.parentNode.replaceChild(new_element, old_element);
            document.querySelector('.form_button_add_review').addEventListener('click', handleClickAddReview(id, document.querySelector('.form_input').textContent));
        }
    }

    function handleClickAddReview(id, review) {
        return function() {
            review = document.querySelector('.form_input').value;
            view.addNewReviewOffer(id, review);
            console.log(id);
            document.querySelector('.form_input').value = "";
            document.getElementById('background').style.display = 'none';
            document.getElementById('window').style.display = 'none';

            view.showOffers(skip, top, paramFilter);
            view.save();
        }
    }

    function handleCloseWindowAddReview(){
        document.getElementById('background').style.display = 'none';
        document.getElementById('window').style.display = 'none';
    }

    function handleEditOffer(id) {
        return function() {
            view.goToEditOfferPage(id);
            document.querySelector('.door').style.visibility = 'hidden';
            document.getElementById('edit_offer_button').addEventListener('click', handleClickButtonEditOffer(id));        
            
        }
    }

    function handleClickButtonEditOffer(id) {
        return function (){
            let bufCreatedAt = view.getOfferById(id).createdAt;
            let bufRating = view.getOfferById(id).rating;
            let bufReviews = view.getOfferById(id).reviews;
            view.removeOffer(id);
            view.goToMainPageFromEditPage(id, bufCreatedAt, bufRating, bufReviews, skip, top, paramFilter);
        }
    }

}

