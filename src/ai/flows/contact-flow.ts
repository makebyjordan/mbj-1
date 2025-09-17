'use server';
/**
 * @fileOverview Un agente de IA que procesa y reenvía los envíos del formulario de contacto.
 *
 * - sendContactEmail - Una función que recibe los datos de un formulario de contacto.
 * - ContactFormInput - El tipo de entrada para la función sendContactEmail.
 * - ContactFormOutput - El tipo de retorno para la función sendContactEmail.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ContactFormInputSchema = z.object({
  name: z.string().describe('El nombre de la persona que envía el mensaje.'),
  email: z.string().email().describe('La dirección de correo electrónico del remitente.'),
  message: z.string().describe('El contenido del mensaje.'),
});
export type ContactFormInput = z.infer<typeof ContactFormInputSchema>;

const ContactFormOutputSchema = z.object({
  status: z.enum(['success', 'error']),
  message: z.string(),
});
export type ContactFormOutput = z.infer<typeof ContactFormOutputSchema>;

export async function sendContactEmail(input: ContactFormInput): Promise<ContactFormOutput> {
  return contactFlow(input);
}

const emailPrompt = ai.definePrompt({
    name: 'contactEmailPrompt',
    input: { schema: ContactFormInputSchema },
    prompt: `Formatea un correo electrónico profesional para ser enviado a makebyjordan@gmail.com con la siguiente información de contacto.

    Asunto: Nuevo Mensaje de Contacto de {{{name}}}

    Cuerpo del Correo:

    Has recibido un nuevo mensaje a través del formulario de contacto de tu sitio web.

    - Nombre: {{{name}}}
    - Correo Electrónico: {{{email}}}
    - Mensaje:
    {{{message}}}

    ---
    Este es un mensaje automático.
    `,
});


const contactFlow = ai.defineFlow(
  {
    name: 'contactFlow',
    inputSchema: ContactFormInputSchema,
    outputSchema: ContactFormOutputSchema,
  },
  async (input) => {
    try {
        // En una aplicación real, aquí llamarías a un servicio de correo (p. ej., SendGrid, Nodemailer)
        // usando el resultado del prompt.
        const { output } = await emailPrompt(input);
        console.log("Contenido del correo generado para enviar:", output);

        // Como no podemos enviar correos reales aquí, simularemos un éxito.
        return {
            status: 'success',
            message: 'El mensaje ha sido procesado por el backend.',
        };
    } catch (error) {
        console.error("Error en el flujo de contacto:", error);
        return {
            status: 'error',
            message: 'Hubo un problema al procesar tu mensaje.',
        };
    }
  }
);
