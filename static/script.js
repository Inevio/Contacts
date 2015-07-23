'use strict'

// CONSTANTS
var BROWSER_FIREFOX = 0;
var BROWSER_IE = 1;
var BROWSER_WEBKIT = 2;
var BROWSER_TYPE = /webkit/i.test(navigator.userAgent) ? BROWSER_WEBKIT : (/trident/i.test(navigator.userAgent) ? BROWSER_IE : BROWSER_FIREFOX);
var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

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
var tab                                = $('.contact-tab li');
var infoTab                        = $('.contact-tab .info');
var calendarTab                 = $('.contact-tab .calendar');
var filesTab                    = $('.contact-tab .files');

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
  var contact = contactPrototype.clone();
  contact.removeClass('wz-prototype');

  wz.contacts.getAccounts(function(err, list){
    list[0].getGroups(function(e, o){
      var info = {
        n: {first : 'Contact name', middle: '', last : ''},
        organization : 'Company'
      };
      o[0].createContact(info, function(e, o){
        console.log('Añadiendo contacto nuevo: ');
        console.log(e, o);

        /*contact.on('click', function(){
          selectContact($(this), o);
        });*/

        var contactIndex = $('.contactDom').length+1;

        contact.find('i').addClass('contact'+contactIndex);
        contact.addClass('contactDom');
        contactList.append(contact);
        contact.click();
        editMode(true);
      });
    });
  });
});

tab.on('click', function(){
  var object = $(this);
  $('.contact-tab .active').removeClass('active');
  $('.tab.active').removeClass('active');
  $('.tab:eq('+object.index()+')').addClass('active');
  object.addClass('active');
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

/*filesTab.on('click', function(){
  var contactApi = $('.contact.active').data('contactApi');

});*/

editContactButton.on('click', function(){
  editMode(true);
});

cancelContact.on('click', function(){

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
  }

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
          file.find('.file-name').text( list[i].name );
          if( list[i].thumbnails.normal ){
            file.find('.file-icon').css('background-image' , 'url(' + list[i].thumbnails.normal + ')' );
          }else{
            file.find('.file-icon').css('background-image' , 'url(' + list[i].icons.normal + ')' );
          }
          file.find('.modified-date').text( formatDate( list[i].modified ) );

          fileList.append(file);

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

            }

          });
        });
      });
      /*wz.fs(id, function(error, node){
        console.log(node);
      });*/
    }

  });
});

saveContact.on('click', function(){
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

  var contactApi = $('.contact.active').data('contactApi');
  contactApi.modify(info, function(e, o){
    console.log('CONTACTO MODIFICADO:', e, o);
    var contact = $('.contact-list .contact.active');
    contact.off('click');
    /*contact.on('click', function(){
      selectContact($(this), o);
    });*/
  });

});

deleteContact.on('click', function(){
  editMode(false);
  var contactApi = $('.contact.active').data('contactApi');
  contactApi.delete(function(e, o){
    console.log('CONTACTO BORRADO', e, o);
  });
  $('.contact.active').parent().remove();
  $('.contact-info').hide();
  $('.contact-tab').hide();
  $('.tab.active').removeClass('active');
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

  /*contact.on('click', function(){
    selectContact($(this), contactApi);
  });*/

  contact.data('contactApi' , contactApi);
  contact.addClass('contactDom');
  contactList.append(contact);
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
    if(o.find('.name').text() != 'Contact name'){
      $('.contact-info').find('.name').val(o.find('.name').text());
    }else{
      $('.contact-info').find('.name').val('');
    }
    if(o.find('.position').text() != 'Company'){
      $('.contact-info').find('.position').val(o.find('.position').text());
    }else{
      $('.contact-info').find('.position').val('');
    }
    if(o.find('.role').text() != 'Company'){
      $('.contact-info').find('.deparment').val( contactApi['address-data'].role );
    }else{
      $('.contact-info').find('.deparment').val('');
    }
    if(o.find('.title').text() != 'Company'){
      $('.contact-info').find('.company').val( contactApi['address-data'].title );
    }else{
      $('.contact-info').find('.company').val('');
    }

    $('.contact-info .deparment').css('width', ( $('.contact-info .deparment').val().length * 8 ) );
    $('.contact-info .company').css('width', ( $('.contact-info .company').val().length * 8 ) );
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

    $('.contact-info').find('.photo').removeClass();
    $('.contact-info').find('i').eq(0).addClass('photo');
    $('.contact-info').find('.photo').addClass('contact'+o.index());

    $('.contact.active').data('contactApi', contactApi);
  }
}

