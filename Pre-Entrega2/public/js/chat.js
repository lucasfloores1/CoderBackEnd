(function() {
    let email = '';
    const socket = io();
  
    document.getElementById('form-message')
      .addEventListener('submit', (event) => {
        event.preventDefault();
        const input = document.getElementById('input-message');
        const newMsg = {
          user: email,
          message: input.value,
        };
        input.value = '';
        input.focus();
        socket.emit('new-message', newMsg);
      });
  
    socket.on('update-messages', (messages) => {
      console.log('messages', messages);
      const logMessages = document.getElementById('log-messages');
      logMessages.innerText = '';
      messages.forEach((message) => {
        const p = document.createElement('p');
        p.innerText = `${message.user}: ${message.message}`;
        logMessages.appendChild(p);
      });
    });
    
    Swal.fire({
      title: 'Indetify yourself',
      input: 'text',
      inputLabel: 'Type your email',
      allowOutsideClick: false,
      inputValidator: (value) => {
        if (!value) {
          return 'We need you to type your email';
        }
      },
    })
    .then((result) => {
      email = result.value.trim();
    });
  
  })();
  