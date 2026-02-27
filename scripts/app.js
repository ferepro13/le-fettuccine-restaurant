/* =======================================
   Configuración global
   ======================================= */
const WHATSAPP_NUMBER = '+5354122553';  // ej: '+5355555555'
const FORMSPREE_ID = '[ID_FORMSPREE]';          // ej: 'mdklyjwg'

  // Mensajes Toast
function mensajeError(mensaje){
  const errorToast = document.createElement('div');
  errorToast.textContent = '❌ '+ mensaje;
  errorToast.style.position = 'fixed';
  errorToast.style.bottom = '20px';
  errorToast.style.right = '20px';
  errorToast.style.backgroundColor = '#ff4757';
  errorToast.style.color = 'white';
  errorToast.style.padding = '10px 15px';
  errorToast.style.borderRadius = '5px';
  errorToast.style.zIndex = '2001';
  document.body.appendChild(errorToast);
  setTimeout(() => errorToast.remove(), 3000);
}
function mensajeExito(mensaje){
  const successToast = document.createElement('div');
  successToast.textContent = '✅ ' + mensaje;
  successToast.style.position = 'fixed';
  successToast.style.bottom = '20px';
  successToast.style.right = '20px';
  successToast.style.backgroundColor = '#4CAF50';
  successToast.style.color = 'white';
  successToast.style.padding = '10px 15px';
  successToast.style.borderRadius = '5px';
  successToast.style.zIndex = '2001';
  document.body.appendChild(successToast);
  setTimeout(() => successToast.remove(), 3000);
}
  // Función para enviar a WhatsApp
function enviarAWhatsApp(numero, mensaje) {
  const mensajeCodificado = encodeURIComponent(mensaje);
  const numeroLimpio = numero.replace(/\D/g, '');

  try {
      window.location.href = `https://wa.me/${numeroLimpio}?text=${mensajeCodificado}`;
      return true;
  } catch (error) {
      console.log('Error con window.location:', error);
  }
  
  try {
      const link = document.createElement('a');
      link.href = `https://wa.me/${numeroLimpio}?text=${mensajeCodificado}`;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return true;
  } catch (error) {
      console.log('Error con link:', error);
  }

  try {
      window.open(`https://wa.me/${numeroLimpio}?text=${mensajeCodificado}`, '_blank');
      return true;
  } catch (error) {
      console.log('Error con window.open:', error);
  }

  console.log('Todas las opciones fallaron');
  return false;
}

