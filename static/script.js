'use strict'

// CONSTANTS
var BROWSER_FIREFOX = 0;
var BROWSER_IE = 1;
var BROWSER_WEBKIT = 2;
var BROWSER_TYPE = /webkit/i.test(navigator.userAgent) ? BROWSER_WEBKIT : (/trident/i.test(navigator.userAgent) ? BROWSER_IE : BROWSER_FIREFOX);

//DOM variables
var newContactButton      = $('.new-contact-button');
var contactList                   = $('.contact-list');
var contactPrototype        = $('.contact.wz-prototype');
var nameInput                   = $('input.name');
var positionInput               = $('input.position');
var newPhone                   = $('.phone i');
var phonePrototype          = $('.phone.wz-prototype');
var phoneList                     = $('.phone-list');
var newMail                      = $('.mail i');
var mailPrototype             = $('.mail.wz-prototype');
var mailList                        = $('.mail-list');
var newAddress                 = $('.address i');
var addressPrototype         = $('.address.wz-prototype');
var addressList                    = $('.address-list');
var newPersonal                = $('.personal i');
var personalPrototype       = $('.personal.wz-prototype');
var personalList                  = $('.personal-list');

//TEST
$('.contact-info').hide();
$('.contact-tab').hide();
$('.info-tab').hide();

//DOM effects
newContactButton.on('click', function(){
  var contact = contactPrototype.clone();
  contact.removeClass('wz-prototype');
  contact.on('click', function(){
    var object = $(this);
    $('.highlight-area.active').removeClass('active');
    object.find('.highlight-area').addClass('active');

    $('.contact-info').show();
    $('.contact-tab').show();
    $('.info-tab').show();


  });
  contactList.append(contact);
});

nameInput.on('focusout', function(){
  var object = $(this);
  $('.highlight-area.active').find('.name').text(object.val());
});

positionInput.on('focusout', function(){
  var object = $(this);
  $('.highlight-area.active').find('.position').text(object.val());
});

newPhone.on('click', function(){
  var phone = phonePrototype.clone();
  phone.removeClass('wz-prototype');
  phoneList.append(phone);
});

newMail.on('click', function(){
  var mail = mailPrototype.clone();
  mail.removeClass('wz-prototype');
  var nMails = mailList.children().size();
  if(nMails > 1){
    mail.find('.type').val('Email '+nMails+':');
  }
  mailList.append(mail);
});

newAddress.on('click', function(){
  var address = addressPrototype.clone();
  address.removeClass('wz-prototype');
  addressList.append(address);
});

newPersonal.on('click', function(){
  var personal = personalPrototype.clone();
  personal.removeClass('wz-prototype');
  personalList.append(personal);
});
