type CrestOnBrandProps = {
  className?: string;
  alt: string;
};

export default function CrestOnBrand({ className = '', alt }: CrestOnBrandProps) {
  return (
    <span className={`crest-on-brand relative block shrink-0 aspect-[320/289] ${className}`}>
      <img
        src="/images/kab-smg-logo.webp"
        alt={alt}
        className="crest-on-brand__shield"
      />
      <img
        src="/images/kab-smg-logo.webp"
        alt=""
        aria-hidden="true"
        className="crest-on-brand__motto"
      />
    </span>
  );
}
