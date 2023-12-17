import nodemailer from 'nodemailer';

export const emailRegistro = async (datos)=> {
    const {email,nombre,token} = datos;
    const  transport = nodemailer.createTransport({
      host: `${process.env.EMAIL_HOST}`,
      port:`${process.env.EMAIL_PORT}`,
      auth: {
        user: `${process.env.EMAIL_USER}`,
        pass: `${process.env.EMAIL_PASS}`
      }
    });

    //Informacion del email


    const info = await transport.sendMail({
        from:'"UpTask - Administrador de Proyectos" <cuentas@uptask.com>',
        to: email,
        subject:"UpTask - Confirma Tu Cuenta",
        text:"Confirma tu cuenta en UpTask",
        html:`<p>Hola: ${nombre} Comprueba tu Cuenta en UpTask </p>

        <p>Tu cuenta ya esta casi lista, solo debes comprobarla en el siguiente enlace:</p>

        <a href="${process.env.FRONTEND_URL}/confirmar/${token} ">Comprobar cuenta</a>

        <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje </p>`,
    })
}


export const emailOlvidePassword = async (datos)=> {
  const {email,nombre,token} = datos;

  //TODO : mover hacia env
  const  transport = nodemailer.createTransport({
      host: `${process.env.EMAIL_HOST}`,
      port:`${process.env.EMAIL_PORT}`,
      auth: {
        user: `${process.env.EMAIL_USER}`,
        pass: `${process.env.EMAIL_PASS}`
      }
    });


  //Informacion del email


  const info = await transport.sendMail({
      from:'"UpTask - Administrador de Proyectos" <cuentas@uptask.com>',
      to: email,
      subject:"UpTask - Restablece tu password",
      text:"Restablece tu password",
      html:`<p>Hola: ${nombre} Has solicitado restablecer tu password </p>

      <p>Sigue el siguiente enlace para generar un nuevo password</p>

      <a href="${process.env.FRONTEND_URL}/olvide-password/${token} ">Restablecer password</a>

      <p>Si tu no solicitaste este email, puedes ignorar el mensaje </p>`,
  })
}



