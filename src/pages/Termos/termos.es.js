// Tradução para o espanhol dos textos legais (cortesia: vale a versão em português, ver AVISO_TRADUCAO).
import { TERMOS_CLINICA, TERMOS_AFILIADO, PRIVACIDADE, EXCLUSAO_DE_DADOS } from './termos.dados.js';

export const AVISO_TRADUCAO = 'Esta es una traducción de cortesía. En caso de diferencia, prevalece la versión en portugués.';

const TERMOS_CLINICA_ES = {
  titulo: 'Términos de uso',
  subtitulo: 'Para las clínicas que usan Sonelia',
  secoes: [
    ['1. Qué es Sonelia', [
      'Sonelia es un sistema en línea de gestión de clínicas: agenda, pacientes, historia clínica electrónica, seguros médicos, pagos a profesionales y otras funciones. Al crear la cuenta, quien se registra declara que tiene autorización para contratar en nombre de la clínica y acepta estos términos.',
    ]],
    ['2. Cuenta y acceso', [
      'Quien crea la cuenta es el administrador de la clínica y responde por ella. Agrega a los demás usuarios (recepción y profesionales) y define lo que cada uno puede hacer.',
      'Cada usuario debe tener su propio acceso. La contraseña es personal y no debe compartirse. Avisa al soporte si sospechas un uso indebido de tu cuenta.',
    ]],
    ['3. Prueba gratis, planes y pago', [
      'La cuenta empieza con una prueba gratis, sin tarjeta. Después, el acceso continúa solo con un plan pago: en Brasil, por Pix o tarjeta de crédito, mediante Mercado Pago; en los demás países, con tarjeta de crédito internacional, mediante Stripe.',
      'Con tarjeta, la suscripción se renueva cada mes hasta que se cancele. Con Pix, cada pago da derecho a un período de acceso y no hay renovación automática.',
      'El plan Individual es para quien atiende solo: solo el titular de la cuenta usa el sistema, como único profesional, sin recepción ni otros usuarios. Para tener un equipo, se necesita un plan de equipo, como el Pro.',
      'Los precios de los planes pueden cambiar. Un cambio de precio no afecta el período ya pagado y se avisará con anticipación.',
    ]],
    ['4. Desistimiento y cancelación', [
      'Puedes desistir de la compra dentro de los 7 días posteriores al pago y recibir el reembolso, como prevé el artículo 49 del Código de Defensa del Consumidor de Brasil. Solo tienes que pedirlo al soporte.',
      'Pasado ese plazo, puedes cancelar cuando quieras: el acceso continúa hasta el fin del período ya pagado y no hay reembolso proporcional.',
      'La falta de pago bloquea el acceso después del período de tolerancia. Los datos siguen guardados y el acceso vuelve cuando se regulariza la suscripción.',
    ]],
    ['5. Datos de los pacientes y LGPD', [
      'La clínica es la responsable (controladora) de los datos de sus pacientes y responde por la base legal para tratarlos, incluidos los datos de salud. Sonelia actúa como encargada (operadora): guarda y procesa esos datos solo para prestar el servicio, según las instrucciones de la clínica.',
      'Sonelia no vende ni comparte los datos de la clínica ni de los pacientes, y solo accede a ellos cuando es necesario para dar soporte, corregir problemas o cumplir la ley.',
      'Cada clínica ve solo sus propios datos. La conexión es cifrada y el sistema registra quién abrió cada historia clínica.',
    ]],
    ['6. Historia clínica', [
      'El contenido de la historia clínica es responsabilidad del profesional que la escribe. Las historias clínicas no pueden eliminarse antes de 20 años, como exige la Ley brasileña 13.787/2018; las correcciones se hacen mediante adendas, sin borrar el registro original.',
    ]],
    ['7. Uso permitido', [
      'Está prohibido usar el sistema con fines ilegales, intentar acceder a datos de otras clínicas, sobrecargar o atacar el servicio, o revender el acceso sin autorización.',
      'Sonelia puede suspender cuentas que incumplan estos términos.',
    ]],
    ['8. Disponibilidad y responsabilidad', [
      'Trabajamos para mantener el sistema disponible en todo momento, pero puede haber interrupciones por mantenimiento o por fallas de terceros (internet, servidores, Mercado Pago, Stripe).',
      'Las decisiones clínicas, administrativas y financieras tomadas con base en la información del sistema son responsabilidad de la clínica.',
    ]],
    ['9. Cierre de la cuenta', [
      'La clínica puede pedir el cierre de su cuenta en cualquier momento. Las historias clínicas siguen guardadas durante el plazo que exige la ley.',
    ]],
    ['10. Cambios en los términos', [
      'Estos términos pueden actualizarse. Los cambios importantes se avisarán en el sistema o por correo. Seguir usando Sonelia después del aviso significa aceptar la nueva versión.',
    ]],
  ],
};

