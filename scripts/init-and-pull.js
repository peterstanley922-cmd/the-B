const { execSync } = require('child_process');

console.log('Initializing git repository and pulling from GitHub...');

try {
  // Initialize git repo if not already initialized
  console.log('Initializing git...');
  try {
    execSync('git init', { stdio: 'inherit' });
  } catch (e) {
    console.log('Git already initialized');
  }

  // Add remote
  console.log('Adding GitHub remote...');
  try {
    execSync('git remote add origin https://github.com/peterstanley922-cmd/the-B.git', { stdio: 'inherit' });
  } catch (e) {
    console.log('Remote already exists, updating...');
    execSync('git remote set-url origin https://github.com/peterstanley922-cmd/the-B.git', { stdio: 'inherit' });
  }

  // Fetch from GitHub
  console.log('Fetching from GitHub...');
  execSync('git fetch origin main', { stdio: 'inherit' });

  // Pull latest changes
  console.log('Pulling latest changes from main branch...');
  execSync('git pull origin main', { stdio: 'inherit' });

  console.log('Successfully pulled latest changes from GitHub!');
} catch (error) {
  console.error('Error during git operations:', error.message);
  process.exit(1);
}
