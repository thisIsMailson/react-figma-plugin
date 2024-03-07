import React from "react";
import { ZipAssets } from "./ZipAssets";

type IAppProps = {
  pluginData?: {
    local?: {
      apiKey?: string;
    };
  };
};

export const App = ({ pluginData }: IAppProps) => {
  return (
    <div>
      {
        //@ts-ignore
        <ZipAssets data={pluginData} />
      }
    </div>
  );
};
