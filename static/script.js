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
  {name: 'blue' , light: '#a6d2fa', text:'#2a77ad' , border:'#1664a5'},
  {name: 'green' , light: '#badb95', text:'#306e0d' , border:'#3c7919'},
  {name: 'purple' , light: '#d8ccf1', text:'#9064e1' , border:'#6742aa'},
  {name: 'orange' , light: '#f7c97e', text:'#b45d1f' , border:'#f68738'},
  {name: 'brown' , light: '#b2a59d', text:'#5a4638' , border:'#6e5646'},
  {name: 'green2' , light: '#8cd0b3', text:'#0a5a36' , border:'#128a54'},
  {name: 'red' , light: '#ec9a97', text:'#912521' , border:'#e13d35'},
  {name: 'pink' , light: '#f7beec', text:'#9c4ba5' , border:'#b44b9f'},
  {name: 'grey' , light: '#97a1a9', text:'#353b43' , border:'#384a59'},
  {name: 'yellow' , light: '#fbe27d', text:'#84740b' , border:'#ffb400'},
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
var welcomePage                 = $('.welcome-page');
var newContactWelcome           = $('.welcome-page .ui-btn.big');

var infoTab                     = $('.info-tab');
var nameSpan                    = $('.name');
var companySpan                 = $('.company');
var officeSpan                  = $('.office');
var positionSpan                = $('.position');
var departmentSpan              = $('.department');
var companyOficce               = $('.company-office');
var positionDepartment          = $('.position-department');

var nameInput                   = $('.ui-input.name-input');
var lastnameInput               = $('.ui-input.lastname-input');
var companyInput                = $('.ui-input.company-input');
var officeInput                 = $('.ui-input.office-input');
var positionInput               = $('.ui-input.position-input');
var departmentInput             = $('.ui-input.department-input');
var isCompany                   = $('.is-company');
var companyCheck                = $('.company-check.ui-checkbox');

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
var mailDropdown                = $('.mail-dropdown');

var newAddress                  = $('.address-section i');
var addressPrototype            = $('.address.wz-prototype');
var addressList                 = $('.address-list');
var addressDropdown             = $('.address-dropdown');

var notesSpan                   = $('.notes-section .notes');
var notesInput                  = $('.notes-section .notes-input');

//DOM EFFECTS
contactList.on('click', '.contactDom', function(){
  selectContact($(this));
});

newContactButton.on('click', function(){
  newContact();
});

newContactWelcome.on('click', function(){
  welcomePage.hide();
  newContactButton.show();
  contactList.show();
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
  remove();
});

newPhone.on('click', function(){
  phoneDropdown.show();
  mailDropdown.hide();
  addressDropdown.hide();
});

newMail.on('click', function(){
  mailDropdown.show();
  phoneDropdown.hide();
  addressDropdown.hide();
});

newAddress.on('click', function(){
  addressDropdown.show();
  phoneDropdown.hide();
  mailDropdown.hide();
});

companyCheck.on('click', function(){
  var object = $(this);
  if(object.hasClass('active')){
    contactMode(object);
  }else{
    companyMode(object);
  }
});

$('.info-tab').on('click','.phoneDom .remove,.mailDom .remove,.addressDom .remove',function(){
  console.log('entro');
  $(this).parent().remove();
});

app.on('click', function(e){
  var target = $(e.target);
  if(target.hasClass('item')){
    if(editState === false){
      editMode(true);
    }

    if(target.parent().hasClass('phone-dropdown')){
      addPhone(target.text());
    }else if(target.parent().hasClass('mail-dropdown')){
      addMail(target.text());
    }else if(target.parent().hasClass('address-dropdown')){
      addAddress(target.text());
    }
  }else if(!target.hasClass('add')){
    $('.info-tab .ui-context-menu').hide();
  }
});

