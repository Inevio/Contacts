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

//DOM variables
//Contact list
var newContactButton      = $('.new-contact-button');
var contactList                   = $('.contact-list');
var contactPrototype        = $('.contact.wz-prototype');
var filePrototype           = $('.file.wz-prototype');

//Tabs
var tab                         = $('.contact-tab li');
var infoTab                     = $('.contact-tab .info');
var calendarTab                 = $('.contact-tab .calendar');
var filesTab                    = $('.contact-tab .files');
var mailTab                     = $('.contact-tab .mail');

//Info tab
var nameInput                   = $('input.name');
var positionInput               = $('input.position');
var deparmentInput              = $('input.deparment');
var companyInput                = $('input.company');
var editContactButton           = $('.edit-contact-button');
var saveContact                 = $('.save-contact-button');
var cancelContact               = $('.cancel-contact-button');
var deleteContact               = $('.delete-contact-button');
var newPhone                    = $('.phone-tab i');
var phonePrototype              = $('.phone.wz-prototype');
var phoneList                   = $('.phone-list');
var phoneDropdown               = $('.phone-dropdown');
var newMail                     = $('.mail-section i');
var mailPrototype               = $('.info-tab .mail.wz-prototype');
var mailList                    = $('.mail-list');
var newAddress                  = $('.address-tab i');
var addressPrototype            = $('.address.wz-prototype');
var addressList                 = $('.address-list');
var newPersonal                 = $('.personal-tab i');
var personalPrototype           = $('.personal.wz-prototype');
var personalList                = $('.personal-list');
var fileList                   = $('.files-list');

//Calendar tab
var calendarSection             = $('.calendar-tab.tab');
var dayPrototype                = $('.calendar-tab .day.wz-prototype');
var eventPrototype              = $('.calendar-tab .event.wz-prototype');

//TEST
$('.contact-info').hide();
$('.contact-tab').hide();

//DOM effects
$('.company, .deparment').on('focusout', function(){
  $(this).css('width', ( $(this).val().length * 8 ) );
});

$('.contact-list').on('click', '.contactDom', function(){
  selectContact($(this));
});