var prepareInfo = function(){
  var contactApi = $('.contact.active').data('contactApi');
  var phones = contactApi['address-data'].tel != undefined ? contactApi['address-data'].tel : '';
  var mails = contactApi['address-data'].email != undefined ? contactApi['address-data'].email : '';
  var addresses = contactApi['address-data'].adr != undefined ? contactApi['address-data'].adr : '';
  var info = {
    n: {first : nameInput.val(), middle: '', last : ''},
    organization : positionInput.val(),
    role : deparmentInput.val(),
    title : companyInput.val(),
    adr : addresses,
    tel: phones,
    email: mails
  };
  return info;
}

// Enter o exit of edit mode on info tab
var editMode = function(mode){
  if(mode == true){
    $('.remove').css('display', 'inline-block');
    $('.contact-info input').addClass('focus');
    $('.contact-info input').removeAttr('disabled');
    $('.phone-list input, .mail-list input, .address-list input, .personal-list input').addClass('focus');
    $('.edit-mode').show();
    editContactButton.hide();
  }else{
    $('.remove').hide();
    $('.contact-info input').removeClass('focus');
    $('.contact-info input').attr('disabled', 'disabled');
    $('.phone-list input, .mail-list input, .address-list input, .personal-list input').removeClass('focus');
    $('.edit-mode').hide();
    editContactButton.show();
  }
}

// PHONES

/*var removePhone = function(contactApi, phone){
  var phones =  contactApi['address-data'].tel;
  for (var i = 0; i < phones.length; i++) {
    if(phones[i].value == phone.data('val')){
      phones.splice(i, 1);;
      var info = prepareInfo();
      info.tel = phones;

      contactApi.modify(info, function(e, o){
        console.log('TELEFONO BORRADO:', e, o);
        var contact = $('.contact-list .highlight-area.active').parent();
        contact.off('click');
        contact.on('click', function(){
          selectContact($(this), o);
        });
      });
    }
  }
}*/

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

// MAILS
/*var removeMail = function(contactApi, mail){
  var mails =  contactApi['address-data'].email;
  for (var i = 0; i < mails.length; i++) {
    if(mails[i].value == mail){
      mails.splice(i, 1);;
      var info = prepareInfo();
      info.email = mails;

      contactApi.modify(info, function(e, o){
        console.log('EMAIL BORRADO:', e, o);
        var contact = $('.contact-list .highlight-area.active').parent();
        contact.off('click');
        contact.on('click', function(){
          selectContact($(this), o);
        });
      });
    }
  }
}*/

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
        mail.find('.type').val('email:');
      }
      /*mail.find('.remove').on('click', function(){
        mail.remove();
        removeMail(contactApi, mail.find('.content').val());
      });*/
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

// ADDRESS
/*var removeAddress = function(contactApi, address){

  var addresses =  contactApi['address-data'].adr;
  for (var i = 0; i < addresses.length; i++) {
    if(addresses[i].value.city == address){
      addresses.splice(i, 1);
      var info = prepareInfo();
      info.adr = addresses;

      contactApi.modify(info, function(e, o){
        console.log('DIRECCION BORRADO:', e, o);
        var contact = $('.contact-list .highlight-area.active').parent();
        contact.off('click');
        contact.on('click', function(){
          selectContact($(this), o);
        });
      });
    }
  }
}*/

var recoverAddresses = function(contactApi){

  $('.addressDom').remove();
  if(contactApi['address-data'] != undefined && contactApi['address-data'].adr != undefined && contactApi['address-data'].adr.length > 0){
    for (var i = 0; i < contactApi['address-data'].adr.length; i++) {
      var address = addressPrototype.clone();
      address.addClass('addressDom');
      address.removeClass('wz-prototype');
      var nAddresses = addressList.children().size();
      /*if(nAddresses > 1){
        address.find('.type').val('Address '+nAddresses+':');
      }*/
      address.find('.type').val(contactApi['address-data'].adr[i].type);
      address.find('.content').val(contactApi['address-data'].adr[i].value.city);
      /*address.find('.remove').on('click', function(){
        removeAddress(contactApi, address.find('.content').val());
        address.remove();
      });*/
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

// Program run
initContacts();
