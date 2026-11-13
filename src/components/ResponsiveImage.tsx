import React, { useState } from 'react';

interface AssetVariantMeta {
  stem: string;
  widths: number[];
  fallbackWidth: number;
  width: number;
  height: number;
}

const OPTIMIZED_ASSETS: Record<string, AssetVariantMeta> = {
  '/assets/aic_hero_addis_1793894081899.jpg': {
    stem: 'aic_hero_addis_1793894081899',
    widths: [480, 800, 1280],
    fallbackWidth: 800,
    width: 1376,
    height: 768
  },
  '/assets/aic_healthcare_medical_1794050066647.jpg': {
    stem: 'aic_healthcare_medical_1794050066647',
    widths: [480, 800, 1280],
    fallbackWidth: 800,
    width: 1376,
    height: 768
  },
  '/assets/aic_marine_cargo_port_1794050066638.jpg': {
    stem: 'aic_marine_cargo_port_1794050066638',
    widths: [480, 800, 1280],
    fallbackWidth: 800,
    width: 1376,
    height: 768
  },
  '/assets/aic_property_industrial_1794050067051.jpg': {
    stem: 'aic_property_industrial_1794050067051',
    widths: [480, 800, 1280],
    fallbackWidth: 800,
    width: 1376,
    height: 768
  },
  '/assets/aic_family_protection_1793894083687.jpg': {
    stem: 'aic_family_protection_1793894083687',
    widths: [480, 800, 1200],
    fallbackWidth: 800,
    width: 1200,
    height: 896
  },
  '/assets/aic_fleet_logistics_1793894083707.jpg': {
    stem: 'aic_fleet_logistics_1793894083707',
    widths: [480, 800, 1200],
    fallbackWidth: 800,
    width: 1200,
    height: 896
  },
  '/assets/city_traffic_alive.gif': {
    stem: 'city_traffic_poster',
    widths: [480, 800],
    fallbackWidth: 800,
    width: 800,
    height: 450
  },
  '/assets/city_traffic_poster.jpg': {
    stem: 'city_traffic_poster',
    widths: [480, 800],
    fallbackWidth: 800,
    width: 800,
    height: 450
  },
  '/assets/aic_logo.jpg': {
    stem: 'aic_logo',
    widths: [240, 480],
    fallbackWidth: 240,
    width: 480,
    height: 153
  }
};

export function getCategoryCoverImage(category?: string, customHeroImage?: string): string {
  if (customHeroImage && customHeroImage.trim().length > 0) {
    return customHeroImage;
  }
  switch (category) {
    case 'motor':
      return '/assets/aic_fleet_logistics_1793894083707.jpg';
    case 'property':
    case 'engineering':
      return '/assets/aic_property_industrial_1794050067051.jpg';
    case 'marine':
      return '/assets/aic_marine_cargo_port_1794050066638.jpg';
    case 'personal':
      return '/assets/aic_family_protection_1793894083687.jpg';
    default:
      return '/assets/aic_hero_addis_1793894081899.jpg';
  }
}

export function getPosterImageUrl(src: string): string {
  const meta = OPTIMIZED_ASSETS[src];
  if (!meta) return src;
  return `/assets/opt/${meta.stem}-${meta.fallbackWidth}w.webp`;
}

interface ResponsiveImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  pictureClassName?: string;
  onFallbackError?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
}

export const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  alt,
  sizes = '100vw',
  priority = false,
  className = '',
  pictureClassName = 'block w-full h-full',
  onFallbackError,
  width,
  height,
  ...rest
}) => {
  const [loaded, setLoaded] = useState(priority);
  const meta = OPTIMIZED_ASSETS[src];

  let webpSrcSet: string | undefined;
  let jpgSrcSet: string | undefined;
  let fallbackSrc = src;

  if (meta) {
    webpSrcSet = meta.widths.map((w) => `/assets/opt/${meta.stem}-${w}w.webp ${w}w`).join(', ');
    jpgSrcSet = meta.widths.map((w) => `/assets/opt/${meta.stem}-${w}w.jpg ${w}w`).join(', ');
    fallbackSrc = `/assets/opt/${meta.stem}-${meta.fallbackWidth}w.jpg`;
  } else if (src.includes('images.unsplash.com/')) {
    const cleanBase = src.split('?')[0];
    webpSrcSet = `${cleanBase}?w=96&h=96&fit=crop&auto=format&fm=webp&q=72 96w, ${cleanBase}?w=192&h=192&fit=crop&auto=format&fm=webp&q=75 192w`;
    jpgSrcSet = `${cleanBase}?w=96&h=96&fit=crop&auto=format&q=72 96w, ${cleanBase}?w=192&h=192&fit=crop&auto=format&q=75 192w`;
    fallbackSrc = `${cleanBase}?w=96&h=96&fit=crop&auto=format&q=75`;
  }

  return (
    <picture className={pictureClassName}>
      {webpSrcSet && <source type="image/webp" srcSet={webpSrcSet} sizes={sizes} />}
      {jpgSrcSet && <source type="image/jpeg" srcSet={jpgSrcSet} sizes={sizes} />}
      <img
        src={fallbackSrc}
        srcSet={jpgSrcSet}
        sizes={sizes}
        alt={alt}
        width={width ?? meta?.width}
        height={height ?? meta?.height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        onLoad={() => setLoaded(true)}
        onError={(e) => {
          setLoaded(true);
          if (onFallbackError) {
            onFallbackError(e);
          } else if (meta && e.currentTarget.dataset.origRetried !== '1') {
            e.currentTarget.dataset.origRetried = '1';
            e.currentTarget.removeAttribute('srcset');
            e.currentTarget.src = src;
          }
        }}
        className={`${className} ${
          priority ? '' : `transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`
        }`}
        {...rest}
      />
    </picture>
  );
};
