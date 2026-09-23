/**
 * Consulta enviada desde el formulario de contacto de la home.
 *
 * Los campos son exactamente los que pide el formulario. No se persiste: la consulta viaja
 * por correo al buzón comercial, así que no hay `id` ni fecha de creación.
 */
export interface ContactoLead {
  /** Tipo de obra elegido en el selector. */
  type: string;
  /** Superficie aproximada en m². */
  area: string;
  name: string;
  city: string;
  company: string;
  phone: string;
  message: string;
}
