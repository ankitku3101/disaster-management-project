import type { JSX, SVGProps } from "react";

type PropsType = {
  label: string;
  className?: string;
  data: {
    value: string;
  };
  Icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
};

export function OverviewCard({ label, data, Icon, className }: PropsType) {
  return (
    <div className={`${className} rounded-[10px] p-6 shadow-1`}>
      <Icon />

      <div className="mt-6">
        <dl>
          <dt className="mb-1.5 text-heading-6 font-bold text-dark">
            {data.value}
          </dt>

          <dd className="text-sm font-medium text-dark-6">{label}</dd>
        </dl>
      </div>
    </div>
  );
}
