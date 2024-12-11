import { PurchaseComplete } from '@/components/PurchaseComplete'
import { Metadata } from 'next'

export const metadata: Metadata = {
  robots: 'noindex, nofollow'
}

export default function PurchaseCompletePage() {
  return <PurchaseComplete />
}