const TERMOS_AFILIADO_ES = {
  titulo: 'Términos del afiliado',
  subtitulo: 'Para quien promociona Sonelia y gana comisiones',
  secoes: [
    ['1. El programa de afiliados', [
      'El afiliado promociona Sonelia a clínicas y gana una comisión por cada clínica que crea la cuenta con su enlace o código y paga la primera mensualidad. Al crear la cuenta de afiliado, aceptas estos términos.',
    ]],
    ['2. Cómo se cuenta una recomendación', [
      'La clínica debe crear la cuenta con tu enlace o escribir tu código al registrarse. No cuentan las clínicas ya registradas ni las que se registren sin tu enlace o código.',
      'Cada clínica genera una sola comisión, aunque siga pagando en los meses siguientes.',
    ]],
    ['3. Monto y plazo de la comisión', [
      'La comisión es el 50% de la primera mensualidad del plan que contrate la clínica recomendada (por ejemplo: R$ 50,00 en el plan Individual de R$ 100,00, y R$ 100,00 en el plan Pro de R$ 200,00). Los descuentos por recomendación que tenga la clínica no reducen la comisión.',
      'Por el Código de Defensa del Consumidor de Brasil, el cliente tiene 7 días para desistir y pedir el reembolso. Por eso la comisión queda en espera y solo puede pagarse a partir del 8.º día después del pago de la clínica.',
      'Si el pago de la clínica se reembolsa o se impugna antes de que se pague la comisión, esta se cancela. Vuelve a valer si la clínica paga de nuevo.',
    ]],
    ['4. Pago de las comisiones', [
      'Las comisiones liberadas se pagan por Pix, en la clave registrada por el afiliado, una vez al mes. Puedes seguir todo en el panel del afiliado: lo que está en espera, lo que está por cobrar y lo que ya cobraste.',
      'Mantén actualizados tu clave Pix y tu CPF o CNPJ. Los pagos hechos en la clave informada por el afiliado se consideran entregados.',
    ]],
    ['5. Impuestos y relación', [
      'El afiliado es independiente: no hay relación laboral, societaria ni de representación comercial con Sonelia. Cada parte responde por sus propios impuestos.',
      'Sonelia puede pedir factura (por ejemplo, como MEI) o los datos necesarios para registrar el pago, según exija la ley.',
    ]],
    ['6. Promoción permitida', [
      'Promociona con honestidad: no prometas funciones, precios ni resultados que el sistema no ofrece.',
      'Está prohibido: enviar spam o mensajes masivos a quien no los pidió; hacer anuncios pagos con el nombre "Sonelia" sin autorización; usar la marca en dominios, perfiles o páginas que parezcan oficiales; y recomendarte a ti mismo o crear clínicas falsas para ganar comisiones.',
    ]],
    ['7. Desactivación', [
      'Sonelia puede desactivar a afiliados que incumplan estos términos. Las comisiones ligadas a fraude o a recomendaciones irregulares se cancelan. Las comisiones legítimas ya liberadas se siguen pagando.',
      'El afiliado puede dejar el programa en cualquier momento, avisando al soporte.',
    ]],
    ['8. Cambios en el programa', [
      'El monto de la comisión y las reglas del programa pueden cambiar, con aviso previo en el panel del afiliado. Los cambios no afectan las comisiones ya liberadas.',
    ]],
    ['9. Tus datos', [
      'Usamos tu nombre, contacto, CPF o CNPJ y clave Pix solo para gestionar el programa y pagar las comisiones, de acuerdo con la LGPD (ley brasileña de protección de datos).',
    ]],
  ],
};

