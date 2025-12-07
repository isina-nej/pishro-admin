module.exports = {
  apps: [
    {
      name: 'pishro-admin',
      script: 'npm',
      args: 'run start',
      cwd: '/opt/pishro-admin',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
        NEXT_PUBLIC_API_URL: 'https://pishrosarmaye.com/api',
        NEXT_PUBLIC_BASE_URL: 'https://admin.pishrosarmaye.com',
        NEXTAUTH_URL: 'https://admin.pishrosarmaye.com',
      },
    },
  ],
};
