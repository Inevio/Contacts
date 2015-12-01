'use strict'

// CONSTANTS
var BROWSER_FIREFOX = 0;
var BROWSER_IE = 1;
var BROWSER_WEBKIT = 2;
var BROWSER_TYPE = /webkit/i.test(navigator.userAgent) ? BROWSER_WEBKIT : (/trident/i.test(navigator.userAgent) ? BROWSER_IE : BROWSER_FIREFOX);
var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var app = $(this);

//Object declarations
// EVENT OBJECT
var Event = function() {

  this.title = '';
  this.description = '';
  this.allDay = '';
  this.stringDate = '';
  this.startDate = '';
  this.endDate = '';
  this.repeat = '';
  this.calendar = '';
  this.alert = '';
  this.cell = '';

}
// COLOR PALETTE
var colorPalette = [
  {name: 'blue' , light: 'rgba(157, 211, 255, 0.5)', text:'rgba(42, 119, 173, 0.9)' , border:'#5ab4fe'},
  {name: 'green' , light: 'rgba(126, 190, 48, 0.5)', text:'rgba(48, 110, 13, 0.9)' , border:'#4e9c21'},
  {name: 'purple' , light: 'rgba(209, 196, 233, 0.5)', text:'rgba(103, 66, 170, 0.9)' , border:'#aa7ff8'},
  {name: 'orange' , light: 'rgba(247, 154, 3, 0.5)', text:'rgba(180, 93, 31, 0.9)' , border:'#f68738'},
  {name: 'brown' , light: 'rgba(109, 83, 65, 0.5)', text:'rgba(90, 70, 56, 0.9)' , border:'#6e5646'},
  {name: 'green2' , light: 'rgba(34, 168, 108, 0.5)', text:'rgba(10, 90, 54, 0.9)' , border:'#22a86c'},
  {name: 'red' , light: 'rgba(225, 61, 53, 0.5)', text:'rgba(145, 37, 33, 0.9)' , border:'#e13d35'},
  {name: 'pink' , light: 'rgba(225, 143, 234, 0.5)', text:'rgba(156, 75, 165, 0.9)' , border:'#b36dbb'},
  {name: 'grey' , light: 'rgba(56, 74, 89, 0.5)', text:'rgba(53, 59, 67, 0.9)' , border:'#384a59'},
  {name: 'yellow' , light: 'rgba(255, 204, 0, 0.5)', text:'rgba(132, 116, 11, 0.9)' , border:'#c6a937'},
];

//Edit mode enable or not
var editState = false;

//DOM variables
//Contact list
var newContactButton            = $('.new-contact-button');
var contactList                 = $('.contact-list');
var contactPrototype            = $('.contact.wz-prototype');
var filePrototype               = $('.file.wz-prototype');

//Info tab
var infoTab                     = $('.info-tab');
var nameSpan                    = $('.name');
var companySpan                 = $('.company');
var officeSpan                  = $('.office');
var positionSpan                = $('.position');
var departmentSpan              = $('department');
var companyOficce               = $('.company-office');
var positionDepartment          = $('.position-department');

var nameInput                   = $('.ui-input.name-input');
var lastnameInput               = $('.ui-input.lastname-input');
var companyInput                = $('.ui-input.company-input');
var officeInput                 = $('.ui-input.office-input');
var positionInput               = $('.ui-input.position-input');
var departmentInput             = $('.ui-input.department-input');

var editContactButton           = $('.edit-contact-button');

var editPopup                   = $('.edit-mode-popup');
var saveContact                 = $('.save-contact-button');
var cancelContact               = $('.cancel-contact-button');
var deleteContact               = $('.delete-contact-button');

var newPhone                    = $('.phone-section i');
var phonePrototype              = $('.phone.wz-prototype');
var phoneList                   = $('.phone-list');
var phoneDropdown               = $('.phone-dropdown');

var newMail                     = $('.mail-section i');
var mailPrototype               = $('.info-tab .mail.wz-prototype');
var mailList                    = $('.mail-list');

var newAddress                  = $('.address-section i');
var addressPrototype            = $('.address.wz-prototype');
var addressList                 = $('.address-list');


//DOM EFFECTS
contactList.on('click', '.contactDom', function(){
  selectContact($(this));
});

newContactButton.on('click', function(){
  newContact();
});

editContactButton.on('click', function(){
  editMode(true);
});

cancelContact.on('click', function(){
  cancel();
});

saveContact.on('click', function(){
  save();
});

deleteContact.on('click', function(){
  deleteContact();
});

newPhone.on('click', function(){
  phoneDropdown.show();
});

