#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🧪 RentaYa - Configuración de Testing para Recuperación de Contraseña\n');
console.log('━'.repeat(70));
console.log('\n');

function question(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function setup() {
  try {
    // Paso 1: Obtener URL del backend
    console.log('📡 PASO 1: Configuración del Backend\n');
    const backendUrl = await question('Ingresa la URL de tu backend en Render (ej: https://mi-backend.onrender.com): ');

    if (!backendUrl || !backendUrl.startsWith('http')) {
      console.log('\n❌ Error: La URL debe comenzar con http:// o https://');
      rl.close();
      return;
    }

    // Paso 2: Preguntar si quiere Google OAuth (opcional)
    console.log('\n🔐 PASO 2: Google OAuth (Opcional)\n');
    const needsGoogle = await question('¿Necesitas configurar Google OAuth? (s/n): ');

    let googleWebClientId = '';
    let googleAndroidClientId = '';
    let googleIosClientId = '';

    if (needsGoogle.toLowerCase() === 's') {
      googleWebClientId = await question('Google Web Client ID: ');
      googleAndroidClientId = await question('Google Android Client ID: ');
      googleIosClientId = await question('Google iOS Client ID (opcional): ');
    }

    // Paso 3: Crear archivo .env
    console.log('\n📝 PASO 3: Generando archivo .env...\n');

    const envContent = `# API Configuration - DESARROLLO
# Generado automáticamente por setup-testing.js
EXPO_PUBLIC_API_URL=${backendUrl}

# Google OAuth Configuration
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=${googleWebClientId || 'your-google-web-client-id.apps.googleusercontent.com'}
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=${googleAndroidClientId || 'your-google-android-client-id.apps.googleusercontent.com'}
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=${googleIosClientId || 'your-google-ios-client-id.apps.googleusercontent.com'}

# App Environment
APP_VARIANT=development

# Generado: ${new Date().toLocaleString()}
`;

    const envPath = path.join(process.cwd(), '.env');
    fs.writeFileSync(envPath, envContent, 'utf8');

    console.log('✅ Archivo .env creado exitosamente');

    // Paso 4: Mostrar resumen
    console.log('\n' + '━'.repeat(70));
    console.log('\n📋 RESUMEN DE CONFIGURACIÓN:\n');
    console.log(`   Backend URL: ${backendUrl}`);
    console.log(`   Google OAuth: ${needsGoogle.toLowerCase() === 's' ? 'Configurado' : 'No configurado'}`);
    console.log(`   Archivo .env: ${envPath}`);

    // Paso 5: Agregar botón de testing al login
    console.log('\n🔨 PASO 4: Configurando acceso a pantalla de testing...\n');
    const addTestButton = await question('¿Quieres agregar un botón de testing en la pantalla de login? (s/n): ');

    if (addTestButton.toLowerCase() === 's') {
      try {
        const loginPath = path.join(process.cwd(), 'app', '(auth)', 'login.tsx');

        if (fs.existsSync(loginPath)) {
          let loginContent = fs.readFileSync(loginPath, 'utf8');

          // Verificar si ya existe el botón
          if (loginContent.includes('test-password-recovery')) {
            console.log('⚠️  El botón de testing ya existe en login.tsx');
          } else {
            // Buscar el último Pressable antes del cierre del View principal
            const testButton = `
              {/* 🧪 TESTING ONLY - Remover en producción */}
              <Pressable
                onPress={() => router.push('/(auth)/test-password-recovery')}
                className="mt-4 py-2"
              >
                <Text className="text-gray-500 text-center text-sm">
                  🧪 Test Password Recovery
                </Text>
              </Pressable>
              {/* FIN TESTING */}
`;

            // Buscar el texto "¿No tienes cuenta?" y agregar el botón después
            const searchText = '¿No tienes cuenta?';
            if (loginContent.includes(searchText)) {
              // Encontrar el cierre del View que contiene el link de registro
              const index = loginContent.indexOf(searchText);
              const afterIndex = loginContent.indexOf('</Pressable>', index) + '</Pressable>'.length;

              loginContent = loginContent.slice(0, afterIndex) + testButton + loginContent.slice(afterIndex);

              fs.writeFileSync(loginPath, loginContent, 'utf8');
              console.log('✅ Botón de testing agregado a login.tsx');
            } else {
              console.log('⚠️  No se pudo agregar automáticamente. Agrégalo manualmente.');
            }
          }
        } else {
          console.log('⚠️  No se encontró el archivo login.tsx');
        }
      } catch (error) {
        console.log('⚠️  Error al modificar login.tsx:', error.message);
      }
    }

    // Paso 6: Instrucciones finales
    console.log('\n' + '━'.repeat(70));
    console.log('\n🎉 CONFIGURACIÓN COMPLETADA\n');
    console.log('Próximos pasos:\n');
    console.log('1. Verifica que tu backend en Render esté activo');
    console.log('2. Asegúrate de que las variables SMTP estén configuradas en Render:');
    console.log('   - SMTP_HOST (ej: smtp.gmail.com)');
    console.log('   - SMTP_PORT (ej: 587)');
    console.log('   - SMTP_USER');
    console.log('   - SMTP_PASS');
    console.log('   - SMTP_FROM\n');
    console.log('3. Genera la APK de testing:');
    console.log('   Opción A (EAS): eas build --profile development-apk --platform android');
    console.log('   Opción B (Local): npm run android:clean && cd android && ./gradlew assembleDebug\n');
    console.log('4. Instala la APK en tu dispositivo Android');
    console.log('5. Abre la app y busca el botón "🧪 Test Password Recovery"\n');
    console.log('📚 Para más información, lee: TESTING_APK_GUIDE.md\n');
    console.log('━'.repeat(70));
    console.log('\n');

    // Paso 7: Checklist de backend
    console.log('✅ CHECKLIST DE VERIFICACIÓN DEL BACKEND:\n');
    const checklistItems = [
      'Backend desplegado en Render',
      'Variables SMTP configuradas',
      'CORS habilitado para requests externos',
      'Endpoint POST /api/auth/forgot-password funcional',
      'Endpoint POST /api/auth/reset-password funcional',
      'Base de datos accesible',
      'Logs de Render monitoreados'
    ];

    for (const item of checklistItems) {
      console.log(`   [ ] ${item}`);
    }

    console.log('\n💡 TIP: Usa la pantalla de testing para ver logs detallados de las peticiones\n');

  } catch (error) {
    console.error('\n❌ Error durante la configuración:', error.message);
  } finally {
    rl.close();
  }
}

// Ejecutar setup
setup().catch(console.error);
