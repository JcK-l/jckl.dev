import { Separator } from "../components/Separator";

export const BlueLayout = (props: any) => {
  return (
    <div>
      <Separator isUp={true} />

      <div className="bg-primary text-white">{props.children}</div>

      <Separator isUp={false} />
    </div>
  );
};
