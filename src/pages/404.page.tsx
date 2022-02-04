import { useEffect } from 'react';
import { useRouter } from 'next/router';

function NotFoundPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

// eslint-disable-next-line import/no-default-export
export default NotFoundPage;
