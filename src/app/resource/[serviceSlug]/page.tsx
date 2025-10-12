import React from 'react';
import { notFound } from 'next/navigation';
import { servicesData } from '@/data/services';
import type { Metadata } from 'next';
import ServiceLayout from '@/app/resource/services/ServiceLayout';

// ✅ Update: params is now a Promise
interface ServicePageProps {
  params: Promise<{
    serviceSlug: string;
  }>;
}

// Generate static paths for all services at build time
export async function generateStaticParams() {
  return Object.keys(servicesData).map((slug) => ({
    serviceSlug: slug,
  }));
}

// ✅ Update: await params before accessing properties
export async function generateMetadata(props: ServicePageProps): Promise<Metadata> {
  const params = await props.params; // Await the params Promise
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

// ✅ Update: Make component async and await params
export default async function ServicePage(props: ServicePageProps) {
  const params = await props.params; // Await the params Promise
  const serviceData = servicesData[params.serviceSlug];

  if (!serviceData) {
    notFound();
  }

  return <ServiceLayout serviceData={serviceData} />;
}
