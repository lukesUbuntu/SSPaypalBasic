/**
 * Created by Luke Hardiman on 20/09/2015.
 *
 */
console.log("paypal.js : loading ");



if (typeof jQuery == 'undefined') {
    throw exception("jQuery not loaded");
}

var  $shoppingCart = null;

var cartItems = {};

$(document).ready(function () {

    //declare our shopping cart element
    $shoppingCart = $("#shoppingCart");

    //check cart
    if ($shoppingCart.length < 0)
        throw new Error("paypal.js Error missing shopping cart container");

    if (!$shoppingCart.is(':visible'))
        console.log("paypal.js cart is hidden")

    //adding item to cart
    $(".addToCart").click(addToCart)

    $("#checkOut").click(function () {
        alert("Sorry not complete yet.");
    });

    processCart();
    checkCart();

});

//bind to non existing class
$(document.body).on('click', '.cartRemove', function () {
    //get product item
    var item_code = $(this).data('item_code');

    $("#" + item_code).remove();


    delete(cartItems[item_code]);

    console.log("item_code",cartItems);
    saveCart();
    //process the cart 5
    processCart();

});

function addToCart() {
    console.log("addToCart clicked")
    //check if showing
    if (!$shoppingCart.is(':visible'))
        $(".shoppingCartContainer").show();

    //lets get the data
    var data = $(this).data();
    var qnty = parseInt($('.sslModuleQty',$(this).parent()).val());
    data.qty = qnty;

    //check the data
    if (typeof data.name != "string" || typeof data.price != "string") {
        console.log("data", data);
        throw new Error("Error missing data");
    }

    //check if we don't already exist
    if (typeof cartItems[data.code] == "undefined")
    cartItems[data.code] = data;
    else
        cartItems[data.code].qty =  parseInt(cartItems[data.code].qty) + parseInt(data.qty);



    //addRow(data);
    saveCart();
    //close cart
    window.location.href=window.location.href
    //processCart();
}




/**
 * Process Shopping Cart from Storage
 */
function processCart(){
    $shoppingCart.find(".item-list").remove();
    var items = localStorage.getItem('cartItems');

    if (items != null && typeof items == "string")
        cartItems = JSON.parse(items);
        else
        cartItems = {};

    console.log("Loaded cartItems from storage",cartItems)
    //loop items
    $.map(cartItems,addRow);
}
/**
 * Adds a row to the shopping cart parsed my $.map
 * @param data
 */
function addRow(item,index){

    var item_code = (item.code.length > 1) ? item.code : index;



    var cartRow = '<tr id="' +item_code + '" class="item-list">' +
        '<td width="70px"><p style="color: #555">' + item.name  + '</p></td>' +
        '<td width="20" style="padding-left: 10px;"><p style="color: #555;">' + item.qty + '</p></td>' +
        '<td width="10" style="padding-left: 10px;"><p style="color: #555">$' + item.price + '</p></td>' +
        '<td width="10"><i data-item_code="' + item.code + '" class="fa fa-remove cartRemove"></i></td>' +
        '</tr>';
    /*
     <input type="hidden" name="cmd" value="_cart">
     <input type="hidden" name="business" value="seller@designerfotos.com">
     <input type="hidden" name="item_name" value="hat">
     <input type="hidden" name="item_number" value="123">
     <input type="hidden" name="amount" value="15.00">
     */
    var cartItemsPaypal =
        //'<input type="hidden" name="cmd" value="_cart">'+
        '<input type="hidden" name="item_name_'+item.code +'" value="' + item.name  + '">'+
        '<input type="hidden" name="item_number_'+item.code +'" value="'+item.code +'">'+
        '<input type="hidden" name="amount_'+item.code +'" value="' + item.price + '">'+
        '<input type="hidden" name="quantity_'+item.code +'" value="' + item.qty + '">';

    //append to last
    $("tr:last", $shoppingCart).after(cartRow);

    $('#cartItemsPaypal').append(cartItemsPaypal)
}

/**
 * Saves cartItems state
 */
function saveCart(){
    localStorage.setItem('cartItems',JSON.stringify(cartItems));
    checkCart();
}
/**
 * Check if cart should be showing.
 */
function checkCart(){

    if ($('tr', $shoppingCart).length <= 1)   //hide shopping cart no items
        $(".shoppingCartContainer").hide();
}