$('.info-tab').on('click','.phoneDom .remove,.mailDom .remove,.addressDom .remove',function(){
  console.log('entro');
  $(this).parent().remove();
});

phoneDropdown.find('.item').on('click', function(){
  if(editState === false){
    editMode(true);
  }
  addPhone($(this).text());
});

newMail.on('click', function(){
  if(editState === false){
    editMode(true);
  }
  addMail();
});

newAddress.on('click', function(){
  if(editState === false){
    editMode(true);
  }
  addAddress();
});

// AUXILIAR funtions
// Adds a '0' if the string lenght is = 1 and cast to string
var addZeroToHour = function(hour){
  var aux = hour.toString();
  if(aux.length < 2){
    aux = '0' + aux;
  }
  return aux;
}

var addZero = function( value ){

  if( value < 10 ){
    return '0' + value;
  }else{
    return value;
  }

};

Date.prototype.yyyymmdd = function() {
  var yyyy = this.getFullYear().toString();
  var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
  var dd  = this.getDate().toString();
  return yyyy +'/' + (mm[1]?mm:"0"+mm[0]) +'/' +(dd[1]?dd:"0"+dd[0]); // padding
};

var formatDate = function( dateInput ){
  var dateAux = new Date (dateInput);
  return  addZero( dateAux.getDate() ) + '/' +
  addZero( dateAux.getMonth() + 1 ) + '/' +
  dateAux.getFullYear() + ', ' +
  addZero( dateAux.getHours() ) + ':' +
  addZero( dateAux.getMinutes() );
}

// APP functionality
var initContacts = function(){
  console.log('Funcionalidades soportadas:\n 1.Crear contacto \n 2.Editar nombre y empresa contacto \n 3.Añadir telefonos \n 4.Editar telefonos \n 5.Borrar telefonos \n 6.Añadir email \n 7.Añadir address \n 8.BORRAR/EDITAR MAIL/ADDRESS NO ESTA FUNCIONANDO ');
  wz.contacts.getAccounts(function(err, list){
    list[0].getGroups(function(e, o){
      o[0].getContacts(function(e, o){
        for (var i = 0; i < o.length; i++) {
          addContact(o[i]);
        }
      });
    });
  });
}

var addContact = function(contactApi){

  console.log('Añadiendo contacto desde el API:', contactApi);

  var contact = contactPrototype.clone();
  contact.removeClass('wz-prototype');

  contact.find('.name-contact').text(contactApi.name.first+' '+contactApi.name.last);

  if(contactApi.title != undefined){
    contact.find('.company-contact').text(contactApi.org.company);
  }

  contact.data('contactApi' , contactApi);
  contact.addClass('contactDom');
  contactList.append(contact);
  contact.click();
  setAvatar(contactApi, contact);
}


var selectContact = function(o){
  var contactApi = o.data('contactApi');
  if(1!=1){
    alert('You have to finish this contact first');
  }else{

    console.log('Contacto seleccionado:', contactApi);

    //Show the info tab
    $('.contact-info').show();

    //Set the contact active
    o.addClass('active');

    if(contactApi != undefined){

      if(contactApi.name.first != undefined){
        nameSpan.text(contactApi.name.first+' '+contactApi.name.last);
      }
      if(contactApi.org.company != undefined){
        companySpan.text(contactApi.org.company);
      }
      officeSpan.text('');
      if(contactApi.title != undefined){
        positionSpan.text(contactApi.title);
      }
      if(contactApi.org.department != undefined){
        departmentSpan.text(contactApi.org.department);
      }

      //Add phones to tab
      recoverPhones(contactApi);

      //Add mails to tab
      recoverMails(contactApi);

      //Add addresses to tab
      recoverAddresses(contactApi);

    }

  $('.contact-info .avatar-letters').text(o.find('.avatar-letters').text());
  $('.contact-info .avatar').css('background-color', o.find('.avatar').css('background-color'));
  $('.contact-info .avatar').css('border-color', o.find('.avatar').css('border-color'));
  $('.contact-info .avatar-letters').css('color', o.find('.avatar-letters').css('color'));
  }
}

var prepareInfo = function(){
  var contactApi = $('.contact.active').data('contactApi');

  var phones = contactApi != undefined ? contactApi.phone : '';
  var mails = contactApi != undefined ? contactApi.email : '';
  var addresses = contactApi != undefined ? contactApi.address : '';

  var info = {
    name: {first : nameInput.val(), middle: '', last : lastnameInput.val()},
    org : {company : companyInput.val(), department : departmentInput.val()},
    title : positionInput.val(),
    address : addresses,
    phone: phones,
    email: mails
  };

  return info;
}

