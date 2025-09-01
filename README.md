# Backend_Tienda_Serverless

## Resumen del Proyecto
Migración y modernización del backend de Tienda a una arquitectura Serverless sobre AWS Lambda usando Serverless Framework.

---

## ¿Qué se hizo?
- Migración de un backend Node.js/Express tradicional a AWS Lambda (Serverless).
- Implementación de endpoints RESTful para administración, productos, comentarios y estadísticas.
- Uso de MongoDB Atlas como base de datos gestionada en la nube.
- Configuración de variables de entorno seguras con serverless-dotenv-plugin.
- Protección de endpoints con JWT y validación/sanitización de entradas (Joi, sanitize-html).
- Manejo de logs vía AWS CloudWatch.
- Optimización del tamaño de despliegue usando Lambda Layers para dependencias compartidas.
- Configuración de CORS y throttling en API Gateway.
- Automatización de tareas programadas (cron) con funciones Lambda.

---

## ¿Qué se mejora con Serverless?
- **Escalabilidad automática:** AWS Lambda escala funciones bajo demanda, sin preocuparse por servidores.
- **Costos optimizados:** Solo se paga por uso real (invocaciones y tiempo de ejecución), no por servidores encendidos.
- **Despliegue rápido:** Cambios y nuevas funciones se despliegan en segundos con `sls deploy`.
- **Alta disponibilidad:** AWS gestiona la infraestructura, garantizando disponibilidad y tolerancia a fallos.
- **Seguridad:** Variables de entorno seguras, integración con IAM, y protección de endpoints con JWT.
- **Mantenimiento sencillo:** Sin necesidad de administrar servidores, parches de SO, ni escalado manual.
- **Logs centralizados:** Todos los logs van a CloudWatch, facilitando monitoreo y debugging.
- **Menor tamaño de funciones:** Uso de Lambda Layers para evitar duplicar dependencias y acelerar despliegues.

---

## Comparación con otras tecnologías
| Característica         | Serverless (Lambda)         | Backend tradicional (EC2, VPS) |
|-----------------------|-----------------------------|-------------------------------|
| Escalabilidad         | Automática                  | Manual o scripts              |
| Costos                | Por uso real                | Por servidor/hora             |
| Despliegue            | Rápido, automatizado        | Manual o CI/CD                |
| Seguridad             | IAM, variables, API Gateway | Depende de configuración      |
| Logs                  | CloudWatch                  | Local o externo               |
| Mantenimiento         | Casi nulo                   | Alto (SO, parches, etc.)      |
| Tamaño de funciones   | Layers, optimizado          | Depende del empaquetado       |

---

## Soluciones implementadas
- **Validación y sanitización:** Todas las entradas de usuario se validan y sanitizan para evitar ataques XSS e inyecciones.
- **JWT:** Autenticación robusta y segura para admins.
- **Lambda Layers:** Dependencias compartidas para reducir tamaño y acelerar despliegues.
- **Plugins Serverless:** Uso de serverless-dotenv-plugin y serverless-prune-plugin para gestión de entorno y limpieza.
- **CORS y Throttling:** Configuración segura y controlada de acceso a la API.
- **Automatización:** Funciones programadas para tareas de mantenimiento.

---

## Cómo desplegar
1. Instala dependencias de desarrollo:
   ```bash
   npm install
   ```
2. Instala dependencias del layer:
   ```bash
   cd layer/nodejs
   npm install
   ```
3. Despliega:
   ```bash
   sls deploy
   ```

---

## Notas
- El layer se sube como recurso independiente y es compartido por todas las funciones Lambda.
- El package.json de la raíz solo debe tener los plugins de Serverless, no dependencias de runtime.
- Los logs y errores se revisan en AWS CloudWatch.
- Para aumentar límites (concurrencia, funciones, etc.), usar AWS Service Quotas.

---

## Contacto
Mario Pazmiño
