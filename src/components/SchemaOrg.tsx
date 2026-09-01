import React from 'react';
import { ToolDefinition } from '../types';

interface SchemaOrgProps {
  tool: ToolDefinition;
}

export const SchemaOrg: React.FC<SchemaOrgProps> = ({ tool }) => {
  const toolSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.name,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'SAR' },
    description: tool.shortDescription,
    url: `https://7allaha.xyz/#/tool/${tool.id}`,
    inLanguage: 'ar',
    keywords: tool.keywords.join(', '),
  };

  const faqSchema = tool.faqs?.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: tool.faqs.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: { '@type': 'Answer', text: f.answer },
        })),
      }
    : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
    </>
  );
};
