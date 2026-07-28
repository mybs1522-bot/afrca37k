export const openSelarCheckout = ({
  email,
  name,
}: {
  email: string;
  name?: string;
}) => {
  const baseUrl = 'https://selar.com/73518502d1';
  const params = new URLSearchParams();
  params.set('quickcheckout', '1');
  if (email) params.set('email', email);
  if (name) params.set('fullname', name);
  
  const checkoutUrl = `${baseUrl}?${params.toString()}`;
  window.open(checkoutUrl, '_blank');
};
