import { Tooltip } from "@humansignal/ui";
import { IconInfoOutline } from "@humansignal/icons";

type CardProps = {
  title: string;
  value: number | string;
  info: string;
};

const Card = ({ title, value, info }: CardProps) => {
  return (
    <div className="border border-neutral-border rounded-small p-base mb-base">
      <div className="flex flex-row gap-tighter items-center text-s text-neutral-content-subtler">
        {title}
        {info && (
          <Tooltip title={info}>
            <IconInfoOutline size={12} style={{ width: 16, height: 16 }} />
          </Tooltip>
        )}
      </div>
      <div className="text-headline-medium">{value}</div>
    </div>
  );
};

type Props = {
  values: CardProps[];
};

export const NumbersSummary = ({ values }: Props) => {
  return (
    <div className="flex flex-row gap-base">
      {values.map((value) => (
        <Card key={value.title} {...value} />
      ))}
    </div>
  );
};
