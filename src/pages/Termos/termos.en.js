// Tradução para o inglês dos textos legais (cortesia: vale a versão em português, ver AVISO_TRADUCAO).
import { TERMOS_CLINICA, TERMOS_AFILIADO, PRIVACIDADE, EXCLUSAO_DE_DADOS } from './termos.dados.js';

export const AVISO_TRADUCAO = 'This is a courtesy translation. In case of any difference, the Portuguese version prevails.';

const TERMOS_CLINICA_EN = {
  titulo: 'Terms of use',
  subtitulo: 'For clinics that use Sonelia',
  secoes: [
    ['1. What Sonelia is', [
      'Sonelia is an online clinic management system: scheduling, patients, electronic health records, insurance plans, practitioner payouts and other features. By creating an account, the person signing up declares they are authorized to contract on behalf of the clinic and accepts these terms.',
    ]],
    ['2. Account and access', [
      'Whoever creates the account is the clinic administrator and is responsible for it. They add the other users (front desk and practitioners) and define what each one can do.',
      'Each user must have their own login. The password is personal and must not be shared. Contact support if you suspect misuse of your account.',
    ]],
    ['3. Free trial, plans and payment', [
      'The account starts with a free trial, with no credit card. After it, access continues only with a paid plan, by Pix or credit card, through Mercado Pago.',
      'On a card, the subscription renews every month until cancelled. With Pix, each payment grants a period of access and there is no automatic renewal.',
      'The Individual plan is for solo practitioners: only the account holder uses the system, as the only practitioner, with no front desk or other users. To have a team, a team plan such as Pro is required.',
      'Plan prices may change. A price change does not affect the period already paid and will be announced in advance.',
    ]],
    ['4. Withdrawal and cancellation', [
      'You may withdraw from the purchase within 7 days of payment and get a refund, as provided by article 49 of the Brazilian Consumer Protection Code. Just ask support.',
      'After that period, you can cancel anytime: access continues until the end of the period already paid, and there is no prorated refund.',
      'Non-payment blocks access after the grace period. The data remains stored and access returns when the subscription is settled.',
    ]],
    ['5. Patient data and LGPD', [
      'The clinic is the controller of its patients’ data and is responsible for the legal basis to process it, including health data. Sonelia acts as the processor: it stores and processes this data only to provide the service, according to the clinic’s instructions.',
      'Sonelia does not sell or share the clinic’s or the patients’ data, and only accesses it when necessary to provide support, fix problems or comply with the law.',
      'Each clinic sees only its own data. The connection is encrypted, and the system logs who opened each health record.',
    ]],
    ['6. Health records', [
      'The content of a health record is the responsibility of the practitioner who writes it. Health records cannot be deleted before 20 years, as required by Brazilian Law 13,787/2018; corrections are made through addenda, without deleting the original record.',
    ]],
    ['7. Acceptable use', [
      'It is forbidden to use the system for illegal purposes, to try to access other clinics’ data, to overload or attack the service, or to resell access without authorization.',
      'Sonelia may suspend accounts that breach these terms.',
    ]],
    ['8. Availability and liability', [
      'We work to keep the system available at all times, but there may be interruptions for maintenance or due to third-party failures (internet, servers, Mercado Pago).',
      'Clinical, administrative and financial decisions made based on the system’s information are the clinic’s responsibility.',
    ]],
    ['9. Account closure', [
      'The clinic may request the closure of its account at any time. Health records remain stored for the period required by law.',
    ]],
    ['10. Changes to the terms', [
      'These terms may be updated. Important changes will be announced in the system or by email. Continuing to use Sonelia after the notice means agreeing to the new version.',
    ]],
  ],
};

