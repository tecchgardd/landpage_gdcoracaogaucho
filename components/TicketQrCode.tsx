'use client';
import Image from 'next/image';
import QRCode from 'qrcode';
import { useEffect, useState } from 'react';
export function TicketQrCode({ value }: { value: string }) { const [src, setSrc] = useState(''); useEffect(() => { QRCode.toDataURL(value, { width: 180, margin: 1 }).then(setSrc); }, [value]); return src ? <Image src={src} alt="QR Code do ingresso" width={180} height={180} className="mt-4 rounded-lg" unoptimized /> : <div className="mt-4 h-[180px] w-[180px] animate-pulse rounded-lg bg-black/10" />; }
