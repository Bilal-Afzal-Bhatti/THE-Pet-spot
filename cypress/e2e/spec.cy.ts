describe('Website Pages Smoke Test', () => {
  const baseUrl = 'https://the-pet-spot-pink.vercel.app';

  // List of all routes from your Next.js app folder
  const routes = [
    '/',
    '/about-us',
    '/blog',
    '/cat-breed',
    '/cats',
    '/checkout',
    '/contact-us',
    '/dashboard',
    '/dog-breed',
    '/dogs',
    '/forgot-password',
    '/grievance-redressal-policy',
    '/login',
    '/orders',
    '/pet',
    '/pets',
    '/post-your-ads',
    '/privacy-policy',
    '/reset-password',
    '/return-and-refund-policy',
    '/shipping-policy',
    '/sign-up',
    '/term-of-use',
    '/terms-and-conditions',
    '/verify-otp'
  ];

  routes.forEach((route) => {
    it(`should successfully load page: ${route}`, () => {
      // Visit each route
      cy.visit(`${baseUrl}${route}`);

      // Verify page body renders and is visible
      cy.get('body').should('be.visible');
    });
  });
});