$(document).ready(function() {
var icon;
var currentWeather;
var currentWeatherForecast;
var weatherForecast;

// get name of the day function
  (function() {
      var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
      var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
      Date.prototype.getMonthName = function() {
          return months[ this.getMonth() ];
      };
      Date.prototype.getDayName = function() {
          return days[ this.getDay() ];
      };
  })();
  var today = new Date();
  var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday', 'Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  today = today.getDayName();
  var startingPos = days.indexOf(today);
  var nextDays = [startingPos + 1, startingPos + 2, startingPos + 3];

// #### FETCH DATA #####
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var latitude = position.coords.latitude;
      var longitude = position.coords.longitude;
      console.log(latitude);
      console.log(longitude);

  // ############## WEATHER FORECAST #########
$.getJSON("http://api.openweathermap.org/data/2.5/forecast/daily?lat=" + latitude + "&lon="+longitude +"&appid=322fb42145c8a682b9abc1d2c1f8f41c&cnt=4&units=metric&", function(json) {
    weatherForecast = json;

    // ############ CURRENT WEATHER #############
    $.getJSON("http://api.openweathermap.org/data/2.5/weather?lat=" + latitude + "&lon="+longitude +"&appid=322fb42145c8a682b9abc1d2c1f8f41c&units=metric&type=accurate", function(json2) {
      currentWeather = json2;

    // ############## CURRENT WEATHER FORECAST #########
        $.getJSON("http://api.openweathermap.org/data/2.5/forecast?lat=" + latitude + "&lon="+longitude +"&appid=322fb42145c8a682b9abc1d2c1f8f41c&cnt=3&units=metric&type=accurate", function(json3) {
          currentWeatherForecast = json3;
      }); // end of 3rd getJSOn

    }); // end of 2nd getJSON
}); // enf of 1st getJSON

    // #### HIDE OVERLAY #####
    $('.overlay').hide();

    // ### ON AJAX STOP ######
    $(document).ajaxStop(function() {
      // ### WEATHER FORECAST ###
      var tempArr = weatherForecast.list;
      // first item is current day, we don't need to forecast current day, so we splice the array
      tempArr = tempArr.slice(1, tempArr.length);
      console.log(weatherForecast);
      //console.log(tempArr);
      for (i = 0; i < tempArr.length; i++) {
        pick_icon(tempArr[i].weather[0].icon);
        var morningTemp = tempArr[i].temp.morn.toFixed(1) + "°C";
        if (tempArr[i].temp.morn < 0) {
          morningTemp = "<span style='color: blue'>" + tempArr[i].temp.morn.toFixed(1) + "°C</span>";
        }
        var dayTemp = tempArr[i].temp.day.toFixed(1) + "°C";
        if (tempArr[i].temp.day >= 30) {
          dayTemp = "<span style='color: red'>" + tempArr[i].temp.day.toFixed(1) + "°C</span>";
        }
        $('.forecast').append("<div class='day'><h3>" + days[nextDays[i]] + "</h3><i class='" + icon +" thumbnail'></i><p>" + morningTemp + " / " + dayTemp +"</p></div>");
      }

      // ### CURRENT WEATHER###
      console.log(currentWeather);
      pick_icon(currentWeather.weather[0].icon);
      $('.current-weather').html("<div class='half'><h1>" + currentWeather.main.temp.toFixed(1) + " °C" + "</h1>" + "<div class='description'><i class='" + icon + " front-image'></i>" + "<h2>"+ currentWeather.weather[0].description + "</h2></div>" + "<h3><i class='wi wi-humidity'></i> " + currentWeather.main.humidity + "%</h3><h3>" + currentWeather.main.pressure + " hPa</h3></div><div id='right' class='half'><h2 class='city'>" + currentWeather.name + "</h3>" );

      // ### CURRENT WEATHER FORECAST ###
      console.log(currentWeatherForecast);
      var tempArr2 = currentWeatherForecast.list;
      for (i = 0; i < tempArr2.length; i++) {
        var temp = tempArr2[i].main.temp.toFixed(1) + "°C ";
        pick_icon(tempArr2[i].weather[0].icon);
        var time = tempArr2[i].dt_txt.slice(10, 16);
        $('#right').append("<div class='hourly-forecast'><div class='time'>" + time + "</div> " + "<i class='" + icon + "  thumbnail-small'></i>" + "<div class='temp'>" + temp + "</div></div>");
      }
    });
});


} // end of navigator geolocation

// returns correct weather icon based on the openweathermap icon
function pick_icon(json_icon) {
  switch (json_icon) {
    case '01d':
      icon = 'wi wi-day-sunny';
      break;
    case '01n':
      icon = 'wi wi-night-clear';
      break;
    case '02d':
      icon = 'wi wi-day-cloudy';
      break;
    case '02n':
      icon = 'wi wi-night-alt-cloudy';
      break;
    case '03d' || '03n':
      icon = 'wi wi-cloud';
      break;
    case '04d' || '04n':
      icon = 'wi wi-cloudy';
      break;
    case '09d' || '09n':
      icon = 'wi wi-showers';
      break;
    case '10d' || '10n':
      icon = 'wi wi-rain';
      break;
    case '11d' || '11n':
      icon = 'wi wi-thunderstorm';
      break;
    case '13d' || '13n':
      icon = 'wi wi-snow';
      break;
    case '50d' || '50n':
      icon = 'wi wi-fog';
      break;
      default:
        icon = 'wi wi-day-cloudy';
        break;
  }
  return icon;
}

});
