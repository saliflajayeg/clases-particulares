# ProfeGE — clases particulares en Guinea Ecuatorial

Plataforma para conectar familias/estudiantes con profesores particulares verificados. **Clases solo a domicilio.**

Cursos y asignaturas = Plan de Estudios Nacional (1º–4º de ESBA, 1º–2º de Bachillerato con sus 4 ramas), definido en `src/lib/constants.ts`. Los alumnos piden por curso + asignatura; los profesores marcan qué asignaturas imparten en qué cursos, con el título que les acredita, y el admin solo ve como candidatos a quienes coinciden en asignatura Y curso.

## Arrancar
Doble clic en `iniciar-profe-ge.bat` → http://localhost:3080

## Páginas
| Ruta | Para quién |
|---|---|
| `/` | Portada: captar familias y alumnos + bloque "¿Eres profesor? Trabaja con nosotros" |
| `/pedir-clases` | Formulario de solicitud (curso → rama → asignaturas, domicilio, horario) |
| `/profesores` | Página "Trabaja con nosotros" |
| `/profesores/registro` | Registro: asignaturas × cursos, título que acredita cada asignatura + "¿por qué eres profesor de…?", CV, certificados, foto, zonas, horario, tarifa |
| `/profesores/acceso` · `/profesores/panel` | Cuenta del profesor: estado de verificación y alumnos asignados |
| `/admin` | Panel interno: revisar profesores y sus documentos, aprobar/rechazar, asignar profesor a cada solicitud, avisar por WhatsApp |

## Configuración
- `.env.local`: `ADMIN_PASSWORD` (contraseña del panel /admin) y `SESSION_SECRET`.
- `src/lib/constants.ts`: número de WhatsApp (+240 555 573 464), plan de estudios, ciudades y precios orientativos.
- Datos en `data/db.json` y documentos en `data/uploads/` (privados: solo admin o el propio profesor).

## Pendiente para producción
- Pasar `data/` a Supabase (Postgres + Storage) para poder desplegar en Render/Vercel.
- Sustituir los testimonios de ejemplo de la portada por reales.