// AUXILIAR funtions
// Adds a '0' if the string len is = 1 and cast to string
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
  setInitialTexts();
  $('.ui-window-content').hide();
  wz.contacts.getAccounts(function(err, list){
    list[0].getGroups(function(e, o){
      o[0].getContacts(function(e, o){

        if(o.length > 0){
          $('.ui-window-content').show();
          newContactButton.show();
          contactList.show();
        }else{
          welcomePage.show();
          newContactButton.hide();
        }

        var list = [];
        for (var i = 0; i < o.length; i++) {
          list.push(o[i]);
        }

        list = list.sort(function(a,b){return a.name.first.localeCompare( b.name.first );});

        for (var i = 0; i < list.length; i++) {
          addContact(list[i]);
        }

        $('.contactDom').eq(0).click();

      });
    });
  });
}


var addContact = function(contactApi){

  console.log('Añadiendo contacto desde el API:', contactApi);

  var contact = contactPrototype.clone();
  contact.removeClass('wz-prototype');

  if(contactApi.isCompany){
    contact.find('.company-contact').text(contactApi.name.first+' '+contactApi.name.last);
    contact.find('.name-contact').text(contactApi.org.company);
    contact.find('.company-mode').show();
  }else{
    contact.find('.name-contact').text(contactApi.name.first+' '+contactApi.name.last);
    contact.find('.company-contact').text(contactApi.org.company);
    contact.find('.company-mode').hide();
  }

  contact.data('contactApi' , contactApi);
  contact.addClass('contactDom');
  contactList.append(contact);
  setAvatar(contactApi, contact);
}

var addModifyContactApi = function(contactApi, info, contact){
  if(contactApi != undefined){
    contactApi.modify(info, function(e, o){
      console.log('CONTACTO MODIFICADO:', e, o);
      contact.off('click');
      contact.data('contactApi', o);
      setAvatar(o, contact);

      if(o.isCompany){
        contact.find('.company-contact').text(info.name.first+' '+info.name.last);
        contact.find('.name-contact').text(info.org.company);
        contact.find('.company-mode').show();
      }else{
        contact.find('.name-contact').text(info.name.first+' '+info.name.last);
        contact.find('.company-contact').text(info.org.company);
        contact.find('.company-mode').hide();
      }

      orderContact(contact);
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

          if(o.isCompany){
            contact.find('.company-contact').text(info.name.first+' '+info.name.last);
            contact.find('.name-contact').text(info.org.company);
            contact.find('.company-mode').show();
          }else{
            contact.find('.name-contact').text(info.name.first+' '+info.name.last);
            contact.find('.company-contact').text(info.org.company);
            contact.find('.company-mode').hide();
          }

          orderContact(contact);
          contact.click();
        });
      });
    });
  }
}

var selectContact = function(o){
  var contactApi = o.data('contactApi');
  if(editState){
    alert('Primero confirma si deseas guardar o cancelar los cambios realizados en este contacto');
  }else{

    cleanForm();
    console.log('Contacto seleccionado:', contactApi);

    //Show the info tab
    $('.contact-info').show();

    //Set the contact active
    $('.contact-list .active').removeClass('active');
    o.addClass('active');

    if(contactApi != undefined){

      if(!contactApi.isCompany){
        nameSpan.text((contactApi.name.first || '') + ' ' + (contactApi.name.last || ''));
        companySpan.text((contactApi.org.company || '') + ' ' + (contactApi.org.office || ''));
      }else{
        nameSpan.text((contactApi.org.company || '') + ' ' + (contactApi.org.office || ''));
        companySpan.text((contactApi.name.first || '') + ' ' + (contactApi.name.last || ''));
      }

      if(contactApi.title != ''){
        positionSpan.text(contactApi.title);
      }
      if(contactApi.org.department != ''){
        departmentSpan.text(contactApi.org.department);
      }

      if(!contactApi.isCompany && contactApi.title != '' && contactApi.org.department != ''){
        positionSpan.css('margin-right', '3px');
        departmentSpan.text('- '+contactApi.org.department);
      }else if(contactApi.isCompany && contactApi.title != '' && contactApi.org.department != ''){
        nameSpan.text(contactApi.org.company+' - '+contactApi.org.department);
      }

      //Add phones to tab
      recoverPhones(contactApi);

      //Add mails to tab
      recoverMails(contactApi);

      //Add addresses to tab
      recoverAddresses(contactApi);

      //Add notes to tab
      recoverNotes(contactApi);

    }

    $('.contact-info .avatar-letters').text(o.find('.avatar-letters').text());

    var colorId = o.data('color');
    var avatar = $('.contact-info .avatar');

    if(colorId != undefined){
      avatar.css('background-color', colorPalette[colorId].light);
      avatar.css('border-color', colorPalette[colorId].border);
      avatar.css('border-style', 'solid');
      avatar.find('.avatar-letters').css('color', colorPalette[colorId].text);
    }else{
      avatar.css('background-color', '#f7f8fa');
      avatar.css('border-color', '#ccd3d5');
      avatar.css('border-style', 'dashed');
    }
  }
}