newContactButton.on('click', function(){

  if($('.edit-mode.save-contact-button').css('display') == 'block'){
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
});

/*
tab.on('click', function(){
  var object = $(this);
  $('.contact-tab .active').removeClass('active');
  $('.tab.active').removeClass('active');
  if(object.index() == 3){
    $('.files-tab').addClass('active');
  }else{
    $('.tab:eq('+object.index()+')').addClass('active');
  }
  object.addClass('active');
});

mailTab.on('click', function(){
  $('.tab.active').removeClass('active');
  $('.m'+$('.contactDom.active').index()).addClass('active');
});

calendarTab.on('click', function(){
  calendarSection.find('.domEvent').remove();
  // Search for the events  and added to the DOM
  wz.calendar.getAccounts(function(err, accounts) {
    accounts[0].getCalendars(function(err, calendars) {
      for (var i = 0; i < calendars.length; i++) {
        (function( i ){
          calendars[i].getEvents(function(err, events) {
            for(var j = 0; j<events.length; j++){
              var event = new Event();
              filterEventsByDate(events[j],calendars[i]);
            }
          });
        })( i );
      }
    });
  });
});

$('.contact-tab').on('click' , '.files' , function(){
  var contactApi = $('.contact.active').data('contactApi');

  if( contactApi['address-data']['x-inevio-files'] ){

    wz.fs( contactApi['address-data']['x-inevio-files'] , function ( error, fsnode ){
      fsnode.list( true , function( error, list ){

        fileList.children().not(':first').remove();

        for (var i=0; i<list.length; i++){

          var file = filePrototype.clone();
          file.removeClass('wz-prototype');
          file.addClass('fileDom');
          file.find('.file-name').text( list[i].name );
          if( list[i].thumbnails.normal ){
            file.find('.file-icon').css('background-image' , 'url(' + list[i].thumbnails.normal + ')' );
          }else{
            file.find('.file-icon').css('background-image' , 'url(' + list[i].icons.normal + ')' );
          }
          file.find('.modified-date').text( formatDate( list[i].modified ) );


          fileList.append(file);
          file.data('fileApi', list[i]);
          if(list[i].type == 0 || list[i].type == 1){
            file.addClass('dirClosed');
          }
        }

      });
    });

  }
});

$('.files-tab').on('click', '.unsync-button', function(){
  var info = prepareInfo();
  var contactApi = $('.contact.active').data('contactApi');
  fileList.children().not(':first').remove();

  contactApi.modify(info, function(e, o){

    console.log('CONTACTO MODIFICADO:', e, o);
    $('.contact.active').data('contactApi', o);
    $('.files-tab').addClass('unsynced');

  });
});


$('.files-tab').on('click', '.sync-button', function(){
  console.log('click');
  wz.fs.selectPath(null, 'Seleccione la carpeta', function(error, id){

    if(error){
      console.error('error');
    }else{
      console.log(id);
      var contactApi = $('.contact.active').data('contactApi');
      var info = prepareInfo();
      info['x-inevio-files'] = id;
      contactApi.modify(info, function(e, o){
        console.log('CONTACTO MODIFICADO:', e, o);
        $('.contact.active').data('contactApi', o);
        $('.files-tab').removeClass('unsynced');
        wz.fs(id, function ( error, fsnode ){
          fsnode.list( true , function( error, list ){

            fileList.children().not(':first').remove();
            for (var i=0; i<list.length; i++){

              var file = filePrototype.clone();
              file.removeClass('wz-prototype');
              file.find('.file-name').text( list[i].name );
              if( list[i].thumbnails.normal ){
                file.find('.file-icon').css('background-image' , 'url(' + list[i].thumbnails.normal + ')' );
              }else{
                file.find('.file-icon').css('background-image' , 'url(' + list[i].icons.normal + ')' );
              }
              file.find('.modified-date').text( formatDate( list[i].modified ) );

              fileList.append(file);
              file.data('fileApi', list[i]);

              if(list[i].type == 0 || list[i].type == 1){
                file.addClass('dirClosed');
              }
            }
          });
        });
      });
    }
  });
});

fileList.on( 'click', '.dirClosed, .dirOpened',  function(){
  var that = $(this);
  if(that.hasClass('dirClosed')){
    that.removeClass('dirClosed');
    that.addClass('dirOpened');
    var fileApi = $(this).data('fileApi');
    fileApi.list( true , function( error, list ){

      for (var i=0; i<list.length; i++){

        var file = filePrototype.clone();
        file.removeClass('wz-prototype');
        file.find('.file-name').text( list[i].name );
        if( list[i].thumbnails.normal ){
          file.find('.file-icon').css('background-image' , 'url(' + list[i].thumbnails.normal + ')' );
        }else{
          file.find('.file-icon').css('background-image' , 'url(' + list[i].icons.normal + ')' );
        }
        file.find('.modified-date').text( formatDate( list[i].modified ) );
        file.addClass('fileChildren');
        that.after(file);

        file.data('fileApi', list[i]);
        if(list[i].type == 0 || list[i].type == 1){
          file.addClass('dir');
        }
      }

    });
  }else{
    that.removeClass('dirOpened');
    that.addClass('dirClosed');
    var object = that.next();
    while(object.hasClass('fileChildren')){
      var aux = object.next();
      object.remove();
      object = aux;
    }
  }
});
*/

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
  }

});

newPhone.on('click', function(){
  phoneDropdown.show();
});

$('.info-tab').on('click','.phoneDom .remove,.mailDom .remove,.addressDom .remove',function(){
  console.log('entro');
  $(this).parent().remove();
});

phoneDropdown.find('article').on('click', function(){
  editMode(true);
  phoneDropdown.hide();

  var phone = phonePrototype.clone();
  phone.removeClass('wz-prototype');
  phone.addClass('phoneDom');
  phone.data('val', phone.find('.content').val());
  phone.find('.type').val($(this).text());

  phoneList.append(phone);
  phone.find('.content').removeAttr('disabled');
  phone.find('.content').focus();
});

newMail.on('click', function(){
  editMode(true);

  var mail = mailPrototype.clone();
  mail.removeClass('wz-prototype');
  mail.addClass('mailDom');
  var nMails  = mailList.children().size();
  if(nMails > 1){
    mail.find('.type').val('email '+nMails+':');
  }

  mailList.append(mail);
  mail.find('.content').removeAttr('disabled');
  mail.find('.content').focus();
});

