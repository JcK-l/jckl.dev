import { Separator } from "../components/Separator";

export const BlueLayout = (content: any) => {
  return (
    <div>
      <Separator isUp={true} />

      <div className="-z-10 bg-primary text-white">{content.children}</div>

      <Separator isUp={false} />
    </div>
  );
};
