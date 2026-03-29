'use client';

import dynamic from 'next/dynamic';

const MouseDistortion = dynamic(() => import('./MouseDistortion'), { ssr: false });

export default function MouseDistortionLoader() {
    return <MouseDistortion />;
}
