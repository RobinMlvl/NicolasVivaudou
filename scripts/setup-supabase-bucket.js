/**
 * Script pour créer le bucket Supabase Storage
 * 
 * Usage: node scripts/setup-supabase-bucket.js
 */

// Charger les variables d'environnement
require('dotenv').config({ path: '.env' });

const { createClient } = require('@supabase/supabase-js');

// Configuration Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function setupSupabaseBucket() {
  try {
    console.log('🚀 Configuration du bucket Supabase Storage...\n');

    const bucketName = process.env.SUPABASE_STORAGE_BUCKET || 'portfolio-images';

    // Vérifier si le bucket existe
    const { data: buckets, error: listError } = await supabaseAdmin.storage.listBuckets();
    
    if (listError) {
      console.error('❌ Erreur lors de la liste des buckets:', listError);
      return;
    }

    const existingBucket = buckets.find(bucket => bucket.name === bucketName);

    if (existingBucket) {
      console.log(`✅ Le bucket "${bucketName}" existe déjà`);
    } else {
      console.log(`📦 Création du bucket "${bucketName}"...`);
      
      // Créer le bucket
      const { data: bucket, error: createError } = await supabaseAdmin.storage.createBucket(bucketName, {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
        fileSizeLimit: 50 * 1024 * 1024, // 50MB
      });

      if (createError) {
        console.error('❌ Erreur lors de la création du bucket:', createError);
        return;
      }

      console.log(`✅ Bucket "${bucketName}" créé avec succès`);
    }

    // Tester l'accès au bucket
    console.log('\n🔍 Test d\'accès au bucket...');
    const { data: files, error: listFilesError } = await supabaseAdmin.storage
      .from(bucketName)
      .list('', {
        limit: 1,
      });

    if (listFilesError) {
      console.error('❌ Erreur lors du test d\'accès:', listFilesError);
    } else {
      console.log(`✅ Accès au bucket confirmé (${files.length} fichiers trouvés)`);
    }

    console.log('\n🎉 Configuration Supabase Storage terminée !');
    console.log(`📁 Bucket: ${bucketName}`);
    console.log(`🔗 URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucketName}/`);

  } catch (error) {
    console.error('💥 Erreur fatale:', error);
    process.exit(1);
  }
}

// Exécuter le setup
setupSupabaseBucket()
  .then(() => {
    console.log('\n✨ Setup terminé');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Erreur:', error);
    process.exit(1);
  });