var prepareInfo = function(){
  var contactApi = $('.contact.active').data('contactApi');

  var phones = contactApi != undefined ? contactApi.phone : '';
  var mails = contactApi != undefined ? contactApi.email : '';
  var addresses = contactApi != undefined ? contactApi.address : '';

  var info = {
    name: {first : nameInput.val(), middle: '', last : lastnameInput.val()},
    org : {company : companyInput.val(), department : departmentInput.val(), office : officeInput.val()},
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

    var contactApi = $('.contact.active').data('contactApi');
    setExampleInputs(contactApi);

    if(contactApi != undefined){

      setPhonesInputs();
      setMailsInputs();
      setAddressInputs();

      if(contactApi.name.first != undefined){
        nameInput.val(contactApi.name.first);
      }
      if(contactApi.name.last != undefined){
        lastnameInput.val(contactApi.name.last);
      }
      if(contactApi.org.company != undefined){
        companyInput.val(contactApi.org.company);
      }
      if(contactApi.org.office != undefined){
        officeInput.val(contactApi.org.office);
      }
      if(contactApi.title != undefined){
        positionInput.val(contactApi.title);
      }
      if(contactApi.org.department != undefined){
        departmentInput.val(contactApi.org.department);
      }
      if(contactApi.note != undefined){
        notesInput.val(contactApi.note);
      }
      if(contactApi.isCompany){
        isCompany.find('.company-check').addClass('active');
      }else{
        isCompany.find('.company-check').removeClass('active');
      }
    }

    if(isCompany.find('figure').hasClass('active')){
      companyMode(companyCheck);
      companyInput.focus();
    }else{
      contactMode(companyCheck);
      nameInput.focus();
    }
    $('.notes-section').show();
    editPopup.show();
    editPopup.addClass('active');

  }else{
    editState = false;

    // Show spans and hide inputs
    showAndHide();

    editPopup.removeClass('active');

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

      var mobileType = contactApi.phone[i].type;
      if(mobileType === 'cell'){
        mobileType = 'Móvil:';
      }else if(mobileType === 'home'){
        mobileType = 'Casa:';
      }else if(mobileType === 'work'){
        mobileType = 'Trabajo:';
      }

      phone.find('.type').text(mobileType);
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
      var mobileType = phones.eq(i).find('.type').text();
      if(mobileType === 'Móvil:'){
        mobileType = 'cell';
      }else if(mobileType === 'Casa:'){
        mobileType = 'home';
      }else if(mobileType === 'Trabajo:'){
        mobileType = 'work';
      }

      tel.push({type: mobileType, value: phones.eq(i).find('.phone-input').val()});
      phones.eq(i).find('.phone-input').hide();
      phones.eq(i).find('.content').show();
    }
  }
  info.phone = tel;
  return info;
}

