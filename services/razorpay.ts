export const openSelarCheckout = ({
  email,
  name,
  currency = 'NGN',
  baseUrl = 'https://selar.com/73518502d1'
}: {
  email: string;
  name?: string;
  currency?: string;
  baseUrl?: string;
}) => {
  const params = new URLSearchParams();
  params.set('quickcheckout', '1');
  if (email) params.set('email', email);
  if (name) params.set('fullname', name);
  if (currency) params.set('currency', currency);

  if (typeof window !== 'undefined') {
    const redirectUrl = `${window.location.origin}/checkout`;
    params.set('redirect_url', redirectUrl);
  }

  const checkoutUrl = `${baseUrl}?${params.toString()}`;
  window.open(checkoutUrl, '_blank');
};
