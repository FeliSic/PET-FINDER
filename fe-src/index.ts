// zona de auth
import  "./pages/Profile/pageAuth/AuthRegister"
import  "./pages/Profile/pageAuth/AuthInicioSesion"
// --------------------------------------
// zona de profile
import "./pages/Profile/pageProfile/pageMenu"
import "./pages/Profile/pageProfile/pageDatosPersonales"
import "./pages/Profile/pageProfile/PageContraseña"
// --------------------------------------
// zona de reportes en general
import "./pages/Profile/pageHome/Home"
import "./pages/Profile/pageHome/HomeMascotas"
// --------------------------------------
// zona de Mis reportes
import "./pages/Profile/pageMisreports/pageMisreportes"
import "./pages/Profile/pageMisreports/pageReportar"
// --------------------------------------

import {Router} from '@vaadin/router';


(function main(){
const router = new Router(document.querySelector('#root'));
router.setRoutes([
  {path: '/', component: 'register-component'},
  {path: '/Log-in', component: 'login-component'},
  {path: '/menu', component: 'menu-component'},
  {path: '/personal-dates', component: 'personalDates-component'},
  {path: '/changepass-dates', component: 'changepass-component'},
  {path: '/home', component: 'home-component'},
  {path: '/pets', component: 'pets-component'},
  {path: '/myPets', component: 'my-reports-component'},
  {path: '/create-report', component: 'create-report-component'},
]);
// state.init
})()
