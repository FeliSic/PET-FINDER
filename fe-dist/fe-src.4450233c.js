import{Router as e}from"@vaadin/router";import{jwtDecode as t}from"jwt-decode";import o from"leaflet";import"leaflet/dist/leaflet.css";import r from"dropzone";function a(){if(!customElements.get("custom-header")){class e extends HTMLElement{isMenuOpen;constructor(){super(),this.attachShadow({mode:"open"}),this.isMenuOpen=!1,this.render()}toggleMenu(){this.isMenuOpen=!this.isMenuOpen;let e=this.shadowRoot.querySelector(".menu");this.isMenuOpen?(e.style.display="flex",e.style.flexDirection="column",e.style.justifyContent="space-between"):e.style.display="none"}render(){let e=`
          <style>
            header {
              background-color: #16244D;
              color: white;
              padding: 0 20px;
              margin: 0;
              height: 50px;
              display: flex;
              align-items: center;
              justify-content: space-between;
              position: relative;
            }
            h1 {
              margin: 0;
            }
            button.hamburger {
              background: none;
              border: none;
              color: white;
              font-size: 24px;
              cursor: pointer;
            }
            .menu {
              display: none; /* Ocultar por defecto */
              position: fixed; /* Fijo para ocupar toda la pantalla */
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background-color: rgba(18, 18, 19, 0.97); /* Fondo semi-transparente */
              flex-direction: column;
              align-items: flex-end; /* Alinear el contenido a la derecha */
              box-shadow: 0 2px 5px rgba(0,0,0,0.3);
              z-index: 10;
            }
            .menu a {
              color: white;
              padding: 10px 15px;
              text-decoration: none;
              border-bottom: 1px solid #2c3e50;
              width: 100%; /* Para que el enlace ocupe todo el ancho */
              text-align: center; /* Centrar texto */
            }
            .menu a:hover {
              background-color: #1b2a5a;
            }
            .close-button {
              background: none;
              border: none;
              color: white;
              font-size: 24px;
              cursor: pointer;
              margin-right: 20px;
              margin-bottom: 20px; /* Espacio debajo de la X */
            }
          </style>
        `;this.shadowRoot.innerHTML=e+`
          <header>
            <h1>Mi App</h1>
            <button class="hamburger" aria-label="Toggle menu">&#9776;</button>
            <nav class="menu">
              <button class="close-button" aria-label="Close menu">X</button>
              <a class="datos">Mis datos</a>
              <a class="reportes" href="/mis-mascotas">Reportes</a>
              <a class="misReportes" href="/reportar-mascota">Mis mascotas reportadas</a>
            </nav>
          </header>
        `;let t=this.shadowRoot.querySelector(".datos"),o=this.shadowRoot.querySelector(".reportes"),r=this.shadowRoot.querySelector(".misReportes");t.addEventListener("click",e=>{e.preventDefault(),console.log("Click en Mis datos"),this.toggleMenu(),window.history.pushState({},"","/menu"),window.dispatchEvent(new PopStateEvent("popstate"))}),o.addEventListener("click",e=>{e.preventDefault(),console.log("Click en Reportes"),this.toggleMenu(),window.history.pushState({},"","/home"),window.dispatchEvent(new PopStateEvent("popstate"))}),r.addEventListener("click",e=>{e.preventDefault(),console.log("Click en Mis Reportes"),this.toggleMenu(),window.history.pushState({},"","/myPets"),window.dispatchEvent(new PopStateEvent("popstate"))}),this.shadowRoot.querySelector("button.hamburger").addEventListener("click",()=>this.toggleMenu()),this.shadowRoot.querySelector(".close-button").addEventListener("click",()=>this.toggleMenu())}}customElements.define("custom-header",e)}}class n extends HTMLElement{userLat=null;userLng=null;locationName="";connectedCallback(){this.render()}async getUserLocation(){return new Promise((e,t)=>{navigator.geolocation?navigator.geolocation.getCurrentPosition(async t=>{let o=t.coords.latitude,r=t.coords.longitude;try{let t=await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${o}&lon=${r}&zoom=18&addressdetails=1`),a=(await t.json()).display_name||`${o.toFixed(6)}, ${r.toFixed(6)}`;e({lat:o,lng:r,name:a})}catch(t){e({lat:o,lng:r,name:`${o.toFixed(6)}, ${r.toFixed(6)}`})}},e=>{t(e)}):t(Error("Geolocalización no soportada"))})}render(){a(),document.body.style.margin="0",document.body.style.padding="0",this.innerHTML=`
      <form class="profileForm" style="width: 90%; max-width: 500px; display: flex; flex-direction: column; gap: 20px; align-items: center; margin: 80px auto; padding: 30px; border: 1px solid #ccc; border-radius: 8px; background-color: #f9f9f9;">
        <h1 style="color: #5982FF;">Registrarse</h1>
        <h3 style="text-align: center; color: #666;">Ingres\xe1 los siguientes datos para realizar el registro</h3>
        
        <label for="Email" style="align-self: flex-start; font-weight: bold;">Email *</label>
        <input type="email" class="email" name="Email" required placeholder="ejemplo@email.com" style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px;" />

        <label for="Password" style="align-self: flex-start; font-weight: bold;">Contrase\xf1a *</label>
        <input type="password" class="password" name="Password" required placeholder="M\xednimo 8 caracteres" style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px;" />
        
        <label for="confirmPassword" style="align-self: flex-start; font-weight: bold;">Confirmar contrase\xf1a *</label>
        <input type="password" class="confirmPassword" name="confirmPassword" required placeholder="Repite tu contrase\xf1a" style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px;" />

        <label for="name" style="align-self: flex-start; font-weight: bold;">Nombre (opcional)</label>        
        <input type="text" class="nombre" name="name" placeholder="John Doe" style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px;" />

        <div style="width: 100%; border-top: 2px solid #ddd; margin: 10px 0;"></div>
        
        <h4 style="color: #666; text-align: center; margin: 10px 0;">\u{1F4CD} Ubicaci\xf3n (opcional pero recomendado)</h4>
        <p style="color: #888; font-size: 14px; text-align: center; margin: 0;">Esto nos ayuda a mostrarte mascotas cercanas</p>

        <button type="button" class="location-btn" style="width: 100%; padding: 12px; background-color: #8CD48D; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 16px;">
          \u{1F4CD} Obtener mi ubicaci\xf3n
        </button>

        <div class="location-info" style="display: none; width: 100%; padding: 10px; background-color: #e8f5e9; border-radius: 4px; border: 1px solid #4caf50;">
          <p style="margin: 0; color: #2e7d32; font-weight: bold;">\u{2705} Ubicaci\xf3n obtenida:</p>
          <p class="location-text" style="margin: 5px 0 0; color: #555; font-size: 14px;"></p>
        </div>
        
        <a class="iniciosesion" href="/Log-in" style="text-decoration: none; color: #5982FF; align-self: center; margin-top: 10px;">
          \xbfYa ten\xe9s una cuenta? Inici\xe1 Sesi\xf3n
        </a>

        <button class="saveButton" type="submit" style="width: 100%; padding: 12px; background-color: #5982FF; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 16px;">
          Registrarse
        </button>
        
        <div class="error-message" style="display: none; color: #FF4C4C; text-align: center; width: 100%;"></div>
      </form>
    `;let e=document.createElement("custom-header");this.prepend(e),this.querySelector(".iniciosesion").addEventListener("click",e=>{e.preventDefault(),window.history.pushState({},"","/Log-in"),window.dispatchEvent(new PopStateEvent("popstate"))});let t=this.querySelector(".location-btn"),o=this.querySelector(".location-info"),r=this.querySelector(".location-text");t.addEventListener("click",async()=>{t.textContent="🔄 Obteniendo ubicación...",t.disabled=!0;try{let e=await this.getUserLocation();this.userLat=e.lat,this.userLng=e.lng,this.locationName=e.name,r.textContent=e.name,o.style.display="block",t.textContent="✅ Ubicación guardada",t.style.backgroundColor="#4caf50"}catch(e){console.error("Error al obtener ubicación:",e),alert("No se pudo obtener tu ubicación. Podés continuar sin ella o intentar de nuevo."),t.textContent="📍 Obtener mi ubicación",t.disabled=!1}});let n=this.querySelector(".profileForm"),i=this.querySelector(".saveButton"),s=this.querySelector(".error-message");n.addEventListener("submit",async e=>{e.preventDefault();let t=this.querySelector(".email").value,o=this.querySelector(".password").value,r=this.querySelector(".confirmPassword").value,a=this.querySelector(".nombre").value;if(o!==r){s.textContent="Las contraseñas no coinciden",s.style.display="block";return}if(o.length<8){s.textContent="La contraseña debe tener al menos 8 caracteres",s.style.display="block";return}let n=this.userLat&&this.userLng?{name:this.locationName,lat:this.userLat,lng:this.userLng}:void 0,l={email:t,password:o,confirmPassword:r};a&&(l.name=a),n&&(l.location=n),console.log("Datos a enviar:",l),i.textContent="Registrando...",i.disabled=!0,s.style.display="none";try{let e=await fetch("https://pet-finder-dedt.onrender.com/profile",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(l)}),t=await e.json();if(!e.ok)throw Error(t.error||"Error al guardar el usuario");console.log("Usuario guardado:",t);let o=t["Usuario y Auth creados"]?.userId;if(!o)throw Error("No se recibió el ID del usuario");localStorage.setItem("userId",o.toString()),alert("✅ ¡Registro exitoso! Redirigiendo..."),window.history.pushState({},"","/menu"),window.dispatchEvent(new PopStateEvent("popstate"))}catch(e){console.error("Error:",e),s.textContent=e.message,s.style.display="block",i.textContent="Registrarse",i.disabled=!1}})}}customElements.define("register-component",n);class i extends HTMLElement{connectedCallback(){this.render()}render(){a(),document.body.style.margin="0",document.body.style.padding="0",this.innerHTML=`
          <form class="profileForm" style="width: 400px; display: flex; flex-direction: column; gap: 20px; align-items: center; margin: 80px auto; padding: 20px; border: 1px solid #ccc; border-radius: 8px; background-color: #f9f9f9;">
        <h1 style="color: #5982FF;">inicio de sesi\xf3n</h1>
        <h3 style="text-align: center; color: #666;">Ingres\xe1 los siguientes datos para realizar el inicio de sesi\xf3n</h3>
        
        <label for="Email" style="align-self: flex-start; font-weight: bold;">Email:</label>
        <input type="email" class="email" name="Email" required placeholder="ejemplo@email.com" style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px;" />

        <label for="Password" style="align-self: flex-start; font-weight: bold;">Contrase\xf1a:</label>
        <input type="password" class="password" name="Password" required placeholder="M\xednimo 8 caracteres" style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px;" />
        
        
        <a  href="/" style="text-decoration: none; color: #5982FF; align-self: center;">
          \xbfNo tenes una cuenta? Registrate
        </a>

        <button class="saveButton" type="submit" style="width: 100%; padding: 12px; background-color: #5982FF; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 16px;">
          Iniciar sesi\xf3n
        </button>
        
        <div class="error-message" style="display: none; color: #FF4C4C; text-align: center; width: 100%;"></div>
      </form>
    
    `;let e=document.createElement("custom-header");this.prepend(e),this.querySelector("a").addEventListener("click",e=>{e.preventDefault(),window.history.pushState({},"","/"),window.dispatchEvent(new PopStateEvent("popstate"))});let o=this.querySelector(".profileForm"),r=this.querySelector(".email"),n=this.querySelector(".password");o.addEventListener("submit",async e=>{e.preventDefault();let o={email:r.value,password:n.value};console.log("Datos a enviar:",o);try{let e=await fetch("https://pet-finder-dedt.onrender.com/profile/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(o)});if(!e.ok)throw Error("Error al guardar el usuario");let r=await e.json();console.log("Usuario :",r);let a=t(r.token).userId;localStorage.setItem("userId",a),window.history.pushState({},"","/menu"),window.dispatchEvent(new PopStateEvent("popstate"))}catch(e){console.error("Error:",e)}})}}customElements.define("login-component",i);class s extends HTMLElement{connectedCallback(){this.render()}async fetchUserData(e){try{let t=await fetch(`https://pet-finder-dedt.onrender.com/profile/${e}`,{method:"GET",headers:{"Content-Type":"application/json"}});if(!t.ok)throw Error("Error al obtener los datos del usuario");if(!e)return console.error("No hay userId disponible"),null;let o=await t.json();return console.log("Datos del usuario:",o),o}catch(e){console.error("Error:",e)}}async render(){a(),document.body.style.margin="0",document.body.style.padding="0";let e=localStorage.getItem("userId");if(!e)return void console.error("No hay userId disponible");let t=await this.fetchUserData(e);console.log("Datos del usuario:",t),this.innerHTML=`
      <div class="container" style="width: 400px; height: 550px; display: flex; flex-direction: column; justify-content: space-between; align-items: center; margin: 0 auto;">
        <h1>Mis datos</h1>
        <div>
          <button class="menu1Button" type="submit" style="width: 100%; padding: 15px; margin-bottom: 20px; background-color: #5982FF; border: 5px solid #1B399E; border-radius: 5px; color: #eee">Modificar datos personales</button>
          <button class="menu2Button" type="submit" style="width: 100%; padding: 15px; background-color: #5982FF; border: 5px solid #1B399E; border-radius: 5px; color: #eee">Modificar contrase\xf1a</button>
        </div>
        <div style="text-align: center">
          <p>Email: ${t.email}</p>
          <a href="#" class="logout">CERRAR SESI\xd3N</a>
        </div>
      </div>
    `;let o=document.createElement("custom-header");this.prepend(o),this.addEventListeners()}addEventListeners(){this.querySelector(".menu1Button").addEventListener("click",e=>{e.preventDefault(),window.history.pushState({},"","/personal-dates"),window.dispatchEvent(new PopStateEvent("popstate"))}),this.querySelector(".menu2Button").addEventListener("click",e=>{e.preventDefault(),window.history.pushState({},"","/changepass-dates"),window.dispatchEvent(new PopStateEvent("popstate"))}),this.querySelector(".logout").addEventListener("click",e=>{e.preventDefault(),console.log("Cerrando sesión..."),window.history.pushState({},"","/Log-in"),window.dispatchEvent(new PopStateEvent("popstate"))})}}customElements.define("menu-component",s);class l extends HTMLElement{map=null;marker=null;selectedLat=-34.6037;selectedLng=-58.3816;locationName="";connectedCallback(){this.render()}async fetchUserData(e){try{let t=await fetch(`https://pet-finder-dedt.onrender.com/profile/${e}`,{method:"GET",headers:{"Content-Type":"application/json"}});if(!t.ok)throw Error("Error al obtener los datos del usuario");let o=await t.json();return console.log("Datos del usuario:",o),o}catch(e){console.error("Error:",e)}}initMap=()=>{this.map=o.map("location-map").setView([this.selectedLat,this.selectedLng],13),o.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"© OpenStreetMap contributors",maxZoom:19}).addTo(this.map);let e=o.icon({iconUrl:"https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",shadowUrl:"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",iconSize:[25,41],iconAnchor:[12,41],popupAnchor:[1,-34],shadowSize:[41,41]});this.marker=o.marker([this.selectedLat,this.selectedLng],{icon:e,draggable:!0}).addTo(this.map),this.marker.on("dragend",e=>{let t=e.target.getLatLng();this.updateLocation(t.lat,t.lng)}),this.map.on("click",e=>{this.marker.setLatLng(e.latlng),this.updateLocation(e.latlng.lat,e.latlng.lng)}),this.updateLocation(this.selectedLat,this.selectedLng)};updateLocation=async(e,t)=>{this.selectedLat=e,this.selectedLng=t;try{let o=await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${e}&lon=${t}&zoom=18&addressdetails=1`),r=await o.json();this.locationName=r.display_name||`${e.toFixed(6)}, ${t.toFixed(6)}`;let a=this.querySelector(".location-display");a&&(a.textContent=this.locationName)}catch(o){console.error("Error al obtener nombre de ubicación:",o),this.locationName=`${e.toFixed(6)}, ${t.toFixed(6)}`}};async getUserLocation(){return new Promise((e,t)=>{navigator.geolocation?navigator.geolocation.getCurrentPosition(t=>{e({lat:t.coords.latitude,lng:t.coords.longitude})},e=>{t(e)}):t(Error("Geolocalización no soportada"))})}async render(){console.log("Renderizando el componente Datos");let e=localStorage.getItem("userId"),t=await this.fetchUserData(e);a(),document.body.style.margin="0",document.body.style.padding="0";let o=t?.name||"",r=t?.location;r&&(this.selectedLat=r.lat,this.selectedLng=r.lng,this.locationName=r.name),this.innerHTML=`
      <style>
        .leaflet-container {
          z-index: 1;
        }
      </style>
      <custom-header></custom-header>
      <form class="editProfileForm" style="width: 90%; max-width: 600px; display: flex; flex-direction: column; gap: 20px; align-items: center; margin: 80px auto 40px; padding: 30px; border: 1px solid #ccc; border-radius: 8px; background-color: #f9f9f9;">
        <h1 style="color: #5982FF;">Datos personales</h1>
        
        <div style="width: 100%;">
          <label for="nombre" style="font-weight: bold; display: block; margin-bottom: 5px;">Nombre</label>
          <input type="text" class="nombre" name="nombre" placeholder="John Doe" style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px;" />
        </div>

        <div style="width: 100%; border-top: 2px solid #ddd; margin: 10px 0;"></div>
        
        <h3 style="color: #666; text-align: center; margin: 10px 0;">\u{1F4CD} Mi Ubicaci\xf3n</h3>
        <p style="color: #888; font-size: 14px; text-align: center; margin: 0 0 15px;">
          ${r?"Actualizá tu ubicación si te mudaste":"Agregá tu ubicación para ver mascotas cercanas"}
        </p>

        <div style="width: 100%; display: flex; gap: 10px; margin-bottom: 15px;">
          <button type="button" class="get-location-btn" style="flex: 1; padding: 10px; background-color: #8CD48D; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">
            \u{1F4CD} Usar mi ubicaci\xf3n actual
          </button>
          <button type="button" class="show-map-btn" style="flex: 1; padding: 10px; background-color: #5982FF; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">
            \u{1F5FA}\u{FE0F} Seleccionar en mapa
          </button>
        </div>

        <div class="map-container" style="display: none; width: 100%;">
          <p style="color: #666; font-size: 14px; margin-bottom: 10px;">Hac\xe9 clic en el mapa o arrastr\xe1 el marcador para seleccionar tu ubicaci\xf3n</p>
          <div id="location-map" style="width: 100%; height: 300px; border-radius: 8px; overflow: hidden; border: 1px solid #ccc; margin-bottom: 10px;"></div>
        </div>

        <div class="location-info" style="width: 100%; padding: 10px; background-color: ${r?"#e8f5e9":"#fff3e0"}; border-radius: 4px; border: 1px solid ${r?"#4caf50":"#ff9800"};">
          <p style="margin: 0; color: ${r?"#2e7d32":"#e65100"}; font-weight: bold;">
            ${r?"✅ Ubicación guardada:":"⚠️ Sin ubicación"}
          </p>
          <p class="location-display" style="margin: 5px 0 0; color: #555; font-size: 14px;">
            ${r?r.name:"No se ha configurado una ubicación"}
          </p>
        </div>

        <button class="saveButton" type="submit" style="width: 100%; padding: 12px; background-color: #5982FF; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 16px; margin-top: 20px;">
          \u{1F4BE} Guardar Cambios
        </button>
        <button class="backButton" style="width: 100%; padding: 12px; background-color: #ff5959ff; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 16px; margin-top: 20px;"> 
        \u{2190} Volver al inicio
        </button>
        <div class="success-message" style="display: none; color: #4caf50; text-align: center; width: 100%; font-weight: bold;"></div>
        <div class="error-message" style="display: none; color: #FF4C4C; text-align: center; width: 100%;"></div>
      </form>
    `;let n=this.querySelector(".nombre");n.value=o;let i=this.querySelector(".get-location-btn");i.addEventListener("click",async()=>{i.textContent="🔄 Obteniendo...",i.disabled=!0;try{let e=await this.getUserLocation();this.selectedLat=e.lat,this.selectedLng=e.lng,this.map&&(this.map.setView([e.lat,e.lng],15),this.marker.setLatLng([e.lat,e.lng])),await this.updateLocation(e.lat,e.lng),i.textContent="✅ Ubicación actualizada",i.style.backgroundColor="#4caf50",setTimeout(()=>{i.textContent="📍 Usar mi ubicación actual",i.style.backgroundColor="#8CD48D",i.disabled=!1},2e3)}catch(e){alert("No se pudo obtener tu ubicación. Verificá los permisos del navegador."),i.textContent="📍 Usar mi ubicación actual",i.disabled=!1}});let s=this.querySelector(".show-map-btn"),l=this.querySelector(".map-container");s.addEventListener("click",()=>{"none"===l.style.display?(l.style.display="block",s.textContent="🔼 Ocultar mapa",this.map?this.map.invalidateSize():setTimeout(()=>this.initMap(),100)):(l.style.display="none",s.textContent="🗺️ Seleccionar en mapa")});let d=this.querySelector(".editProfileForm"),c=this.querySelector(".saveButton"),p=this.querySelector(".backButton"),u=this.querySelector(".success-message"),h=this.querySelector(".error-message");d.addEventListener("submit",async t=>{t.preventDefault();let o={name:n.value};this.locationName&&this.selectedLat&&this.selectedLng&&(o.location={name:this.locationName,lat:this.selectedLat,lng:this.selectedLng}),console.log("Datos a actualizar:",o),c.textContent="💾 Guardando...",c.disabled=!0,h.style.display="none",u.style.display="none";try{let t=await fetch(`https://pet-finder-dedt.onrender.com/profileDate/${e}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(o)});if(!t.ok)throw Error("Error al actualizar los datos");let r=await t.json();console.log(r.message),u.textContent="✅ Cambios guardados exitosamente",u.style.display="block",c.textContent="💾 Guardar Cambios",c.disabled=!1,setTimeout(()=>{u.style.display="none"},3e3)}catch(e){console.error("Error:",e),h.textContent=`\u{274C} ${e.message}`,h.style.display="block",c.textContent="💾 Guardar Cambios",c.disabled=!1}}),p.addEventListener("click",()=>{window.history.pushState({},"","/menu"),window.dispatchEvent(new PopStateEvent("popstate"))})}}customElements.define("personaldates-component",l);class d extends HTMLElement{connectedCallback(){this.render()}async fetchUserData(e){try{let t=await fetch(`https://pet-finder-dedt.onrender.com/profile/${e}`,{method:"GET",headers:{"Content-Type":"application/json"}});if(!t.ok)throw Error("Error al obtener los datos del usuario");if(!e)return console.error("No hay userId disponible"),null;let o=await t.json();return console.log("Datos del usuario:",o),o}catch(e){console.error("Error:",e)}}getUserLocation(){return new Promise((e,t)=>{navigator.geolocation?navigator.geolocation.getCurrentPosition(t=>{e({lat:t.coords.latitude,lng:t.coords.longitude})},e=>{t(e)}):t(Error("Geolocalización no soportada"))})}async render(){a(),document.body.style.margin="0",document.body.style.padding="0";let e=localStorage.getItem("userId");if(!e)return void console.error("No hay userId disponible");await this.fetchUserData(e),this.innerHTML=`
      <div class="container" style="width: 400px; height: 550px; display: flex; flex-direction: column; justify-content: space-between; align-items: center; margin: 0 auto;">
        <h1 style="color: #FF7D7D">Pet Finder App</h1>
        <div style="width: 100%;">
          <button class="menu1Button" type="button" style="width: 100%; padding: 15px; margin-bottom: 20px; background-color: #5982FF; border: 5px solid #1B399E; border-radius: 5px; color: #eee; cursor: pointer;">
            \u{1F4CD} Dar mi ubicaci\xf3n actual
          </button>
          <button class="menu2Button" type="button" style="width: 100%; padding: 15px; background-color: #8CD48D; border: 5px solid #002900; border-radius: 5px; color: #eee; cursor: pointer;">
            \u{2753} \xbfC\xf3mo funciona Pet Finder?
          </button>
        </div>
      </div>
    `;let t=document.createElement("custom-header");this.prepend(t);let o=this.querySelector(".menu1Button");o.addEventListener("click",async e=>{e.preventDefault(),o.textContent="🔄 Obteniendo ubicación...",o.disabled=!0;try{let e=await this.getUserLocation();localStorage.setItem("userLat",e.lat.toString()),localStorage.setItem("userLng",e.lng.toString()),console.log("Ubicación obtenida:",e),window.history.pushState({},"","/pets"),window.dispatchEvent(new PopStateEvent("popstate"))}catch(e){console.error("Error al obtener ubicación:",e),alert("No se pudo obtener tu ubicación. Por favor, permití el acceso a la ubicación en tu navegador."),o.textContent="📍 Dar mi ubicación actual",o.disabled=!1}}),this.querySelector(".menu2Button").addEventListener("click",e=>{e.preventDefault(),this.showTutorial()})}showTutorial(){this.innerHTML="",a();let e=document.createElement("custom-header"),t=document.createElement("div");t.innerHTML=`
      <div style="max-width: 600px; margin: 80px auto; padding: 20px; text-align: center;">
        <h2 style="color: #5982FF; margin-bottom: 20px;">\xbfC\xf3mo funciona Pet Finder?</h2>
        
        <div style="text-align: left; line-height: 1.6;">
          <h3 style="color: #FF7D7D;">\u{1F50D} Perdiste tu mascota</h3>
          <p>Public\xe1 un reporte con foto, descripci\xf3n y ubicaci\xf3n donde la viste por \xfaltima vez. Tu mascota aparecer\xe1 en el mapa para que otros usuarios puedan ayudarte.</p>
          
          <h3 style="color: #FF7D7D; margin-top: 30px;">\u{1F440} Encontraste una mascota</h3>
          <p>Busc\xe1 mascotas cercanas usando tu ubicaci\xf3n. Si reconoc\xe9s a alguna, pod\xe9s reportar el avistaje con tus datos de contacto. El due\xf1o recibir\xe1 un email autom\xe1tico con tu informaci\xf3n.</p>
          
          <h3 style="color: #FF7D7D; margin-top: 30px;">\u{1F4E7} Sistema de notificaciones</h3>
          <p>Cuando alguien reporta haber visto tu mascota, recib\xeds un email inmediatamente con los datos de contacto y la ubicaci\xf3n del avistaje.</p>
          
          <h3 style="color: #FF7D7D; margin-top: 30px;">\u{1F5FA}\u{FE0F} B\xfasqueda por proximidad</h3>
          <p>El sistema muestra solo las mascotas perdidas cerca de tu ubicaci\xf3n (radio de 5km por defecto), haciendo m\xe1s eficiente la b\xfasqueda.</p>
        </div>
        
        <button class="back-button" style="margin-top: 30px; padding: 12px 30px; background-color: #5982FF; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;">
          \u{2190} Volver al inicio
        </button>
      </div>
    `,this.appendChild(e),this.appendChild(t),this.querySelector(".back-button").addEventListener("click",()=>{this.render()})}}customElements.define("home-component",d);class c extends HTMLElement{connectedCallback(){this.render()}async fetchNearbyPets(){let e=parseFloat(localStorage.getItem("userLat")||"0"),t=parseFloat(localStorage.getItem("userLng")||"0");if(!e||!t)throw Error("No hay ubicación guardada");try{let o=await fetch("https://pet-finder-dedt.onrender.com/nearby-pets",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({lat:e,lng:t,radius:5})});if(!o.ok)throw Error("Error al obtener mascotas cercanas");return await o.json()}catch(o){return console.error(o),{pets:[],userLocation:{lat:e,lng:t},radius:5}}}calculateDistance(e,t,o,r){let a=(o-e)*Math.PI/180,n=(r-t)*Math.PI/180,i=Math.sin(a/2)*Math.sin(a/2)+Math.cos(e*Math.PI/180)*Math.cos(o*Math.PI/180)*Math.sin(n/2)*Math.sin(n/2);return 2*Math.atan2(Math.sqrt(i),Math.sqrt(1-i))*6371}addReportListeners(){this.querySelectorAll(".report-button").forEach(e=>{e.addEventListener("click",e=>{let t=e.target.dataset.petId,o=e.target.dataset.petName;t?this.showReportForm(t,o||"esta mascota"):console.error("No se encontró el ID de la mascota")})})}showReportForm(e,t){let o=document.createElement("div");o.className="modal",o.innerHTML=`
      <style>
        .modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
        }
        .modal-content {
          background: white;
          padding: 30px;
          border-radius: 10px;
          max-width: 500px;
          width: 90%;
          position: relative;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }
        .close-button {
          position: absolute;
          top: 15px;
          right: 20px;
          font-size: 28px;
          font-weight: bold;
          color: #999;
          cursor: pointer;
          border: none;
          background: none;
        }
        .close-button:hover {
          color: #333;
        }
        .modal-content h2 {
          margin-top: 0;
          color: #5982FF;
        }
        .modal-content input, .modal-content textarea {
          width: 100%;
          padding: 10px;
          margin-bottom: 15px;
          border: 1px solid #ccc;
          border-radius: 5px;
          font-size: 14px;
        }
        .modal-content textarea {
          min-height: 80px;
          resize: vertical;
        }
        .modal-content button[type="submit"] {
          width: 100%;
          padding: 12px;
          background-color: #5982FF;
          color: white;
          border: none;
          border-radius: 5px;
          font-size: 16px;
          cursor: pointer;
          font-weight: bold;
        }
        .modal-content button[type="submit"]:hover {
          background-color: #4070ee;
        }
      </style>
      <div class="modal-content">
        <button class="close-button">&times;</button>
        <h2>\u{1F43E} Reportar avistaje de ${t}</h2>
        <p style="color: #666; margin-bottom: 20px;">El due\xf1o recibir\xe1 un email con tu informaci\xf3n de contacto</p>
        <form id="report-form">
          <label for="reporterName" style="display: block; font-weight: bold; margin-bottom: 5px;">Tu nombre *</label>
          <input type="text" id="reporterName" placeholder="Ej: Juan P\xe9rez" required />
          
          <label for="reporterPhone" style="display: block; font-weight: bold; margin-bottom: 5px;">Tu tel\xe9fono *</label>
          <input type="tel" id="reporterPhone" placeholder="Ej: +54 9 11 1234-5678" required />
          
          <label for="location" style="display: block; font-weight: bold; margin-bottom: 5px;">\xbfD\xf3nde lo viste? *</label>
          <input type="text" id="location" placeholder="Ej: Av. Corrientes 1234, CABA" required />
          
          <label for="message" style="display: block; font-weight: bold; margin-bottom: 5px;">Mensaje adicional (opcional)</label>
          <textarea id="message" placeholder="Ej: Lo vi cerca del parque, parec\xeda asustado..."></textarea>
          
          <button type="submit">\u{1F4E7} Enviar reporte</button>
        </form>
      </div>
    `,document.body.appendChild(o),o.querySelector(".close-button").addEventListener("click",()=>{o.remove()}),o.addEventListener("click",e=>{e.target===o&&o.remove()}),o.querySelector("#report-form").addEventListener("submit",async t=>{t.preventDefault();let r=o.querySelector("#reporterName").value,a=o.querySelector("#reporterPhone").value,n=o.querySelector("#location").value,i=o.querySelector("#message").value,s=o.querySelector('button[type="submit"]');s.textContent="📤 Enviando...",s.disabled=!0;try{let t=await fetch(`https://pet-finder-dedt.onrender.com/report/${e}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({reporterName:r,reporterPhone:a,location:n,message:i})});if(!t.ok){let e=await t.json();throw Error(e.error||"Error al enviar reporte")}alert("✅ ¡Reporte enviado con éxito! El dueño recibirá un email con tu información."),o.remove()}catch(e){alert(`\u{274C} Error al enviar reporte: ${e.message}`),s.textContent="📧 Enviar reporte",s.disabled=!1,console.error(e)}})}async render(){if(a(),document.body.style.margin="0",document.body.style.padding="0",!localStorage.getItem("userId"))return void console.error("No hay userId disponible");this.innerHTML=`
      <div style="padding: 80px 20px 20px;">
        <h1 style="text-align: center; color: #5982FF;">\u{1F43E} Mascotas perdidas cerca tuyo</h1>
        <p style="text-align: center; color: #666;">Cargando mascotas cercanas...</p>
      </div>
    `;let e=document.createElement("custom-header");this.prepend(e);try{let{pets:e,userLocation:t,radius:o}=await this.fetchNearbyPets();if(0===e.length){this.innerHTML=`
          <div style="padding: 80px 20px; text-align: center;">
            <h1 style="color: #5982FF;">\u{1F43E} Mascotas perdidas cerca tuyo</h1>
            <p style="color: #666; margin: 20px 0;">No hay mascotas reportadas como perdidas en un radio de ${o}km de tu ubicaci\xf3n.</p>
            <button class="back-button" style="padding: 12px 30px; background-color: #5982FF; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;">
              \u{2190} Volver al inicio
            </button>
          </div>
        `,this.querySelector(".back-button").addEventListener("click",()=>{window.history.pushState({},"","/home"),window.dispatchEvent(new PopStateEvent("popstate"))});let e=document.createElement("custom-header");this.prepend(e);return}this.innerHTML=`
        <div style="padding: 80px 20px 20px;">
          <h1 style="text-align: center; color: #5982FF; margin-bottom: 10px;">\u{1F43E} Mascotas perdidas cerca tuyo</h1>
          <p style="text-align: center; color: #666; margin-bottom: 30px;">
            Encontramos ${e.length} mascota${e.length>1?"s":""} en un radio de ${o}km
          </p>
          
          <div id="pets-list" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; max-width: 1200px; margin: 0 auto;">
            ${e.map(e=>{let o=this.calculateDistance(t.lat,t.lng,e.location.lat,e.location.lng).toFixed(1);return`
                <div class="pet-card" style="border: 1px solid #ddd; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); transition: transform 0.2s;">
                  <img src="${e.img}" alt="${e.nombre}" style="width: 100%; height: 200px; object-fit: cover;" />
                  <div style="padding: 15px;">
                    <h2 style="margin: 0 0 10px; color: #333;">${e.nombre}</h2>
                    <p style="color: #666; margin: 5px 0;"><strong>\u{1F4CD}</strong> ${e.location}</p>
                    <p style="color: #5982FF; margin: 5px 0; font-weight: bold;">\u{1F4CF} A ${o} km de distancia</p>
                    <p style="color: #666; margin: 10px 0; font-size: 14px;">${e.bio}</p>
                    <button 
                      class="report-button" 
                      data-pet-id="${e.id}"
                      data-pet-name="${e.nombre}"
                      style="width: 100%; padding: 12px; background-color: #FF7D7D; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; font-size: 14px; margin-top: 10px;">
                      \u{1F4E7} \xa1Lo vi! Reportar
                    </button>
                  </div>
                </div>
              `}).join("")}
          </div>
          
          <div style="text-align: center; margin-top: 40px;">
            <button class="back-button" style="padding: 12px 30px; background-color: #5982FF; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;">
              \u{2190} Volver al inicio
            </button>
          </div>
        </div>
      `;let r=document.createElement("style");r.textContent=`
        .pet-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .report-button:hover {
          background-color: #ff6666;
        }
      `,this.appendChild(r);let a=document.createElement("custom-header");this.prepend(a),this.addReportListeners(),this.querySelector(".back-button").addEventListener("click",()=>{window.history.pushState({},"","/home"),window.dispatchEvent(new PopStateEvent("popstate"))})}catch(t){console.error("Error:",t),this.innerHTML=`
        <div style="padding: 80px 20px; text-align: center;">
          <h1 style="color: #FF7D7D;">\u{26A0}\u{FE0F} Error</h1>
          <p>No se pudieron cargar las mascotas cercanas.</p>
          <button class="retry-button" style="padding: 12px 30px; background-color: #5982FF; color: white; border: none; border-radius: 5px; cursor: pointer; margin-top: 20px;">
            Reintentar
          </button>
        </div>
      `,this.querySelector(".retry-button").addEventListener("click",()=>{this.render()});let e=document.createElement("custom-header");this.prepend(e)}}}customElements.define("pets-component",c);class p extends HTMLElement{connectedCallback(){this.render()}async fetchMyReports(e){try{let t=await fetch(`https://pet-finder-dedt.onrender.com/profile/${e}`);if(!t.ok)throw Error("Error al obtener mis reportes");return await t.json()}catch(e){return console.error(e),null}}async render(){a(),document.body.style.margin="0",document.body.style.padding="0";let e=localStorage.getItem("userId");if(!e)return void console.error("No hay userId disponible");this.innerHTML=`
      <div style="padding: 80px 20px 20px;">
        <h1 style="text-align: center; color: #5982FF;">\u{1F43E} Mis Mascotas Reportadas</h1>
        <p style="text-align: center; color: #666;">Cargando tus reportes...</p>
      </div>
    `;let t=document.createElement("custom-header");this.prepend(t);let o=await this.fetchMyReports(e),r=o?.Pets||[];this.innerHTML=`
      <div style="padding: 80px 20px 40px;">
        <h1 style="text-align: center; color: #5982FF; margin-bottom: 20px;">\u{1F43E} Mis Mascotas Reportadas</h1>
        
        <div style="text-align: center; margin-bottom: 30px;">
          <button id="new-report-button" style="padding: 12px 30px; background-color: #5982FF; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; font-size: 16px;">
            \u{2795} Reportar Nueva Mascota
          </button>
        </div>

        <div id="reports-list" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; max-width: 1200px; margin: 0 auto;">
          ${r.length>0?r.map(e=>`
            <div class="pet-card" style="border: 1px solid #ddd; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); transition: transform 0.2s;">
              <div style="position: relative;">
                <img src="${e.img}" alt="${e.nombre}" style="width: 100%; height: 200px; object-fit: cover;" />
                <span style="position: absolute; top: 10px; right: 10px; background-color: ${"lost"===e.status?"#FF4C4C":"#4caf50"}; color: white; padding: 5px 15px; border-radius: 20px; font-size: 12px; font-weight: bold;">
                  ${"lost"===e.status?"🔴 PERDIDO":"✅ ENCONTRADO"}
                </span>
              </div>
              <div style="padding: 15px;">
                <h2 style="margin: 0 0 10px; color: #333;">${e.nombre}</h2>
                <p style="color: #666; margin: 5px 0; font-size: 14px;"><strong>\u{1F4CD}</strong> ${e.location.name}</p>
                <p style="color: #666; margin: 10px 0; font-size: 14px;">${e.bio}</p>
                
                <div style="display: flex; gap: 10px; margin-top: 15px;">
                  <button 
                    class="edit-button" 
                    data-report-id="${e.id}"
                    style="flex: 1; padding: 10px; background-color: #5982FF; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; font-size: 14px;">
                    \u{270F}\u{FE0F} Editar
                  </button>
                  <button 
                    class="toggle-status-button" 
                    data-report-id="${e.id}"
                    data-current-status="${e.status}"
                    style="flex: 1; padding: 10px; background-color: ${"lost"===e.status?"#4caf50":"#FF4C4C"}; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; font-size: 14px;">
                    ${"lost"===e.status?"✅ Marcar encontrado":"🔴 Marcar perdido"}
                  </button>
                </div>
              </div>
            </div>
          `).join(""):`
            <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background-color: #f5f5f5; border-radius: 10px;">
              <h2 style="color: #999; margin-bottom: 20px;">No ten\xe9s mascotas reportadas</h2>
              <p style="color: #666; margin-bottom: 30px;">Report\xe1 una mascota perdida para que otros usuarios puedan ayudarte a encontrarla</p>
              <button class="new-report-inline" style="padding: 12px 30px; background-color: #5982FF; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; font-size: 16px;">
                \u{2795} Reportar Mi Primera Mascota
              </button>
            </div>
          `}
        </div>

        <div style="text-align: center; margin-top: 40px;">
          <button class="back-button" style="padding: 12px 30px; background-color: #666; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;">
            \u{2190} Volver al inicio
          </button>
        </div>
      </div>
    `;let n=document.createElement("style");n.textContent=`
      .pet-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      }
      .edit-button:hover {
        background-color: #4070ee;
      }
      .toggle-status-button:hover {
        opacity: 0.9;
      }
    `,this.appendChild(n);let i=document.createElement("custom-header");this.prepend(i);let s=this.querySelector("#new-report-button");s&&s.addEventListener("click",()=>{window.history.pushState({},"","/create-report"),window.dispatchEvent(new PopStateEvent("popstate"))});let l=this.querySelector(".new-report-inline");l&&l.addEventListener("click",()=>{window.history.pushState({},"","/create-report"),window.dispatchEvent(new PopStateEvent("popstate"))}),this.addEditListeners(),this.addToggleStatusListeners(),this.querySelector(".back-button").addEventListener("click",()=>{window.history.pushState({},"","/home"),window.dispatchEvent(new PopStateEvent("popstate"))})}addEditListeners(){this.querySelectorAll(".edit-button").forEach(e=>{e.addEventListener("click",e=>{let t=e.target.dataset.reportId;window.history.pushState({},"",`/edit-report/${t}`),window.dispatchEvent(new PopStateEvent("popstate"))})})}addToggleStatusListeners(){this.querySelectorAll(".toggle-status-button").forEach(e=>{e.addEventListener("click",async e=>{let t=e.target,o=t.dataset.reportId,r=t.dataset.currentStatus,a="lost"===r?"found":"lost";if(confirm(`\xbfEst\xe1s seguro de que quer\xe9s marcar esta mascota como ${"found"===a?"encontrada":"perdida"}?`)){t.textContent="🔄 Actualizando...",t.disabled=!0;try{if(!(await fetch(`https://pet-finder-dedt.onrender.com/pet-status/${o}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({status:a})})).ok)throw Error("Error al actualizar el estado");alert(`\u{2705} Estado actualizado a: ${"found"===a?"Encontrado":"Perdido"}`),this.render()}catch(e){console.error("Error:",e),alert("❌ Error al actualizar el estado"),t.disabled=!1,t.textContent="lost"===r?"✅ Marcar encontrado":"🔴 Marcar perdido"}}})})}}customElements.define("my-reports-component",p);class u extends HTMLElement{myDropzone=null;map=null;marker=null;uploadedImageUrl="";selectedLat=-34.6037;selectedLng=-58.3816;connectedCallback(){this.render()}async render(){if(!localStorage.getItem("userId")){console.error("No hay userId disponible"),alert("Debes iniciar sesión para reportar una mascota"),window.history.pushState({},"","/login"),window.dispatchEvent(new PopStateEvent("popstate"));return}this.innerHTML=`
      <style>
        .leaflet-container {
          z-index: 1;
        }
        .search-results {
          position: absolute;
          background: white;
          border: 1px solid #ccc;
          border-radius: 4px;
          max-height: 200px;
          overflow-y: auto;
          width: 100%;
          z-index: 1000;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .search-result-item {
          padding: 10px;
          cursor: pointer;
          border-bottom: 1px solid #eee;
        }
        .search-result-item:hover {
          background-color: #f0f4ff;
        }
      </style>
      <header style="background-color: #16244D; position: fixed; top: 0; left: 0; right: 0; height: 50px; padding: 0 20px; margin: 0; z-index: 1000;"></header>
      <form id="report-form" style="display: flex; flex-direction: column; align-items: center; margin: 80px auto 40px; width: 90%; max-width: 500px; padding: 30px; border: 1px solid #ccc; border-radius: 8px; background-color: #f9f9f9;">
        <h1 style="margin-bottom: 10px;">Reportar mascota</h1>
        <h4 style="color: #666; text-align: center; margin-bottom: 20px;">Ingres\xe1 la siguiente informaci\xf3n para realizar el reporte de la mascota</h4>
        
        <label style="align-self: flex-start; font-weight: bold; margin-bottom: 5px;">NOMBRE</label>
        <input type="text" class="name" name="name" required style="width: 100%; padding: 10px; margin-bottom: 15px; border: 1px solid #ccc; border-radius: 4px;" />
        
        <label style="align-self: flex-start; font-weight: bold; margin-bottom: 5px;">DESCRIPCI\xd3N</label>
        <textarea class="bio" name="bio" required placeholder="Ej: Labrador dorado, collar rojo, muy amigable..." style="width: 100%; padding: 10px; margin-bottom: 15px; border: 1px solid #ccc; border-radius: 4px; min-height: 80px;"></textarea>
        
        <label style="align-self: flex-start; font-weight: bold; margin-bottom: 5px;">FOTO</label>
        <div id="dropzone" style="border: 2px dashed #5982FF; padding: 30px; text-align: center; margin-bottom: 15px; width: 100%; cursor: pointer; border-radius: 4px; background-color: #f0f4ff;">
          \u{1F4F7} Arrastr\xe1 una imagen o hac\xe9 clic para seleccionar
        </div>
        <img class="pet-picture" style="display: none; width: 150px; height: 150px; object-fit: cover; margin-bottom: 15px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" />

        <h4 style="color: #666; text-align: center; margin: 20px 0 10px;">\u{1F4CD} Busc\xe1 la ubicaci\xf3n donde viste la mascota por \xfaltima vez</h4>
        
        <div style="position: relative; width: 100%; margin-bottom: 10px;">
          <label style="align-self: flex-start; font-weight: bold; margin-bottom: 5px; display: block;">BUSCAR DIRECCI\xd3N</label>
          <input 
            type="text" 
            class="search-address" 
            placeholder="Ej: Av. Corrientes 1234, Buenos Aires" 
            style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px;" 
          />
          <div class="search-results" style="display: none;"></div>
        </div>
        <small style="color: #888; align-self: flex-start; margin-bottom: 10px;">O hac\xe9 clic en el mapa para marcar la ubicaci\xf3n</small>
        
        <div id="map" style="width: 100%; height: 300px; margin-bottom: 15px; border-radius: 8px; overflow: hidden; border: 1px solid #ccc;"></div>
        
        <label style="align-self: flex-start; font-weight: bold; margin-bottom: 5px;">UBICACI\xd3N SELECCIONADA</label>
        <input type="text" class="ubi" name="ubi" readonly required style="width: 100%; padding: 10px; margin-bottom: 20px; border: 1px solid #ccc; border-radius: 4px; background-color: #f5f5f5;" />
        
        <div style="display: flex; justify-content: space-between; gap: 10px; width: 100%; margin-top: 10px;">
          <button type="submit" style="flex: 1; padding: 12px 20px; background-color: #5982FF; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 16px;">Reportar mascota</button>
          <button type="button" class="cancel-btn" style="flex: 1; padding: 12px 20px; background-color: #FF4C4C; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 16px;">Cancelar</button>
        </div>
      </form>
    `,this.createDropzone(),this.initMap(),this.addSearchListener(),this.addFormListener(),this.addCancelListener()}initMap=()=>{this.map=o.map("map").setView([this.selectedLat,this.selectedLng],13),o.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"© OpenStreetMap contributors",maxZoom:19}).addTo(this.map);let e=o.icon({iconUrl:"https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",shadowUrl:"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",iconSize:[25,41],iconAnchor:[12,41],popupAnchor:[1,-34],shadowSize:[41,41]});this.marker=o.marker([this.selectedLat,this.selectedLng],{icon:e,draggable:!0}).addTo(this.map),this.marker.on("dragend",e=>{let t=e.target.getLatLng();this.updateLocation(t.lat,t.lng)}),this.map.on("click",e=>{this.marker.setLatLng(e.latlng),this.updateLocation(e.latlng.lat,e.latlng.lng)}),this.updateLocation(this.selectedLat,this.selectedLng)};addSearchListener=()=>{let e,t=this.querySelector(".search-address"),o=this.querySelector(".search-results");t.addEventListener("input",r=>{clearTimeout(e);let a=r.target.value;if(a.length<3){o.style.display="none";return}e=setTimeout(async()=>{try{let e=await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(a+", Buenos Aires, Argentina")}&limit=5`),r=await e.json();r&&r.length>0?(o.innerHTML="",o.style.display="block",r.forEach(e=>{let r=document.createElement("div");r.className="search-result-item",r.textContent=e.display_name,r.addEventListener("click",()=>{let r=parseFloat(e.lat),a=parseFloat(e.lon);this.map.setView([r,a],16),this.marker.setLatLng([r,a]),this.updateLocation(r,a),t.value=e.display_name,o.style.display="none"}),o.appendChild(r)})):o.style.display="none"}catch(e){console.error("Error al buscar dirección:",e),o.style.display="none"}},500)}),document.addEventListener("click",e=>{t.contains(e.target)||o.contains(e.target)||(o.style.display="none")})};updateLocation=async(e,t)=>{this.selectedLat=e,this.selectedLng=t;try{let o=await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${e}&lon=${t}&zoom=18&addressdetails=1`),r=await o.json(),a=`${e.toFixed(6)}, ${t.toFixed(6)}`;r&&r.display_name&&(a=r.display_name),this.querySelector(".ubi").value=a}catch(o){console.error("Error al obtener nombre de ubicación:",o),this.querySelector(".ubi").value=`${e.toFixed(6)}, ${t.toFixed(6)}`}};createDropzone=()=>{let e=this.querySelector("#dropzone"),t=this.querySelector(".pet-picture");this.myDropzone&&this.myDropzone.destroy(),this.myDropzone=new r(e,{url:"https://api.cloudinary.com/v1_1/dwn17shai/image/upload",method:"post",paramName:"file",maxFiles:1,uploadMultiple:!1,autoProcessQueue:!0,acceptedFiles:"image/*",addRemoveLinks:!0,clickable:!0,dictDefaultMessage:"📷 Arrastrá una imagen o hacé clic",dictRemoveFile:"✖ Eliminar",init:function(){let e=this;console.log("dropzone inicializado"),this.on("addedfile",t=>{e.files.length>1&&e.removeFile(e.files[0])}),this.on("thumbnail",(e,o)=>{t.src=o,t.style.display="block"}),this.on("sending",(e,t,o)=>{o.append("upload_preset","ml_unsigned_upload")}),this.on("success",(e,t)=>{let o=t.secure_url;console.log("Imagen subida a Cloudinary:",o),this.elementInstance.uploadedImageUrl=o}),this.on("error",(e,t)=>{alert(`Error al subir imagen: ${t.error?.message||t}`)})}}),this.myDropzone.elementInstance=this};addFormListener=()=>{this.querySelector("#report-form").addEventListener("submit",async e=>{e.preventDefault();let t=this.querySelector(".name"),o=this.querySelector(".bio"),r=this.querySelector(".ubi"),a=localStorage.getItem("userId");if(!this.uploadedImageUrl)return void alert("Por favor, subí una imagen de la mascota");if(!t.value||!o.value||!r.value)return void alert("Por favor, completá todos los campos");let n={nombre:t.value,bio:o.value,location:{name:r.value,lat:this.selectedLat,lng:this.selectedLng},img:this.uploadedImageUrl,userId:parseInt(a)};try{let e=await fetch("https://pet-finder-dedt.onrender.com/post-pets",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(n)});if(!e.ok){let t=await e.json();throw Error(t.error||"Error al crear el reporte")}let t=await e.json();console.log("Mascota reportada:",t),alert("¡Mascota reportada exitosamente!"),window.history.pushState({},"","/mis-reportes"),window.dispatchEvent(new PopStateEvent("popstate"))}catch(e){console.error("Error:",e),alert(`Error al reportar mascota: ${e.message}`)}})};addCancelListener=()=>{this.querySelector(".cancel-btn").addEventListener("click",()=>{confirm("¿Estás seguro de que querés cancelar? Se perderán los datos ingresados.")&&(window.history.pushState({},"","/myPets"),window.dispatchEvent(new PopStateEvent("popstate")))})}}customElements.define("create-report-component",u),new e(document.querySelector("#root")).setRoutes([{path:"/",component:"register-component"},{path:"/Log-in",component:"login-component"},{path:"/menu",component:"menu-component"},{path:"/personal-dates",component:"personalDates-component"},{path:"/changepass-dates",component:"changepass-component"},{path:"/home",component:"home-component"},{path:"/pets",component:"pets-component"},{path:"/myPets",component:"my-reports-component"},{path:"/create-report",component:"create-report-component"}]);class h extends HTMLElement{connectedCallback(){this.render()}async fetchUserData(e){try{let t=await fetch(`http://localhost:3000/profile/${e}`,{method:"GET",headers:{"Content-Type":"application/json"}});if(!t.ok)throw Error("Error al obtener los datos del usuario");let o=await t.json();return console.log("Datos del usuario:",o),o}catch(e){console.error("Error:",e)}}async render(){console.log("Renderizando el componente Datos");let e=localStorage.getItem("userId");await this.fetchUserData(e),a(),document.body.style.margin="0",document.body.style.padding="0",this.innerHTML=`
    <custom-header></custom-header>

          <form class="editProfileForm" style="width: 90%; max-width: 600px; display: flex; flex-direction: column; gap: 20px; align-items: center; margin: 80px auto 40px; padding: 30px; border: 1px solid #ccc; border-radius: 8px; background-color: #f9f9f9;">
        <h1 style="color: #5982FF;">Contrase\xf1a</h1>
        
        <div style="width: 100%;">
          <label for="contrase\xf1a" style="font-weight: bold; display: block; margin-bottom: 5px;">Contrase\xf1a</label>
          <input type="password" class="contrase\xf1a" name="contrase\xf1a" placeholder="1234..." style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px;" />
        </div>
        <div style="width: 100%;">
          <label for="confirmContrase\xf1a" style="font-weight: bold; display: block; margin-bottom: 5px;">Confirmar contrase\xf1a</label>
          <input type="password" class="confirmContrase\xf1a" name="confirmContrase\xf1a" placeholder="1234..." style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px;" />
        </div>

        
        <button class="menu1Button" type="submit" style="width: 100%; padding: 12px; background-color: #5982FF; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 16px; margin-top: 20px;">
          \u{1F4BE} Guardar Cambios
        </button>
        
        <div class="success-message" style="display: none; color: #4caf50; text-align: center; width: 100%; font-weight: bold;"></div>
        <div class="error-message" style="display: none; color: #FF4C4C; text-align: center; width: 100%;"></div>
      </form>
    `;let t=this.querySelector(".editProfileForm");t&&t.addEventListener("submit",async o=>{o.preventDefault(),console.log("Submit del form disparado");let r=this.querySelector(".contraseña"),a=this.querySelector(".confirmContraseña");console.log("User ID:",e);try{let o=await fetch(`http://localhost:3000/profilePassword/${e}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({contraseña:r.value,confirmarContraseña:a.value})});if(!o.ok)throw Error("Error al cambiar la contraseña");let n=await o.json();console.log(n.message),t.innerHTML="";let i=document.createElement("h2");i.textContent="Contraseña cambiada con éxito 🎉";let s=document.createElement("button");s.textContent="← Volver al inicio",s.addEventListener("click",()=>{window.history.pushState({},"","/menu"),window.dispatchEvent(new PopStateEvent("popstate"))}),t.appendChild(i),t.appendChild(s)}catch(e){console.error("Error:",e)}})}}customElements.define("changepass-component",h);
//# sourceMappingURL=fe-src.4450233c.js.map
