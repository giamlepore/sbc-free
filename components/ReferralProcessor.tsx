import { useEffect } from 'react';
import { useSession } from 'next-auth/react';

export function ReferralProcessor() {
  const { data: session } = useSession();

  useEffect(() => {
    const processReferral = async () => {
      const referralCode = localStorage.getItem('referralCode');
      
      if (session?.user?.id && referralCode && referralCode !== session.user.id) {
        try {
          await fetch('/api/process-referral', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: session.user.id,
              referralCode
            })
          });
          
          // Limpa o código após processamento
          localStorage.removeItem('referralCode');
        } catch (error) {
          console.error('Error processing referral:', error);
        }
      }
    };

    if (session?.user?.id) {
      processReferral();
    }
  }, [session]);

  return null;
}