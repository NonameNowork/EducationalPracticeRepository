//https://sites.google.com/site/famcsbsu/labs/up
;

const adList = [
    {
        id: "ad-1",
        discription: "Скидка на стулья до 15%",
        createdAt: new Date(2020, 1, 28),
        link: "/ad-1-discription",
        vendor: "OOO Service",
        hashTags: [ "chair", "bigDiscount" ],
        discount: "15%",
        validUntil: new Date(2020, 3, 0)
    },
    {
        id: "ad-2",
        discription: "Скидка на полотенце до 35%",
        createdAt: new Date(2020, 1, 12),
        link: "/ad-2-discription",
        vendor: "Dom.by",
        hashTags: [ "varyBigDiscount", "sale" ],
        discount: "35%",
        validUntil: new Date(2020, 3, 0)
    },
    {
        id: "ad-3",
        discription: "Скидка на всё товары 5%",
        createdAt: new Date(2020, 0, 1),
        link: "/ad-3-discription",
        vendor: "discount.by",
        hashTags: [ "sale" ],
        discount: "5%",
        validUntil: new Date(2020, 4, 0)
    },
    {
        id: "ad-4",
        discription: "Скидка на стулья до 15%",
        createdAt: new Date(2020, 1, 28),
        link: "/ad-1-discription",
        vendor: "OOO Service",
        hashTags: [ "chair", "bigDiscount" ],
        discount: "15%",
        validUntil: new Date(2020, 3, 0)
    },
    {
        id: "ad-5",
        discription: "Скидка на полотенце до 35%",
        createdAt: new Date(2020, 1, 12),
        link: "/ad-2-discription",
        vendor: "Dom.by",
        hashTags: [ "varyBigDiscount", "sale", "false" ],
        discount: "35%",
        validUntil: new Date(2020, 3, 0)
    },
    {
        id: "ad-6",
        discription: "Скидка на всё товары 5%",
        createdAt: new Date(2020, 0, 1),
        link: "/ad-3-discription",
        vendor: "discount.by",
        hashTags: [ "sale" ],
        discount: "5%",
        validUntil: new Date(2020, 4, 0)
    }
]

var Filters = (function() {
    return {
        all: function(e) {
            return true;
        },
        none: function(e) {
            return false;
        },
        config: function(cfgObject) {
            return {
                apply: function(e) {
                    var cfgProp = Object.getOwnPropertyNames(cfgObject)
                    var eProp = Object.getOwnPropertyNames(e);
                    var correct = true;
                    for(var field in cfgProp) {
                        if (eProp.indexOf(cfgProp[field]) != -1) {
                            if (Array.isArray(e[cfgProp[field]]) && Array.isArray(cfgObject[cfgProp[field]])) {
                                for (var field_arr in cfgObject[cfgProp[field]]) {
                                  if (!e[cfgProp[field]].includes(cfgObject[cfgProp[field]][field_arr]))
                                    correct = false;
                                }
                            } else {
                               correct &= e[cfgProp[field]] === cfgObject[cfgProp[field]];
                            }
                        }
                        else
                            correct = false;
                    }
                    return correct;
                }
            }
        }
    };
}());

var ItemsFunctional = (function() {
    
    const adExample = {
        id: function(x) { return typeof x === "string" },
        discription: function(x) { return typeof x === "string"; },
        createdAt: function(x) { return x instanceof Date },
        link: function(x) { return typeof x === "string" },
        vendor: function(x) { return typeof x === "string" },
        hashTags: function(x) { 
            return Array.isArray(x) 
                && function() { 
                    correct = true; 
                    x.forEach(element => { 
                        correct &= (typeof element === "string"); 
                    });
                    return correct; 
                }
        },
        discount: function(x) { return typeof x === "string" },
        validUntil: function(x) { return x instanceof Date; },
    };

    function validate(adObject) {
        var exampleProp = Object.getOwnPropertyNames(adExample);
        for (var field in exampleProp) {
            if (Object.getOwnPropertyNames(adObject).includes(exampleProp[field])) {
                if (!adExample[exampleProp[field]](adObject[exampleProp[field]])) {
                    console.log("incorrect field '" + exampleProp[field] + "' is '" + adObject[exampleProp[field]] + "'");
                    return false
                }
            } else {
                return false;
            }
        }
        return true;
    };

    return {
        validateAd: function(adOject_) {
            ok = validate(adOject_);
            if (ok && AdFunctional.getAd(adOject_.id).length == 0)
                return ok;
            return false;
        }
    }
}());

var AdFunctional = (function(adsList) {
    var array = adsList;
    
    var _getAds = function(skip = 0, top = 5, filterF = Filters.all) {
        return array.sort(
            (a, b) => a.createdAt - b.createdAt
        ).filter(filterF)
        .slice(skip, top);
    };

    var edit = function(toEdit, data) {
        var copy = Object.assign({}, toEdit);
        var dataProps = Object.getOwnPropertyNames(data);
        for (var field in dataProps) {
            copy[dataProps[field]] = data[dataProps[field]];
        }
        if (AdFunctional.validateAd(copy)) {
            for (var field in dataProps) {
                toEdit[dataProps[field]] = data[dataProps[field]];
            }
            return true;
        }
        return false;
    };

    return {
        getAds: function() {
            return _getAds(arguments[0], arguments[1], arguments[2])
        },
        getAd: function(id) {
            return _getAds(0, 1, Filters.config({ id: String(id)}).apply);
        },
        validateAd: function(object) {
            return ItemsFunctional.validateAd(object);
        },
        addAd: function(object) {
            if (ItemsFunctional.validateAd(object)) {
                adList.push(object);
                return true;
            }
            return false;
        },
        editAd(id, config) {
            if (AdFunctional.getAd(id).length == 1) {
                return edit(AdFunctional.getAd(id)[0], config);
            }
            return false;
        }
    }
}(adList));

//EXAMPLE

//step 1
console.log("step 1 'getAds(0, 5, { vendor:'Dom.by' })'"); 

AdFunctional.getAds(0, 5, Filters.config({ vendor: "Dom.by" }).apply)

console.log("filter start");

AdFunctional.getAds(0, 5, Filters.config({ 
        vendor: "Dom.by",
        hashTags: [ "false" ]
    }).apply)
.forEach(x => console.log(x));

console.log("filter end");


console.log("step 2 'getAd('ad-2')'");
AdFunctional.getAd("ad-2").forEach(x => console.log(x));

console.log("step 3 'editAd('ad-2', { id: '2'}), getAd('2')'");
console.log(AdFunctional.editAd("ad-2", { id: "2", discription: "Скидки" }));
console.log(AdFunctional.getAd("2"));