var setPhonesInputs = function(){
  var phones = $('.phoneDom');

  for (var i = 0; i < phones.length; i++) {
    var number = phones.eq(i).find('.content').text();
    phones.eq(i).find('.content').hide();
    phones.eq(i).find('.phone-input').show();
    phones.eq(i).find('.phone-input').val(number);
  }
}

//MAILS
var addMail = function(type){
  mailDropdown.hide();

  var mail = mailPrototype.clone();
  mail.removeClass('wz-prototype');
  mail.addClass('mailDom');

  mail.find('.type').text(type+':');
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

      var mailType = contactApi.email[i].type;
      if(mailType === 'home'){
        mailType = 'Personal';
      }else if(mailType === 'work'){
        mailType = 'Trabajo';
      }else if(mailType === 'other'){
        mailType = 'Otro';
      }

      mail.find('.content').text(contactApi.email[i].value);
      mail.find('.type').text(mailType+':');

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
      var mailType = mails.eq(i).find('.type').text();
      if(mailType === 'Personal:'){
        mailType = 'home';
      }else if(mailType === 'Trabajo:'){
        mailType = 'work';
      }else if(mailType === 'Otro:'){
        mailType = 'other';
      }

      email.push({type: mailType, value: mails.eq(i).find('.mail-input').val()});
      mails.eq(i).find('.mail-input').hide();
      mails.eq(i).find('.content').show();
    }
  }
  info.email = email;
  return info;
}

var setMailsInputs = function(){
  var mails = $('.mailDom');

  for (var i = 0; i < mails.length; i++) {
    var mail = mails.eq(i).find('.content').text();
    mails.eq(i).find('.content').hide();
    mails.eq(i).find('.mail-input').show();
    mails.eq(i).find('.mail-input').val(mail);
  }
}

//ADDRESSES
var addAddress = function(type){
  addressDropdown.hide();

  var address = addressPrototype.clone();
  address.removeClass('wz-prototype');
  address.addClass('addressDom');

  address.find('.type').text(type+':');
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

      var addressType = contactApi.address[i].type;
      if(addressType === 'home'){
        addressType = 'Casa:';
      }else if(addressType === 'work'){
        addressType = 'Trabajo:';
      }else if(addressType === 'other'){
        addressType = 'Otra:';
      }

      address.find('.type').text(addressType);
      address.find('.content').text(contactApi.address[i].street + ( contactApi.address[i].code ? (', ' + contactApi.address[i].code) : '') + ( contactApi.address[i].region ? (', ' + contactApi.address[i].region) : '') + ( contactApi.address[i].city ? (', ' + contactApi.address[i].city) : '') + ( contactApi.address[i].country ? (', ' + contactApi.address[i].country) : ''));

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
      var addressType = address.eq(i).find('.type').text();
      if(addressType === 'Casa:'){
        addressType = 'home';
      }else if(addressType === 'Trabajo:'){
        addressType = 'work';
      }else if(addressType === 'Otra:'){
        addressType = 'other';
      }

      adr.push({
        type: addressType,
        street: address.eq(i).find('.street-input').val(),
        code: address.eq(i).find('.postal-input').val(),
        city: address.eq(i).find('.city-input').val(),
        region: address.eq(i).find('.state-input').val(),
        country: address.eq(i).find('.country-input').val()
      });

      address.eq(i).find('.address-input').hide();
      address.eq(i).find('.content').show();

    }

  }
  info.address = adr;
  return info;
}

var setAddressInputs = function(){
  var address = $('.addressDom');
  var contactApi = $('.contact.active').data('contactApi');
  if(contactApi.address.length > 0){
    for (var i = 0; i < address.length; i++) {
      var addr = contactApi.address;

      address.eq(i).find('.content').hide();
      address.eq(i).find('.address-input').show();
      address.eq(i).find('.street-input').val(addr[i].street);
      address.eq(i).find('.postal-input').val(addr[i].code);
      address.eq(i).find('.state-input').val(addr[i].region);
      address.eq(i).find('.city-input').val(addr[i].city);
      address.eq(i).find('.country-input').val(addr[i].country);

    }
  }
}