// Enter o exit of edit mode on info tab
var editMode = function(mode){
  if(mode == true){
    editState = true;

    // Hide spans and show inputs
    showAndHide();
    nameInput.focus();

    var contactApi = $('.contact.active').data('contactApi');
    if(contactApi.name.first != undefined){
      nameInput.val(contactApi.name.first);
    }
    if(contactApi.name.last != undefined){
      lastnameInput.val(contactApi.name.last);
    }
    if(contactApi.org.company != undefined){
      companyInput.val(contactApi.org.company);
    }
    if(contactApi.title != undefined){
      positionInput.val(contactApi.title);
    }
    if(contactApi.org.department != undefined){
      departmentInput.val(contactApi.org.department);
    }

    editPopup.show();

    //Add keys to save & cancel
    app.key( 'enter', function(e){save();}, null, null );
    app.key( 'esc', function(e){cancel();}, null, null );

  }else{
    editState = false;

    // Show spans and hide inputs
    showAndHide();

    editPopup.hide();

    //Quit keys to save & cancel
    app.unkey('enter');
    app.unkey('esc');

  }
}

// PHONES
var addPhone = function(type){
  phoneDropdown.hide();

  var phone = phonePrototype.clone();
  phone.removeClass('wz-prototype');
  phone.addClass('phoneDom');

  phone.find('.type').text(type+':');
  phone.find('.content').hide();
  phone.find('.phone-input').show();

  phoneList.append(phone);
  phone.find('.phone-input').focus();
}

var recoverPhones = function(contactApi){
  $('.phoneDom').remove();

  if(contactApi.phone != undefined && contactApi.phone.length > 0){
    for (var i = 0; i < contactApi.phone.length; i++) {
      var phone = phonePrototype.clone();
      phone.addClass('phoneDom');
      phone.removeClass('wz-prototype');

      phone.find('.type').text(contactApi.phone[i].type);
      phone.find('.content').text(contactApi.phone[i].value);
      phoneList.append(phone);
    }
  }
}

var lookPhones = function(info){
  var phones = $('.phoneDom');
  var tel = [];

  for (var i = 0; i < phones.length; i++) {
    if( phones.eq(i).find('.phone-input').val() === '' ){
      phones.eq(i).remove();
    }else{
      tel.push({type: phones.eq(i).find('.type').text(), value: phones.eq(i).find('.phone-input').val()});
      phones.eq(i).find('.phone-input').hide();
      phones.eq(i).find('.content').show();
    }
  }
  info.phone = tel;
  return info;
}

//MAILS
var addMail = function(){
  var mail = mailPrototype.clone();
  mail.removeClass('wz-prototype');
  mail.addClass('mailDom');

  var nMails  = mailList.children().size();
  if(nMails > 1){
    mail.find('.type').text('Email '+nMails+':');
  }else{
    mail.find('.type').text('Email :');
  }
  mail.find('.content').hide();
  mail.find('.mail-input').show();

  mailList.append(mail);
  mail.find('.mail-input').focus();
}

var recoverMails = function(contactApi){
  $('.mailDom').remove();

  if(contactApi.email != undefined && contactApi.email.length > 0){

    for (var i = 0; i < contactApi.email.length; i++) {
      var mail = mailPrototype.clone();
      mail.addClass('mailDom');
      mail.removeClass('wz-prototype');

      mail.find('.content').text(contactApi.email[i].value);

      var nMails  = mailList.children().size();
      if(nMails > 1){
        mail.find('.type').val('email '+nMails+':');
      }else{
        mail.find('.type').val('email');
      }

      mailList.append(mail);
    }
  }
}

var lookMails = function(info){
  var mails = $('.mailDom');
  var email = [];
  for (var i = 0; i < mails.length; i++) {
    if( mails.eq(i).find('.mail-input').val() === '' ){
      mails.eq(i).remove();
    }else{
      email.push({type: mails.eq(i).find('.type').text(), value: mails.eq(i).find('.mail-input').val()});
      mails.eq(i).find('.mail-input').hide();
      mails.eq(i).find('.content').show();
    }
  }
  info.email = email;
  return info;
}

//ADDRESSES
var addAddress = function(){
  var address = addressPrototype.clone();
  address.removeClass('wz-prototype');
  address.addClass('addressDom');
  var nAddresses  = addressList.children().size();
  if(nAddresses > 1){
    address.find('.type').text('Address '+nAddresses+':');
  }else{
    address.find('.type').text('Address :');
  }
  address.find('.content').hide();
  address.find('.address-input').show();

  addressList.append(address);
  address.find('.address-input').focus();
}

