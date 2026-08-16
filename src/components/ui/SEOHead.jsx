import { useEffect } from 'react';

/**
 * SEOHead component to dynamically manage document titles and meta descriptions per page.
 */
export default function SEOHead({ title, description }) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ARTHA AI CFO` : 'ARTHA AI — Enterprise Personal Finance & Autonomous AI CFO';
    document.title = fullTitle;

    if (description) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', description);
      }
    }
  }, [title, description]);

  return null;
}
