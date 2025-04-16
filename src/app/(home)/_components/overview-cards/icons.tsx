import { Clock, Globe2, MapPin, MapPinned } from "lucide-react";
import type { SVGProps } from "react";

type SVGPropsType = SVGProps<SVGSVGElement>;

export const Location = (props: React.SVGProps<SVGSVGElement>) => (
  <MapPin className="h-6 w-6 text-primary" {...props} />
);

export const Timezone = (props: React.SVGProps<SVGSVGElement>) => (
  <Clock className="h-6 w-6 text-primary" {...props} />
);

export const Coordinates = (props: React.SVGProps<SVGSVGElement>) => (
  <Globe2 className="h-6 w-6 text-primary" {...props} />
);
export const Pincode = (props: React.SVGProps<SVGSVGElement>) => (
  <MapPinned className="h-6 w-6 text-primary" {...props} />
);