import Navigo from 'navigo';

// Crear una instancia de Navigo
const router = new Navigo('/');

// Definir las rutas
router.on({
  '/': () => {
    console.log('Estás en la página de registro');
    renderComponent('<register-component></register-component>');
  },
  '/Log-in': () => {
    console.log('Estás en la página de inicio de sesión');
    renderComponent('<login-component></login-component>');
  },
  '/menu': () => {
    console.log('Estás en el menú');
    renderComponent('<menu-component></menu-component>');
  },
  '/personal-dates': () => {
    console.log('Estás en la página de datos personales');
    renderComponent('<personalDates-component></personalDates-component>');
  },
  '/changepass-dates': () => {
    console.log('Estás en la página de cambio de contraseña');
    renderComponent('<changepass-component></changepass-component>');
  },
  '/home': () => {
    console.log('Estás en la página de inicio');
    renderComponent('<home-component></home-component>');
  },
  '/pets': () => {
    console.log('Estás en la página de mascotas');
    renderComponent('<pets-component></pets-component>');
  },
  '/myPets': () => {
    console.log('Estás en la página de mis reportes');
    renderComponent('<my-reports-component></my-reports-component>');
  },
  '/create-report': () => {
    console.log('Estás en la página de crear reporte');
    renderComponent('<create-report-component></create-report-component>');
  },
});

// Función para renderizar componentes
function renderComponent(componentHTML: string) {
  const outlet = document.getElementById('outlet');
  if (outlet) {
    outlet.innerHTML = componentHTML; // Solo se ejecuta si outlet no es null
  } else {
    console.error('El elemento outlet no se encontró.');
  }
}

// Iniciar el enrutador
router.resolve();
