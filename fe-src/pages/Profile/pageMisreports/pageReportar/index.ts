import Dropzone from "dropzone";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Report {
  id: string;
  nombre: string;
  bio: string;
  ubicación: string;
  img: string;
}

class CreateReport extends HTMLElement {
  myDropzone: Dropzone | null = null;
  map: L.Map | null = null;
  marker: L.Marker | null = null;
  uploadedImageUrl: string = "";
  selectedLat: number = -34.6037; // Buenos Aires default
  selectedLng: number = -58.3816; // Buenos Aires default
  
  connectedCallback() {
    this.render();
  }

  async render() {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('No hay userId disponible');
      alert('Debes iniciar sesión para reportar una mascota');
      window.history.pushState({}, '', '/login');
      window.dispatchEvent(new PopStateEvent('popstate'));
      return;
    }

    this.innerHTML = `
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
        <h4 style="color: #666; text-align: center; margin-bottom: 20px;">Ingresá la siguiente información para realizar el reporte de la mascota</h4>
        
        <label style="align-self: flex-start; font-weight: bold; margin-bottom: 5px;">NOMBRE</label>
        <input type="text" class="name" name="name" required style="width: 100%; padding: 10px; margin-bottom: 15px; border: 1px solid #ccc; border-radius: 4px;" />
        
        <label style="align-self: flex-start; font-weight: bold; margin-bottom: 5px;">DESCRIPCIÓN</label>
        <textarea class="bio" name="bio" required placeholder="Ej: Labrador dorado, collar rojo, muy amigable..." style="width: 100%; padding: 10px; margin-bottom: 15px; border: 1px solid #ccc; border-radius: 4px; min-height: 80px;"></textarea>
        
        <label style="align-self: flex-start; font-weight: bold; margin-bottom: 5px;">FOTO</label>
        <div id="dropzone" style="border: 2px dashed #5982FF; padding: 30px; text-align: center; margin-bottom: 15px; width: 100%; cursor: pointer; border-radius: 4px; background-color: #f0f4ff;">
          📷 Arrastrá una imagen o hacé clic para seleccionar
        </div>
        <img class="pet-picture" style="display: none; width: 150px; height: 150px; object-fit: cover; margin-bottom: 15px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" />

        <h4 style="color: #666; text-align: center; margin: 20px 0 10px;">📍 Buscá la ubicación donde viste la mascota por última vez</h4>
        
        <div style="position: relative; width: 100%; margin-bottom: 10px;">
          <label style="align-self: flex-start; font-weight: bold; margin-bottom: 5px; display: block;">BUSCAR DIRECCIÓN</label>
          <input 
            type="text" 
            class="search-address" 
            placeholder="Ej: Av. Corrientes 1234, Buenos Aires" 
            style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px;" 
          />
          <div class="search-results" style="display: none;"></div>
        </div>
        <small style="color: #888; align-self: flex-start; margin-bottom: 10px;">O hacé clic en el mapa para marcar la ubicación</small>
        
        <div id="map" style="width: 100%; height: 300px; margin-bottom: 15px; border-radius: 8px; overflow: hidden; border: 1px solid #ccc;"></div>
        
        <label style="align-self: flex-start; font-weight: bold; margin-bottom: 5px;">UBICACIÓN SELECCIONADA</label>
        <input type="text" class="ubi" name="ubi" readonly required style="width: 100%; padding: 10px; margin-bottom: 20px; border: 1px solid #ccc; border-radius: 4px; background-color: #f5f5f5;" />
        
        <div style="display: flex; justify-content: space-between; gap: 10px; width: 100%; margin-top: 10px;">
          <button type="submit" style="flex: 1; padding: 12px 20px; background-color: #5982FF; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 16px;">Reportar mascota</button>
          <button type="button" class="cancel-btn" style="flex: 1; padding: 12px 20px; background-color: #FF4C4C; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 16px;">Cancelar</button>
        </div>
      </form>
    `;