const PRIVACIDADE_ES = {
  titulo: 'Política de privacidad',
  subtitulo: 'Cómo Sonelia trata los datos personales',
  secoes: [
    ['1. Quiénes somos', [
      'Sonelia es un sistema en línea de gestión de clínicas: agenda, pacientes, historia clínica electrónica, seguros médicos, pagos a profesionales y recordatorios de citas. Esta política explica qué datos personales tratamos, para qué y cuáles son tus derechos, de acuerdo con la Ley General de Protección de Datos de Brasil (Ley 13.709/2018, LGPD).',
    ]],
    ['2. Dos papeles distintos', [
      'Datos de quien usa el sistema (dueño de la clínica, recepción, profesionales y afiliados): Sonelia es la responsable (controladora) de esos datos.',
      'Datos de los pacientes registrados por la clínica, incluida la historia clínica: la clínica es la responsable y Sonelia es la encargada. Tratamos esos datos solo para prestar el servicio, según las instrucciones de la clínica. Los pedidos del paciente sobre sus propios datos deben hacerse a la clínica, y Sonelia la ayuda a atenderlos.',
    ]],
    ['3. Datos que tratamos', [
      'Registro: nombre, correo, teléfono, nombre de la clínica e identificación fiscal, y la contraseña, que se guarda cifrada y nunca como texto.',
      'Acceso con Google: nombre, correo y el identificador de la cuenta de Google.',
      'Pago: los datos de la tarjeta quedan con Mercado Pago o Stripe. Sonelia solo recibe el estado del pago y, en el Pix, el CPF o CNPJ de quien paga.',
      'Datos cargados por la clínica: pacientes, responsables, agenda, historia clínica y demás registros de atención, incluidos datos de salud, que la ley trata como datos sensibles.',
      'WhatsApp: cuando la clínica usa los recordatorios de citas y el paciente lo autorizó, tratamos el celular del paciente, el texto del recordatorio y su respuesta (confirmar o cancelar).',
      'Uso del sitio: estadísticas de visitas sin cookies (Vercel Web Analytics), que no identifican a la persona. Las preferencias, como el tema de colores, quedan solo en tu navegador.',
    ]],
    ['4. Para qué los usamos', [
      'Para prestar el servicio contratado y mantener la cuenta funcionando; cobrar la suscripción; enviar correos del sistema, como el de restablecer contraseña; enviar recordatorios de citas por WhatsApp cuando la clínica activa la función y el paciente lo autoriza; dar soporte; cumplir obligaciones legales; y mejorar el sistema con estadísticas de uso.',
      'No vendemos datos personales ni usamos los datos de los pacientes para publicidad.',
    ]],
    ['5. Con quién los compartimos', [
      'Solo con los proveedores necesarios para que el servicio funcione, cada uno usando los datos solo para ese fin: hospedaje del sistema (OVHcloud) y del sitio (Vercel), base de datos (MongoDB Atlas), pagos (Mercado Pago y Stripe), envío de correos (Resend), mensajes de WhatsApp (Meta, mediante la plataforma WhatsApp Business) y acceso con Google (Google).',
      'Algunos de estos proveedores guardan datos fuera de Brasil, con las garantías que exige la LGPD.',
      'También podemos compartir datos cuando lo exija la ley o una orden judicial.',
    ]],
    ['6. Por cuánto tiempo los guardamos', [
      'Los datos de la cuenta se guardan mientras la cuenta exista. Las historias clínicas siguen el plazo mínimo de 20 años de la Ley 13.787/2018 y las reglas de cada colegio profesional. Los registros de pago se guardan durante el plazo que exige la ley fiscal. Los llamados de la TV de la sala de espera se borran en 24 horas.',
    ]],
    ['7. Seguridad', [
      'Usamos conexión cifrada (HTTPS), contraseñas cifradas y acceso por función: la recepción no ve el contenido clínico, y el sistema registra quién abrió cada historia clínica. Si ocurre un incidente de seguridad que pueda representar un riesgo relevante, avisamos a las personas afectadas y a la Autoridad Nacional de Protección de Datos de Brasil (ANPD), como exige la ley.',
    ]],
    ['8. Tus derechos', [
      'Por la LGPD, puedes pedir: confirmación de que tratamos tus datos, acceso, corrección, anonimización, portabilidad, eliminación, información sobre con quién los compartimos y revocación del consentimiento. Haz tu pedido por el contacto al final de esta página. Para eliminar tu cuenta y tus datos, consulta la página Eliminación de datos (sonelia.com.br/exclusao-de-dados).',
    ]],
    ['9. Cambios en esta política', [
      'Esta política puede actualizarse. Los cambios importantes se avisarán en el sistema o por correo, y la fecha de la versión, arriba en la página, cambiará.',
    ]],
  ],
};