var recoverAddresses = function(contactApi){

  $('.addressDom').remove();

  if(contactApi.address != undefined && contactApi.address.length > 0){
    for (var i = 0; i < contactApi.address.length; i++) {
      var address = addressPrototype.clone();
      address.addClass('addressDom');
      address.removeClass('wz-prototype');

      var nAddresses = addressList.children().size();

      address.find('.type').text(contactApi.address[i].type);
      address.find('.content').text(contactApi.address[i].value.region+contactApi.address[i].value.city);

      addressList.append(address);
    }
  }
}

var lookAddresses = function(info){
  var address = $('.addressDom');
  var adr = [];
  for (var i = 0; i < address.length; i++) {

    if( address.eq(i).find('.address-input').val() === '' ){
      address.eq(i).remove();
    }else{

      adr.push({
        type: address.eq(i).find('.type').text(),
        value: {city: address.eq(i).find('.address-input').val(), label:''}
      });

      address.eq(i).find('.address-input').hide();
      address.eq(i).find('.content').show();

    }

  }
  info.address = adr;
  return info;
}

var cleanForm = function(){
  nameInput.val('');
  positionInput.val('');
  departmentInput.val('');
  companyInput.val('');
  $('.phone .content').val('');
  $('.mail .content').val('');
  $('.address .content').val('');
}

var setAvatar = function(o, contact){
  console.log('SET AVATAR', o, contact);
  var name = o.name.first+' '+o.name.last;
  name = name.split(' ');
  if(name.length > 1){
    contact.find('.avatar-letters').text(name[0][0].toUpperCase()+''+name[1][0].toUpperCase());
  }
  var colorId = selectColor(o.id);
  contact.find('.avatar').css('background-color', colorPalette[colorId].light);
  contact.find('.avatar').css('border-color', colorPalette[colorId].border);
  contact.find('.avatar-letters').css('color', colorPalette[colorId].text);
}

var selectColor = function(string){
  var id = 0;
  for (var i = 0; i < string.length; i++) {
    id += string.charCodeAt(i);
    id++;
  }
  return id = id%colorPalette.length;
}

var newContact = function(){
  if(editState === true){
    alert('You have to finish this contact first');
  }else{
    var contact = contactPrototype.clone();
    contact.removeClass('wz-prototype');
    contact.addClass('contactDom');
    contactList.append(contact);
    contact.click();
    editMode(true);
    cleanForm();
  }
}

var deleteContact = function(){
  editMode(false);
  var contactApi = $('.contact.active').data('contactApi');
  $('.contact.active').remove();
  $('.contact-info').hide();
  $('.contact-tab').hide();
  $('.tab.active').removeClass('active');
  if(contactApi != undefined){
    contactApi.delete(function(e, o){
      console.log('CONTACTO BORRADO', e, o);
    });
    $('.info-tab').hide();
  }else{
    alert('No se encuentra el objecto del API en el contacto');
  }
}

var save = function(){
  editMode(false);

  var info = prepareInfo();

  info = lookPhones(info);
  info = lookMails(info);
  info = lookAddresses(info);

  var contact = $('.contact-list .contact.active');
  var contactApi = $('.contact.active').data('contactApi');

  if(contactApi != undefined){
    contactApi.modify(info, function(e, o){
      console.log('CONTACTO MODIFICADO:', e, o);
      contact.off('click');
      contact.data('contactApi', o);
      setAvatar(o, contact);
      contact.click();
    });
  }else{
    wz.contacts.getAccounts(function(err, list){
      list[0].getGroups(function(e, o){
        o[0].createContact(info, function(e, o){
          console.log('Añadiendo contacto nuevo: ');
          console.log(e, o);
          contact.data('contactApi', o)
          setAvatar(o, contact);
          contact.click();
        });
      });
    });
  }
}

var cancel = function(){

  var contactApi = $('.contact.active').data('contactApi');

  if(contactApi == undefined){
    $('.contact.active').remove();
    $('.info-tab').hide();
  }else{
    editMode(false);
    $('.contact.active').click();
  }

}

var showAndHide = function(){
  editContactButton.toggle();
  nameInput.toggle();
  lastnameInput.toggle();
  companyInput.toggle();
  officeInput.toggle();
  positionInput.toggle();
  departmentInput.toggle();
  nameSpan.toggle();
  companyOficce.toggle();
  positionDepartment.toggle();
  $('.remove').toggle();
}


// Program run
initContacts();