    this.createDropzone();
    this.initMap();
    this.addSearchListener();
    this.addFormListener();
    this.addCancelListener();
  }

  initMap = () => {
    // Inicializar mapa con Leaflet + OpenStreetMap (100% gratis)
    this.map = L.map('map').setView([this.selectedLat, this.selectedLng], 13);

    // Agregar tiles de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(this.map);

    // Crear icono personalizado para el marcador
    const customIcon = L.icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    // Crear marcador inicial
    this.marker = L.marker([this.selectedLat, this.selectedLng], {
      icon: customIcon,
      draggable: true
    }).addTo(this.map);

    // Actualizar ubicación cuando se arrastra el marcador
    this.marker.on('dragend', (e) => {
      const position = e.target.getLatLng();
      this.updateLocation(position.lat, position.lng);
    });

    // Permitir hacer clic en el mapa para mover el marcador
    this.map.on('click', (e) => {
      this.marker!.setLatLng(e.latlng);
      this.updateLocation(e.latlng.lat, e.latlng.lng);
    });

    // Actualizar ubicación inicial
    this.updateLocation(this.selectedLat, this.selectedLng);
  }

  addSearchListener = () => {
    const searchInput = this.querySelector('.search-address') as HTMLInputElement;
    const resultsContainer = this.querySelector('.search-results') as HTMLDivElement;
    let debounceTimer: any;

    searchInput.addEventListener('input', (e) => {
      clearTimeout(debounceTimer);
      const query = (e.target as HTMLInputElement).value;

      if (query.length < 3) {
        resultsContainer.style.display = 'none';
        return;
      }

      debounceTimer = setTimeout(async () => {
        try {
          // Usar Nominatim (OpenStreetMap) - GRATIS, sin API key
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ', Buenos Aires, Argentina')}&limit=5`
          );
          const data = await response.json();

          if (data && data.length > 0) {
            resultsContainer.innerHTML = '';
            resultsContainer.style.display = 'block';

            data.forEach((result: any) => {
              const item = document.createElement('div');
              item.className = 'search-result-item';
              item.textContent = result.display_name;
              item.addEventListener('click', () => {
                const lat = parseFloat(result.lat);
                const lng = parseFloat(result.lon);
                
                // Mover mapa y marcador
                this.map!.setView([lat, lng], 16);
                this.marker!.setLatLng([lat, lng]);
                
                this.updateLocation(lat, lng);
                searchInput.value = result.display_name;
                resultsContainer.style.display = 'none';
              });
              resultsContainer.appendChild(item);
            });
          } else {
            resultsContainer.style.display = 'none';
          }
        } catch (error) {
          console.error('Error al buscar dirección:', error);
          resultsContainer.style.display = 'none';
        }
      }, 500);
    });

    // Cerrar resultados al hacer clic fuera
    document.addEventListener('click', (e) => {
      if (!searchInput.contains(e.target as Node) && !resultsContainer.contains(e.target as Node)) {
        resultsContainer.style.display = 'none';
      }
    });
  }

  updateLocation = async (lat: number, lng: number) => {
    this.selectedLat = lat;
    this.selectedLng = lng;

    try {
      // Geocodificación inversa con Nominatim (GRATIS)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();

      let locationName = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
      
      if (data && data.display_name) {
        locationName = data.display_name;
      }

      const ubiInput = this.querySelector('.ubi') as HTMLInputElement;
      ubiInput.value = locationName;
    } catch (error) {
      console.error('Error al obtener nombre de ubicación:', error);
      const ubiInput = this.querySelector('.ubi') as HTMLInputElement;
      ubiInput.value = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    }
  }

  createDropzone = () => {
    const dropzoneElement = this.querySelector('#dropzone') as HTMLElement;
    const preview = this.querySelector('.pet-picture') as HTMLImageElement;

    if (this.myDropzone) {
      this.myDropzone.destroy();
    }

    this.myDropzone = new Dropzone(dropzoneElement, {
      url: "https://api.cloudinary.com/v1_1/dwn17shai/image/upload",
      method: "post",
      paramName: "file",
      maxFiles: 1,
      uploadMultiple: false,
      autoProcessQueue: true,
      acceptedFiles: 'image/*',
      addRemoveLinks: true,
      clickable: true,
      dictDefaultMessage: "📷 Arrastrá una imagen o hacé clic",
      dictRemoveFile: "✖ Eliminar",
      init: function(this: Dropzone) {
        const dropzoneInstance = this;
        console.log("dropzone inicializado");
        
        this.on("addedfile", (file) => {
          if (dropzoneInstance.files.length > 1) {
            dropzoneInstance.removeFile(dropzoneInstance.files[0]);
          }
        });

        this.on("thumbnail", (file, dataUrl) => {
          preview.src = dataUrl;
          preview.style.display = "block";
        });

        this.on("sending", (file, xhr, formData) => {
          formData.append('upload_preset', 'ml_unsigned_upload');
        });

        this.on("success", (file, response: any) => {
          const imageUrl = response.secure_url;
          console.log("Imagen subida a Cloudinary:", imageUrl);
          (this as any).elementInstance.uploadedImageUrl = imageUrl;
        });

        this.on("error", (file, errorMessage: any) => {
          alert(`Error al subir imagen: ${errorMessage.error?.message || errorMessage}`);
        });
      }
    });

    (this.myDropzone as any).elementInstance = this;
  }

  addFormListener = () => {
    const form = this.querySelector('#report-form') as HTMLFormElement;
    
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const nameInput = this.querySelector('.name') as HTMLInputElement;
      const bioInput = this.querySelector('.bio') as HTMLTextAreaElement;
      const ubiInput = this.querySelector('.ubi') as HTMLInputElement;
      const userId = localStorage.getItem('userId');

      if (!this.uploadedImageUrl) {
        alert('Por favor, subí una imagen de la mascota');
        return;
      }

      if (!nameInput.value || !bioInput.value || !ubiInput.value) {
        alert('Por favor, completá todos los campos');
        return;
      }

      const petData = {
        nombre: nameInput.value,
        bio: bioInput.value,
        location: {
          name: ubiInput.value,
          lat: this.selectedLat,
          lng: this.selectedLng
        },
        img: this.uploadedImageUrl,
        userId: parseInt(userId!)
      };

      try {
        const response = await fetch('https://pet-finder-dedt.onrender.com/post-pets', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(petData)
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Error al crear el reporte');
        }

        const result = await response.json();
        console.log('Mascota reportada:', result);
        alert('¡Mascota reportada exitosamente!');
        
        window.history.pushState({}, '', '/mis-reportes');
        window.dispatchEvent(new PopStateEvent('popstate'));
        
      } catch (error: any) {
        console.error('Error:', error);
        alert(`Error al reportar mascota: ${error.message}`);
      }
    });
  }

  addCancelListener = () => {
    const cancelBtn = this.querySelector('.cancel-btn') as HTMLButtonElement;
    cancelBtn.addEventListener('click', () => {
      if (confirm('¿Estás seguro de que querés cancelar? Se perderán los datos ingresados.')) {
        window.history.pushState({}, '', '/myPets');
        window.dispatchEvent(new PopStateEvent('popstate'));
      }
    });
  }
}

customElements.define('create-report-component', CreateReport);