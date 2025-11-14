import { initHeader } from "../../../../components/header";

class Changepass extends HTMLElement {
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

  async render() {
    console.log('Renderizando el componente Datos');
    const userId = localStorage.getItem('userId');
    const userData = await this.fetchUserData(userId);
    
    initHeader();
    document.body.style.margin = '0';
    document.body.style.padding = '0';

    this.innerHTML = `
    <custom-header></custom-header>

          <form class="editProfileForm" style="width: 90%; max-width: 600px; display: flex; flex-direction: column; gap: 20px; align-items: center; margin: 80px auto 40px; padding: 30px; border: 1px solid #ccc; border-radius: 8px; background-color: #f9f9f9;">
        <h1 style="color: #5982FF;">Contraseña</h1>
        
        <div style="width: 100%;">
          <label for="contraseña" style="font-weight: bold; display: block; margin-bottom: 5px;">Contraseña</label>
          <input type="password" class="contraseña" name="contraseña" placeholder="1234..." style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px;" />
        </div>
        <div style="width: 100%;">
          <label for="confirmContraseña" style="font-weight: bold; display: block; margin-bottom: 5px;">Confirmar contraseña</label>
          <input type="password" class="confirmContraseña" name="confirmContraseña" placeholder="1234..." style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px;" />
        </div>

        
        <button class="menu1Button" type="submit" style="width: 100%; padding: 12px; background-color: #5982FF; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 16px; margin-top: 20px;">
          💾 Guardar Cambios
        </button>
        
        <div class="success-message" style="display: none; color: #4caf50; text-align: center; width: 100%; font-weight: bold;"></div>
        <div class="error-message" style="display: none; color: #FF4C4C; text-align: center; width: 100%;"></div>
      </form>
    `;

    const form = this.querySelector('.editProfileForm');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log('Submit del form disparado');
        const contraseña = this.querySelector('.contraseña') as HTMLInputElement;
        const confirmarContraseña = this.querySelector('.confirmContraseña') as HTMLInputElement;
        console.log('User ID:', userId);
        try {
          const response = await fetch(`http://localhost:3000/profilePassword/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contraseña: contraseña.value, confirmarContraseña: confirmarContraseña.value }),
          });

          if (!response.ok) {
            throw new Error('Error al cambiar la contraseña');
          }

          const result = await response.json();
          console.log(result.message); // Mensaje de éxito

          // Mostrar mensaje de éxito
          form.innerHTML = ''; // Limpias el form
          const successMsg = document.createElement('h2');
          successMsg.textContent = 'Contraseña cambiada con éxito 🎉';
          const backButton = document.createElement('button')
          backButton.textContent = '← Volver al inicio'
          backButton.addEventListener('click', () => {
          window.history.pushState({}, '', '/menu');
          window.dispatchEvent(new PopStateEvent('popstate'));
          })
          form.appendChild(successMsg);
          form.appendChild(backButton);

        } catch (error) {
          console.error('Error:', error);
        }
      });
    }
  }
}

customElements.define('changepass-component', Changepass);