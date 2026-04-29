import OrderClient from './OrderClient';

export function generateStaticParams() {
  return [{ id: '1' }]; // Dummy ID for build process
}

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return <OrderClient params={params} />;
}
