import Dropzone from "dropzone";
import 'dropzone/dist/dropzone.css'; // Si lo usás

// ⚠️ AGREGÁ ESTO AL INICIO, ANTES DE LA CLASE
Dropzone.autoDiscover = false;

class Form extends HTMLElement {
  myDropzone: Dropzone | null = null;
  uploadedImageUrl: string | null = null;

  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
      
      <form class="profileForm" style="width: 400px; display: flex; flex-direction: column; gap: 30px; align-items: center; margin: 0 auto;">
        <label for="Email">Email:</label>
        <input type="text" class="email" name="Email" required placeholder="John Doe.." style="width: 100%;" />

        <label for="Password">Contraseña:</label>
        <input type="password" class="password" name="Password" required placeholder="1234.." style="width:100%;" />
        <input type="password" class="confirmPassword" name="confirmPassword" required placeholder="Repite tu contraseña..." style="width:100%;" />
        <button class="saveButton" type="submit" style="width: 100%;">Guardar</button>
        <button class="loginButton" type="button" style="width: 100%;">Log In</button>
        <textarea class="message" style="width: 100%; border: 1px solid #000;"></textarea>
    </form>


      <form id="petForm" style="width: 200px; display: flex; flex-direction: column; gap: 30px; align-items: center; margin: 0 auto;">
        <label for="name">Nombre:</label>
        <input type="text" id="name" name="nombre" required placeholder="Bobby..." style="width: 100%;" />

        <label for="bio">Bio:</label>
        <textarea id="bio" name="bio" rows="4" maxlength="200" style="resize:none; width: 100%;"></textarea>

        <label for="img">Foto de Mascotita:</label>
        <div id="dropzone" class="dropzone profile-picture-container" style="width: 100%;">
          <img " class="pet-picture" src="" alt="Vista previa" style="max-width: 0px;  max-height: 0px; display: none;" />
        </div>

        <button class="saveButton" type="submit" style="width: 100%;">Guardar</button>

        <input type="text" id="userId" name="Id de usuario" placeholder="coloca el userid para traer su info" style="width: 100%;" />

        <button class="getButton" type="button" style="width: 100%;">Obtener</button>
      </form>

    `;
    // Form User ---------------------------------------------------------------------------------------------------------------
    const formUser = this.querySelector('.profileForm') as HTMLFormElement;
    const email = this.querySelector('.email') as HTMLInputElement;
    const password = this.querySelector('.password') as HTMLInputElement;
    const confirmPassword = this.querySelector('.confirmPassword') as HTMLInputElement;
      formUser.addEventListener("submit", async (e) => {
      e.preventDefault();

      const emailValue = email.value;
      const passwordValue = password.value;
      const confirmPasswordValue = confirmPassword.value
      const data = {
        email: emailValue,
        password: passwordValue,
        confirmPassword: confirmPasswordValue
      };

      console.log('Datos a enviar:', data);

      try {
        const response = await fetch('http://localhost:3000/profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error('Error al guardar el usuario');
        }

        const result = await response.json();
        console.log('Usuario guardado:', result);
      } catch (error) {
        console.error('Error:', error);
      }
    });

    const loginButton = this.querySelector(".loginButton") as HTMLButtonElement
    loginButton.addEventListener('click', async () =>{
    const emailValue = (this.querySelector('.email') as HTMLInputElement).value;
    const passwordValue = (this.querySelector('.password') as HTMLInputElement).value;
      try {
        const response = await fetch ('http://localhost:3000/profile/login', {
          method: 'POST',
          headers: {
            'Content-Type' : 'application/json',
          },
          body: JSON.stringify({ email: emailValue, password: passwordValue })
        })
        if (!response.ok) {
          throw new Error('Error al Logear al Usuario',);
          
        }
        const data = await response.json();
        console.log('Usuario logeado correctamente:', data);
        (this.querySelector('.email') as HTMLInputElement).value = '';
        (this.querySelector('.password') as HTMLInputElement).value = '';
        console.log('Usuario logeado correctamente:', data);

          // Mostrar el token o mensaje
        const messageTextArea = this.querySelector('.message') as HTMLTextAreaElement;
        messageTextArea.innerHTML = `¡Login exitoso! Tu token es:${data.token}`

      } catch(error) {
        console.error('Error:', error);
      }
    })



    // -------------------------------------------------------------------------------------------------------------------------
    // Form pet ----------------------------------------------------------------------------------------------------------------
    const formPet = this.querySelector('#petForm') as HTMLFormElement;
    const name = this.querySelector('#name') as HTMLInputElement;
    const bio = this.querySelector('#bio') as HTMLTextAreaElement;
    const userIdInput = this.querySelector('#userId') as HTMLInputElement;
    const preview = this.querySelector('.profile-picture') as HTMLImageElement;

      if (this.myDropzone) {
      this.myDropzone.destroy();
      this.myDropzone = null;
    }

    // Inicializar Dropzone solo si no está ya inicializado
    if (!this.myDropzone) {
      this.createDropzone();
    }

    formPet.addEventListener("submit", async (e) => {
      e.preventDefault();

      const nombre = name.value;
      const biografia = bio.value;

      const data = {
        nombre,
        bio: biografia,
        img: this.uploadedImageUrl || preview.src || ""
      };

      console.log('Datos a enviar:', data);

      try {
        const response = await fetch('http://localhost:3000/pet', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error('Error al guardar la mascotita');
        }

        const result = await response.json();
        console.log('Mascotita guardada:', result);
      } catch (error) {
        console.error('Error:', error);
      }
    });

    const getButton = this.querySelector('.getButton') as HTMLButtonElement;
    getButton.addEventListener('click', async () => {
      const userId = userIdInput.value;
      try {
        const response = await fetch(`http://localhost:3000/profile/${userId}`, {
          method: 'GET',
        });

        if (!response.ok) {
          throw new Error('Error al obtener los datos');
        }
        const data = await response.json();
        (this.querySelector('#name') as HTMLInputElement).value = data.nombre;
        (this.querySelector('#bio') as HTMLTextAreaElement).value = data.bio;
        preview.src = data.img;
        preview.style.display = 'block';
        if (data.img) {
          preview.style.maxWidth = '150px';
          preview.style.maxHeight = '150px';
          preview.style.display = 'block';
          preview.src = data.img;
          this.uploadedImageUrl = data.img;
        }
      } catch (error) {
        console.error('Error:', error);
      }
    });
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
      dictDefaultMessage: "Arrastrá una imagen o hacé click",
      dictRemoveFile: "✖ Eliminar",
      init: function(this: Dropzone) {
        const dropzoneInstance = this;
        console.log("dropzone inicializado")
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
}
// -------------------------------------------------------------------------------------------------------------------------
customElements.define('profile-form', Form);


