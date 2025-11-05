export default function SectionContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </section>
  );
}
