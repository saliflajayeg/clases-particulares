#!/usr/bin/env bash
# Convierte el proyecto en la versión de demostración estática (solo se ejecuta en GitHub Actions
# o en una copia: MODIFICA src/). Quita lo que necesita servidor: panel admin, cuentas y documentos.
set -euo pipefail
cd "$(dirname "$0")/.."
cp demo/actions.demo.ts src/app/actions.ts
rm -rf src/app/admin src/app/docs src/app/profesores/acceso src/app/profesores/panel src/components/LoginForm.tsx src/lib/session.ts src/lib/db.ts
echo "Demo preparada."
