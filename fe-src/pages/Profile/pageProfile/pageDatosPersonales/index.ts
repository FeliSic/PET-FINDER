import { initHeader } from "../../../../components/header";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

class Datos extends HTMLElement {
  map: L.Map | null = null;
  marker: L.Marker | null = null;
  selectedLat: number = -34.6037;
  selectedLng: number = -58.3816;
  locationName: string = "";

  connectedCallback() {
    this.render();
  }

  async fetchUserData(userId: string | null) {
    try {
      const response = await fetch(`http://localhost:3000/profile/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener los datos del usuario');
      }

      const userData = await response.json();
      console.log('Datos del usuario:', userData);
      return userData;
    } catch (error) {
      console.error('Error:', error);
    }
  }

  initMap = () => {
    this.map = L.map('location-map').setView([this.selectedLat, this.selectedLng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(this.map);

    const customIcon = L.icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    this.marker = L.marker([this.selectedLat, this.selectedLng], {
      icon: customIcon,
      draggable: true
    }).addTo(this.map);

    this.marker.on('dragend', (e) => {
      const position = e.target.getLatLng();
      this.updateLocation(position.lat, position.lng);
    });

    this.map.on('click', (e) => {
      this.marker!.setLatLng(e.latlng);
      this.updateLocation(e.latlng.lat, e.latlng.lng);
    });

    this.updateLocation(this.selectedLat, this.selectedLng);
  }

  updateLocation = async (lat: number, lng: number) => {
    this.selectedLat = lat;
    this.selectedLng = lng;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();

      this.locationName = data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
      
      const locationDisplay = this.querySelector('.location-display') as HTMLParagraphElement;
      if (locationDisplay) {
        locationDisplay.textContent = this.locationName;
      }
    } catch (error) {
      console.error('Error al obtener nombre de ubicación:', error);
      this.locationName = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    }
  }

  async getUserLocation() {
    return new Promise<{ lat: number; lng: number }>((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocalización no soportada'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  async render() {
    console.log('Renderizando el componente Datos');
    const userId = localStorage.getItem('userId');
    const userData = await this.fetchUserData(userId);
    
    initHeader();
    document.body.style.margin = '0';
    document.body.style.padding = '0';

    // Obtener datos existentes del usuario
    const currentName = userData?.name || '';
    const currentLocation = userData?.location;

    if (currentLocation) {
      this.selectedLat = currentLocation.lat;
      this.selectedLng = currentLocation.lng;
      this.locationName = currentLocation.name;
    }

    this.innerHTML = `
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
        
        <h3 style="color: #666; text-align: center; margin: 10px 0;">📍 Mi Ubicación</h3>
        <p style="color: #888; font-size: 14px; text-align: center; margin: 0 0 15px;">
          ${currentLocation ? 'Actualizá tu ubicación si te mudaste' : 'Agregá tu ubicación para ver mascotas cercanas'}
        </p>

        <div style="width: 100%; display: flex; gap: 10px; margin-bottom: 15px;">
          <button type="button" class="get-location-btn" style="flex: 1; padding: 10px; background-color: #8CD48D; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">
            📍 Usar mi ubicación actual
          </button>
          <button type="button" class="show-map-btn" style="flex: 1; padding: 10px; background-color: #5982FF; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">
            🗺️ Seleccionar en mapa
          </button>
        </div>

        <div class="map-container" style="display: none; width: 100%;">
          <p style="color: #666; font-size: 14px; margin-bottom: 10px;">Hacé clic en el mapa o arrastrá el marcador para seleccionar tu ubicación</p>
          <div id="location-map" style="width: 100%; height: 300px; border-radius: 8px; overflow: hidden; border: 1px solid #ccc; margin-bottom: 10px;"></div>
        </div>

        <div class="location-info" style="width: 100%; padding: 10px; background-color: ${currentLocation ? '#e8f5e9' : '#fff3e0'}; border-radius: 4px; border: 1px solid ${currentLocation ? '#4caf50' : '#ff9800'};">
          <p style="margin: 0; color: ${currentLocation ? '#2e7d32' : '#e65100'}; font-weight: bold;">
            ${currentLocation ? '✅ Ubicación guardada:' : '⚠️ Sin ubicación'}
          </p>
          <p class="location-display" style="margin: 5px 0 0; color: #555; font-size: 14px;">
            ${currentLocation ? currentLocation.name : 'No se ha configurado una ubicación'}
          </p>
        </div>

        <button class="saveButton" type="submit" style="width: 100%; padding: 12px; background-color: #5982FF; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 16px; margin-top: 20px;">
          💾 Guardar Cambios
        </button>
        <button class="backButton" style="width: 100%; padding: 12px; background-color: #ff5959ff; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 16px; margin-top: 20px;"> 
        ← Volver al inicio
        </button>
        <div class="success-message" style="display: none; color: #4caf50; text-align: center; width: 100%; font-weight: bold;"></div>
        <div class="error-message" style="display: none; color: #FF4C4C; text-align: center; width: 100%;"></div>
      </form>
    `;

    // Rellenar el formulario con los datos del usuario
    const nombreInput = this.querySelector('.nombre') as HTMLInputElement;
    nombreInput.value = currentName;

    // Botón para obtener ubicación actual
    const getLocationBtn = this.querySelector('.get-location-btn') as HTMLButtonElement;
    getLocationBtn.addEventListener('click', async () => {
      getLocationBtn.textContent = '🔄 Obteniendo...';
      getLocationBtn.disabled = true;

      try {
        const location = await this.getUserLocation();
        this.selectedLat = location.lat;
        this.selectedLng = location.lng;

        // Si el mapa está abierto, mover el marcador
        if (this.map) {
          this.map.setView([location.lat, location.lng], 15);
          this.marker!.setLatLng([location.lat, location.lng]);
        }

        await this.updateLocation(location.lat, location.lng);
        
        getLocationBtn.textContent = '✅ Ubicación actualizada';
        getLocationBtn.style.backgroundColor = '#4caf50';
        
        setTimeout(() => {
          getLocationBtn.textContent = '📍 Usar mi ubicación actual';
          getLocationBtn.style.backgroundColor = '#8CD48D';
          getLocationBtn.disabled = false;
        }, 2000);
      } catch (error) {
        alert('No se pudo obtener tu ubicación. Verificá los permisos del navegador.');
        getLocationBtn.textContent = '📍 Usar mi ubicación actual';
        getLocationBtn.disabled = false;
      }
    });

    // Botón para mostrar/ocultar mapa
    const showMapBtn = this.querySelector('.show-map-btn') as HTMLButtonElement;
    const mapContainer = this.querySelector('.map-container') as HTMLDivElement;
    
    showMapBtn.addEventListener('click', () => {
      if (mapContainer.style.display === 'none') {
        mapContainer.style.display = 'block';
        showMapBtn.textContent = '🔼 Ocultar mapa';
        
        // Inicializar mapa si no existe
        if (!this.map) {
          setTimeout(() => this.initMap(), 100);
        } else {
          this.map.invalidateSize();
        }
      } else {
        mapContainer.style.display = 'none';
        showMapBtn.textContent = '🗺️ Seleccionar en mapa';
      }
    });

    // Submit del formulario
    const form = this.querySelector('.editProfileForm') as HTMLFormElement;
    const saveButton = this.querySelector('.saveButton') as HTMLButtonElement;
    const backButton = this.querySelector('.backButton') as HTMLButtonElement;
    const successMessage = this.querySelector('.success-message') as HTMLDivElement;
    const errorMessage = this.querySelector('.error-message') as HTMLDivElement;
    
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = nombreInput.value;

      const updateData: any = { name };

      // Solo enviar location si se configuró una
      if (this.locationName && this.selectedLat && this.selectedLng) {
        updateData.location = {
          name: this.locationName,
          lat: this.selectedLat,
          lng: this.selectedLng
        };
      }

      console.log('Datos a actualizar:', updateData);

      saveButton.textContent = '💾 Guardando...';
      saveButton.disabled = true;
      errorMessage.style.display = 'none';
      successMessage.style.display = 'none';

      try {
        const response = await fetch(`http://localhost:3000/profileDate/${userId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updateData),
        });

        if (!response.ok) {
          throw new Error('Error al actualizar los datos');
        }

        const result = await response.json();
        console.log(result.message);

        successMessage.textContent = '✅ Cambios guardados exitosamente';
        successMessage.style.display = 'block';

        saveButton.textContent = '💾 Guardar Cambios';
        saveButton.disabled = false;

        setTimeout(() => {
          successMessage.style.display = 'none';
        }, 3000);

      } catch (error: any) {
        console.error('Error:', error);
        errorMessage.textContent = `❌ ${error.message}`;
        errorMessage.style.display = 'block';
        saveButton.textContent = '💾 Guardar Cambios';
        saveButton.disabled = false;
      }
    });
    backButton.addEventListener('click', () => {
      window.history.pushState({}, '', '/menu');
      window.dispatchEvent(new PopStateEvent('popstate'));
    })
  }
}

customElements.define('personaldates-component', Datos);