newAddress.on('click', function(){
  editMode(true);

  var address = addressPrototype.clone();
  address.removeClass('wz-prototype');
  address.addClass('addressDom');
  var nAddresses  = addressList.children().size();
  if(nAddresses > 1){
    address.find('.type').val('address '+nAddresses+':');
  }

  addressList.append(address);
  address.find('.content').removeAttr('disabled');
  address.find('.content').focus();
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

  contact.find('.name').text(contactApi['address-data'].fn);
  if(contactApi['address-data'].org != undefined){
    contact.find('.position').text(contactApi['address-data'].org.name);
  }

  var contactIndex = $('.contactDom').length+1;

  contact.find('i').addClass('contact'+contactIndex);

  contact.data('contactApi' , contactApi);
  contact.addClass('contactDom');
  contactList.append(contact);
  setAvatar(contactApi, contact);
}

var selectContact = function(o){
  var contactApi = o.data('contactApi');
  if($('.edit-mode.save-contact-button').css('display') == 'block'){
    alert('You have to finish this contact first');
  }else{
    nameInput.removeClass('error');
    positionInput.removeClass('error');
    console.log('Contacto seleccionado:', contactApi);
    $('.contact-info').show();
    $('.contact-tab').show();
    $('.info-tab').addClass('active');
    $('.contact-tab .active').removeClass('active');
    $('.contact-tab .info').addClass('active');
    $('.contact.active').removeClass('active');
    o.addClass('active');

    if(contactApi != undefined){
      $('.contact-info').find('.name').val(o.find('.name').text());
      $('.contact-info').find('.position').val(o.find('.position').text());

      if(contactApi['address-data'].role == undefined){
        deparmentInput.hide();
      }else{
        deparmentInput.show();
        $('.contact-info').find('.deparment').val( contactApi['address-data'].role );
      }

      if(contactApi['address-data'].title == undefined){
        companyInput.hide();
      }else{
        companyInput.show();
        $('.contact-info').find('.company').val( contactApi['address-data'].title );
      }

      //Add phones to tab
      recoverPhones(contactApi);

      //Add mails to tab
      recoverMails(contactApi);

      //Add addresses to tab
      recoverAddresses(contactApi);

      //Check files status
      console.log( contactApi['address-data']['x-inevio-files'] );
      if ( contactApi['address-data']['x-inevio-files'] ){
        $('.files-tab').removeClass('unsynced');
      }else{
        $('.files-tab').addClass('unsynced');
      }

    }

    $('.contact-info .deparment').css('width', ( $('.contact-info .deparment').val().length * 8 ) );
    $('.contact-info .company').css('width', ( $('.contact-info .company').val().length * 8 ) );

    $('.contact-info .avatar-letters').text(o.find('.avatar-letters').text());
    $('.contact-info .avatar').css('background-color', o.find('.avatar').css('background-color'));
    $('.contact-info .avatar').css('border-color', o.find('.avatar').css('border-color'));
    $('.contact-info .avatar-letters').css('color', o.find('.avatar-letters').css('color'));
  }
}

var prepareInfo = function(){
  var contactApi = $('.contact.active').data('contactApi');
  var phones = contactApi != undefined ? contactApi['address-data'].tel : '';
  var mails = contactApi != undefined ? contactApi['address-data'].email : '';
  var addresses = contactApi != undefined ? contactApi['address-data'].adr : '';
  var files = contactApi != undefined ? contactApi['address-data']['x-inevio-files'] : '';
  var info = {
    n: {first : nameInput.val(), middle: '', last : ''},
    organization : positionInput.val(),
    role : deparmentInput.val(),
    title : companyInput.val(),
    adr : addresses,
    tel: phones,
    'x-inevio-files' : files,
    email: mails
  };
  return info;
}

// Enter o exit of edit mode on info tab
var editMode = function(mode){
  if(mode == true){

    app.key( 'enter', function(e){
        save();
    }, null, null );

    app.key( 'esc', function(e){
        cancel();
    }, null, null );

    $('.remove').css('display', 'inline-block');
    $('.contact-info input').addClass('focus');
    $('.contact-info input').removeAttr('disabled');
    $('.phone-list input, .mail-list input, .address-list input, .personal-list input').addClass('focus');
    $('.edit-mode').show();
    editContactButton.hide();
    $('.info-tab .content').removeAttr('disabled');
    deparmentInput.show();
    companyInput.show();
  }else{
    app.unkey('enter');
    app.unkey('esc');
    $('.remove').hide();
    $('.contact-info input').removeClass('focus');
    $('.contact-info input').attr('disabled', 'disabled');
    $('.phone-list input, .mail-list input, .address-list input, .personal-list input').removeClass('focus');
    $('.edit-mode').hide();
    editContactButton.show();
  }
}

// PHONES
var recoverPhones = function(contactApi){
  $('.phoneDom').remove();
  if(contactApi['address-data'] != undefined && contactApi['address-data'].tel != undefined && contactApi['address-data'].tel.length > 0){
    for (var i = 0; i < contactApi['address-data'].tel.length; i++) {
      var phone = phonePrototype.clone();
      phone.addClass('phoneDom');
      phone.removeClass('wz-prototype');
      phone.find('.type').val(contactApi['address-data'].tel[i].type);
      phone.find('.content').val(contactApi['address-data'].tel[i].value);
      phone.data('val', phone.find('.content').val());
      /*phone.find('.remove').on('click', function(){
      phone.remove();
      removePhone(contactApi, $(this));
      });*/
      phoneList.append(phone);
    }
  }
}

var lookPhones = function(info){
  var phones = $('.phoneDom');
  var tel = [];
  for (var i = 0; i < phones.length; i++) {
    if( phones.eq(i).find('.content').val() === '' ){
      phones.eq(i).remove();
    }else{
      tel.push({type: phones.eq(i).find('.type').val(), value: phones.eq(i).find('.content').val()});
    }
  }
  info.tel = tel;
  return info;
}

var recoverMails = function(contactApi){
  $('.mailDom').remove();
  if(contactApi['address-data'] != undefined && contactApi['address-data'].email != undefined && contactApi['address-data'].email.length > 0){
    for (var i = 0; i < contactApi['address-data'].email.length; i++) {
      var mail = mailPrototype.clone();
      mail.addClass('mailDom');
      mail.removeClass('wz-prototype');
      mail.find('.content').val(contactApi['address-data'].email[i].value);
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
    if( mails.eq(i).find('.content').val() === '' ){
      mails.eq(i).remove();
    }else{
      email.push({type: 'INTERNET', value: mails.eq(i).find('.content').val()});
    }
  }
  info.email = email;
  return info;
}

var recoverAddresses = function(contactApi){

  $('.addressDom').remove();
  if(contactApi['address-data'] != undefined && contactApi['address-data'].adr != undefined && contactApi['address-data'].adr.length > 0){
    for (var i = 0; i < contactApi['address-data'].adr.length; i++) {
      var address = addressPrototype.clone();
      address.addClass('addressDom');
      address.removeClass('wz-prototype');
      var nAddresses = addressList.children().size();

      address.find('.type').val(contactApi['address-data'].adr[i].type);
      address.find('.content').val(contactApi['address-data'].adr[i].value.region+contactApi['address-data'].adr[i].value.city);

      addressList.append(address);
    }
  }
}

var lookAddresses = function(info){
  var address = $('.addressDom');
  var adr = [];
  for (var i = 0; i < address.length; i++) {

    if( address.eq(i).find('.content').val() === '' ){
      address.eq(i).remove();
    }else{

      adr.push({
        type: address.eq(i).find('.type').val(),
        value: {city: address.eq(i).find('.content').val(), label:''}
      });

    }

  }
  info.adr = adr;
  return info;
}

var cleanForm = function(){
  nameInput.val('');
  positionInput.val('');
  deparmentInput.val('');
  companyInput.val('');
  $('.phone .content').val('');
  $('.mail .content').val('');
  $('.address .content').val('');

}

var setAvatar = function(o, contact){
  console.log('SET AVATAR', o, contact);
  var name = o['address-data']['fn'];
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

var save = function(){
  editMode(false);

  var info = prepareInfo();

  info = lookPhones(info);
  info = lookMails(info);
  info = lookAddresses(info);

  //Input Validations
  if(nameInput.val() == ''){
    nameInput.addClass('error');
    editMode(true);
  }else{
    $('.contact.active').find('.name').text(nameInput.val());
    nameInput.removeClass('error');
  }

  if(positionInput.val() == ''){
    positionInput.addClass('error');
    editMode(true);
  }else{
    $('.contact.active').find('.position').text(positionInput.val());
    positionInput.removeClass('error');
  }

  $('.info-tab .content').attr('disabled','disabled');

  var contact = $('.contact-list .contact.active');
  var contactApi = $('.contact.active').data('contactApi');
  if($('.contact-info .error').length == 0){

    if(deparmentInput.val() == ''){
      deparmentInput.hide();
    };
    if(companyInput.val() == ''){
      companyInput.hide();
    };

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
}

var cancel = function(){
  //Input Validations
  if($('.contact.active .name').text() == 'Contact name' || $('.contact.active .position').text() == 'Company'){
    nameInput.addClass('error');
    positionInput.addClass('error');
  }else{
    nameInput.removeClass('error');
    positionInput.removeClass('error');
    editMode(false);
  }

  if($('.edit-mode.save-contact-button').css('display') == 'none'){
    $('.contactDom.active').parent().click();
    $('.info-tab .content').attr('disabled','disabled');
  }

  if(deparmentInput.val() == ''){
    deparmentInput.hide();
  };
  if(companyInput.val() == ''){
    companyInput.hide();
  };

  var contactApi = $('.contact.active').data('contactApi');
  if(contactApi == undefined){
    $('.contact.active').remove();
    $('.contact-info').hide();
    $('.contact-tab').hide();
    $('.tab.active').removeClass('active');
  }

  $('.contact.active').click();
}

/*
var filterEventsByDate = function(eventApi, calendar){
  var days = calendarSection.find('.day');
  var found = '';
  var eventDate = new Date(eventApi.start.date);
  for (var i = 0; i < days.length; i++) {
    var day = days.eq(i).data('day');
    if(day != undefined && eventDate.getFullYear() == day.getFullYear() && eventDate.getMonth() == day.getMonth()  && eventDate.getDate() == day.getDate() ){
      addEventToDom(eventApi, calendar, days.eq(i));
      return;
    }
  }
  if(found == ''){
    var newDay = dayPrototype.clone();
    newDay.removeClass('wz-prototype');
    newDay.addClass('domEvent');
    newDay.text(eventDate.getDate()+'th of '+monthNames[eventDate.getMonth()]+', '+eventDate.getFullYear());
    calendarSection.append(newDay);
    newDay.data('day', eventDate);
    addEventToDom(eventApi, calendar, newDay);
  }
}

var addEventToDom = function(eventApi, calendar, day) {

  var event = new Event();

  event.title = eventApi.title;
  event.description = eventApi.description;
  event.allDay = eventApi.allDay;
  event.calendar = calendar;
  event.startDate = new Date(eventApi.start.date);
  event.endDate = new Date(eventApi.end.date);

  // Set the event color
  for ( var i=0; i<colorPalette.length; i++ ){
    if( colorPalette[i].border == calendar['calendar-color'] ){
      event.color = colorPalette[i];
      break;
    }
  }


  // Prepare the cell where is going to be inserted
  var cell = day;

  // Clone the proyotype and set the properties of it
  var eventDom = eventPrototype.clone();
  eventDom.removeClass('wz-prototype');
  eventDom.addClass('domEvent');
  eventDom.find('span:eq(0)').text(event.title);
  eventDom.css('border-left', '2px solid ' + event.color.border);
  eventDom.css('background-color', event.color.light);
  eventDom.css('color', event.color.text);

  var eventTimeString =  event.startDate.yyyymmdd() + ' ' + addZeroToHour(event.startDate.getHours()) + ':'+ addZeroToHour(event.startDate.getMinutes()) +' - ' + event.endDate.yyyymmdd()  + ' ' + addZeroToHour(event.endDate.getHours()) + ':'+ addZeroToHour(event.endDate.getMinutes());
  eventDom.find('span:eq(1)').text(eventTimeString);

  cell.after(eventDom);
}
*/

// Program run
initContacts();