const EXCLUSAO_DE_DADOS_ES = {
  titulo: 'Eliminación de datos',
  subtitulo: 'Cómo pedir la eliminación de tu cuenta y tus datos',
  secoes: [
    ['1. Usuarios de Sonelia', [
      'Dueños de clínicas, profesionales, recepción y afiliados pueden pedir la eliminación de su cuenta y sus datos por el contacto al final de esta página, de preferencia desde el teléfono o el correo registrados en la cuenta. Por tu seguridad, confirmamos que el pedido es tuyo antes de eliminar.',
      'Los usuarios de una clínica (recepción y profesionales) también pueden ser eliminados por el administrador de la clínica, en el menú Usuarios.',
      'Completamos la eliminación en hasta 15 días y te avisamos cuando esté hecha.',
    ]],
    ['2. Qué se elimina y qué debe guardarse', [
      'Eliminamos los datos de registro y de acceso. Solo se guarda lo que la ley exige: historias clínicas por el plazo mínimo de 20 años (Ley 13.787/2018) y registros de pago por el plazo que exige la ley fiscal. Esos datos quedan bloqueados para cualquier otro uso.',
    ]],
    ['3. Pacientes', [
      'Los datos del paciente pertenecen a la clínica donde se atiende. Para pedir acceso, corrección o eliminación, contacta a la clínica: Sonelia le da las herramientas para atender el pedido.',
      'Para dejar de recibir recordatorios de citas por WhatsApp, avisa a la clínica, que desmarcará la autorización en tu registro.',
    ]],
    ['4. Datos recibidos por WhatsApp', [
      'El celular y las respuestas recibidas por WhatsApp forman parte de los datos de la clínica y se eliminan junto con el registro del paciente o de la clínica, respetando los plazos legales de arriba.',
    ]],
  ],
};

// Mesmo objeto em português → versão em espanhol.
export const TERMOS_ES = new Map([
  [TERMOS_CLINICA, TERMOS_CLINICA_ES],
  [TERMOS_AFILIADO, TERMOS_AFILIADO_ES],
  [PRIVACIDADE, PRIVACIDADE_ES],
  [EXCLUSAO_DE_DADOS, EXCLUSAO_DE_DADOS_ES],
]);
