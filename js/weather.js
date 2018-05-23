function Weather(cont) {
   this.myCont = cont;
   this.weatherAPIkey = "e8029b6fca8f072ce33e3b939d139588";
   this.googleAPIkey = "AIzaSyCe3UIa1BXTiWMVoNfoy5NKkLjDfPShkpw";
}

Weather.prototype.searchByCity = function(city) {
   var url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&APPID=${this
      .weatherAPIkey}`;
   this.getCurrentWeather(url);
};

Weather.prototype.searchByLocation = function(lat, lon) {
   var url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&APPID=${this
      .weatherAPIkey}`;
   this.getCurrentWeather(url);
};

Weather.prototype.hideSearch = function() {
   var wWrapHeight = parseInt(window.getComputedStyle(this.wWrap).height) / 4;
   var contTop = parseInt(this.myCont.offsetTop);
   this.wWrap.style.top = wWrapHeight + 40 + "px";
   setTimeout(showDisplay,500,this)
   function showDisplay(self){
      self.wDisplay.style.opacity = 1;
   }
};

Weather.prototype.getCurrentWeather = function(url) {
   var self = this;
   var xml = new XMLHttpRequest();
   xml.open("GET", url);
   var bindData = getData.bind(this);
   xml.addEventListener("readystatechange", getData);
   function getData() {
      if (xml.status === 200 && xml.readyState === 4) {
         var responseText = xml.responseText;
         self.weatherJSON = JSON.parse(responseText);
         self.hideSearch();
         self.display();
      } else if (xml.status != 200) {
         self.wSearchEl.value = "Error, not found";
         self.wSearchEl.style.color = "red";
         setTimeout(time1, 2000, self.wSearchEl);
         function time1(el) {
            el.value = "";
            el.style.color = "black";
         }
      }
   }
   xml.send();
};

Weather.prototype.display = function() {
   var self = this;
   function addIcon() {
      var description = self.weatherJSON.list[0].weather[0].description;
      var iconTxt = self.weatherJSON.list[0].weather[0].icon;
      self.cityIconEl.innerHTML = `<img src='https://openweathermap.org/img/w/${iconTxt}.png'><p>${description}</p>`;
   }

   function addWind () {
      var windDeg = self.weatherJSON.list[0].wind.deg;
      var windSpd = parseInt(self.weatherJSON.list[0].wind.speed);
      self.cityWind.style.transform = `rotate(${windDeg}deg)`;
      self.cityWindSpd.innerHTML = `Speed: ${windSpd}m/s`;
      self.wDisplay.style.opacity = 1;
   }

   function addMain() {
      var temp = parseInt(self.weatherJSON.list[0].main.temp);
      var pressure = parseInt(self.weatherJSON.list[0].main.pressure);
      var humidity = parseInt(self.weatherJSON.list[0].main.humidity);
      var city = self.weatherJSON.city.name;
      self.cityMainEl.innerHTML = `<a href='https://www.google.rs/maps/place/${city}/' target="_blank" title="Locate ${city} on Google Maps">${city}</a><p>${temp}°C</p><p>Pressure: ${pressure}mbar</p><p>Humidity: ${humidity}%</p>`;
   }

   addMain();
   addIcon();
   addWind();
}

Weather.prototype.showQuote = function() {
   var quoteObj = this.getQuote();
   var quote = quoteObj.quote;
   var author = quoteObj.author;
   var authorWiki = `<a href="https://en.wikipedia.org/wiki/${author}" target="_blank">- ${author}</a>`;
   this.wQuotes.innerHTML =  `<p>“${quote}”</p><p title="Learn more about ${author}">${authorWiki}</p>`;
   this.wQuotes.style.opacity = 1;
}

Weather.prototype.randQuotes = function() {
   var randArr = [];
   var quotesCopyArr = [];
   var quotesCopyArr = quotesArr.slice();
   var len = quotesArr.length;
   for (var i = 0; i < len; i++) {
      var rand = Math.floor(Math.random() * quotesCopyArr.length);
      randArr.push(quotesCopyArr[rand]);
      quotesCopyArr.splice(rand, 1);
   }
   this.quotesCount = -1;
   this.quotes = randArr.slice();
};

