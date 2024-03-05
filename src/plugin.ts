import { PluginDataManager } from "./pluginData";
import * as messages from "./messages";
import { NYTArticleSearchApi } from "./interfaces";

function main() {
  const selectedLayers = figma.currentPage.selection;
  // @ts-ignore
  const nodes = selectedLayers[0].children;
  figma.ui.postMessage({ type: messages.FRAME_ASSETS_ZIP, payload: { nodes } });
  console.log("nodes", nodes);
  figma.showUI(__html__, { width: 320, height: 250 });
  const pluginData = new PluginDataManager(figma);

  figma.ui.onmessage = (msg) => {
    console.log("msg", msg);
  };
}

main();