const root = document.getElementById('root');
if (root) {
  const profileForm = document.createElement('profile-form');
  root.appendChild(profileForm);
} else {
  console.error('El elemento con id "root" no se encontró.');
}
/*

import Dropzone from "dropzone";
import 'dropzone/dist/dropzone.css';

// ⚠️ IMPORTANTE: Desactivar auto-discover
Dropzone.autoDiscover = false;

class Form extends HTMLElement {
  myDropzone: Dropzone | null = null;
  uploadedImageUrl: string = '';

  connectedCallback() {
    this.render();
  }

  disconnectedCallback() {
    if (this.myDropzone) {
      this.myDropzone.destroy();
      this.myDropzone = null;
    }
  }

  render() {
    this.innerHTML = `
      <form id="profileForm" style="width: 200px; display: flex; flex-direction: column; gap: 30px; align-items: center; margin: 0 auto;">
        <label for="name">Nombre:</label>
        <input type="text" id="name" name="nombre" required placeholder="John Doe.." style="width: 100%;" />

        <label for="bio">Bio:</label>
        <textarea id="bio" name="bio" rows="4" maxlength="200" style="resize:none; width: 100%;"></textarea>

        <label>Foto de perfil:</label>
        <div id="my-dropzone" style="width: 100%; min-height: 150px; border: 2px dashed #0066cc; border-radius: 8px; padding: 20px; text-align: center; background: #f0f8ff; cursor: pointer;">
          <p style="margin: 0; color: #666;">Arrastrá una imagen o hacé click para seleccionar</p>
        </div>

        <img class="profile-picture" src="" alt="Vista previa" style="max-width: 150px; max-height: 150px; display:none; border-radius: 8px;" />

        <button class="saveButton" type="submit" style="width: 100%;">Guardar</button>

        <input type="text" id="userId" name="Id de usuario" placeholder="coloca el userid para traer su info" style="width: 100%;" />

        <button class="getButton" type="button" style="width: 100%;">Obtener</button>
      </form>
    `;

    const form = this.querySelector('#profileForm') as HTMLFormElement;
    const name = this.querySelector('#name') as HTMLInputElement;
    const bio = this.querySelector('#bio') as HTMLTextAreaElement;
    const userIdInput = this.querySelector('#userId') as HTMLInputElement;
    const preview = this.querySelector('.profile-picture') as HTMLImageElement;
    const dropzoneElement = this.querySelector('#my-dropzone') as HTMLElement;

    // Limpiar instancia anterior si existe
    if (dropzoneElement && (dropzoneElement as any).dropzone) {
      (dropzoneElement as any).dropzone.destroy();
    }

    if (this.myDropzone) {
      this.myDropzone.destroy();
      this.myDropzone = null;
    }

    // Esperar un tick para asegurar que el DOM está listo
    setTimeout(() => {
      const componentContext = this;

      // Crear Dropzone
      this.myDropzone = new Dropzone(dropzoneElement, {
        url: "https://api.cloudinary.com/v1_1/dwn17shai/image/upload",
        method: "post",
        paramName: "file",
        maxFiles: 1,
        uploadMultiple: false,
        autoProcessQueue: false,
        acceptedFiles: 'image/*',
        addRemoveLinks: true,
        clickable: true,
        dictDefaultMessage: "Arrastrá una imagen o hacé click",
        dictRemoveFile: "✖ Eliminar",
        init: function(this: Dropzone) {
          console.log('✅ Dropzone inicializado');
          const dropzoneInstance = this;

          this.on("addedfile", (file) => {
            console.log("📎 Archivo agregado:", file.name);
            if (dropzoneInstance.files.length > 1) {
              dropzoneInstance.removeFile(dropzoneInstance.files[0]);
            }
          });

          this.on("thumbnail", (file, dataUrl) => {
            console.log("🖼️ Thumbnail generado");
            preview.src = dataUrl;
            preview.style.display = "block";
          });

          this.on("sending", (file, xhr, formData) => {
            console.log("📤 Enviando a Cloudinary...");
            formData.append('upload_preset', 'ml_unsigned_upload');
            console.log('📋 FormData upload_preset:', formData.get('upload_preset'));
          });

          this.on("success", (file, response: any) => {
            const imageUrl = response.secure_url;
            console.log("✅ Imagen subida a Cloudinary:", imageUrl);
            componentContext.uploadedImageUrl = imageUrl;
          });

          this.on("error", (file, errorMessage: any) => {
            console.error("❌ Error al subir:", errorMessage);
            alert(`Error al subir imagen: ${errorMessage.error?.message || errorMessage}`);
          });
        }
      });

      // Submit del formulario
      form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const nombre = name.value.trim();
        const biografia = bio.value.trim();

        if (!nombre) {
          alert('El nombre es requerido');
          return;
        }

        if (!this.myDropzone || this.myDropzone.files.length === 0) {
          alert('Por favor seleccioná una imagen');
          return;
        }

        try {
          console.log('📤 Subiendo imagen a Cloudinary...');
          
          this.uploadedImageUrl = '';

          this.myDropzone.processQueue();

          await new Promise((resolve, reject) => {
            const successHandler = () => {
              this.myDropzone!.off("success", successHandler);
              this.myDropzone!.off("error", errorHandler);
              resolve(true);
            };

            const errorHandler = (file: any, message: any) => {
              this.myDropzone!.off("success", successHandler);
              this.myDropzone!.off("error", errorHandler);
              reject(new Error(message.error?.message || message));
            };

            this.myDropzone!.on("success", successHandler);
            this.myDropzone!.on("error", errorHandler);
          });

          if (!this.uploadedImageUrl) {
            throw new Error('No se pudo obtener la URL de la imagen');
          }

          console.log('💾 Guardando perfil...');

          const data = { 
            nombre, 
            bio: biografia, 
            img: this.uploadedImageUrl 
          };

          console.log('Datos a enviar:', data);

          const response = await fetch('http://localhost:3000/profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error al guardar el perfil');
          }

          const result = await response.json();
          console.log('✅ Perfil guardado:', result);
          alert(`✅ Perfil guardado exitosamente!\nID: ${result.id}`);

          form.reset();
          this.myDropzone.removeAllFiles();
          this.uploadedImageUrl = '';
          preview.style.display = 'none';

        } catch (error: any) {
          console.error('❌ Error:', error);
          alert(`Error: ${error.message}`);
        }
      });

      // Botón obtener perfil
      const getButton = this.querySelector('.getButton') as HTMLButtonElement;
      getButton.addEventListener('click', async () => {
        const userId = userIdInput.value.trim();

        if (!userId) {
          alert('Ingresá un ID de usuario');
          return;
        }

        try {
          console.log(`🔍 Buscando usuario ${userId}...`);

          const response = await fetch(`http://localhost:3000/profile/${userId}`, {
            method: 'GET',
          });

          if (!response.ok) {
            throw new Error('Usuario no encontrado');
          }

          const data = await response.json();
          name.value = data.nombre;
          bio.value = data.bio;
          preview.src = data.img;
          preview.style.display = 'block';

          console.log('✅ Perfil obtenido:', data);
          alert('✅ Perfil cargado exitosamente!');

        } catch (error: any) {
          console.error('❌ Error:', error);
          alert(`Error: ${error.message}`);
        }
      });

    }, 0);
  }
}

customElements.define('profile-form', Form);

const root = document.getElementById('root');
if (root) {
  const profileForm = document.createElement('profile-form');
  root.appendChild(profileForm);
} else {
  console.error('El elemento con id "root" no se encontró.');
}


*/