const TERMOS_AFILIADO_EN = {
  titulo: 'Affiliate terms',
  subtitulo: 'For those who promote Sonelia and earn commissions',
  secoes: [
    ['1. The affiliate program', [
      'Affiliates promote Sonelia to clinics and earn a commission for each clinic that signs up through their link or code and pays the first month. By creating an affiliate account, you accept these terms.',
    ]],
    ['2. How referrals are counted', [
      'The clinic must sign up through your link or type your code when registering. Clinics already registered, or that sign up without your link or code, do not count.',
      'Each clinic generates a single commission, even if it keeps paying in the following months.',
    ]],
    ['3. Commission amount and timing', [
      'The commission is 50% of the first month of the plan the referred clinic subscribes to (for example: R$ 50.00 on the R$ 100.00 Individual plan, and R$ 100.00 on the R$ 200.00 Pro plan). Referral discounts the clinic may have do not reduce the commission.',
      'Under the Brazilian Consumer Protection Code, customers have 7 days to cancel and get a refund. That is why the commission is on hold and can only be paid from the 8th day after the clinic’s payment.',
      'If the clinic’s payment is refunded or disputed before the commission is paid, the commission is cancelled. It becomes valid again if the clinic pays again.',
    ]],
    ['4. Commission payments', [
      'Released commissions are paid by Pix, to the key registered by the affiliate, once a month. You can follow everything in the affiliate dashboard: what is on hold, what is due and what you have received.',
      'Keep your Pix key and CPF or CNPJ up to date. Payments made to the key provided by the affiliate are considered delivered.',
    ]],
    ['5. Taxes and relationship', [
      'Affiliates are independent: there is no employment, partnership or commercial agency relationship with Sonelia. Each party is responsible for its own taxes.',
      'Sonelia may ask for an invoice (for example, as an MEI) or the information needed to record the payment, as required by law.',
    ]],
    ['6. Permitted promotion', [
      'Promote honestly: do not promise features, prices or results the system does not offer.',
      'It is forbidden to: send spam or bulk messages to people who did not ask for them; run paid ads with the name "Sonelia" without authorization; use the brand in domains, profiles or pages that look official; and refer yourself or create fake clinics to earn commissions.',
    ]],
    ['7. Deactivation', [
      'Sonelia may deactivate affiliates who breach these terms. Commissions linked to fraud or irregular referrals are cancelled. Legitimate commissions already released will still be paid.',
      'Affiliates may end their participation at any time by contacting support.',
    ]],
    ['8. Program changes', [
      'The commission amount and program rules may change, with prior notice in the affiliate dashboard. Changes do not affect commissions already released.',
    ]],
    ['9. Your data', [
      'We use your name, contact details, CPF or CNPJ and Pix key only to run the program and pay commissions, in accordance with the LGPD (Brazil’s data protection law).',
    ]],
  ],
};

