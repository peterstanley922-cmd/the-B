import { execSync } from 'child_process';

try {
  console.log('Pulling latest changes from GitHub...');
  const result = execSync('git pull origin main', { encoding: 'utf-8' });
  console.log('Pull completed successfully!');
  console.log(result);
} catch (error) {
  console.error('Error pulling from GitHub:', error.message);
  process.exit(1);
}