// NOTES
var recoverNotes = function(contactApi){
  var notes = contactApi.note;
  if(notes != ''){
    notes = notes.replace(/\n/g, '<br>');
    notesSpan.html(notes);
  }else{
    $('.notes-section').hide();
  }
}

var lookNotes = function(info){
  if(notesInput.val() != ''){
    info.note = notesInput.val();
  }
  return info;
}

var cleanForm = function(){
  nameInput.val('');
  lastnameInput.val('');
  positionInput.val('');
  departmentInput.val('');
  companyInput.val('');
  officeInput.val('');
  nameSpan.text('');
  companySpan.text('');
  officeSpan.text('');
  positionSpan.text('');
  departmentSpan.text('');
  notesInput.val('');
  $('.phoneDom').remove();
  $('.mailDom').remove();
  $('.addressDom').remove();
}

var setAvatar = function(o, contact){
  console.log('SET AVATAR', o, contact);
  if(o.isCompany){
    contact.find('.avatar-letters').text( ( o.org.company[0] || '' ).toUpperCase() + ( o.org.company[1] || '' ).toUpperCase());
  }else{
    contact.find('.avatar-letters').text( ( o.name.first[0] || '' ).toUpperCase() + ( o.name.last[0] || '' ).toUpperCase());
  }
  var colorId = selectColor(o.id || '');
  contact.data('color', colorId);
  contact.find('.avatar').css('background-image', 'none');
  contact.find('.avatar').css('background-color', colorPalette[colorId].light);
  contact.find('.avatar').css('border-color', colorPalette[colorId].border);
  contact.find('.avatar').css('border-style', 'solid');
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

var contactMode = function(object){
  companyInput.before(nameInput);
  companyInput.before(lastnameInput);
  nameInput.css('margin-top', '8px');
  lastnameInput.css('margin-top', '8px');
  companyInput.css('margin-top', '0');
  officeInput.css('margin-top', '0');
  nameInput.focus();
}

var companyMode = function(object){
  nameInput.before(companyInput);
  nameInput.before(officeInput);
  companyInput.css('margin-top', '8px');
  officeInput.css('margin-top', '8px');
  nameInput.css('margin-top', '0');
  lastnameInput.css('margin-top', '0');
  companyInput.focus();
}

var newContact = function(){
  if(editState === true){
    alert('Primero confirma si deseas guardar o cancelar los cambios realizados en este contacto');
  }else{
    var contact = contactPrototype.clone();
    contact.removeClass('wz-prototype');
    contact.addClass('contactDom');
    contactList.append(contact);
    contact.click();
    cleanForm();
    editMode(true);
    $('.ui-window-content').show();
  }
}

var remove = function(){
  confirm('¿Seguro que desea eliminar este contacto?', function(o){
    if(o){
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
        var contactList = $('.contact-list .contactDom');
        if(contactList.length > 0){
          contactList.eq(0).click();
          welcomePage.hide();
          contactList.show();
          newContactButton.show();
        }else{
          $('.ui-window-content').hide();
          welcomePage.show();
          newContactButton.hide();
        }
      }else{
        var contactList = $('.contact-list .contactDom');
        if(contactList.length > 0){
          contactList.eq(0).click();
        }else{
          $('.ui-window-content').hide();
          welcomePage.show();
          newContactButton.hide();
        }
      }
    }
  });
}