Weather.prototype.getQuote = function() {
   if (this.quotesCount < this.quotes.length-1) {
      this.quotesCount++;
      return this.quotes[this.quotesCount];
   } else {
      this.quotesCount = 0;
      return this.quotes[this.quotesCount];
   }

};

Weather.prototype.init = function() {
   var self = this;
   function createElements() {
      self.myCont.innerHTML =
         '<div class="weather_display_wrap"><div class="city_icon"></div><div class="city_main"></div><div class="wind"><div class="wind_label">Wind</div><div class="city_wind_cont"><div class="deg_cont"><div class="deg_n">N</div><div class="deg_e">E</div><div class="deg_s">S</div><div class="deg_w">W</div></div><div class="city_wind"><div class="city_wind_arrow"><i class="city_wind_arrow_i"></i></div></div></div><div class="wind_speed">Speed:</div></div></div><div class="weather_location_wrap"><input class="weather_search" type="text" placeholder="Enter City Name"><div class="weather_submit weather_btns">SUBMIT</div><div class="weather_geo_submit weather_btns">LOCATE ME!</div></div></div><div class="quotes_wrap"><p></p></div>';
   }

   function getElements() {
      self.cityIconEl = self.myCont.querySelector(".city_icon");
      self.cityMainEl = self.myCont.querySelector(".city_main");
      self.cityWindEl = self.myCont.querySelector(".city_wind");
      self.wSearchEl = self.myCont.querySelector(".weather_search");
      self.wSearchEl.focus();
      self.wSubmitEl = self.myCont.querySelector(".weather_submit");
      self.wGeoSubmitEl = self.myCont.querySelector(".weather_geo_submit");
      self.wWrap = self.myCont.querySelector(".weather_location_wrap");
      self.wQuotes = self.myCont.querySelector(".quotes_wrap");
      self.wDisplay = self.myCont.querySelector(".weather_display_wrap");
      self.cityWind = self.myCont.querySelector(".city_wind");
      self.cityDeg = self.myCont.querySelector('.deg_cont');
      self.cityWindSpd = self.myCont.querySelector('.wind_speed');
   }

   function addListeners() {
      var clickBind = geoClick.bind(self);
      self.wSubmitEl.addEventListener("click", subClick);
      self.wGeoSubmitEl.addEventListener("click", geoClick);
      self.wSearchEl.addEventListener('keyup', subKeyUp);
      function geoClick() {
         self.location();
         self.showQuote();
      }
      function subClick() {
         if (self.wSearchEl.value.length > 0) {
            var city = self.wSearchEl.value;
            self.searchByCity(city);
            self.showQuote();
         }
      }
      function subKeyUp(){
         if (event.keyCode === 13 && self.wSearchEl.value.length > 0) {
            var city = self.wSearchEl.value;
            self.searchByCity(city);
            self.showQuote();
         }
      }
   }
   createElements();
   getElements();
   addListeners();
   self.randQuotes();
};

Weather.prototype.location = function() {
   var self = this;
   function googleGeo() {
      var url = `https://www.googleapis.com/geolocation/v1/geolocate?key=${self.googleAPIkey}`;
      var xml = new XMLHttpRequest();
      xml.open("POST", url);
      xml.addEventListener("readystatechange", getData);
      function getData() {
         if (xml.readyState == 4 && xml.status == 200) {
            var text = xml.responseText;
            var locationJSON = JSON.parse(text);
            self.accuracy = locationJSON.accuracy;
            self.lat = locationJSON.location.lat;
            self.lng = locationJSON.location.lng;
         }
      }
      xml.send();
   }
   googleGeo();
   var bind1 = time1.bind(self);
   var loop1 = setInterval(bind1, 10);
   function time1() {
      if (this.lat) {
         clearInterval(loop1);
         this.searchByLocation(this.lat, this.lng);
      }
   }
};
