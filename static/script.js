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

//Tabs
var tab                                = $('.contact-tab li');
var infoTab                        = $('.contact-tab .info');
var calendarTab                 = $('.contact-tab .calendar');

//Info tab
var nameInput                   = $('input.name');
var positionInput               = $('input.position');
var newPhone                    = $('.phone-tab i');
var phonePrototype              = $('.phone.wz-prototype');
var phoneList                   = $('.phone-list');
var newMail                     = $('.mail-tab i');
var mailPrototype               = $('.mail.wz-prototype');
var mailList                    = $('.mail-list');
var newAddress                  = $('.address-tab i');
var addressPrototype            = $('.address.wz-prototype');
var addressList                 = $('.address-list');
var newPersonal                 = $('.personal-tab i');
var personalPrototype           = $('.personal.wz-prototype');
var personalList                = $('.personal-list');

//Calendar tab
var calendarSection             = $('.calendar-tab.tab');
var dayPrototype                = $('.calendar-tab .day.wz-prototype');
var eventPrototype              = $('.calendar-tab .event.wz-prototype');

//TEST
$('.contact-info').hide();
$('.contact-tab').hide();

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
    $('.info-tab').addClass('active');


  });
  contactList.append(contact);
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

nameInput.on('focusout', function(){
  var object = $(this);
  if(object.val() != ''){
    $('.highlight-area.active').find('.name').text(object.val());
  }
});

positionInput.on('focusout', function(){
  var object = $(this);
  if(object.val() != ''){
    $('.highlight-area.active').find('.position').text(object.val());
  }
});

newPhone.on('click', function(){
  var phone = phonePrototype.clone();
  phone.removeClass('wz-prototype');
  phone.find('.remove').on('click', function(){
    phone.remove();
  });
  phoneList.append(phone);
});



newMail.on('click', function(){
  var mail = mailPrototype.clone();
  mail.removeClass('wz-prototype');
  var nMails = mailList.children().size();
  if(nMails > 1){
    mail.find('.type').val('Email '+nMails+':');
  }
  mail.find('.remove').on('click', function(){
    mail.remove();
  });
  mailList.append(mail);
});

newAddress.on('click', function(){
  var address = addressPrototype.clone();
  address.removeClass('wz-prototype');
  address.find('.remove').on('click', function(){
    address.remove();
  });
  addressList.append(address);
});

newPersonal.on('click', function(){
  var personal = personalPrototype.clone();
  personal.removeClass('wz-prototype');
  personal.find('.remove').on('click', function(){
    personal.remove();
  });
  personalList.append(personal);
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

Date.prototype.yyyymmdd = function() {
   var yyyy = this.getFullYear().toString();
   var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
   var dd  = this.getDate().toString();
   return yyyy +'/' + (mm[1]?mm:"0"+mm[0]) +'/' +(dd[1]?dd:"0"+dd[0]); // padding
};

// APP functionality
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