document.addEventListener('DOMContentLoaded', () => {
  
  // Toggle menú móvil
  const mobileMenu = document.querySelector('.mobile-menu');
  const nav = document.querySelector('nav');
  if (mobileMenu && nav) {
      mobileMenu.addEventListener('click', function() {
          nav.classList.toggle('active');
      });
  };

  //Contadores de productos
  document.querySelectorAll('.product-card').forEach(card => {
    const minusBtn = card.querySelector('.minus');
    const plusBtn = card.querySelector('.plus');
    const counterValue = card.querySelector('.counter-value');
    const addBtn = card.querySelector('.product-add-btn');
    const productName = card.querySelector('h3').innerText;

    let count = 0;

    // Botón menos
    minusBtn.addEventListener('click', () => {
      if (count > 0) {
        count--;
        counterValue.textContent = count;
      }
    });

    // Botón más
    plusBtn.addEventListener('click', () => {
      count++;
      counterValue.textContent = count;
    });

    // Botón agregar
    addBtn.addEventListener('click', () => {
      if (count > 0) {
        const pedidoField = document.querySelector('#pedido');
        pedidoField.value += (pedidoField.value ? '\n' : '') + `${count} x ${productName}`;
        
        // Toast animado
        showAddToast(addBtn, `${count} x ${productName}`);

        // Reiniciar contador después de agregar
        count = 0;
        counterValue.textContent = 0;
      }
    });
  });

  // Toast Animado al Agregar
  function showAddToast(button, text) {
    const toast = document.createElement('div');
    toast.className = 'add-toast';
    toast.innerText = text;

    const rect = button.getBoundingClientRect();
    toast.style.position = 'fixed';
    toast.style.left = rect.left + rect.width / 2 + 'px';
    toast.style.top = rect.top + 'px';

    document.body.appendChild(toast);

    // Animación con GSAP
    gsap.fromTo(toast,
      { y: 0, opacity: 1, scale: 1 },
      { y: 100, opacity: 0, scale: 0.8, duration: 1, ease: 'ease-in', onComplete: () => toast.remove() }
    );
  }

  //Mostrar campo comensales si Reserva 
  const solicitandoSelect = document.querySelector('#solicitando');
  const comensalesGroup = document.querySelector('#comensales-group');

  if (solicitandoSelect) {
    solicitandoSelect.addEventListener('change', () => {
      if (solicitandoSelect.value === 'Reserva') {
        comensalesGroup.style.display = 'block';
      } else {
        comensalesGroup.style.display = 'none';
        comensalesGroup.value = 1;
      }
    });
  }

  // Scroll suave
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach(anchor => {
      anchor.addEventListener('click', function(e) {
          e.preventDefault();
          const targetId = this.getAttribute('href');
          const targetElement = document.querySelector(targetId);
          if (targetElement) {
              targetElement.scrollIntoView({ behavior: 'smooth' });
              if (nav) nav.classList.remove('active');
          }
      });
  });


  // Crear modal si no existe
  if (!document.querySelector('#confirmModal')) {
    const modalHTML = `
      <div id="confirmModal" class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-question">
        <div class="modal-content">
          <div class="modal-header">
            <h3 id="modal-question">¡Confirmar envío!</h3>
            <span class="close-modal" aria-label="Cerrar ventana de confirmación">&times;</span>
          </div>
          <div class="modal-body">
            <p id="modal-question-text">¿Estás seguro de que quieres enviar esta información?</p>
            <div class="order-summary">
              <p><strong>Nombre:</strong> <span id="confirmNombre"></span></p>
              <p><strong>Teléfono:</strong> <span id="confirmTelefono"></span></p>
              <p><strong>Solicitando:</strong> <span id="confirmSolicitando"></span></p>
              <p id="confirmComensalesWrapper" style="display: none;"><strong>Comensales:</strong> <span id="confirmComensales"></span></p>
              <p><strong>Pedido:</strong> <span id="confirmPedido"></span></p>
              <p><strong>Fecha:</strong> <span id="confirmFecha"></span></p>
              <p><strong>Hora:</strong> <span id="confirmHora"></span></p>
            </div>
          </div>
          <div class="modal-footer">
            <button id="confirmButton" class="btn">Enviar a WhatsApp</button>
            <button id="cancelButton" class="btn btn-secondary">Cancelar</button>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Add CSS styles dynamically
    const style = document.createElement('style');
    style.textContent = `
      /* =============================
        Modal
        ============================= */ 
      .modal { display: none; position: fixed; z-index: 2000; left: 0; top: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); backdrop-filter: blur(5px); overflow: auto; animation: fadeIn 0.3s ease; }
      .modal-content { background: var(--color-blanco); margin: 5% auto; padding: 0; border-radius: 15px; width: 90%; max-width: 500px; min-height: 80vh; display: flex; flex-direction: column; animation: slideIn 0.3s ease; }
      .modal-header { background: linear-gradient(135deg, #FFD1DC, var(--color-secundario)); color: var(--color-blanco); padding: 20px; display: flex; justify-content: space-between; align-items: center; border-radius: 15px 15px 0 0; }
      .modal-body { padding: 25px; overflow-y: auto; flex-grow: 1; }
      .order-summary { background: var(--color-fondo-claro); padding: 10px; border-radius: 8px; max-height: 400px; overflow-y: auto; }
      .modal-footer { padding: 20px; text-align: right; border-top: 1px solid var(--color-gris-medio); display: flex; gap: 10px; justify-content: flex-end; }
      @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      @keyframes slideIn { from { transform: translateY(-20px); } to { transform: translateY(0); } }
    `;
    document.head.appendChild(style);
  }

  const form = document.querySelector('#pedido-form');
  const modal = document.querySelector('#confirmModal');
  const modalClose = document.querySelector('.close-modal');
  const confirmSend = document.querySelector('#confirmButton');
  const cancelButton = document.querySelector('#cancelButton');
  const confirmNombre = document.querySelector('#confirmNombre');
  const confirmTelefono = document.querySelector('#confirmTelefono');
  const confirmSolicitando = document.querySelector('#confirmSolicitando');
  const confirmComensalesWrapper = document.querySelector('#confirmComensalesWrapper');
  const confirmComensales = document.querySelector('#confirmComensales');
  const confirmPedido = document.querySelector('#confirmPedido');
  const confirmFecha = document.querySelector('#confirmFecha');
  const confirmHora = document.querySelector('#confirmHora');

  // Function to close the modal
  const closeModal = () => {
    modal.style.display = 'none';
  };

  // Open modal and populate data
  document.getElementById('whatsapp-primary').addEventListener('click', function(e) {
    e.preventDefault();

    const nombre = document.querySelector('#nombre').value;
    const telefono = document.querySelector('#telefono').value;
    const solicitando = document.querySelector('#solicitando').value;
    const comensales = document.querySelector('#comensales').value;
    const pedido = document.querySelector('#pedido').value;
    const fecha = document.querySelector('#fecha').value;
    const hora = document.querySelector('#hora').value;

    if (!nombre || !telefono || !pedido || !fecha || !hora) {
      mensajeError("Por favor completa todos los campos");
      return;
    }
    if (solicitando==="Reserva" && !comensales){
      mensajeError("Por favor completa todos los campos");
      return;
    }
    if (pedido.length < 10) {
        mensajeError("El pedido debe tener al menos 10 caracteres");
        return;
    }
    const regexTelefono = /^\+?\d{6,15}$/;
    if (!regexTelefono.test(telefono)) {
        mensajeError("Por favor introduce un número de teléfono válido");
        return;
    }

    confirmNombre.textContent = nombre;
    confirmTelefono.textContent = telefono;
    confirmSolicitando.textContent = solicitando;

    // Show or hide "Comensales" based on the "Solicitando" value
    if (solicitando === 'Reserva' && comensales) {
      confirmComensalesWrapper.style.display = 'block';
      confirmComensales.textContent = comensales;
    } else {
      confirmComensalesWrapper.style.display = 'none';
    }

    confirmPedido.textContent = pedido.replace(/\n/g, ', ');
    confirmFecha.textContent = fecha;
    confirmHora.textContent = hora;

    modal.style.display = 'block';
  });

  // Close modal on close button click
  modalClose.addEventListener('click', closeModal);

  // Close modal on cancel button click
  cancelButton.addEventListener('click', closeModal);

  // Close modal when clicking outside the modal content
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Close modal on Escape key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'block') {
      closeModal();
    }
  });

  // Confirmar envío
  confirmSend.addEventListener('click', () => {
    const pedido = document.querySelector('#pedido').value;
    const nombre = document.querySelector('#nombre').value;
    const telefono = document.querySelector('#telefono').value;
    const solicitud = document.querySelector("#solicitando").value;
    const comensales = document.querySelector("#comensales-group").value;
    const fecha = document.querySelector('#fecha').value;
    const fechaFormateada = new Date(fecha).toLocaleDateString('es-ES', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
    const hora = document.querySelector('#hora').value;
    var mensaje = "mensaje";
    if (solicitud === "Reserva") {
      mensaje = encodeURIComponent(`Hola, soy ${nombre}, deseo realizar una Reserva de ${comensales} personas para la fecha ${fechaFormateada} a la hora ${hora}. \nPuede contactarme al número ${telefono}. \nPedido/Reserva:\n${pedido}`);
    } else {
      mensaje = encodeURIComponent(`Hola, soy ${nombre}, deseo realizar un Pedido para llevar para la fecha ${fechaFormateada} a la hora ${hora}. \nPuede contactarme al número ${telefono}. \nPedido/Reserva:\n${pedido}`);
    };
    console.log(mensaje);
    enviarAWhatsApp(WHATSAPP_NUMBER, mensaje);
    //window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${mensaje}`, '_blank');
    document.getElementById('pedido-form').reset();
    mensajeExito("¡Enviado correctamente!");
    modal.classList.add('hidden');
  });

  /* =======================================
    Email alternativo con Formspree
    ======================================= */
  /*const emailBtn = document.querySelector('#email-alternative');
  if (emailBtn) {
    emailBtn.addEventListener('click', () => {
      form.action = `https://formspree.io/f/${FORMSPREE_ID}`;
      form.submit();
    });
      
    
  }*/
  /* =======================================
   Inicialización de librerías externas
   ======================================= */
  // AOS
  AOS.init({
    duration: 700,
    easing: 'ease-out-cubic',
    once: true
  });
  
  // GSAP Hero Animations
  //gsap.from('.hero-title', { y: -20, opacity: 0, duration: 0.8, delay: 0.2 });
  //gsap.from('.hero-sub', { y: 10, opacity: 0, duration: 0.8, delay: 0.45 });
  /*gsap.from('.hero-buttons a', { y: 10, opacity: 0, duration: 0.6, delay: 0.7, stagger: 0.12, 
    onComplete: () => {
      console.log('Animation complete');
      //document.querySelectorAll('.hero-buttons a').forEach((el) => {
      //el.style.opacity = '1';
      //el.style.animation = "fadeIn 0.8s ease"
      //},);
    },
  });*/
});
