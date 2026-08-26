import zhiLogo from "../../../../attached_assets/zhi_logoc_1787767684068.png";

export function CompanyLinks({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`flex items-center ${compact ? "justify-center gap-3" : "gap-4"}`}
      data-testid="company-links"
    >
      <a
        href="mailto:johnmichaelkuczynski@gmail.com"
        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        data-testid="link-contact-us"
      >
        Contact Us
      </a>
      <a
        href="https://zhisystems.ai/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Visit ZHI Systems"
        title="Visit ZHI Systems"
        className="inline-flex rounded-md border border-border bg-white p-1 shadow-sm transition-transform hover:scale-105"
        data-testid="link-zhi-systems"
      >
        <img
          src={zhiLogo}
          alt="ZHI Systems"
          className={compact ? "h-7 w-7 object-contain" : "h-8 w-8 object-contain"}
        />
      </a>
    </div>
  );
}