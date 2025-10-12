import React from 'react';
import { notFound } from 'next/navigation';
// import ServiceLayout from '@/components/services/ServiceLayout';
import { servicesData } from '@/data/services';
import type { Metadata } from 'next';
import ServiceLayout from '@/app/resource/services/ServiceLayout';

interface ServicePageProps {
  params: {
    serviceSlug: string;
  };
}

// Generate static paths for all services at build time
export async function generateStaticParams() {
  return Object.keys(servicesData).map((slug) => ({
    serviceSlug: slug,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const serviceData = servicesData[params.serviceSlug];

  if (!serviceData) {
    return {
      title: 'Service Not Found',
    };
  }

  return {
    title: `${serviceData.heroSection.title} - Fydaa`,
    description: serviceData.heroSection.description,
  };
}

export default function ServicePage({ params }: ServicePageProps) {
  const serviceData = servicesData[params.serviceSlug];

  if (!serviceData) {
    notFound();
  }

  return <ServiceLayout serviceData={serviceData} />;
}