const PRIVACIDADE_EN = {
  titulo: 'Privacy policy',
  subtitulo: 'How Sonelia handles personal data',
  secoes: [
    ['1. Who we are', [
      'Sonelia is an online clinic management system: scheduling, patients, electronic health records, insurance plans, payouts and appointment reminders. This policy explains which personal data we process, for what purpose and what your rights are, in accordance with Brazil’s General Data Protection Law (Law 13,709/2018, LGPD).',
    ]],
    ['2. Two different roles', [
      'Data of people who use the system (clinic owner, front desk, practitioners and affiliates): Sonelia is the controller of this data.',
      'Data of patients registered by the clinic, including health records: the clinic is the controller, and Sonelia is the processor. We process this data only to provide the service, according to the clinic’s instructions. Patients’ requests about their own data must be made to the clinic, and Sonelia helps the clinic handle them.',
    ]],
    ['3. Data we process', [
      'Registration: name, email, phone, clinic name and CNPJ, and the password, which is stored encrypted and never as plain text.',
      'Google sign-in: name, email and the Google account identifier.',
      'Payment: card details stay with Mercado Pago. Sonelia only receives the payment status and, for Pix, the payer’s CPF or CNPJ.',
      'Data entered by the clinic: patients, guardians, schedule, health records and other care records, including health data, which the law treats as sensitive data.',
      'WhatsApp: when the clinic uses appointment reminders and the patient has agreed, we process the patient’s mobile number, the reminder text and their reply (confirm or cancel).',
      'Website use: cookie-free visit statistics (Vercel Web Analytics), which do not identify the person. Preferences, such as the color theme, are stored only in your browser.',
    ]],
    ['4. What we use it for', [
      'To provide the contracted service and keep the account running; charge the subscription; send system emails, such as password resets; send appointment reminders on WhatsApp when the clinic turns the feature on and the patient agrees; provide support; comply with legal obligations; and improve the system with usage statistics.',
      'We do not sell personal data and do not use patients’ data for advertising.',
    ]],
    ['5. Who we share it with', [
      'Only with the providers needed for the service to work, each using the data only for that purpose: system hosting (OVHcloud) and website hosting (Vercel), database (MongoDB Atlas), payments (Mercado Pago), email delivery (Resend), WhatsApp messages (Meta, through the WhatsApp Business platform) and Google sign-in (Google).',
      'Some of these providers store data outside Brazil, with the safeguards required by the LGPD.',
      'We may also share data when required by law or a court order.',
    ]],
    ['6. How long we keep it', [
      'Account data is kept while the account exists. Health records follow the minimum retention period of 20 years under Law 13,787/2018 and each professional council’s rules. Payment records are kept for the period required by tax law. Waiting room TV calls are deleted within 24 hours.',
    ]],
    ['7. Security', [
      'We use an encrypted connection (HTTPS), encrypted passwords and role-based access: the front desk cannot see clinical content, and the system logs who opened each health record. If a security incident occurs that may pose a relevant risk, we notify the affected people and Brazil’s National Data Protection Authority (ANPD), as required by law.',
    ]],
    ['8. Your rights', [
      'Under the LGPD, you may request: confirmation that we process your data, access, correction, anonymization, portability, deletion, information about who we share it with and withdrawal of consent. Make your request through the contact at the end of this page. To delete your account and data, see the Data deletion page (sonelia.com.br/exclusao-de-dados).',
    ]],
    ['9. Changes to this policy', [
      'This policy may be updated. Important changes will be announced in the system or by email, and the version date at the top of the page will change.',
    ]],
  ],
};

const EXCLUSAO_DE_DADOS_EN = {
  titulo: 'Data deletion',
  subtitulo: 'How to request deletion of your account and data',
  secoes: [
    ['1. Sonelia users', [
      'Clinic owners, practitioners, front desk staff and affiliates can request deletion of their account and data through the contact at the end of this page, preferably from the phone or email registered on the account. For your security, we confirm the request is yours before deleting.',
      'Clinic users (front desk and practitioners) can also be deleted by the clinic administrator, in the Users menu.',
      'We complete the deletion within 15 days and let you know when it is done.',
    ]],
    ['2. What is deleted and what must be kept', [
      'We delete registration and access data. Only the data the law requires is kept: health records for the minimum period of 20 years (Law 13,787/2018) and payment records for the period required by tax law. This data is blocked from any other use.',
    ]],
    ['3. Patients', [
      'Patients’ data belongs to the clinic where they are treated. To request access, correction or deletion, contact the clinic: Sonelia gives it the tools to handle the request.',
      'To stop receiving appointment reminders on WhatsApp, tell the clinic, which will uncheck the consent in your record.',
    ]],
    ['4. Data received through WhatsApp', [
      'The mobile number and replies received through WhatsApp are part of the clinic’s data and are deleted along with the patient’s or the clinic’s record, subject to the legal periods above.',
    ]],
  ],
};

// Mesmo objeto em português → versão em inglês.
export const TERMOS_EN = new Map([
  [TERMOS_CLINICA, TERMOS_CLINICA_EN],
  [TERMOS_AFILIADO, TERMOS_AFILIADO_EN],
  [PRIVACIDADE, PRIVACIDADE_EN],
  [EXCLUSAO_DE_DADOS, EXCLUSAO_DE_DADOS_EN],
]);