var save = function(){
  editMode(false);

  var info = prepareInfo();

  info = lookPhones(info);
  info = lookMails(info);
  info = lookAddresses(info);
  info = lookNotes(info);

  var autoCompany = (info.name.first == '' && info.name.last == '' && info.org.company != '') ? true : false;

  if(autoCompany || companyCheck.hasClass('active')){
    info.isCompany = true;
  }else{
    info.isCompany = false;
  }

  var contact = $('.contact-list .contact.active');
  var contactApi = $('.contact.active').data('contactApi');

  var emptyContact = (info.name.first == '' && info.name.last == '' && info.org.company == '' && info.org.department == '' && info.org.office == '' && info.phone.length == 0 && info.address.length == 0 && info.email.length == 0 && notesInput.val() == '') ? true : false;

  if(emptyContact){
    confirm('Esta a punto de crear un contacto vacio, ¿Quiere continuar?', function(o){
      if(o){
        addModifyContactApi(contactApi, info, contact);
      }else{
        $('.contact.active').remove();
        $('.contact-info').hide();
        $('.contact-tab').hide();
        $('.tab.active').removeClass('active');
        var contactList = $('.contact-list .contactDom');
        if(contactList.length > 0){
          contactList.eq(0).click();
        }else{
          $('.ui-window-content').hide();
          welcomePage.show();
          newContactButton.hide();
        }
      }
    });
  }else{
    addModifyContactApi(contactApi, info, contact);
  }
}

var cancel = function(){

  var contactApi = $('.contact.active').data('contactApi');

  if(contactApi == undefined){
    editMode(false);
    $('.contact.active').remove();
    var contactList = $('.contact-list .contactDom');
    if(contactList.length > 0){
      contactList.eq(0).click();
    }else{
      $('.ui-window-content').hide();
      welcomePage.show();
      newContactButton.hide();
    }
  }else{
    editMode(false);
    $('.contact.active').click();
  }
}

var orderContact = function(contact){
  var contactApi = contact.data('contactApi');

  var list = $('.contactDom');
  for (var i = 0; i < list.length; i++) {
    var x = contact.find('.name-contact').text().localeCompare(list.eq(i).find('.name-contact').text());
    if(x == -1){
      list.eq(i).before(contact);
      return;
    }
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
  isCompany.toggle();
  notesSpan.toggle();
  notesInput.toggle();
  $('.remove').toggle();
}

var setExampleInputs = function(contactApi){
  if(contactApi == undefined || contactApi.phone.length == 0){
    addPhone('Móvil');
  }
  if(contactApi == undefined || contactApi.email.length == 0){
    addMail('Trabajo');
  }
  if(contactApi == undefined || contactApi.address.length == 0){
    addAddress('Trabajo');
  }
}

var setInitialTexts = function(){
  welcomePage.find('.welcome-first').text(lang.welcome);
  welcomePage.find('.welcome-second').text(lang.noContact);
  newContactWelcome.find('.ellipsis').text(lang.firstContact);
  $('.app-title').text(lang.contacts);
  newContactButton.find('span').text(lang.newContact);
  editContactButton.find('span').text(lang.editContact);
  isCompany.find('span').text(lang.company);
  saveContact.find('span').text(lang.save);
  cancelContact.find('span').text(lang.cancel);
  deleteContact.find('span').text(lang.delete);
  $('.phone-section .title').text(lang.phone);
  $('.mail-section .title').text(lang.email);
  $('.address-section .title').text(lang.address);
  $('.notes-section .title').text(lang.note);
  $('.phone-dropdown').find('.item').eq(0).text(lang.mobile);
  $('.phone-dropdown').find('.item').eq(1).text(lang.home);
  $('.phone-dropdown').find('.item').eq(2).text(lang.work);
  $('.mail-dropdown').find('.item').eq(0).text(lang.personal);
  $('.mail-dropdown').find('.item').eq(1).text(lang.work);
  $('.mail-dropdown').find('.item').eq(2).text(lang.other);
  $('.address-dropdown').find('.item').eq(0).text(lang.home);
  $('.address-dropdown').find('.item').eq(1).text(lang.work);
  $('.address-dropdown').find('.item').eq(2).text(lang.other);
}

// Program run
initContacts();
