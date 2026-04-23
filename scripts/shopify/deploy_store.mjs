import { execSync } from 'child_process';
try {
  console.log('Building project...');
  execSync('npm run build', { stdio: 'inherit', shell: true });
  console.log('Deploying to Firebase...');
  execSync('npx firebase-tools deploy', { stdio: 'inherit', shell: true });
  console.log('Deployment successful!');
} catch (e) {
  console.error('Deployment failed:', e.message);
}
