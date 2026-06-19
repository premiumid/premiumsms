import MarketingNav from '../../components/MarketingNav';

export const metadata = {
  title: 'Authentication - PremiumID',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <MarketingNav />
      {children}
    </>
  )
}
